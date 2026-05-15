import data from './json/indicadores.json';
import type { Bilingual } from '@/i18n/config';
import { COUNTERS } from './counters';

export interface IndicadorRegional {
  pais: Bilingual;
  ilia: number;
  destacado?: boolean;
}

export interface FuenteCitada {
  url: string;
  descripcion: Bilingual;
}

export interface ComparativaPais {
  pais: Bilingual;
  ilia: number;
  inversion: Bilingual;
  enteEjecutor: Bilingual;
  hito: Bilingual;
  /**
   * One or more cited sources backing this row. Each fuente carries its own
   * descripcion so the table can render `(N)` numbered links with hover/aria
   * labels in the active locale instead of opaque ↗ icons. Multi-source rows
   * (e.g. an indicator that fuses MINTIC + CEPAL data) keep both citations
   * visible without favoring one over the other.
   */
  fuentes: FuenteCitada[];
  destacado?: boolean;
}

export interface KpiResumen {
  label: Bilingual;
  valor: string;
  detalle: Bilingual;
}

// build:api escribe `"valor": "auto"` como sentinela en indicadores.json para
// los KPIs derivables del catálogo. Resolverlos aquí (en el módulo que carga
// la data) garantiza que cualquier consumidor (Hero, AssetKpiHero, AssetStory,
// scripts SSG) reciba el número materializado, no el literal "auto" que
// CountUp intenta parsear como `0` + suffix `"auto"`.
const KPI_AUTO_BY_LABEL: Record<string, number | undefined> = {
  'Proyectos IA activos en gobierno': COUNTERS.proyectos,
  'Instituciones con IA operativa': COUNTERS.instituciones,
  'Expedientes de ley en trámite': COUNTERS.legislacion,
};

function resolveKpi(k: KpiResumen): KpiResumen {
  if (k.valor !== 'auto') return k;
  const n = KPI_AUTO_BY_LABEL[k.label.es];
  return { ...k, valor: n !== undefined ? String(n) : '?' };
}

export const ilia2025: IndicadorRegional[] = data.ilia2025 as IndicadorRegional[];
export const comparativaRegional: ComparativaPais[] = data.comparativaRegional as ComparativaPais[];
export const kpisHero: KpiResumen[] = (data.kpisHero as KpiResumen[]).map(resolveKpi);
