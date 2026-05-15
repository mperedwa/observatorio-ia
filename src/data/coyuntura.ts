import data from './json/coyuntura.json';
import type { Bilingual } from '@/i18n/config';
import type { FuenteCitada } from './indicadores';

export interface NotaCoyuntura {
  id: string;
  /** ISO date (YYYY-MM-DD) marking when the situation took place. */
  fecha: string;
  etiqueta: Bilingual;
  titulo: Bilingual;
  texto: Bilingual;
  /** Second paragraph framing the implication of the situation. Optional. */
  implicacion?: Bilingual;
  fuentes: FuenteCitada[];
}

export const notasCoyuntura: NotaCoyuntura[] = data as NotaCoyuntura[];
