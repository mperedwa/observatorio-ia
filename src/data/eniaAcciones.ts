import data from './json/eniaAcciones.json';
import type { Bilingual } from '@/i18n/config';

export const TIPOS_INTERVENCION_ENIA = [
  'politica-gobernanza',
  'capacitacion-formacion',
  'investigacion-diagnostico',
  'articulacion-financiamiento',
  'infraestructura-habilitante',
  'solucion-ia-declarada',
  'automatizacion-digital',
  'por-determinar',
] as const;

export const ESTADOS_CRUCE_ENIA = [
  'mapeado-exacto',
  'coincidencia-parcial',
  'posible-duplicado',
  'nuevo-con-evidencia',
  'enia-solamente',
  'no-es-sistema-ia',
  'no-determinado',
] as const;

export const ESTADOS_EJECUCION_ENIA = [
  'no-verificado',
  'parcialmente-verificado',
  'verificado',
  'contradicho',
] as const;

export const RECOMENDACIONES_EDITORIALES_ENIA = [
  'investigar-como-seguimiento',
  'ecosistema',
  'revisar-si-es-ia',
  'revisar',
] as const;

export type TipoIntervencionEnia = (typeof TIPOS_INTERVENCION_ENIA)[number];
export type EstadoCruceEnia = (typeof ESTADOS_CRUCE_ENIA)[number];
export type EstadoEjecucionEnia = (typeof ESTADOS_EJECUCION_ENIA)[number];
export type RecomendacionEditorialEnia =
  (typeof RECOMENDACIONES_EDITORIALES_ENIA)[number];

export interface IndicadorEnia {
  /** Texto exacto de la matriz oficial; null cuando la celda fuente está vacía. */
  descripcionFuenteEs: string | null;
  lineaBaseFuente: string | null;
  metaPeriodoFuente: string | null;
}

export interface CruceCatalogoEnia {
  estado: EstadoCruceEnia;
  proyectoIds: string[];
}

export interface EvidenciaExternaEnia {
  id: string;
  titulo: Bilingual;
  url: string;
  publicador: string;
  fechaPublicacion?: string;
  fechaConsulta: string;
  respalda: Array<
    'existencia' | 'ejecucion' | 'tecnica-ia' | 'uso-operativo' | 'resultado' | 'gobernanza'
  >;
}

export interface IntervencionEnia {
  id: string;
  paginaPlan: number;
  /** Texto exacto en español de la columna “Intervención Estratégica”. */
  intervencionEstrategicaFuenteEs: string;
  /** Texto exacto en español de la columna “Objetivo”. */
  objetivoFuenteEs: string;
  indicadores: IndicadorEnia[];
  responsableOficial: string;
  responsableEnFormalizacion: boolean;
  aliadosOficiales: string | null;
  tipoIntervencion: TipoIntervencionEnia;
  estadoEjecucion: EstadoEjecucionEnia;
  cruceCatalogo: CruceCatalogoEnia;
  evidenciasExternas?: EvidenciaExternaEnia[];
  faseRealVerificada?:
    | 'anunciado'
    | 'planificado'
    | 'desarrollo'
    | 'prueba-concepto'
    | 'piloto'
    | 'operativo'
    | 'pausado'
    | 'suspendido'
    | 'finalizado'
    | 'cancelado'
    | 'no-determinado';
  recomendacionEditorial: RecomendacionEditorialEnia;
  notasEditoriales?: Bilingual;
  fechaUltimaRevision: string;
}

export interface ResultadoEnia {
  codigo: string;
  eje: { numero: number; nombre: Bilingual };
  lineaAccion: { codigo: string; nombre: Bilingual };
  resultadoEsperado: Bilingual;
  tipoPredominante: TipoIntervencionEnia;
  intervenciones: IntervencionEnia[];
}

export interface InventarioEnia {
  schemaVersion: 1;
  fechaCorte: string;
  fuente: {
    titulo: Bilingual;
    publicador: string;
    url: string;
    fechaVersion: string;
    fechaConsulta: string;
    idiomaFuente: 'es';
  };
  resumen: {
    ejes: number;
    lineasAccion: number;
    resultadosEsperados: number;
    intervenciones: number;
    indicadores: number;
  };
  criterioEditorial: Bilingual;
  hallazgosExtraccion: Array<{ id: string; descripcion: Bilingual }>;
  resultados: ResultadoEnia[];
}

export const inventarioEnia = data as InventarioEnia;
export const resultadosEnia = inventarioEnia.resultados;
export const intervencionesEnia = resultadosEnia.flatMap(
  (resultado) => resultado.intervenciones,
);

export function contarIntervencionesEniaPorTipo(): Record<TipoIntervencionEnia, number> {
  const conteos = Object.fromEntries(
    TIPOS_INTERVENCION_ENIA.map((tipo) => [tipo, 0]),
  ) as Record<TipoIntervencionEnia, number>;

  for (const intervencion of intervencionesEnia) {
    conteos[intervencion.tipoIntervencion] += 1;
  }

  return conteos;
}
