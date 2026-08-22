/**
 * Monitor mensual de versiones de la ENIA y su Plan de Acción.
 *
 * Observa dos señales oficiales:
 *   1. contenido y enlaces relevantes de la página de IA del MICITT;
 *   2. huella SHA-256 del PDF del Plan que usa el inventario público.
 *
 * Una diferencia genera una alerta para revisión editorial. El watcher nunca
 * modifica `eniaAcciones.json`, proyectos ni el estado de ejecución.
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as cheerio from 'cheerio';

const PAGE_URL = 'https://www.micitt.go.cr/gobierno_digital/inteligencia_artificial';
const INVENTORY_PATH = join(process.cwd(), 'src/data/json/eniaAcciones.json');
const STATE_PATH = join(process.cwd(), 'scraper-runs/enia-state.json');
const USER_AGENT = 'observatorio-ia-bot/1.0 (+https://observatorioia.org)';
const FETCH_TIMEOUT_MS = 30000;

export interface EniaSignals {
  strategyPeriods: string[];
  planUrls: string[];
  relevantLinks: string[];
  relevantText: string[];
  pageFingerprint: string;
}

interface EniaState extends EniaSignals {
  trackedPlanUrl: string;
  planFingerprint: string;
  lastCheck: string;
  lastResult: 'baseline' | 'sin-cambios' | 'cambio-detectado';
}

interface EniaInventorySource {
  fuente: { url: string };
}

function hash(content: string | Uint8Array): string {
  return createHash('sha256').update(content).digest('hex');
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function detectEniaSignals(html: string, pageUrl = PAGE_URL): EniaSignals {
  const $ = cheerio.load(html);
  $('script, style, noscript, svg').remove();

  const strategyPeriods = new Set<string>();
  const relevantLinks = new Set<string>();
  const planUrls = new Set<string>();
  const relevantText = new Set<string>();
  const relevantPattern = /\b(enia|estrategia nacional.{0,40}inteligencia artificial|plan de acci[oó]n)\b/i;

  const pageText = normalizeText($('body').text());
  for (const match of pageText.matchAll(/\b(20\d{2})\s*[-–]\s*(20\d{2})\b/g)) {
    const period = `${match[1]}-${match[2]}`;
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (start >= 2020 && end >= start && end <= 2099) strategyPeriods.add(period);
  }

  $('a[href]').each((_index, element) => {
    const anchor = $(element);
    const href = anchor.attr('href');
    if (!href) return;
    const label = normalizeText(anchor.text());
    let absolute: string;
    try {
      absolute = new URL(href, pageUrl).toString();
    } catch {
      return;
    }
    const searchable = `${label} ${absolute}`;
    if (!relevantPattern.test(searchable)) return;
    relevantLinks.add(`${label || '(sin etiqueta)'} | ${absolute}`);
    if (/plan.{0,30}acci|Plan%20de%20Acci/i.test(searchable)) {
      planUrls.add(absolute);
    }
  });

  $('main p, main li, article p, article li, .region-content p, .region-content li')
    .each((_index, element) => {
      const text = normalizeText($(element).text());
      if (text && relevantPattern.test(text)) relevantText.add(text.slice(0, 1200));
    });

  const stable = {
    strategyPeriods: [...strategyPeriods].sort(),
    planUrls: [...planUrls].sort(),
    relevantLinks: [...relevantLinks].sort(),
    relevantText: [...relevantText].sort(),
  };

  return {
    ...stable,
    pageFingerprint: hash(JSON.stringify(stable)),
  };
}

function loadState(): EniaState | null {
  if (!existsSync(STATE_PATH)) return null;
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8')) as EniaState;
  } catch {
    return null;
  }
}

function saveState(state: EniaState): void {
  mkdirSync(dirname(STATE_PATH), { recursive: true });
  writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
}

function loadTrackedPlanUrl(): string {
  const inventory = JSON.parse(
    readFileSync(INVENTORY_PATH, 'utf8'),
  ) as EniaInventorySource;
  return inventory.fuente.url;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
      'Accept-Language': 'es-CR,es;q=0.9,en;q=0.7',
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${url}`);
  return response.text();
}

async function fetchBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/pdf,*/*;q=0.8' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${url}`);
  return new Uint8Array(await response.arrayBuffer());
}

async function notifyTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('[enia-watch] Telegram no configurado; el cambio queda en el estado del watcher.');
    return;
  }
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: false,
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    console.warn(`[enia-watch] Telegram HTTP ${response.status}: ${await response.text()}`);
  }
}

async function main(): Promise<void> {
  const trackedPlanUrl = loadTrackedPlanUrl();
  console.log(`[enia-watch] revisando ${PAGE_URL}`);

  const [html, planBytes] = await Promise.all([
    fetchText(PAGE_URL),
    fetchBytes(trackedPlanUrl),
  ]);
  const signals = detectEniaSignals(html);
  const planFingerprint = hash(planBytes);
  const now = new Date().toISOString();
  const previous = loadState();

  if (!previous) {
    saveState({
      ...signals,
      trackedPlanUrl,
      planFingerprint,
      lastCheck: now,
      lastResult: 'baseline',
    });
    console.log('[enia-watch] línea base creada; no se envía alerta inicial');
    return;
  }

  const changes = [
    previous.pageFingerprint !== signals.pageFingerprint
      ? 'Cambió el contenido o la lista de enlaces ENIA relevantes en MICITT.'
      : null,
    previous.planFingerprint !== planFingerprint
      ? 'Cambió la huella del PDF del Plan de Acción actualmente inventariado.'
      : null,
    previous.trackedPlanUrl !== trackedPlanUrl
      ? 'Cambió la URL del Plan de Acción configurada en el inventario.'
      : null,
  ].filter((value): value is string => value !== null);

  const lastResult = changes.length > 0 ? 'cambio-detectado' : 'sin-cambios';
  saveState({
    ...signals,
    trackedPlanUrl,
    planFingerprint,
    lastCheck: now,
    lastResult,
  });

  if (changes.length === 0) {
    console.log('[enia-watch] sin señales de cambio; la revisión editorial pública no se actualiza automáticamente');
    return;
  }

  const message = [
    '⚠️ *Señal de cambio en ENIA / Plan de Acción*',
    '',
    ...changes.map((change) => `• ${change}`),
    '',
    `Página oficial: ${PAGE_URL}`,
    `Plan monitoreado: ${trackedPlanUrl}`,
    '',
    'Acción: comparar las fuentes, determinar si cambió una versión o solo la presentación y registrar la revisión editorial. Esta alerta no modifica el catálogo ni prueba ejecución de ninguna intervención.',
  ].join('\n');
  await notifyTelegram(message);
}

const isDirectInvocation =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectInvocation) {
  main().catch((error) => {
    console.error(`[enia-watch] ${(error as Error).message}`);
    process.exit(1);
  });
}
