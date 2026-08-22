import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = join(process.cwd(), 'out');
const LOCALES = ['es', 'en'] as const;

function htmlFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
  });
}

export function finalizeStaticHtml(outputDir = OUTPUT_DIR): number {
  let updated = 0;

  for (const locale of LOCALES) {
    const localeDir = join(outputDir, locale);
    for (const file of htmlFiles(localeDir)) {
      const source = readFileSync(file, 'utf8');
      const next = source.replace(/<html\s+lang="[^"]*"/, `<html lang="${locale}"`);
      if (next === source) {
        if (!source.includes(`<html lang="${locale}"`)) {
          throw new Error(`No se pudo fijar lang=${locale} en ${file}`);
        }
        continue;
      }
      writeFileSync(file, next);
      updated += 1;
    }
  }

  return updated;
}

const updated = finalizeStaticHtml();
console.log(`HTML estático finalizado: ${updated} documentos con idioma corregido.`);
