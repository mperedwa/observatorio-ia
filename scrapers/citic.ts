/**
 * Scraper CITIC-UCR (citic.ucr.ac.cr).
 *
 * Estrategia: lee el feed RSS oficial (https://citic.ucr.ac.cr/rss.xml).
 * El CITIC ya cataloga 1 proyecto IA (`ucr-citic-ia-software`) y participa
 * en el proyecto Erasmus+ CIOdD (ético-IA). Sus comunicados son la mejor
 * señal temprana de nuevas alianzas, papers o convocatorias relevantes.
 *
 * Filtra por keywords IA, ética IA, machine learning, y nombres de
 * proyectos catalogados para detectar actualizaciones.
 *
 * Política editorial intacta: solo deja candidatos para revisión humana.
 */

import { fetchStatic, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const FEED_URL = 'https://citic.ucr.ac.cr/rss.xml';

const UCR_KEYWORDS = [
  'inteligencia artificial',
  'machine learning',
  'ethical ai',
  '\u00e9tica',
  'ciencia de datos',
  'data science',
  'algoritm',
  'predictiv',
  'erasmus',
  'ciodd',
  'computaci\u00f3n cu\u00e1ntica',
  'software inteligente',
  'ia software',
  'modelo de lenguaje',
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
  return UCR_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}

export async function scrapeCitic(): Promise<ScraperReport> {
  const report = emptyReport('citic');

  let items: RssItem[] = [];
  try {
    const xml = await fetchStatic(FEED_URL, { timeout: 20000 });
    items = parseFeed(xml);
    report.fetched = items.length;
    report.notes.push(`Fetch RSS CITIC (${items.length} items en feed).`);
  } catch (err) {
    report.notes.push(`Error fetch RSS CITIC: ${(err as Error).message}`);
    return report;
  }

  const relevantes = items.filter(isRelevant);
  report.matched = relevantes.length;

  if (relevantes.length === 0) {
    report.notes.push(
      `Ninguno de los ${items.length} items del feed CITIC menciona IA, ética IA, machine learning o proyectos catalogados.`,
    );
    return report;
  }

  for (const it of relevantes.slice(0, 10)) {
    report.candidates.push({ titulo: it.titulo, url: it.url });
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeCitic()
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
