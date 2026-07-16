import { chromium, type Browser, type Page } from 'playwright';
import * as cheerio from 'cheerio';

export interface FetchHtmlOpts {
  /** User-Agent para fetch directo (fallback). */
  userAgent?: string;
  /** Timeout en ms. */
  timeout?: number;
  /** Esperar selector antes de leer HTML (Playwright only). */
  waitFor?: string;
}

const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = chromium.launch({ headless: true });
  }
  return browserPromise;
}

export async function closeBrowser(): Promise<void> {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}

/** Fetch directo con Node fetch + headers de browser. Sin JS render. Rápido. */
export async function fetchStatic(url: string, opts: FetchHtmlOpts = {}): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': opts.userAgent ?? DEFAULT_UA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-CR,es;q=0.9,en;q=0.8',
    },
    signal: AbortSignal.timeout(opts.timeout ?? 15000),
  });
  if (!res.ok) {
    throw new Error(`fetch ${url} -> ${res.status}`);
  }
  return res.text();
}

/** Fetch con Playwright headless. Para sitios que requieren JS. */
export async function fetchWithBrowser(url: string, opts: FetchHtmlOpts = {}): Promise<string> {
  const browser = await getBrowser();
  const page: Page = await browser.newPage({
    userAgent: opts.userAgent ?? DEFAULT_UA,
  });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: opts.timeout ?? 30000 });
    if (opts.waitFor) {
      await page.waitForSelector(opts.waitFor, { timeout: opts.timeout ?? 10000 });
    }
    return await page.content();
  } finally {
    await page.close();
  }
}

/**
 * Resuelve un enlace ofuscado de Google News (`news.google.com/rss/articles/…`)
 * a la URL real del medio. Google ya no permite decodificar el token ni seguir
 * el redirect por HTTP (usa redirect por JS), así que hay que cargar la página
 * en un navegador y esperar a que la URL salga del dominio de Google.
 *
 * Por qué importa: el clasificador puntúa con la URL/medio real (mejor juicio de
 * fuente primaria vs prensa), el ledger de decisiones guarda una firma de URL
 * ESTABLE (el link de Google cambia cada semana para la misma nota), y el
 * analista recibe la URL real sin resolverla a mano.
 *
 * NUNCA rompe el scrape: cualquier fallo o no-resolución devuelve la URL
 * original. URLs que no son de Google News se devuelven tal cual.
 */
export async function resolveGoogleNewsUrl(
  url: string,
  opts: { timeout?: number } = {},
): Promise<string> {
  if (!url || !url.includes('news.google.com')) return url;
  let page: Page | null = null;
  try {
    const browser = await getBrowser();
    page = await browser.newPage({ userAgent: DEFAULT_UA });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: opts.timeout ?? 22000 });
    await page
      .waitForURL((u: URL) => !u.href.includes('news.google.com'), {
        timeout: opts.timeout ?? 12000,
      })
      .catch(() => {});
    const final = page.url();
    return final.includes('news.google.com') ? url : final;
  } catch {
    return url; // fallback: nunca romper el scrape por un link que no resuelve
  } finally {
    if (page) await page.close().catch(() => {});
  }
}

export function load(html: string): cheerio.CheerioAPI {
  return cheerio.load(html);
}

/** Helpers comunes para filtrar contenido relacionado a IA. */
// Substrings: ok matchear como parte de palabra ("algoritmo" → "algoritm").
const IA_KEYWORDS_SUBSTRING = [
  'inteligencia artificial',
  'machine learning',
  'aprendizaje automático',
  'algoritm',
  'chatbot',
  'asistente virtual',
  'modelo predictivo',
  'predicción',
  'aprendizaje profundo',
  'red neuronal',
];

// Acrónimos: solo matchean como palabra completa para evitar falsos positivos
// ("IA" no debe matchear "judic**ia**les", "AI" no debe matchear "p**ai**s").
const IA_KEYWORDS_WORD = ['IA', 'AI', 'ENIA', 'LINC'];

export function mentionsAI(text: string): boolean {
  const lower = text.toLowerCase();
  if (IA_KEYWORDS_SUBSTRING.some((k) => lower.includes(k.toLowerCase()))) return true;
  for (const k of IA_KEYWORDS_WORD) {
    const re = new RegExp(`\\b${k}\\b`, 'i');
    if (re.test(text)) return true;
  }
  return false;
}
