/**
 * Orquestador de scrapers.
 *
 * Corre los scrapers en serie, valida con AJV, opcionalmente clasifica los
 * candidatos con un LLM (Groq + Llama 3.3 70B), y escribe un reporte
 * consolidado. NO aplica cambios editorialmente al JSON: los cambios
 * detectados por el scraper de Asamblea (Delfino) se surfacean vía GH Issue
 * con label `legislacion-update` (ver `scripts/create-legislacion-update-issue.ts`)
 * para revisión manual + GO de Mario antes de mergear.
 *
 * Los pasos "Detect changes" y "Create or update PR" del workflow scrape.yml
 * se retiraron el 2026-07-10 porque:
 *   1) auto-apply de cambios sin revisión editorial fue un riesgo (podía
 *      pegar cambios cosméticos o falsos positivos del scraper sin veto),
 *   2) el step de auto-PR falló repetidamente por "GitHub Actions is not
 *      permitted to create or approve pull requests" — política del repo,
 *   3) el flujo issue-based (developer + Mario Telegram GO) reemplaza
 *      totalmente el flujo PR-based.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { scrapeAsamblea } from './asamblea';
import { scrapeMicitt } from './micitt';
import { scrapeCamtic } from './camtic';
import { scrapePJ } from './pj';
import { scrapeDelfino } from './delfino';
import { scrapeCitic } from './citic';
import { scrapeGoogleNews } from './google-news';
import { scrapeHacienda } from './hacienda';
import { scrapeCGR } from './cgr';
import { scrapeMideplan } from './mideplan';
import {
  REPORTS_DIR,
  type ScraperReport,
  type ScraperCandidate,
} from './lib/diff';
import { validateAll, crossCheck } from './lib/validator';
import { closeBrowser } from './lib/source';
import { classifierAvailable, classifyMany, type Classification, type Source } from './lib/classifier';

const ROOT = process.cwd();

interface ClassifiedCandidate {
  source: Source;
  candidate: ScraperCandidate;
  classification: Classification | null;
}

interface Consolidated {
  ranAt: string;
  reports: ScraperReport[];
  validationOk: boolean;
  classifierUsed: boolean;
  classifiedCandidates: ClassifiedCandidate[];
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
    ['google-news', scrapeGoogleNews],
    ['hacienda', scrapeHacienda],
    ['cgr', scrapeCGR],
    ['mideplan', scrapeMideplan],
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

  // No auto-apply: cambios de Asamblea (Delfino) se surfacean vía GH Issue
  // legislacion-update para revisión manual (create-legislacion-update-issue.ts).

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
    validationOk: valid && crossOk,
    classifierUsed,
    classifiedCandidates,
  };

  const outDir = join(ROOT, REPORTS_DIR);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  writeFileSync(join(outDir, 'last-run.json'), JSON.stringify(consolidated, null, 2));

  // Markdown summary (histórico: originalmente cuerpo del PR auto-generado; ahora
  // permanece como resumen operativo en scraper-runs/last-run.md).
  const totalDetectedChanges = reports.reduce((acc, r) => acc + r.changes.length, 0);
  const md = renderMarkdown(consolidated, totalDetectedChanges);
  writeFileSync(join(outDir, 'last-run.md'), md);

  console.log('\n--- resumen ---');
  console.log(`Cambios detectados por scrapers (se surfacean vía GH Issue legislacion-update): ${totalDetectedChanges}`);
  console.log(`Candidatos detectados: ${classifiedCandidates.length}`);
  console.log(`Validación catálogo: ${valid && crossOk ? 'OK' : 'FAIL'}`);

  await closeBrowser();
}

function renderMarkdown(c: Consolidated, totalChanges: number): string {
  const lines: string[] = [];
  lines.push(`## Scrape automático — ${c.ranAt}`);
  lines.push('');
  lines.push(`- **Cambios detectados** (via GH Issue legislacion-update): ${totalChanges}`);
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
