import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const API_DIR = join(ROOT, 'public', 'api');
const SOURCE_SCHEMA_DIR = join(ROOT, 'src', 'data', 'schemas');
const SOURCE_DATA_DIR = join(ROOT, 'src', 'data', 'json');
const RELEASE_ID = '2026-08-23-r9';
const PREVIOUS_RELEASE_ID = '2026-08-22-r8';

const ORIGINAL_ENDPOINTS = [
  '/api/proyectos.json',
  '/api/instituciones.json',
  '/api/legislacion.json',
  '/api/indicadores.json',
  '/api/brechas.json',
  '/api/enia-acciones.json',
  '/api/monitoreo.json',
] as const;

const EXPECTED_ENDPOINTS = [
  ...ORIGINAL_ENDPOINTS,
  '/api/marco-pais.json',
  '/api/historial.json',
  '/api/coyuntura.json',
  '/api/recursos.json',
  '/api/codebook.json',
] as const;

const SOURCE_SCHEMAS: Record<string, string> = {
  proyectos: 'proyectos.schema.json',
  instituciones: 'instituciones.schema.json',
  legislacion: 'legislacion.schema.json',
  indicadores: 'indicadores.schema.json',
  brechas: 'brechas.schema.json',
  'enia-acciones': 'eniaAcciones.schema.json',
  monitoreo: 'monitoreo.schema.json',
  'marco-pais': 'marcoPais.schema.json',
  historial: 'changelog.schema.json',
  coyuntura: 'coyuntura.schema.json',
  recursos: 'recursos.schema.json',
  codebook: 'apiCodebook.schema.json',
};

interface EndpointMeta {
  id: string;
  url: string;
  description: string;
  descriptionI18n: { es: string; en: string };
  count: number;
  countUnit: { es: string; en: string };
  lastUpdate: string;
  schemaUrl: string;
  dataSchemaUrl: string;
  releaseUrl: string;
}

interface Manifest {
  version: string;
  dataRelease: { id: string; date: string; manifestUrl: string };
  lastUpdate: string;
  source: string;
  license: string;
  licenseUrl: string;
  documentation: { es: string; en: string };
  codebook: string;
  schemas: string;
  releases: string;
  downloads: string;
  endpoints: EndpointMeta[];
}

interface ApiEnvelope<T = unknown> {
  version: string;
  lastUpdate: string;
  count: number;
  source: string;
  license: string;
  data: T;
}

interface SchemaIndex {
  releaseId: string;
  schemas: Array<{
    datasetId: string;
    url: string;
    dataSchemaUrl: string;
    bytes: number;
    sha256: string;
    dataSchemaBytes: number;
    dataSchemaSha256: string;
  }>;
}

interface ReleaseManifest {
  id: string;
  date: string;
  immutable: boolean;
  datasets: Array<{
    id: string;
    url: string;
    schemaUrl: string;
    dataSchemaUrl: string;
    count: number;
    bytes: number;
    sha256: string;
    schemaSha256: string;
    dataSchemaSha256: string;
  }>;
}

function readJson<T>(filename: string): T {
  return JSON.parse(readFileSync(join(API_DIR, filename), 'utf8')) as T;
}

function localPathFromApiUrl(url: string): string {
  if (!url.startsWith('/api/')) throw new Error(`URL fuera de /api/: ${url}`);
  return join(API_DIR, url.slice('/api/'.length));
}

function readApiUrl(url: string): string {
  return readFileSync(localPathFromApiUrl(url), 'utf8');
}

function parseApiUrl<T>(url: string): T {
  return JSON.parse(readApiUrl(url)) as T;
}

function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function byteLength(value: string): number {
  return Buffer.byteLength(value, 'utf8');
}

function countCsvDataRows(csv: string): number {
  let records = 0;
  let quoted = false;
  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    if (character === '"') {
      if (quoted && csv[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (character === '\n' && !quoted) {
      records += 1;
    }
  }
  if (quoted) throw new Error('CSV con comillas sin cerrar');
  return Math.max(0, records - 1);
}

function readIndexHtml(locale: 'es' | 'en') {
  const filename = locale === 'es'
    ? join(API_DIR, 'index.html')
    : join(API_DIR, 'en', 'index.html');
  return load(readFileSync(filename, 'utf8'));
}

describe('API pública estática R9', () => {
  it('conserva las siete rutas originales y suma cinco rutas complementarias', () => {
    const manifest = readJson<Manifest>('index.json');
    const urls = manifest.endpoints.map(({ url }) => url);

    expect(urls).toEqual(EXPECTED_ENDPOINTS);
    for (const original of ORIGINAL_ENDPOINTS) expect(urls).toContain(original);
    expect(manifest.endpoints).toHaveLength(12);
  });

  it('mantiene exactamente la envoltura pública y fechas editoriales estables', () => {
    const manifest = readJson<Manifest>('index.json');

    for (const endpoint of manifest.endpoints) {
      const payload = parseApiUrl<Record<string, unknown>>(endpoint.url);
      expect(Object.keys(payload)).toEqual([
        'version',
        'lastUpdate',
        'count',
        'source',
        'license',
        'data',
      ]);
      expect(payload.lastUpdate).toBe(endpoint.lastUpdate);
      expect(payload.lastUpdate).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
      expect(payload.license).toBe('CC BY 4.0');
      expect(payload.source).toBe('https://observatorioia.org');
    }
    expect(manifest.lastUpdate).toBe(
      manifest.endpoints.map(({ lastUpdate }) => lastUpdate).sort().at(-1),
    );
  });

  it('declara unidades y conteos coherentes para cada colección', () => {
    const manifest = readJson<Manifest>('index.json');
    const expectedCounts: Record<string, number> = {
      proyectos: 29,
      instituciones: 9,
      legislacion: 7,
      indicadores: 5,
      brechas: 7,
      'enia-acciones': 129,
      monitoreo: 8,
      'marco-pais': 4,
      historial: 44,
      coyuntura: 2,
      recursos: 16,
      codebook: 11,
    };

    for (const endpoint of manifest.endpoints) {
      const payload = parseApiUrl<ApiEnvelope>(endpoint.url);
      expect(endpoint.countUnit.es).toBeTruthy();
      expect(endpoint.countUnit.en).toBeTruthy();
      expect(endpoint.count).toBe(expectedCounts[endpoint.id]);
      expect(payload.count).toBe(expectedCounts[endpoint.id]);
    }
  });

  it('expone un manifest bilingüe con descubrimiento, licencia y release', () => {
    const manifest = readJson<Manifest>('index.json');

    expect(manifest.dataRelease).toMatchObject({
      id: RELEASE_ID,
      date: '2026-08-23',
      manifestUrl: `/api/releases/${RELEASE_ID}/release.json`,
    });
    expect(manifest.documentation).toEqual({ es: '/api/', en: '/api/en/' });
    expect(manifest.codebook).toBe('/api/codebook.json');
    expect(manifest.schemas).toBe('/api/schemas/index.json');
    expect(manifest.releases).toBe('/api/releases/index.json');
    expect(manifest.downloads).toBe('/api/downloads/index.json');
    expect(manifest.licenseUrl).toBe('https://creativecommons.org/licenses/by/4.0/');
    for (const endpoint of manifest.endpoints) {
      expect(endpoint.description).toBeTruthy();
      expect(endpoint.descriptionI18n.es).toBeTruthy();
      expect(endpoint.descriptionI18n.en).toBeTruthy();
      expect(endpoint.schemaUrl).toBe(`/api/schemas/${endpoint.id}.schema.json`);
      expect(endpoint.dataSchemaUrl).toBe(`/api/schemas/${endpoint.id}-data.schema.json`);
      expect(endpoint.releaseUrl).toBe(`/api/releases/${RELEASE_ID}/${endpoint.id}.json`);
    }
  });

  it('publica schemas que validan tanto la respuesta como el campo data', () => {
    const manifest = readJson<Manifest>('index.json');
    const schemaIndex = readJson<SchemaIndex>('schemas/index.json');

    expect(schemaIndex.releaseId).toBe(RELEASE_ID);
    expect(schemaIndex.schemas).toHaveLength(12);
    for (const endpoint of manifest.endpoints) {
      const entry = schemaIndex.schemas.find(({ datasetId }) => datasetId === endpoint.id);
      expect(entry).toBeDefined();
      const responseSchemaText = readApiUrl(endpoint.schemaUrl);
      const dataSchemaText = readApiUrl(endpoint.dataSchemaUrl);
      const payload = parseApiUrl<ApiEnvelope>(endpoint.url);

      expect(entry!.bytes).toBe(byteLength(responseSchemaText));
      expect(entry!.sha256).toBe(digest(responseSchemaText));
      expect(entry!.dataSchemaBytes).toBe(byteLength(dataSchemaText));
      expect(entry!.dataSchemaSha256).toBe(digest(dataSchemaText));
      expect(dataSchemaText).toBe(
        readFileSync(join(SOURCE_SCHEMA_DIR, SOURCE_SCHEMAS[endpoint.id]), 'utf8'),
      );

      const responseAjv = new Ajv({ allErrors: true, strict: false });
      addFormats(responseAjv);
      expect(responseAjv.validate(JSON.parse(responseSchemaText), payload)).toBe(true);
      const dataAjv = new Ajv({ allErrors: true, strict: false });
      addFormats(dataAjv);
      expect(dataAjv.validate(JSON.parse(dataSchemaText), payload.data)).toBe(true);
    }
  });

  it('congela una release íntegra con checksums y schemas propios', () => {
    const currentManifest = readJson<Manifest>('index.json');
    const release = readJson<ReleaseManifest>(`releases/${RELEASE_ID}/release.json`);
    const releaseText = readFileSync(
      join(API_DIR, 'releases', RELEASE_ID, 'release.json'),
      'utf8',
    );
    const releaseIndex = readJson<{
      latest: string;
      releases: Array<{ id: string; bytes: number; sha256: string }>;
    }>('releases/index.json');

    expect(release.id).toBe(RELEASE_ID);
    expect(release.date).toBe('2026-08-23');
    expect(release.immutable).toBe(true);
    expect(readFileSync(join(API_DIR, 'releases', RELEASE_ID, 'release.lock'), 'utf8')).toContain(
      `release=${RELEASE_ID}`,
    );
    expect(releaseIndex.latest).toBe(RELEASE_ID);
    expect(releaseIndex.releases).toHaveLength(2);
    expect(releaseIndex.releases.find(({ id }) => id === RELEASE_ID)).toMatchObject({
      bytes: byteLength(releaseText),
      sha256: digest(releaseText),
    });
    const previousReleaseText = readFileSync(
      join(API_DIR, 'releases', PREVIOUS_RELEASE_ID, 'release.json'),
      'utf8',
    );
    expect(
      readFileSync(join(API_DIR, 'releases', PREVIOUS_RELEASE_ID, 'release.lock'), 'utf8'),
    ).toContain(`release=${PREVIOUS_RELEASE_ID}`);
    expect(releaseIndex.releases.find(({ id }) => id === PREVIOUS_RELEASE_ID)).toMatchObject({
      bytes: byteLength(previousReleaseText),
      sha256: digest(previousReleaseText),
    });
    expect(release.datasets).toHaveLength(12);
    for (const dataset of release.datasets) {
      const current = currentManifest.endpoints.find(({ id }) => id === dataset.id)!;
      const snapshotText = readApiUrl(dataset.url);
      const responseSchemaText = readApiUrl(dataset.schemaUrl);
      const dataSchemaText = readApiUrl(dataset.dataSchemaUrl);

      expect(snapshotText).toBe(readApiUrl(current.url));
      expect(responseSchemaText).toBe(readApiUrl(current.schemaUrl));
      expect(dataSchemaText).toBe(readApiUrl(current.dataSchemaUrl));
      expect(dataset.count).toBe(parseApiUrl<ApiEnvelope>(current.url).count);
      expect(dataset.bytes).toBe(byteLength(snapshotText));
      expect(dataset.sha256).toBe(digest(snapshotText));
      expect(dataset.schemaSha256).toBe(digest(responseSchemaText));
      expect(dataset.dataSchemaSha256).toBe(digest(dataSchemaText));
    }
  });

  it('ofrece un bundle completo y CSV tabulares verificables', () => {
    const downloads = readJson<{
      releaseId: string;
      files: Array<{
        url: string;
        format: 'json' | 'csv';
        bytes: number;
        sha256: string;
        rows?: number;
      }>;
    }>('downloads/index.json');

    expect(downloads.releaseId).toBe(RELEASE_ID);
    expect(downloads.files).toHaveLength(4);
    for (const file of downloads.files) {
      const content = readApiUrl(file.url);
      expect(file.bytes).toBe(byteLength(content));
      expect(file.sha256).toBe(digest(content));
      if (file.format === 'csv') expect(countCsvDataRows(content)).toBe(file.rows);
    }

    const bundleFile = downloads.files.find(({ format }) => format === 'json')!;
    const bundle = parseApiUrl<{
      release: { id: string };
      datasets: Record<string, ApiEnvelope>;
    }>(bundleFile.url);
    expect(bundle.release.id).toBe(RELEASE_ID);
    expect(Object.keys(bundle.datasets)).toHaveLength(12);
    expect(bundle.datasets.proyectos.count).toBe(29);
    expect(bundle.datasets['enia-acciones'].count).toBe(129);

    const legislationCsvFile = downloads.files.find(({ url }) =>
      url.includes(`/legislacion-${RELEASE_ID}.csv`),
    )!;
    const legislationCsv = readApiUrl(legislationCsvFile.url);
    expect(legislationCsv.split('\n')[0]).toContain('referencia_complementaria');
    expect(legislationCsv.split('\n')[0]).toContain('fuente_estado_oficial');
  });

  it('declara Content-Type, CORS y caché para JSON y CSV en Vercel', () => {
    const config = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8')) as {
      headers: Array<{
        source: string;
        headers: Array<{ key: string; value: string }>;
      }>;
    };

    const jsonRule = config.headers.find(({ source }) => source.includes('\\.json'))!;
    const csvRule = config.headers.find(({ source }) => source.includes('\\.csv'))!;
    const asMap = (rule: typeof jsonRule) => new Map(
      rule.headers.map(({ key, value }) => [key.toLowerCase(), value]),
    );

    expect(asMap(jsonRule).get('content-type')).toBe('application/json; charset=utf-8');
    expect(asMap(csvRule).get('content-type')).toBe('text/csv; charset=utf-8');
    expect(asMap(csvRule).get('content-disposition')).toBe('attachment');
    for (const rule of [jsonRule, csvRule]) {
      expect(asMap(rule).get('access-control-allow-origin')).toBe('*');
      expect(asMap(rule).get('access-control-allow-methods')).toBe('GET, OPTIONS');
      expect(asMap(rule).get('cache-control')).toContain('s-maxage=3600');
    }
  });

  it('documenta metodología, procedencia y límites interpretativos', () => {
    const codebook = readJson<ApiEnvelope<{
      schemaVersion: number;
      contrato: {
        noAplica: { es: string; en: string };
      };
      reglaAdopcionVerificada: {
        condiciones: Array<{ campo: string; valores: Array<string | number | boolean> }>;
      };
      vocabularios: unknown[];
      datasets: Array<{
        id: string;
        notaInterpretacion?: { es: string; en: string };
      }>;
      procedencia: {
        corpusCostaRicaRecursoIds: string[];
        corpusCostaRicaEndpoints: string[];
      };
      licencia: { compilacion: string };
    }>>('codebook.json');
    const brechas = readJson<ApiEnvelope<Array<{ fuenteUrlAlcance: string }>>>('brechas.json');
    const indicadores = readJson<ApiEnvelope<{
      ilia2025: Array<{ edicion: number; fuenteUrl: string }>;
      comparativaRegional: Array<{ iliaEdicion: number; iliaFuenteUrl: string }>;
    }>>('indicadores.json');
    const recursos = readJson<ApiEnvelope<Array<{
      id: string;
      titulo: { es: string; en: string };
      nota?: { es: string; en: string };
    }>>>('recursos.json');

    expect(codebook.data.schemaVersion).toBe(2);
    expect(codebook.data.contrato.noAplica.es).toContain('no corresponde');
    expect(codebook.data.reglaAdopcionVerificada.condiciones).toHaveLength(9);
    expect(codebook.data.reglaAdopcionVerificada.condiciones[0]).toEqual({
      campo: 'modeloVersion',
      operador: 'igual',
      valores: [2],
    });
    expect(codebook.data.vocabularios).toHaveLength(10);
    expect(codebook.data.reglaAdopcionVerificada.condiciones).toContainEqual({
      campo: 'evaluacion.tecnicaIA.estado',
      operador: 'igual',
      valores: ['confirmado'],
    });
    expect(codebook.data.reglaAdopcionVerificada.condiciones).toContainEqual({
      campo: 'fuentePrimariaEjecucion',
      operador: 'igual',
      valores: [true],
    });
    expect(codebook.data.datasets).toHaveLength(11);
    for (const id of ['instituciones', 'indicadores', 'brechas', 'enia-acciones', 'marco-pais', 'coyuntura', 'recursos']) {
      expect(codebook.data.datasets.find((dataset) => dataset.id === id)?.notaInterpretacion).toBeDefined();
    }
    expect(codebook.data.procedencia.corpusCostaRicaRecursoIds).toHaveLength(5);
    expect(codebook.data.procedencia.corpusCostaRicaEndpoints).toHaveLength(5);
    expect(codebook.data.licencia.compilacion).toBe('CC BY 4.0');
    expect(brechas.data.every(({ fuenteUrlAlcance }) => fuenteUrlAlcance === 'referencia-internacional')).toBe(true);
    expect(indicadores.data.ilia2025.every(({ edicion, fuenteUrl }) => (
      edicion === 2025 && fuenteUrl.includes('Documento_ILIA_2025.pdf')
    ))).toBe(true);
    expect(indicadores.data.comparativaRegional.every(({ iliaEdicion, iliaFuenteUrl }) => (
      iliaEdicion === 2025 && iliaFuenteUrl.includes('Documento_ILIA_2025.pdf')
    ))).toBe(true);
    const gtmi = recursos.data.find(({ id }) => id === 'gtmi-2025')!;
    expect(gtmi.titulo.es).toContain('Madurez GovTech');
    expect(gtmi.nota?.es).toContain('No es un ranking de preparación para IA');
  });

  it('publica documentación humana equivalente en español e inglés', () => {
    const manifest = readJson<Manifest>('index.json');
    const versions = [
      { locale: 'es' as const, canonical: 'https://www.observatorioia.org/api/' },
      { locale: 'en' as const, canonical: 'https://www.observatorioia.org/api/en/' },
    ];

    for (const { locale, canonical } of versions) {
      const $ = readIndexHtml(locale);
      expect($('html').attr('lang')).toBe(locale);
      expect($('main')).toHaveLength(1);
      expect($('h1')).toHaveLength(1);
      expect($('meta[name="description"]').attr('content')).toBeTruthy();
      expect($('link[rel="canonical"]').attr('href')).toBe(canonical);
      expect($('link[rel="alternate"][hreflang="es"]').attr('href')).toContain('/api/');
      expect($('link[rel="alternate"][hreflang="en"]').attr('href')).toContain('/api/en/');

      const links = new Set($('a[href]').map((_, link) => $(link).attr('href')).get());
      for (const endpoint of manifest.endpoints) {
        expect(links.has(endpoint.url)).toBe(true);
        expect(links.has(endpoint.schemaUrl)).toBe(true);
        expect(links.has(endpoint.releaseUrl)).toBe(true);
      }
      expect(links.has('/api/index.json')).toBe(true);
      expect(links.has('/api/schemas/index.json')).toBe(true);
      expect(links.has(`/api/releases/${RELEASE_ID}/release.json`)).toBe(true);
      expect(links.has('/api/downloads/index.json')).toBe(true);
      expect(links.has(`/api/downloads/observatorio-ia-${RELEASE_ID}.json`)).toBe(true);
      expect(links.has(`/api/downloads/proyectos-${RELEASE_ID}.csv`)).toBe(true);
      expect(links.has(`/api/downloads/legislacion-${RELEASE_ID}.csv`)).toBe(true);
      expect(links.has(`/api/downloads/enia-intervenciones-${RELEASE_ID}.csv`)).toBe(true);
    }

    expect(readIndexHtml('es')('h1').text()).toContain('Evidencia pública');
    expect(readIndexHtml('en')('h1').text()).toContain('Public evidence');
    expect(readIndexHtml('es')('code').text()).toContain(
      '.evaluacion.tecnicaIA.estado == "confirmado"',
    );
    expect(readIndexHtml('es')('code').text()).toContain(
      '.tipoFuente == "primaria-oficial"',
    );
  });

  it('mantiene el endpoint de proyectos sincronizado exactamente con la fuente curada', () => {
    const source = JSON.parse(
      readFileSync(join(SOURCE_DATA_DIR, 'proyectos.json'), 'utf8'),
    ) as unknown;
    const endpoint = readJson<ApiEnvelope>('proyectos.json');

    expect(endpoint.count).toBe(29);
    expect(endpoint.lastUpdate).toBe('2026-08-23T00:00:00.000Z');
    expect(endpoint.data).toEqual(source);
  });

  it('mantiene visibles los ocho frentes y su bitácora editorial', () => {
    const payload = readJson<ApiEnvelope<{ frentes: unknown[]; revisiones: unknown[] }>>('monitoreo.json');

    expect(payload.count).toBe(8);
    expect(payload.data.frentes).toHaveLength(8);
    expect(payload.data.revisiones).toHaveLength(8);
  });
});
