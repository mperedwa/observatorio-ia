/**
 * Notifica vía Telegram el resultado de classify-vs-repo.ts.
 *
 * Lee `scraper-runs/classification.json` y manda:
 *   - 0 nuevos:  mensaje breve "cobertura al día".
 *   - ≥1 nuevo:  lista numerada de candidatos NUEVOS con título, score,
 *                institución y URL + pregunta de GO.
 *
 * Convive con scripts/notify-telegram.ts (que solo notifica de candidatos por
 * score, sin contraste contra el repo). Mensaje deliberadamente compacto para
 * no duplicar info: este es el filtro contra inventario.
 *
 * Requiere env:
 *   - TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID. Si alguno falta: exit 0 silencioso.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CLASSIFICATION_PATH = join(ROOT, 'scraper-runs', 'classification.json');
const TELEGRAM_MAX_LEN = 4000; // safety margin debajo del límite real 4096

interface NuevoEntry {
  titulo: string;
  url: string;
  source: string;
  institucionId: string | null;
  score: number | null;
  resumen: string | null;
  tags: string[];
  reason: string;
}

interface RevisarEntry {
  titulo: string;
  url: string;
  source: string;
  score: number | null;
  matched_type: 'proyecto' | 'recurso' | 'articulo' | null;
  matched_id: string | null;
  reason: string;
}

interface ClassificationFile {
  classifiedAt: string;
  sourceRanAt: string;
  totalDeduped: number;
  totalRaw: number;
  counts: { ya_existe: number; ruido: number; nuevos: number; revisar: number };
  nuevos: NuevoEntry[];
  revisar?: RevisarEntry[];
}

function escapeMd(s: string): string {
  return s.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

function appendRevisarSection(c: ClassificationFile, lines: string[]): void {
  const revisar = c.revisar ?? [];
  if (revisar.length === 0) return;
  lines.push('');
  lines.push(`*🔁 Posibles updates de temas existentes \\(${revisar.length}\\) — revisar manualmente:*`);
  for (let i = 0; i < revisar.length; i += 1) {
    const r = revisar[i];
    const matchedType = r.matched_type ?? 'item';
    const matchedId = r.matched_id ?? '?';
    const score = r.score !== null ? `\\[${r.score}\\] ` : '';
    lines.push(`${i + 1}\\. ${score}*${escapeMd(r.titulo.slice(0, 140))}*`);
    lines.push(`   _vs ${escapeMd(matchedType)} \`${escapeMd(matchedId)}\`_ · ${escapeMd(r.reason.split('.').pop()?.trim() ?? '')}`);
    lines.push(`   [fuente](${r.url})`);
  }
}

function buildZeroNuevosMessage(c: ClassificationFile): string {
  const fecha = new Date(c.classifiedAt).toLocaleString('es-CR', {
    timeZone: 'America/Costa_Rica',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const dedup = c.totalRaw !== c.totalDeduped ? ` \\(${c.totalRaw}→${c.totalDeduped} dedup\\)` : '';
  const revisar = c.counts.revisar ?? 0;
  const lines = [
    `🟢 *Scrape procesado — ${escapeMd(fecha)}*`,
    '',
    `${c.totalDeduped} candidato\\(s\\)${dedup}: *0 NUEVOS*, ${c.counts.ya_existe} ya existen, ${revisar} a revisar, ${c.counts.ruido} ruido\\.`,
  ];
  if (revisar === 0) {
    lines.push('Cobertura al día\\. Sin acción requerida\\.');
  } else {
    lines.push('Cobertura al día sobre items NUEVOS, pero hay updates de items existentes que vale la pena chequear\\.');
    appendRevisarSection(c, lines);
  }
  return lines.join('\n');
}

function buildNuevosMessage(c: ClassificationFile): string {
  const fecha = new Date(c.classifiedAt).toLocaleString('es-CR', {
    timeZone: 'America/Costa_Rica',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const lines: string[] = [];
  lines.push(`🆕 *Scrape procesado — ${escapeMd(fecha)}*`);
  lines.push('');
  lines.push(
    `${c.totalDeduped} candidato\\(s\\): *${c.counts.nuevos} NUEVO\\(s\\)*, ${c.counts.ya_existe} ya existen, ${c.counts.ruido} ruido\\.`,
  );
  lines.push('');
  lines.push('*Nuevos detectados — requieren tu GO antes de agregar al repo:*');
  lines.push('');

  const max = c.nuevos.length;
  for (let i = 0; i < max; i += 1) {
    const n = c.nuevos[i];
    const idx = i + 1;
    const score = n.score !== null ? `\\[${n.score}\\] ` : '';
    const inst = n.institucionId ? ` · _${escapeMd(n.institucionId)}_` : '';
    lines.push(`*${idx}\\.* ${score}*${escapeMd(n.titulo.slice(0, 160))}*${inst}`);
    if (n.resumen) {
      lines.push(`   _${escapeMd(n.resumen.slice(0, 200))}_`);
    }
    lines.push(`   [fuente](${n.url})`);
    lines.push('');
    // truncar si nos pasamos del límite
    if (lines.join('\n').length > TELEGRAM_MAX_LEN - 400) {
      lines.push(`_\\(${c.nuevos.length - idx} más en el artifact\\)_`);
      lines.push('');
      break;
    }
  }

  lines.push(
    '¿Cuáles agrego al repo? Respondé con los números separados por coma \\(ej\\. _1, 3_\\) o _NO_ para descartarlos\\.',
  );
  lines.push(
    `Stub disponible en el artifact \`scraper\\-reports\\-<run\\_id>/stub\\-nuevos\\.json\`\\.`,
  );

  appendRevisarSection(c, lines);

  let msg = lines.join('\n');
  if (msg.length > TELEGRAM_MAX_LEN) {
    msg = msg.slice(0, TELEGRAM_MAX_LEN - 20) + '\n_\\(truncado\\)_';
  }
  return msg;
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
    console.log('notify-classification: secrets ausentes, skip silencioso.');
    return;
  }
  if (!existsSync(CLASSIFICATION_PATH)) {
    console.log(`notify-classification: no existe ${CLASSIFICATION_PATH}, skip.`);
    return;
  }

  const c = JSON.parse(readFileSync(CLASSIFICATION_PATH, 'utf8')) as ClassificationFile;
  const message = c.counts.nuevos === 0 ? buildZeroNuevosMessage(c) : buildNuevosMessage(c);

  try {
    await sendTelegram(token, chatId, message);
    console.log(
      `notify-classification: enviado (${c.counts.nuevos} nuevos / ${c.counts.ya_existe} ya / ${c.counts.ruido} ruido)`,
    );
  } catch (err) {
    console.error('notify-classification: error enviando:', (err as Error).message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
