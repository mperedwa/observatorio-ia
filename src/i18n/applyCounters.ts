import type { Counters } from '../data/counters';

/**
 * Reemplaza cualquier placeholder que coincida con una clave de `Counters`
 * en una cadena con los contadores reales del catálogo. Los strings del
 * diccionario que mencionan cantidades se escriben con placeholders en vez
 * de números fijos para que el contador siempre quede sincronizado con
 * `src/data/json/*` sin tocar i18n manualmente.
 */
export function applyCounters(template: string, counters: Counters): string {
  return (Object.entries(counters) as Array<[keyof Counters, number]>).reduce(
    (texto, [clave, valor]) => texto.replaceAll(`{${clave}}`, String(valor)),
    template,
  );
}
