import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { load, type CheerioAPI } from 'cheerio';

const OUTPUT_DIR = resolve(process.cwd(), 'out');
const LOCALES = ['es', 'en'] as const;
type Locale = (typeof LOCALES)[number];

interface Finding {
  file: string;
  message: string;
}

function filesRecursively(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesRecursively(path);
    return entry.isFile() ? [path] : [];
  });
}

function routeFor(file: string): string {
  const rel = relative(OUTPUT_DIR, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

function routeTarget(pathname: string): string {
  if (pathname === '/') return join(OUTPUT_DIR, 'index.html');
  if (extname(pathname)) return join(OUTPUT_DIR, pathname);
  return join(OUTPUT_DIR, pathname, 'index.html');
}

function accessibleName($: CheerioAPI, element: Parameters<CheerioAPI>[0]): string {
  const node = $(element);
  const labelledBy = node.attr('aria-labelledby');
  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map((id) => $(`#${id}`).text())
      .join(' ')
      .trim();
  }
  return (node.attr('aria-label') || node.attr('title') || node.text()).trim();
}

function auditDocument(file: string, findings: Finding[], knownRoutes: Set<string>) {
  const route = routeFor(file);
  const source = readFileSync(file, 'utf8');
  const $ = load(source);
  const expectedLocale = LOCALES.find((locale) => route.startsWith(`/${locale}/`));

  if (expectedLocale && $('html').attr('lang') !== expectedLocale) {
    findings.push({ file: route, message: `lang debe ser ${expectedLocale}, recibido ${$('html').attr('lang') ?? 'vacío'}` });
  }
  if (expectedLocale && !$('title').text().trim()) {
    findings.push({ file: route, message: 'falta title' });
  }
  if (expectedLocale && !$('meta[name="description"]').attr('content')?.trim()) {
    findings.push({ file: route, message: 'falta meta description' });
  }
  if (expectedLocale && $('main').length !== 1) {
    findings.push({ file: route, message: `se esperaba un main y se encontraron ${$('main').length}` });
  }
  if (expectedLocale && $('h1').length !== 1) {
    findings.push({ file: route, message: `se esperaba un h1 y se encontraron ${$('h1').length}` });
  }

  const ids = new Set<string>();
  $('[id]').each((_, element) => {
    const id = $(element).attr('id');
    if (!id) return;
    if (ids.has(id)) findings.push({ file: route, message: `id duplicado: ${id}` });
    ids.add(id);
  });

  let previousHeading = 0;
  $('h1,h2,h3,h4,h5,h6').each((_, element) => {
    const level = Number(element.tagName.slice(1));
    if (previousHeading && level > previousHeading + 1) {
      findings.push({ file: route, message: `salto de encabezado h${previousHeading} → h${level}` });
    }
    previousHeading = level;
  });

  $('img').each((_, element) => {
    if ($(element).attr('alt') === undefined) findings.push({ file: route, message: 'imagen sin atributo alt' });
  });

  $('button,a[href]').each((_, element) => {
    const node = $(element);
    const imageAlt = node.find('img[alt]').map((__, img) => $(img).attr('alt')).get().join(' ').trim();
    if (!accessibleName($, element) && !imageAlt) {
      findings.push({ file: route, message: `${element.tagName} sin nombre accesible` });
    }
  });

  $('input:not([type="hidden"]),select,textarea').each((_, element) => {
    const node = $(element);
    const id = node.attr('id');
    const labelled = Boolean(
      node.attr('aria-label') ||
      node.attr('aria-labelledby') ||
      (id && $(`label[for="${id}"]`).length) ||
      node.parents('label').length,
    );
    if (!labelled) findings.push({ file: route, message: `${element.tagName} sin etiqueta accesible` });
  });

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (!href || !href.startsWith('/') || href.startsWith('//')) return;
    const url = new URL(href, 'https://observatorioia.org');
    const targetRoute = url.pathname;
    const normalizedRoute = targetRoute.endsWith('/') || extname(targetRoute)
      ? targetRoute
      : `${targetRoute}/`;
    const targetFile = routeTarget(targetRoute);
    if (!knownRoutes.has(normalizedRoute) && !existsSync(targetFile)) {
      findings.push({ file: route, message: `enlace interno inexistente: ${href}` });
      return;
    }
    if (!url.hash || !targetFile.endsWith('.html') || !existsSync(targetFile)) return;
    const target = load(readFileSync(targetFile, 'utf8'));
    const fragment = decodeURIComponent(url.hash.slice(1));
    if (!target(`#${fragment}`).length) {
      findings.push({ file: route, message: `ancla inexistente: ${href}` });
    }
  });
}

function auditLocaleParity(routes: Set<string>, findings: Finding[]) {
  for (const locale of LOCALES) {
    const other: Locale = locale === 'es' ? 'en' : 'es';
    for (const route of routes) {
      if (!route.startsWith(`/${locale}/`)) continue;
      const counterpart = route.replace(`/${locale}/`, `/${other}/`);
      if (!routes.has(counterpart)) findings.push({ file: route, message: `falta contraparte ${other}: ${counterpart}` });
    }
  }
}

if (!existsSync(OUTPUT_DIR)) throw new Error('No existe out/. Ejecutá npm run build primero.');

const html = filesRecursively(OUTPUT_DIR).filter((file) => file.endsWith('.html'));
const routes = new Set(html.map(routeFor));
const findings: Finding[] = [];

for (const file of html) auditDocument(file, findings, routes);
auditLocaleParity(routes, findings);

if (findings.length) {
  for (const finding of findings) console.error(`ERROR ${finding.file}: ${finding.message}`);
  console.error(`\nAuditoría estática fallida: ${findings.length} hallazgos en ${html.length} documentos.`);
  process.exitCode = 1;
} else {
  const localized = html.filter((file) => /\/(es|en)\//.test(`${dirname(file)}${sep}`)).length;
  console.log(`Auditoría estática válida: ${html.length} HTML, ${localized} localizados y paridad ES/EN completa.`);
}
