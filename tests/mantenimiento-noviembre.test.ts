import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { proyectos, type Proyecto } from '../src/data/proyectos';
import { instituciones } from '../src/data/instituciones';
import { ilia2025, iliaVigente, comparativaRegional, kpisHero } from '../src/data/indicadores';
import { frentesMonitoreo, revisionesMonitoreo, calcularEstadoAgenda } from '../src/data/monitoreo';
import { esAdopcionVerificada } from '../src/data/modelo-evidencia';

const frozen = <T,>(dataset: string): T => JSON.parse(readFileSync(
  `public/api/releases/2026-10-29-r17/${dataset}.json`, 'utf8',
)).data as T;

describe('mantenimiento editorial del 5 de noviembre', () => {
  it('modifica dos fichas existentes sin altas, duplicados ni cambios ajenos al lote', () => {
    const previous = frozen<Proyecto[]>('proyectos');
    expect(proyectos.map(({ id }) => id)).toEqual(previous.map(({ id }) => id));
    expect(proyectos.filter(p => JSON.stringify(p) !== JSON.stringify(previous.find(old => old.id === p.id)))
      .map(({ id }) => id)).toEqual(['pj-chatbot', 'invu-vincent-ai']);
    expect(proyectos.some(({ id }) => /govos|simon/.test(id))).toBe(false);
  });

  it('reclasifica ChatbotPJ por técnica primaria y conserva fecha y resultados históricos', () => {
    const p = proyectos.find(({ id }) => id === 'pj-chatbot')!;
    const old = frozen<Proyecto[]>('proyectos').find(({ id }) => id === p.id)!;
    expect(esAdopcionVerificada(p)).toBe(true);
    expect(p.fechaInicioOperacion).toBe(old.fechaInicioOperacion);
    expect(p.resultadosVerificados).toEqual(old.resultadosVerificados);
    expect(p.evaluacion?.tecnicaIA.fuenteIds).toEqual(['pj-chatbot-declaracion-ia']);
    expect(p.fuentes?.find(({ id }) => id === 'pj-chatbot-declaracion-ia')).toMatchObject({
      tipoFuente: 'primaria-oficial', fechaConsulta: '2026-11-05',
      url: expect.stringContaining('transparencia.poder-judicial.go.cr'),
    });
    expect(p.contexto?.es).toContain('no se evaluaron conversaciones');
    expect(instituciones.find(({ id }) => id === 'poder-judicial')?.resumen.es)
      .toContain('cuatro adopciones verificadas');
  });

  it('no convierte contrato notificado en activación de licencias o adopción', () => {
    const p = proyectos.find(({ id }) => id === 'invu-vincent-ai')!;
    expect(p.estadoCatalogo).toBe('seguimiento');
    expect(p.faseImplementacion).toBe('planificado');
    expect(p.evaluacion?.usoOperativo.estado).toBe('no-determinado');
    expect(p.fechaInicioOperacion).toBeUndefined();
    expect(p.datosConocidos?.[1].es).toContain('15 de octubre de 2026');
    expect(p.fuenteUrl).toContain('sicop.go.cr');
  });

  it('conserva ILIA 2025 y usa el ranking 2026 sin mezclar presupuestos ni inferir una serie temporal', () => {
    const previous = frozen<{ ilia2025: unknown; comparativaRegional: typeof comparativaRegional }>('indicadores');
    expect(ilia2025).toEqual(previous.ilia2025);
    expect(iliaVigente.map(({ ilia }) => ilia)).toEqual([71.4, 68.4, 67, 56.8, 56]);
    expect(iliaVigente.every(({ edicion, fuenteUrl }) => edicion === 2026 && fuenteUrl.endsWith('ranking-ilia-2026.svg'))).toBe(true);
    for (const [i, p] of comparativaRegional.entries()) {
      expect(p.inversion).toEqual(previous.comparativaRegional[i].inversion);
      expect(p.hito).toEqual(previous.comparativaRegional[i].hito);
    }
    const kpi = kpisHero.find(({ label }) => label.es === 'Posición ILIA Latinoamérica')!;
    expect(kpi.valor).toBe('5°');
    expect(kpi.detalle.es).toContain('56,0/100');
    expect(kpi.detalle.es).toContain('15,4');
  });

  it('mantiene vencidos los controles parciales y renueva solo los frentes revisados', () => {
    for (const id of ['legislacion-ia', 'enia-plan-accion']) {
      const f = frentesMonitoreo.find(f => f.id === id)!;
      expect(calcularEstadoAgenda(f, '2026-11-05')).toBe('vencida');
      expect(revisionesMonitoreo.find(r => r.fecha === '2026-11-05' && r.frenteId === id)?.alcanceRevision).toBe('parcial');
    }
    for (const id of ['catalogo-seguimiento', 'indicador-ilia']) {
      expect(frentesMonitoreo.find(f => f.id === id)?.fechaUltimaRevision).toBe('2026-11-05');
    }
    expect(frentesMonitoreo.find(f => f.id === 'indicador-ilia')?.fechaProximaRevision).toBe('2026-11-12');
  });
});
