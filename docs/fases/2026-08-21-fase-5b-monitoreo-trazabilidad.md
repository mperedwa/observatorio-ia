# Fase 5B: monitoreo y trazabilidad editorial

**Fecha de corte:** 21 de agosto de 2026

**Estado:** implementada localmente; pendiente de revisión visual de Mario antes de publicar.

## Objetivo

Convertir el historial del observatorio en un sistema público de seguimiento que responda tres preguntas: qué se revisa, cuándo se volverá a revisar y qué cambió o no cambió después de cada revisión. La automatización funciona como detector de señales; la publicación de un cambio sigue siendo una decisión editorial humana.

## Resultado público

La ruta bilingüe `/es/historial/` y `/en/historial/` ahora presenta:

- ocho frentes de monitoreo con fecha de última y próxima revisión;
- cuatro cadencias editoriales: semanal, mensual, trimestral y semestral;
- una agenda ordenada por la revisión más próxima;
- ocho revisiones trazables, cinco con cambios publicados y tres sin cambios;
- transiciones explícitas para expedientes, proyectos e intervenciones ENIA;
- el historial general de cambios que ya existía en el sitio.

La interfaz usa filas editoriales, divisores y jerarquía tipográfica en lugar de una cuadrícula de tarjetas. Este es un primer ajuste hacia una identidad visual menos repetitiva; el rediseño general del sitio permanece como una fase posterior.

## Agenda editorial

| Frente | Cadencia | Alcance inicial | Próxima revisión |
|---|---|---:|---|
| Expedientes relacionados con IA | Semanal | 7 expedientes | 28 de agosto de 2026 |
| ENIA y Plan de Acción | Mensual | 120 intervenciones únicas | 21 de septiembre de 2026 |
| Iniciativas en seguimiento | Mensual | 7 iniciativas | 21 de septiembre de 2026 |
| Índice Latinoamericano de IA | Mensual, con refuerzo semanal entre septiembre y noviembre | 1 índice | 1 de septiembre de 2026 |
| Adopciones verificadas | Trimestral | 6 adopciones | 21 de noviembre de 2026 |
| Marco país | Trimestral | 6 instrumentos | 21 de noviembre de 2026 |
| Ecosistema y capacidades | Semestral | 16 iniciativas | 21 de febrero de 2027 |
| DGI y OURdata de la OCDE | Semestral | 2 índices | 1 de enero de 2027 |

Las fechas son compromisos de revisión, no predicciones de que habrá novedades. Cuando una fuente oficial no cambia, se registra una revisión `sin-cambios` para que el silencio también quede auditado.

## Bitácora inicial

La primera versión registra cinco cambios publicados:

- cruce completo de las 129 entradas fuente del Plan de Acción ENIA, que representan 120 intervenciones únicas;
- incorporación de Ela del INAMU como adopción verificada;
- incorporación del procesamiento de reclamos médicos del INS como iniciativa en seguimiento;
- incorporación de OIJ–TEC como investigación del ecosistema, sin presentarla como sistema operativo;
- ampliación del inventario legislativo a siete expedientes relacionados con IA.

También registra tres revisiones sin cambios:

- la versión pública vigente de la ENIA y la arquitectura del Marco país no mostraron una sustitución oficial;
- no se encontró una nueva edición del ILIA;
- no se encontró una nueva edición de DGI u OURdata de la OCDE aplicable a Costa Rica.

## Vigilancia automática de la ENIA

El nuevo comando `npm run watch:enia` consulta la página oficial de Inteligencia Artificial del MICITT y el PDF oficial del Plan de Acción. Conserva una huella del contenido y genera una alerta solo cuando detecta:

- cambio del período anunciado para la estrategia;
- cambio del enlace oficial de la ENIA o del Plan de Acción;
- modificación sustantiva de la página oficial;
- modificación del archivo PDF del Plan de Acción.

El estado inicial se conserva en `scraper-runs/enia-state.json`. El workflow mensual `.github/workflows/enia-watch.yml` ejecuta el monitor y permite una ejecución manual. Una alerta no modifica `proyectos.json`, `enia-acciones.json`, `legislacion.json` ni ningún otro dataset curado.

## Señales y propuestas de evidencia

El pipeline general de scrapers deja de producir stubs que podían parecer proyectos listos para incorporar. `npm run classify-vs-repo` ahora genera `evidence-proposals.json` con estado fijo `propuesta-no-verificada`.

Cada propuesta identifica:

- el posible objeto o frente al que aporta evidencia;
- el tipo de fuente sugerido y si necesita contraste con una fuente primaria;
- las dimensiones de evidencia que podría ayudar a completar;
- la acción editorial sugerida;
- `puedeActualizarCatalogo: false` como control explícito.

La notificación y el borrador de issue piden priorizar señales para investigación. No solicitan fusionar automáticamente una noticia con el catálogo.

## Registro de revisiones

`npm run record-review` prepara y valida una nueva entrada de bitácora en modo de simulación. Solo escribe `src/data/json/monitoreo.json` cuando se usa `--apply`. El comando puede registrar un cambio publicado o una revisión sin cambios, pero nunca altera los datasets sustantivos.

## API pública

Se añade `/api/monitoreo.json` y el manifest pasa a siete endpoints. Las respuestas conservan la envoltura pública existente y ahora usan una fecha editorial estable en `lastUpdate`, derivada del último cambio conocido del dataset, en lugar de la hora de compilación. Dos builds idénticas producen los mismos archivos API.

El índice HTML de `/api/` incorpora la fecha de actualización de cada dataset y explica que los monitores proponen evidencia, pero la publicación requiere revisión editorial. Los enlaces del sitio apuntan al archivo explícito `/api/index.html` para que el índice también abra correctamente bajo `next dev`.

## Controles de integridad

- `monitoreo.json` tiene esquema JSON draft-07 y tipos TypeScript;
- el validador cruza sus conteos con legislación, ENIA, proyectos e indicadores;
- las transiciones solo son obligatorias para revisiones con cambios y deben estar vacías en una revisión sin cambios;
- cada frente referencia una cadencia existente y fechas coherentes;
- el watcher ENIA compara contenido oficial, pero no interpreta una variación como ejecución comprobada;
- las propuestas de evidencia nunca tienen permiso para actualizar el catálogo;
- los textos públicos no incluyen recomendaciones tácticas del plan maestro privado.

## Verificación local

La fase se cierra únicamente después de ejecutar:

```bash
npm run validate-data
npm test
npx tsc --noEmit
npm run build
```

Además, se revisan `/es/historial/` y `/en/historial/` en navegador de escritorio y móvil, incluyendo contenido, enlaces, desbordamiento horizontal y consola. No se despliega sin aprobación explícita.

Resultado del cierre local:

- validación AJV e integridad referencial: 29 iniciativas, 9 instituciones, 7 expedientes, 129 registros ENIA, 42 entradas de historial y el nuevo dataset de monitoreo válidos;
- pruebas automatizadas: 72 de 72 aprobadas en 11 archivos;
- TypeScript estricto: sin errores;
- build estática: 137 de 137 páginas generadas y siete endpoints API;
- QA de navegador: español e inglés revisados en escritorio, español revisado en 390 × 844 px, sin desbordamiento global ni errores de consola;
- enlaces internos de la página: respuestas 200, incluido `/api/monitoreo.json` y el índice explícito `/api/index.html`;
- API de monitoreo: `count: 8`, ocho frentes, ocho revisiones y `lastUpdate: 2026-08-21T00:00:00.000Z`;
- accesibilidad: el layout raíz declara idioma por defecto y cada versión bilingüe delimita navegación, contenido y pie con su idioma real;
- corrección durante QA: se eliminó una clave duplicada de React en entradas históricas que compartían fecha y commit.

La compilación conserva una advertencia no bloqueante, previa a esta fase, por el uso de `<img>` en `/comparte`. No afecta la generación estática y queda reservada para la fase visual posterior.
