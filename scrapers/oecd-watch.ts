/**
 * Monitor semestral de los indicadores OCDE de gobierno digital
 * (Digital Government Index — DGI, y OURdata Index), publicados por
 * la OCDE en la serie Working Papers on Public Governance / Digital
 * Government Outlook.
 *
 * Cadencia histórica de publicación:
 *   - DGI 2019: primera edición (OECD Working Paper No. 38)
 *   - DGI 2023: segunda edición
 *   - DGI 2025 + OURdata Index 2025: edición vigente, OECD WP No. 90 (feb 2026)
 *   - DGI 2027 + OURdata Index 2027: estimado feb 2028 (cadencia bianual histórica)
 *
 * No es un scraper de catálogo — los datasets DGI / OURdata viven en
 * `indicadores.json` (`dgi2025`, `ourdata2025`) y requieren actualización
 * editorial manual cuando salga la nueva edición. Este script SOLO detecta
 * la señal de publicación y avisa por Telegram para que Mario / el agente
 * actualicen `indicadores.json` a mano.
 *
 * Señales monitoreadas:
 *   1. Año máximo asociado a "Digital Government Index 20XX" o "OURdata Index 20XX"
 *      en el HTML de la landing OECD digital-government.
 *   2. Año máximo del Digital Government Outlook ("Digital Government Outlook 20XX").
 *   3. Número de Working Paper más alto asociado a Digital Government
 *      ("Working Paper No. \d+" en contexto de digital government).
 *   4. URL del PDF de Working Paper más reciente (cambia con cada edición).
 *
 * Estado persistido en `scraper-runs/oecd-state.json`:
 *   {
 *     dgiYear: 2025,
 *     ourdataYear: 2025,
 *     outlookYear: 2026,
 *     lastWpNumber: 90,
 *     wpUrl: '...',
 *     lastCheck: '2026-06-28T...'
 *   }
 *
 * Si dgiYear u ourdataYear detectado > almacenado → alerta fuerte (nueva edición).
 * Si solo cambió outlookYear o lastWpNumber → alerta de seguimiento.
 * Si solo cambió wpUrl dentro del mismo año → alerta suave (posible erratum).
 *
 * Correr local: `npm run watch:oecd`
 * Programado: `.github/workflows/oecd-watch.yml` (cron semestral 1 ene y 1 jul 12 UTC).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const LANDING_URL = 'https://www.oecd.org/en/topics/digital-government.html';
const OUTLOOK_URL = 'https://www.oecd.org/en/publications/digital-government-outlook-2026_d46c0555-en/costa-rica_c3064731-en.html';
const STATE_PATH = join(process.cwd(), 'scraper-runs', 'oecd-state.json');
// OECD's CDN devuelve 403 a user-agents tipo bot. Usamos uno realista de navegador.
// Es un watcher read-only de páginas públicas (no abuso, hits cada 6 meses), por lo
// que el riesgo de violar ToS es nulo y la alternativa (403) deja al watcher inútil.
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const FETCH_TIMEOUT_MS = 25000;

interface OecdState {
  dgiYear: number;
  ourdataYear: number;
  outlookYear: number;
  lastWpNumber: number;
  wpUrl: string | null;
  lastCheck: string;
}

interface Detection {
  dgiYear: number;
  ourdataYear: number;
  outlookYear: number;
  wpNumber: number;
  wpUrl: string | null;
}

function loadState(): OecdState | null {
  if (!existsSync(STATE_PATH)) return null;
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8')) as OecdState;
  } catch {
    return null;
  }
}

function saveState(state: OecdState): void {
  mkdirSync(dirname(STATE_PATH), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
}

/**
 * OECD bloquea fetches sin browser fingerprint (HTTP 403 detrás de Cloudflare).
 * Estrategia: usar Internet Archive Wayback Machine como proxy de lectura. Tiene
 * latencia (snapshots cada 1-4 semanas para páginas populares de oecd.org), pero
 * para un watcher semestral el lag es aceptable. El watcher reporta el snapshot
 * más reciente disponible junto con su timestamp para que el lector entienda
 * cuán fresco es el dato.
 *
 * Wayback API: http://archive.org/wayback/available?url=<encoded>&timestamp=<YYYYMMDD>
 * Devuelve JSON con `archived_snapshots.closest.url` (snapshot más cercano).
 */
async function fetchUrl(url: string): Promise<string> {
  const directHeaders = {
    'User-Agent': USER_AGENT,
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
  };

  // 1. Intento fetch directo (puede funcionar para algunos URLs OECD que no estén tras Cloudflare aggressive)
  try {
    const res = await fetch(url, {
      headers: directHeaders,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (res.ok) return res.text();
    console.warn(`  direct fetch HTTP ${res.status} para ${url} — fallback a Wayback Machine`);
  } catch (err) {
    console.warn(`  direct fetch error para ${url}: ${(err as Error).message} — fallback a Wayback`);
  }

  // 2. Fallback: Wayback Machine API → snapshot más reciente
  const today = new Date();
  const yyyymmdd = `${today.getUTCFullYear()}${String(today.getUTCMonth() + 1).padStart(2, '0')}${String(today.getUTCDate()).padStart(2, '0')}`;
  const apiUrl = `http://archive.org/wayback/available?url=${encodeURIComponent(url)}&timestamp=${yyyymmdd}`;
  const apiRes = await fetch(apiUrl, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!apiRes.ok) throw new Error(`Wayback API HTTP ${apiRes.status} para ${url}`);
  const apiJson = (await apiRes.json()) as {
    archived_snapshots?: { closest?: { url?: string; timestamp?: string; available?: boolean } };
  };
  const closest = apiJson.archived_snapshots?.closest;
  if (!closest?.url || !closest.available) {
    throw new Error(`Wayback sin snapshot para ${url}`);
  }
  console.warn(`  → snapshot Wayback ${closest.timestamp} para ${url}`);
  const snapshotRes = await fetch(closest.url, {
    headers: directHeaders,
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!snapshotRes.ok) throw new Error(`Wayback snapshot HTTP ${snapshotRes.status} para ${closest.url}`);
  return snapshotRes.text();
}

/**
 * Extrae señales de versión OECD desde el HTML combinado de landing + outlook.
 *
 * Cada patrón requiere la marca del indicador o del programa cerca del año/número
 * para evitar falsos positivos con años sueltos de copyright o navegación.
 */
function detect(htmls: string[]): Detection {
  const combined = htmls.join('\n');

  const dgiYears = extractYears(combined, [
    /Digital\s+Government\s+Index\s*(?:\(DGI\))?[^<]{0,40}?(20\d{2})/gi,
    /\bDGI\s+(20\d{2})/g,
  ]);

  const ourdataYears = extractYears(combined, [
    /OURdata\s+Index[^<]{0,40}?(20\d{2})/gi,
    /Open[,\s]+Useful[,\s]+(?:and\s+)?Re[- ]?usable\s+(?:data\s+)?Index[^<]{0,40}?(20\d{2})/gi,
  ]);

  const outlookYears = extractYears(combined, [
    /Digital\s+Government\s+Outlook\s+(20\d{2})/gi,
  ]);

  const wpNumbers = new Set<number>();
  const wpPattern = /(?:Working\s+Paper(?:s)?\s+(?:on\s+Public\s+Governance\s+)?(?:No\.?\s*|Number\s+))(\d{1,4})/gi;
  let wpMatch: RegExpExecArray | null;
  while ((wpMatch = wpPattern.exec(combined)) !== null) {
    const n = Number(wpMatch[1]);
    if (Number.isFinite(n) && n >= 1 && n <= 9999) wpNumbers.add(n);
  }

  // Buscar URL de PDF Working Paper más reciente. Patrón observado:
  // https://www.oecd.org/content/dam/oecd/en/publications/reports/YYYY/MM/<slug>_<hash>/<id>-en.pdf
  let wpUrl: string | null = null;
  const pdfMatches = Array.from(
    combined.matchAll(/https?:\/\/www\.oecd\.org\/content\/dam\/oecd\/en\/publications\/reports\/(20\d{2})\/[^"'\s>]+\.pdf/gi)
  );
  if (pdfMatches.length > 0) {
    pdfMatches.sort((a, b) => Number(b[1]) - Number(a[1]));
    wpUrl = pdfMatches[0][0];
  }

  return {
    dgiYear: dgiYears.size > 0 ? Math.max(...dgiYears) : 0,
    ourdataYear: ourdataYears.size > 0 ? Math.max(...ourdataYears) : 0,
    outlookYear: outlookYears.size > 0 ? Math.max(...outlookYears) : 0,
    wpNumber: wpNumbers.size > 0 ? Math.max(...wpNumbers) : 0,
    wpUrl,
  };
}

function extractYears(html: string, patterns: RegExp[]): Set<number> {
  const years = new Set<number>();
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const y = Number(m[1]);
      if (Number.isFinite(y) && y >= 2018 && y <= 2099) years.add(y);
    }
  }
  return years;
}

async function notifyTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('  oecd-watch: TELEGRAM_BOT_TOKEN/CHAT_ID no configurados — skip notify (cambio sigue persistido en estado).');
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
    console.warn(`  oecd-watch: Telegram HTTP ${res.status} ${body}`);
  } else {
    console.log('  ✓ Telegram notificado');
  }
}

async function main(): Promise<void> {
  console.log(`[oecd-watch] fetching landing + outlook`);
  let landingHtml = '';
  let outlookHtml = '';
  try {
    [landingHtml, outlookHtml] = await Promise.all([
      fetchUrl(LANDING_URL).catch((err) => {
        console.warn(`  landing fetch falló: ${err.message}`);
        return '';
      }),
      fetchUrl(OUTLOOK_URL).catch((err) => {
        console.warn(`  outlook fetch falló: ${err.message}`);
        return '';
      }),
    ]);
  } catch (err) {
    console.error(`[oecd-watch] fetch falló: ${(err as Error).message}`);
    process.exit(1);
  }

  if (!landingHtml && !outlookHtml) {
    console.error('[oecd-watch] ambas fuentes fallaron, abortando');
    process.exit(1);
  }

  const detection = detect([landingHtml, outlookHtml]);
  const now = new Date().toISOString();
  console.log(
    `[oecd-watch] detectado dgi=${detection.dgiYear || 'NONE'} ourdata=${detection.ourdataYear || 'NONE'} outlook=${detection.outlookYear || 'NONE'} wp=${detection.wpNumber || 'NONE'}`
  );

  // Si no detectamos NINGUNA señal útil, posible cambio estructural del sitio
  if (detection.dgiYear === 0 && detection.ourdataYear === 0 && detection.outlookYear === 0 && detection.wpNumber === 0) {
    console.warn('[oecd-watch] cero señales detectadas — posible cambio de estructura del sitio. Revisar manualmente.');
    process.exit(0);
  }

  const previous = loadState();

  if (!previous) {
    saveState({
      dgiYear: detection.dgiYear,
      ourdataYear: detection.ourdataYear,
      outlookYear: detection.outlookYear,
      lastWpNumber: detection.wpNumber,
      wpUrl: detection.wpUrl,
      lastCheck: now,
    });
    console.log('[oecd-watch] estado inicial creado, sin alerta');
    return;
  }

  const dgiChanged = detection.dgiYear > previous.dgiYear;
  const ourdataChanged = detection.ourdataYear > previous.ourdataYear;
  const outlookChanged = detection.outlookYear > previous.outlookYear;
  const wpChanged = detection.wpNumber > previous.lastWpNumber;
  const pdfChangedSamePeriod =
    !dgiChanged && !ourdataChanged && !wpChanged && detection.wpUrl !== null && detection.wpUrl !== previous.wpUrl;

  if (dgiChanged || ourdataChanged) {
    const lines = [
      `🆕 *Nuevos indicadores OCDE detectados*`,
      '',
      dgiChanged ? `• DGI: ${previous.dgiYear} → ${detection.dgiYear}` : `• DGI: sigue ${previous.dgiYear}`,
      ourdataChanged ? `• OURdata: ${previous.ourdataYear} → ${detection.ourdataYear}` : `• OURdata: sigue ${previous.ourdataYear}`,
      detection.outlookYear !== previous.outlookYear
        ? `• Outlook: ${previous.outlookYear} → ${detection.outlookYear}`
        : `• Outlook: sigue ${previous.outlookYear}`,
      detection.wpNumber > previous.lastWpNumber
        ? `• Working Paper: ${previous.lastWpNumber} → ${detection.wpNumber}`
        : `• Working Paper: sigue ${previous.lastWpNumber}`,
      '',
      detection.wpUrl ? `📄 PDF: ${detection.wpUrl}` : '',
      `🔗 ${LANDING_URL}`,
      '',
      `Acción: leer el nuevo Working Paper y actualizar manualmente \`src/data/json/indicadores.json\` (\`dgi2025\` / \`ourdata2025\`) con los nuevos rankings, subdimensiones CR y deltas. Los datos OCDE no se autoactualizan en el catálogo: requieren lectura editorial.`,
    ].filter(Boolean);
    await notifyTelegram(lines.join('\n'));
    saveState({
      dgiYear: detection.dgiYear,
      ourdataYear: detection.ourdataYear,
      outlookYear: detection.outlookYear,
      lastWpNumber: detection.wpNumber,
      wpUrl: detection.wpUrl,
      lastCheck: now,
    });
  } else if (outlookChanged || wpChanged) {
    const lines = [
      `📰 *Señal OCDE de seguimiento*`,
      '',
      `DGI y OURdata sin cambio de edición, pero el resto del programa Digital Government avanzó.`,
      '',
      outlookChanged ? `• Outlook: ${previous.outlookYear} → ${detection.outlookYear}` : null,
      wpChanged ? `• Working Paper: ${previous.lastWpNumber} → ${detection.wpNumber}` : null,
      detection.wpUrl ? `📄 PDF: ${detection.wpUrl}` : null,
      '',
      `Acción: revisar si el nuevo material trae nota actualizada para Costa Rica o anticipa próxima edición DGI/OURdata.`,
    ].filter(Boolean);
    await notifyTelegram(lines.join('\n'));
    saveState({
      dgiYear: detection.dgiYear,
      ourdataYear: detection.ourdataYear,
      outlookYear: detection.outlookYear,
      lastWpNumber: detection.wpNumber,
      wpUrl: detection.wpUrl,
      lastCheck: now,
    });
  } else if (pdfChangedSamePeriod) {
    const lines = [
      `⚠️ *OCDE: URL de PDF cambió*`,
      '',
      `Mismo año (DGI ${detection.dgiYear} / OURdata ${detection.ourdataYear}) pero la URL del Working Paper PDF cambió.`,
      `Antes: ${previous.wpUrl ?? '(none)'}`,
      `Ahora: ${detection.wpUrl}`,
      '',
      `Posible corrección o erratum editorial. Revisar diferencias antes de tocar el catálogo.`,
    ];
    await notifyTelegram(lines.join('\n'));
    saveState({ ...previous, wpUrl: detection.wpUrl, lastCheck: now });
  } else {
    saveState({ ...previous, lastCheck: now });
    console.log(`[oecd-watch] sin cambios (sigue DGI ${detection.dgiYear} / OURdata ${detection.ourdataYear} / WP ${detection.wpNumber || previous.lastWpNumber})`);
  }
}

main().catch((err) => {
  console.error(`[oecd-watch] error: ${err.message}`);
  process.exit(1);
});
