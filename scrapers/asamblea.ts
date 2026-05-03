/**
 * Scraper Asamblea Legislativa de Costa Rica.
 *
 * Detecta cambios de estado en los 3 expedientes de IA:
 *   - 23.771 (regulación general / ARIA)
 *   - 23.919 (sandbox regulatorio)
 *   - 24.484 (marco adaptativo basado en riesgo)
 *
 * Estrategia: fetch a la página pública del expediente en asamblea.go.cr
 * y parsear el estado actual + última fecha de movimiento. Si SharePoint
 * bloquea el fetch directo, usamos Playwright con UA real.
 *
 * NUNCA toca campos editoriales (titulo, resumen, comision); solo `estado`
 * y `presentado`.
 */

import { fetchStatic, fetchWithBrowser, load, closeBrowser } from './lib/source';
import {
  emptyReport,
  loadCurrentJson,
  writeReport,
  summarize,
  type ScraperReport,
  type ProposedChange,
} from './lib/diff';

interface Expediente {
  numero: string;
  estado: string;
  presentado: string;
  [key: string]: unknown;
}

const EXPEDIENTES_TRACKED = ['23.771', '23.919', '24.484'];

/** Mapea texto de estado de Asamblea a nuestro enum. */
function normalizeEstado(raw: string): string | null {
  const t = raw.toLowerCase();
  if (t.includes('archiv')) return 'archivado';
  if (t.includes('aprob')) return 'aprobada';
  if (t.includes('segundo debate')) return 'segundo-debate';
  if (t.includes('primer debate')) return 'primer-debate';
  if (t.includes('comisi')) return 'en-comision';
  return null;
}

interface ScrapedExpediente {
  numero: string;
  estado: string | null;
  url: string;
  raw?: string;
}

async function fetchExpedienteData(numero: string): Promise<ScrapedExpediente> {
  const url = `https://www.asamblea.go.cr/Centro_de_informacion/Consultas_SIL/Pages/Detalle%20Proyectos%20de%20Ley.aspx?Numero_Proyecto=${numero}`;
  let html: string;
  try {
    html = await fetchStatic(url);
  } catch {
    html = await fetchWithBrowser(url, { waitFor: 'body', timeout: 30000 });
  }
  const $ = load(html);
  const bodyText = $('body').text();

  const estado = normalizeEstado(bodyText);
  return { numero, estado, url, raw: bodyText.slice(0, 200) };
}

export async function scrapeAsamblea(): Promise<ScraperReport> {
  const report = emptyReport('asamblea');
  const current = loadCurrentJson<Expediente[]>('json/legislacion.json');

  for (const numero of EXPEDIENTES_TRACKED) {
    let scraped: ScrapedExpediente;
    try {
      scraped = await fetchExpedienteData(numero);
      report.fetched++;
    } catch (err) {
      report.notes.push(`Error fetch expediente ${numero}: ${(err as Error).message}`);
      continue;
    }
    report.matched++;

    const local = current.find((e) => e.numero === numero);
    if (!local) {
      report.notes.push(`Expediente ${numero} no está en legislacion.json (skip).`);
      continue;
    }

    if (scraped.estado && scraped.estado !== local.estado) {
      const change: ProposedChange = {
        scraper: 'asamblea',
        dataset: 'legislacion',
        kind: 'update',
        id: numero,
        field: 'estado',
        before: local.estado,
        after: scraped.estado,
        rationale: `Estado detectado en SIL Asamblea. Texto encontrado en página pública del expediente.`,
        sourceUrl: scraped.url,
        scrapedAt: new Date().toISOString(),
      };
      report.changes.push(change);
    }
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAsamblea()
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
