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
 * Genera además `/api/index.json` (manifest) y deja `/api/` con un index.html
 * humano-amigable enlazando a cada endpoint.
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

const KPI_AUTO: Record<string, (c: Counters, data: unknown) => KpiAutoResult> = {
  'Proyectos IA activos en gobierno': (c) => ({ valor: String(c.proyectos) }),
  'Instituciones con IA operativa': (c) => ({ valor: String(c.instituciones) }),
  'Expedientes de ley en trámite': (c) => ({ valor: String(c.legislacion) }),
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
  endpoint: string;
  description: string;
}

const DATASETS: Dataset[] = [
  {
    filename: 'proyectos.json',
    endpoint: '/api/proyectos.json',
    description:
      'Catálogo de proyectos de IA en el sector público costarricense. Cada entrada incluye institución, estado, fuente oficial y descripción bilingüe ES/EN.',
  },
  {
    filename: 'instituciones.json',
    endpoint: '/api/instituciones.json',
    description:
      'Instituciones públicas con proyectos IA documentados (ministerios, autónomas, judicial, universidades, investigación).',
  },
  {
    filename: 'legislacion.json',
    endpoint: '/api/legislacion.json',
    description:
      'Expedientes de ley relacionados con IA en la Asamblea Legislativa de Costa Rica. Estado actualizado por scraper automatizado.',
  },
  {
    filename: 'indicadores.json',
    endpoint: '/api/indicadores.json',
    description:
      'Indicadores cuantitativos: ILIA 2025 (Índice Latinoamericano de IA), comparativa regional, KPIs hero del observatorio.',
  },
  {
    filename: 'brechas.json',
    endpoint: '/api/brechas.json',
    description:
      'Análisis de brechas: 7 capacidades que CR no tiene operativas vs Estonia/Singapur (gobernanza IA, X-Road, chatbot ciudadano, etc.).',
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

function envelope<T>(data: T): ApiEnvelope<T> {
  return {
    version: PKG.version,
    lastUpdate: new Date().toISOString(),
    count: Array.isArray(data) ? data.length : Object.keys(data as object).length,
    source: 'https://observatorioia.org',
    license: 'CC BY 4.0',
    data,
  };
}

function buildIndexHtml(endpoints: Array<{ endpoint: string; description: string; count: number }>): string {
  const rows = endpoints
    .map(
      (e) => `      <tr>
        <td><code><a href="${e.endpoint}">${e.endpoint}</a></code></td>
        <td>${e.count}</td>
        <td>${e.description}</td>
      </tr>`,
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>API pública — Observatorio IA Costa Rica</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index, follow">
  <meta name="description" content="API JSON read-only del Observatorio IA Costa Rica. Catálogo de proyectos IA en el sector público costarricense, abierto a periodistas e investigadores.">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 960px; margin: 2rem auto; padding: 0 1.5rem; color: #0f172a; line-height: 1.6; }
    h1 { font-size: 1.875rem; color: #1e3a8a; margin-bottom: .25rem; }
    h2 { font-size: 1.25rem; color: #1e3a8a; margin-top: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: .25rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { text-align: left; padding: .6rem .5rem; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    th { background: #f1f5f9; font-weight: 600; }
    code { background: #f1f5f9; padding: .15rem .4rem; border-radius: 3px; font-size: .875rem; }
    a { color: #1d4ed8; }
    .meta { color: #475569; font-size: .9rem; }
    pre { background: #0f172a; color: #f1f5f9; padding: 1rem; border-radius: 6px; overflow-x: auto; font-size: .85rem; }
  </style>
</head>
<body>
  <h1>API pública — Observatorio IA Costa Rica</h1>
  <p class="meta">JSON read-only. CORS abierto. Sin auth ni rate-limit. Fuente: <a href="https://observatorioia.org">observatorioia.org</a>.</p>

  <h2>Endpoints</h2>
  <table>
    <thead><tr><th>Endpoint</th><th>Items</th><th>Descripción</th></tr></thead>
    <tbody>
${rows}
      <tr>
        <td><code><a href="/api/index.json">/api/index.json</a></code></td>
        <td>—</td>
        <td>Manifest: lista todos los endpoints con metadata.</td>
      </tr>
    </tbody>
  </table>

  <h2>Formato de respuesta</h2>
  <p>Cada endpoint devuelve un envelope con metadata:</p>
  <pre>{
  "version": "0.1.0",
  "lastUpdate": "2026-05-04T...",
  "count": 18,
  "source": "https://observatorioia.org",
  "license": "CC BY 4.0",
  "data": [ ... ]
}</pre>

  <h2>Licencia y atribución</h2>
  <p>Datos disponibles bajo <strong>CC BY 4.0</strong>. Si los usás, atribuir <strong>"Observatorio IA Costa Rica" (observatorioia.org)</strong> con enlace.</p>

  <h2>Política editorial</h2>
  <p>Este observatorio es independiente, sin afiliación gubernamental. Cada dato del catálogo tiene <code>fuenteUrl</code> apuntando al documento oficial original. Las actualizaciones se procesan via revisión humana — los scrapers nunca tocan campos editoriales (titulo, descripcion, contexto, lecciones, resumen).</p>

  <h2>Mantenimiento</h2>
  <p>Mario Pérez Edwards · UnikPrompt · <a href="mailto:info@observatorioia.org">info@observatorioia.org</a></p>
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
    '  instituciones: number;',
    '  legislacion: number;',
    '}',
    '',
    'export const COUNTERS: Counters = {',
    `  proyectos: ${counters.proyectos},`,
    `  instituciones: ${counters.instituciones},`,
    `  legislacion: ${counters.legislacion},`,
    '};',
    '',
  ];
  writeFileSync(COUNTERS_TS, lines.join('\n'));
  console.log(`  ✓ src/data/counters.ts (proyectos=${counters.proyectos}, instituciones=${counters.instituciones}, legislacion=${counters.legislacion})`);
}

/**
 * Validates proyectos.json: every entry must have `desde` and a bilingual
 * `resultado`. Both fields drive UI surfaces that silently break when
 * missing (TimelineAdopcion drops dots without `desde`; tooltips fall back
 * to generic copy without `resultado`). Failing the build at validation
 * keeps that invariant from drifting back.
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

    const resultado = p.resultado as Record<string, unknown> | undefined;
    if (!resultado || typeof resultado !== 'object') {
      errors.push(`  - ${id}: falta campo "resultado" (objeto con es/en)`);
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
      'Reglas: cada entrada debe tener `desde` (año o YYYY-MM) y `resultado` bilingüe.',
      'Ver: src/data/json/proyectos.json + tooltips de TimelineAdopcion.',
    ].join('\n');
    throw new Error(msg);
  }
  console.log(`  ✓ validateProyectos: ${data.length} entradas con desde + resultado`);
}

function main(): void {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  validateProyectos();

  const counters = computeCounters(SRC_DIR);
  writeCountersTs(counters);

  const endpointsMeta: Array<{ endpoint: string; description: string; count: number }> = [];

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
    const env = envelope(data);
    writeFileSync(join(OUT_DIR, ds.filename), JSON.stringify(env, null, 2));
    endpointsMeta.push({
      endpoint: ds.endpoint,
      description: ds.description,
      count: env.count,
    });
    console.log(`  ✓ ${ds.endpoint} (${env.count} items)`);
  }

  // Manifest
  const manifest = {
    version: PKG.version,
    lastUpdate: new Date().toISOString(),
    source: 'https://observatorioia.org',
    license: 'CC BY 4.0',
    endpoints: endpointsMeta.map((e) => ({
      url: e.endpoint,
      description: e.description,
      count: e.count,
    })),
  };
  writeFileSync(join(OUT_DIR, 'index.json'), JSON.stringify(manifest, null, 2));
  console.log(`  ✓ /api/index.json (${endpointsMeta.length} endpoints)`);

  // HTML index humano
  writeFileSync(join(OUT_DIR, 'index.html'), buildIndexHtml(endpointsMeta));
  console.log(`  ✓ /api/index.html`);
}

main();
