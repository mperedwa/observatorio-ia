export interface IndicadorRegional {
  pais: string;
  ilia: number;
  destacado?: boolean;
}

export const ilia2025: IndicadorRegional[] = [
  { pais: 'Chile', ilia: 73.07 },
  { pais: 'Brasil', ilia: 69.30 },
  { pais: 'Uruguay', ilia: 64.98 },
  { pais: 'Colombia', ilia: 57.21 },
  { pais: 'Costa Rica', ilia: 53.83, destacado: true },
];

export interface KpiResumen {
  label: string;
  valor: string;
  detalle: string;
}

export const kpisHero: KpiResumen[] = [
  { label: 'Proyectos IA activos en gobierno', valor: '11', detalle: 'mapeados en mayo 2026' },
  { label: 'Instituciones con IA operativa', valor: '5', detalle: 'Poder Judicial, CCSS, Hacienda, MEP, MICITT' },
  { label: 'Expedientes de ley en trámite', valor: '3', detalle: 'todos en comisión, sin avanzar' },
  { label: 'Posición ILIA Latinoamérica', valor: '5°', detalle: '53.83/100, brecha de -19 vs Chile' },
];
