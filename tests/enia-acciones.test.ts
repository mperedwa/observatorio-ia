import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';
import schema from '../src/data/schemas/eniaAcciones.schema.json';
import {
  ESTADOS_CRUCE_ENIA,
  ESTADOS_EJECUCION_ENIA,
  RECOMENDACIONES_EDITORIALES_ENIA,
  TIPOS_INTERVENCION_ENIA,
  contarIntervencionesEniaPorTipo,
  inventarioEnia,
  intervencionesEnia,
  resultadosEnia,
} from '../src/data/eniaAcciones';

describe('inventario del Plan de Acción ENIA', () => {
  it('valida el dataset completo contra JSON Schema', () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema as object);

    expect(validate(inventarioEnia), JSON.stringify(validate.errors)).toBe(true);
  });

  it('mantiene sincronizados los enums de TypeScript y JSON Schema', () => {
    expect(schema.definitions.tipoIntervencion.enum).toEqual([
      ...TIPOS_INTERVENCION_ENIA,
    ]);
    expect(schema.definitions.cruceCatalogo.properties.estado.enum).toEqual([
      ...ESTADOS_CRUCE_ENIA,
    ]);
    expect(schema.definitions.intervencion.properties.estadoEjecucion.enum).toEqual([
      ...ESTADOS_EJECUCION_ENIA,
    ]);
    expect(
      schema.definitions.intervencion.properties.recomendacionEditorial.enum,
    ).toEqual([...RECOMENDACIONES_EDITORIALES_ENIA]);
  });

  it('fija la extracción íntegra de la versión agosto 2025', () => {
    expect(inventarioEnia.resumen).toEqual({
      ejes: 7,
      lineasAccion: 13,
      resultadosEsperados: 36,
      intervenciones: 129,
      indicadores: 144,
    });
    expect(resultadosEnia).toHaveLength(36);
    expect(intervencionesEnia).toHaveLength(129);
    expect(new Set(resultadosEnia.map((resultado) => resultado.eje.numero)).size).toBe(7);
    expect(
      new Set(resultadosEnia.map((resultado) => resultado.lineaAccion.codigo)).size,
    ).toBe(13);
  });

  it('preserva el salto 2.1.1 → 2.1.3 sin inventar el resultado 2.1.2', () => {
    const codigos = resultadosEnia.map((resultado) => resultado.codigo);
    expect(codigos).toContain('2.1.1');
    expect(codigos).not.toContain('2.1.2');
    expect(codigos).toContain('2.1.3');

    const agricultura = intervencionesEnia.find((intervencion) =>
      intervencion.objetivoFuenteEs.includes('trazabilidad pecuaria'),
    );
    expect(
      resultadosEnia.find((resultado) =>
        resultado.intervenciones.some((intervencion) => intervencion.id === agricultura?.id),
      )?.codigo,
    ).toBe('2.1.1');
  });

  it('no convierte metas oficiales en evidencia de ejecución', () => {
    expect(
      intervencionesEnia.every(
        (intervencion) =>
          intervencion.estadoEjecucion === 'no-verificado' &&
          intervencion.cruceCatalogo.estado === 'no-determinado' &&
          intervencion.cruceCatalogo.proyectoIds.length === 0,
      ),
    ).toBe(true);
  });

  it('clasifica las 129 intervenciones por naturaleza, no como 129 sistemas', () => {
    expect(contarIntervencionesEniaPorTipo()).toEqual({
      'politica-gobernanza': 24,
      'capacitacion-formacion': 48,
      'investigacion-diagnostico': 9,
      'articulacion-financiamiento': 8,
      'infraestructura-habilitante': 11,
      'solucion-ia-declarada': 28,
      'automatizacion-digital': 1,
      'por-determinar': 0,
    });
  });

  it('mantiene IDs únicos y trazabilidad a la página fuente', () => {
    const ids = intervencionesEnia.map((intervencion) => intervencion.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(
      intervencionesEnia.every(
        (intervencion) =>
          intervencion.paginaPlan >= 1 &&
          intervencion.paginaPlan <= 51 &&
          intervencion.responsableOficial.length > 0,
      ),
    ).toBe(true);
  });
});
