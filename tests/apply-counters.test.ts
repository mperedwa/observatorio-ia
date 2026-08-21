import { describe, expect, it } from 'vitest';
import { applyCounters } from '../src/i18n/applyCounters';
import type { Counters } from '../src/data/counters';
import { getDictionary } from '../src/i18n/dictionaries';

const counters: Counters = {
  proyectos: 29,
  iniciativasDocumentadas: 29,
  adopcionVerificada: 6,
  verificadasCatalogo: 6,
  seguimiento: 7,
  ecosistema: 16,
  descartadas: 0,
  pendientesMigracion: 0,
  instituciones: 9,
  legislacion: 7,
};

describe('applyCounters', () => {
  it('reemplaza contadores legacy y del modelo de evidencia', () => {
    expect(
      applyCounters(
        '{adopcionVerificada} verificadas, {seguimiento} en seguimiento y {ecosistema} de {iniciativasDocumentadas}',
        counters,
      ),
    ).toBe('6 verificadas, 7 en seguimiento y 16 de 29');
  });

  it('reemplaza todas las apariciones de una misma clave', () => {
    expect(applyCounters('{proyectos}/{proyectos}', counters)).toBe('29/29');
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
