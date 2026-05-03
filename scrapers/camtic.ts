/**
 * Scraper CAMTIC (camtic.org).
 *
 * Estrategia: lee el feed RSS de CAMTIC (más estable que parsear HTML
 * de su WordPress, que reorganiza categorías con frecuencia) y filtra
 * por menciones a IA o referencias a los expedientes legislativos.
 * CAMTIC es voz del sector privado tech y suele adelantar reacciones
 * a movimientos legislativos.
 *
 * NO modifica datos directamente; solo anota hallazgos para revisión
 * humana en el PR (similar a MICITT).
 */

import { fetchStatic, fetchWithBrowser, load, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const FEED_URL = 'https://www.camtic.org/feed/';

interface Nota {
  titulo: string;
  url: string;
  pubDate?: string;
}

function parseRssItems(xml: string): Nota[] {
  const $ = load(xml, { xmlMode: true });
  const notas: Nota[] = [];
  $('item').each((_, item) => {
    const $item = $(item);
    const titulo = $item.find('title').first().text().trim();
    const url = $item.find('link').first().text().trim();
    const pubDate = $item.find('pubDate').first().text().trim();
    if (titulo && url) notas.push({ titulo, url, pubDate });
  });
  return notas;
}

async function fetchNotas(): Promise<{ notas: Nota[]; method: string; xmlSize: number }> {
  // Intento 1: fetch directo (rápido)
  let xml = await fetchStatic(FEED_URL);
  let notas = parseRssItems(xml);
  if (notas.length > 0) return { notas, method: 'fetch', xmlSize: xml.length };

  // Intento 2: Playwright headless (puede burlar bloqueos por User-Agent o JS challenge)
  xml = await fetchWithBrowser(FEED_URL, { timeout: 30000 });
  notas = parseRssItems(xml);
  return { notas, method: 'browser', xmlSize: xml.length };
}

export async function scrapeCamtic(): Promise<ScraperReport> {
  const report = emptyReport('camtic');

  let result: { notas: Nota[]; method: string; xmlSize: number };
  try {
    result = await fetchNotas();
    report.fetched = result.notas.length;
    report.notes.push(`Fetch via ${result.method} (XML ${result.xmlSize}B, ${result.notas.length} items).`);
  } catch (err) {
    report.notes.push(`Error fetch RSS CAMTIC: ${(err as Error).message}`);
    return report;
  }

  const { notas } = result;
  const relevantes = notas.filter(
    (n) => mentionsAI(n.titulo) || /23\.771|23\.919|24\.484|regulaci[oó]n|ley.*ia/i.test(n.titulo),
  );
  report.matched = relevantes.length;

  if (relevantes.length === 0) {
    report.notes.push(`Ninguna de las ${notas.length} notas CAMTIC menciona IA o los expedientes IA.`);
    return report;
  }

  for (const n of relevantes.slice(0, 10)) {
    report.notes.push(`Candidato CAMTIC: ${n.titulo} → ${n.url}`);
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeCamtic()
    .then(async (report) => {
      console.log(summarize(report));
      const file = writeReport(report);
      console.log(`Reporte: ${file}`);
      if (report.notes.length) {
        console.log('Notas:');
        report.notes.forEach((n) => console.log(`  - ${n}`));
      }
      await closeBrowser();
    })
    .catch(async (err) => {
      console.error('Scraper falló:', err);
      await closeBrowser();
      process.exit(1);
    });
}
