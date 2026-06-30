import data from './json/marcoPais.json';
import type { Bilingual } from '@/i18n/config';

/**
 * Tipos de "fuerza institucional" que un instrumento puede tener.
 * Usados para colorear badges en la matriz comparativa y en las
 * tarjetas de la arquitectura por capas.
 */
export type FuerzaTipo =
  | 'referencial'
  | 'orientadora'
  | 'obligatoria'
  | 'no-vigente'
  | 'operativa'
  | 'pendiente';

export interface Capa {
  id: string;
  orden: number;
  nombreCorto: Bilingual;
  instrumentos: Bilingual;
  nota?: { es: string; en: string };
  funcion: Bilingual;
  alcance: Bilingual;
  fuerza: Bilingual;
  fuerzaTipo: FuerzaTipo;
  vacio: Bilingual;
  enlaces?: Array<{ label: { es: string; en: string }; url: string }>;
}

export interface Hito {
  /** Año como string ("2019", "2024"). Vacío cuando `pendiente=true`. */
  anio: string;
  /**
   * Fecha exacta YYYY-MM-DD cuando se conoce. Si solo se conoce hasta el mes,
   * usar YYYY-MM-01. Opcional — `anio` sigue siendo el dato base (fallback).
   */
  fecha?: string;
  evento: Bilingual;
  pendiente: boolean;
}

export interface Instrumento {
  id: string;
  nombre: Bilingual;
  tipo: Bilingual;
  alcance: Bilingual;
  fuerza: Bilingual;
  fuerzaTipo: FuerzaTipo;
  queResuelve: Bilingual;
  queNoResuelve: Bilingual;
  estado: Bilingual;
  /** Fecha de publicación oficial del instrumento (YYYY-MM-DD). Opcional. */
  fechaPublicacion?: string;
  /** Fecha de última revisión/modificación oficial del instrumento. Opcional. */
  ultimaRevision?: string;
  /**
   * Nota libre cuando `fechaPublicacion` está intencionalmente omitida
   * (ej: "verificar Gaceta", "rolling — sin fecha única"). Solo presente
   * cuando `fechaPublicacion` no existe.
   */
  _notaFechaPublicacion?: string;
}

export interface Brecha {
  id: string;
  descripcion: Bilingual;
}

interface MarcoPaisData {
  capas: Capa[];
  hitos: Hito[];
  instrumentos: Instrumento[];
  brechas: Brecha[];
}

const typed = data as MarcoPaisData;

export const capas: Capa[] = typed.capas;
export const hitos: Hito[] = typed.hitos;
export const instrumentos: Instrumento[] = typed.instrumentos;
export const brechas: Brecha[] = typed.brechas;

/**
 * Clases Tailwind para badges según fuerza institucional. El mapping
 * sigue el patrón de `estadoBadgeCls` en `src/data/legislacion.ts`.
 */
export const fuerzaBadgeCls: Record<FuerzaTipo, string> = {
  referencial: 'bg-slate-50 text-slate-700 border-slate-200',
  orientadora: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  obligatoria: 'bg-amber-50 text-amber-900 border-amber-200',
  'no-vigente': 'bg-rose-50 text-rose-800 border-rose-200',
  operativa: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  pendiente: 'bg-slate-50 text-slate-500 border-slate-200 border-dashed',
};
