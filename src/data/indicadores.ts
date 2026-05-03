import data from './json/indicadores.json';
import type { Bilingual } from '@/i18n/config';

export interface IndicadorRegional {
  pais: Bilingual;
  ilia: number;
  destacado?: boolean;
}

export interface ComparativaPais {
  pais: Bilingual;
  ilia: number;
  inversion: Bilingual;
  enteEjecutor: Bilingual;
  hito: Bilingual;
  fuenteUrl: string;
  destacado?: boolean;
}

export interface KpiResumen {
  label: Bilingual;
  valor: string;
  detalle: Bilingual;
}

export const ilia2025: IndicadorRegional[] = data.ilia2025 as IndicadorRegional[];
export const comparativaRegional: ComparativaPais[] = data.comparativaRegional as ComparativaPais[];
export const kpisHero: KpiResumen[] = data.kpisHero as KpiResumen[];
