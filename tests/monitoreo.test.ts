import { describe, expect, it } from 'vitest';
import { intervencionesEnia } from '../src/data/eniaAcciones';
import { expedientes } from '../src/data/legislacion';
import { instrumentos } from '../src/data/marcoPais';
import {
  calcularEstadoAgenda,
  frentesMonitoreo,
  monitoreo,
  revisionesMonitoreo,
  resumenMonitoreo,
} from '../src/data/monitoreo';
import { proyectos } from '../src/data/proyectos';

describe('agenda de monitoreo editorial', () => {
  it('mantiene identificadores y referencias internas únicas', () => {
    const frenteIds = frentesMonitoreo.map(({ id }) => id);
    const revisionIds = revisionesMonitoreo.map(({ id }) => id);
    const cadenciaIds = monitoreo.politica.cadencias.map(({ id }) => id);

    expect(new Set(frenteIds).size).toBe(frenteIds.length);
    expect(new Set(revisionIds).size).toBe(revisionIds.length);
    expect(new Set(cadenciaIds).size).toBe(cadenciaIds.length);

    for (const frente of frentesMonitoreo) {
      expect(cadenciaIds).toContain(frente.cadenciaId);
      expect(frente.fechaProximaRevision > frente.fechaUltimaRevision).toBe(true);
    }
    for (const revision of revisionesMonitoreo) {
      expect(frenteIds).toContain(revision.frenteId);
      expect(revision.fecha <= monitoreo.fechaCorte).toBe(true);
    }
  });

  it('deriva los alcances desde los datasets publicados', () => {
    const conteos = new Map(
      frentesMonitoreo.map(({ metrica, alcance }) => [metrica, alcance.cantidad]),
    );
    const intervencionesUnicas = intervencionesEnia.filter(
      ({ cruceCatalogo }) => !cruceCatalogo.intervencionCanonicaId,
    );

    expect(conteos.get('legislacion-expedientes')).toBe(expedientes.length);
    expect(conteos.get('enia-intervenciones-unicas')).toBe(intervencionesUnicas.length);
    expect(conteos.get('catalogo-seguimiento')).toBe(
      proyectos.filter(({ estadoCatalogo }) => estadoCatalogo === 'seguimiento').length,
    );
    expect(conteos.get('catalogo-verificado')).toBe(
      proyectos.filter(({ estadoCatalogo }) => estadoCatalogo === 'verificado').length,
    );
    expect(conteos.get('catalogo-ecosistema')).toBe(
      proyectos.filter(({ estadoCatalogo }) => estadoCatalogo === 'ecosistema').length,
    );
    expect(conteos.get('marco-pais-instrumentos')).toBe(instrumentos.length);
  });

  it('distingue revisiones sin cambios de transiciones publicadas', () => {
    for (const revision of revisionesMonitoreo) {
      if (revision.resultado === 'sin-cambios') {
        expect(revision.transiciones).toHaveLength(0);
      } else {
        expect(revision.transiciones.length).toBeGreaterThan(0);
      }
    }

    expect(resumenMonitoreo.revisionesSinCambios).toBe(3);
    expect(resumenMonitoreo.cambiosPublicados).toBe(5);
  });

  it('calcula el estado contra el corte publicado y no contra el reloj local', () => {
    const frente = frentesMonitoreo[0];
    expect(calcularEstadoAgenda(frente, frente.fechaUltimaRevision)).toBe('al-dia');
    expect(calcularEstadoAgenda(frente, frente.fechaProximaRevision)).toBe('vence-hoy');
    expect(calcularEstadoAgenda(frente, '2099-01-01')).toBe('vencida');
  });
});
