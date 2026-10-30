import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { proyectos, type Proyecto } from '../src/data/proyectos';
import { instituciones } from '../src/data/instituciones';
import { recursos } from '../src/data/recursos';
import { instrumentos } from '../src/data/marcoPais';
import { intervencionesEnia, inventarioEnia } from '../src/data/eniaAcciones';
import { expedientes } from '../src/data/legislacion';
import { frentesMonitoreo, calcularEstadoAgenda } from '../src/data/monitoreo';
import { esAdopcionVerificada, resumirCatalogo } from '../src/data/modelo-evidencia';

const read = <T,>(path: string): T => JSON.parse(
  readFileSync(join(process.cwd(), path), 'utf8'),
) as T;
const previous = read<{ data: Proyecto[] }>(
  'public/api/releases/2026-10-05-r16/proyectos.json',
).data;
const previousEnia = read<{ data: typeof inventarioEnia }>(
  'public/api/releases/2026-10-05-r16/enia-acciones.json',
).data;
const newIds = ['tec-asistente-auditoria-ia', 'cgr-diara', 'tse-chat-votante-informado'];

describe('sprint editorial del 29 de octubre de 2026', () => {
  it('añade solo tres fichas y conserva exactamente las 39 anteriores', () => {
    expect(previous).toHaveLength(39);
    for (const old of previous) {
      expect(proyectos.find(({ id }) => id === old.id), old.id).toEqual(old);
    }
    expect(proyectos.filter(({ id }) => !previous.some((old) => old.id === id))
      .map(({ id }) => id)).toEqual(newIds);
    expect(resumirCatalogo(proyectos)).toMatchObject({
      iniciativasDocumentadas: 42,
      adopcionVerificada: 10,
      seguimiento: 16,
      ecosistema: 16,
    });
    expect(instituciones).toHaveLength(19);
    for (const id of ['tec', 'cgr', 'tse']) {
      expect(instituciones.find((item) => item.id === id)?.proyectosActivos).toBe(1);
      expect(proyectos.filter(({ institucionId }) => institucionId === id)).toHaveLength(1);
    }
  });

  it('verifica dIAra por evidencia técnica primaria de piloto, no por cámaras o prensa', () => {
    const diara = proyectos.find(({ id }) => id === 'cgr-diara')!;
    expect(esAdopcionVerificada(diara)).toBe(true);
    expect(diara.faseImplementacion).toBe('piloto');
    expect(diara.evaluacion?.usoOperativo.estado).toBe('parcialmente-confirmado');
    expect(diara.fechaPrimeraEvidencia).toBe('2024-05-10');
    expect(diara.fechaInicioOperacion).toBeUndefined();
    expect(diara.fuenteUrl).toContain('26a53a7fe89032e56dde014674ac0b830034692d');
    expect(diara.fuentes!.some(({ tipoFuente }) => tipoFuente === 'prensa')).toBe(false);
    for (const id of diara.evaluacion!.ejecucion.fuenteIds) {
      expect(diara.fuentes!.find((source) => source.id === id)?.tipoFuente)
        .toBe('primaria-oficial');
    }
    expect(diara.descripcion.es).toContain('Faster R-CNN con ResNet50');
    expect(diara.resultadosVerificados?.[0].texto.es).toContain('no una evaluación independiente');
    expect(diara.datosNoDeterminados?.[0].es).toContain('continuidad actual');
  });

  it('no convierte la presentación con RAG del TEC en uso operativo', () => {
    const tec = proyectos.find(({ id }) => id === 'tec-asistente-auditoria-ia')!;
    expect(tec.estadoCatalogo).toBe('seguimiento');
    expect(tec.faseImplementacion).toBe('desarrollo');
    expect(tec.evaluacion?.ejecucion.estado).toBe('parcialmente-confirmado');
    expect(tec.evaluacion?.usoOperativo.estado).toBe('no-determinado');
    expect(esAdopcionVerificada(tec)).toBe(false);
    expect(tec.relaciones).toContainEqual(expect.objectContaining({
      iniciativaId: 'pj-oij-tec-ia-investigacion', tipo: 'distinto-de',
    }));
  });

  it('conserva el chatbot electoral sin inventar continuidad, técnica o fecha de cierre', () => {
    const tse = proyectos.find(({ id }) => id === 'tse-chat-votante-informado')!;
    expect(tse.estadoCatalogo).toBe('seguimiento');
    expect(tse.faseImplementacion).toBe('no-determinado');
    expect(tse.fechaInicioOperacion).toBe('2025-12-12');
    expect(tse.evaluacion?.ejecucion.estado).toBe('confirmado');
    expect(tse.evaluacion?.tecnicaIA.estado).toBe('no-determinado');
    expect(tse.descripcion.es).toContain('operación histórica');
    expect(esAdopcionVerificada(tse)).toBe(false);
    expect(tse.fuentes).toHaveLength(3);
  });

  it('limita la evidencia municipal a participantes sin atribuir cumplimiento al IFAM', () => {
    const accion = intervencionesEnia.find(({ id }) => id === 'enia-4-1-3-02')!;
    expect(accion.estadoEjecucion).toBe('no-verificado');
    expect(accion.cruceCatalogo.estado).toBe('enia-solamente');
    expect(accion.cruceCatalogo.proyectoIds).toEqual([]);
    expect(accion.indicadores[0].metaPeriodoFuente).toBe('Meta periodo: 9 2025: 3 2026: 3 2027: 3');
    expect(accion.evidenciasExternas).toHaveLength(3);
    expect(accion.notasEditoriales?.es).toContain('No se extrapola');
    const recurso = recursos.find(({ id }) => id === 'ucr-censo-tic-municipal-2026')!;
    expect(recurso.nota?.es).toContain('43 participantes');
    expect(recurso.nota?.es).toContain('no una estimación nacional');
    const oldActions = previousEnia.resultados.flatMap((result) => result.intervenciones);
    for (const old of oldActions) {
      const current = intervencionesEnia.find(({ id }) => id === old.id)!;
      if (old.id !== accion.id) expect(current, old.id).toEqual(old);
      else {
        expect(current.indicadores).toEqual(old.indicadores);
        expect(current.cruceCatalogo.proyectoIds).toEqual(old.cruceCatalogo.proyectoIds);
      }
    }
    expect(inventarioEnia.fuente.fechaVersion).toBe('2025-08-11');
  });

  it('incorpora el decreto como norma sectorial sin añadir proyecto o expediente', () => {
    const norma = instrumentos.find(({ id }) => id === 'snvpc-45961-msp')!;
    expect(norma.fechaPublicacion).toBe('2026-10-14');
    expect(norma.fuerzaTipo).toBe('obligatoria');
    expect(norma.recursoIds).toEqual(['decreto-45961-msp']);
    expect(recursos.find(({ id }) => id === norma.recursoIds![0])?.tipoFuente)
      .toBe('primaria-oficial');
    expect(instrumentos).toHaveLength(8);
    expect(recursos).toHaveLength(18);
    expect(expedientes).toHaveLength(7);
    expect(proyectos.some(({ id }) => /45961|cr-t1308|sbd.*juridic/.test(id))).toBe(false);
    expect(proyectos.filter(({ id }) => id === 'ccss-depuracion-listas')).toHaveLength(1);
  });

  it('mantiene vencidas las revisiones integrales no realizadas y las cantidades sincronizadas', () => {
    const fechas = {
      'legislacion-ia': ['2026-10-01', '2026-10-08'],
      'enia-plan-accion': ['2026-09-15', '2026-10-15'],
      'catalogo-seguimiento': ['2026-09-15', '2026-10-15'],
      'indicador-ilia': ['2026-09-16', '2026-10-16'],
    };
    for (const [id, [last, next]] of Object.entries(fechas)) {
      const frente = frentesMonitoreo.find((item) => item.id === id)!;
      expect(frente.fechaUltimaRevision).toBe(last);
      expect(frente.fechaProximaRevision).toBe(next);
      expect(calcularEstadoAgenda(frente, '2026-10-29')).toBe('vencida');
    }
    for (const [id, count] of [['catalogo-seguimiento', 16], ['catalogo-verificado', 10], ['marco-pais', 8]] as const) {
      expect(frentesMonitoreo.find((item) => item.id === id)?.alcance.cantidad).toBe(count);
    }
    for (const id of newIds) {
      expect(proyectos.find((item) => item.id === id)?.fechaProximaRevision).toBe('2026-11-29');
    }
  });

});
