/**
 * Computa contadores derivados del catálogo (proyectos, instituciones,
 * legislación). Es la fuente única para cualquier KPI o frase del sitio
 * que mencione cantidad de items — antes había strings hardcoded ("18
 * proyectos", "16 laboratorios", etc.) que iban quedando desincronizados
 * cada vez que entraba un proyecto nuevo.
 *
 * Consumidores:
 *   - scripts/build-api.ts: inyecta el valor real en `indicadores.json`
 *     (KPI hero "Iniciativas relacionadas con IA documentadas") y emite `src/data/counters.ts`
 *     para que componentes Next puedan importar los counts en build/SSG.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  resumirCatalogo,
  type CamposModeloEvidencia,
} from '../../src/data/modelo-evidencia';

export interface Counters {
  /** Alias temporal usado por placeholders y componentes existentes. */
  proyectos: number;
  iniciativasDocumentadas: number;
  adopcionVerificada: number;
  verificadasCatalogo: number;
  seguimiento: number;
  ecosistema: number;
  descartadas: number;
  pendientesMigracion: number;
  instituciones: number;
  legislacion: number;
}

export function computeCounters(srcDir: string): Counters {
  const proyectos = JSON.parse(
    readFileSync(join(srcDir, 'proyectos.json'), 'utf8'),
  ) as CamposModeloEvidencia[];
  const instituciones = JSON.parse(readFileSync(join(srcDir, 'instituciones.json'), 'utf8')) as unknown[];
  const legislacion = JSON.parse(readFileSync(join(srcDir, 'legislacion.json'), 'utf8')) as unknown[];
  const resumen = resumirCatalogo(proyectos);

  return {
    proyectos: resumen.iniciativasDocumentadas,
    ...resumen,
    instituciones: instituciones.length,
    legislacion: legislacion.length,
  };
}
