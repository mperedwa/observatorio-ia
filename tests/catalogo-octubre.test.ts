import { describe, expect, it } from 'vitest';
import { proyectos } from '../src/data/proyectos';
import { instituciones } from '../src/data/instituciones';
import { intervencionesEnia } from '../src/data/eniaAcciones';
import { esAdopcionVerificada } from '../src/data/modelo-evidencia';
import { getDictionary } from '../src/i18n/dictionaries';

describe('corte editorial del 1 de octubre de 2026', () => {
  it('admite los dos asistentes probados sin convertir contrataciones en adopciones', () => {
    for (const id of ['cartago-munibot', 'micitt-asistente-virtual']) {
      const proyecto = proyectos.find((p) => p.id === id)!;
      expect(esAdopcionVerificada(proyecto), id).toBe(true);
      expect(proyecto.evaluacion?.resultados.estado).toBe('no-determinado');
    }
    for (const id of ['invu-vincent-ai', 'sbd-ia-auditoria', 'la-union-rodu', 'salud-dejar-fumar-vapear']) {
      const proyecto = proyectos.find((p) => p.id === id)!;
      expect(proyecto.estadoCatalogo, id).toBe('seguimiento');
      expect(esAdopcionVerificada(proyecto), id).toBe(false);
      expect(proyecto.evaluacion?.usoOperativo.estado).toBe('no-determinado');
    }
  });

  it('no atribuye implementaciones municipales independientes a IFAM', () => {
    const accion = intervencionesEnia.find((a) => a.id === 'enia-4-1-3-02')!;
    expect(accion.estadoEjecucion).toBe('no-verificado');
    expect(accion.cruceCatalogo.estado).toBe('enia-solamente');
    expect(accion.cruceCatalogo.proyectoIds).toEqual([]);
    expect(accion.evidenciasExternas).toHaveLength(2);
    expect(accion.cruceCatalogo.fundamento.es).toContain('no acredita');
  });

  it('presenta cada tipo institucional en ambos idiomas y no duplica IDs', () => {
    expect(new Set(proyectos.map((p) => p.id)).size).toBe(proyectos.length);
    for (const locale of ['es', 'en'] as const) {
      for (const institucion of instituciones) {
        expect(getDictionary(locale).instituciones.tipoLabel[institucion.tipo]).toBeTruthy();
      }
    }
    expect(instituciones.find((i) => i.id === 'sbd')?.tipo).toBe('organo-publico');
    expect(instituciones.filter((i) => i.tipo === 'municipalidad')).toHaveLength(2);
  });
});
