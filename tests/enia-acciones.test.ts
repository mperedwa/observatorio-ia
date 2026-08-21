import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';
import schema from '../src/data/schemas/eniaAcciones.schema.json';
import { proyectos } from '../src/data/proyectos';
import {
  ESTADOS_CRUCE_ENIA,
  ESTADOS_EJECUCION_ENIA,
  RECOMENDACIONES_EDITORIALES_ENIA,
  TIPOS_INTERVENCION_ENIA,
  contarIntervencionesEniaPorCruce,
  contarIntervencionesEniaPorTipo,
  inventarioEnia,
  intervencionesEnia,
  obtenerProyectoIdsMapeadosEnEnia,
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

  it('completa el crosswalk sin convertir una meta en evidencia', () => {
    expect(inventarioEnia.schemaVersion).toBe(2);
    expect(contarIntervencionesEniaPorCruce()).toEqual({
      'mapeado-exacto': 6,
      'coincidencia-parcial': 9,
      'posible-duplicado': 9,
      'nuevo-con-evidencia': 0,
      'enia-solamente': 22,
      'no-es-sistema-ia': 83,
      'no-determinado': 0,
    });

    for (const intervencion of intervencionesEnia) {
      expect(intervencion.cruceCatalogo.fundamento.es.length).toBeGreaterThan(0);
      expect(intervencion.cruceCatalogo.fundamento.en.length).toBeGreaterThan(0);

      if (
        intervencion.cruceCatalogo.estado === 'mapeado-exacto' ||
        intervencion.cruceCatalogo.estado === 'coincidencia-parcial'
      ) {
        expect(intervencion.cruceCatalogo.proyectoIds.length).toBeGreaterThan(0);
      }

      if (
        intervencion.cruceCatalogo.estado === 'enia-solamente' ||
        intervencion.cruceCatalogo.estado === 'no-es-sistema-ia'
      ) {
        expect(intervencion.cruceCatalogo.proyectoIds).toEqual([]);
        expect(intervencion.estadoEjecucion).toBe('no-verificado');
      }

      if (intervencion.cruceCatalogo.estado === 'nuevo-con-evidencia') {
        expect(intervencion.cruceCatalogo.proyectoIds).toEqual([]);
        expect(intervencion.evidenciasExternas?.length).toBeGreaterThan(0);
      }
    }
  });

  it('clasifica las 129 intervenciones por naturaleza, no como 129 sistemas', () => {
    expect(contarIntervencionesEniaPorTipo()).toEqual({
      'politica-gobernanza': 24,
      'capacitacion-formacion': 47,
      'investigacion-diagnostico': 9,
      'articulacion-financiamiento': 8,
      'infraestructura-habilitante': 11,
      'solucion-ia-declarada': 29,
      'automatizacion-digital': 1,
      'por-determinar': 0,
    });
  });

  it('solo referencia IDs existentes del catálogo', () => {
    const idsCatalogo = new Set(proyectos.map((proyecto) => proyecto.id));
    const idsMapeados = obtenerProyectoIdsMapeadosEnEnia();

    expect(idsMapeados).toEqual([
      'ccss-aida',
      'ccss-depuracion-listas',
      'ccss-lidia',
      'ccss-logistica-ia-abastecimiento',
      'ccss-redimed',
      'ccss-tec-formacion',
      'cenat-lania',
      'hacienda-anomaly',
      'hacienda-asistente',
      'inamu-ela',
      'ins-reclamos-medicos-ia',
      'mep-intel',
      'micitt-agroboost',
      'micitt-linc',
    ]);
    expect(idsMapeados.every((id) => idsCatalogo.has(id))).toBe(true);
    expect(idsMapeados).not.toContain('pj-oij-tec-ia-investigacion');
  });

  it('conserva nueve repeticiones con una fila canónica válida', () => {
    const porId = new Map(
      intervencionesEnia.map((intervencion) => [intervencion.id, intervencion]),
    );
    const duplicados = intervencionesEnia.filter(
      (intervencion) => intervencion.cruceCatalogo.estado === 'posible-duplicado',
    );

    expect(duplicados.map((intervencion) => intervencion.id)).toEqual([
      'enia-3-1-1-04',
      'enia-3-2-1-01',
      'enia-4-1-2-01',
      'enia-4-1-3-14',
      'enia-4-1-3-21',
      'enia-4-1-3-22',
      'enia-4-1-3-23',
      'enia-4-1-3-30',
      'enia-5-1-3-04',
    ]);

    for (const duplicado of duplicados) {
      const canonicaId = duplicado.cruceCatalogo.intervencionCanonicaId;
      expect(canonicaId).toBeDefined();
      expect(canonicaId).not.toBe(duplicado.id);
      expect(porId.has(canonicaId!)).toBe(true);
      expect(porId.get(canonicaId!)?.cruceCatalogo.estado).not.toBe(
        'posible-duplicado',
      );
    }
  });

  it('mantiene separados los casos sensibles y enlaza las nuevas fichas', () => {
    const porId = new Map(
      intervencionesEnia.map((intervencion) => [intervencion.id, intervencion]),
    );
    const ins = porId.get('enia-4-1-3-24');
    const inamu = porId.get('enia-4-1-3-05');
    const ice = porId.get('enia-4-1-3-25');
    const ayaCompras = porId.get('enia-4-1-3-27');
    const rpa = porId.get('enia-4-1-3-29');

    expect(ins?.cruceCatalogo.estado).toBe('mapeado-exacto');
    expect(ins?.cruceCatalogo.proyectoIds).toEqual([
      'ins-reclamos-medicos-ia',
    ]);
    expect(ins?.estadoEjecucion).toBe('verificado');
    expect(ins?.faseRealVerificada).toBe('operativo');
    expect(ins?.evidenciasExternas?.[0]?.publicador).toBe(
      'Instituto Nacional de Seguros',
    );

    expect(inamu?.cruceCatalogo.estado).toBe('mapeado-exacto');
    expect(inamu?.cruceCatalogo.proyectoIds).toEqual(['inamu-ela']);
    expect(inamu?.estadoEjecucion).toBe('verificado');
    expect(inamu?.faseRealVerificada).toBe('operativo');
    expect(inamu?.evidenciasExternas?.map((fuente) => fuente.id)).toEqual([
      'inamu-ela-ia-oficial',
      'inamu-ela-terminos-privacidad',
    ]);

    expect(
      porId.get('enia-4-1-3-14')?.cruceCatalogo.proyectoIds,
    ).toEqual(['inamu-ela']);

    expect(ice?.cruceCatalogo.estado).toBe('enia-solamente');
    expect(ice?.cruceCatalogo.proyectoIds).toEqual([]);
    expect(ice?.notasEditoriales?.es).toContain('OIJ-TEC');
    expect(ice?.notasEditoriales?.es).toContain('SUPERCOP');

    expect(ayaCompras?.cruceCatalogo.estado).toBe('enia-solamente');
    expect(ayaCompras?.notasEditoriales?.es).toContain('no delega');
    expect(rpa?.cruceCatalogo.estado).toBe('no-es-sistema-ia');
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
