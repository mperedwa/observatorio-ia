import data from './json/monitoreo.json';
import type { Bilingual } from '@/i18n/config';

export const CADENCIAS_MONITOREO = [
  'semanal',
  'mensual',
  'trimestral',
  'semestral',
] as const;

export const RESULTADOS_REVISION = [
  'cambio-detectado',
  'cambio-publicado',
  'sin-cambios',
] as const;

export type CadenciaMonitoreo = (typeof CADENCIAS_MONITOREO)[number];
export type ResultadoRevision = (typeof RESULTADOS_REVISION)[number];
export type AmbitoMonitoreo =
  | 'catalogo'
  | 'enia'
  | 'legislacion'
  | 'marco-pais'
  | 'indicador';
export type MetricaMonitoreo =
  | 'legislacion-expedientes'
  | 'enia-intervenciones-unicas'
  | 'catalogo-seguimiento'
  | 'catalogo-verificado'
  | 'catalogo-ecosistema'
  | 'marco-pais-instrumentos'
  | 'indicador-ilia'
  | 'indicador-oecd';
export type EstadoAgenda = 'al-dia' | 'vence-hoy' | 'vencida';

export interface PoliticaCadencia {
  id: CadenciaMonitoreo;
  dias: number;
  diasAnticipacionHabiles: number;
  nombre: Bilingual;
  aplicaA: Bilingual;
}

export interface FrenteMonitoreo {
  id: string;
  ambito: AmbitoMonitoreo;
  metrica: MetricaMonitoreo;
  nombre: Bilingual;
  descripcion: Bilingual;
  cadenciaId: CadenciaMonitoreo;
  notaCadencia?: Bilingual;
  fechaUltimaRevision: string;
  fechaProximaRevision: string;
  alcance: {
    cantidad: number;
    unidad: Bilingual;
  };
  fuenteUrl: string;
}

export interface TransicionRevision {
  objetoTipo:
    | 'proyecto'
    | 'intervencion-enia'
    | 'expediente'
    | 'instrumento'
    | 'indicador';
  objetoId: string;
  campo: string;
  antes: string | null;
  despues: string | null;
}

export interface RevisionMonitoreo {
  id: string;
  fecha: string;
  frenteId: string;
  resultado: ResultadoRevision;
  resumen: Bilingual;
  fuenteUrl: string;
  issueUrl?: string;
  commitSha?: string;
  transiciones: TransicionRevision[];
}

export interface InventarioMonitoreo {
  schemaVersion: 1;
  fechaCorte: string;
  politica: {
    descripcion: Bilingual;
    automatizacion: Bilingual;
    cadencias: PoliticaCadencia[];
  };
  frentes: FrenteMonitoreo[];
  revisiones: RevisionMonitoreo[];
}

export const monitoreo = data as InventarioMonitoreo;

export const frentesMonitoreo = [...monitoreo.frentes].sort((a, b) =>
  a.fechaProximaRevision.localeCompare(b.fechaProximaRevision),
);

export const revisionesMonitoreo = [...monitoreo.revisiones].sort((a, b) =>
  b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id),
);

export const cadenciasMonitoreo = new Map(
  monitoreo.politica.cadencias.map((cadencia) => [cadencia.id, cadencia]),
);

/**
 * El estado se calcula contra la fecha de corte publicada, no contra el reloj
 * del navegador. Así una exportación estática conserva un significado
 * auditable hasta que una nueva revisión actualice el dataset.
 */
export function calcularEstadoAgenda(
  frente: FrenteMonitoreo,
  fechaCorte = monitoreo.fechaCorte,
): EstadoAgenda {
  if (frente.fechaProximaRevision < fechaCorte) return 'vencida';
  if (frente.fechaProximaRevision === fechaCorte) return 'vence-hoy';
  return 'al-dia';
}

export const resumenMonitoreo = {
  frentes: frentesMonitoreo.length,
  revisiones: revisionesMonitoreo.length,
  revisionesSinCambios: revisionesMonitoreo.filter(
    ({ resultado }) => resultado === 'sin-cambios',
  ).length,
  cambiosPublicados: revisionesMonitoreo.filter(
    ({ resultado }) => resultado === 'cambio-publicado',
  ).length,
  vencidas: frentesMonitoreo.filter(
    (frente) => calcularEstadoAgenda(frente) === 'vencida',
  ).length,
} as const;

export function obtenerFrenteMonitoreo(id: string): FrenteMonitoreo | undefined {
  return monitoreo.frentes.find((frente) => frente.id === id);
}
