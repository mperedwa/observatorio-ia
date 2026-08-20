import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';
import { proyectos } from '../src/data/proyectos';
import proyectosSchema from '../src/data/schemas/proyectos.schema.json';
import {
  DIMENSIONES_EVIDENCIA,
  ESTADOS_CATALOGO,
  ESTADOS_EVALUACION,
  ESTADOS_IA,
  FASES_IMPLEMENTACION,
  MODELO_EVIDENCIA_VERSION,
  NATURALEZAS_AFIRMACION,
  RESPALDOS_FUENTE,
  TIPOS_FUENTE,
  TIPOS_INICIATIVA,
  TIPOS_RELACION,
  encontrarErroresTrazabilidad,
  esAdopcionVerificada,
  esVisibleEnCatalogo,
  resolverFaseImplementacion,
  resumirCatalogo,
  type CamposModeloEvidencia,
  type EstadoEvaluacion,
  type EvaluacionEvidencia,
} from '../src/data/modelo-evidencia';

const FUENTE_ID = 'fuente-principal';

function evaluacion(
  ejecucion: EstadoEvaluacion = 'confirmado',
): EvaluacionEvidencia {
  return {
    existencia: { estado: 'confirmado', fuenteIds: [FUENTE_ID] },
    ejecucion: {
      estado: ejecucion,
      fuenteIds: ejecucion === 'no-determinado' ? [] : [FUENTE_ID],
    },
    tecnicaIA: { estado: 'confirmado', fuenteIds: [FUENTE_ID] },
    usoOperativo: { estado: 'confirmado', fuenteIds: [FUENTE_ID] },
    resultados: { estado: 'no-determinado', fuenteIds: [] },
    gobernanza: { estado: 'no-determinado', fuenteIds: [] },
  };
}

function iniciativaV2(
  overrides: Partial<CamposModeloEvidencia> = {},
): CamposModeloEvidencia {
  return {
    modeloVersion: MODELO_EVIDENCIA_VERSION,
    tipoIniciativa: 'sistema-ia',
    estadoCatalogo: 'verificado',
    faseImplementacion: 'operativo',
    estadoIA: 'confirmada',
    evaluacion: evaluacion(),
    fuentes: [
      {
        id: FUENTE_ID,
        titulo: { es: 'Fuente principal', en: 'Primary source' },
        url: 'https://example.org/fuente',
        publicador: 'Institución pública',
        tipoFuente: 'primaria-oficial',
        fechaPublicacion: '2026-08-01',
        fechaConsulta: '2026-08-19',
        respalda: ['existencia', 'ejecucion', 'tecnica-ia', 'uso-operativo'],
        naturalezaAfirmacion: ['hecho'],
      },
    ],
    fechaPrimeraEvidencia: '2026-08',
    fechaUltimaVerificacion: '2026-08-19',
    ...overrides,
  };
}

function proyectoJsonV2() {
  return {
    id: 'proyecto-prueba',
    titulo: { es: 'Proyecto de prueba', en: 'Test project' },
    institucionId: 'institucion-prueba',
    categoria: 'infraestructura',
    estado: 'operativo',
    descripcion: { es: 'Descripción', en: 'Description' },
    resultado: { es: 'Sin métricas públicas', en: 'No public metrics' },
    desde: '2026',
    fuenteUrl: 'https://example.org/fuente',
    ...iniciativaV2(),
  };
}

describe('schema de proyectos v2', () => {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(proyectosSchema as object);
  const properties = proyectosSchema.items.properties;
  const definitions = proyectosSchema.definitions;

  it('mantiene sincronizados los enums TypeScript y JSON Schema', () => {
    expect(properties.tipoIniciativa.enum).toEqual([...TIPOS_INICIATIVA]);
    expect(properties.estadoCatalogo.enum).toEqual([...ESTADOS_CATALOGO]);
    expect(properties.faseImplementacion.enum).toEqual([...FASES_IMPLEMENTACION]);
    expect(properties.estadoIA.enum).toEqual([...ESTADOS_IA]);
    expect(definitions.evaluacionDimension.properties.estado.enum).toEqual([
      ...ESTADOS_EVALUACION,
    ]);
    expect(Object.keys(definitions.evaluacion.properties)).toEqual([
      ...DIMENSIONES_EVIDENCIA,
    ]);
    expect(definitions.fuente.properties.tipoFuente.enum).toEqual([...TIPOS_FUENTE]);
    expect(definitions.fuente.properties.respalda.items.enum).toEqual([
      ...RESPALDOS_FUENTE,
    ]);
    expect(definitions.fuente.properties.naturalezaAfirmacion.items.enum).toEqual([
      ...NATURALEZAS_AFIRMACION,
    ]);
    expect(definitions.relacion.properties.tipo.enum).toEqual([...TIPOS_RELACION]);
  });

  it('acepta una ficha legacy sin campos v2 durante la migración', () => {
    const legacy = proyectoJsonV2();
    for (const campo of [
      'modeloVersion',
      'tipoIniciativa',
      'estadoCatalogo',
      'faseImplementacion',
      'estadoIA',
      'evaluacion',
      'fuentes',
      'fechaPrimeraEvidencia',
      'fechaUltimaVerificacion',
    ]) {
      delete legacy[campo as keyof typeof legacy];
    }

    expect(validate([legacy]), JSON.stringify(validate.errors)).toBe(true);
  });

  it('exige el núcleo completo cuando modeloVersion es 2', () => {
    const incompleto = proyectoJsonV2();
    delete incompleto.evaluacion;

    expect(validate([incompleto])).toBe(false);
    expect(validate.errors?.some((error) => error.message?.includes('evaluacion'))).toBe(true);
  });

  it('acepta una ficha v2 completa', () => {
    expect(validate([proyectoJsonV2()]), JSON.stringify(validate.errors)).toBe(true);
  });

  it('valida las 26 fichas reales ya migradas', () => {
    expect(validate(proyectos), JSON.stringify(validate.errors)).toBe(true);
  });
});

describe('catálogo real migrado', () => {
  it('mantiene cobertura v2 completa y trazabilidad limpia', () => {
    expect(proyectos).toHaveLength(26);

    for (const proyecto of proyectos) {
      expect(proyecto.modeloVersion, proyecto.id).toBe(MODELO_EVIDENCIA_VERSION);
      expect(encontrarErroresTrazabilidad(proyecto), proyecto.id).toEqual([]);
      expect(
        proyecto.fuentes?.some((fuente) => fuente.url === proyecto.fuenteUrl),
        proyecto.id,
      ).toBe(true);
    }
  });

  it('fija el corte editorial derivado del 19 de agosto de 2026', () => {
    expect(resumirCatalogo(proyectos)).toEqual({
      iniciativasDocumentadas: 26,
      adopcionVerificada: 5,
      verificadasCatalogo: 5,
      seguimiento: 6,
      ecosistema: 15,
      descartadas: 0,
      pendientesMigracion: 0,
    });

    expect(
      proyectos.filter(esAdopcionVerificada).map((proyecto) => proyecto.id),
    ).toEqual([
      'pj-clasificacion-cobros',
      'pj-ml-presupuestal',
      'pj-nymiz',
      'ccss-lidia',
      'hacienda-anomaly',
    ]);
  });
});

describe('reglas derivadas del catálogo', () => {
  it('cuenta únicamente sistemas o componentes con ejecución confirmada', () => {
    expect(esAdopcionVerificada(iniciativaV2())).toBe(true);
    expect(esAdopcionVerificada(iniciativaV2({ faseImplementacion: 'planificado' }))).toBe(false);
    expect(esAdopcionVerificada(iniciativaV2({ tipoIniciativa: 'programa-capacidades' }))).toBe(false);
    expect(esAdopcionVerificada(iniciativaV2({ estadoIA: 'declarada-sin-tecnica' }))).toBe(false);
    expect(
      esAdopcionVerificada(iniciativaV2({ evaluacion: evaluacion('parcialmente-confirmado') })),
    ).toBe(false);
  });

  it('no convierte una ficha legacy en adopción por inferencia', () => {
    const sinVersion = iniciativaV2({ modeloVersion: undefined });
    expect(esAdopcionVerificada(sinVersion)).toBe(false);
  });

  it('mantiene fichas legacy visibles y excluye descartadas', () => {
    expect(esVisibleEnCatalogo({})).toBe(true);
    expect(esVisibleEnCatalogo({ estadoCatalogo: 'descartado' })).toBe(false);
  });

  it('resuelve la fase v2 antes que el estado legacy', () => {
    expect(resolverFaseImplementacion({ estado: 'piloto' })).toBe('piloto');
    expect(
      resolverFaseImplementacion({ estado: 'operativo', faseImplementacion: 'pausado' }),
    ).toBe('pausado');
    expect(resolverFaseImplementacion({})).toBe('no-determinado');
  });

  it('resume capas y avance de migración sin usar el largo bruto del array', () => {
    const iniciativas: CamposModeloEvidencia[] = [
      {},
      iniciativaV2(),
      iniciativaV2({ estadoCatalogo: 'seguimiento', faseImplementacion: 'anunciado' }),
      iniciativaV2({
        estadoCatalogo: 'ecosistema',
        tipoIniciativa: 'investigacion',
        faseImplementacion: 'desarrollo',
      }),
      iniciativaV2({ estadoCatalogo: 'descartado', estadoIA: 'descartada' }),
    ];

    expect(resumirCatalogo(iniciativas)).toEqual({
      iniciativasDocumentadas: 4,
      adopcionVerificada: 1,
      verificadasCatalogo: 1,
      seguimiento: 1,
      ecosistema: 1,
      descartadas: 1,
      pendientesMigracion: 1,
    });
  });
});

describe('trazabilidad', () => {
  it('detecta fuentes duplicadas y referencias inexistentes', () => {
    const iniciativa = iniciativaV2();
    iniciativa.fuentes = [
      ...iniciativa.fuentes!,
      { ...iniciativa.fuentes![0] },
    ];
    iniciativa.evaluacion = {
      ...iniciativa.evaluacion!,
      ejecucion: { estado: 'confirmado', fuenteIds: ['fuente-inexistente'] },
    };
    iniciativa.resultadosVerificados = [
      {
        id: 'resultado-1',
        texto: { es: 'Resultado', en: 'Result' },
        fuenteIds: ['otra-fuente-inexistente'],
      },
    ];

    expect(encontrarErroresTrazabilidad(iniciativa)).toEqual([
      `fuente duplicada: ${FUENTE_ID}`,
      'ejecucion: fuente inexistente fuente-inexistente',
      'resultado resultado-1: fuente inexistente otra-fuente-inexistente',
    ]);
  });

  it('impide usar una meta oficial como evidencia de ejecución', () => {
    const iniciativa = iniciativaV2();
    iniciativa.fuentes = iniciativa.fuentes!.map((fuente) => ({
      ...fuente,
      respalda: ['existencia', 'objetivo-declarado', 'meta'],
      naturalezaAfirmacion: ['objetivo-declarado', 'meta'],
    }));

    expect(encontrarErroresTrazabilidad(iniciativa)).toContain(
      `ejecucion: fuente ${FUENTE_ID} no respalda esa dimensión`,
    );
    expect(esAdopcionVerificada(iniciativa)).toBe(false);
  });
});
