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

import { fetchStatic, load, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const FEED_URL = 'https://www.camtic.org/feed/';

interface Nota {
  titulo: string;
  url: string;
  pubDate?: string;
}

async function fetchNotas(): Promise<Nota[]> {
  const xml = await fetchStatic(FEED_URL);
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

export async function scrapeCamtic(): Promise<ScraperReport> {
  const report = emptyReport('camtic');

  let notas: Nota[] = [];
  try {
    notas = await fetchNotas();
    report.fetched = notas.length;
  } catch (err) {
    report.notes.push(`Error fetch RSS CAMTIC: ${(err as Error).message}`);
    return report;
  }

  const relevantes = notas.filter(
    (n) => mentionsAI(n.titulo) || /23\.771|23\.919|24\.484|regulaci[oó]n|ley.*ia/i.test(n.titulo),
  );
  report.matched = relevantes.length;

  if (relevantes.length === 0) {
    report.notes.push(`Ninguna de las ${notas.length} notas recientes de CAMTIC menciona IA o los expedientes IA.`);
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
