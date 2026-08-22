/**
 * Registra una revisión editorial en `monitoreo.json` y mueve la próxima
 * fecha según la cadencia del frente. Por seguridad funciona como dry-run;
 * solo escribe con `--apply` y nunca modifica proyectos, legislación,
 * indicadores ni el crosswalk ENIA.
 *
 * Uso:
 *   npm run record-review -- --input /ruta/revision.json
 *   npm run record-review -- --input /ruta/revision.json --apply
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type {
  InventarioMonitoreo,
  RevisionMonitoreo,
  CadenciaMonitoreo,
} from '../src/data/monitoreo';

const DATA_PATH = resolve(process.cwd(), 'src/data/json/monitoreo.json');

const MESES_POR_CADENCIA: Record<CadenciaMonitoreo, number | null> = {
  semanal: null,
  mensual: 1,
  trimestral: 3,
  semestral: 6,
};

function fechaUtc(fecha: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    throw new Error(`Fecha inválida "${fecha}"; se requiere YYYY-MM-DD.`);
  }
  const parsed = new Date(`${fecha}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== fecha) {
    throw new Error(`Fecha inválida "${fecha}".`);
  }
  return parsed;
}

export function calcularProximaRevision(
  fecha: string,
  cadencia: CadenciaMonitoreo,
): string {
  const base = fechaUtc(fecha);
  if (cadencia === 'semanal') {
    base.setUTCDate(base.getUTCDate() + 7);
    return base.toISOString().slice(0, 10);
  }

  const meses = MESES_POR_CADENCIA[cadencia];
  if (meses === null) throw new Error(`Cadencia no soportada: ${cadencia}`);

  const diaOriginal = base.getUTCDate();
  base.setUTCDate(1);
  base.setUTCMonth(base.getUTCMonth() + meses);
  const ultimoDiaMes = new Date(
    Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0),
  ).getUTCDate();
  base.setUTCDate(Math.min(diaOriginal, ultimoDiaMes));
  return base.toISOString().slice(0, 10);
}

export function prepararRevision(
  inventario: InventarioMonitoreo,
  revision: RevisionMonitoreo,
): InventarioMonitoreo {
  const copia = structuredClone(inventario);
  const frente = copia.frentes.find(({ id }) => id === revision.frenteId);
  if (!frente) {
    throw new Error(`Frente desconocido: ${revision.frenteId}`);
  }
  if (copia.revisiones.some(({ id }) => id === revision.id)) {
    throw new Error(`Ya existe una revisión con id ${revision.id}.`);
  }
  fechaUtc(revision.fecha);

  const sinCambios = revision.resultado === 'sin-cambios';
  if (sinCambios && revision.transiciones.length > 0) {
    throw new Error('Una revisión sin cambios no puede incluir transiciones.');
  }
  if (!sinCambios && revision.transiciones.length === 0) {
    throw new Error('Un cambio detectado o publicado debe incluir transiciones.');
  }
  if (!revision.resumen.es.trim() || !revision.resumen.en.trim()) {
    throw new Error('La revisión requiere resumen bilingüe.');
  }
  new URL(revision.fuenteUrl);

  frente.fechaUltimaRevision = revision.fecha;
  frente.fechaProximaRevision = calcularProximaRevision(
    revision.fecha,
    frente.cadenciaId,
  );
  copia.fechaCorte = [copia.fechaCorte, revision.fecha].sort().at(-1)!;
  copia.revisiones.push(revision);
  copia.revisiones.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));
  return copia;
}

function parseArgs(argv: string[]): { input: string; apply: boolean } {
  const inputIndex = argv.indexOf('--input');
  const input = inputIndex >= 0 ? argv[inputIndex + 1] : undefined;
  if (!input) {
    throw new Error('Falta --input /ruta/revision.json.');
  }
  return { input: resolve(process.cwd(), input), apply: argv.includes('--apply') };
}

function main(): void {
  const { input, apply } = parseArgs(process.argv.slice(2));
  if (!existsSync(input)) throw new Error(`No existe el archivo de entrada: ${input}`);

  const inventario = JSON.parse(
    readFileSync(DATA_PATH, 'utf8'),
  ) as InventarioMonitoreo;
  const revision = JSON.parse(readFileSync(input, 'utf8')) as RevisionMonitoreo;
  const actualizado = prepararRevision(inventario, revision);
  const frente = actualizado.frentes.find(({ id }) => id === revision.frenteId)!;

  console.log(
    `[record-review] ${revision.frenteId}: ${revision.resultado} el ${revision.fecha}; próxima ${frente.fechaProximaRevision}`,
  );

  if (!apply) {
    console.log('[record-review] dry-run: no se escribió monitoreo.json. Agregue --apply después de revisar la propuesta.');
    return;
  }

  writeFileSync(DATA_PATH, `${JSON.stringify(actualizado, null, 2)}\n`);
  console.log(`[record-review] escrito ${DATA_PATH}. Ejecute npm run validate-data antes del commit.`);
}

const isDirectInvocation =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectInvocation) {
  try {
    main();
  } catch (error) {
    console.error(`[record-review] ${(error as Error).message}`);
    process.exit(1);
  }
}
