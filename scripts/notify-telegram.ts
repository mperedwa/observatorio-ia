/**
 * Notifica vía Telegram el resumen del último scrape run.
 *
 * Política de notificación (filtro D del plan):
 *   - Notifica si: ≥1 candidato con score ≥7  O  algún cambio aplicado al JSON
 *   - Skip silencioso si: todo es ruido/baja relevancia y sin cambios
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

interface AppliedChange {
  applied: boolean;
  dataset: string;
  id: string;
  field?: string;
  before?: unknown;
  after: unknown;
}

interface Consolidated {
  ranAt: string;
  classifierUsed: boolean;
  classifiedCandidates: ClassifiedCandidate[];
  appliedChanges: AppliedChange[];
  validationOk: boolean;
}

const SCORE_THRESHOLD = 7;

function shouldNotify(report: Consolidated): { notify: boolean; reason: string } {
  const appliedCount = report.appliedChanges.filter((c) => c.applied).length;
  if (appliedCount > 0) {
    return { notify: true, reason: `${appliedCount} cambio(s) aplicado(s) al JSON` };
  }
  const high = report.classifiedCandidates.filter(
    (c) => c.classification && c.classification.score >= SCORE_THRESHOLD,
  );
  if (high.length > 0) {
    return { notify: true, reason: `${high.length} candidato(s) con score ≥${SCORE_THRESHOLD}` };
  }
  return { notify: false, reason: 'sin cambios JSON y todos los candidatos con score <7' };
}

function escapeMarkdown(s: string): string {
  // Telegram MarkdownV2 escape — solo los caracteres más comunes que aparecen en nuestros datos
  return s.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

function buildMessage(report: Consolidated): string {
  const fechaCR = new Date(report.ranAt).toLocaleString('es-CR', {
    timeZone: 'America/Costa_Rica',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const applied = report.appliedChanges.filter((c) => c.applied);
  const high = report.classifiedCandidates.filter(
    (c) => c.classification && c.classification.score >= SCORE_THRESHOLD,
  );
  const medium = report.classifiedCandidates.filter(
    (c) => c.classification && c.classification.score >= 5 && c.classification.score < SCORE_THRESHOLD,
  );

  const lines: string[] = [];
  lines.push(`🔔 *Observatorio IA — scrape ${escapeMarkdown(fechaCR)}*`);
  lines.push('');

  if (applied.length > 0) {
    lines.push(`*✅ ${applied.length} cambio\\(s\\) aplicado\\(s\\) al JSON*`);
    for (const c of applied.slice(0, 5)) {
      const before = c.before !== undefined ? `${escapeMarkdown(String(c.before))} → ` : '';
      lines.push(`• \`${escapeMarkdown(c.dataset)}/${escapeMarkdown(c.id)}\`${c.field ? ` · ${escapeMarkdown(c.field)}` : ''}: ${before}${escapeMarkdown(String(c.after))}`);
    }
    lines.push('');
  }

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
  const { notify, reason } = shouldNotify(report);
  console.log(`notify-telegram: ${notify ? 'ENVIANDO' : 'skip'} (${reason})`);

  if (!notify) return;

  const message = buildMessage(report);
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
