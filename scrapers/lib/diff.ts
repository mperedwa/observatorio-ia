import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

export type ChangeKind = 'add' | 'update' | 'unchanged';

export interface ProposedChange {
  scraper: string;
  dataset: 'proyectos' | 'instituciones' | 'legislacion';
  kind: ChangeKind;
  id: string;
  field?: string;
  before?: unknown;
  after: unknown;
  rationale: string;
  sourceUrl: string;
  scrapedAt: string;
}

export interface ScraperReport {
  scraper: string;
  ranAt: string;
  fetched: number;
  matched: number;
  changes: ProposedChange[];
  notes: string[];
}

const ROOT = process.cwd();

export function loadCurrentJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(join(ROOT, 'src', 'data', relPath), 'utf8')) as T;
}

export function emptyReport(scraper: string): ScraperReport {
  return {
    scraper,
    ranAt: new Date().toISOString(),
    fetched: 0,
    matched: 0,
    changes: [],
    notes: [],
  };
}

export function writeReport(report: ScraperReport): string {
  const dir = join(ROOT, '.scrapers');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = join(dir, `${report.scraper}-${report.ranAt.replace(/[:.]/g, '-')}.json`);
  writeFileSync(file, JSON.stringify(report, null, 2));
  return file;
}

/**
 * Aplica un ProposedChange a un dataset en memoria.
 * REGLA EDITORIAL: solo actualiza campos NO curados (estado, desde, presentado, resultado cuando viene de fuente oficial).
 * Jamás toca contexto, lecciones, resumen, descripcion (esos son curados editorialmente).
 */
const PROTECTED_FIELDS = new Set(['contexto', 'lecciones', 'resumen', 'descripcion', 'titulo']);

export function applyChange<T extends Record<string, unknown>>(
  records: T[],
  change: ProposedChange,
  idKey: keyof T = 'id' as keyof T,
): { applied: boolean; reason?: string } {
  if (change.field && PROTECTED_FIELDS.has(change.field)) {
    return { applied: false, reason: `campo protegido editorialmente: ${change.field}` };
  }

  const idx = records.findIndex((r) => r[idKey] === change.id);

  if (change.kind === 'add') {
    if (idx >= 0) return { applied: false, reason: 'id ya existe' };
    records.push(change.after as T);
    return { applied: true };
  }

  if (change.kind === 'update') {
    if (idx < 0) return { applied: false, reason: 'id no encontrado' };
    if (!change.field) return { applied: false, reason: 'update sin field' };
    (records[idx] as Record<string, unknown>)[change.field] = change.after;
    return { applied: true };
  }

  return { applied: false, reason: 'kind desconocido' };
}

export function summarize(report: ScraperReport): string {
  const adds = report.changes.filter((c) => c.kind === 'add').length;
  const updates = report.changes.filter((c) => c.kind === 'update').length;
  return `${report.scraper}: ${report.fetched} fetched, ${report.matched} matched, ${adds} new, ${updates} updates`;
}
