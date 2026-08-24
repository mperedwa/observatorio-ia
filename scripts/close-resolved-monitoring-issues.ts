/**
 * Cierra issues de agenda únicamente cuando `main` ya contiene una revisión
 * final vinculada al issue y la próxima fecha del frente avanzó.
 *
 * El workflow invoca este script después de un push que modifica
 * `src/data/json/monitoreo.json`. Nunca aplica revisiones ni edita datasets.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { InventarioMonitoreo, RevisionMonitoreo } from '../src/data/monitoreo';

const DATA_PATH = resolve(process.cwd(), 'src/data/json/monitoreo.json');
const MARKER_RE = /<!-- monitoring-review:(?:v2:)?([^:\s]+):(\d{4}-\d{2}-\d{2}) -->/g;

export interface MonitoringIssue {
  number: number;
  html_url: string;
  body: string | null;
}

export interface MonitoringMarker {
  frenteId: string;
  fechaRevision: string;
}

export function parseMonitoringMarkers(body: string | null): MonitoringMarker[] {
  if (!body) return [];
  return [...body.matchAll(MARKER_RE)].map((match) => ({
    frenteId: match[1],
    fechaRevision: match[2],
  }));
}

function isFinalReview(revision: RevisionMonitoreo): boolean {
  return revision.resultado === 'sin-cambios' || revision.resultado === 'cambio-publicado';
}

export function isMonitoringIssueResolved(
  inventory: InventarioMonitoreo,
  issue: MonitoringIssue,
): boolean {
  const markers = parseMonitoringMarkers(issue.body);
  if (markers.length === 0) return false;

  return markers.every((marker) => {
    const front = inventory.frentes.find(({ id }) => id === marker.frenteId);
    if (!front || front.fechaProximaRevision <= marker.fechaRevision) return false;

    return inventory.revisiones.some((revision) => (
      revision.frenteId === marker.frenteId &&
      revision.issueUrl === issue.html_url &&
      revision.fecha >= marker.fechaRevision &&
      isFinalReview(revision)
    ));
  });
}

export function selectResolvedMonitoringIssues(
  inventory: InventarioMonitoreo,
  issues: MonitoringIssue[],
): MonitoringIssue[] {
  return issues.filter((issue) => isMonitoringIssueResolved(inventory, issue));
}

async function ghApi<T>(
  token: string,
  repo: string,
  path: string,
  method: 'GET' | 'POST' | 'PATCH' = 'GET',
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
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
}

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPOSITORY?.trim();
  if (!token || !repo) {
    console.log('close-monitoring-review: GITHUB_TOKEN o GITHUB_REPOSITORY ausente, skip.');
    return;
  }

  const inventory = JSON.parse(readFileSync(DATA_PATH, 'utf8')) as InventarioMonitoreo;
  const issues = await ghApi<MonitoringIssue[]>(
    token,
    repo,
    '/issues?state=open&labels=monitoring-review&per_page=100',
  );
  const resolved = selectResolvedMonitoringIssues(inventory, issues);
  if (resolved.length === 0) {
    console.log('close-monitoring-review: no hay issues verificablemente resueltos.');
    return;
  }

  for (const issue of resolved) {
    await ghApi(token, repo, `/issues/${issue.number}/comments`, 'POST', {
      body: '✅ Revisión registrada y verificada en `main`. La próxima fecha editorial avanzó; este issue puede cerrarse sin recrear la alerta.',
    });
    await ghApi(token, repo, `/issues/${issue.number}`, 'PATCH', { state: 'closed' });
    console.log(`close-monitoring-review: issue #${issue.number} cerrado.`);
  }
}

const isDirectInvocation =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectInvocation) {
  main().catch((error) => {
    console.error(`close-monitoring-review ERROR: ${(error as Error).message}`);
    process.exit(1);
  });
}
