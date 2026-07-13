/**
 * Notifica vía Telegram el resumen del último scrape run.
 *
 * Política de notificación:
 *   - Notifica si: ≥1 candidato con score ≥7 (no ya catalogado)
 *   - Skip silencioso si: todo es ruido/baja relevancia
 *
 * Lee `scraper-runs/last-run.json` producido por scrapers/run-all.ts.
 *
 * Requiere env:
 *   - TELEGRAM_BOT_TOKEN: token del bot de @BotFather
 *   - TELEGRAM_CHAT_ID:   chat ID del receptor (privado)
 *
 * Si alguno de los dos falta, exit 0 silencioso (no rompe el workflow).
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const REPORT_PATH = join(ROOT, 'scraper-runs', 'last-run.json');
const CLASSIFICATION_PATH = join(ROOT, 'scraper-runs', 'classification.json');

interface Classification {
  score: number;
  tipo: string;
  resumen: string;
  tags: string[];
}

interface ClassifiedCandidate {
  source: 'micitt' | 'camtic' | 'asamblea';
  candidate: { titulo: string; url: string };
  classification: Classification | null;
}

interface Consolidated {
  ranAt: string;
  classifierUsed: boolean;
  classifiedCandidates: ClassifiedCandidate[];
  validationOk: boolean;
}

/**
 * URLs ya catalogadas (bucket `ya_existe` en classification.json). Se cargan
 * una vez al inicio y se usan para filtrar el listado de alta/media relevancia,
 * para que el mensaje a Telegram no reporte como "candidato nuevo" un item que
 * ya está mapeado en el repo aunque su score sea alto.
 *
 * Si classification.json no existe (ej. classify-vs-repo no corrió), el filtro
 * queda vacío y el comportamiento es idéntico al anterior.
 */
function loadAlreadyMappedUrls(): Set<string> {
  if (!existsSync(CLASSIFICATION_PATH)) return new Set();
  try {
    const c = JSON.parse(readFileSync(CLASSIFICATION_PATH, 'utf8')) as {
      ya_existe?: Array<{ url: string }>;
    };
    return new Set((c.ya_existe ?? []).map((e) => e.url));
  } catch {
    return new Set();
  }
}

const DEFAULT_THRESHOLD = 7;
const SCORE_THRESHOLD = (() => {
  const env = process.env.NOTIFY_SCORE_THRESHOLD?.trim();
  const parsed = env ? Number(env) : NaN;
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 10 ? parsed : DEFAULT_THRESHOLD;
})();

function shouldNotify(
  report: Consolidated,
  alreadyMapped: Set<string>,
): { notify: boolean; reason: string } {
  const high = report.classifiedCandidates.filter(
    (c) =>
      c.classification &&
      c.classification.score >= SCORE_THRESHOLD &&
      !alreadyMapped.has(c.candidate.url),
  );
  if (high.length > 0) {
    return { notify: true, reason: `${high.length} candidato(s) con score ≥${SCORE_THRESHOLD}` };
  }
  return {
    notify: false,
    reason: 'todos los candidatos con score <7 o ya catalogados',
  };
}

function escapeMarkdown(s: string): string {
  // Telegram MarkdownV2 escape — solo los caracteres más comunes que aparecen en nuestros datos
  return s.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

function buildMessage(report: Consolidated, alreadyMapped: Set<string>): string {
  const fechaCR = new Date(report.ranAt).toLocaleString('es-CR', {
    timeZone: 'America/Costa_Rica',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const high = report.classifiedCandidates.filter(
    (c) =>
      c.classification &&
      c.classification.score >= SCORE_THRESHOLD &&
      !alreadyMapped.has(c.candidate.url),
  );
  const medium = report.classifiedCandidates.filter(
    (c) =>
      c.classification &&
      c.classification.score >= 5 &&
      c.classification.score < SCORE_THRESHOLD &&
      !alreadyMapped.has(c.candidate.url),
  );

  const lines: string[] = [];
  lines.push(`🔔 *Observatorio IA — scrape ${escapeMarkdown(fechaCR)}*`);
  lines.push('');

  if (high.length > 0) {
    lines.push(`*🔴 ${high.length} candidato\\(s\\) alta relevancia \\(score ≥${SCORE_THRESHOLD}\\)*`);
    for (const cc of high.slice(0, 5)) {
      const cl = cc.classification!;
      lines.push(
        `• \\[${cl.score}\\] *${escapeMarkdown(cc.candidate.titulo.slice(0, 100))}*`,
      );
      lines.push(`  _${escapeMarkdown(cl.resumen.slice(0, 200))}_`);
      lines.push(`  [${escapeMarkdown(cc.source)}](${cc.candidate.url})`);
    }
    lines.push('');
  }

  if (medium.length > 0) {
    lines.push(`*🟡 ${medium.length} candidato\\(s\\) media relevancia \\(5\\-6\\)*`);
  }

  lines.push('');
  lines.push(`[Ver reporte completo](https://github.com/mperedwa/observatorio-ia/actions)`);

  return lines.join('\n');
}

async function sendTelegram(token: string, chatId: string, text: string): Promise<void> {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram HTTP ${res.status}: ${body}`);
  }
}

async function main(): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    console.log('notify-telegram: TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID ausente, skip silencioso.');
    return;
  }

  if (!existsSync(REPORT_PATH)) {
    console.log(`notify-telegram: no existe ${REPORT_PATH}, skip.`);
    return;
  }

  const report = JSON.parse(readFileSync(REPORT_PATH, 'utf8')) as Consolidated;
  const alreadyMapped = loadAlreadyMappedUrls();
  const { notify, reason } = shouldNotify(report, alreadyMapped);
  console.log(`notify-telegram: ${notify ? 'ENVIANDO' : 'skip'} (${reason})`);

  if (!notify) return;

  const message = buildMessage(report, alreadyMapped);
  try {
    await sendTelegram(token, chatId, message);
    console.log('notify-telegram: mensaje enviado correctamente.');
  } catch (err) {
    console.error('notify-telegram: error enviando mensaje:', (err as Error).message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
