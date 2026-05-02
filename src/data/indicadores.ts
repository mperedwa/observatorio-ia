import type { Bilingual } from '@/i18n/config';

export interface IndicadorRegional {
  pais: Bilingual;
  ilia: number;
  destacado?: boolean;
}

export const ilia2025: IndicadorRegional[] = [
  { pais: { es: 'Chile', en: 'Chile' }, ilia: 73.07 },
  { pais: { es: 'Brasil', en: 'Brazil' }, ilia: 69.30 },
  { pais: { es: 'Uruguay', en: 'Uruguay' }, ilia: 64.98 },
  { pais: { es: 'Colombia', en: 'Colombia' }, ilia: 57.21 },
  { pais: { es: 'Costa Rica', en: 'Costa Rica' }, ilia: 53.83, destacado: true },
];

export interface KpiResumen {
  label: Bilingual;
  valor: string;
  detalle: Bilingual;
}

export const kpisHero: KpiResumen[] = [
  {
    label: {
      es: 'Proyectos IA activos en gobierno',
      en: 'Active AI projects in government',
    },
    valor: '11',
    detalle: { es: 'mapeados en mayo 2026', en: 'mapped as of May 2026' },
  },
  {
    label: {
      es: 'Instituciones con IA operativa',
      en: 'Institutions with AI in production',
    },
    valor: '5',
    detalle: {
      es: 'Poder Judicial, CCSS, Hacienda, MEP, MICITT',
      en: 'Judicial Branch, CCSS, Finance, MEP, MICITT',
    },
  },
  {
    label: {
      es: 'Expedientes de ley en trámite',
      en: 'Bills in progress',
    },
    valor: '3',
    detalle: {
      es: 'todos en comisión, sin avanzar',
      en: 'all stuck in committee',
    },
  },
  {
    label: {
      es: 'Posición ILIA Latinoamérica',
      en: 'ILIA Latin America rank',
    },
    valor: '5°',
    detalle: {
      es: '53.83/100, brecha de -19 vs Chile',
      en: '53.83/100, -19 gap vs Chile',
    },
  },
];
