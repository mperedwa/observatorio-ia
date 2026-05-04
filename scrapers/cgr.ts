/**
 * Scraper Contraloría General de la República (cgr.go.cr) — Tier C.
 *
 * Estrategia: la CGR publica 2 feeds RSS oficiales. Útiles para detectar:
 *  - Comunicados de prensa con menciones a IA o sistemas digitales del Estado.
 *  - Informes de fiscalización (DFOE) que auditen proyectos catalogados
 *    (Poder Judicial, CCSS, Hacienda, etc.) o sistemas digitales relevantes.
 *
 * La CGR es una fuente oficial de alta credibilidad: cualquier crítica
 * técnica documentada en un informe DFOE es evidencia pública valiosa
 * para el catálogo del observatorio.
 *
 * Política editorial intacta: solo deja candidatos para revisión humana.
 */

import { fetchStatic, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const FEEDS = [
  { url: 'https://www.cgr.go.cr/10-varios/rss/noticias_rss.xml', tipo: 'noticia' },
  { url: 'https://www.cgr.go.cr/10-varios/rss/informes_recientes.xml', tipo: 'informe' },
];

// Substrings que matchean parcial (seguros, sin colisión con palabras comunes)
const CGR_KEYWORDS_SUBSTRING = [
  'inteligencia',
  'algoritm',
  'datos abiertos',
  'transformaci\u00f3n digital',
  'gobierno digital',
  'sistema inform',
  'fiscalizaci\u00f3n digital',
  'ciberseguridad',
  'expediente electr\u00f3nico',
  'firma digital',
  'plataforma digital',
];

// Acrónimos cortos: solo word-boundary (TIC matcheaba "licitación", "noticia").
const CGR_KEYWORDS_WORD = ['TIC', 'TICs', 'SICOP', 'EDUS'];

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
    const descripcion = decodeHtml(block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? '').trim() || undefined;
    if (titulo && url) out.push({ titulo, url, fecha, descripcion });
  }
  return out;
}

function isRelevant(item: RssItem): boolean {
  const blob = `${item.titulo} ${item.descripcion ?? ''}`;
  if (mentionsAI(blob)) return true;
  const lower = blob.toLowerCase();
  if (CGR_KEYWORDS_SUBSTRING.some((k) => lower.includes(k))) return true;
  for (const k of CGR_KEYWORDS_WORD) {
    if (new RegExp(`\\b${k}\\b`, 'i').test(blob)) return true;
  }
  return false;
}

export async function scrapeCGR(): Promise<ScraperReport> {
  const report = emptyReport('cgr');
  let totalFetched = 0;
  const allRelevantes: Array<RssItem & { tipo: string }> = [];
  const seen = new Set<string>();

  for (const { url, tipo } of FEEDS) {
    try {
      const xml = await fetchStatic(url, { timeout: 20000 });
      const items = parseFeed(xml);
      totalFetched += items.length;
      report.notes.push(`Feed ${tipo}: ${items.length} items.`);
      for (const it of items.filter(isRelevant)) {
        if (seen.has(it.url)) continue;
        seen.add(it.url);
        allRelevantes.push({ ...it, tipo });
      }
    } catch (err) {
      report.notes.push(`Error feed ${tipo}: ${(err as Error).message}`);
    }
  }

  report.fetched = totalFetched;
  report.matched = allRelevantes.length;

  if (allRelevantes.length === 0) {
    report.notes.push(
      `Ninguno de los ${totalFetched} items de CGR menciona IA, sistemas digitales, fiscalización digital, SICOP, ciberseguridad o keywords TIC.`,
    );
    return report;
  }

  for (const it of allRelevantes.slice(0, 10)) {
    report.candidates.push({ titulo: `[${it.tipo}] ${it.titulo}`, url: it.url });
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeCGR()
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
