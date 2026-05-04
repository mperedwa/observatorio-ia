/**
 * Scraper Ministerio de Hacienda (hacienda.go.cr) — Tier B.
 *
 * Estrategia: el sitio rechaza fetch/curl con `400 Bad Request` aún con
 * todos los headers de Chrome. El WAF parece exigir JS execution + cookies
 * de sesión. Probamos con Playwright headless (Chromium real).
 *
 * Si Playwright también falla (sin browsers instalados, o WAF detecta
 * automation), el scraper retorna 0 fetched con nota explicativa y NO
 * aborta el run. La cobertura de Hacienda queda cubierta por
 * `google-news.ts` (Tier B principal).
 *
 * Política editorial intacta: solo deja candidatos para revisión humana.
 */

import { fetchWithBrowser, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const HOME_URL = 'https://www.hacienda.go.cr/';
const NEWS_URL = 'https://www.hacienda.go.cr/noticias';

const HACIENDA_KEYWORDS = [
  'inteligencia',
  'tribu-cr',
  'tribu cr',
  'atena',
  'fraude',
  'evasi\u00f3n',
  'algoritm',
  'predict',
  'machine learning',
  'datos abiertos',
  'modelo',
  'sinpe',
  'facturaci\u00f3n electr\u00f3nica',
  'an\u00e1lisis tributario',
];

interface Nota {
  titulo: string;
  url: string;
}

function isRelevant(titulo: string): boolean {
  if (mentionsAI(titulo)) return true;
  const lower = titulo.toLowerCase();
  return HACIENDA_KEYWORDS.some((k) => lower.includes(k));
}

function extractLinks(html: string, base: string): Nota[] {
  // Hacienda probable Drupal o ASP.NET; capturamos cualquier <a> con href de noticia
  // y texto descriptivo. Filtramos navegación e iconos.
  const re = /<a[^>]+href="([^"#?]+)"[^>]*>([^<]{8,200})<\/a>/g;
  const seen = new Set<string>();
  const out: Nota[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const href = m[1] ?? '';
    const titulo = (m[2] ?? '').trim();
    if (!href || !titulo) continue;
    if (/^(home|inicio|leer m\u00e1s|m\u00e1s|ver|men\u00fa|men\u00fa)$/i.test(titulo)) continue;
    if (titulo.length < 15) continue;
    let absUrl: string;
    try {
      absUrl = new URL(href, base).toString();
    } catch {
      continue;
    }
    if (!absUrl.includes('hacienda.go.cr')) continue;
    if (seen.has(absUrl)) continue;
    seen.add(absUrl);
    out.push({ titulo, url: absUrl });
  }
  return out;
}

export async function scrapeHacienda(): Promise<ScraperReport> {
  const report = emptyReport('hacienda');

  let html = '';
  let usedUrl = '';
  for (const url of [NEWS_URL, HOME_URL]) {
    try {
      html = await fetchWithBrowser(url, { waitFor: 'body', timeout: 25000 });
      usedUrl = url;
      report.notes.push(`Playwright OK contra ${url}.`);
      break;
    } catch (err) {
      report.notes.push(`Playwright falló contra ${url}: ${(err as Error).message}`);
    }
  }

  if (!html) {
    report.notes.push(
      'Hacienda inaccesible vía Playwright. WAF demasiado estricto. Cobertura via google-news (queries Hacienda+IA).',
    );
    return report;
  }

  const notas = extractLinks(html, usedUrl);
  report.fetched = notas.length;

  if (notas.length === 0) {
    report.notes.push('Sin enlaces útiles en HTML de Hacienda; revisar selectores.');
    return report;
  }

  const relevantes = notas.filter((n) => isRelevant(n.titulo));
  report.matched = relevantes.length;

  if (relevantes.length === 0) {
    report.notes.push(
      `Ninguno de los ${notas.length} enlaces extraídos menciona IA, TRIBU-CR, Atena, fraude o keywords tributarias.`,
    );
    return report;
  }

  for (const n of relevantes.slice(0, 10)) {
    report.candidates.push({ titulo: n.titulo, url: n.url });
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeHacienda()
    .then(async (report) => {
      console.log(summarize(report));
      const file = writeReport(report);
      console.log(`Reporte: ${file}`);
      if (report.notes.length) {
        console.log('Notas:');
        report.notes.forEach((n) => console.log(`  - ${n}`));
      }
      if (report.candidates.length) {
        console.log('Candidatos:');
        report.candidates.forEach((c) => console.log(`  - ${c.titulo} → ${c.url}`));
      }
      await closeBrowser();
    })
    .catch(async (err) => {
      console.error('Scraper falló:', err);
      await closeBrowser();
      process.exit(1);
    });
}
