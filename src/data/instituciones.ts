import data from './json/instituciones.json';
import type { Bilingual } from '@/i18n/config';

export type Tipo =
  | 'ministerio'
  | 'asamblea'
  | 'judicial'
  | 'autonoma'
  | 'universidad'
  | 'investigacion'
  | 'camara';

export interface Institucion {
  id: string;
  nombre: Bilingual;
  nombreCorto: Bilingual;
  tipo: Tipo;
  url: string;
  proyectosActivos: number;
  resumen: Bilingual;
  descripcion?: Bilingual;
  lecciones?: Bilingual;
}

export const instituciones: Institucion[] = data as Institucion[];
