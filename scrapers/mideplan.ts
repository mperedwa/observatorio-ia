/**
 * Scraper MIDEPLAN (mideplan.go.cr) — Tier C.
 *
 * Estrategia: intentar primero el listado oficial de Drupal. Cuando el WAF
 * responde 403, usar Google News exclusivamente como canal de descubrimiento
 * y conservar solo enlaces cuya URL final pertenezca a mideplan.go.cr.
 *
 * Útil para detectar:
 *  - Plan Nacional de Desarrollo y mención a IA / transformación digital.
 *  - Indicadores de modernización del Estado.
 *  - Cooperación internacional (UE, BID, BM) en proyectos digitales.
 *
 * Política editorial intacta: solo deja candidatos para revisión humana.
 */

import { fetchStatic, mentionsAI, closeBrowser } from './lib/source';
import { resolveGoogleNewsUrl } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';
import { buildGoogleNewsUrl, parseGoogleNewsFeed } from './google-news';

const BASE = 'https://www.mideplan.go.cr';
const LISTING = `${BASE}/listado-noticias`;
const PAGES = 2; // ~20 notas recientes (Drupal pagina cada 10)
const FALLBACK_QUERIES = [
  'site:mideplan.go.cr ("inteligencia artificial" OR algoritmo OR "transformación digital") when:180d',
  'site:mideplan.go.cr (PNDIP OR "modernización del Estado" OR "gobierno digital") when:180d',
];
const FALLBACK_MAX_PER_QUERY = 5;

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

export interface Nota {
  titulo: string;
  url: string;
}

export function parseMideplanListing(html: string): Nota[] {
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

export function isOfficialMideplanUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    return hostname === 'mideplan.go.cr' || hostname.endsWith('.mideplan.go.cr');
  } catch {
    return false;
  }
}

interface MideplanDeps {
  fetchHtml: typeof fetchStatic;
  resolveNewsUrl: typeof resolveGoogleNewsUrl;
}

interface FallbackResult {
  notas: Nota[];
  fetched: number;
  resolved: number;
  notes: string[];
}

async function discoverOfficialMideplanNews(
  deps: MideplanDeps,
): Promise<FallbackResult> {
  const notas: Nota[] = [];
  const seen = new Set<string>();
  const notes: string[] = [];
  let fetched = 0;
  let resolved = 0;

  for (const query of FALLBACK_QUERIES) {
    try {
      const xml = await deps.fetchHtml(buildGoogleNewsUrl(query), { timeout: 20000 });
      const items = parseGoogleNewsFeed(xml);
      fetched += items.length;

      for (const item of items.slice(0, FALLBACK_MAX_PER_QUERY)) {
        const finalUrl = await deps.resolveNewsUrl(item.url);
        if (!isOfficialMideplanUrl(finalUrl)) continue;
        resolved++;
        if (seen.has(finalUrl)) continue;
        seen.add(finalUrl);
        notas.push({ titulo: item.titulo, url: finalUrl });
      }
    } catch (err) {
      notes.push(`Error en respaldo de descubrimiento: ${(err as Error).message}`);
    }
  }

  return { notas, fetched, resolved, notes };
}

export async function scrapeMideplan(
  overrides: Partial<MideplanDeps> = {},
): Promise<ScraperReport> {
  const deps: MideplanDeps = {
    fetchHtml: overrides.fetchHtml ?? fetchStatic,
    resolveNewsUrl: overrides.resolveNewsUrl ?? resolveGoogleNewsUrl,
  };
  const report = emptyReport('mideplan');
  const allNotas: Nota[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < PAGES; i++) {
    const url = i === 0 ? LISTING : `${LISTING}?page=${i}`;
    try {
      const html = await deps.fetchHtml(url, { timeout: 20000 });
      const notas = parseMideplanListing(html);
      for (const n of notas) {
        if (seen.has(n.url)) continue;
        seen.add(n.url);
        allNotas.push(n);
      }
    } catch (err) {
      report.notes.push(`Error page ${i}: ${(err as Error).message}`);
    }
  }

  if (allNotas.length === 0) {
    report.notes.push(
      'El listado oficial de MIDEPLAN no fue accesible o no devolvió ítems; se activó el respaldo de descubrimiento.',
    );
    const fallback = await discoverOfficialMideplanNews(deps);
    report.fetched = fallback.fetched;
    report.notes.push(...fallback.notes);
    report.notes.push(
      `Respaldo Google News: ${fallback.resolved} enlaces resueltos al dominio oficial mideplan.go.cr.`,
    );
    allNotas.push(...fallback.notas);
  } else {
    report.fetched = allNotas.length;
  }

  if (allNotas.length === 0) {
    report.notes.push('No se recuperaron noticias oficiales de MIDEPLAN por ninguna vía.');
    return report;
  }

  // En el canal directo validamos keywords contra el titular. En el respaldo,
  // las queries ya son deliberadamente estrechas y toda URL final fue validada
  // contra el dominio oficial; el LLM y la revisión humana filtran después.
  const usingFallback = report.notes.some((note) => note.includes('respaldo de descubrimiento'));
  const relevantes = usingFallback ? allNotas : allNotas.filter((n) => isRelevant(n.titulo));
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

  if (usingFallback && report.candidates.length > 0) {
    report.notes.push(
      'Google News solo descubrió los enlaces; los candidatos conservados apuntan a páginas oficiales de MIDEPLAN y siguen sujetos a revisión editorial.',
    );
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
