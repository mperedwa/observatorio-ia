import type { Bilingual } from '@/i18n/config';
import type { Counters } from './counters';
import { applyCounters } from '../i18n/applyCounters';

type CapaContable = { instrumentos: Bilingual; funcion: Bilingual };

/** Mantiene la prosa del inventario alineada con los conteos del catálogo. */
export function resolveMarcoPaisCounters<T extends { capas: CapaContable[] }>(
  data: T,
  counters: Counters,
): T {
  const resolve = (copy: Bilingual): Bilingual => ({
    es: applyCounters(copy.es, counters),
    en: applyCounters(copy.en, counters),
  });

  return {
    ...data,
    capas: data.capas.map((capa) => ({
      ...capa,
      instrumentos: resolve(capa.instrumentos),
      funcion: resolve(capa.funcion),
    })),
  };
}
