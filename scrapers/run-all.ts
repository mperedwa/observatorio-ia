/**
 * Orquestador de scrapers.
 *
 * Corre los 3 scrapers en serie, aplica los cambios automáticos válidos
 * (solo updates a campos no protegidos), valida con AJV, opcionalmente
 * clasifica los candidatos con un LLM (Groq + Llama 3.3 70B), y escribe
 * un reporte consolidado. Devuelve exit code 0 incluso si hubo cambios;
 * el GitHub Action decide después si abrir PR.
 *
 * Imprime al stdout un resumen markdown que el Action usa como cuerpo del PR.
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { scrapeAsamblea } from './asamblea';
import { scrapeMicitt } from './micitt';
import { scrapeCamtic } from './camtic';
import { scrapePJ } from './pj';
import { scrapeDelfino } from './delfino';
import { scrapeCitic } from './citic';
import {
  applyChange,
  REPORTS_DIR,
  type ScraperReport,
  type ProposedChange,
  type ScraperCandidate,
} from './lib/diff';
import { validateAll, crossCheck } from './lib/validator';
import { closeBrowser } from './lib/source';
import { classifierAvailable, classifyMany, type Classification, type Source } from './lib/classifier';

const ROOT = process.cwd();
const LEGISLACION_PATH = join(ROOT, 'src', 'data', 'json', 'legislacion.json');

interface ClassifiedCandidate {
  source: Source;
  candidate: ScraperCandidate;
  classification: Classification | null;
}

interface Consolidated {
  ranAt: string;
  reports: ScraperReport[];
  appliedChanges: Array<ProposedChange & { applied: boolean; reason?: string }>;
  validationOk: boolean;
  classifierUsed: boolean;
  classifiedCandidates: ClassifiedCandidate[];
}

function loadLegislacion(): Array<Record<string, unknown>> {
  return JSON.parse(readFileSync(LEGISLACION_PATH, 'utf8'));
}

function saveLegislacion(data: unknown): void {
  writeFileSync(LEGISLACION_PATH, JSON.stringify(data, null, 2) + '\n');
}

function applyAsambleaChanges(
  report: ScraperReport,
): Array<ProposedChange & { applied: boolean; reason?: string }> {
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
    ['pj', scrapePJ],
    ['delfino', scrapeDelfino],
    ['citic', scrapeCitic],
  ] as const) {
    console.log(`--- ${name} ---`);
    try {
      const r = await fn();
      reports.push(r);
      console.log(
        `  ${r.fetched} fetched, ${r.matched} matched, ${r.changes.length} changes, ${r.candidates.length} candidates`,
      );
      if (r.notes.length) r.notes.forEach((n) => console.log(`    nota: ${n}`));
    } catch (err) {
      console.error(`  scraper ${name} falló: ${(err as Error).message}`);
      reports.push({
        scraper: name,
        ranAt: new Date().toISOString(),
        fetched: 0,
        matched: 0,
        changes: [],
        candidates: [],
        notes: [`scraper falló: ${(err as Error).message}`],
      });
    }
  }

  // Aplicar cambios automáticos solo de Asamblea (Micitt/Camtic son solo candidatos)
  const asambleaReport = reports.find((r) => r.scraper === 'asamblea');
  const appliedChanges = asambleaReport ? applyAsambleaChanges(asambleaReport) : [];

  // Clasificación LLM de candidatos (Fase 6)
  const allCandidates: Array<{ source: Source; candidate: ScraperCandidate }> =
    reports.flatMap((r) =>
      r.candidates.map((c) => ({ source: r.scraper as Source, candidate: c })),
    );

  const classifierUsed = classifierAvailable();
  console.log(`\n--- clasificador LLM ---`);
  if (classifierUsed) {
    console.log(`  GROQ_API_KEY presente, clasificando ${allCandidates.length} candidatos...`);
  } else {
    console.log(`  GROQ_API_KEY ausente, skip (modo Fase 5: sin ranking).`);
  }

  const classifications = classifierUsed
    ? await classifyMany(
        allCandidates.map((c) => ({ ...c.candidate, source: c.source })),
        2,
      )
    : allCandidates.map(() => null);

  const classifiedCandidates: ClassifiedCandidate[] = allCandidates.map((c, i) => ({
    source: c.source,
    candidate: c.candidate,
    classification: classifications[i],
  }));

  if (classifierUsed) {
    const ok = classifiedCandidates.filter((c) => c.classification).length;
    console.log(`  ${ok}/${classifiedCandidates.length} clasificados correctamente.`);
  }

  console.log('\n--- validación ---');
  const valid = validateAll();
  const crossOk = crossCheck();

  const consolidated: Consolidated = {
    ranAt,
    reports,
    appliedChanges,
    validationOk: valid && crossOk,
    classifierUsed,
    classifiedCandidates,
  };

  const outDir = join(ROOT, REPORTS_DIR);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  writeFileSync(join(outDir, 'last-run.json'), JSON.stringify(consolidated, null, 2));

  // Markdown summary para PR body
  const totalChanges = appliedChanges.filter((c) => c.applied).length;
  const md = renderMarkdown(consolidated, totalChanges);
  writeFileSync(join(outDir, 'last-run.md'), md);

  console.log('\n--- resumen ---');
  console.log(`Cambios aplicados a JSON: ${totalChanges}`);
  console.log(`Candidatos detectados: ${classifiedCandidates.length}`);
  console.log(`Validación post-aplicación: ${valid && crossOk ? 'OK' : 'FAIL'}`);

  await closeBrowser();
}

function renderMarkdown(c: Consolidated, totalChanges: number): string {
  const lines: string[] = [];
  lines.push(`## Scrape automático — ${c.ranAt}`);
  lines.push('');
  lines.push(`- **Cambios aplicados a JSON**: ${totalChanges}`);
  lines.push(`- **Candidatos detectados**: ${c.classifiedCandidates.length}`);
  lines.push(`- **Validación AJV**: ${c.validationOk ? '✅ OK' : '❌ FAIL'}`);
  lines.push(
    `- **Clasificación LLM**: ${
      c.classifierUsed
        ? '✅ activa (Llama 3.3 70B vía Groq)'
        : '⚠️ sin LLM (configurar `GROQ_API_KEY` como secret de GitHub Actions para activar)'
    }`,
  );
  lines.push('');

  // Métricas y cambios por scraper
  for (const r of c.reports) {
    lines.push(`### ${r.scraper}`);
    lines.push(`- fetched: ${r.fetched}, matched: ${r.matched}, changes: ${r.changes.length}, candidates: ${r.candidates.length}`);
    if (r.changes.length) {
      lines.push('');
      lines.push('**Cambios propuestos al JSON**:');
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
      lines.push('**Notas operativas**:');
      for (const n of r.notes) lines.push(`- ${n}`);
    }
    lines.push('');
  }

  // Candidatos rankeados (si LLM activo) o lista plana (si no)
  if (c.classifiedCandidates.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('## Candidatos detectados');
    lines.push('');

    if (c.classifierUsed) {
      const ranked = c.classifiedCandidates
        .map((cc, idx) => ({ ...cc, idx }))
        .sort((a, b) => (b.classification?.score ?? -1) - (a.classification?.score ?? -1));

      const buckets: Array<{
        emoji: string;
        label: string;
        min: number;
        max: number;
      }> = [
        { emoji: '🔴', label: 'Alta relevancia (score ≥ 8)', min: 8, max: 10 },
        { emoji: '🟡', label: 'Media relevancia (score 5-7)', min: 5, max: 7.9 },
        { emoji: '⚪', label: 'Baja relevancia (score < 5)', min: 0, max: 4.9 },
      ];

      for (const bucket of buckets) {
        const inBucket = ranked.filter(
          (cc) =>
            cc.classification &&
            cc.classification.score >= bucket.min &&
            cc.classification.score <= bucket.max,
        );
        if (inBucket.length === 0) continue;
        lines.push(`### ${bucket.emoji} ${bucket.label}`);
        lines.push('');
        for (const cc of inBucket) {
          const cl = cc.classification!;
          const tagsStr = cl.tags.length ? ` _\`${cl.tags.join('`, `')}\`_` : '';
          lines.push(
            `- **[${cl.score}]** \`${cl.tipo}\` · ${cc.candidate.titulo}${tagsStr}`,
          );
          lines.push(`  - ${cl.resumen}`);
          lines.push(`  - fuente: ${cc.source} · ${cc.candidate.url}`);
        }
        lines.push('');
      }

      const sinClasificar = ranked.filter((cc) => !cc.classification);
      if (sinClasificar.length > 0) {
        lines.push(`### ❓ Sin clasificar (LLM falló)`);
        lines.push('');
        for (const cc of sinClasificar) {
          lines.push(`- ${cc.candidate.titulo} (${cc.source}) → ${cc.candidate.url}`);
        }
        lines.push('');
      }
    } else {
      lines.push('_Sin clasificación LLM. Configurar `GROQ_API_KEY` para enriquecer este reporte._');
      lines.push('');
      for (const cc of c.classifiedCandidates) {
        lines.push(`- ${cc.candidate.titulo} (${cc.source}) → ${cc.candidate.url}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('_Generado por `.github/workflows/scrape.yml`. Revisar antes de mergear._');
  return lines.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(async (err) => {
    console.error(err);
    await closeBrowser();
    process.exit(1);
  });
}
