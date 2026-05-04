/**
 * Scraper Delfino.cr (delfino.cr).
 *
 * Estrategia: lee el feed RSS público (https://delfino.cr/feed) y filtra
 * por menciones a IA o instituciones costarricenses cubiertas por el
 * observatorio. Es la fuente editorial más rápida cuando MICITT/CCSS/Hacienda
 * tardan días en publicar comunicados oficiales.
 *
 * Política editorial intacta: solo deja candidatos para revisión humana.
 * Delfino es prensa, no fuente oficial — los candidatos no van directo al
 * catálogo, requieren validación contra fuente primaria antes de cualquier
 * `add` o `update`.
 */

import { fetchStatic, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const FEED_URL = 'https://delfino.cr/feed';

const GOV_KEYWORDS = [
  'micitt',
  'ccss',
  'hacienda',
  'mep',
  'poder judicial',
  'asamblea',
  'enia',
  'casa presidencial',
  'cenat',
  'tribu-cr',
  'tribu cr',
  'sinpe',
  'edus',
  'lidia',
  'aida',
  'expediente 23.771',
  'expediente 23.919',
  'expediente 24.484',
  'gobierno digital',
  'transformaci\u00f3n digital',
];

interface RssItem {
  titulo: string;
  url: string;
  fecha?: string;
  descripcion?: string;
}

function decodeHtml(s: string): string {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function parseFeed(xml: string): RssItem[] {
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  const out: RssItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1] ?? '';
    const titulo = decodeHtml((block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '').trim());
    const url = (block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? '').trim();
    const fecha = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? '').trim() || undefined;
    const descripcion = decodeHtml(block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? '').trim() || undefined;
    if (titulo && url) out.push({ titulo, url, fecha, descripcion });
  }
  return out;
}

function isRelevant(item: RssItem): boolean {
  const blob = `${item.titulo} ${item.descripcion ?? ''}`;
  if (mentionsAI(blob)) return true;
  const lower = blob.toLowerCase();
  return GOV_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}

export async function scrapeDelfino(): Promise<ScraperReport> {
  const report = emptyReport('delfino');

  let items: RssItem[] = [];
  try {
    const xml = await fetchStatic(FEED_URL, { timeout: 20000 });
    items = parseFeed(xml);
    report.fetched = items.length;
    report.notes.push(`Fetch RSS Delfino (${items.length} items en feed).`);
  } catch (err) {
    report.notes.push(`Error fetch RSS Delfino: ${(err as Error).message}`);
    return report;
  }

  const relevantes = items.filter(isRelevant);
  report.matched = relevantes.length;

  if (relevantes.length === 0) {
    report.notes.push(
      `Ninguno de los ${items.length} items del feed Delfino menciona IA o instituciones gov catalogadas.`,
    );
    return report;
  }

  for (const it of relevantes.slice(0, 10)) {
    report.candidates.push({ titulo: it.titulo, url: it.url });
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeDelfino()
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
