/**
 * Calcula qué frentes de monitoreo están vencidos o próximos a vencer.
 *
 * La salida es una agenda operativa, no una revisión editorial: este script
 * nunca cambia `monitoreo.json`, proyectos, legislación ni indicadores.
 *
 * Uso:
 *   npm run check-monitoring-due
 *   npm run check-monitoring-due -- --as-of 2026-08-21 --lead-days 7
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { FrenteMonitoreo, InventarioMonitoreo } from '../src/data/monitoreo';

const DATA_PATH = resolve(process.cwd(), 'src/data/json/monitoreo.json');
const DEFAULT_OUTPUT_PATH = resolve(process.cwd(), 'scraper-runs/monitoring-due.json');
const DAY_MS = 86_400_000;

export type DueStatus = 'vencido' | 'vence-hoy' | 'proximo';

export interface MonitoringDueItem {
  id: string;
  nombre: string;
  ambito: FrenteMonitoreo['ambito'];
  cadenciaId: FrenteMonitoreo['cadenciaId'];
  fechaUltimaRevision: string;
  fechaProximaRevision: string;
  diasHastaVencimiento: number;
  estado: DueStatus;
  fuenteUrl: string;
}

export interface MonitoringDueReport {
  generatedAt: string;
  asOf: string;
  leadDays: number;
  counts: {
    total: number;
    vencidos: number;
    venceHoy: number;
    proximos: number;
  };
  items: MonitoringDueItem[];
}

function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Fecha inválida "${value}"; se requiere YYYY-MM-DD.`);
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`Fecha inválida "${value}".`);
  }
  return parsed;
}

export function todayInCostaRica(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Costa_Rica',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function buildMonitoringDueReport(
  inventory: InventarioMonitoreo,
  asOf: string,
  leadDays = 7,
  generatedAt = new Date().toISOString(),
): MonitoringDueReport {
  const asOfDate = parseDate(asOf);
  if (!Number.isInteger(leadDays) || leadDays < 0 || leadDays > 365) {
    throw new Error('leadDays debe ser un entero entre 0 y 365.');
  }

  const items = inventory.frentes
    .map((front): MonitoringDueItem | null => {
      const dueDate = parseDate(front.fechaProximaRevision);
      const daysUntil = Math.round((dueDate.valueOf() - asOfDate.valueOf()) / DAY_MS);
      if (daysUntil > leadDays) return null;
      const estado: DueStatus = daysUntil < 0
        ? 'vencido'
        : daysUntil === 0
          ? 'vence-hoy'
          : 'proximo';
      return {
        id: front.id,
        nombre: front.nombre.es,
        ambito: front.ambito,
        cadenciaId: front.cadenciaId,
        fechaUltimaRevision: front.fechaUltimaRevision,
        fechaProximaRevision: front.fechaProximaRevision,
        diasHastaVencimiento: daysUntil,
        estado,
        fuenteUrl: front.fuenteUrl,
      };
    })
    .filter((item): item is MonitoringDueItem => item !== null)
    .sort((a, b) => (
      a.diasHastaVencimiento - b.diasHastaVencimiento || a.id.localeCompare(b.id)
    ));

  return {
    generatedAt,
    asOf,
    leadDays,
    counts: {
      total: items.length,
      vencidos: items.filter(({ estado }) => estado === 'vencido').length,
      venceHoy: items.filter(({ estado }) => estado === 'vence-hoy').length,
      proximos: items.filter(({ estado }) => estado === 'proximo').length,
    },
    items,
  };
}

interface CliArgs {
  asOf: string;
  leadDays: number;
  output: string;
}

function valueAfter(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : undefined;
}

function parseArgs(argv: string[]): CliArgs {
  const asOf = valueAfter(argv, '--as-of') ?? todayInCostaRica();
  const leadRaw = valueAfter(argv, '--lead-days') ?? '7';
  const leadDays = Number(leadRaw);
  const output = resolve(process.cwd(), valueAfter(argv, '--output') ?? DEFAULT_OUTPUT_PATH);
  return { asOf, leadDays, output };
}

function main(): void {
  const { asOf, leadDays, output } = parseArgs(process.argv.slice(2));
  const inventory = JSON.parse(readFileSync(DATA_PATH, 'utf8')) as InventarioMonitoreo;
  const report = buildMonitoringDueReport(inventory, asOf, leadDays);

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    `[monitoring-due] ${report.counts.total} frente(s): ${report.counts.vencidos} vencido(s), ${report.counts.venceHoy} vence(n) hoy, ${report.counts.proximos} próximo(s).`,
  );
  for (const item of report.items) {
    console.log(
      `  - ${item.id}: ${item.estado}, próxima ${item.fechaProximaRevision} (${item.diasHastaVencimiento} días)`,
    );
  }
  console.log(`[monitoring-due] reporte: ${output}`);
}

const isDirectInvocation =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectInvocation) {
  try {
    main();
  } catch (error) {
    console.error(`[monitoring-due] ${(error as Error).message}`);
    process.exit(1);
  }
}
