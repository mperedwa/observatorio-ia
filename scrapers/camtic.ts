/**
 * Scraper CAMTIC (camtic.org).
 *
 * Estrategia: lee el listado de publicaciones recientes del WordPress de
 * CAMTIC y filtra por menciones a IA o referencias a los expedientes
 * legislativos en trámite. CAMTIC es voz del sector privado tech y suele
 * adelantar reacciones a movimientos legislativos.
 *
 * NO modifica datos directamente; solo anota hallazgos para revisión
 * humana en el PR (similar a MICITT).
 */

import { fetchStatic, fetchWithBrowser, load, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const NEWS_URL = 'https://www.camtic.org/category/noticias/';

interface Nota {
  titulo: string;
  url: string;
}

async function fetchNotas(): Promise<Nota[]> {
  let html: string;
  try {
    html = await fetchStatic(NEWS_URL);
  } catch {
    html = await fetchWithBrowser(NEWS_URL, { waitFor: 'body', timeout: 30000 });
  }
  const $ = load(html);
  const notas: Nota[] = [];
  const candidates = $('article h2 a, .post-title a, h2.entry-title a').toArray();
  const seen = new Set<string>();
  for (const el of candidates) {
    const $a = $(el);
    const href = $a.attr('href');
    const titulo = $a.text().trim();
    if (!href || !titulo || titulo.length < 8) continue;
    const url = href.startsWith('http') ? href : new URL(href, NEWS_URL).toString();
    if (seen.has(url)) continue;
    seen.add(url);
    notas.push({ titulo, url });
  }
  return notas;
}

export async function scrapeCamtic(): Promise<ScraperReport> {
  const report = emptyReport('camtic');

  let notas: Nota[] = [];
  try {
    notas = await fetchNotas();
    report.fetched = notas.length;
  } catch (err) {
    report.notes.push(`Error fetch listado CAMTIC: ${(err as Error).message}`);
    return report;
  }

  const relevantes = notas.filter(
    (n) => mentionsAI(n.titulo) || /23\.771|23\.919|24\.484|regulación|ley.*ia/i.test(n.titulo),
  );
  report.matched = relevantes.length;

  if (relevantes.length === 0) {
    report.notes.push('Ninguna nota CAMTIC reciente menciona IA o los expedientes IA.');
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
