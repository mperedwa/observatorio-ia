import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'src', 'data');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

interface DatasetSpec {
  name: string;
  jsonPath: string;
  schemaPath: string;
}

const datasets: DatasetSpec[] = [
  { name: 'proyectos', jsonPath: 'json/proyectos.json', schemaPath: 'schemas/proyectos.schema.json' },
  { name: 'instituciones', jsonPath: 'json/instituciones.json', schemaPath: 'schemas/instituciones.schema.json' },
  { name: 'legislacion', jsonPath: 'json/legislacion.json', schemaPath: 'schemas/legislacion.schema.json' },
  { name: 'indicadores', jsonPath: 'json/indicadores.json', schemaPath: 'schemas/indicadores.schema.json' },
  { name: 'brechas', jsonPath: 'json/brechas.json', schemaPath: 'schemas/brechas.schema.json' },
];

function loadJson(relPath: string): unknown {
  return JSON.parse(readFileSync(join(ROOT, relPath), 'utf8'));
}

export function validateAll(): boolean {
  let allValid = true;
  for (const ds of datasets) {
    const schema = loadJson(ds.schemaPath);
    const data = loadJson(ds.jsonPath);
    const validate = ajv.compile(schema as object);
    const ok = validate(data);
    if (ok) {
      const count = Array.isArray(data) ? data.length : Object.keys(data as object).length;
      console.log(`  OK  ${ds.name.padEnd(15)} (${count} items)`);
    } else {
      allValid = false;
      console.log(`  FAIL ${ds.name}`);
      for (const err of validate.errors ?? []) {
        console.log(`    ${err.instancePath} ${err.message}`);
      }
    }
  }
  return allValid;
}

export function crossCheck(): boolean {
  const proyectos = loadJson('json/proyectos.json') as Array<{ id: string; institucionId: string }>;
  const instituciones = loadJson('json/instituciones.json') as Array<{ id: string; proyectosActivos: number }>;
  const institucionIds = new Set(instituciones.map((i) => i.id));
  let ok = true;
  for (const p of proyectos) {
    if (!institucionIds.has(p.institucionId)) {
      console.log(`  FAIL proyecto "${p.id}" referencia institucionId desconocida "${p.institucionId}"`);
      ok = false;
    }
  }
  // Conteo proyectosActivos: debe ser >= proyectos por institución (puede haber más, ya que proyectosActivos puede contar pilotos no listados)
  for (const inst of instituciones) {
    const cuenta = proyectos.filter((p) => p.institucionId === inst.id).length;
    if (inst.proyectosActivos < cuenta) {
      console.log(
        `  WARN institución "${inst.id}" declara ${inst.proyectosActivos} proyectosActivos pero hay ${cuenta} en proyectos.json`,
      );
    }
  }
  return ok;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Validando JSONs contra schemas AJV...');
  const valid = validateAll();
  console.log('\nCross-checks de integridad referencial...');
  const crossOk = crossCheck();
  if (!valid || !crossOk) {
    console.error('\nValidación FALLÓ.');
    process.exit(1);
  }
  console.log('\nTodo válido.');
}
