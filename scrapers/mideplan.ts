/**
 * Scraper MIDEPLAN (mideplan.go.cr) — Tier C.
 *
 * Estrategia: el sitio es Drupal sin RSS público, pero el listado HTML
 * `/listado-noticias` expone noticias con `<h2>` titulares directamente.
 *
 * Útil para detectar:
 *  - Plan Nacional de Desarrollo y mención a IA / transformación digital.
 *  - Indicadores de modernización del Estado.
 *  - Cooperación internacional (UE, BID, BM) en proyectos digitales.
 *
 * Política editorial intacta: solo deja candidatos para revisión humana.
 */

import { fetchStatic, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const BASE = 'https://www.mideplan.go.cr';
const LISTING = `${BASE}/listado-noticias`;
const PAGES = 2; // ~20 notas recientes (Drupal pagina cada 10)

const MIDEPLAN_KEYWORDS_SUBSTRING = [
  'inteligencia',
  'transformaci\u00f3n digital',
  'gobierno digital',
  'modernizaci\u00f3n del estado',
  'datos abiertos',
  'innovaci\u00f3n digital',
  'plan nacional de desarrollo',
  'algoritm',
  'cooperaci\u00f3n bid',
  'cooperaci\u00f3n banco mundial',
];

const MIDEPLAN_KEYWORDS_WORD = ['PNDIP', 'ENIA', 'TIC', 'TICs'];

interface Nota {
  titulo: string;
  url: string;
}

function parseListing(html: string): Nota[] {
  // Drupal Views: cada nota va en `<div class="item-noticias views-row">` con
  // `<h2>titulo</h2>` y un `<a href="/slug">` dentro del mismo bloque.
  const out: Nota[] = [];
  const seen = new Set<string>();
  const cardRe = /<div\s+class="item-noticias views-row"[^>]*>([\s\S]*?)(?=<div\s+class="item-noticias views-row"|<\/section|<footer)/g;
  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html)) !== null) {
    const block = m[1] ?? '';
    const h2 = block.match(/<h2[^>]*>([^<]{8,250})<\/h2>/);
    const a = block.match(/<a[^>]+href="(\/[^"#]+)"/);
    if (!h2 || !a) continue;
    const titulo = (h2[1] ?? '').replace(/\s+/g, ' ').trim();
    const href = a[1] ?? '';
    if (!titulo || !href) continue;
    let absUrl: string;
    try {
      absUrl = new URL(href, BASE).toString();
    } catch {
      continue;
    }
    if (seen.has(absUrl)) continue;
    seen.add(absUrl);
    out.push({ titulo, url: absUrl });
  }
  return out;
}

function isRelevant(titulo: string): boolean {
  if (mentionsAI(titulo)) return true;
  const lower = titulo.toLowerCase();
  if (MIDEPLAN_KEYWORDS_SUBSTRING.some((k) => lower.includes(k))) return true;
  for (const k of MIDEPLAN_KEYWORDS_WORD) {
    if (new RegExp(`\\b${k}\\b`, 'i').test(titulo)) return true;
  }
  return false;
}

export async function scrapeMideplan(): Promise<ScraperReport> {
  const report = emptyReport('mideplan');
  const allNotas: Nota[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < PAGES; i++) {
    const url = i === 0 ? LISTING : `${LISTING}?page=${i}`;
    try {
      const html = await fetchStatic(url, { timeout: 20000 });
      const notas = parseListing(html);
      for (const n of notas) {
        if (seen.has(n.url)) continue;
        seen.add(n.url);
        allNotas.push(n);
      }
    } catch (err) {
      report.notes.push(`Error page ${i}: ${(err as Error).message}`);
    }
  }

  report.fetched = allNotas.length;
  if (allNotas.length === 0) {
    report.notes.push('Listado MIDEPLAN no devolvió ítems (revisar selector).');
    return report;
  }

  const relevantes = allNotas.filter((n) => isRelevant(n.titulo));
  report.matched = relevantes.length;

  if (relevantes.length === 0) {
    report.notes.push(
      `Ninguna de las ${allNotas.length} notas recientes de MIDEPLAN menciona IA, transformación digital, modernización o keywords PNDIP.`,
    );
    return report;
  }

  for (const n of relevantes.slice(0, 10)) {
    report.candidates.push({ titulo: n.titulo, url: n.url });
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeMideplan()
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
