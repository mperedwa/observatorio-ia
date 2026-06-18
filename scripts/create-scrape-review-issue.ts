/**
 * Abre un GitHub Issue con label `scrape-review` cuando el último scrape
 * detectó ítems que requieren revisión humana (bucket `nuevos` o `revisar`
 * en `scraper-runs/classification.json`).
 *
 * Diseñado para correr en el workflow de scrape después de
 * `classify-vs-repo`. El issue queda como trazabilidad auditable y como
 * señal para el bot que cura el contenido del observatorio (developer en
 * SiriusOS). El bot recoge el issue vía `gh issue list --label scrape-review`,
 * cruza contra el repo, despacha al analista para verificación de fuentes
 * primarias, y posta el resultado consolidado como comentario.
 *
 * Idempotencia: si ya existe un issue abierto con label `scrape-review`
 * para el mismo `runId`, se reutiliza (se agrega un comentario en vez de
 * abrir uno nuevo). Esto evita duplicados si el workflow se re-corre.
 *
 * Env requerida:
 *   - GITHUB_TOKEN: token con `repo` scope (default en GH Actions)
 *   - GITHUB_REPOSITORY: owner/repo (default en GH Actions, ej `mperedwa/observatorio-ia`)
 *   - GITHUB_RUN_ID: opcional, id del workflow run para idempotencia
 *
 * Salida:
 *   - Exit 0 silencioso si `counts.nuevos == 0 && counts.revisar == 0` o si
 *     los archivos requeridos no existen.
 *   - Exit 0 con log informativo si crea/reutiliza el issue.
 *   - Exit 1 si la creación del issue falla.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CLASSIFICATION_PATH = join(ROOT, 'scraper-runs', 'classification.json');
const STUB_PATH = join(ROOT, 'scraper-runs', 'stub-nuevos.json');

interface ClassifiedItem {
  titulo: string;
  url: string;
  source: string;
  score: number;
  matched_type?: string;
  matched_id?: string;
  reason?: string;
}

interface Classification {
  classifiedAt: string;
  sourceRanAt: string;
  totalDeduped: number;
  totalRaw: number;
  counts: { ya_existe: number; ruido: number; nuevos: number; revisar: number };
  ya_existe?: ClassifiedItem[];
  ruido?: ClassifiedItem[];
  nuevos?: ClassifiedItem[];
  revisar?: ClassifiedItem[];
}

interface Stub {
  id: string;
  titulo: { es: string; en: string };
  institucionId: string;
  categoria: string;
  estado: string;
  desde: string;
  descripcion: { es: string; en: string };
  fuenteUrl: string;
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

function buildBody(c: Classification, stubs: Stub[], runId: string): string {
  const lines: string[] = [];
  lines.push(`<!-- scrape-review:${runId} -->`);
  lines.push(`**Scrape**: ${fmtFechaCR(c.sourceRanAt)} (run \`${runId}\`)`);
  lines.push('');
  lines.push(
    `**Resumen**: ${c.totalDeduped} candidatos · ${c.counts.nuevos} nuevos · ${c.counts.revisar} a revisar · ${c.counts.ya_existe} ya existen · ${c.counts.ruido} ruido`,
  );
  lines.push('');

  if (c.counts.nuevos > 0 && c.nuevos && c.nuevos.length > 0) {
    lines.push('## 🆕 Candidatos NUEVOS para mergear');
    lines.push('');
    lines.push('| # | Score | Source | Título | URL |');
    lines.push('|---|-------|--------|--------|-----|');
    c.nuevos.forEach((n, i) => {
      const titulo = n.titulo.length > 90 ? `${n.titulo.slice(0, 90)}…` : n.titulo;
      lines.push(
        `| ${i + 1} | ${n.score} | \`${n.source}\` | ${titulo.replace(/\|/g, '\\|')} | [link](${n.url}) |`,
      );
    });
    lines.push('');
  }

  if (c.counts.revisar > 0 && c.revisar && c.revisar.length > 0) {
    lines.push('## 🔁 Posibles updates a revisar manualmente');
    lines.push('');
    lines.push('| # | Score | Source | Título | URL | Match candidato | Razón |');
    lines.push('|---|-------|--------|--------|-----|-----------------|-------|');
    c.revisar.forEach((r, i) => {
      const titulo = r.titulo.length > 80 ? `${r.titulo.slice(0, 80)}…` : r.titulo;
      const match = r.matched_id ? `\`${r.matched_id}\` (${r.matched_type ?? '?'})` : '-';
      const reason = r.reason ? r.reason.replace(/\|/g, '\\|') : '-';
      lines.push(
        `| ${i + 1} | ${r.score} | \`${r.source}\` | ${titulo.replace(/\|/g, '\\|')} | [link](${r.url}) | ${match} | ${reason} |`,
      );
    });
    lines.push('');
  }

  if (stubs.length > 0) {
    lines.push('## Stubs propuestos (esqueleto de proyectos.json)');
    lines.push('');
    lines.push('<details><summary>Ver stub-nuevos.json</summary>');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(stubs, null, 2));
    lines.push('```');
    lines.push('');
    lines.push('</details>');
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(
    '_Generado automáticamente por `scripts/create-scrape-review-issue.ts`. El bot developer (SiriusOS) procesa este issue, cruza contra el repo, despacha al analista para verificación de fuentes primarias, y posta el resultado consolidado como comentario. La decisión final (GO/NO/UPDATE) ocurre por Telegram con Mario._',
  );

  return lines.join('\n');
}

interface IssueSummary {
  number: number;
  title: string;
  body: string;
}

async function ghApi<T = unknown>(
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
    '/issues?state=open&labels=scrape-review&per_page=50',
  );
  const marker = `<!-- scrape-review:${runId} -->`;
  return issues.find((i) => (i.body ?? '').includes(marker)) ?? null;
}

async function ensureLabel(token: string, repo: string, name: string): Promise<void> {
  try {
    await ghApi(token, repo, `/labels/${encodeURIComponent(name)}`);
  } catch {
    await ghApi(token, repo, '/labels', 'POST', {
      name,
      color: '0e8a16',
      description: 'Scrape automático: requiere revisión humana de items nuevos o ambiguos',
    });
  }
}

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPOSITORY?.trim();
  const runId = process.env.GITHUB_RUN_ID?.trim() || `local-${Date.now()}`;

  if (!token || !repo) {
    console.log('create-scrape-review-issue: GITHUB_TOKEN o GITHUB_REPOSITORY ausente, skip silencioso.');
    return;
  }

  if (!existsSync(CLASSIFICATION_PATH)) {
    console.log(`create-scrape-review-issue: no existe ${CLASSIFICATION_PATH}, skip.`);
    return;
  }

  const c = JSON.parse(readFileSync(CLASSIFICATION_PATH, 'utf8')) as Classification;
  const needsReview = c.counts.nuevos > 0 || c.counts.revisar > 0;

  if (!needsReview) {
    console.log(
      `create-scrape-review-issue: 0 nuevos y 0 a revisar (ya_existe=${c.counts.ya_existe}, ruido=${c.counts.ruido}), skip.`,
    );
    return;
  }

  const stubs: Stub[] = existsSync(STUB_PATH)
    ? (JSON.parse(readFileSync(STUB_PATH, 'utf8')) as Stub[])
    : [];

  await ensureLabel(token, repo, 'scrape-review');

  const title = `[scrape ${fmtFechaCR(c.sourceRanAt)}] ${c.counts.nuevos} nuevo(s), ${c.counts.revisar} a revisar`;
  const body = buildBody(c, stubs, runId);

  const existing = await findExistingIssue(token, repo, runId);
  if (existing) {
    console.log(`create-scrape-review-issue: ya existe issue #${existing.number} para run ${runId}, agregando comentario.`);
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
      labels: ['scrape-review'],
    },
  );
  console.log(`create-scrape-review-issue: issue #${created.number} creado → ${created.html_url}`);
}

main().catch((err) => {
  console.error('create-scrape-review-issue ERROR:', (err as Error).message);
  process.exit(1);
});
