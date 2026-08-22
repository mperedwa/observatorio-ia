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
 * 1. `scrape:all` guarda el reporte de Asamblea dentro de
 *    `scraper-runs/last-run.json` con `changes[]` (ProposedChange[]).
 * 2. Este script extrae ese reporte —o usa `asamblea-*.json` como fallback de
 *    una corrida individual— y crea un issue `legislacion-update`.
 * 3. Developer (SiriusOS) procesa el issue, contrasta el diff con una fuente
 *    oficial y consolida la recomendación.
 * 4. Mario da GO/NO por Telegram. GO → developer edita `legislacion.json`,
 *    corre validate/build y crea un commit local. Push y despliegue requieren
 *    una autorización posterior y separada.
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
import { pathToFileURL } from 'node:url';

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

interface ConsolidatedReport {
  reports?: ScraperReport[];
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

export function selectAsambleaReport(
  consolidated: ConsolidatedReport,
): ScraperReport | null {
  return consolidated.reports?.find(({ scraper }) => scraper === 'asamblea') ?? null;
}

/**
 * Carga el reporte de Asamblea producido por `scrape:all`. El consolidado es
 * la fuente principal; el archivo asamblea-*.json queda como fallback para
 * ejecuciones individuales de `npm run scrape:asamblea`.
 */
export function loadLatestAsambleaReport(
  reportsDir = REPORTS_DIR,
): { report: ScraperReport; sourcePath: string } | null {
  if (!existsSync(reportsDir)) return null;

  const consolidatedPath = join(reportsDir, 'last-run.json');
  if (existsSync(consolidatedPath)) {
    const consolidated = JSON.parse(
      readFileSync(consolidatedPath, 'utf8'),
    ) as ConsolidatedReport;
    const report = selectAsambleaReport(consolidated);
    if (report) return { report, sourcePath: consolidatedPath };
  }

  const files = readdirSync(reportsDir)
    .filter((f) => f.startsWith('asamblea-') && f.endsWith('.json'))
    .sort()
    .reverse();
  if (!files[0]) return null;
  const sourcePath = join(reportsDir, files[0]);
  return {
    report: JSON.parse(readFileSync(sourcePath, 'utf8')) as ScraperReport,
    sourcePath,
  };
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

export function buildBody(report: ScraperReport, runId: string): string {
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
    '_Generado por `scripts/create-legislacion-update-issue.ts`. El bot developer (SiriusOS) valida el diff, contrasta la señal con una fuente primaria y consolida. La decisión final (GO/NO por cambio) ocurre por Telegram con Mario. Los cambios aceptados se aplican editorialmente a `src/data/json/legislacion.json` en un commit local; push y despliegue requieren autorización separada._',
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
        'Señal sobre estado o comisión de un expediente. Requiere fuente primaria y revisión editorial antes de aplicar.',
    });
  }
}

async function main(argv = process.argv.slice(2)): Promise<void> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPOSITORY?.trim();
  const runId = process.env.GITHUB_RUN_ID?.trim() || `local-${Date.now()}`;
  const dryRun = argv.includes('--dry-run');

  if ((!token || !repo) && !dryRun) {
    console.log(
      'create-legislacion-update-issue: GITHUB_TOKEN o GITHUB_REPOSITORY ausente, skip silencioso.',
    );
    return;
  }

  const loaded = loadLatestAsambleaReport();
  if (!loaded) {
    console.log(
      'create-legislacion-update-issue: no hay reporte de Asamblea en last-run.json ni asamblea-*.json, skip.',
    );
    return;
  }
  const { report, sourcePath } = loaded;

  if (report.changes.length === 0) {
    console.log(
      `create-legislacion-update-issue: report ${sourcePath} tiene 0 changes, skip.`,
    );
    return;
  }

  const body = buildBody(report, runId);
  if (dryRun) {
    console.log(
      `create-legislacion-update-issue: dry-run desde ${sourcePath}; ${report.changes.length} cambio(s).`,
    );
    console.log(body);
    return;
  }

  if (!token || !repo) {
    throw new Error('GITHUB_TOKEN o GITHUB_REPOSITORY ausente.');
  }

  await ensureLabel(token, repo, 'legislacion-update');

  const title = `[legislacion-update ${fmtFechaCR(report.ranAt)}] ${report.changes.length} cambio(s) en expedientes`;
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

const isDirectInvocation =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectInvocation) {
  main().catch((err) => {
    console.error('create-legislacion-update-issue ERROR:', (err as Error).message);
    process.exit(1);
  });
}
