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

export function load(html: string): cheerio.CheerioAPI {
  return cheerio.load(html);
}

/** Helpers comunes para filtrar contenido relacionado a IA. */
const IA_KEYWORDS = [
  'inteligencia artificial',
  'IA',
  'AI',
  'machine learning',
  'aprendizaje automático',
  'ENIA',
  'LINC',
  'algoritmo',
  'algoritm',
  'chatbot',
  'asistente virtual',
  'predict',
  'modelo predictivo',
];

export function mentionsAI(text: string): boolean {
  const lower = text.toLowerCase();
  return IA_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}
