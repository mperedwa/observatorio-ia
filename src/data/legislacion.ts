import data from './json/legislacion.json';
import type { Bilingual } from '@/i18n/config';

export type EstadoLey = 'en-comision' | 'primer-debate' | 'segundo-debate' | 'archivado' | 'aprobada';

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
