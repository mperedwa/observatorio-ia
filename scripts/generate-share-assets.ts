/**
 * Generate share assets como PNGs.
 *
 * Lee las rutas estáticas pre-generadas en out/<locale>/comparte/asset/<type>/
 * y captura screenshots en las dimensiones exactas correspondientes.
 *
 * Uso:
 *   npm run build              # genera out/
 *   npm run generate-assets    # captura PNGs en public/comparte-assets/
 *
 * Asume que `out/` existe y contiene las páginas asset/<type>/index.html.
 */

import { chromium, type Browser } from 'playwright';
import { mkdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createServer, type Server } from 'node:http';
import { extname } from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'out');
const PUBLIC_DIR = join(ROOT, 'public', 'comparte-assets');

interface AssetTask {
  locale: 'es' | 'en';
  type: string;
  size: { width: number; height: number };
  filename: string;
}

const SIZES = {
  square: { width: 1080, height: 1080 },
  horizontal: { width: 1200, height: 630 },
  story: { width: 1080, height: 1920 },
} as const;

type SizeKey = keyof typeof SIZES;

function loadSpecs(): Array<{ type: string; size: SizeKey; filename: string }> {
  // Carga el JSON de brechas para construir la lista igual que ASSET_SPECS
  const brechas = JSON.parse(
    readFileSync(join(ROOT, 'src', 'data', 'json', 'brechas.json'), 'utf8'),
  ) as Array<{ id: string }>;

  return [
    { type: 'kpi-hero', size: 'square', filename: 'kpi-hero-1080.png' },
    { type: 'timeline', size: 'square', filename: 'timeline-1080.png' },
    { type: 'ilia', size: 'square', filename: 'ilia-1080.png' },
    { type: 'mapa', size: 'square', filename: 'mapa-1080.png' },
    ...brechas.map((b) => ({
      type: `brecha-${b.id}`,
      size: 'square' as SizeKey,
      filename: `brecha-${b.id}-1080.png`,
    })),
    { type: 'og-home', size: 'horizontal', filename: 'og-home-1200x630.png' },
    { type: 'og-analisis', size: 'horizontal', filename: 'og-analisis-1200x630.png' },
    { type: 'og-brechas', size: 'horizontal', filename: 'og-brechas-1200x630.png' },
    { type: 'story-timeline', size: 'story', filename: 'story-timeline-1080x1920.png' },
    { type: 'story-brecha', size: 'story', filename: 'story-brecha-1080x1920.png' },
  ];
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
};

function startServer(rootDir: string, port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? '/', 'http://localhost');
      let filePath = join(rootDir, decodeURIComponent(url.pathname));
      try {
        // Si la ruta es directorio (URL termina en /), servir su index.html
        if (existsSync(filePath) && statSync(filePath).isDirectory()) {
          const tryIndex = join(filePath, 'index.html');
          if (existsSync(tryIndex)) filePath = tryIndex;
        }
        if (!existsSync(filePath)) {
          // último intento: agregar /index.html sin verificar dir
          const tryIndex = join(filePath, 'index.html');
          if (existsSync(tryIndex)) filePath = tryIndex;
        }
        if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
          res.statusCode = 404;
          res.end('not found');
          return;
        }
        const data = readFileSync(filePath);
        const ext = extname(filePath).toLowerCase();
        res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
        res.end(data);
      } catch (err) {
        res.statusCode = 500;
        res.end((err as Error).message);
      }
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

async function captureAsset(browser: Browser, baseUrl: string, task: AssetTask): Promise<void> {
  const url = `${baseUrl}/${task.locale}/comparte/asset/${task.type}/`;
  const outPath = join(PUBLIC_DIR, task.locale, task.filename);

  const context = await browser.newContext({
    viewport: task.size,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // Pequeña espera para que custom fonts terminen de cargar
    await page.waitForTimeout(300);

    if (!existsSync(join(PUBLIC_DIR, task.locale))) {
      mkdirSync(join(PUBLIC_DIR, task.locale), { recursive: true });
    }

    await page.screenshot({
      path: outPath,
      type: 'png',
      clip: { x: 0, y: 0, width: task.size.width, height: task.size.height },
      omitBackground: false,
    });
    console.log(`  OK  ${task.locale}/${task.filename}`);
  } finally {
    await context.close();
  }
}

async function main(): Promise<void> {
  if (!existsSync(OUT_DIR)) {
    console.error('out/ no existe. Corré `npm run build` primero.');
    process.exit(1);
  }
  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });

  const port = 4173;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Sirviendo out/ en ${baseUrl}...`);
  const server = await startServer(OUT_DIR, port);

  const browser = await chromium.launch({ headless: true });
  const specs = loadSpecs();
  const tasks: AssetTask[] = [];
  for (const locale of ['es', 'en'] as const) {
    for (const spec of specs) {
      tasks.push({ locale, type: spec.type, size: SIZES[spec.size], filename: spec.filename });
    }
  }

  console.log(`Generando ${tasks.length} PNGs...`);
  for (const task of tasks) {
    try {
      await captureAsset(browser, baseUrl, task);
    } catch (err) {
      console.error(`  FAIL ${task.locale}/${task.filename}: ${(err as Error).message}`);
    }
  }

  await browser.close();
  server.close();
  console.log('\nListo. Assets en public/comparte-assets/{es,en}/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
