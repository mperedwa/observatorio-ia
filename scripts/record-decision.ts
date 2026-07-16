#!/usr/bin/env npx tsx
/**
 * record-decision.ts — Registra una decisión de curación en el ledger de
 * memoria (`src/data/decisions-ledger.json`), para que un item ya resuelto no
 * vuelva a correr todo el ciclo del scrape en futuras corridas.
 *
 * Lo corre el bot developer cuando Mario decide sobre un item de un
 * scrape-review issue (típicamente NO / re-reporte → decision=rejected).
 *
 * Uso:
 *   npx tsx scripts/record-decision.ts \
 *     --url "https://..." \
 *     --titulo "CCSS implementa herramienta de IA..." \
 *     --decision rejected \
 *     --issue 35 \
 *     --note "re-reporte del anuncio de mayo, ya catalogado en ccss-depuracion-listas"
 *
 * --date opcional (default: hoy en YYYY-MM-DD, se pasa por --date para evitar
 * dependencias de reloj no determinista en tests).
 *
 * Idempotente: si ya existe una decisión con la misma firma de URL/título, la
 * reemplaza (permite pasar de 'rejected' a 'updated' si un item evoluciona).
 */

import { parseArgs } from 'node:util';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import {
  urlSignatureOf,
  titleSignatureOf,
  type Decision,
  type DecisionKind,
  type Ledger,
} from './lib/decisions-ledger.js';

const args = parseArgs({
  options: {
    url: { type: 'string', default: '' },
    titulo: { type: 'string', default: '' },
    decision: { type: 'string' }, // rejected | catalogued | updated
    issue: { type: 'string' },
    note: { type: 'string', default: '' },
    date: { type: 'string' },
    ledger: { type: 'string' }, // override path (tests)
  },
});

const LEDGER_PATH =
  args.values.ledger ?? join(process.cwd(), 'src', 'data', 'decisions-ledger.json');

function fail(msg: string): never {
  console.error(`record-decision: ${msg}`);
  process.exit(1);
}

const url = args.values.url ?? '';
const titulo = args.values.titulo ?? '';
const decision = args.values.decision as DecisionKind | undefined;

if (!url && !titulo) fail('se requiere al menos --url o --titulo');
if (!decision || !['rejected', 'catalogued', 'updated'].includes(decision)) {
  fail('--decision debe ser rejected | catalogued | updated');
}
if (!args.values.date) fail('--date es obligatorio (YYYY-MM-DD) para determinismo');

const entry: Decision = {
  urlSignature: urlSignatureOf(url),
  titleSignature: titleSignatureOf(titulo),
  url,
  titulo,
  decision,
  date: args.values.date,
  ...(args.values.issue ? { issue: Number(args.values.issue) } : {}),
  ...(args.values.note ? { note: args.values.note } : {}),
};

const ledger: Ledger = existsSync(LEDGER_PATH)
  ? (JSON.parse(readFileSync(LEDGER_PATH, 'utf8')) as Ledger)
  : { decisions: [] };

// Reemplazar si ya existe la misma firma (idempotente); si no, agregar.
const sameSig = (d: Decision) =>
  (entry.urlSignature && d.urlSignature === entry.urlSignature) ||
  (entry.titleSignature && d.titleSignature === entry.titleSignature);
const before = ledger.decisions.length;
ledger.decisions = ledger.decisions.filter((d) => !sameSig(d));
ledger.decisions.push(entry);
ledger.decisions.sort((a, b) => b.date.localeCompare(a.date));

mkdirSync(dirname(LEDGER_PATH), { recursive: true });
writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');

const action = ledger.decisions.length > before ? 'agregada' : 'reemplazada';
console.log(
  `record-decision: decisión ${action} (${decision}) → ${LEDGER_PATH} · total ${ledger.decisions.length}`,
);
console.log(`  urlSig:   ${entry.urlSignature || '(vacía)'}`);
console.log(`  titleSig: ${entry.titleSignature || '(vacía)'}`);
