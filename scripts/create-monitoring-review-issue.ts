/**
 * Abre una tarea editorial para frentes vencidos o próximos a vencer.
 *
 * Idempotencia: cada frente/fecha lleva un marcador en el cuerpo del issue.
 * Mientras exista un issue abierto con ese marcador, las corridas posteriores
 * no vuelven a crear la misma tarea. La creación es silenciosa: el watcher
 * avisa a Mario únicamente cuando ya existe un veredicto listo para decidir.
 *
 * Este script no modifica datasets. `record-review` sigue siendo el único paso
 * que mueve una próxima fecha, y solo escribe con `--apply` tras revisión humana.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type {
  MonitoringDueItem,
  MonitoringDueReport,
} from './check-monitoring-due';

const REPORT_PATH = resolve(process.cwd(), 'scraper-runs/monitoring-due.json');
const STALE_REVIEW_LABEL = 'monitoring-stale';
const DEFAULT_STALE_DAYS = 2;

interface IssueSummary {
  number: number;
  body: string | null;
  updated_at?: string;
  labels?: Array<{ name?: string } | string>;
}

export interface StaleMonitoringIssue {
  issueNumber: number;
  item: MonitoringDueItem;
  inactiveDays: number;
}

export function monitoringMarker(item: MonitoringDueItem): string {
  return `<!-- monitoring-review:v2:${item.id}:${item.fechaProximaRevision} -->`;
}

export function legacyMonitoringMarker(item: MonitoringDueItem): string {
  return `<!-- monitoring-review:${item.id}:${item.fechaProximaRevision} -->`;
}

export function staleMonitoringMarker(item: MonitoringDueItem): string {
  return `<!-- monitoring-review-stale:v1:${item.id}:${item.fechaProximaRevision} -->`;
}

function issueRepresentsItem(issue: IssueSummary, item: MonitoringDueItem): boolean {
  const body = issue.body ?? '';
  return body.includes(monitoringMarker(item)) || body.includes(legacyMonitoringMarker(item));
}

function issueHasLabel(issue: IssueSummary, label: string): boolean {
  return (issue.labels ?? []).some((value) => (
    typeof value === 'string' ? value === label : value.name === label
  ));
}

export function selectUnrepresentedItems(
  items: MonitoringDueItem[],
  openIssues: IssueSummary[],
): MonitoringDueItem[] {
  return items.filter((item) => !openIssues.some((issue) => issueRepresentsItem(issue, item)));
}

export function selectStaleMonitoringIssues(
  items: MonitoringDueItem[],
  openIssues: IssueSummary[],
  asOf: string,
  staleDays = DEFAULT_STALE_DAYS,
): StaleMonitoringIssue[] {
  const asOfTime = Date.parse(`${asOf}T00:00:00Z`);
  if (Number.isNaN(asOfTime)) throw new Error(`Fecha de corte inválida: ${asOf}`);
  if (!Number.isInteger(staleDays) || staleDays < 1) {
    throw new Error('staleDays debe ser un entero positivo.');
  }

  return items.flatMap((item) => {
    if (item.estado === 'proximo') return [];
    const issue = openIssues.find((candidate) => issueRepresentsItem(candidate, item));
    if (!issue?.updated_at || issueHasLabel(issue, STALE_REVIEW_LABEL)) return [];
    const updatedTime = Date.parse(issue.updated_at);
    if (Number.isNaN(updatedTime)) return [];
    const inactiveDays = Math.floor((asOfTime - updatedTime) / 86_400_000);
    if (inactiveDays < staleDays) return [];
    return [{ issueNumber: issue.number, item, inactiveDays }];
  });
}

function statusLabel(item: MonitoringDueItem): string {
  if (item.estado === 'vencido') {
    return `Vencido hace ${Math.abs(item.diasHastaVencimiento)} día(s)`;
  }
  if (item.estado === 'vence-hoy') return 'Vence hoy';
  return `Vence en ${item.diasHastaVencimiento} día(s)`;
}

export function buildMonitoringIssueBody(
  report: MonitoringDueReport,
  items: MonitoringDueItem[],
): string {
  const lines = items.map(monitoringMarker);
  lines.push('## Revisiones editoriales pendientes');
  lines.push('');
  lines.push(
    report.leadDays === null
      ? `Corte operativo: **${report.asOf}**. La anticipación se calcula por cadencia en días hábiles y no implica que haya ocurrido un cambio.`
      : `Corte operativo: **${report.asOf}**. Esta simulación usa un override de ${report.leadDays} día(s) calendario y no implica que haya ocurrido un cambio.`,
  );
  lines.push('');
  lines.push('| Estado | Frente | Cadencia | Última revisión | Próxima revisión | Fuente base |');
  lines.push('|--------|--------|----------|-----------------|------------------|-------------|');
  for (const item of items) {
    lines.push(
      `| ${statusLabel(item)} | **${item.nombre}** (\`${item.id}\`) | ${item.cadenciaId} | ${item.fechaUltimaRevision} | ${item.fechaProximaRevision} | [abrir](${item.fuenteUrl}) |`,
    );
  }
  lines.push('');
  lines.push('## Estado operativo');
  lines.push('');
  lines.push('La tarea fue asignada al revisor editorial. **Mario no necesita actuar todavía.** El watcher contrastará la fuente primaria y publicará en este issue un veredicto `SIN CAMBIOS`, `CAMBIO` o `INVESTIGAR`. Al registrarse, los resultados corresponden a `sin-cambios`, `cambio-detectado` o `cambio-publicado`.');
  lines.push('');
  lines.push('## Cómo se resuelve');
  lines.push('');
  lines.push('1. Consultar la fuente primaria y contrastar cualquier señal con el catálogo actual.');
  lines.push('2. Publicar un veredicto estructurado con fuente, fecha, alcance y decisión propuesta; una ausencia de noticias no se registra automáticamente.');
  lines.push('3. Después del GO de Mario, preparar el JSON bilingüe con `issueUrl` y ejecutar primero `npm run record-review -- --input <archivo>` en modo dry-run.');
  lines.push('4. Aplicar y validar localmente. Push y despliegue requieren autorización explícita.');
  lines.push('5. Cerrar el issue solo después de comprobar que la revisión aprobada y la nueva fecha ya están en `main`.');
  lines.push('');
  lines.push('Los monitores abren la tarea; **no cambian proyectos, expedientes, indicadores ni fechas por sí solos**. Publicar o desplegar requiere una autorización separada.');
  return lines.join('\n');
}

export function buildStaleMonitoringComment(stale: StaleMonitoringIssue): string {
  return [
    staleMonitoringMarker(stale.item),
    '⚠️ **Revisión editorial estancada**',
    '',
    `Este issue lleva ${stale.inactiveDays} día(s) sin actividad y la revisión de \`${stale.item.id}\` continúa vencida desde ${stale.item.fechaProximaRevision}.`,
    '',
    'El revisor debe retomar el contraste de fuentes y producir un veredicto `SIN CAMBIOS`, `CAMBIO` o `INVESTIGAR`. Esta alerta no modifica datos ni fechas y se emite una sola vez por issue.',
  ].join('\n');
}

async function ghApi<T>(
  token: string,
  repo: string,
  path: string,
  method: 'GET' | 'POST' = 'GET',
  body?: unknown,
): Promise<T> {
  const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`GitHub API ${method} ${path} → ${response.status}: ${await response.text()}`);
  }
  return response.json() as Promise<T>;
}

async function ensureLabel(
  token: string,
  repo: string,
  name: string,
  color: string,
  description: string,
): Promise<void> {
  try {
    await ghApi(token, repo, `/labels/${name}`);
  } catch {
    await ghApi(token, repo, '/labels', 'POST', {
      name,
      color,
      description,
    });
  }
}

async function main(argv: string[]): Promise<void> {
  if (!existsSync(REPORT_PATH)) {
    console.log(`create-monitoring-review-issue: no existe ${REPORT_PATH}, skip.`);
    return;
  }
  const report = JSON.parse(readFileSync(REPORT_PATH, 'utf8')) as MonitoringDueReport;
  if (report.items.length === 0) {
    console.log('create-monitoring-review-issue: agenda al día, skip.');
    return;
  }

  if (argv.includes('--dry-run')) {
    console.log(buildMonitoringIssueBody(report, report.items));
    return;
  }

  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPOSITORY?.trim();
  if (!token || !repo) {
    console.log('create-monitoring-review-issue: GITHUB_TOKEN o GITHUB_REPOSITORY ausente, skip.');
    return;
  }

  const openIssues = await ghApi<IssueSummary[]>(
    token,
    repo,
    '/issues?state=open&labels=monitoring-review&per_page=100',
  );
  const pending = selectUnrepresentedItems(report.items, openIssues);
  const stale = selectStaleMonitoringIssues(report.items, openIssues, report.asOf);
  if (pending.length === 0 && stale.length === 0) {
    console.log('create-monitoring-review-issue: todas las revisiones ya tienen un issue abierto, skip.');
    return;
  }

  if (pending.length > 0) {
    await ensureLabel(
      token,
      repo,
      'monitoring-review',
      '1d76db',
      'Agenda periódica: requiere revisión editorial humana',
    );
    const overdue = pending.filter(({ estado }) => estado !== 'proximo').length;
    const title = `[agenda editorial ${report.asOf}] ${pending.length} revisión(es)${overdue ? `, ${overdue} vencida(s)` : ''}`;
    const created = await ghApi<{ number: number; html_url: string }>(
      token,
      repo,
      '/issues',
      'POST',
      {
        title,
        body: buildMonitoringIssueBody(report, pending),
        labels: ['monitoring-review'],
      },
    );
    console.log(`create-monitoring-review-issue: issue #${created.number} creado → ${created.html_url}`);
  }

  if (stale.length > 0) {
    await ensureLabel(
      token,
      repo,
      STALE_REVIEW_LABEL,
      'd93f0b',
      'Revisión editorial vencida sin actividad durante al menos 48 horas',
    );
    for (const stalled of stale) {
      await ghApi(token, repo, `/issues/${stalled.issueNumber}/labels`, 'POST', {
        labels: [STALE_REVIEW_LABEL],
      });
      await ghApi(token, repo, `/issues/${stalled.issueNumber}/comments`, 'POST', {
        body: buildStaleMonitoringComment(stalled),
      });
      console.log(
        `create-monitoring-review-issue: issue #${stalled.issueNumber} marcado como estancado (${stalled.inactiveDays} días).`,
      );
    }
  }
}

const isDirectInvocation =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectInvocation) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`create-monitoring-review-issue ERROR: ${(error as Error).message}`);
    process.exit(1);
  });
}
