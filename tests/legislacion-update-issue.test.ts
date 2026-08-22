import { describe, expect, it } from 'vitest';
import {
  buildBody,
  selectAsambleaReport,
} from '../scripts/create-legislacion-update-issue';

const asambleaReport = {
  scraper: 'asamblea',
  ranAt: '2026-08-21T12:21:30.308Z',
  fetched: 7,
  matched: 7,
  changes: [
    {
      scraper: 'asamblea',
      dataset: 'legislacion',
      kind: 'update',
      id: '23.919',
      field: 'comision',
      before: { es: 'Derechos Humanos', en: 'Human Rights' },
      after: {
        es: 'Ciencia, Tecnología y Educación',
        en: '(revisar traducción)',
      },
      rationale: 'La fuente secundaria muestra una comisión distinta.',
      sourceUrl: 'https://delfino.cr/asamblea/proyecto/23919',
      scrapedAt: '2026-08-21T12:21:32.944Z',
    },
  ],
  candidates: [],
  notes: [],
};

describe('handoff de cambios legislativos', () => {
  it('extrae Asamblea del reporte consolidado producido por scrape:all', () => {
    const report = selectAsambleaReport({
      reports: [
        { ...asambleaReport, scraper: 'micitt', changes: [] },
        asambleaReport,
      ],
    });

    expect(report).toEqual(asambleaReport);
    expect(report?.changes).toHaveLength(1);
  });

  it('devuelve null si la corrida no contiene un reporte de Asamblea', () => {
    expect(
      selectAsambleaReport({
        reports: [{ ...asambleaReport, scraper: 'micitt', changes: [] }],
      }),
    ).toBeNull();
  });

  it('construye una alerta trazable sin aplicar el cambio', () => {
    const body = buildBody(asambleaReport, 'run-prueba');

    expect(body).toContain('legislacion-update:run-prueba');
    expect(body).toContain('`23.919`');
    expect(body).toContain('`comision`');
    expect(body).toContain('La decisión final (GO/NO por cambio)');
  });
});
