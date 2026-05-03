/**
 * Scraper CAMTIC (camtic.org).
 *
 * Estrategia: usa la WordPress REST API en lugar del feed RSS.
 * El feed RSS funciona desde IPs costarricenses pero devuelve XML
 * vacío (sin <item>) desde IPs de GitHub Actions, posiblemente por
 * cache/CDN o por algún plugin que sirve feed minimal a clientes
 * anónimos no-CR. La REST API no tiene ese problema y devuelve JSON
 * directo con todos los campos necesarios.
 *
 * NO modifica datos directamente; solo anota hallazgos para revisión
 * humana en el PR (similar a MICITT).
 */

import { fetchStatic, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const API_URL = 'https://www.camtic.org/wp-json/wp/v2/posts?per_page=20&_fields=id,date,link,title,excerpt';

interface WpPost {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
}

interface Nota {
  titulo: string;
  url: string;
  fecha?: string;
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '')
    .trim();
}

async function fetchNotas(): Promise<Nota[]> {
  const json = await fetchStatic(API_URL);
  const posts = JSON.parse(json) as WpPost[];
  return posts.map((p) => ({
    titulo: decodeHtmlEntities(p.title.rendered),
    url: p.link,
    fecha: p.date,
  }));
}

export async function scrapeCamtic(): Promise<ScraperReport> {
  const report = emptyReport('camtic');

  let notas: Nota[] = [];
  try {
    notas = await fetchNotas();
    report.fetched = notas.length;
    report.notes.push(`Fetch via WordPress REST API (${notas.length} posts).`);
  } catch (err) {
    report.notes.push(`Error fetch REST API CAMTIC: ${(err as Error).message}`);
    return report;
  }

  const relevantes = notas.filter(
    (n) => mentionsAI(n.titulo) || /23\.771|23\.919|24\.484|regulaci[oó]n|ley.*ia/i.test(n.titulo),
  );
  report.matched = relevantes.length;

  if (relevantes.length === 0) {
    report.notes.push(`Ninguno de los ${notas.length} posts CAMTIC menciona IA o los expedientes IA.`);
    return report;
  }

  for (const n of relevantes.slice(0, 10)) {
    report.candidates.push({ titulo: n.titulo, url: n.url });
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
