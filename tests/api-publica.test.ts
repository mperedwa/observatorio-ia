import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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
