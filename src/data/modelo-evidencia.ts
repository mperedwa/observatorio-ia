import type { Bilingual } from '../i18n/config';

export const MODELO_EVIDENCIA_VERSION = 2 as const;

export const ESTADOS_PROYECTO_LEGACY = [
  'operativo',
  'piloto',
  'planificado',
] as const;

export const TIPOS_INICIATIVA = [
  'sistema-ia',
  'componente-ia',
  'infraestructura-digital',
  'programa-capacidades',
  'investigacion',
  'politica-gobernanza',
  'digitalizacion-no-ia',
  'por-determinar',
] as const;

export const ESTADOS_CATALOGO = [
  'verificado',
  'seguimiento',
  'ecosistema',
  'descartado',
] as const;

export const FASES_IMPLEMENTACION = [
  'anunciado',
  'planificado',
  'desarrollo',
  'prueba-concepto',
  'piloto',
  'operativo',
  'pausado',
  'suspendido',
  'finalizado',
  'cancelado',
  'no-determinado',
] as const;

export const ESTADOS_IA = [
  'confirmada',
  'declarada-sin-tecnica',
  'no-determinada',
  'descartada',
] as const;

export const ESTADOS_EVALUACION = [
  'confirmado',
  'parcialmente-confirmado',
  'inferido',
  'no-determinado',
  'contradicho',
] as const;

export const DIMENSIONES_EVIDENCIA = [
  'existencia',
  'ejecucion',
  'tecnicaIA',
  'usoOperativo',
  'resultados',
  'gobernanza',
] as const;

export const TIPOS_FUENTE = [
  'primaria-oficial',
  'acceso-informacion',
  'multilateral',
  'academica',
  'prensa',
  'otra-secundaria',
] as const;

export const RESPALDOS_FUENTE = [
  'existencia',
  'objetivo-declarado',
  'meta',
  'ejecucion',
  'tecnica-ia',
  'uso-operativo',
  'resultado-reportado',
  'resultado-independiente',
  'gobernanza',
  'inferencia-editorial',
] as const;

export const NATURALEZAS_AFIRMACION = [
  'hecho',
  'objetivo-declarado',
  'meta',
  'resultado-reportado',
  'resultado-independiente',
  'inferencia-editorial',
] as const;

export const TIPOS_RELACION = [
  'mismo-que',
  'posible-duplicado',
  'componente-de',
  'depende-de',
  'alimenta-a',
  'distinto-de',
  'relacion-no-acreditada',
] as const;

export type EstadoProyectoLegacy = (typeof ESTADOS_PROYECTO_LEGACY)[number];
export type TipoIniciativa = (typeof TIPOS_INICIATIVA)[number];
export type EstadoCatalogo = (typeof ESTADOS_CATALOGO)[number];
export type FaseImplementacion = (typeof FASES_IMPLEMENTACION)[number];
export type EstadoIA = (typeof ESTADOS_IA)[number];
export type EstadoEvaluacion = (typeof ESTADOS_EVALUACION)[number];
export type DimensionEvidencia = (typeof DIMENSIONES_EVIDENCIA)[number];
export type TipoFuente = (typeof TIPOS_FUENTE)[number];
export type RespaldoFuente = (typeof RESPALDOS_FUENTE)[number];
export type NaturalezaAfirmacion = (typeof NATURALEZAS_AFIRMACION)[number];
export type TipoRelacion = (typeof TIPOS_RELACION)[number];

export interface EvaluacionDimension {
  estado: EstadoEvaluacion;
  fuenteIds: string[];
}

export type EvaluacionEvidencia = Record<DimensionEvidencia, EvaluacionDimension>;

export interface FuenteProyecto {
  id: string;
  titulo: Bilingual;
  url: string;
  publicador: string;
  tipoFuente: TipoFuente;
  fechaPublicacion?: string;
  fechaConsulta: string;
  respalda: RespaldoFuente[];
  naturalezaAfirmacion: NaturalezaAfirmacion[];
}

export interface ResultadoVerificado {
  id: string;
  texto: Bilingual;
  fuenteIds: string[];
  fecha?: string;
}

export interface RelacionIniciativa {
  iniciativaId: string;
  tipo: TipoRelacion;
  nota?: Bilingual;
}

/**
 * Campos v2 opcionales mientras se migra el catálogo. Una ficha que declare
 * `modeloVersion: 2` debe incluir el núcleo completo; esa condición también
 * está expresada en proyectos.schema.json.
 */
export interface CamposModeloEvidencia {
  modeloVersion?: typeof MODELO_EVIDENCIA_VERSION;
  tipoIniciativa?: TipoIniciativa;
  estadoCatalogo?: EstadoCatalogo;
  faseImplementacion?: FaseImplementacion;
  estadoIA?: EstadoIA;
  evaluacion?: EvaluacionEvidencia;
  fuentes?: FuenteProyecto[];
  fechaPrimeraEvidencia?: string;
  fechaAnuncio?: string;
  fechaInicioPiloto?: string;
  fechaInicioOperacion?: string;
  fechaUltimaVerificacion?: string;
  fechaProximaRevision?: string;
  objetivoDeclarado?: Bilingual;
  resultadosVerificados?: ResultadoVerificado[];
  preguntasAbiertas?: Bilingual[];
  datosConocidos?: Bilingual[];
  datosNoDeterminados?: Bilingual[];
  relaciones?: RelacionIniciativa[];
}

export interface IniciativaEvidenciaV2 extends CamposModeloEvidencia {
  modeloVersion: typeof MODELO_EVIDENCIA_VERSION;
  tipoIniciativa: TipoIniciativa;
  estadoCatalogo: EstadoCatalogo;
  faseImplementacion: FaseImplementacion;
  estadoIA: EstadoIA;
  evaluacion: EvaluacionEvidencia;
  fuentes: FuenteProyecto[];
  fechaPrimeraEvidencia: string;
  fechaUltimaVerificacion: string;
}

export interface IniciativaCatalogable extends CamposModeloEvidencia {
  id?: string;
  estado?: EstadoProyectoLegacy;
}

export interface ResumenCatalogo {
  iniciativasDocumentadas: number;
  adopcionVerificada: number;
  verificadasCatalogo: number;
  seguimiento: number;
  ecosistema: number;
  descartadas: number;
  pendientesMigracion: number;
}

const TIPOS_QUE_CUENTAN = new Set<TipoIniciativa>(['sistema-ia', 'componente-ia']);
const FASES_QUE_CUENTAN = new Set<FaseImplementacion>(['piloto', 'operativo']);
const RESPALDOS_POR_DIMENSION: Record<
  DimensionEvidencia,
  readonly RespaldoFuente[]
> = {
  existencia: ['existencia'],
  ejecucion: ['ejecucion'],
  tecnicaIA: ['tecnica-ia'],
  usoOperativo: ['uso-operativo'],
  resultados: ['resultado-reportado', 'resultado-independiente'],
  gobernanza: ['gobernanza'],
};

export function tieneModeloEvidenciaV2(
  iniciativa: CamposModeloEvidencia,
): iniciativa is IniciativaEvidenciaV2 {
  return (
    iniciativa.modeloVersion === MODELO_EVIDENCIA_VERSION &&
    iniciativa.tipoIniciativa !== undefined &&
    iniciativa.estadoCatalogo !== undefined &&
    iniciativa.faseImplementacion !== undefined &&
    iniciativa.estadoIA !== undefined &&
    iniciativa.evaluacion !== undefined &&
    iniciativa.fuentes !== undefined &&
    iniciativa.fechaPrimeraEvidencia !== undefined &&
    iniciativa.fechaUltimaVerificacion !== undefined
  );
}

/**
 * Regla única del contador de adopción verificada. No usa `estado` legacy ni
 * intenta completar campos ausentes por inferencia.
 */
export function esAdopcionVerificada(iniciativa: CamposModeloEvidencia): boolean {
  if (!tieneModeloEvidenciaV2(iniciativa)) return false;
  if (encontrarErroresTrazabilidad(iniciativa).length > 0) return false;
  return (
    iniciativa.estadoCatalogo === 'verificado' &&
    TIPOS_QUE_CUENTAN.has(iniciativa.tipoIniciativa) &&
    FASES_QUE_CUENTAN.has(iniciativa.faseImplementacion) &&
    iniciativa.estadoIA === 'confirmada' &&
    iniciativa.evaluacion?.ejecucion.estado === 'confirmado'
  );
}

/** Las fichas legacy siguen visibles durante la migración; descartado no. */
export function esVisibleEnCatalogo(iniciativa: CamposModeloEvidencia): boolean {
  return iniciativa.estadoCatalogo !== 'descartado';
}

/**
 * Compatibilidad de presentación. La fase v2 tiene precedencia; el estado
 * anterior solo se usa para que la interfaz actual siga funcionando.
 */
export function resolverFaseImplementacion(
  iniciativa: Pick<IniciativaCatalogable, 'faseImplementacion' | 'estado'>,
): FaseImplementacion {
  if (iniciativa.faseImplementacion) return iniciativa.faseImplementacion;
  return iniciativa.estado ?? 'no-determinado';
}

export function resumirCatalogo(
  iniciativas: readonly CamposModeloEvidencia[],
): ResumenCatalogo {
  return iniciativas.reduce<ResumenCatalogo>(
    (resumen, iniciativa) => {
      if (esVisibleEnCatalogo(iniciativa)) resumen.iniciativasDocumentadas += 1;
      if (esAdopcionVerificada(iniciativa)) resumen.adopcionVerificada += 1;
      if (iniciativa.estadoCatalogo === 'verificado') resumen.verificadasCatalogo += 1;
      if (iniciativa.estadoCatalogo === 'seguimiento') resumen.seguimiento += 1;
      if (iniciativa.estadoCatalogo === 'ecosistema') resumen.ecosistema += 1;
      if (iniciativa.estadoCatalogo === 'descartado') resumen.descartadas += 1;
      if (iniciativa.modeloVersion !== MODELO_EVIDENCIA_VERSION) {
        resumen.pendientesMigracion += 1;
      }
      return resumen;
    },
    {
      iniciativasDocumentadas: 0,
      adopcionVerificada: 0,
      verificadasCatalogo: 0,
      seguimiento: 0,
      ecosistema: 0,
      descartadas: 0,
      pendientesMigracion: 0,
    },
  );
}

/**
 * Valida referencias que JSON Schema no puede resolver: IDs duplicados y
 * afirmaciones que apuntan a fuentes inexistentes.
 */
export function encontrarErroresTrazabilidad(
  iniciativa: CamposModeloEvidencia,
): string[] {
  if (iniciativa.modeloVersion !== MODELO_EVIDENCIA_VERSION) return [];

  const errores: string[] = [];
  const ids = new Set<string>();
  const fuentesPorId = new Map<string, FuenteProyecto>();
  for (const fuente of iniciativa.fuentes ?? []) {
    if (ids.has(fuente.id)) errores.push(`fuente duplicada: ${fuente.id}`);
    ids.add(fuente.id);
    fuentesPorId.set(fuente.id, fuente);
  }

  for (const dimension of DIMENSIONES_EVIDENCIA) {
    const evaluacion = iniciativa.evaluacion?.[dimension];
    if (!evaluacion) continue;
    if (evaluacion.estado !== 'no-determinado' && evaluacion.fuenteIds.length === 0) {
      errores.push(`${dimension}: ${evaluacion.estado} sin fuente`);
    }
    for (const fuenteId of evaluacion.fuenteIds) {
      const fuente = fuentesPorId.get(fuenteId);
      if (!fuente) {
        errores.push(`${dimension}: fuente inexistente ${fuenteId}`);
        continue;
      }
      const respaldosValidos = RESPALDOS_POR_DIMENSION[dimension];
      if (!respaldosValidos.some((respaldo) => fuente.respalda.includes(respaldo))) {
        errores.push(`${dimension}: fuente ${fuenteId} no respalda esa dimensión`);
      }
    }
  }

  for (const resultado of iniciativa.resultadosVerificados ?? []) {
    for (const fuenteId of resultado.fuenteIds) {
      const fuente = fuentesPorId.get(fuenteId);
      if (!fuente) {
        errores.push(`resultado ${resultado.id}: fuente inexistente ${fuenteId}`);
      } else if (
        !fuente.respalda.includes('resultado-reportado') &&
        !fuente.respalda.includes('resultado-independiente')
      ) {
        errores.push(`resultado ${resultado.id}: fuente ${fuenteId} no respalda resultados`);
      }
    }
  }

  return errores;
}
