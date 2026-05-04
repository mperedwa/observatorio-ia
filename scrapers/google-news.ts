/**
 * Scraper Google News RSS (Tier B).
 *
 * Estrategia: corre múltiples queries en `news.google.com/rss/search` para
 * cubrir instituciones que bloquean acceso directo:
 *  - CCSS: firewall geográfico bloquea IPs no-CR.
 *  - Hacienda: WAF estricto rechaza fetch/curl.
 *  - CENAT/LaNIA: sitio sin feed ni sección de noticias.
 *
 * Google News agrega prensa CR (La Nación, El Financiero, crhoy, El Observador,
 * Diario Extra, Semanario Universidad, La Teja, monumental.co.cr, Revista SUMMA,
 * tec.ac.cr, etc.). Devuelve 200 OK desde cualquier IP, sin auth.
 *
 * Política editorial intacta: Google News es agregador de prensa, no fuente
 * oficial. Los candidatos exigen validación contra fuente primaria antes de
 * cualquier `add` o `update` al catálogo. Solo deja candidatos.
 */

import { fetchStatic, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

interface NewsQuery {
  institucion: string;
  query: string;
}

const QUERIES: NewsQuery[] = [
  { institucion: 'ccss', query: '"CCSS" inteligencia artificial Costa Rica' },
  { institucion: 'hacienda', query: 'Hacienda inteligencia artificial Costa Rica' },
  { institucion: 'cenat', query: 'CENAT OR LaNIA inteligencia artificial Costa Rica' },
];

const MAX_PER_QUERY = 6;
const MAX_TOTAL_CANDIDATES = 12;

interface RssItem {
  titulo: string;
  url: string;
  fecha?: string;
  fuente?: string;
}

function decodeHtml(s: string): string {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
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
    const fuente = decodeHtml((block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? '').trim()) || undefined;
    if (titulo && url) out.push({ titulo, url, fecha, fuente });
  }
  return out;
}

function buildUrl(q: string): string {
  const params = new URLSearchParams({
    q,
    hl: 'es-419',
    gl: 'CR',
    ceid: 'CR:es-419',
  });
  return `https://news.google.com/rss/search?${params.toString()}`;
}

function isRelevant(item: RssItem): boolean {
  // Google News ya filtró por keywords del query, pero agregamos sanity check
  // para evitar matches puramente del nombre institucional sin IA (ej. "CCSS"
  // como tema de pensiones, no IA).
  const blob = `${item.titulo} ${item.fuente ?? ''}`;
  return mentionsAI(blob);
}

export async function scrapeGoogleNews(): Promise<ScraperReport> {
  const report = emptyReport('google-news');

  let totalFetched = 0;
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const allCandidates: Array<RssItem & { institucion: string }> = [];

  for (const { institucion, query } of QUERIES) {
    try {
      const xml = await fetchStatic(buildUrl(query), { timeout: 20000 });
      const items = parseFeed(xml);
      totalFetched += items.length;
      report.notes.push(`Query [${institucion}]: ${items.length} items.`);

      const relevantes = items
        .filter(isRelevant)
        .filter((it) => {
          const titNorm = it.titulo.toLowerCase().slice(0, 80);
          if (seenUrls.has(it.url) || seenTitles.has(titNorm)) return false;
          seenUrls.add(it.url);
          seenTitles.add(titNorm);
          return true;
        })
        .slice(0, MAX_PER_QUERY);

      for (const r of relevantes) allCandidates.push({ ...r, institucion });
    } catch (err) {
      report.notes.push(`Error query [${institucion}]: ${(err as Error).message}`);
    }
  }

  report.fetched = totalFetched;
  report.matched = allCandidates.length;

  if (allCandidates.length === 0) {
    report.notes.push('Sin candidatos relevantes en ninguna query.');
    return report;
  }

  for (const c of allCandidates.slice(0, MAX_TOTAL_CANDIDATES)) {
    const prefix = c.fuente ? `[${c.institucion} · ${c.fuente}] ` : `[${c.institucion}] `;
    report.candidates.push({ titulo: prefix + c.titulo, url: c.url });
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeGoogleNews()
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
