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
 * Genera además `/api/index.json` (manifest), documentación humana bilingüe,
 * schemas de respuesta y datos, una release bloqueable y descargas JSON/CSV
 * con checksums SHA-256.
 *
 * Correr: `npm run build:api` (incluido en `npm run build`).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { computeCounters, type Counters } from './lib/counters';
import {
  encontrarErroresCompletitudMetodologica,
  encontrarErroresTrazabilidad,
  esAdopcionVerificada,
  type CamposModeloEvidencia,
} from '../src/data/modelo-evidencia';

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, 'src', 'data', 'json');
const SCHEMA_SRC_DIR = join(ROOT, 'src', 'data', 'schemas');
const OUT_DIR = join(ROOT, 'public', 'api');
const SCHEMA_OUT_DIR = join(OUT_DIR, 'schemas');
const RELEASES_OUT_DIR = join(OUT_DIR, 'releases');
const DOWNLOADS_OUT_DIR = join(OUT_DIR, 'downloads');
const COUNTERS_TS = join(ROOT, 'src', 'data', 'counters.ts');
const PKG = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { version: string };

const DATA_RELEASE = {
  id: '2026-09-01-r11',
  date: '2026-09-01',
  title: {
    es: 'Corte R11 de actualización del catálogo',
    en: 'R11 catalog update release',
  },
} as const;
const RELEASE_LOCK_PATH = join(RELEASES_OUT_DIR, DATA_RELEASE.id, 'release.lock');

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
  schemaFilename?: string;
  endpoint: string;
  title: KpiBilingual;
  description: string;
  descriptionEs: string;
  descriptionEn: string;
  countUnit: KpiBilingual;
  /** Último cambio editorial real del dataset; nunca la hora de build. */
  lastUpdate: string;
  /** Las bitácoras rodantes no se duplican en cada release sustantiva. */
  publicationMode?: 'release' | 'rolling';
  getCount?: (data: unknown) => number;
}

const DATASETS: Dataset[] = [
  {
    filename: 'proyectos.json',
    endpoint: '/api/proyectos.json',
    title: { es: 'Iniciativas', en: 'Initiatives' },
    countUnit: { es: 'iniciativas', en: 'initiatives' },
    lastUpdate: '2026-09-01',
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
    lastUpdate: '2026-09-01',
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
    lastUpdate: '2026-09-01',
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
    lastUpdate: '2026-08-22',
    description:
      'Análisis comparado de siete capacidades no documentadas como operativas en el corpus público costarricense revisado, frente a referentes de Estonia y Singapur.',
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
    lastUpdate: '2026-09-01',
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
    lastUpdate: '2026-09-01',
    publicationMode: 'rolling',
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
  {
    filename: 'marcoPais.json',
    outputFilename: 'marco-pais.json',
    endpoint: '/api/marco-pais.json',
    title: { es: 'Marco país', en: 'Country framework' },
    countUnit: { es: 'secciones', en: 'sections' },
    lastUpdate: '2026-09-01',
    description:
      'Arquitectura pública del marco de IA en Costa Rica: capas, hitos, instrumentos y brechas operativas.',
    descriptionEs:
      'Arquitectura pública del marco de IA en Costa Rica, con capas, hitos, instrumentos, referencias relacionadas y brechas operativas.',
    descriptionEn:
      'Public architecture of Costa Rica\u2019s AI framework, including layers, milestones, instruments, related references and operational gaps.',
  },
  {
    filename: 'changelog.json',
    outputFilename: 'historial.json',
    endpoint: '/api/historial.json',
    title: { es: 'Historial editorial', en: 'Editorial history' },
    countUnit: { es: 'cambios publicados', en: 'published changes' },
    lastUpdate: '2026-09-01',
    description:
      'Bitácora pública y bilingüe de cambios editoriales con fecha, tipo, fuente y commit cuando está disponible.',
    descriptionEs:
      'Bitácora pública y bilingüe de cambios editoriales, con fecha, tipo, fuente y commit cuando está disponible.',
    descriptionEn:
      'Public bilingual log of editorial changes, with date, type, source and commit when available.',
  },
  {
    filename: 'coyuntura.json',
    endpoint: '/api/coyuntura.json',
    title: { es: 'Coyuntura', en: 'Current affairs' },
    countUnit: { es: 'notas', en: 'notes' },
    lastUpdate: '2026-08-23',
    description:
      'Notas editoriales fechadas y trazables que aportan contexto sin sustituir estados o afirmaciones oficiales.',
    descriptionEs:
      'Notas editoriales fechadas y trazables que aportan contexto público sin sustituir el estado oficial de expedientes o iniciativas.',
    descriptionEn:
      'Dated, traceable editorial notes that add public context without replacing official bill or initiative status.',
  },
  {
    filename: 'recursos.json',
    endpoint: '/api/recursos.json',
    title: { es: 'Recursos y fuentes', en: 'Resources and sources' },
    countUnit: { es: 'recursos', en: 'resources' },
    lastUpdate: '2026-08-22',
    description:
      'Directorio con IDs estables de documentos, normas, indicadores y fuentes utilizados por el observatorio.',
    descriptionEs:
      'Directorio con IDs estables de documentos, normas, indicadores y fuentes utilizados por el observatorio.',
    descriptionEn:
      'Directory with stable IDs for documents, regulations, indicators and sources used by the observatory.',
  },
  {
    filename: 'apiCodebook.json',
    outputFilename: 'codebook.json',
    endpoint: '/api/codebook.json',
    title: { es: 'Codebook y metodología', en: 'Codebook and methodology' },
    countUnit: { es: 'datasets documentados', en: 'documented datasets' },
    lastUpdate: '2026-08-24',
    description:
      'Diccionario bilingüe del contrato, vocabularios, regla de adopción verificada, procedencia y límites de interpretación.',
    descriptionEs:
      'Diccionario bilingüe del contrato, vocabularios controlados, regla de adopción verificada, procedencia y límites de interpretación.',
    descriptionEn:
      'Bilingual dictionary for the contract, controlled vocabularies, verified-adoption rule, provenance and interpretation limits.',
    getCount: (data) => {
      const count = (data as { datasets?: unknown[] } | undefined)?.datasets?.length;
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
  id: string;
  endpoint: string;
  title: KpiBilingual;
  description: string;
  descriptionEs: string;
  descriptionEn: string;
  countUnit: KpiBilingual;
  count: number;
  lastUpdate: string;
  schemaUrl: string;
  dataSchemaUrl: string;
  publicationMode: 'release' | 'rolling';
  releaseUrl?: string;
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
      'Once colecciones de evidencia y un codebook documentan el catálogo, la política pública, las fuentes y el trabajo editorial del observatorio.',
    audience:
      'Una interfaz de lectura para periodistas, investigadores, desarrolladores y organizaciones que necesitan examinar o reutilizar la evidencia del observatorio.',
    facts: [
      { value: '__DATASET_COUNT__', label: 'rutas JSON documentadas' },
      { value: 'CC BY 4.0', label: 'licencia de datos' },
      { value: 'GET', label: 'lectura sin autenticación' },
    ],
    quickKicker: 'Consulta inmediata',
    quickTitle: 'Empiece con el catálogo',
    quickText:
      'No requiere una cuenta ni una llave. La respuesta incluye los datos y la fecha editorial del último cambio conocido.',
    collectionsKicker: '01 / Colecciones',
    collectionsTitle: 'Doce rutas, un contrato estable',
    collectionsIntro:
      'El conteo describe la unidad propia de cada archivo. No debe sumarse entre colecciones ni interpretarse por sí solo como adopción verificada de IA.',
    countLabel: 'Contenido',
    updatedLabel: 'Corte editorial',
    openLabel: 'Abrir JSON',
    schemaLabel: 'Ver schema',
    publicationLabel: 'Publicación',
    rollingLabel: 'Bitácora rodante',
    manifestTitle: 'Manifest de la API',
    manifestText:
      'Use el manifest para descubrir programáticamente todos los endpoints, sus conteos y fechas editoriales.',
    infrastructureTitle: 'Validar, reproducir y descargar',
    infrastructureText:
      'Los schemas públicos, la release sustantiva y las descargas con checksum permiten repetir un análisis. La bitácora de monitoreo se identifica aparte como rodante.',
    schemasTitle: 'Índice de schemas',
    releaseTitle: 'Release R11',
    downloadsTitle: 'Descargas y CSV',
    downloadFilesLabel: 'Archivos directos de la release',
    bundleTitle: 'Bundle JSON completo',
    projectsCsvTitle: 'Proyectos CSV',
    legislationCsvTitle: 'Legislación CSV',
    eniaCsvTitle: 'Intervenciones ENIA CSV',
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
      'No aplica significa que una dimensión no corresponde al tipo de iniciativa documentada; no expresa una investigación pendiente.',
      'Las fuentes indican qué dimensiones respaldan. Confirmar ejecución exige al menos una fuente primaria oficial o de acceso a la información; la prensa y las fuentes de proveedores solo pueden complementar ese respaldo.',
    ],
    examplesKicker: '03 / Consultar',
    examplesTitle: 'Ejemplos reproducibles',
    examplesIntro:
      'Las rutas son archivos estáticos. Funcionan desde una terminal, un cuaderno de análisis, una hoja de cálculo con importación JSON o cualquier cliente HTTP.',
    curlTitle: 'Descargar el catálogo',
    curlText: 'Obtiene la envoltura completa de iniciativas.',
    filterTitle: 'Reproducir la adopción verificada',
    filterText:
      'Aplica las condiciones sustantivas publicadas en el codebook. La exportación ya pasó la validación de trazabilidad que completa la regla.',
    jsTitle: 'Consumir desde JavaScript',
    jsText: 'Lee datos y fecha editorial sin depender del orden de los campos.',
    reuseKicker: '04 / Reutilizar',
    reuseTitle: 'Atribución, límites y contacto',
    citationTitle: 'Cómo citar',
    citation:
      'Observatorio IA Costa Rica, conjunto consultado, release o fecha de corte editorial y URL directa del endpoint. CC BY 4.0 cubre la compilación; cada documento fuente conserva sus propios términos.',
    limitTitle: 'Qué no afirma la API',
    limitText:
      'El catálogo incluye adopciones verificadas, iniciativas en seguimiento y capacidades del ecosistema. El total de iniciativas documentadas no equivale al número de sistemas de IA operativos.',
    maintenanceTitle: 'Mantenimiento editorial',
    maintenanceText:
      'Los monitores generan señales. Ningún scraper crea, reclasifica ni verifica una iniciativa automáticamente; la bitácora rodante registra revisiones aprobadas y los cambios sustantivos requieren una nueva release.',
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
      'Eleven evidence collections and one codebook document the catalog, public policy, sources and the observatory\u2019s editorial work.',
    audience:
      'A human-readable interface for journalists, researchers, developers and organizations that need to examine or reuse the observatory\u2019s evidence.',
    facts: [
      { value: '__DATASET_COUNT__', label: 'documented JSON routes' },
      { value: 'CC BY 4.0', label: 'data license' },
      { value: 'GET', label: 'read access without authentication' },
    ],
    quickKicker: 'Immediate query',
    quickTitle: 'Start with the catalog',
    quickText:
      'No account or API key is required. The response includes both the data and the editorial date of the latest known change.',
    collectionsKicker: '01 / Collections',
    collectionsTitle: 'Twelve routes, one stable contract',
    collectionsIntro:
      'Each count uses the unit declared for that file. Counts should not be added across collections or treated on their own as verified AI adoption.',
    countLabel: 'Contents',
    updatedLabel: 'Editorial cutoff',
    openLabel: 'Open JSON',
    schemaLabel: 'View schema',
    publicationLabel: 'Publication',
    rollingLabel: 'Rolling log',
    manifestTitle: 'API manifest',
    manifestText:
      'Use the manifest to discover every endpoint programmatically, together with counts and editorial dates.',
    infrastructureTitle: 'Validate, reproduce and download',
    infrastructureText:
      'Public schemas, the substantive release and checksum-backed downloads support reproducible analysis. The monitoring log is identified separately as rolling.',
    schemasTitle: 'Schema index',
    releaseTitle: 'R11 release',
    downloadsTitle: 'Downloads and CSV',
    downloadFilesLabel: 'Direct release files',
    bundleTitle: 'Complete JSON bundle',
    projectsCsvTitle: 'Projects CSV',
    legislationCsvTitle: 'Legislation CSV',
    eniaCsvTitle: 'ENIA interventions CSV',
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
      'Not applicable means a dimension does not correspond to the documented initiative type; it is not an open research gap.',
      'Sources identify the dimensions they support. Confirming execution requires at least one official primary or freedom-of-information source; news and vendor sources may only supplement that evidence.',
    ],
    examplesKicker: '03 / Query',
    examplesTitle: 'Reproducible examples',
    examplesIntro:
      'These routes are static files. They work from a terminal, an analysis notebook, a spreadsheet with JSON import or any HTTP client.',
    curlTitle: 'Download the catalog',
    curlText: 'Returns the complete initiatives envelope.',
    filterTitle: 'Reproduce verified adoption',
    filterText:
      'Applies the substantive conditions published in the codebook. The export has already passed the traceability validation that completes the rule.',
    jsTitle: 'Consume from JavaScript',
    jsText: 'Reads data and editorial date without relying on field order.',
    reuseKicker: '04 / Reuse',
    reuseTitle: 'Attribution, limits and contact',
    citationTitle: 'How to cite',
    citation:
      'AI Observatory Costa Rica, dataset consulted, release or editorial cutoff date and direct endpoint URL. CC BY 4.0 covers the compilation; each source document retains its own terms.',
    limitTitle: 'What the API does not claim',
    limitText:
      'The catalog includes verified adoptions, initiatives under review and ecosystem capabilities. The total number of documented initiatives is not the number of operational AI systems.',
    maintenanceTitle: 'Editorial maintenance',
    maintenanceText:
      'Monitors generate signals. No scraper creates, reclassifies or verifies an initiative automatically; the rolling log records approved reviews and substantive changes require a new release.',
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
              <div><dt>Schema</dt><dd><a href="${endpoint.schemaUrl}">${copy.schemaLabel}</a></dd></div>
              <div><dt>${copy.publicationLabel}</dt><dd>${endpoint.releaseUrl
                ? `<a href="${endpoint.releaseUrl}">${DATA_RELEASE.id}</a>`
                : escapeHtml(copy.rollingLabel)}</dd></div>
            </dl>
          </article>
        </li>`;
    })
    .join('\n');

  const facts = copy.facts
    .map(({ value, label }) => {
      const renderedValue = value === '__DATASET_COUNT__' ? String(endpoints.length) : value;
      return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(renderedValue)}</dd></div>`;
    })
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
  jq '.data[] |
    select(.modeloVersion == 2) |
    select(.estadoCatalogo == "verificado") |
    select(.tipoIniciativa == "sistema-ia" or
           .tipoIniciativa == "componente-ia") |
    select(.faseImplementacion == "piloto" or
           .faseImplementacion == "operativo") |
    select(.estadoIA == "confirmada") |
    select(.evaluacion.tecnicaIA.estado == "confirmado") |
    select(.evaluacion.ejecucion.estado == "confirmado") |
    select(. as $iniciativa |
      [.fuentes[] |
        select(
          (.tipoFuente == "primaria-oficial" or
           .tipoFuente == "acceso-informacion") and
          (.respalda | index("ejecucion")) and
          (.id as $fuenteId |
            $iniciativa.evaluacion.ejecucion.fuenteIds |
            index($fuenteId))
        )
      ] | length > 0
    ) |
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
    .endpoint-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr)); gap: 1rem; margin: 1.35rem 0 0; }
    .endpoint-meta div { border-left: 1px solid var(--rule); padding-left: .8rem; }
    .endpoint-meta dt { color: var(--muted); font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .endpoint-meta dd { margin: .2rem 0 0; color: var(--ink); font-size: .85rem; }
    .manifest { display: grid; grid-template-columns: 3.25rem minmax(0, 1fr); gap: 1rem; margin-top: 1.5rem; padding-block: 1.5rem; border-bottom: 1px solid var(--rule); }
    .manifest p { margin: .35rem 0 0; color: var(--muted); }
    .infrastructure { margin-top: 2rem; border-top: 1px solid var(--rule); }
    .infrastructure > header { padding-block: 1.5rem; border-bottom: 1px solid var(--rule); }
    .infrastructure > header h3 { font-family: var(--serif); font-size: 1.5rem; }
    .infrastructure > header p { max-width: 52rem; margin: .5rem 0 0; color: var(--muted); }
    .infrastructure-links { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .infrastructure-links a { display: block; padding: 1.35rem 1.2rem 1.35rem 0; border-bottom: 1px solid var(--rule); font-weight: 750; }
    .infrastructure-links a + a { border-left: 1px solid var(--rule); padding-left: 1.2rem; }
    .download-files { display: flex; flex-wrap: wrap; gap: .55rem 1.25rem; margin: 1.25rem 0 0; padding: 0; list-style: none; }
    .download-files a { font-size: .82rem; font-weight: 700; }
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
      .hero-grid, .contract-grid, .code-grid, .reuse-grid, .infrastructure-links { grid-template-columns: 1fr; }
      .hero-grid { gap: 3rem; }
      .endpoint-heading { align-items: flex-start; }
      .open-label { display: none; }
      .code-example.wide { grid-column: auto; }
      .code-example p { min-height: 0; }
      .interpretation ul { grid-template-columns: 1fr; }
      .reuse-grid article + article { border-left: 0; padding-left: 0; }
      .infrastructure-links a + a { border-left: 0; padding-left: 0; }
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
        <aside class="infrastructure" aria-labelledby="infrastructure-title">
          <header>
            <h3 id="infrastructure-title">${copy.infrastructureTitle}</h3>
            <p>${copy.infrastructureText}</p>
          </header>
          <nav class="infrastructure-links" aria-label="${copy.infrastructureTitle}">
            <a href="/api/schemas/index.json">${copy.schemasTitle}<span aria-hidden="true"> ↗</span></a>
            <a href="/api/releases/${DATA_RELEASE.id}/release.json">${copy.releaseTitle}<span aria-hidden="true"> ↗</span></a>
            <a href="/api/downloads/index.json">${copy.downloadsTitle}<span aria-hidden="true"> ↗</span></a>
          </nav>
          <ul class="download-files" aria-label="${copy.downloadFilesLabel}">
            <li><a download href="/api/downloads/observatorio-ia-${DATA_RELEASE.id}.json">${copy.bundleTitle}</a></li>
            <li><a download href="/api/downloads/proyectos-${DATA_RELEASE.id}.csv">${copy.projectsCsvTitle}</a></li>
            <li><a download href="/api/downloads/legislacion-${DATA_RELEASE.id}.csv">${copy.legislationCsvTitle}</a></li>
            <li><a download href="/api/downloads/enia-intervenciones-${DATA_RELEASE.id}.csv">${copy.eniaCsvTitle}</a></li>
          </ul>
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

function applyCodebookPublicationModes(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;
  const codebook = data as { datasets?: Array<{ endpoint?: string; publicationMode?: string }> };
  if (!Array.isArray(codebook.datasets)) return data;
  const modes = new Map(
    DATASETS.map((dataset) => [dataset.endpoint, dataset.publicationMode ?? 'release']),
  );
  for (const dataset of codebook.datasets) {
    const mode = dataset.endpoint ? modes.get(dataset.endpoint) : undefined;
    if (mode) dataset.publicationMode = mode;
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
    if (esModeloV2) {
      const iniciativa = p as unknown as CamposModeloEvidencia;
      for (const error of encontrarErroresTrazabilidad(iniciativa)) {
        errors.push(`  - ${id}: trazabilidad: ${error}`);
      }
      for (const error of encontrarErroresCompletitudMetodologica(iniciativa)) {
        errors.push(`  - ${id}: completitud metodológica: ${error}`);
      }
      if (p.estadoCatalogo === 'verificado' && !esAdopcionVerificada(iniciativa)) {
        errors.push(
          `  - ${id}: estadoCatalogo=verificado no satisface la regla de adopción verificada`,
        );
      }
    }

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
      'Reglas: cada entrada debe tener `desde`; las fichas v2 deben cumplir trazabilidad, seguimiento de vacíos y el contrato de adopción verificada.',
      'Las fichas legacy también requieren `resultado` bilingüe.',
      'En modelo v2, `resultado` se omite cuando no hay resultados públicos verificados.',
      'Ver: src/data/json/proyectos.json + tooltips de TimelineAdopcion.',
    ].join('\n');
    throw new Error(msg);
  }
  console.log(
    `  ✓ validateProyectos: ${data.length} entradas con trazabilidad, vacíos y regla de adopción validados`,
  );
}

interface GeneratedDataset {
  config: Dataset;
  id: string;
  outputFilename: string;
  schemaOutputFilename: string;
  dataSchemaOutputFilename: string;
  schemaUrl: string;
  dataSchemaUrl: string;
  releaseUrl?: string;
  envelope: ApiEnvelope<unknown>;
  serialized: string;
  endpointSchemaSerialized: string;
  dataSchemaSerialized: string;
}

interface DownloadArtifact {
  url: string;
  format: 'json' | 'csv';
  bytes: number;
  sha256: string;
  rows?: number;
  description: KpiBilingual;
}

function outputFilenameFor(ds: Dataset): string {
  return ds.outputFilename ?? ds.filename;
}

function datasetIdFor(ds: Dataset): string {
  return outputFilenameFor(ds).replace(/\.json$/, '');
}

function schemaSourceFilenameFor(ds: Dataset): string {
  return ds.schemaFilename ?? ds.filename.replace(/\.json$/, '.schema.json');
}

function schemaOutputFilenameFor(ds: Dataset): string {
  return outputFilenameFor(ds).replace(/\.json$/, '.schema.json');
}

function dataSchemaOutputFilenameFor(ds: Dataset): string {
  return outputFilenameFor(ds).replace(/\.json$/, '-data.schema.json');
}

function buildEndpointSchema(
  ds: Dataset,
  schemaUrl: string,
  dataSchemaUrl: string,
  dataSchemaSerialized: string,
): string {
  const parsed = JSON.parse(dataSchemaSerialized) as Record<string, unknown>;
  const rawDefinitions =
    parsed.definitions && typeof parsed.definitions === 'object'
      ? (parsed.definitions as Record<string, unknown>)
      : {};
  if ('_dataset' in rawDefinitions) {
    throw new Error(`${ds.filename}: el schema fuente ya usa la definición reservada _dataset`);
  }
  const {
    $schema: _sourceDraft,
    $id: _sourceId,
    definitions: _sourceDefinitions,
    ...datasetShape
  } = parsed;

  return JSON.stringify(
    {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: `https://observatorioia.org${schemaUrl}`,
      title: `${ds.title.es} / ${ds.title.en}`,
      description:
        'Schema de la respuesta pública completa; el campo data también se publica por separado. / Full public-response schema; the data field schema is also published separately.',
      type: 'object',
      required: ['version', 'lastUpdate', 'count', 'source', 'license', 'data'],
      additionalProperties: false,
      properties: {
        version: { type: 'string', minLength: 1 },
        lastUpdate: { type: 'string', format: 'date-time' },
        count: { type: 'integer', minimum: 0 },
        source: { const: 'https://observatorioia.org' },
        license: { const: 'CC BY 4.0' },
        data: { $ref: '#/definitions/_dataset' },
      },
      definitions: {
        ...rawDefinitions,
        _dataset: datasetShape,
      },
      'x-observatorio-data-schema': dataSchemaUrl,
    },
    null,
    2,
  );
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function bytes(value: string): number {
  return Buffer.byteLength(value, 'utf8');
}

function writeJson(path: string, value: unknown): string {
  const serialized = JSON.stringify(value, null, 2);
  writeFileSync(path, serialized);
  return serialized;
}

/**
 * Durante la preparación de una release todavía sin lock, permite regenerar
 * artefactos. Una vez versionado `release.lock`, cualquier divergencia falla y
 * obliga a abrir un DATA_RELEASE.id nuevo.
 */
function writeImmutableText(path: string, value: string): void {
  if (existsSync(path)) {
    const previous = readFileSync(path, 'utf8');
    if (previous !== value && existsSync(RELEASE_LOCK_PATH)) {
      throw new Error(
        `La release ${DATA_RELEASE.id} es inmutable y ${path} ya contiene otro contenido. ` +
          'Cree un nuevo DATA_RELEASE.id antes de publicar un corte distinto.',
      );
    }
    if (previous === value) return;
  }
  writeFileSync(path, value);
}

function writeImmutableJson(path: string, value: unknown): string {
  const serialized = JSON.stringify(value, null, 2);
  writeImmutableText(path, serialized);
  return serialized;
}

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function serializeCsv(headers: string[], rows: Array<Record<string, unknown>>): string {
  const lines = [
    headers.map(csvCell).join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ];
  return `${lines.join('\n')}\n`;
}

function datasetById(generated: GeneratedDataset[], id: string): GeneratedDataset {
  const dataset = generated.find((item) => item.id === id);
  if (!dataset) throw new Error(`Dataset generado no encontrado: ${id}`);
  return dataset;
}

function buildCsvArtifacts(generated: GeneratedDataset[]): DownloadArtifact[] {
  const artifacts: DownloadArtifact[] = [];

  const proyectos = datasetById(generated, 'proyectos').envelope.data as Array<{
    id: string;
    titulo: KpiBilingual;
    institucionId: string;
    categoria: string;
    tipoIniciativa?: string;
    estadoCatalogo?: string;
    faseImplementacion?: string;
    estadoIA?: string;
    desde?: string;
    fechaPrimeraEvidencia?: string;
    fechaUltimaVerificacion?: string;
    fuentes?: unknown[];
    resultadosVerificados?: unknown[];
  }>;
  const proyectosRows = proyectos.map((proyecto) => ({
    id: proyecto.id,
    titulo_es: proyecto.titulo.es,
    titulo_en: proyecto.titulo.en,
    institucion_id: proyecto.institucionId,
    categoria: proyecto.categoria,
    tipo_iniciativa: proyecto.tipoIniciativa,
    estado_catalogo: proyecto.estadoCatalogo,
    fase_implementacion: proyecto.faseImplementacion,
    estado_ia: proyecto.estadoIA,
    desde: proyecto.desde,
    fecha_primera_evidencia: proyecto.fechaPrimeraEvidencia,
    fecha_ultima_verificacion: proyecto.fechaUltimaVerificacion,
    fuentes: proyecto.fuentes?.length ?? 0,
    resultados_verificados: proyecto.resultadosVerificados?.length ?? 0,
    url_es: `https://observatorioia.org/es/proyectos/${proyecto.id}/`,
    url_en: `https://observatorioia.org/en/proyectos/${proyecto.id}/`,
  }));
  const proyectosHeaders = Object.keys(proyectosRows[0] ?? {});
  const proyectosCsv = serializeCsv(proyectosHeaders, proyectosRows);
  const proyectosFilename = `proyectos-${DATA_RELEASE.id}.csv`;
  writeImmutableText(join(DOWNLOADS_OUT_DIR, proyectosFilename), proyectosCsv);
  artifacts.push({
    url: `/api/downloads/${proyectosFilename}`,
    format: 'csv',
    bytes: bytes(proyectosCsv),
    sha256: sha256(proyectosCsv),
    rows: proyectosRows.length,
    description: {
      es: 'Catálogo de iniciativas aplanado para hojas de cálculo.',
      en: 'Flattened initiative catalog for spreadsheets.',
    },
  });

  const legislacion = datasetById(generated, 'legislacion').envelope.data as Array<{
    numero: string;
    titulo: KpiBilingual;
    resumen: KpiBilingual;
    estado: string;
    alcanceIA: string;
    comision: KpiBilingual;
    presentado: string;
    fuenteUrl: string;
    fuenteEstadoUrl: string;
    fechaUltimaVerificacion: string;
  }>;
  const legislacionRows = legislacion.map((expediente) => ({
    numero: expediente.numero,
    titulo_es: expediente.titulo.es,
    titulo_en: expediente.titulo.en,
    resumen_es: expediente.resumen.es,
    resumen_en: expediente.resumen.en,
    estado: expediente.estado,
    alcance_ia: expediente.alcanceIA,
    comision_es: expediente.comision.es,
    comision_en: expediente.comision.en,
    presentado: expediente.presentado,
    referencia_complementaria: expediente.fuenteUrl,
    fuente_estado_oficial: expediente.fuenteEstadoUrl,
    fecha_ultima_verificacion: expediente.fechaUltimaVerificacion,
  }));
  const legislacionHeaders = Object.keys(legislacionRows[0] ?? {});
  const legislacionCsv = serializeCsv(legislacionHeaders, legislacionRows);
  const legislacionFilename = `legislacion-${DATA_RELEASE.id}.csv`;
  writeImmutableText(join(DOWNLOADS_OUT_DIR, legislacionFilename), legislacionCsv);
  artifacts.push({
    url: `/api/downloads/${legislacionFilename}`,
    format: 'csv',
    bytes: bytes(legislacionCsv),
    sha256: sha256(legislacionCsv),
    rows: legislacionRows.length,
    description: {
      es: 'Expedientes legislativos aplanados con fuente de contenido y estado oficial.',
      en: 'Flattened legislative bills with content and official-status sources.',
    },
  });

  const enia = datasetById(generated, 'enia-acciones').envelope.data as {
    resultados: Array<{
      codigo: string;
      eje: { numero: number; nombre: KpiBilingual };
      lineaAccion: { codigo: string; nombre: KpiBilingual };
      resultadoEsperado: KpiBilingual;
      intervenciones: Array<{
        id: string;
        paginaPlan: number;
        intervencionEstrategicaFuenteEs: string;
        objetivoFuenteEs: string;
        responsableOficial: string;
        estadoEjecucion: string;
        fechaUltimaRevision: string;
        cruceCatalogo: { estado: string; proyectoIds: string[] };
        indicadores: unknown[];
      }>;
    }>;
  };
  const eniaRows = enia.resultados.flatMap((resultado) =>
    resultado.intervenciones.map((intervencion) => ({
      resultado_codigo: resultado.codigo,
      eje_numero: resultado.eje.numero,
      eje_es: resultado.eje.nombre.es,
      eje_en: resultado.eje.nombre.en,
      linea_accion_codigo: resultado.lineaAccion.codigo,
      linea_accion_es: resultado.lineaAccion.nombre.es,
      linea_accion_en: resultado.lineaAccion.nombre.en,
      resultado_esperado_es: resultado.resultadoEsperado.es,
      resultado_esperado_en: resultado.resultadoEsperado.en,
      intervencion_id: intervencion.id,
      pagina_plan: intervencion.paginaPlan,
      intervencion_fuente_es: intervencion.intervencionEstrategicaFuenteEs,
      objetivo_fuente_es: intervencion.objetivoFuenteEs,
      responsable_oficial: intervencion.responsableOficial,
      estado_ejecucion: intervencion.estadoEjecucion,
      cruce_catalogo_estado: intervencion.cruceCatalogo.estado,
      proyecto_ids: intervencion.cruceCatalogo.proyectoIds.join('|'),
      indicadores: intervencion.indicadores.length,
      fecha_ultima_revision: intervencion.fechaUltimaRevision,
    })),
  );
  const eniaHeaders = Object.keys(eniaRows[0] ?? {});
  const eniaCsv = serializeCsv(eniaHeaders, eniaRows);
  const eniaFilename = `enia-intervenciones-${DATA_RELEASE.id}.csv`;
  writeImmutableText(join(DOWNLOADS_OUT_DIR, eniaFilename), eniaCsv);
  artifacts.push({
    url: `/api/downloads/${eniaFilename}`,
    format: 'csv',
    bytes: bytes(eniaCsv),
    sha256: sha256(eniaCsv),
    rows: eniaRows.length,
    description: {
      es: 'Los 129 registros del Plan de Acción ENIA aplanados para análisis tabular.',
      en: 'All 129 ENIA Action Plan source records flattened for tabular analysis.',
    },
  });

  return artifacts;
}

function writeSchemas(generated: GeneratedDataset[]): string {
  mkdirSync(SCHEMA_OUT_DIR, { recursive: true });
  const schemas = generated.map((dataset) => {
    writeFileSync(
      join(SCHEMA_OUT_DIR, dataset.schemaOutputFilename),
      dataset.endpointSchemaSerialized,
    );
    writeFileSync(
      join(SCHEMA_OUT_DIR, dataset.dataSchemaOutputFilename),
      dataset.dataSchemaSerialized,
    );
    return {
      datasetId: dataset.id,
      url: dataset.schemaUrl,
      dataSchemaUrl: dataset.dataSchemaUrl,
      draft: 'http://json-schema.org/draft-07/schema#',
      bytes: bytes(dataset.endpointSchemaSerialized),
      sha256: sha256(dataset.endpointSchemaSerialized),
      dataSchemaBytes: bytes(dataset.dataSchemaSerialized),
      dataSchemaSha256: sha256(dataset.dataSchemaSerialized),
    };
  });
  return writeJson(join(SCHEMA_OUT_DIR, 'index.json'), {
    version: PKG.version,
    releaseId: DATA_RELEASE.id,
    lastUpdate: normalizeLastUpdate(DATA_RELEASE.date),
    source: 'https://observatorioia.org',
    license: 'CC BY 4.0',
    schemas,
  });
}

function writeRelease(generated: GeneratedDataset[]): {
  manifestUrl: string;
  releaseIndexUrl: string;
} {
  mkdirSync(RELEASES_OUT_DIR, { recursive: true });
  const releaseDir = join(RELEASES_OUT_DIR, DATA_RELEASE.id);
  const releaseSchemaDir = join(releaseDir, 'schemas');
  mkdirSync(releaseSchemaDir, { recursive: true });

  const releaseGenerated = generated.filter(
    ({ config }) => (config.publicationMode ?? 'release') === 'release',
  );
  const rollingDatasets = generated
    .filter(({ config }) => config.publicationMode === 'rolling')
    .map((dataset) => ({
      id: dataset.id,
      url: dataset.config.endpoint,
      schemaUrl: dataset.schemaUrl,
      dataSchemaUrl: dataset.dataSchemaUrl,
    }));
  const datasets = releaseGenerated.map((dataset) => {
    writeImmutableText(join(releaseDir, dataset.outputFilename), dataset.serialized);
    writeImmutableText(
      join(releaseSchemaDir, dataset.schemaOutputFilename),
      dataset.endpointSchemaSerialized,
    );
    writeImmutableText(
      join(releaseSchemaDir, dataset.dataSchemaOutputFilename),
      dataset.dataSchemaSerialized,
    );
    return {
      id: dataset.id,
      url: `/api/releases/${DATA_RELEASE.id}/${dataset.outputFilename}`,
      schemaUrl: `/api/releases/${DATA_RELEASE.id}/schemas/${dataset.schemaOutputFilename}`,
      dataSchemaUrl: `/api/releases/${DATA_RELEASE.id}/schemas/${dataset.dataSchemaOutputFilename}`,
      count: dataset.envelope.count,
      lastUpdate: dataset.envelope.lastUpdate,
      bytes: bytes(dataset.serialized),
      sha256: sha256(dataset.serialized),
      schemaSha256: sha256(dataset.endpointSchemaSerialized),
      dataSchemaSha256: sha256(dataset.dataSchemaSerialized),
    };
  });

  const releaseManifest = {
    id: DATA_RELEASE.id,
    date: DATA_RELEASE.date,
    title: DATA_RELEASE.title,
    immutable: true,
    applicationVersion: PKG.version,
    source: 'https://observatorioia.org',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    datasets,
    rollingDatasets,
  };
  const releaseManifestPath = join(releaseDir, 'release.json');
  const releaseSerialized = writeImmutableJson(releaseManifestPath, releaseManifest);
  const manifestUrl = `/api/releases/${DATA_RELEASE.id}/release.json`;

  const releaseIndexPath = join(RELEASES_OUT_DIR, 'index.json');
  let previous: Array<Record<string, unknown>> = [];
  if (existsSync(releaseIndexPath)) {
    const parsed = JSON.parse(readFileSync(releaseIndexPath, 'utf8')) as {
      releases?: Array<Record<string, unknown>>;
    };
    previous = Array.isArray(parsed.releases) ? parsed.releases : [];
  }
  const current = {
    id: DATA_RELEASE.id,
    date: DATA_RELEASE.date,
    title: DATA_RELEASE.title,
    manifestUrl,
    datasets: datasets.length,
    bytes: bytes(releaseSerialized),
    sha256: sha256(releaseSerialized),
  };
  const releases = [
    ...previous.filter((release) => release.id !== DATA_RELEASE.id),
    current,
  ].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  writeJson(releaseIndexPath, {
    latest: DATA_RELEASE.id,
    source: 'https://observatorioia.org',
    license: 'CC BY 4.0',
    releases,
  });

  return { manifestUrl, releaseIndexUrl: '/api/releases/index.json' };
}

function writeDownloads(generated: GeneratedDataset[]): string {
  mkdirSync(DOWNLOADS_OUT_DIR, { recursive: true });
  const releaseGenerated = generated.filter(
    ({ config }) => (config.publicationMode ?? 'release') === 'release',
  );
  const bundle = {
    release: {
      id: DATA_RELEASE.id,
      date: DATA_RELEASE.date,
      applicationVersion: PKG.version,
      source: 'https://observatorioia.org',
      license: 'CC BY 4.0',
    },
    datasets: Object.fromEntries(
      releaseGenerated.map((dataset) => [dataset.id, dataset.envelope]),
    ),
  };
  const bundleFilename = `observatorio-ia-${DATA_RELEASE.id}.json`;
  const bundleSerialized = writeImmutableJson(
    join(DOWNLOADS_OUT_DIR, bundleFilename),
    bundle,
  );
  const artifacts: DownloadArtifact[] = [
    {
      url: `/api/downloads/${bundleFilename}`,
      format: 'json',
      bytes: bytes(bundleSerialized),
      sha256: sha256(bundleSerialized),
      description: {
        es: 'Bundle completo con las envolturas de todos los datasets de la release.',
        en: 'Complete bundle containing every dataset envelope in the release.',
      },
    },
    ...buildCsvArtifacts(releaseGenerated),
  ];
  writeJson(join(DOWNLOADS_OUT_DIR, 'index.json'), {
    releaseId: DATA_RELEASE.id,
    date: DATA_RELEASE.date,
    source: 'https://observatorioia.org',
    license: 'CC BY 4.0',
    files: artifacts,
  });
  return '/api/downloads/index.json';
}

function main(): void {
  mkdirSync(OUT_DIR, { recursive: true });

  validateProyectos();

  const counters = computeCounters(SRC_DIR);
  writeCountersTs(counters);

  const endpointsMeta: ApiIndexEndpoint[] = [];
  const generated: GeneratedDataset[] = [];

  for (const ds of DATASETS) {
    const srcPath = join(SRC_DIR, ds.filename);
    const schemaSourcePath = join(SCHEMA_SRC_DIR, schemaSourceFilenameFor(ds));
    if (!existsSync(srcPath)) {
      throw new Error(`Dataset público no encontrado: ${srcPath}`);
    }
    if (!existsSync(schemaSourcePath)) {
      throw new Error(`Schema público no encontrado: ${schemaSourcePath}`);
    }

    let data = JSON.parse(readFileSync(srcPath, 'utf8')) as unknown;
    if (ds.filename === 'indicadores.json') {
      data = applyAutoKpis(data, counters);
    }
    if (ds.filename === 'apiCodebook.json') {
      data = applyCodebookPublicationModes(data);
    }
    const embeddedLastUpdate = findLatestEmbeddedEditorialDate(data);
    const publicationMode = ds.publicationMode ?? 'release';
    if (publicationMode === 'release' && embeddedLastUpdate && embeddedLastUpdate > ds.lastUpdate) {
      throw new Error(
        `${ds.filename}: lastUpdate=${ds.lastUpdate} quedó atrás de una fecha editorial interna (${embeddedLastUpdate})`,
      );
    }
    const effectiveLastUpdate = publicationMode === 'rolling' && embeddedLastUpdate
      ? [ds.lastUpdate, embeddedLastUpdate].sort().at(-1)!
      : ds.lastUpdate;

    const id = datasetIdFor(ds);
    const outputFilename = outputFilenameFor(ds);
    const schemaOutputFilename = schemaOutputFilenameFor(ds);
    const dataSchemaOutputFilename = dataSchemaOutputFilenameFor(ds);
    const schemaUrl = `/api/schemas/${schemaOutputFilename}`;
    const dataSchemaUrl = `/api/schemas/${dataSchemaOutputFilename}`;
    const releaseUrl = publicationMode === 'release'
      ? `/api/releases/${DATA_RELEASE.id}/${outputFilename}`
      : undefined;
    const env = envelope(data, effectiveLastUpdate, ds.getCount?.(data));
    const serialized = JSON.stringify(env, null, 2);
    const dataSchemaSerialized = readFileSync(schemaSourcePath, 'utf8');
    const endpointSchemaSerialized = buildEndpointSchema(
      ds,
      schemaUrl,
      dataSchemaUrl,
      dataSchemaSerialized,
    );

    writeFileSync(join(OUT_DIR, outputFilename), serialized);
    generated.push({
      config: ds,
      id,
      outputFilename,
      schemaOutputFilename,
      dataSchemaOutputFilename,
      schemaUrl,
      dataSchemaUrl,
      releaseUrl,
      envelope: env,
      serialized,
      endpointSchemaSerialized,
      dataSchemaSerialized,
    });
    endpointsMeta.push({
      id,
      endpoint: ds.endpoint,
      title: ds.title,
      description: ds.description,
      descriptionEs: ds.descriptionEs,
      descriptionEn: ds.descriptionEn,
      countUnit: ds.countUnit,
      count: env.count,
      lastUpdate: env.lastUpdate,
      schemaUrl,
      dataSchemaUrl,
      publicationMode,
      releaseUrl,
    });
    console.log(`  ✓ ${ds.endpoint} (${env.count} items)`);
  }

  writeSchemas(generated);
  const release = writeRelease(generated);
  const downloadsUrl = writeDownloads(generated);

  // Manifest de descubrimiento. Conserva los campos históricos por endpoint y
  // suma metadata bilingüe, schemas y snapshots sin alterar las envolturas.
  const manifest = {
    version: PKG.version,
    dataRelease: {
      ...DATA_RELEASE,
      manifestUrl: release.manifestUrl,
    },
    lastUpdate: endpointsMeta
      .map(({ lastUpdate }) => lastUpdate)
      .sort()
      .at(-1),
    source: 'https://observatorioia.org',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    licenseScope: {
      es: 'La licencia cubre la compilación y el contenido original del observatorio; las fuentes enlazadas conservan sus propios términos.',
      en: 'The license covers the observatory compilation and original content; linked sources retain their own terms.',
    },
    documentation: {
      es: '/api/',
      en: '/api/en/',
    },
    codebook: '/api/codebook.json',
    schemas: '/api/schemas/index.json',
    releases: release.releaseIndexUrl,
    downloads: downloadsUrl,
    endpoints: endpointsMeta.map((e) => ({
      id: e.id,
      url: e.endpoint,
      description: e.description,
      descriptionI18n: {
        es: e.descriptionEs,
        en: e.descriptionEn,
      },
      count: e.count,
      countUnit: e.countUnit,
      lastUpdate: e.lastUpdate,
      schemaUrl: e.schemaUrl,
      dataSchemaUrl: e.dataSchemaUrl,
      publicationMode: e.publicationMode,
      ...(e.releaseUrl ? { releaseUrl: e.releaseUrl } : {}),
    })),
  };
  writeJson(join(OUT_DIR, 'index.json'), manifest);
  console.log(`  ✓ /api/index.json (${endpointsMeta.length} endpoints)`);
  console.log(`  ✓ schemas, release ${DATA_RELEASE.id} y descargas reproducibles`);

  // HTML index humano
  writeFileSync(join(OUT_DIR, 'index.html'), buildIndexHtml(endpointsMeta, 'es'));
  const englishIndexDir = join(OUT_DIR, 'en');
  mkdirSync(englishIndexDir, { recursive: true });
  writeFileSync(join(englishIndexDir, 'index.html'), buildIndexHtml(endpointsMeta, 'en'));
  console.log(`  ✓ /api/index.html + /api/en/index.html`);
}

main();
