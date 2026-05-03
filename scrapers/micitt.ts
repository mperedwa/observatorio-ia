/**
 * Scraper MICITT (micitt.go.cr).
 *
 * Estrategia: lee el listado de comunicados/noticias del MICITT y filtra
 * por menciones a IA. Por cada nota detectada propone:
 *   - candidato a actualizar `descripcion` de la institución MICITT (nota mayor)
 *   - candidato a nuevo proyecto si la nota describe una iniciativa concreta
 *     (deja anotación en `notes`; nuevos proyectos requieren curado humano,
 *     no se proponen automáticamente como `add`)
 *
 * NO actualiza ningún campo editorial; solo deja constancia de que algo
 * nuevo apareció en la fuente.
 */

import { fetchStatic, fetchWithBrowser, load, mentionsAI, closeBrowser } from './lib/source';
import { emptyReport, writeReport, summarize, type ScraperReport } from './lib/diff';

const NEWS_URL = 'https://www.micitt.go.cr/micitt-Informa/noticias';
const BASE_URL = 'https://www.micitt.go.cr';

interface Nota {
  titulo: string;
  url: string;
  fecha?: string;
  resumen?: string;
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

  // Selectores específicos del Drupal de MICITT (verificados 2026-05-03)
  // Los enlaces a notas individuales viven en /el-sector-informa/<slug>
  const candidates = $('a[href^="/el-sector-informa/"]').toArray();
  const seen = new Set<string>();
  for (const el of candidates) {
    const $a = $(el);
    const href = $a.attr('href');
    const titulo = $a.text().trim();
    if (!href || !titulo) continue;
    // Filtra "Leer más" y enlaces sin título descriptivo
    if (titulo.length < 10 || /^leer\s+m[aá]s$/i.test(titulo)) continue;
    const url = new URL(href, BASE_URL).toString();
    if (seen.has(url)) continue;
    seen.add(url);
    notas.push({ titulo, url });
  }
  return notas;
}

export async function scrapeMicitt(): Promise<ScraperReport> {
  const report = emptyReport('micitt');

  let notas: Nota[] = [];
  try {
    notas = await fetchNotas();
    report.fetched = notas.length;
  } catch (err) {
    report.notes.push(`Error fetch listado MICITT: ${(err as Error).message}`);
    return report;
  }

  const relevantes = notas.filter((n) => mentionsAI(n.titulo));
  report.matched = relevantes.length;

  if (relevantes.length === 0) {
    report.notes.push('Ninguna nota nueva con menciones a IA en la primera página de comunicados.');
    return report;
  }

  // Política conservadora: NO se proponen `add` automáticos para proyectos.
  // Los candidatos van a `report.candidates` para clasificación posterior por LLM
  // (Fase 6) o como notas planas (Fase 5 fallback).
  for (const n of relevantes.slice(0, 10)) {
    report.candidates.push({ titulo: n.titulo, url: n.url });
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeMicitt()
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
