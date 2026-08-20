import { describe, expect, it } from 'vitest';
import { applyCounters } from '../src/i18n/applyCounters';
import type { Counters } from '../src/data/counters';
import { getDictionary } from '../src/i18n/dictionaries';

const counters: Counters = {
  proyectos: 26,
  iniciativasDocumentadas: 26,
  adopcionVerificada: 5,
  verificadasCatalogo: 5,
  seguimiento: 6,
  ecosistema: 15,
  descartadas: 0,
  pendientesMigracion: 0,
  instituciones: 7,
  legislacion: 5,
};

describe('applyCounters', () => {
  it('reemplaza contadores legacy y del modelo de evidencia', () => {
    expect(
      applyCounters(
        '{adopcionVerificada} verificadas, {seguimiento} en seguimiento y {ecosistema} de {iniciativasDocumentadas}',
        counters,
      ),
    ).toBe('5 verificadas, 6 en seguimiento y 15 de 26');
  });

  it('reemplaza todas las apariciones de una misma clave', () => {
    expect(applyCounters('{proyectos}/{proyectos}', counters)).toBe('26/26');
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
