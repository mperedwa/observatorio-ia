/**
 * Scraper Poder Judicial (pj.poder-judicial.go.cr).
 *
 * Estrategia: lee la Sala de Prensa (Joomla, categoría 8) paginando con `start=N`
 * y extrae títulos desde los slugs de URL. La estructura `<title>` del feed RSS
 * de Joomla viene vacía, así que parseamos el HTML directamente.
 *
 * Filtra por menciones IA, automatización judicial, chatbot, anonimización,
 * tipificación, Giro Continuo, Nymiz y nombres de proyectos ya catalogados.
 *
 * Política editorial intacta: solo deja candidatos para revisión humana.
 */

import { fetchStatic, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const BASE = 'https://pj.poder-judicial.go.cr';
const LISTING = `${BASE}/index.php/component/content/category/8-sala-de-prensa?Itemid=409`;
const PAGES = 4; // 4 páginas × 5 items = ~20 noticias recientes

// Keywords adicionales específicas a IA judicial / proyectos catalogados
const PJ_KEYWORDS = [
  'inteligencia',
  'chatbot',
  'automa',
  'anonim',
  'tipifica',
  'giro continuo',
  'nymiz',
  'sala constitucional',
  'expediente electrón',
  'machine',
  'algoritm',
  'predict',
  'datos abiertos',
];

interface Nota {
  id: string;
  slug: string;
  url: string;
}

function parseListing(html: string): Nota[] {
  const re = /href="\/index\.php\/component\/content\/article\/(\d+)-([^"?]+)\?[^"]*"/g;
  const seen = new Set<string>();
  const out: Nota[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const id = m[1];
    const slug = m[2];
    if (!id || !slug) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, slug, url: `${BASE}/index.php/component/content/article/${id}-${slug}?catid=8&Itemid=409` });
  }
  return out;
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function isRelevant(slugTitle: string): boolean {
  if (mentionsAI(slugTitle)) return true;
  const lower = slugTitle.toLowerCase();
  return PJ_KEYWORDS.some((k) => lower.includes(k));
}

export async function scrapePJ(): Promise<ScraperReport> {
  const report = emptyReport('pj');
  const all: Nota[] = [];

  for (let i = 0; i < PAGES; i++) {
    const start = i * 5;
    const url = `${LISTING}&start=${start}`;
    try {
      const html = await fetchStatic(url, { timeout: 20000 });
      const items = parseListing(html);
      for (const it of items) {
        if (!all.some((a) => a.id === it.id)) all.push(it);
      }
    } catch (err) {
      report.notes.push(`Error page start=${start}: ${(err as Error).message}`);
    }
  }

  report.fetched = all.length;
  if (all.length === 0) {
    report.notes.push('Sala de Prensa no devolvió ítems (verificar selector o WAF).');
    return report;
  }

  const relevantes = all.filter((n) => isRelevant(slugToTitle(n.slug)));
  report.matched = relevantes.length;

  if (relevantes.length === 0) {
    report.notes.push(
      `Ninguna de las ${all.length} notas recientes de Sala de Prensa menciona IA, chatbot, automatización, tipificación, Giro Continuo o Nymiz.`,
    );
    return report;
  }

  for (const n of relevantes.slice(0, 10)) {
    report.candidates.push({ titulo: slugToTitle(n.slug), url: n.url });
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapePJ()
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
