import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  encontrarErroresTrazabilidad,
  type CamposModeloEvidencia,
  type RelacionIniciativa,
} from '../../src/data/modelo-evidencia';

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
  { name: 'changelog', jsonPath: 'json/changelog.json', schemaPath: 'schemas/changelog.schema.json' },
  { name: 'marcoPais', jsonPath: 'json/marcoPais.json', schemaPath: 'schemas/marcoPais.schema.json' },
  { name: 'eniaAcciones', jsonPath: 'json/eniaAcciones.json', schemaPath: 'schemas/eniaAcciones.schema.json' },
  { name: 'monitoreo', jsonPath: 'json/monitoreo.json', schemaPath: 'schemas/monitoreo.schema.json' },
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
  const proyectos = loadJson('json/proyectos.json') as Array<
    CamposModeloEvidencia & {
      id: string;
      institucionId: string;
      relaciones?: RelacionIniciativa[];
    }
  >;
  const instituciones = loadJson('json/instituciones.json') as Array<{ id: string; proyectosActivos: number }>;
  const institucionIds = new Set(instituciones.map((i) => i.id));
  const proyectoIds = new Set(proyectos.map((p) => p.id));
  const inventarioEnia = loadJson('json/eniaAcciones.json') as {
    resumen: {
      ejes: number;
      lineasAccion: number;
      resultadosEsperados: number;
      intervenciones: number;
      indicadores: number;
    };
    resultados: Array<{
      codigo: string;
      eje: { numero: number };
      lineaAccion: { codigo: string };
      intervenciones: Array<{
        id: string;
        indicadores: unknown[];
        cruceCatalogo: {
          proyectoIds: string[];
          intervencionCanonicaId?: string;
        };
      }>;
    }>;
  };
  const marcoPais = loadJson('json/marcoPais.json') as {
    instrumentos: unknown[];
  };
  const monitoreo = loadJson('json/monitoreo.json') as {
    fechaCorte: string;
    politica: { cadencias: Array<{ id: string }> };
    frentes: Array<{
      id: string;
      metrica: string;
      cadenciaId: string;
      fechaUltimaRevision: string;
      fechaProximaRevision: string;
      alcance: { cantidad: number };
    }>;
    revisiones: Array<{
      id: string;
      fecha: string;
      frenteId: string;
      resultado: string;
      transiciones: unknown[];
    }>;
  };
  let ok = true;
  for (const p of proyectos) {
    if (!institucionIds.has(p.institucionId)) {
      console.log(`  FAIL proyecto "${p.id}" referencia institucionId desconocida "${p.institucionId}"`);
      ok = false;
    }

    for (const error of encontrarErroresTrazabilidad(p)) {
      console.log(`  FAIL proyecto "${p.id}" tiene trazabilidad inválida: ${error}`);
      ok = false;
    }

    for (const relacion of p.relaciones ?? []) {
      if (relacion.iniciativaId === p.id) {
        console.log(`  FAIL proyecto "${p.id}" contiene una relación consigo mismo`);
        ok = false;
      } else if (!proyectoIds.has(relacion.iniciativaId)) {
        console.log(
          `  FAIL proyecto "${p.id}" relaciona iniciativa desconocida "${relacion.iniciativaId}"`,
        );
        ok = false;
      }
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

  const resultadosEnia = inventarioEnia.resultados;
  const intervencionesEnia = resultadosEnia.flatMap(
    ({ intervenciones }) => intervenciones,
  );
  const indicadoresEnia = intervencionesEnia.reduce(
    (total, { indicadores }) => total + indicadores.length,
    0,
  );
  const resumenDerivado = {
    ejes: new Set(resultadosEnia.map(({ eje }) => eje.numero)).size,
    lineasAccion: new Set(
      resultadosEnia.map(({ lineaAccion }) => lineaAccion.codigo),
    ).size,
    resultadosEsperados: resultadosEnia.length,
    intervenciones: intervencionesEnia.length,
    indicadores: indicadoresEnia,
  };

  for (const [campo, valor] of Object.entries(resumenDerivado)) {
    if (inventarioEnia.resumen[campo as keyof typeof resumenDerivado] !== valor) {
      console.log(
        `  FAIL eniaAcciones.resumen.${campo} no coincide con el conteo derivado (${valor})`,
      );
      ok = false;
    }
  }

  const codigosResultado = resultadosEnia.map(({ codigo }) => codigo);
  if (new Set(codigosResultado).size !== codigosResultado.length) {
    console.log('  FAIL eniaAcciones contiene códigos de resultado duplicados');
    ok = false;
  }

  const idsIntervencion = intervencionesEnia.map(({ id }) => id);
  if (new Set(idsIntervencion).size !== idsIntervencion.length) {
    console.log('  FAIL eniaAcciones contiene IDs de intervención duplicados');
    ok = false;
  }

  for (const intervencion of intervencionesEnia) {
    for (const proyectoId of intervencion.cruceCatalogo.proyectoIds) {
      if (!proyectoIds.has(proyectoId)) {
        console.log(
          `  FAIL intervención ENIA "${intervencion.id}" referencia proyecto desconocido "${proyectoId}"`,
        );
        ok = false;
      }
    }
  }

  const cadenciaIds = new Set(
    monitoreo.politica.cadencias.map(({ id }) => id),
  );
  const frenteIds = new Set(monitoreo.frentes.map(({ id }) => id));
  const idsRevision = new Set<string>();

  if (frenteIds.size !== monitoreo.frentes.length) {
    console.log('  FAIL monitoreo contiene IDs de frente duplicados');
    ok = false;
  }

  const conteosMonitoreo: Record<string, number> = {
    'legislacion-expedientes': (loadJson('json/legislacion.json') as unknown[]).length,
    'enia-intervenciones-unicas': intervencionesEnia.filter(
      ({ cruceCatalogo }) => !cruceCatalogo.intervencionCanonicaId,
    ).length,
    'catalogo-seguimiento': proyectos.filter(
      ({ estadoCatalogo }) => estadoCatalogo === 'seguimiento',
    ).length,
    'catalogo-verificado': proyectos.filter(
      ({ estadoCatalogo }) => estadoCatalogo === 'verificado',
    ).length,
    'catalogo-ecosistema': proyectos.filter(
      ({ estadoCatalogo }) => estadoCatalogo === 'ecosistema',
    ).length,
    'marco-pais-instrumentos': marcoPais.instrumentos.length,
    'indicador-ilia': 1,
    'indicador-oecd': 2,
  };

  for (const frente of monitoreo.frentes) {
    if (!cadenciaIds.has(frente.cadenciaId)) {
      console.log(
        `  FAIL frente de monitoreo "${frente.id}" referencia cadencia desconocida "${frente.cadenciaId}"`,
      );
      ok = false;
    }
    if (frente.fechaProximaRevision <= frente.fechaUltimaRevision) {
      console.log(
        `  FAIL frente de monitoreo "${frente.id}" no tiene próxima revisión posterior a la última`,
      );
      ok = false;
    }
    const conteoEsperado = conteosMonitoreo[frente.metrica];
    if (conteoEsperado === undefined) {
      console.log(
        `  FAIL frente de monitoreo "${frente.id}" usa métrica desconocida "${frente.metrica}"`,
      );
      ok = false;
    } else if (frente.alcance.cantidad !== conteoEsperado) {
      console.log(
        `  FAIL frente de monitoreo "${frente.id}" declara ${frente.alcance.cantidad}, pero "${frente.metrica}" deriva ${conteoEsperado}`,
      );
      ok = false;
    }
  }

  for (const revision of monitoreo.revisiones) {
    if (idsRevision.has(revision.id)) {
      console.log(`  FAIL monitoreo contiene revisión duplicada "${revision.id}"`);
      ok = false;
    }
    idsRevision.add(revision.id);
    if (!frenteIds.has(revision.frenteId)) {
      console.log(
        `  FAIL revisión "${revision.id}" referencia frente desconocido "${revision.frenteId}"`,
      );
      ok = false;
    }
    if (revision.fecha > monitoreo.fechaCorte) {
      console.log(
        `  FAIL revisión "${revision.id}" ocurre después del corte ${monitoreo.fechaCorte}`,
      );
      ok = false;
    }
    const sinCambios = revision.resultado === 'sin-cambios';
    if (sinCambios !== (revision.transiciones.length === 0)) {
      console.log(
        `  FAIL revisión "${revision.id}" no alinea resultado y transiciones`,
      );
      ok = false;
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
