/**
 * Monitor mensual del ILIA (Índice Latinoamericano de Inteligencia Artificial,
 * publicado anualmente por CENIA Chile en https://indicelatam.cl/).
 *
 * Cadencia histórica de publicación:
 *   - ILIA 2023: agosto 2023 (primera edición)
 *   - ILIA 2024: septiembre 2024 (presentado en CEPAL)
 *   - ILIA 2025: octubre 2025 (edición vigente al 2026-05)
 *   - ILIA 2026: estimado sept-oct 2026
 *
 * No es un scraper de catálogo — el ILIA tiene su propio dataset
 * (`indicadores.json` → `ilia2025`, `comparativaRegional`) que requiere
 * actualización editorial manual cuando salga la nueva edición. Este
 * script SOLO detecta la señal de publicación y avisa por Telegram para
 * que Mario / el agente actualicen `indicadores.json` a mano.
 *
 * Señales monitoreadas:
 *   1. Año máximo encontrado en el HTML home (patrones "ILIA 20XX",
 *      "Índice Latinoamericano de inteligencia artificial 20XX",
 *      "Documento_ILIA_20XX.pdf").
 *   2. URL del PDF principal (cambia cuando entra una nueva edición).
 *
 * Estado persistido en `scraper-runs/ilia-state.json`:
 *   { year: 2025, pdfUrl: '...', lastCheck: '2026-05-06T...' }
 *
 * Si el año detectado > year almacenado → alerta. Si solo cambió la URL
 * del PDF dentro del mismo año (ej: corrección editorial), también
 * alerta pero con tono más suave.
 *
 * Correr local: `npm run watch:ilia`
 * Programado: `.github/workflows/ilia-watch.yml` (cron mensual día 1 12 UTC).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const HOME_URL = 'https://indicelatam.cl/';
const STATE_PATH = join(process.cwd(), 'scraper-runs', 'ilia-state.json');
const USER_AGENT = 'observatorio-ia-bot/1.0 (+https://observatorioia.org)';
const FETCH_TIMEOUT_MS = 20000;

interface IliaState {
  year: number;
  pdfUrl: string | null;
  lastCheck: string;
}

interface Detection {
  year: number;
  pdfUrl: string | null;
}

function loadState(): IliaState | null {
  if (!existsSync(STATE_PATH)) return null;
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8')) as IliaState;
  } catch {
    return null;
  }
}

function saveState(state: IliaState): void {
  mkdirSync(dirname(STATE_PATH), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
}

async function fetchHome(): Promise<string> {
  const res = await fetch(HOME_URL, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${HOME_URL}`);
  return res.text();
}

/**
 * Extrae el año máximo asociado al ILIA en el HTML.
 *
 * Mira tres patrones — todos requieren la marca "ILIA" o
 * "Índice Latinoamericano de inteligencia artificial" cerca del año, para
 * evitar falsos positivos de años sueltos en el footer/copyright.
 */
function detect(html: string): Detection {
  const years = new Set<number>();
  let pdfUrl: string | null = null;

  const patterns: RegExp[] = [
    /ILIA\s*(20\d{2})/gi,
    /[ÍI]ndice\s+Latinoamericano\s+de\s+[Ii]nteligencia\s+[Aa]rtificial[^<]{0,40}(20\d{2})/gi,
    /Documento_ILIA_(20\d{2})\.pdf/gi,
  ];

  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const y = Number(m[1]);
      if (Number.isFinite(y) && y >= 2023 && y <= 2099) {
        years.add(y);
      }
    }
  }

  // Buscar URL del PDF principal (la del año máximo si hay varias)
  const pdfMatches = Array.from(html.matchAll(/https?:\/\/[^"'\s>]+Documento_ILIA_(20\d{2})\.pdf/gi));
  if (pdfMatches.length > 0) {
    pdfMatches.sort((a, b) => Number(b[1]) - Number(a[1]));
    pdfUrl = pdfMatches[0][0];
  }

  const year = years.size > 0 ? Math.max(...years) : 0;
  return { year, pdfUrl };
}

async function notifyTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('  ilia-watch: TELEGRAM_BOT_TOKEN/CHAT_ID no configurados — skip notify (cambio sigue persistido en estado).');
    return;
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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
  if (!res.ok) {
    const body = await res.text();
    console.warn(`  ilia-watch: Telegram HTTP ${res.status} ${body}`);
  } else {
    console.log('  ✓ Telegram notificado');
  }
}

async function main(): Promise<void> {
  console.log(`[ilia-watch] fetching ${HOME_URL}`);
  let html: string;
  try {
    html = await fetchHome();
  } catch (err) {
    console.error(`[ilia-watch] fetch falló: ${(err as Error).message}`);
    process.exit(1);
  }

  const detection = detect(html);
  const now = new Date().toISOString();
  console.log(`[ilia-watch] detectado año=${detection.year || 'NONE'} pdf=${detection.pdfUrl ?? 'NONE'}`);

  if (detection.year === 0) {
    console.warn('[ilia-watch] sin señal del año del ILIA en el HTML — posible cambio de estructura del sitio. Revisar manualmente.');
    process.exit(0);
  }

  const previous = loadState();

  if (!previous) {
    saveState({ year: detection.year, pdfUrl: detection.pdfUrl, lastCheck: now });
    console.log('[ilia-watch] estado inicial creado, sin alerta');
    return;
  }

  const yearChanged = detection.year > previous.year;
  const pdfChangedSameYear = !yearChanged && detection.pdfUrl !== null && detection.pdfUrl !== previous.pdfUrl;

  if (yearChanged) {
    const lines = [
      `🆕 *ILIA ${detection.year} publicado*`,
      '',
      `El CENIA publicó la nueva edición del Índice Latinoamericano de IA.`,
      `Edición anterior cargada en el observatorio: ILIA ${previous.year}.`,
      '',
      `📄 PDF: ${detection.pdfUrl ?? '(no detectado)'}`,
      `🔗 ${HOME_URL}`,
      '',
      `Acción: actualizar manualmente \`src/data/json/indicadores.json\` con los nuevos rankings y comparativa regional. El catálogo del observatorio no se autoactualiza con el ILIA porque requiere lectura editorial.`,
    ];
    await notifyTelegram(lines.join('\n'));
    saveState({ year: detection.year, pdfUrl: detection.pdfUrl, lastCheck: now });
  } else if (pdfChangedSameYear) {
    const lines = [
      `⚠️ *ILIA ${detection.year}: PDF cambió*`,
      '',
      `Misma edición (${detection.year}) pero la URL del PDF principal cambió.`,
      `Antes: ${previous.pdfUrl ?? '(none)'}`,
      `Ahora: ${detection.pdfUrl}`,
      '',
      `Posible corrección/erratum editorial. Revisar diferencias antes de tocar el catálogo.`,
    ];
    await notifyTelegram(lines.join('\n'));
    saveState({ year: detection.year, pdfUrl: detection.pdfUrl, lastCheck: now });
  } else {
    saveState({ ...previous, lastCheck: now });
    console.log(`[ilia-watch] sin cambios (sigue en ILIA ${detection.year})`);
  }
}

main().catch((err) => {
  console.error('[ilia-watch] error inesperado:', err);
  process.exit(1);
});
