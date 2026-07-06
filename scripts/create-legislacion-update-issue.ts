/**
 * Abre un GitHub Issue con label `legislacion-update` cuando el scraper de
 * Asamblea (vía Delfino) detectó cambios en `estado` o `comision` de expedientes
 * legislativos catalogados en `legislacion.json`.
 *
 * Diseñado para correr en el workflow scrape.yml después del scraper. Paralelo
 * a `create-scrape-review-issue.ts` que cubre proyectos/instituciones; este
 * cubre exclusivamente cambios editoriales al catálogo legislativo.
 *
 * Flujo end-to-end:
 * 1. Scraper `asamblea.ts` produce `scraper-runs/asamblea-<timestamp>.json` con
 *    `changes[]` (ProposedChange[]).
 * 2. Este script busca el report más reciente y, si tiene changes, crea un GH
 *    Issue con label `legislacion-update`.
 * 3. Developer (SiriusOS) procesa el issue: valida el diff, opcionalmente
 *    despacha a analista para verificación de la fuente Delfino, y consolida.
 * 4. Mario da GO/NO por Telegram. GO → developer edita `legislacion.json`,
 *    corre validate/build, commit + push.
 *
 * Idempotencia: si ya existe issue abierto con label `legislacion-update` para
 * el mismo `runId` (o report timestamp cuando runId no está), reutiliza.
 *
 * Env:
 *   - GITHUB_TOKEN
 *   - GITHUB_REPOSITORY (owner/repo)
 *   - GITHUB_RUN_ID (opcional, para idempotencia)
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = join(ROOT, 'scraper-runs');

interface Bilingual {
  es: string;
  en: string;
}

interface ProposedChange {
  scraper: string;
  dataset: string;
  kind: string;
  id: string;
  field?: string;
  before?: unknown;
  after: unknown;
  rationale: string;
  sourceUrl: string;
  scrapedAt: string;
}

interface ScraperReport {
  scraper: string;
  ranAt: string;
  fetched: number;
  matched: number;
  changes: ProposedChange[];
  candidates: unknown[];
  notes: string[];
}

interface IssueSummary {
  number: number;
  body: string | null;
}

function fmtFechaCR(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-CR', {
      timeZone: 'America/Costa_Rica',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

/** Encuentra el asamblea-*.json más reciente en scraper-runs/. */
function findLatestAsambleaReport(): string | null {
  if (!existsSync(REPORTS_DIR)) return null;
  const files = readdirSync(REPORTS_DIR)
    .filter((f) => f.startsWith('asamblea-') && f.endsWith('.json'))
    .sort()
    .reverse();
  return files[0] ? join(REPORTS_DIR, files[0]) : null;
}

function fmtValue(v: unknown): string {
  if (v === null || v === undefined) return '_null_';
  if (typeof v === 'string') return `\`${v}\``;
  if (typeof v === 'object') {
    const obj = v as Record<string, unknown>;
    if ('es' in obj && 'en' in obj) {
      return `\`${String(obj.es)}\` (EN: \`${String(obj.en)}\`)`;
    }
    return `\`${JSON.stringify(v)}\``;
  }
  return `\`${String(v)}\``;
}

function buildBody(report: ScraperReport, runId: string): string {
  const lines: string[] = [];
  lines.push(`<!-- legislacion-update:${runId} -->`);
  lines.push(
    `**Scraper**: \`asamblea\` (fuente Delfino \`/asamblea/proyecto/<n>\`)`,
  );
  lines.push(`**Corrida**: ${fmtFechaCR(report.ranAt)} (run \`${runId}\`)`);
  lines.push(
    `**Resumen**: ${report.fetched} expedientes consultados · ${report.matched} matched · **${report.changes.length} cambios detectados**`,
  );
  lines.push('');
  lines.push('## Cambios propuestos');
  lines.push('');
  lines.push('| # | Expediente | Campo | Antes | Ahora | Fuente |');
  lines.push('|---|-----------|-------|-------|-------|--------|');
  report.changes.forEach((c, i) => {
    lines.push(
      `| ${i + 1} | \`${c.id}\` | \`${c.field ?? '?'}\` | ${fmtValue(c.before)} | ${fmtValue(c.after)} | [link](${c.sourceUrl}) |`,
    );
  });
  lines.push('');
  lines.push('## Rationale por cambio');
  lines.push('');
  report.changes.forEach((c, i) => {
    lines.push(`**#${i + 1} · \`${c.id}\` · \`${c.field ?? '?'}\`**`);
    lines.push('');
    lines.push(`> ${c.rationale}`);
    lines.push('');
  });
  if (report.notes.length) {
    lines.push('## Notas del scraper');
    lines.push('');
    report.notes.forEach((n) => lines.push(`- ${n}`));
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push(
    '_Generado por `scripts/create-legislacion-update-issue.ts`. El bot developer (SiriusOS) valida el diff, opcionalmente despacha al analista para verificar la fuente Delfino, y consolida. La decisión final (GO/NO por cambio) ocurre por Telegram con Mario. Los cambios aceptados se aplican editorialmente a `src/data/json/legislacion.json`._',
  );
  return lines.join('\n');
}

async function ghApi<T>(
  token: string,
  repo: string,
  path: string,
  method: 'GET' | 'POST' | 'PATCH' = 'GET',
  body?: unknown,
): Promise<T> {
  const url = `https://api.github.com/repos/${repo}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${method} ${path} → ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

async function findExistingIssue(
  token: string,
  repo: string,
  runId: string,
): Promise<IssueSummary | null> {
  const issues = await ghApi<IssueSummary[]>(
    token,
    repo,
    '/issues?state=open&labels=legislacion-update&per_page=50',
  );
  const marker = `<!-- legislacion-update:${runId} -->`;
  return issues.find((i) => (i.body ?? '').includes(marker)) ?? null;
}

async function ensureLabel(token: string, repo: string, name: string): Promise<void> {
  try {
    await ghApi(token, repo, `/labels/${encodeURIComponent(name)}`);
  } catch {
    await ghApi(token, repo, '/labels', 'POST', {
      name,
      color: '1d76db',
      description:
        'Cambio detectado por scraper Asamblea (Delfino) en estado o comisión de expediente legislativo. Requiere revisión editorial + GO Mario antes de aplicar.',
    });
  }
}

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPOSITORY?.trim();
  const runId = process.env.GITHUB_RUN_ID?.trim() || `local-${Date.now()}`;

  if (!token || !repo) {
    console.log(
      'create-legislacion-update-issue: GITHUB_TOKEN o GITHUB_REPOSITORY ausente, skip silencioso.',
    );
    return;
  }

  const reportPath = findLatestAsambleaReport();
  if (!reportPath) {
    console.log('create-legislacion-update-issue: no hay report asamblea-*.json, skip.');
    return;
  }

  const report = JSON.parse(readFileSync(reportPath, 'utf8')) as ScraperReport;

  if (report.changes.length === 0) {
    console.log(
      `create-legislacion-update-issue: report ${reportPath} tiene 0 changes, skip.`,
    );
    return;
  }

  await ensureLabel(token, repo, 'legislacion-update');

  const title = `[legislacion-update ${fmtFechaCR(report.ranAt)}] ${report.changes.length} cambio(s) en expedientes`;
  const body = buildBody(report, runId);

  const existing = await findExistingIssue(token, repo, runId);
  if (existing) {
    console.log(
      `create-legislacion-update-issue: ya existe issue #${existing.number} para run ${runId}, agregando comentario.`,
    );
    await ghApi(token, repo, `/issues/${existing.number}/comments`, 'POST', {
      body: `Re-ejecución del workflow detectada. Resumen actual:\n\n${body}`,
    });
    return;
  }

  const created = await ghApi<{ number: number; html_url: string }>(
    token,
    repo,
    '/issues',
    'POST',
    {
      title,
      body,
      labels: ['legislacion-update'],
    },
  );
  console.log(
    `create-legislacion-update-issue: issue #${created.number} creado → ${created.html_url}`,
  );
}

main().catch((err) => {
  console.error('create-legislacion-update-issue ERROR:', (err as Error).message);
  process.exit(1);
});
