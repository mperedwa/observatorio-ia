/**
 * Orquestador de scrapers.
 *
 * Corre los 3 scrapers en serie, aplica los cambios automáticos válidos
 * (solo updates a campos no protegidos), valida con AJV, y escribe un
 * reporte consolidado. Devuelve exit code 0 incluso si hubo cambios; el
 * GitHub Action decide después si abrir PR.
 *
 * Imprime al stdout un resumen markdown que el Action usa como cuerpo del PR.
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { scrapeAsamblea } from './asamblea';
import { scrapeMicitt } from './micitt';
import { scrapeCamtic } from './camtic';
import { applyChange, type ScraperReport, type ProposedChange } from './lib/diff';
import { validateAll, crossCheck } from './lib/validator';
import { closeBrowser } from './lib/source';

const ROOT = process.cwd();
const LEGISLACION_PATH = join(ROOT, 'src', 'data', 'json', 'legislacion.json');

interface Consolidated {
  ranAt: string;
  reports: ScraperReport[];
  appliedChanges: Array<ProposedChange & { applied: boolean; reason?: string }>;
  validationOk: boolean;
}

function loadLegislacion(): Array<Record<string, unknown>> {
  return JSON.parse(readFileSync(LEGISLACION_PATH, 'utf8'));
}

function saveLegislacion(data: unknown): void {
  writeFileSync(LEGISLACION_PATH, JSON.stringify(data, null, 2) + '\n');
}

function applyAsambleaChanges(report: ScraperReport): Array<ProposedChange & { applied: boolean; reason?: string }> {
  if (report.changes.length === 0) return [];
  const records = loadLegislacion();
  const applied: Array<ProposedChange & { applied: boolean; reason?: string }> = [];
  for (const change of report.changes) {
    if (change.dataset === 'legislacion') {
      const result = applyChange(records, change, 'numero' as never);
      applied.push({ ...change, ...result });
    }
  }
  if (applied.some((c) => c.applied)) {
    saveLegislacion(records);
  }
  return applied;
}

async function main(): Promise<void> {
  const ranAt = new Date().toISOString();
  console.log(`Scrape run @ ${ranAt}\n`);

  const reports: ScraperReport[] = [];
  for (const [name, fn] of [
    ['asamblea', scrapeAsamblea],
    ['micitt', scrapeMicitt],
    ['camtic', scrapeCamtic],
  ] as const) {
    console.log(`--- ${name} ---`);
    try {
      const r = await fn();
      reports.push(r);
      console.log(`  ${r.fetched} fetched, ${r.matched} matched, ${r.changes.length} changes`);
      if (r.notes.length) r.notes.forEach((n) => console.log(`    nota: ${n}`));
    } catch (err) {
      console.error(`  scraper ${name} falló: ${(err as Error).message}`);
      reports.push({
        scraper: name,
        ranAt: new Date().toISOString(),
        fetched: 0,
        matched: 0,
        changes: [],
        notes: [`scraper falló: ${(err as Error).message}`],
      });
    }
  }

  // Aplicar cambios automáticos solo de Asamblea (Micitt/Camtic son solo notes)
  const asambleaReport = reports.find((r) => r.scraper === 'asamblea');
  const appliedChanges = asambleaReport ? applyAsambleaChanges(asambleaReport) : [];

  console.log('\n--- validación ---');
  const valid = validateAll();
  const crossOk = crossCheck();

  const consolidated: Consolidated = {
    ranAt,
    reports,
    appliedChanges,
    validationOk: valid && crossOk,
  };

  const outDir = join(ROOT, '.scrapers');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  writeFileSync(join(outDir, 'last-run.json'), JSON.stringify(consolidated, null, 2));

  // Markdown summary para PR body
  const totalChanges = appliedChanges.filter((c) => c.applied).length;
  const totalNotes = reports.reduce((s, r) => s + r.notes.length, 0);
  const md = renderMarkdown(consolidated, totalChanges, totalNotes);
  writeFileSync(join(outDir, 'last-run.md'), md);

  console.log('\n--- resumen ---');
  console.log(`Cambios aplicados a JSON: ${totalChanges}`);
  console.log(`Notas para revisión humana: ${totalNotes}`);
  console.log(`Validación post-aplicación: ${valid && crossOk ? 'OK' : 'FAIL'}`);

  await closeBrowser();
}

function renderMarkdown(c: Consolidated, totalChanges: number, totalNotes: number): string {
  const lines: string[] = [];
  lines.push(`## Scrape automático — ${c.ranAt}`);
  lines.push('');
  lines.push(`- **Cambios aplicados a JSON**: ${totalChanges}`);
  lines.push(`- **Notas para revisión humana**: ${totalNotes}`);
  lines.push(`- **Validación AJV**: ${c.validationOk ? '✅ OK' : '❌ FAIL'}`);
  lines.push('');
  for (const r of c.reports) {
    lines.push(`### ${r.scraper}`);
    lines.push(`- fetched: ${r.fetched}, matched: ${r.matched}, changes: ${r.changes.length}`);
    if (r.changes.length) {
      lines.push('');
      lines.push('**Cambios propuestos**:');
      for (const ch of r.changes) {
        lines.push(
          `- \`${ch.kind}\` ${ch.dataset}/${ch.id}${ch.field ? ` · field=${ch.field}` : ''} · ${
            ch.before !== undefined ? `\`${String(ch.before)}\` → ` : ''
          }\`${String(ch.after)}\``,
        );
        lines.push(`  - razón: ${ch.rationale}`);
        lines.push(`  - fuente: ${ch.sourceUrl}`);
      }
    }
    if (r.notes.length) {
      lines.push('');
      lines.push('**Notas**:');
      for (const n of r.notes) lines.push(`- ${n}`);
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('_Este PR fue generado automáticamente por `.github/workflows/scrape.yml`. Revisar antes de mergear._');
  return lines.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(async (err) => {
    console.error(err);
    await closeBrowser();
    process.exit(1);
  });
}
