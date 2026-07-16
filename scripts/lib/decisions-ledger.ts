/**
 * decisions-ledger.ts — Memoria de decisiones de curación ENTRE corridas del scrape.
 *
 * Problema que resuelve: el dedup del scrape solo opera DENTRO de una corrida.
 * Un item que se descartó como re-reporte una semana vuelve a aparecer la
 * siguiente (Google News re-indexa la misma nota, o la nota sigue viva en el
 * feed) y corre TODO el ciclo de nuevo: clasificador → cruce → GH Issue →
 * verificación del analista → Telegram a Mario. Para algo ya decidido.
 *
 * El ledger persiste las decisiones (por firma de URL y de título) para que
 * `classify-vs-repo` auto-clasifique como `ya_decidido` lo que ya se resolvió y
 * nunca vuelva a molestar al analista ni a Mario.
 *
 * Vive en `src/data/decisions-ledger.json` (COMMITEADO — scraper-runs/ es
 * efímero/gitignored, así que no serviría para persistir entre Actions).
 *
 * Se ALIMENTA con `scripts/record-decision.ts` cuando Mario decide NO/UPDATE/GO
 * sobre un item de un scrape-review issue.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export type DecisionKind =
  | 'rejected' // NO — re-reporte / ruido / no-IA. Se SUPRIME en futuras corridas.
  | 'catalogued' // se agregó como proyecto/recurso nuevo (queda en el catálogo).
  | 'updated'; // actualizó un proyecto/recurso existente.

export interface Decision {
  /** URL normalizada del item decidido (protocolo/www/query/trailing-slash removidos). */
  urlSignature: string;
  /** Título normalizado (tokens en minúscula sin tildes ni stopwords de puntuación). */
  titleSignature: string;
  /** URL original, para trazabilidad humana. */
  url: string;
  /** Título original, para trazabilidad humana. */
  titulo: string;
  decision: DecisionKind;
  /** Fecha ISO (YYYY-MM-DD) de la decisión. */
  date: string;
  /** Número del scrape-review issue donde se decidió (si aplica). */
  issue?: number;
  /** Nota humana breve del porqué (ej. "re-reporte del anuncio de mayo"). */
  note?: string;
}

export interface Ledger {
  decisions: Decision[];
}

const LEDGER_PATH = join(process.cwd(), 'src', 'data', 'decisions-ledger.json');

/** Normaliza una URL a una firma estable: sin protocolo, sin www, sin query, sin trailing slash. */
export function urlSignatureOf(url: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    let path = u.pathname.replace(/\/+$/, '');
    return `${host}${path}`.toLowerCase();
  } catch {
    // No es URL parseable (ej. fragmento): normalizar como string plano.
    return url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/[?#].*$/, '')
      .replace(/\/+$/, '')
      .toLowerCase();
  }
}

/** Normaliza un título a una firma de tokens (minúscula, sin tildes, sin puntuación, sin espacios repetidos). */
export function titleSignatureOf(titulo: string): string {
  if (!titulo) return '';
  return titulo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // tildes / diacríticos combinantes
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // puntuación
    .replace(/\s+/g, ' ')
    .trim();
}

export function loadLedger(path: string = LEDGER_PATH): Ledger {
  if (!existsSync(path)) return { decisions: [] };
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as Partial<Ledger>;
    return { decisions: Array.isArray(raw.decisions) ? raw.decisions : [] };
  } catch {
    return { decisions: [] };
  }
}

/**
 * ¿Este item ya se decidió en una corrida previa? Matchea por firma de URL exacta
 * O por firma de título exacta (para atrapar el mismo titular re-envuelto por
 * Google News con una URL ofuscada distinta). Conservador a propósito: solo
 * matches exactos de firma, no overlap difuso, para NO suprimir un update genuino
 * cuyo título se parezca a algo rechazado.
 *
 * Devuelve la Decision matcheada (la más reciente si hay varias) o null.
 */
export function matchDecision(
  candidate: { url?: string; titulo?: string },
  ledger: Ledger,
): Decision | null {
  const urlSig = urlSignatureOf(candidate.url ?? '');
  const titleSig = titleSignatureOf(candidate.titulo ?? '');
  const matches = ledger.decisions.filter(
    (d) =>
      (urlSig && d.urlSignature === urlSig) || (titleSig && d.titleSignature === titleSig),
  );
  if (matches.length === 0) return null;
  // Devolver la más reciente (por si un item pasó de rejected a updated con el tiempo).
  return matches.sort((a, b) => b.date.localeCompare(a.date))[0];
}
