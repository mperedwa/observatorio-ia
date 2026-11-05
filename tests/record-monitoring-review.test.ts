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
    issueUrl: 'https://github.com/mperedwa/observatorio-ia/issues/42',
    transiciones: [],
    ...overrides,
  };
}

describe('registro editorial de monitoreo', () => {
  it('registra una revisión parcial sin renovar ni ocultar las fechas vencidas', () => {
    const original = structuredClone(monitoreo);
    const before = original.frentes.find(({ id }) => id === 'enia-plan-accion')!;
    const result = prepararRevision(original, revision({
      id: 'revision-parcial-prueba-2026-11-05', fecha: '2026-11-05', alcanceRevision: 'parcial',
    }));
    expect(result.frentes.find(({ id }) => id === before.id)).toEqual(before);
    expect(result.revisiones.some(({ id }) => id === 'revision-parcial-prueba-2026-11-05')).toBe(true);
  });
  it('calcula fechas semanales y por mes sin desbordar fin de mes', () => {
    expect(calcularProximaRevision('2026-08-21', 'semanal')).toBe('2026-08-28');
    expect(calcularProximaRevision('2026-01-31', 'mensual')).toBe('2026-02-28');
    expect(calcularProximaRevision('2026-08-21', 'trimestral')).toBe('2026-11-21');
    expect(calcularProximaRevision('2026-08-21', 'semestral')).toBe('2027-02-21');
  });

  it('aplica la vigilancia semanal de ILIA entre septiembre y noviembre, sin cambiar su cadencia base', () => {
    for (const [fecha, proxima] of [
      ['2026-09-05', '2026-09-12'],
      ['2026-11-05', '2026-11-12'],
      ['2026-12-05', '2027-01-05'],
    ]) {
      const result = prepararRevision(structuredClone(monitoreo), revision({
        id: 'prueba-cadencia-ilia', frenteId: 'indicador-ilia', fecha,
      }));
      const frente = result.frentes.find(({ id }) => id === 'indicador-ilia')!;
      expect(frente.fechaProximaRevision).toBe(proxima);
      expect(frente.cadenciaId).toBe('mensual');
    }
  });

  it('añade una revisión y mueve solo el frente correspondiente', () => {
    const fechaCorteOriginal = monitoreo.fechaCorte;
    const original = structuredClone(monitoreo);
    const actualizado = prepararRevision(original, revision());
    const frente = actualizado.frentes.find(({ id }) => id === 'enia-plan-accion');

    expect(frente?.fechaUltimaRevision).toBe('2026-09-21');
    expect(frente?.fechaProximaRevision).toBe('2026-10-21');
    expect(actualizado.fechaCorte).toBe([fechaCorteOriginal, '2026-09-21'].sort().at(-1));
    expect(actualizado.revisiones.some(({ id }) => id === 'revision-prueba-2026-09-21')).toBe(true);
    expect(monitoreo.fechaCorte).toBe(fechaCorteOriginal);
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

  it('exige un issue del repositorio para trazar la decisión', () => {
    expect(() =>
      prepararRevision(
        structuredClone(monitoreo),
        revision({ issueUrl: undefined }),
      ),
    ).toThrow(/requiere issueUrl/);

    expect(() =>
      prepararRevision(
        structuredClone(monitoreo),
        revision({ issueUrl: 'https://github.com/otro/repo/issues/1' }),
      ),
    ).toThrow(/mperedwa\/observatorio-ia/);
  });
});
