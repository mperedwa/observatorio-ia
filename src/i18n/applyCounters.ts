import type { Counters } from '../data/counters';

/**
 * Reemplaza los placeholders `{proyectos}`, `{instituciones}`, `{legislacion}`
 * en una cadena con los contadores reales del catálogo. Los strings del
 * diccionario que mencionan cantidades se escriben con placeholders en vez
 * de números fijos para que el contador siempre quede sincronizado con
 * `src/data/json/*` sin tocar i18n manualmente.
 */
export function applyCounters(template: string, counters: Counters): string {
  return template
    .replace(/\{proyectos\}/g, String(counters.proyectos))
    .replace(/\{instituciones\}/g, String(counters.instituciones))
    .replace(/\{legislacion\}/g, String(counters.legislacion));
}
