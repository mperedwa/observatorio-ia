import data from './json/brechas.json';
import type { Bilingual } from '@/i18n/config';

export interface Brecha {
  id: string;
  capacidad: Bilingual;
  paisReferencia: Bilingual;
  evidenciaReferencia: Bilingual;
  estadoCR: Bilingual;
  porQueImporta: Bilingual;
  fuenteUrl: string;
}

export const brechas: Brecha[] = data as Brecha[];
