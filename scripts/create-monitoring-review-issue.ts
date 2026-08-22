/**
 * Abre una tarea editorial para frentes vencidos o próximos a vencer.
 *
 * Idempotencia: cada frente/fecha lleva un marcador en el cuerpo del issue.
 * Mientras exista un issue abierto con ese marcador, las corridas posteriores
 * no vuelven a crear la misma tarea ni a enviar el mismo aviso por Telegram.
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

interface IssueSummary {
  number: number;
  body: string | null;
}

export function monitoringMarker(item: MonitoringDueItem): string {
  return `<!-- monitoring-review:${item.id}:${item.fechaProximaRevision} -->`;
}

export function selectUnrepresentedItems(
  items: MonitoringDueItem[],
  openIssues: IssueSummary[],
): MonitoringDueItem[] {
  const existingBodies = openIssues.map(({ body }) => body ?? '').join('\n');
  return items.filter((item) => !existingBodies.includes(monitoringMarker(item)));
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
    `Corte operativo: **${report.asOf}**. Esta alerta usa una ventana de ${report.leadDays} días y no implica que haya ocurrido un cambio.`,
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
  lines.push('## Cómo cerrar la revisión');
  lines.push('');
  lines.push('1. Consultar la fuente primaria y contrastar cualquier señal con el catálogo actual.');
  lines.push('2. Registrar el resultado como `sin-cambios`, `cambio-detectado` o `cambio-publicado`; una ausencia de noticias no se registra automáticamente.');
  lines.push('3. Preparar el JSON bilingüe y ejecutar primero `npm run record-review -- --input <archivo>` en modo dry-run.');
  lines.push('4. Solo después de validar la decisión, ejecutar con `--apply`, validar datos y crear un commit local para revisión.');
  lines.push('');
  lines.push('Los monitores abren la tarea; **no cambian proyectos, expedientes, indicadores ni fechas por sí solos**. Publicar o desplegar requiere una autorización separada.');
  return lines.join('\n');
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

async function ensureLabel(token: string, repo: string): Promise<void> {
  try {
    await ghApi(token, repo, '/labels/monitoring-review');
  } catch {
    await ghApi(token, repo, '/labels', 'POST', {
      name: 'monitoring-review',
      color: '1d76db',
      description: 'Agenda periódica: requiere revisión editorial humana',
    });
  }
}

async function notifyTelegram(
  token: string | undefined,
  chatId: string | undefined,
  items: MonitoringDueItem[],
  issueUrl: string,
): Promise<void> {
  if (!token || !chatId) return;
  const lines = [
    `Agenda editorial: ${items.length} revisión(es) requieren atención.`,
    ...items.map((item) => `• ${item.nombre}: ${statusLabel(item)} (${item.fechaProximaRevision})`),
    `Tarea: ${issueUrl}`,
    'La alerta no modifica datos; requiere revisión humana.',
  ];
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join('\n').slice(0, 4000),
      disable_web_page_preview: true,
    }),
  });
  if (!response.ok) {
    throw new Error(`Telegram HTTP ${response.status}: ${await response.text()}`);
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
  if (pending.length === 0) {
    console.log('create-monitoring-review-issue: todas las revisiones ya tienen un issue abierto, skip.');
    return;
  }

  await ensureLabel(token, repo);
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

  try {
    await notifyTelegram(
      process.env.TELEGRAM_BOT_TOKEN?.trim(),
      process.env.TELEGRAM_CHAT_ID?.trim(),
      pending,
      created.html_url,
    );
  } catch (error) {
    console.warn(`create-monitoring-review-issue: issue creado, pero Telegram falló: ${(error as Error).message}`);
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
