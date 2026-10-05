import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { proyectos, type Proyecto } from '../src/data/proyectos';
import { instituciones } from '../src/data/instituciones';
import { inventarioEnia, intervencionesEnia } from '../src/data/eniaAcciones';
import { frentesMonitoreo } from '../src/data/monitoreo';
import { esAdopcionVerificada, resumirCatalogo } from '../src/data/modelo-evidencia';
import { formatearFechaCatalogo } from '../src/data/presentacion-catalogo';
import { eniaTranslations } from '../src/app/[locale]/enia/translations';

const previous = JSON.parse(readFileSync(
  join(process.cwd(), 'public/api/releases/2026-10-01-r15/proyectos.json'), 'utf8',
)) as { data: Proyecto[] };

describe('Hello Brete y corte limitado del 5 de octubre', () => {
  it('deriva la fecha del encabezado ENIA desde el dataset en ambos idiomas', () => {
    const page = readFileSync(join(process.cwd(), 'src/app/[locale]/enia/page.tsx'), 'utf8');
    expect(page).toContain('formatearFechaCatalogo(inventarioEnia.fechaCorte, lc)');
    for (const locale of ['es', 'en'] as const) {
      expect(eniaTranslations[locale].updated).toContain('{date}');
      const rendered = eniaTranslations[locale].updated.replace(
        '{date}', formatearFechaCatalogo(inventarioEnia.fechaCorte, locale),
      );
      expect(rendered).not.toContain('{date}');
      expect(rendered).toContain('2026');
      expect(rendered).not.toMatch(/agosto|August/);
    }
  });

  it('registra el servicio operativo sin convertir su IA en adopción verificada', () => {
    const hello = proyectos.find(({ id }) => id === 'ina-hello-brete')!;
    expect(hello.estadoCatalogo).toBe('seguimiento');
    expect(hello.faseImplementacion).toBe('operativo');
    expect(hello.evaluacion?.ejecucion.estado).toBe('confirmado');
    expect(hello.evaluacion?.tecnicaIA.estado).toBe('parcialmente-confirmado');
    expect(hello.evaluacion?.usoOperativo.estado).toBe('no-determinado');
    expect(hello.evaluacion?.resultados.estado).toBe('no-determinado');
    expect(esAdopcionVerificada(hello)).toBe(false);
    expect(hello.fechaInicioOperacion).toBe('2026-04-13');
    expect(hello.fechaProximaRevision).toBe('2026-11-05');
    expect(hello.relaciones).toContainEqual(expect.objectContaining({
      iniciativaId: 'ina-sne-brete-ia', tipo: 'distinto-de',
    }));
  });

  it('conserva todas las fichas anteriores y no publica los candidatos pendientes', () => {
    expect(previous.data).toHaveLength(38);
    for (const proyecto of previous.data) {
      expect(proyectos.find(({ id }) => id === proyecto.id), proyecto.id).toEqual(proyecto);
    }
    expect(proyectos).toHaveLength(39);
    expect(proyectos.some(({ institucionId }) => institucionId === 'cgr')).toBe(false);
    expect(proyectos.filter(({ institucionId }) => institucionId === 'sbd')).toHaveLength(1);
    expect(resumirCatalogo(proyectos)).toMatchObject({
      iniciativasDocumentadas: 39, adopcionVerificada: 9, seguimiento: 14, ecosistema: 16,
    });
    expect(instituciones).toHaveLength(16);
    expect(instituciones.find(({ id }) => id === 'ina')?.proyectosActivos).toBe(2);
  });

  it('incorpora evidencia adyacente sin atribuir Hello Brete a la meta ENIA', () => {
    const accion = intervencionesEnia.find(({ id }) => id === 'enia-4-1-3-01')!;
    expect(accion.estadoEjecucion).toBe('no-verificado');
    expect(accion.cruceCatalogo.estado).toBe('coincidencia-parcial');
    expect(accion.cruceCatalogo.proyectoIds).toEqual(['ina-sne-brete-ia']);
    expect(accion.evidenciasExternas).toContainEqual(expect.objectContaining({
      id: 'micitt-hello-brete-lanzamiento-2026', respalda: ['existencia'],
    }));
    expect(accion.notasEditoriales?.es).toContain('No se suman');
    expect(accion.fechaUltimaRevision).toBe('2026-10-05');
    expect(inventarioEnia.fuente.fechaVersion).toBe('2025-08-11');
  });

  it('no renueva fechas de frentes que no se revisaron íntegramente', () => {
    for (const id of ['enia-plan-accion', 'catalogo-seguimiento']) {
      const frente = frentesMonitoreo.find((f) => f.id === id)!;
      expect(frente.fechaUltimaRevision).toBe('2026-09-15');
      expect(frente.fechaProximaRevision).toBe('2026-10-15');
    }
    expect(frentesMonitoreo.find(({ id }) => id === 'legislacion-ia')?.fechaProximaRevision)
      .toBe('2026-10-08');
    expect(frentesMonitoreo.find(({ id }) => id === 'catalogo-seguimiento')?.alcance.cantidad)
      .toBe(14);
  });

  it('separa el anuncio del proveedor de la fuente oficial de ejecución', () => {
    const hello = proyectos.find(({ id }) => id === 'ina-hello-brete')!;
    const ejecucionIds = hello.evaluacion!.ejecucion.fuenteIds;
    const proveedor = hello.fuentes!.find(({ id }) => id === 'open-english-hello-brete-fluentia-2026')!;
    expect(proveedor.tipoFuente).toBe('otra-secundaria');
    expect(ejecucionIds).not.toContain(proveedor.id);
    expect(hello.fuentes!.find(({ id }) => ejecucionIds.includes(id))?.tipoFuente)
      .toBe('primaria-oficial');
    expect(hello.contexto?.es).toContain('no es una resolución');
  });
});
