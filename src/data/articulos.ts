/**
 * Registry of published articles in the "Estado y Algoritmo" series.
 *
 * Each article is the single source of truth for its own metadata: this
 * registry imports from the article's `translations.ts` and re-exposes a
 * compact per-locale meta object. Adding a new article = create its folder
 * with `translations.ts` (matching the shape used by ArticleBrief) + one
 * entry below.
 */

import type { Locale } from '@/i18n/config';
import { t as articulo01 } from '@/app/[locale]/analisis/01-ia-en-el-estado-costarricense/translations';

export interface ArticuloMeta {
  /** URL slug under /<locale>/analisis/ */
  slug: string;
  /** Issue number for sort order and display */
  numero: number;
  /** ISO date (YYYY-MM-DD) for sorting */
  fecha: string;
  /** Per-locale display strings */
  meta: (locale: Locale) => {
    kicker: string;
    titulo: string;
    descripcion: string;
    fechaDisplay: string;
    author: string;
  };
}

export const articulos: ArticuloMeta[] = [
  {
    slug: '01-ia-en-el-estado-costarricense',
    numero: 1,
    fecha: '2026-05-11',
    meta: (locale) => ({
      kicker: articulo01[locale].meta.seriesLabel,
      titulo: articulo01[locale].meta.title,
      descripcion: articulo01[locale].meta.description,
      fechaDisplay: articulo01[locale].meta.date,
      author: articulo01[locale].meta.author,
    }),
  },
];

/** Articles sorted newest first, suitable for index pages. */
export const articulosOrdenados = [...articulos].sort((a, b) => {
  if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
  return b.numero - a.numero;
});
