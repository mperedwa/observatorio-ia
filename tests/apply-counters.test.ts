import { describe, expect, it } from 'vitest';
import { applyCounters } from '../src/i18n/applyCounters';
import type { Counters } from '../src/data/counters';
import { getDictionary } from '../src/i18n/dictionaries';
import indicadores from '../src/data/json/indicadores.json';

const counters: Counters = {
  proyectos: 31,
  iniciativasDocumentadas: 31,
  adopcionVerificada: 7,
  verificadasCatalogo: 7,
  seguimiento: 8,
  ecosistema: 16,
  descartadas: 0,
  pendientesMigracion: 0,
  instituciones: 11,
  legislacion: 7,
};

describe('applyCounters', () => {
  it('reemplaza contadores legacy y del modelo de evidencia', () => {
    expect(
      applyCounters(
        '{adopcionVerificada} verificadas, {seguimiento} en seguimiento y {ecosistema} de {iniciativasDocumentadas}',
        counters,
      ),
    ).toBe('7 verificadas, 8 en seguimiento y 16 de 31');
  });

  it('reemplaza todas las apariciones de una misma clave', () => {
    expect(applyCounters('{proyectos}/{proyectos}', counters)).toBe('31/31');
  });

  it.each(['es', 'en'] as const)(
    'resuelve cualquier contador usado en las etiquetas de recursos (%s)',
    (locale) => {
      const labels = Object.values(getDictionary(locale).comparte.assets);

      for (const label of labels) {
        expect(applyCounters(label, counters)).not.toMatch(/\{[a-z][A-Za-z]*\}/);
      }
    },
  );
});

describe('detalle institucional de portada', () => {
  it('enumera las once instituciones en ambos idiomas', () => {
    const kpi = indicadores.kpisHero.find(
      ({ label }) => label.es === 'Instituciones con iniciativas documentadas',
    );

    expect(kpi?.detalle).toEqual({
      es: 'Poder Judicial, CCSS, Hacienda, MEP, MICITT, CENAT, UCR, INAMU, INS, ARESEP e INVU',
      en: 'Judicial Branch, CCSS, Finance, MEP, MICITT, CENAT, UCR, INAMU, INS, ARESEP and INVU',
    });
  });
});
