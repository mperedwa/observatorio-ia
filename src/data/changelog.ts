import data from './json/changelog.json';
import type { Bilingual } from '@/i18n/config';

export type ChangelogTipo = 'legislacion' | 'institucion' | 'indicador' | 'proyecto' | 'recurso';

export interface ChangelogEntry {
  /** ISO date (YYYY-MM-DD) marking when the catalog change was published. */
  fecha: string;
  tipo: ChangelogTipo;
  actualizacion: Bilingual;
  fuente: Bilingual;
  /** Optional URL to the cited source. */
  fuente_url?: string;
  /** Optional short git SHA (7-40 hex) linking the entry to the curating commit. */
  commit_sha?: string;
}

/**
 * Curated public changelog of the verified catalog. Hand-maintained alongside
 * each catalog change (not auto-generated from git log) so the prose stays in
 * an institutional/academic register and is internationalized. Source of truth
 * for the home preview ({@link components/Changelog.tsx}) and the full
 * historial page ({@link app/[locale]/historial/page.tsx}).
 *
 * Sorted newest first.
 */
export const changelog: ChangelogEntry[] = [...(data as ChangelogEntry[])].sort(
  (a, b) => b.fecha.localeCompare(a.fecha),
);
