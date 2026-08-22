/**
 * Genera los endpoints JSON públicos del observatorio bajo `public/api/`.
 *
 * El sitio usa `output: 'export'` (estático), así que la "API" es simplemente
 * archivos JSON que Vercel sirve con `Content-Type: application/json`. Los
 * headers CORS los añade `vercel.json`.
 *
 * Cada endpoint refleja directamente `src/data/json/<dataset>.json` (la
 * fuente de verdad) más metadata: `lastUpdate`, `version`, `count`.
 *
 * Genera además `/api/index.json` (manifest) y documentación humana bilingüe
 * en `/api/` (ES) y `/api/en/` (EN), enlazada a cada endpoint.
 *
 * Correr: `npm run build:api` (incluido en `npm run build`).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { computeCounters, type Counters } from './lib/counters';

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, 'src', 'data', 'json');
const OUT_DIR = join(ROOT, 'public', 'api');
const COUNTERS_TS = join(ROOT, 'src', 'data', 'counters.ts');
const PKG = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { version: string };

/**
 * Indicadores cuyo `valor` (y opcionalmente `detalle`) se resuelve dinámicamente
 * a partir del catálogo o del propio JSON de indicadores. El JSON source guarda
 * `"valor": "auto"` (y opcionalmente `"detalle": "auto"`) como sentinela; aquí
 * lo reemplazamos con el valor real antes de envolver y escribir a /api/.
 *
 * Mapping `kpisHero[].label.es` → función que devuelve `{ valor, detalle? }`.
 * Si `detalle` no se devuelve, se mantiene el valor del JSON source.
 */
interface KpiBilingual {
  es: string;
  en: string;
}

interface KpiAutoResult {
  valor: string;
  detalle?: KpiBilingual;
}

interface IliaRow {
  pais: KpiBilingual;
  ilia: number;
  destacado?: boolean;
}

function resolveLegislationKpi(counters: Counters): KpiAutoResult {
  const expedientes = JSON.parse(
    readFileSync(join(SRC_DIR, 'legislacion.json'), 'utf8'),
  ) as Array<{ estado?: string }>;
  const dictaminados = expedientes.filter(
    ({ estado }) => estado === 'dictaminado',
  ).length;
  const enComision = expedientes.filter(
    ({ estado }) => estado === 'en-comision',
  ).length;

  return {
    valor: String(counters.legislacion),
    detalle: {
      es: `${dictaminados} dictaminados, ${enComision} en comisión`,
      en: `${dictaminados} with committee reports, ${enComision} in committee`,
    },
  };
}

const KPI_AUTO: Record<string, (c: Counters, data: unknown) => KpiAutoResult> = {
  'Iniciativas relacionadas con IA documentadas': (c) => ({ valor: String(c.proyectos) }),
  'Instituciones con iniciativas documentadas': (c) => ({ valor: String(c.instituciones) }),
  'Expedientes de ley en trámite': (c) => resolveLegislationKpi(c),
  'Posición ILIA Latinoamérica': (_c, data) => {
    const rows = (data as { ilia2025?: IliaRow[] } | undefined)?.ilia2025 ?? [];
    if (rows.length === 0) return { valor: '?' };
    const sorted = [...rows].sort((a, b) => b.ilia - a.ilia);
    const cr = sorted.find((p) => p.destacado);
    if (!cr) return { valor: '?' };
    const pos = sorted.indexOf(cr) + 1;
    const top = sorted[0];
    const brecha = Math.round(top.ilia - cr.ilia);
    const isTopCr = pos === 1;
    return {
      valor: `${pos}°`,
      detalle: isTopCr
        ? {
            es: `${cr.ilia.toFixed(2)}/100, liderando la región`,
            en: `${cr.ilia.toFixed(2)}/100, leading the region`,
          }
        : {
            es: `${cr.ilia.toFixed(2)}/100, brecha de -${brecha} vs ${top.pais.es}`,
            en: `${cr.ilia.toFixed(2)}/100, -${brecha} gap vs ${top.pais.en}`,
          },
    };
  },
};

interface Dataset {
  filename: string;
  outputFilename?: string;
  endpoint: string;
  title: KpiBilingual;
  description: string;
  descriptionEs: string;
  descriptionEn: string;
  countUnit: KpiBilingual;
  /** Último cambio editorial real del dataset; nunca la hora de build. */
  lastUpdate: string;
  getCount?: (data: unknown) => number;
}

const DATASETS: Dataset[] = [
  {
    filename: 'proyectos.json',
    endpoint: '/api/proyectos.json',
    title: { es: 'Iniciativas', en: 'Initiatives' },
    countUnit: { es: 'iniciativas', en: 'initiatives' },
    lastUpdate: '2026-08-21',
    description:
      'Catálogo de iniciativas relacionadas con IA en el sector público costarricense. Incluye sistemas, pilotos, planes y capacidades con descripción bilingüe ES/EN y una fuente pública consultada.',
    descriptionEs:
      'Catálogo de iniciativas relacionadas con IA en el sector público costarricense. Incluye sistemas, pilotos, planes y capacidades con textos bilingües y fuentes públicas trazables.',
    descriptionEn:
      'Catalog of AI-related initiatives in Costa Rica\u2019s public sector. It includes systems, pilots, plans and capabilities with bilingual ES/EN descriptions and traceable public sources.',
  },
  {
    filename: 'instituciones.json',
    endpoint: '/api/instituciones.json',
    title: { es: 'Instituciones', en: 'Institutions' },
    countUnit: { es: 'instituciones', en: 'institutions' },
    lastUpdate: '2026-08-21',
    description:
      'Instituciones públicas con iniciativas relacionadas con IA documentadas (ministerios, autónomas, judicial, universidades e investigación).',
    descriptionEs:
      'Instituciones públicas con iniciativas relacionadas con IA documentadas, incluidos ministerios, instituciones autónomas, Poder Judicial, universidades y organismos de investigación.',
    descriptionEn:
      'Public institutions with documented AI-related initiatives, including ministries, autonomous institutions, the judiciary, universities and research bodies.',
  },
  {
    filename: 'legislacion.json',
    endpoint: '/api/legislacion.json',
    title: { es: 'Legislación', en: 'Legislation' },
    countUnit: { es: 'expedientes', en: 'bills' },
    lastUpdate: '2026-08-21',
    description:
      'Expedientes de ley relacionados con IA en la Asamblea Legislativa de Costa Rica. Los monitores proponen señales; el estado publicado requiere revisión editorial de una fuente oficial.',
    descriptionEs:
      'Expedientes relacionados con IA en la Asamblea Legislativa. Los monitores proponen señales; cada estado publicado requiere revisión editorial contra una fuente oficial.',
    descriptionEn:
      'AI-related bills in Costa Rica\u2019s Legislative Assembly. Monitors propose signals, while every published status requires editorial review against an official source.',
  },
  {
    filename: 'indicadores.json',
    endpoint: '/api/indicadores.json',
    title: { es: 'Indicadores', en: 'Indicators' },
    countUnit: { es: 'bloques', en: 'groups' },
    lastUpdate: '2026-08-21',
    description:
      'Indicadores cuantitativos: ILIA 2025 (Índice Latinoamericano de IA), comparativa regional, KPIs hero del observatorio.',
    descriptionEs:
      'Indicadores cuantitativos, incluidos ILIA 2025, comparativas regionales y las cifras principales del observatorio.',
    descriptionEn:
      'Quantitative indicators, including ILIA 2025, regional comparisons and the observatory\u2019s headline metrics.',
  },
  {
    filename: 'brechas.json',
    endpoint: '/api/brechas.json',
    title: { es: 'Brechas comparadas', en: 'Comparative gaps' },
    countUnit: { es: 'brechas', en: 'gaps' },
    lastUpdate: '2026-08-21',
    description:
      'Análisis de brechas: 7 capacidades que CR no tiene operativas vs Estonia/Singapur (gobernanza IA, X-Road, chatbot ciudadano, etc.).',
    descriptionEs:
      'Análisis de siete capacidades no documentadas como operativas en Costa Rica, comparadas con referentes de Estonia y Singapur.',
    descriptionEn:
      'Analysis of seven capabilities not documented as operational in Costa Rica, benchmarked against Estonia and Singapore.',
  },
  {
    filename: 'eniaAcciones.json',
    outputFilename: 'enia-acciones.json',
    endpoint: '/api/enia-acciones.json',
    title: { es: 'Plan de Acción ENIA', en: 'ENIA Action Plan' },
    countUnit: { es: 'registros fuente', en: 'source records' },
    lastUpdate: '2026-08-21',
    description:
      'Inventario y crosswalk del Plan de Acción ENIA: 129 registros del documento oficial, 120 intervenciones únicas, clasificación por tipo, evidencia de ejecución y relaciones con el catálogo.',
    descriptionEs:
      'Inventario y cruce editorial del Plan de Acción ENIA: 129 registros del documento oficial, 120 intervenciones únicas, clasificación, evidencia de ejecución y relaciones con el catálogo.',
    descriptionEn:
      'Inventory and crosswalk of the ENIA Action Plan: 129 records from the official document, 120 unique interventions, type classification, execution evidence and catalog relationships.',
    getCount: (data) => {
      const count = (data as { resumen?: { intervenciones?: unknown } } | undefined)
        ?.resumen?.intervenciones;
      return typeof count === 'number' ? count : 0;
    },
  },
  {
    filename: 'monitoreo.json',
    endpoint: '/api/monitoreo.json',
    title: { es: 'Monitoreo editorial', en: 'Editorial monitoring' },
    countUnit: { es: 'frentes', en: 'monitoring fronts' },
    lastUpdate: '2026-08-21',
    description:
      'Agenda y bitácora editorial: cadencias por frente, próximas revisiones, cambios de estado y revisiones documentadas sin cambios.',
    descriptionEs:
      'Agenda y bitácora editorial con cadencias por frente, próximas revisiones, cambios de estado y revisiones documentadas sin cambios.',
    descriptionEn:
      'Editorial schedule and log, including cadence by monitoring front, upcoming reviews, status changes and documented no-change reviews.',
    getCount: (data) => {
      const count = (data as { frentes?: unknown[] } | undefined)?.frentes?.length;
      return typeof count === 'number' ? count : 0;
    },
  },
];

interface ApiEnvelope<T> {
  version: string;
  lastUpdate: string;
  count: number;
  source: string;
  license: string;
  data: T;
}

function normalizeLastUpdate(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`lastUpdate inválido: ${date}`);
  }
  return `${date}T00:00:00.000Z`;
}

const EDITORIAL_DATE_KEYS = new Set([
  'fechaCorte',
  'fechaConsulta',
  'fechaUltimaRevision',
  'fechaUltimaVerificacion',
]);

function findLatestEmbeddedEditorialDate(value: unknown): string | null {
  let latest: string | null = null;

  function visit(current: unknown): void {
    if (Array.isArray(current)) {
      current.forEach(visit);
      return;
    }
    if (!current || typeof current !== 'object') return;

    for (const [key, nested] of Object.entries(current)) {
      if (
        EDITORIAL_DATE_KEYS.has(key) &&
        typeof nested === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(nested)
      ) {
        latest = latest === null || nested > latest ? nested : latest;
      } else {
        visit(nested);
      }
    }
  }

  visit(value);
  return latest;
}

function envelope<T>(
  data: T,
  lastUpdate: string,
  explicitCount?: number,
): ApiEnvelope<T> {
  return {
    version: PKG.version,
    lastUpdate: normalizeLastUpdate(lastUpdate),
    count:
      explicitCount ??
      (Array.isArray(data) ? data.length : Object.keys(data as object).length),
    source: 'https://observatorioia.org',
    license: 'CC BY 4.0',
    data,
  };
}

type ApiIndexLocale = 'es' | 'en';

interface ApiIndexEndpoint {
  endpoint: string;
  title: KpiBilingual;
  description: string;
  descriptionEs: string;
  descriptionEn: string;
  countUnit: KpiBilingual;
  count: number;
  lastUpdate: string;
}

const API_INDEX_COPY = {
  es: {
    pageTitle: 'API pública JSON | Observatorio IA Costa Rica',
    metaDescription:
      'Documentación de la API JSON pública del Observatorio IA Costa Rica para periodismo, investigación y reutilización cívica.',
    skip: 'Saltar al contenido',
    siteName: 'Observatorio IA Costa Rica',
    back: 'Volver al observatorio',
    languageLabel: 'Idioma de la documentación',
    kicker: 'Archivo de datos públicos',
    title: 'Evidencia pública, lista para consultar',
    intro:
      'Siete colecciones JSON documentan iniciativas, instituciones, legislación, indicadores, brechas, el Plan de Acción ENIA y el trabajo de monitoreo editorial.',
    audience:
      'Una interfaz de lectura para periodistas, investigadores, desarrolladores y organizaciones que necesitan examinar o reutilizar la evidencia del observatorio.',
    facts: [
      { value: '7', label: 'endpoints documentados' },
      { value: 'CC BY 4.0', label: 'licencia de datos' },
      { value: 'GET', label: 'lectura sin autenticación' },
    ],
    quickKicker: 'Consulta inmediata',
    quickTitle: 'Empiece con el catálogo',
    quickText:
      'No requiere una cuenta ni una llave. La respuesta incluye los datos y la fecha editorial del último cambio conocido.',
    collectionsKicker: '01 / Colecciones',
    collectionsTitle: 'Siete conjuntos, un contrato estable',
    collectionsIntro:
      'El conteo describe la unidad propia de cada archivo. No debe sumarse entre colecciones ni interpretarse por sí solo como adopción verificada de IA.',
    countLabel: 'Contenido',
    updatedLabel: 'Corte editorial',
    openLabel: 'Abrir JSON',
    manifestTitle: 'Manifest de la API',
    manifestText:
      'Use el manifest para descubrir programáticamente todos los endpoints, sus conteos y fechas editoriales.',
    contractKicker: '02 / Contrato',
    contractTitle: 'Cómo leer una respuesta',
    contractIntro:
      'Todos los endpoints comparten la misma envoltura. El campo data conserva la estructura natural de cada conjunto.',
    fields: [
      ['version', 'Versión de la aplicación que generó la exportación.'],
      ['lastUpdate', 'Fecha del último cambio editorial conocido, no la hora de compilación.'],
      ['count', 'Cantidad según la unidad declarada por el endpoint.'],
      ['source', 'Sitio responsable de la publicación del conjunto.'],
      ['license', 'Condiciones de reutilización de los datos.'],
      ['data', 'Colección o documento completo del conjunto solicitado.'],
    ],
    interpretationTitle: 'Criterios de interpretación',
    interpretation: [
      'Los textos públicos se entregan como objetos bilingües con campos es y en.',
      'En el catálogo, existencia, ejecución, técnica de IA, uso operativo, resultados y gobernanza se evalúan por separado.',
      'No determinado significa que la evidencia pública disponible no permite confirmar ni descartar una afirmación.',
      'Las fuentes indican qué dimensiones respaldan. Una noticia puede orientar la investigación, pero no sustituye una fuente primaria al confirmar ejecución.',
    ],
    examplesKicker: '03 / Consultar',
    examplesTitle: 'Ejemplos reproducibles',
    examplesIntro:
      'Las rutas son archivos estáticos. Funcionan desde una terminal, un cuaderno de análisis, una hoja de cálculo con importación JSON o cualquier cliente HTTP.',
    curlTitle: 'Descargar el catálogo',
    curlText: 'Obtiene la envoltura completa de iniciativas.',
    filterTitle: 'Filtrar adopciones verificadas',
    filterText:
      'Este ejemplo selecciona únicamente registros cuya ubicación editorial es verificado. La fase y las demás dimensiones siguen disponibles para análisis separado.',
    jsTitle: 'Consumir desde JavaScript',
    jsText: 'Lee datos y fecha editorial sin depender del orden de los campos.',
    reuseKicker: '04 / Reutilizar',
    reuseTitle: 'Atribución, límites y contacto',
    citationTitle: 'Cómo citar',
    citation:
      'Observatorio IA Costa Rica, conjunto consultado, fecha de corte editorial y URL directa del endpoint.',
    limitTitle: 'Qué no afirma la API',
    limitText:
      'El catálogo incluye adopciones verificadas, iniciativas en seguimiento y capacidades del ecosistema. El total de iniciativas documentadas no equivale al número de sistemas de IA operativos.',
    maintenanceTitle: 'Mantenimiento editorial',
    maintenanceText:
      'Los monitores generan señales. Ningún scraper crea, reclasifica ni verifica una iniciativa automáticamente; los cambios publicados requieren revisión editorial.',
    contact: 'Consultas sobre datos o metodología',
  },
  en: {
    pageTitle: 'Public JSON API | AI Observatory Costa Rica',
    metaDescription:
      'Documentation for AI Observatory Costa Rica\u2019s public JSON API for journalism, research and civic reuse.',
    skip: 'Skip to content',
    siteName: 'AI Observatory Costa Rica',
    back: 'Return to the observatory',
    languageLabel: 'Documentation language',
    kicker: 'Public data archive',
    title: 'Public evidence, ready to query',
    intro:
      'Seven JSON collections document initiatives, institutions, legislation, indicators, comparative gaps, the ENIA Action Plan and editorial monitoring work.',
    audience:
      'A human-readable interface for journalists, researchers, developers and organizations that need to examine or reuse the observatory\u2019s evidence.',
    facts: [
      { value: '7', label: 'documented endpoints' },
      { value: 'CC BY 4.0', label: 'data license' },
      { value: 'GET', label: 'read access without authentication' },
    ],
    quickKicker: 'Immediate query',
    quickTitle: 'Start with the catalog',
    quickText:
      'No account or API key is required. The response includes both the data and the editorial date of the latest known change.',
    collectionsKicker: '01 / Collections',
    collectionsTitle: 'Seven datasets, one stable contract',
    collectionsIntro:
      'Each count uses the unit declared for that file. Counts should not be added across collections or treated on their own as verified AI adoption.',
    countLabel: 'Contents',
    updatedLabel: 'Editorial cutoff',
    openLabel: 'Open JSON',
    manifestTitle: 'API manifest',
    manifestText:
      'Use the manifest to discover every endpoint programmatically, together with counts and editorial dates.',
    contractKicker: '02 / Contract',
    contractTitle: 'How to read a response',
    contractIntro:
      'Every endpoint uses the same envelope. The data field preserves the natural structure of each dataset.',
    fields: [
      ['version', 'Application version that generated the export.'],
      ['lastUpdate', 'Date of the latest known editorial change, not the build time.'],
      ['count', 'Quantity according to the unit declared by the endpoint.'],
      ['source', 'Site responsible for publishing the dataset.'],
      ['license', 'Terms governing reuse of the data.'],
      ['data', 'Complete collection or document returned by the endpoint.'],
    ],
    interpretationTitle: 'Interpretation rules',
    interpretation: [
      'Public text is delivered as bilingual objects with es and en fields.',
      'In the catalog, existence, execution, AI technique, operational use, results and governance are assessed separately.',
      'Undetermined means the available public evidence cannot confirm or rule out a claim.',
      'Sources identify the dimensions they support. News coverage can guide research but does not replace a primary source when confirming execution.',
    ],
    examplesKicker: '03 / Query',
    examplesTitle: 'Reproducible examples',
    examplesIntro:
      'These routes are static files. They work from a terminal, an analysis notebook, a spreadsheet with JSON import or any HTTP client.',
    curlTitle: 'Download the catalog',
    curlText: 'Returns the complete initiatives envelope.',
    filterTitle: 'Filter verified adoptions',
    filterText:
      'This example selects records whose editorial placement is verified. Phase and every other evidence dimension remain available for separate analysis.',
    jsTitle: 'Consume from JavaScript',
    jsText: 'Reads data and editorial date without relying on field order.',
    reuseKicker: '04 / Reuse',
    reuseTitle: 'Attribution, limits and contact',
    citationTitle: 'How to cite',
    citation:
      'AI Observatory Costa Rica, dataset consulted, editorial cutoff date and direct endpoint URL.',
    limitTitle: 'What the API does not claim',
    limitText:
      'The catalog includes verified adoptions, initiatives under review and ecosystem capabilities. The total number of documented initiatives is not the number of operational AI systems.',
    maintenanceTitle: 'Editorial maintenance',
    maintenanceText:
      'Monitors generate signals. No scraper creates, reclassifies or verifies an initiative automatically; published changes require editorial review.',
    contact: 'Questions about data or methodology',
  },
} as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildIndexHtml(endpoints: ApiIndexEndpoint[], locale: ApiIndexLocale): string {
  const copy = API_INDEX_COPY[locale];
  const isEs = locale === 'es';
  const canonical = isEs ? '/api/' : '/api/en/';
  const latestUpdate = endpoints.map(({ lastUpdate }) => lastUpdate).sort().at(-1)?.slice(0, 10) ?? '';
  const endpointRows = endpoints
    .map((endpoint, index) => {
      const description = isEs ? endpoint.descriptionEs : endpoint.descriptionEn;
      return `        <li class="endpoint-record">
          <span class="record-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
          <article>
            <div class="endpoint-heading">
              <div>
                <p class="collection-name">${escapeHtml(endpoint.title[locale])}</p>
                <h3><a href="${endpoint.endpoint}"><code>${endpoint.endpoint}</code><span aria-hidden="true"> ↗</span></a></h3>
              </div>
              <span class="open-label">${copy.openLabel}</span>
            </div>
            <p class="endpoint-description">${escapeHtml(description)}</p>
            <dl class="endpoint-meta">
              <div><dt>${copy.countLabel}</dt><dd><strong>${endpoint.count}</strong> ${escapeHtml(endpoint.countUnit[locale])}</dd></div>
              <div><dt>${copy.updatedLabel}</dt><dd><time datetime="${endpoint.lastUpdate.slice(0, 10)}">${endpoint.lastUpdate.slice(0, 10)}</time></dd></div>
            </dl>
          </article>
        </li>`;
    })
    .join('\n');

  const facts = copy.facts
    .map(({ value, label }) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join('\n          ');
  const fields = copy.fields
    .map(([name, description]) => `<div><dt><code>${name}</code></dt><dd>${escapeHtml(description)}</dd></div>`)
    .join('\n              ');
  const interpretation = copy.interpretation
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('\n              ');

  const envelopeExample = `{
  "version": "${PKG.version}",
  "lastUpdate": "${latestUpdate}T00:00:00.000Z",
  "count": 29,
  "source": "https://observatorioia.org",
  "license": "CC BY 4.0",
  "data": [ ... ]
}`;
  const curlExample = 'curl -s https://observatorioia.org/api/proyectos.json';
  const filterExample = `curl -s https://observatorioia.org/api/proyectos.json |
  jq '.data[] | select(.estadoCatalogo == "verificado") |
      {id, titulo, faseImplementacion, fechaUltimaVerificacion}'`;
  const jsExample = `const response = await fetch(
  'https://observatorioia.org/api/proyectos.json'
);
const { data, lastUpdate } = await response.json();`;

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <title>${copy.pageTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index, follow">
  <meta name="description" content="${copy.metaDescription}">
  <link rel="canonical" href="https://www.observatorioia.org${canonical}">
  <link rel="alternate" hreflang="es" href="https://www.observatorioia.org/api/">
  <link rel="alternate" hreflang="en" href="https://www.observatorioia.org/api/en/">
  <link rel="alternate" hreflang="x-default" href="https://www.observatorioia.org/api/">
  <style>
    :root {
      color-scheme: light;
      --ink: #10243e;
      --blue: #1e3a8a;
      --link: #1d4ed8;
      --paper: #faf9f5;
      --rule: #cbd5e1;
      --muted: #475569;
      --accent: #b4533c;
      --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --serif: "Source Serif 4", "Iowan Old Style", Baskerville, Georgia, serif;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; color: var(--ink); background: #fff; font-family: var(--sans); line-height: 1.6; }
    a { color: var(--link); text-decoration-thickness: 1px; text-underline-offset: 3px; }
    a:hover { color: var(--blue); }
    a:focus-visible { outline: 3px solid var(--link); outline-offset: 3px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .skip-link { position: fixed; left: 1rem; top: 0; z-index: 20; transform: translateY(-150%); background: #fff; padding: .7rem 1rem; font-weight: 700; }
    .skip-link:focus { transform: translateY(1rem); }
    .shell { width: min(100% - 3rem, 74rem); margin-inline: auto; }
    .site-header { border-bottom: 1px solid var(--rule); background: var(--paper); }
    .site-header .shell { min-height: 4.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .brand { color: var(--ink); font-family: var(--serif); font-size: 1.15rem; font-weight: 700; text-decoration: none; }
    .header-tools { display: flex; align-items: center; gap: 1.25rem; font-size: .78rem; }
    .back-link { color: var(--muted); }
    .language { display: flex; align-items: center; gap: .25rem; border-left: 1px solid var(--rule); padding-left: 1rem; }
    .language a { min-width: 2rem; color: var(--muted); font-weight: 700; text-align: center; text-decoration: none; }
    .language a[aria-current="page"] { color: var(--ink); text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 2px; }
    .hero { border-bottom: 1px solid var(--rule); background: var(--paper); }
    .hero .shell { padding-block: clamp(4rem, 9vw, 7.5rem); }
    .eyebrow { margin: 0 0 1.25rem; color: var(--blue); font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
    h1, h2 { font-family: var(--serif); text-wrap: balance; }
    h1 { max-width: 16ch; margin: 0; font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 600; letter-spacing: -.035em; line-height: .98; }
    h2 { margin: 0; font-size: clamp(2.05rem, 4vw, 3.5rem); font-weight: 600; line-height: 1.05; }
    h3 { margin: .3rem 0 0; font-size: 1rem; }
    .hero-grid { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(18rem, .8fr); gap: clamp(3rem, 8vw, 7rem); align-items: end; }
    .hero-grid > *, .quick { min-width: 0; }
    .lede { max-width: 48rem; margin: 2rem 0 0; color: #334155; font-size: clamp(1.1rem, 2vw, 1.35rem); line-height: 1.65; }
    .audience { max-width: 44rem; margin: 1rem 0 0; color: var(--muted); }
    .facts { margin: 0; border-top: 1px solid var(--rule); }
    .facts div { display: grid; grid-template-columns: 1fr auto; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--rule); }
    .facts dt { color: var(--muted); font-size: .76rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
    .facts dd { margin: 0; font-family: var(--serif); font-size: 1.25rem; font-weight: 700; }
    .quick { margin-top: 1.75rem; border-left: 2px solid var(--accent); padding-left: 1rem; }
    .quick p { margin: .25rem 0 0; color: var(--muted); font-size: .86rem; }
    .quick .quick-kicker { margin: 0; color: var(--blue); font-size: .68rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
    .quick h2 { margin-top: .25rem; font-family: var(--sans); font-size: 1rem; font-weight: 750; }
    .quick code { display: block; margin-top: .8rem; overflow-x: auto; color: var(--ink); font-size: .78rem; white-space: nowrap; }
    .section { padding-block: clamp(4rem, 8vw, 6.5rem); border-bottom: 1px solid var(--rule); }
    .section.paper { background: var(--paper); }
    .section-heading { display: grid; grid-template-columns: 3.25rem minmax(0, 1fr); gap: 1rem; }
    .section-number { padding-top: .25rem; color: var(--muted); font-family: ui-monospace, monospace; font-size: .75rem; }
    .section-intro { max-width: 46rem; margin: 1.25rem 0 0; color: var(--muted); font-size: 1.05rem; }
    .endpoint-list { margin: 3.25rem 0 0; padding: 0; border-top: 1px solid var(--rule); list-style: none; }
    .endpoint-record { display: grid; grid-template-columns: 3.25rem minmax(0, 1fr); gap: 1rem; padding-block: 2rem; border-bottom: 1px solid var(--rule); }
    .record-number { padding-top: .2rem; color: var(--muted); font-family: ui-monospace, monospace; font-size: .75rem; }
    .endpoint-heading { display: flex; justify-content: space-between; gap: 1.5rem; }
    .collection-name { margin: 0; color: var(--ink); font-family: var(--serif); font-size: 1.35rem; font-weight: 700; }
    .endpoint-heading h3 a { font-weight: 600; }
    .endpoint-heading code { font-size: .86rem; }
    .open-label { flex: none; padding-top: .15rem; color: var(--muted); font-size: .72rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .endpoint-description { max-width: 52rem; margin: 1rem 0 0; color: #334155; }
    .endpoint-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 13rem)); gap: 1rem; margin: 1.35rem 0 0; }
    .endpoint-meta div { border-left: 1px solid var(--rule); padding-left: .8rem; }
    .endpoint-meta dt { color: var(--muted); font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .endpoint-meta dd { margin: .2rem 0 0; color: var(--ink); font-size: .85rem; }
    .manifest { display: grid; grid-template-columns: 3.25rem minmax(0, 1fr); gap: 1rem; margin-top: 1.5rem; padding-block: 1.5rem; border-bottom: 1px solid var(--rule); }
    .manifest p { margin: .35rem 0 0; color: var(--muted); }
    .contract-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(22rem, 1.1fr); gap: clamp(3rem, 7vw, 6rem); margin-top: 3.25rem; min-width: 0; }
    .contract-grid > *, .code-example { min-width: 0; }
    pre { max-width: 100%; min-width: 0; margin: 0; overflow-x: auto; border-left: 3px solid var(--accent); background: var(--ink); padding: 1.4rem; color: #f8fafc; font-size: .79rem; line-height: 1.65; }
    .field-list { margin: 0; }
    .field-list div { display: grid; grid-template-columns: 7rem minmax(0, 1fr); gap: 1rem; padding: .9rem 0; border-top: 1px solid var(--rule); }
    .field-list div:last-child { border-bottom: 1px solid var(--rule); }
    .field-list dt { font-weight: 800; }
    .field-list dd { margin: 0; color: var(--muted); }
    .interpretation { margin-top: 3.25rem; border-top: 1px solid var(--rule); padding-top: 2rem; }
    .interpretation h3 { font-family: var(--serif); font-size: 1.5rem; }
    .interpretation ul { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 2rem; margin: 1rem 0 0; padding-left: 1.25rem; }
    .interpretation li { padding: .55rem 0; color: #334155; }
    .code-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.5rem; margin-top: 3.25rem; }
    .code-example { border-top: 1px solid var(--rule); padding-top: 1.4rem; }
    .code-example.wide { grid-column: 1 / -1; }
    .code-example h3 { font-family: var(--serif); font-size: 1.45rem; }
    .code-example p { min-height: 3.2rem; margin: .55rem 0 1rem; color: var(--muted); }
    .reuse-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 3.25rem; border-top: 1px solid var(--rule); }
    .reuse-grid article { padding: 1.6rem 1.5rem 1.6rem 0; border-bottom: 1px solid var(--rule); }
    .reuse-grid article + article { border-left: 1px solid var(--rule); padding-left: 1.5rem; }
    .reuse-grid h3 { font-family: var(--serif); font-size: 1.3rem; }
    .reuse-grid p { margin: .65rem 0 0; color: var(--muted); }
    .contact { margin-top: 2rem; }
    .site-footer { background: var(--paper); }
    .site-footer .shell { display: flex; justify-content: space-between; gap: 2rem; padding-block: 2.5rem; color: var(--muted); font-size: .8rem; }
    .site-footer p { margin: 0; }
    @media (max-width: 760px) {
      .shell { width: min(100% - 2rem, 74rem); }
      .back-link { display: none; }
      .hero-grid, .contract-grid, .code-grid, .reuse-grid { grid-template-columns: 1fr; }
      .hero-grid { gap: 3rem; }
      .endpoint-heading { align-items: flex-start; }
      .open-label { display: none; }
      .code-example.wide { grid-column: auto; }
      .code-example p { min-height: 0; }
      .interpretation ul { grid-template-columns: 1fr; }
      .reuse-grid article + article { border-left: 0; padding-left: 0; }
      .site-footer .shell { flex-direction: column; }
    }
    @media (max-width: 480px) {
      .site-header .shell { min-height: 3.8rem; }
      .brand { max-width: 13rem; font-size: 1rem; line-height: 1.2; }
      .header-tools { gap: .5rem; }
      .language { padding-left: .5rem; }
      h1 { font-size: clamp(2.65rem, 14vw, 4rem); }
      .section-heading, .endpoint-record, .manifest { grid-template-columns: 2.25rem minmax(0, 1fr); gap: .65rem; }
      .endpoint-meta { grid-template-columns: 1fr; }
      .field-list div { grid-template-columns: 1fr; gap: .25rem; }
    }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
    @media print {
      .site-header, .skip-link { display: none; }
      .section, .hero { padding-block: 2rem; }
      pre { border: 1px solid #64748b; background: #fff; color: #000; white-space: pre-wrap; }
      a { color: #000; }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#contenido">${copy.skip}</a>
  <header class="site-header">
    <div class="shell">
      <a class="brand" href="/${locale}/">${copy.siteName}</a>
      <div class="header-tools">
        <a class="back-link" href="/${locale}/">${copy.back}</a>
        <nav class="language" aria-label="${copy.languageLabel}">
          <a href="/api/" lang="es" hreflang="es"${isEs ? ' aria-current="page"' : ''}>ES</a>
          <span aria-hidden="true">/</span>
          <a href="/api/en/" lang="en" hreflang="en"${isEs ? '' : ' aria-current="page"'}>EN</a>
        </nav>
      </div>
    </div>
  </header>
  <main id="contenido" tabindex="-1">
    <section class="hero" aria-labelledby="api-title">
      <div class="shell hero-grid">
        <div>
          <p class="eyebrow">${copy.kicker} / API ${PKG.version}</p>
          <h1 id="api-title">${copy.title}</h1>
          <p class="lede">${copy.intro}</p>
          <p class="audience">${copy.audience}</p>
        </div>
        <div>
          <dl class="facts">
            ${facts}
          </dl>
          <aside class="quick" aria-labelledby="quick-title">
            <p class="quick-kicker">${copy.quickKicker}</p>
            <h2 id="quick-title">${copy.quickTitle}</h2>
            <p>${copy.quickText}</p>
            <code>${curlExample}</code>
          </aside>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="collections-title">
      <div class="shell">
        <div class="section-heading">
          <span class="section-number" aria-hidden="true">01</span>
          <div>
            <p class="eyebrow">${copy.collectionsKicker}</p>
            <h2 id="collections-title">${copy.collectionsTitle}</h2>
            <p class="section-intro">${copy.collectionsIntro}</p>
          </div>
        </div>
        <ol class="endpoint-list">
${endpointRows}
        </ol>
        <aside class="manifest" aria-labelledby="manifest-title">
          <span class="record-number" aria-hidden="true">M</span>
          <div>
            <h3 id="manifest-title"><a href="/api/index.json"><code>/api/index.json</code><span aria-hidden="true"> ↗</span></a></h3>
            <p><strong>${copy.manifestTitle}.</strong> ${copy.manifestText}</p>
          </div>
        </aside>
      </div>
    </section>

    <section class="section paper" aria-labelledby="contract-title">
      <div class="shell">
        <div class="section-heading">
          <span class="section-number" aria-hidden="true">02</span>
          <div>
            <p class="eyebrow">${copy.contractKicker}</p>
            <h2 id="contract-title">${copy.contractTitle}</h2>
            <p class="section-intro">${copy.contractIntro}</p>
          </div>
        </div>
        <div class="contract-grid">
          <pre><code>${escapeHtml(envelopeExample)}</code></pre>
          <dl class="field-list">
              ${fields}
          </dl>
        </div>
        <div class="interpretation">
          <h3>${copy.interpretationTitle}</h3>
          <ul>
              ${interpretation}
          </ul>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="examples-title">
      <div class="shell">
        <div class="section-heading">
          <span class="section-number" aria-hidden="true">03</span>
          <div>
            <p class="eyebrow">${copy.examplesKicker}</p>
            <h2 id="examples-title">${copy.examplesTitle}</h2>
            <p class="section-intro">${copy.examplesIntro}</p>
          </div>
        </div>
        <div class="code-grid">
          <article class="code-example">
            <h3>${copy.curlTitle}</h3>
            <p>${copy.curlText}</p>
            <pre><code>${escapeHtml(curlExample)}</code></pre>
          </article>
          <article class="code-example">
            <h3>${copy.jsTitle}</h3>
            <p>${copy.jsText}</p>
            <pre><code>${escapeHtml(jsExample)}</code></pre>
          </article>
          <article class="code-example wide">
            <h3>${copy.filterTitle}</h3>
            <p>${copy.filterText}</p>
            <pre><code>${escapeHtml(filterExample)}</code></pre>
          </article>
        </div>
      </div>
    </section>

    <section class="section paper" aria-labelledby="reuse-title">
      <div class="shell">
        <div class="section-heading">
          <span class="section-number" aria-hidden="true">04</span>
          <div>
            <p class="eyebrow">${copy.reuseKicker}</p>
            <h2 id="reuse-title">${copy.reuseTitle}</h2>
          </div>
        </div>
        <div class="reuse-grid">
          <article><h3>${copy.citationTitle}</h3><p>${copy.citation}</p></article>
          <article><h3>${copy.limitTitle}</h3><p>${copy.limitText}</p></article>
          <article><h3>${copy.maintenanceTitle}</h3><p>${copy.maintenanceText}</p></article>
        </div>
        <p class="contact">${copy.contact}: <a href="mailto:info@observatorioia.org">info@observatorioia.org</a></p>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="shell">
      <p>© 2026 ${copy.siteName}</p>
      <p><a href="/${locale}/quien-mantiene/">${copy.maintenanceTitle}</a> · <a href="/api/index.json">JSON manifest</a></p>
    </div>
  </footer>
</body>
</html>
`;
}

function applyAutoKpis(data: unknown, counters: Counters): unknown {
  if (!data || typeof data !== 'object') return data;
  const obj = data as {
    kpisHero?: Array<{
      label?: { es?: string };
      valor?: string;
      detalle?: KpiBilingual | string;
    }>;
  };
  const kpis = obj.kpisHero;
  if (!Array.isArray(kpis)) return data;
  for (const kpi of kpis) {
    if (kpi && kpi.valor === 'auto') {
      const labelEs = kpi.label?.es ?? '';
      const fn = KPI_AUTO[labelEs];
      if (fn) {
        const result = fn(counters, data);
        kpi.valor = result.valor;
        if (result.detalle) {
          kpi.detalle = result.detalle;
        }
      } else {
        console.warn(`  WARN: indicadores.kpisHero "${labelEs}" tiene valor:"auto" pero no hay computador definido en KPI_AUTO.`);
      }
    }
  }
  return data;
}

function writeCountersTs(counters: Counters): void {
  const lines = [
    '// AUTO-GENERATED by scripts/build-api.ts. Do not edit by hand.',
    '// Regenerate with `npm run build:api` (also runs as `prebuild`).',
    '',
    'export interface Counters {',
    '  proyectos: number;',
    '  iniciativasDocumentadas: number;',
    '  adopcionVerificada: number;',
    '  verificadasCatalogo: number;',
    '  seguimiento: number;',
    '  ecosistema: number;',
    '  descartadas: number;',
    '  pendientesMigracion: number;',
    '  instituciones: number;',
    '  legislacion: number;',
    '}',
    '',
    'export const COUNTERS: Counters = {',
    `  proyectos: ${counters.proyectos},`,
    `  iniciativasDocumentadas: ${counters.iniciativasDocumentadas},`,
    `  adopcionVerificada: ${counters.adopcionVerificada},`,
    `  verificadasCatalogo: ${counters.verificadasCatalogo},`,
    `  seguimiento: ${counters.seguimiento},`,
    `  ecosistema: ${counters.ecosistema},`,
    `  descartadas: ${counters.descartadas},`,
    `  pendientesMigracion: ${counters.pendientesMigracion},`,
    `  instituciones: ${counters.instituciones},`,
    `  legislacion: ${counters.legislacion},`,
    '};',
    '',
  ];
  writeFileSync(COUNTERS_TS, lines.join('\n'));
  console.log(
    '  ✓ src/data/counters.ts ' +
      `(documentadas=${counters.iniciativasDocumentadas}, ` +
      `adopción verificada=${counters.adopcionVerificada}, ` +
      `pendientes migración=${counters.pendientesMigracion})`,
  );
}

/**
 * Validates compatibility fields used by the current UI. Every entry still
 * needs `desde` while TimelineAdopcion depends on the legacy year. Legacy
 * entries also need a bilingual `resultado`; model v2 deliberately allows it
 * to be absent when no verified result exists, and the timeline already falls
 * back to the description in that case.
 *
 * Throws with a list of every offender — fixing one at a time gets
 * tedious when several break at once.
 */
function validateProyectos(): void {
  const srcPath = join(SRC_DIR, 'proyectos.json');
  if (!existsSync(srcPath)) {
    throw new Error(`validateProyectos: ${srcPath} no existe`);
  }
  const data = JSON.parse(readFileSync(srcPath, 'utf8')) as unknown;
  if (!Array.isArray(data)) {
    throw new Error('validateProyectos: proyectos.json no es un array');
  }

  const errors: string[] = [];
  for (const entry of data) {
    if (!entry || typeof entry !== 'object') {
      errors.push('  (entrada no-objeto en proyectos.json)');
      continue;
    }
    const p = entry as Record<string, unknown>;
    const id = typeof p.id === 'string' ? p.id : '(sin id)';

    const desde = p.desde;
    if (typeof desde !== 'string' || desde.trim() === '') {
      errors.push(`  - ${id}: falta campo "desde" (string no vacío)`);
    }

    const esModeloV2 = p.modeloVersion === 2;
    const resultado = p.resultado as Record<string, unknown> | undefined;
    if (!resultado || typeof resultado !== 'object') {
      if (!esModeloV2) {
        errors.push(`  - ${id}: ficha legacy sin "resultado" bilingüe`);
      }
    } else {
      for (const locale of ['es', 'en'] as const) {
        const v = resultado[locale];
        if (typeof v !== 'string' || v.trim() === '') {
          errors.push(`  - ${id}: "resultado.${locale}" vacío o no-string`);
        }
      }
    }
  }

  if (errors.length > 0) {
    const msg = [
      'validateProyectos FAILED — corregí proyectos.json antes de pushear:',
      ...errors,
      '',
      'Reglas: cada entrada debe tener `desde`; las fichas legacy también requieren `resultado` bilingüe.',
      'En modelo v2, `resultado` se omite cuando no hay resultados públicos verificados.',
      'Ver: src/data/json/proyectos.json + tooltips de TimelineAdopcion.',
    ].join('\n');
    throw new Error(msg);
  }
  console.log(
    `  ✓ validateProyectos: ${data.length} entradas con fecha base y resultados v2 opcionales`,
  );
}

function main(): void {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  validateProyectos();

  const counters = computeCounters(SRC_DIR);
  writeCountersTs(counters);

  const endpointsMeta: ApiIndexEndpoint[] = [];

  for (const ds of DATASETS) {
    const srcPath = join(SRC_DIR, ds.filename);
    if (!existsSync(srcPath)) {
      console.warn(`  skip: ${ds.filename} no existe`);
      continue;
    }
    let data = JSON.parse(readFileSync(srcPath, 'utf8')) as unknown;
    if (ds.filename === 'indicadores.json') {
      data = applyAutoKpis(data, counters);
    }
    const embeddedLastUpdate = findLatestEmbeddedEditorialDate(data);
    if (embeddedLastUpdate && embeddedLastUpdate > ds.lastUpdate) {
      throw new Error(
        `${ds.filename}: lastUpdate=${ds.lastUpdate} quedó atrás de una fecha editorial interna (${embeddedLastUpdate})`,
      );
    }
    const env = envelope(data, ds.lastUpdate, ds.getCount?.(data));
    writeFileSync(
      join(OUT_DIR, ds.outputFilename ?? ds.filename),
      JSON.stringify(env, null, 2),
    );
    endpointsMeta.push({
      endpoint: ds.endpoint,
      title: ds.title,
      description: ds.description,
      descriptionEs: ds.descriptionEs,
      descriptionEn: ds.descriptionEn,
      countUnit: ds.countUnit,
      count: env.count,
      lastUpdate: env.lastUpdate,
    });
    console.log(`  ✓ ${ds.endpoint} (${env.count} items)`);
  }

  // Manifest
  const manifest = {
    version: PKG.version,
    lastUpdate: endpointsMeta
      .map(({ lastUpdate }) => lastUpdate)
      .sort()
      .at(-1),
    source: 'https://observatorioia.org',
    license: 'CC BY 4.0',
    endpoints: endpointsMeta.map((e) => ({
      url: e.endpoint,
      description: e.description,
      count: e.count,
      lastUpdate: e.lastUpdate,
    })),
  };
  writeFileSync(join(OUT_DIR, 'index.json'), JSON.stringify(manifest, null, 2));
  console.log(`  ✓ /api/index.json (${endpointsMeta.length} endpoints)`);

  // HTML index humano
  writeFileSync(join(OUT_DIR, 'index.html'), buildIndexHtml(endpointsMeta, 'es'));
  const englishIndexDir = join(OUT_DIR, 'en');
  mkdirSync(englishIndexDir, { recursive: true });
  writeFileSync(join(englishIndexDir, 'index.html'), buildIndexHtml(endpointsMeta, 'en'));
  console.log(`  ✓ /api/index.html + /api/en/index.html`);
}

main();
