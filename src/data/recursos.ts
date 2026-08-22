import data from './json/recursos.json';
import type { Bilingual } from '@/i18n/config';
import type { TipoFuente } from './modelo-evidencia';

export interface Recurso {
  id: string;
  titulo: Bilingual;
  fuente: string;
  url: string;
  tipo: Bilingual;
  tipoFuente: TipoFuente;
  nota?: Bilingual;
}

export const recursos: Recurso[] = data as Recurso[];
