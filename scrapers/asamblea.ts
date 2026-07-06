/**
 * Scraper Asamblea Legislativa CR — vía Delfino /asamblea/proyecto/<n>.
 *
 * Reemplaza el fetch original a asamblea.go.cr (SIL SharePoint) que devolvía 404
 * por la fuente Delfino (Next.js RSC payload). Patrón validado por Sirius-Lex en
 * `docs/inteligencia-legislativa-delfino-asamblea.md` (2026-06-19).
 *
 * Detecta cambios en `estado` y `comision` de todos los expedientes IA en
 * legislacion.json (dinámico, no hardcoded — el scraper ya cubre expedientes
 * nuevos apenas se agregan al catálogo).
 *
 * Cortesía Delfino (medio pago):
 * - Cache HTML local en `scraper-runs/delfino-cache/<n>-<YYYY-MM-DD>.html`
 * - Rate-limit 1.8s entre requests
 * - User-Agent identificable con contacto
 * - NUNCA redistribuir contenido crudo — solo campos objetivos (estado, comisión)
 *
 * NUNCA toca campos editoriales (titulo, resumen); solo `estado` y `comision`.
 * Los cambios detectados van al pipeline `ProposedChange` con revisión editorial
 * antes de aplicar.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  emptyReport,
  loadCurrentJson,
  writeReport,
  summarize,
  type ScraperReport,
  type ProposedChange,
} from './lib/diff';

interface Bilingual {
  es: string;
  en: string;
}
interface Expediente {
  numero: string;
  estado: string;
  comision?: Bilingual;
  presentado?: string;
  [key: string]: unknown;
}

const DELFINO_UA =
  'InvestigacionObservatorioIA/1.0 (contacto: mperedwa@gmail.com; observatorioia.org)';
const RATE_LIMIT_MS = 1800;
const CACHE_DIR = join(process.cwd(), 'scraper-runs', 'delfino-cache');
const FETCH_TIMEOUT_MS = 25000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function cachePath(numero: string, date: string): string {
  return join(CACHE_DIR, `${numero.replace('.', '')}-${date}.html`);
}

async function fetchDelfino(
  numero: string,
): Promise<{ html: string; url: string; fromCache: boolean }> {
  const numeroPath = numero.replace('.', '');
  const url = `https://delfino.cr/asamblea/proyecto/${numeroPath}`;
  const cached = cachePath(numero, todayIso());
  if (existsSync(cached)) {
    return { html: readFileSync(cached, 'utf8'), url, fromCache: true };
  }
  const res = await fetch(url, {
    headers: {
      'User-Agent': DELFINO_UA,
      Accept: 'text/html,application/xhtml+xml,*/*;q=0.9',
      'Accept-Language': 'es-CR,es;q=0.9',
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`fetch ${url} -> HTTP ${res.status}`);
  const html = await res.text();
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cached, html);
  return { html, url, fromCache: false };
}

interface ParsedDelfino {
  estadoRaw: string | null;
  comisionRaw: string | null;
}

/**
 * Parse defensivo del payload Delfino RSC.
 *
 * El HTML server-rendered incluye el árbol RSC escapado como texto. El patrón
 * observable (probado 2026-07-06 con expediente 23.771):
 *   \"Estado\",{...definición del label...}][\"$\",\"div\",null,{\"className\":\"text-gray-700 text-sm\",\"children\":\"En comisión\"}]
 *   \"Comisión\",{...} + href a /asamblea/comisiones/<tipo>/<slug> + children \"De Ciencia, Tecnología y Educación\"
 *
 * Fail-loud: si el regex no matchea el bloque específico del expediente,
 * retorna null → el llamador registra en notes y sigue con el próximo. Un
 * cambio de layout de Delfino se manifiesta como cero matches en varios
 * expedientes consecutivos, que es fácil de detectar en el reporte.
 */
function parseDelfinoHtml(html: string): ParsedDelfino {
  // Estado: capturar el children del div text-gray-700 que sigue al bloque \"Estado\"
  const estadoMatch = html.match(
    /\\"Estado\\"[\s\S]{0,800}?\\"text-gray-700[^"]{0,30}\\"[,\s]*\\"children\\":\\"([^"\\]{1,60})\\"/,
  );
  const estadoRaw = estadoMatch?.[1] ?? null;

  // Comisión: capturar el children del link a /asamblea/comisiones/.../<slug>
  const comisionMatch = html.match(
    /\\"Comisi[óo]n\\"[\s\S]{0,2500}?\\"children\\":\\"(De [A-Za-zÁÉÍÓÚáéíóúñ,\.\s]{5,80})\\"/,
  );
  const comisionRaw = comisionMatch?.[1] ?? null;

  return { estadoRaw, comisionRaw };
}

/**
 * Mapea texto de estado Delfino → enum canónico de legislacion.json.
 * Tabla histórica del scraper original más variantes que Delfino emite en su UI.
 */
function normalizeEstado(raw: string | null): string | null {
  if (!raw) return null;
  const t = raw.toLowerCase().trim();
  if (t.includes('archiv')) return 'archivado';
  if (t.includes('aprob')) return 'aprobada';
  if (t.includes('segundo debate')) return 'segundo-debate';
  if (t.includes('primer debate')) return 'primer-debate';
  if (t.includes('dictamin')) return 'dictaminado';
  if (t.includes('en comisi') || t.includes('en trámite') || t.includes('en tramite')) {
    return 'en-comision';
  }
  if (t.includes('presentado')) return 'presentado';
  return null;
}

/**
 * Normaliza el nombre de comisión para comparación. Delfino prefija con "De "
 * (ej. "De Ciencia, Tecnología y Educación"); el catálogo lo guarda sin prefijo
 * ("Ciencia, Tecnología y Educación"). Removemos el prefijo antes de comparar.
 */
function stripDeprefix(nombre: string): string {
  return nombre.replace(/^de\s+/i, '').trim().replace(/\s+/g, ' ');
}

export async function scrapeAsamblea(): Promise<ScraperReport> {
  const report = emptyReport('asamblea');
  const current = loadCurrentJson<Expediente[]>('json/legislacion.json');

  for (let i = 0; i < current.length; i++) {
    const exp = current[i];
    if (i > 0) await sleep(RATE_LIMIT_MS);

    let html: string;
    let url: string;
    let fromCache = false;
    try {
      const r = await fetchDelfino(exp.numero);
      html = r.html;
      url = r.url;
      fromCache = r.fromCache;
      report.fetched++;
    } catch (err) {
      report.notes.push(
        `Fetch fallo expediente ${exp.numero}: ${(err as Error).message}`,
      );
      continue;
    }
    report.matched++;
    if (fromCache) report.notes.push(`cache-hit ${exp.numero}`);

    const parsed = parseDelfinoHtml(html);
    if (parsed.estadoRaw === null && parsed.comisionRaw === null) {
      report.notes.push(
        `Parse defensivo fallo ${exp.numero}: layout Delfino puede haber cambiado.`,
      );
      continue;
    }

    // Estado
    const scrapedEstado = normalizeEstado(parsed.estadoRaw);
    if (scrapedEstado && scrapedEstado !== exp.estado) {
      const change: ProposedChange = {
        scraper: 'asamblea',
        dataset: 'legislacion',
        kind: 'update',
        id: exp.numero,
        field: 'estado',
        before: exp.estado,
        after: scrapedEstado,
        rationale: `Estado detectado en Delfino "${parsed.estadoRaw}" → normalizado "${scrapedEstado}". Antes: "${exp.estado}".`,
        sourceUrl: url,
        scrapedAt: new Date().toISOString(),
      };
      report.changes.push(change);
    }

    // Comisión
    if (parsed.comisionRaw && exp.comision) {
      const scrapedComEs = stripDeprefix(parsed.comisionRaw);
      const localComEs = stripDeprefix((exp.comision as Bilingual).es);
      if (
        scrapedComEs.toLowerCase() !== localComEs.toLowerCase() &&
        !scrapedComEs.toLowerCase().includes(localComEs.toLowerCase()) &&
        !localComEs.toLowerCase().includes(scrapedComEs.toLowerCase())
      ) {
        const change: ProposedChange = {
          scraper: 'asamblea',
          dataset: 'legislacion',
          kind: 'update',
          id: exp.numero,
          field: 'comision',
          before: exp.comision,
          after: { es: scrapedComEs, en: '(revisar traducción)' },
          rationale: `Comisión detectada en Delfino "${parsed.comisionRaw}" → "${scrapedComEs}". Local: "${localComEs}". Cambio de comisión (o desfase de nombre) — revisar editorialmente antes de aceptar; traducción EN requiere revisión manual.`,
          sourceUrl: url,
          scrapedAt: new Date().toISOString(),
        };
        report.changes.push(change);
      }
    }
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAsamblea()
    .then((report) => {
      console.log(summarize(report));
      const file = writeReport(report);
      console.log(`Reporte: ${file}`);
      if (report.notes.length) {
        console.log('Notas:');
        report.notes.forEach((n) => console.log(`  - ${n}`));
      }
    })
    .catch((err) => {
      console.error('Scraper falló:', err);
      process.exit(1);
    });
}
