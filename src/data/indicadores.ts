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
  /**
   * Optional short display label (e.g. "La Nación CR", "MICITT") rendered as
   * the link text instead of the generic "ver fuente" copy. Surfacing the
   * source name directly is the right UX when fuentes are heterogeneous
   * (e.g. a press article + an official site in the same row) — readers
   * can tell which link goes where before clicking.
   */
  nombre?: Bilingual;
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

function resolveIliaPosicion(): { valor: string; detalle: Bilingual } | null {
  const rows = data.ilia2025 as IndicadorRegional[];
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const sorted = [...rows].sort((a, b) => b.ilia - a.ilia);
  const cr = sorted.find((p) => p.destacado);
  if (!cr) return null;
  const pos = sorted.indexOf(cr) + 1;
  const top = sorted[0];
  const brecha = Math.round(top.ilia - cr.ilia);
  const isTopCr = pos === 1;
  return {
    valor: `${pos}°`,
    detalle: isTopCr
      ? {
          es: `${cr.ilia.toFixed(2)}/100, liderando la región`,
          en: `${cr.ilia.toFixed(2)}/100, leading the region`,
        }
      : {
          es: `${cr.ilia.toFixed(2)}/100, brecha de -${brecha} vs ${top.pais.es}`,
          en: `${cr.ilia.toFixed(2)}/100, -${brecha} gap vs ${top.pais.en}`,
        },
  };
}

function resolveKpi(k: KpiResumen): KpiResumen {
  if (k.valor !== 'auto') return k;
  if (k.label.es === 'Posición ILIA Latinoamérica') {
    const resolved = resolveIliaPosicion();
    return resolved
      ? { ...k, valor: resolved.valor, detalle: resolved.detalle }
      : { ...k, valor: '?' };
  }
  const n = KPI_AUTO_BY_LABEL[k.label.es];
  return { ...k, valor: n !== undefined ? String(n) : '?' };
}

export const ilia2025: IndicadorRegional[] = data.ilia2025 as IndicadorRegional[];
export const comparativaRegional: ComparativaPais[] = data.comparativaRegional as ComparativaPais[];
export const kpisHero: KpiResumen[] = (data.kpisHero as KpiResumen[]).map(resolveKpi);

export interface OecdRankingRow {
  pais: Bilingual;
  score: number;
  destacado?: boolean;
  esPromedio?: boolean;
}

export interface OecdSubdimension {
  nombre: Bilingual;
  score: number;
}

export interface OecdCrVsAnterior {
  score2023: number;
  score2025: number;
  delta: number;
}

export interface OecdIndex {
  ranking: OecdRankingRow[];
  subdimensionesCostaRica: OecdSubdimension[];
  crVsAnterior: OecdCrVsAnterior;
  fuentes: FuenteCitada[];
}

export const dgi2025: OecdIndex = data.dgi2025 as OecdIndex;
export const ourdata2025: OecdIndex = data.ourdata2025 as OecdIndex;
