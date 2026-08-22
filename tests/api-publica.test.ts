import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

const API_DIR = join(process.cwd(), 'public', 'api');

interface EndpointMeta {
  url: string;
  count: number;
  lastUpdate: string;
}

interface Manifest {
  lastUpdate: string;
  endpoints: EndpointMeta[];
}

function readJson<T>(filename: string): T {
  return JSON.parse(readFileSync(join(API_DIR, filename), 'utf8')) as T;
}

function readIndexHtml(locale: 'es' | 'en') {
  const filename = locale === 'es' ? join(API_DIR, 'index.html') : join(API_DIR, 'en', 'index.html');
  return load(readFileSync(filename, 'utf8'));
}

describe('API pública estática', () => {
  it('publica siete endpoints e incluye monitoreo', () => {
    const manifest = readJson<Manifest>('index.json');
    const urls = manifest.endpoints.map(({ url }) => url);

    expect(manifest.endpoints).toHaveLength(7);
    expect(urls).toContain('/api/enia-acciones.json');
    expect(urls).toContain('/api/monitoreo.json');
  });

  it('usa fechas editoriales estables en lugar de la hora de build', () => {
    const manifest = readJson<Manifest>('index.json');

    for (const endpoint of manifest.endpoints) {
      const filename = endpoint.url.split('/').at(-1)!;
      const payload = readJson<{ lastUpdate: string }>(filename);
      expect(payload.lastUpdate).toBe(endpoint.lastUpdate);
      expect(payload.lastUpdate).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
    }
    expect(manifest.lastUpdate).toBe(
      manifest.endpoints.map(({ lastUpdate }) => lastUpdate).sort().at(-1),
    );
  });

  it('conserva la misma envoltura pública en los siete datasets', () => {
    const manifest = readJson<Manifest>('index.json');

    for (const endpoint of manifest.endpoints) {
      const filename = endpoint.url.split('/').at(-1)!;
      const payload = readJson<Record<string, unknown>>(filename);
      expect(Object.keys(payload)).toEqual([
        'version',
        'lastUpdate',
        'count',
        'source',
        'license',
        'data',
      ]);
      expect(payload.license).toBe('CC BY 4.0');
      expect(payload.source).toBe('https://observatorioia.org');
    }
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
      for (const endpoint of manifest.endpoints) expect(links.has(endpoint.url)).toBe(true);
      expect(links.has('/api/index.json')).toBe(true);
    }

    expect(readIndexHtml('es')('h1').text()).toContain('Evidencia pública');
    expect(readIndexHtml('en')('h1').text()).toContain('Public evidence');
  });

  it('expone los ocho frentes y su bitácora', () => {
    const payload = readJson<{
      count: number;
      data: { frentes: unknown[]; revisiones: unknown[] };
    }>('monitoreo.json');

    expect(payload.count).toBe(8);
    expect(payload.data.frentes).toHaveLength(8);
    expect(payload.data.revisiones).toHaveLength(8);
  });
});
