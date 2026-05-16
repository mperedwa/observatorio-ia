import data from './json/legislacion.json';
import type { Bilingual } from '@/i18n/config';

export type EstadoLey = 'en-comision' | 'dictaminado' | 'primer-debate' | 'segundo-debate' | 'archivado' | 'aprobada';

export interface Expediente {
  numero: string;
  titulo: Bilingual;
  resumen: Bilingual;
  estado: EstadoLey;
  comision: Bilingual;
  presentado: string;
  fuenteUrl: string;
}

export const expedientes: Expediente[] = data as Expediente[];

/**
 * Tailwind class string for the colored status badge of each `EstadoLey`.
 * Single source of truth so Legislacion (deep list) and analisis (summary
 * cards) render the same color for the same status — mismatched palettes
 * across views look like two different taxonomies.
 */
export const estadoBadgeCls: Record<EstadoLey, string> = {
  'en-comision': 'bg-amber-50 text-amber-800 border-amber-200',
  dictaminado: 'bg-sky-50 text-sky-800 border-sky-200',
  'primer-debate': 'bg-blue-50 text-blue-800 border-blue-200',
  'segundo-debate': 'bg-purple-50 text-purple-800 border-purple-200',
  archivado: 'bg-slate-100 text-slate-700 border-slate-300',
  aprobada: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};
