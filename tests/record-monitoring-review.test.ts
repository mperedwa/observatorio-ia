import { describe, expect, it } from 'vitest';
import {
  calcularProximaRevision,
  prepararRevision,
} from '../scripts/record-monitoring-review';
import { monitoreo, type RevisionMonitoreo } from '../src/data/monitoreo';

function revision(overrides: Partial<RevisionMonitoreo> = {}): RevisionMonitoreo {
  return {
    id: 'revision-prueba-2026-09-21',
    fecha: '2026-09-21',
    frenteId: 'enia-plan-accion',
    resultado: 'sin-cambios',
    resumen: { es: 'Sin cambios.', en: 'No changes.' },
    fuenteUrl: 'https://example.org/source',
    transiciones: [],
    ...overrides,
  };
}

describe('registro editorial de monitoreo', () => {
  it('calcula fechas semanales y por mes sin desbordar fin de mes', () => {
    expect(calcularProximaRevision('2026-08-21', 'semanal')).toBe('2026-08-28');
    expect(calcularProximaRevision('2026-01-31', 'mensual')).toBe('2026-02-28');
    expect(calcularProximaRevision('2026-08-21', 'trimestral')).toBe('2026-11-21');
    expect(calcularProximaRevision('2026-08-21', 'semestral')).toBe('2027-02-21');
  });

  it('añade una revisión y mueve solo el frente correspondiente', () => {
    const original = structuredClone(monitoreo);
    const actualizado = prepararRevision(original, revision());
    const frente = actualizado.frentes.find(({ id }) => id === 'enia-plan-accion');

    expect(frente?.fechaUltimaRevision).toBe('2026-09-21');
    expect(frente?.fechaProximaRevision).toBe('2026-10-21');
    expect(actualizado.fechaCorte).toBe('2026-09-21');
    expect(actualizado.revisiones[0].id).toBe('revision-prueba-2026-09-21');
    expect(monitoreo.fechaCorte).toBe('2026-08-21');
  });

  it('rechaza una revisión sin cambios que incluye una transición', () => {
    expect(() =>
      prepararRevision(
        structuredClone(monitoreo),
        revision({
          transiciones: [
            {
              objetoTipo: 'instrumento',
              objetoId: 'enia',
              campo: 'version',
              antes: '2024-2027',
              despues: '2025-2028',
            },
          ],
        }),
      ),
    ).toThrow(/sin cambios no puede incluir transiciones/);
  });

  it('rechaza un cambio publicado sin transición trazable', () => {
    expect(() =>
      prepararRevision(
        structuredClone(monitoreo),
        revision({ resultado: 'cambio-publicado' }),
      ),
    ).toThrow(/debe incluir transiciones/);
  });
});
