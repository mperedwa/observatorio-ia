import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';
import schema from '../src/data/schemas/legislacion.schema.json';
import {
  applyConteosLegislacion,
  conteosLegislacion,
  expedientes,
} from '../src/data/legislacion';
import { kpisHero } from '../src/data/indicadores';
import { getDictionary } from '../src/i18n/dictionaries';

describe('inventario legislativo auditable', () => {
  it('valida contra JSON Schema', () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema as object);

    expect(validate(expedientes), JSON.stringify(validate.errors)).toBe(true);
  });

  it('distingue alcance y deriva los estados del dataset', () => {
    expect(conteosLegislacion).toEqual({
      total: 7,
      dictaminados: 4,
      enComision: 3,
      principales: 4,
      relacionados: 3,
    });
    expect(expedientes.map(({ numero }) => numero)).toEqual([
      '23.771',
      '23.885',
      '23.919',
      '24.484',
      '24.875',
      '25.171',
      '25.379',
    ]);
  });

  it('conserva evidencia oficial y fecha de verificación en cada expediente', () => {
    expect(
      expedientes.every(
        ({ fuenteEstadoUrl, fechaUltimaVerificacion }) =>
          /^https:\/\//.test(fuenteEstadoUrl) &&
          fechaUltimaVerificacion === '2026-08-21',
      ),
    ).toBe(true);
  });

  it('materializa los conteos en los titulares ES y EN', () => {
    for (const locale of ['es', 'en'] as const) {
      const t = getDictionary(locale);
      const textos = [
        applyConteosLegislacion(t.legislacion.titulo),
        applyConteosLegislacion(t.legislacion.sub),
        applyConteosLegislacion(t.analisis.legislacionTitulo),
        applyConteosLegislacion(t.analisis.legislacionSub),
      ];

      expect(textos.every((texto) => !texto.includes('{'))).toBe(true);
      expect(textos.join(' ')).toContain('7');
      expect(textos.join(' ')).toContain('4');
      expect(textos.join(' ')).toContain('3');
    }
  });

  it('resuelve el KPI legislativo con el mismo conteo', () => {
    const kpi = kpisHero.find(
      ({ label }) => label.es === 'Expedientes de ley en trámite',
    );

    expect(kpi).toMatchObject({
      valor: '7',
      detalle: {
        es: '4 dictaminados, 3 en comisión',
        en: '4 with committee reports, 3 in committee',
      },
    });
  });
});
