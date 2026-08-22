# Observatorio IA Costa Rica

Sitio público e independiente que documenta adopción de inteligencia artificial, iniciativas en seguimiento, capacidades del ecosistema, legislación e indicadores del sector público costarricense.

Dominio: [observatorioia.org](https://observatorioia.org)

## Estado del catálogo

Corte editorial: 21 de agosto de 2026.

- 29 iniciativas relacionadas con IA en 9 instituciones.
- 6 adopciones verificadas, 7 iniciativas en seguimiento y 16 registros de ecosistema y capacidades.
- 7 expedientes legislativos relacionados con IA.
- 129 registros del Plan de Acción ENIA, que representan 120 intervenciones únicas.
- 8 frentes con cadencia de monitoreo y bitácora pública de revisiones.
- 7 endpoints JSON de lectura pública.

Una iniciativa solo cuenta como adopción verificada cuando la técnica de IA y la ejecución en piloto u operación están respaldadas por fuentes trazables. Un anuncio o una meta oficial no demuestra ejecución.

## Stack

- Next.js 14 con App Router y `output: 'export'`.
- TypeScript estricto.
- TailwindCSS.
- Datos JSON validados con AJV y reexports tipados.
- Vitest para reglas editoriales y de integridad.
- Playwright y Cheerio para scraping y control de fuentes.

## Desarrollo local

```bash
npm install
npm run dev
```

El sitio queda disponible en [http://localhost:3000/es/](http://localhost:3000/es/). Para usar otro puerto:

```bash
npm run dev -- -p 3001
```

Validación completa:

```bash
npm run validate-data
npm test
npx tsc --noEmit
npm run build
npm run audit:static
```

La build estática se genera en `out/`. `audit:static` revisa idioma, metadatos, estructura accesible, enlaces internos y paridad ES/EN de los HTML exportados. No hace falta desplegar para revisar el sitio localmente.

## Estructura principal

```text
src/app/[locale]/       páginas bilingües ES/EN
src/components/         interfaz y visualizaciones
src/data/json/          fuentes de verdad públicas
src/data/schemas/       contratos JSON Schema
scrapers/               detectores de señales y monitores
scripts/                API, clasificación y herramientas editoriales
tests/                  reglas de evidencia e integridad
docs/                   auditorías y entregas por fase
```

Datasets principales:

- `proyectos.json`: catálogo con modelo de evidencia v2.
- `instituciones.json`: instituciones documentadas.
- `legislacion.json`: expedientes y evidencia oficial del estado.
- `eniaAcciones.json`: inventario y crosswalk del Plan de Acción ENIA.
- `monitoreo.json`: cadencias, próximas revisiones, transiciones y revisiones sin cambios.
- `indicadores.json`, `marcoPais.json`, `brechas.json` y `changelog.json`.

## Monitoreo editorial

Los scrapers no crean ni verifican proyectos. Generan señales y paquetes con estado `propuesta-no-verificada`; una persona debe contrastar las fuentes antes de cambiar los datos.

```bash
npm run scrape:all
npm run watch:enia
npm run watch:ilia
npm run watch:oecd
npm run check-monitoring-due
```

`check-monitoring-due` anticipa siete días las revisiones de la agenda. En GitHub, el workflow de días hábiles abre una tarea idempotente y avisa por Telegram; nunca mueve fechas ni registra por sí solo un resultado sin cambios. Para previsualizar el issue localmente:

```bash
npm run create-monitoring-review-issue -- --dry-run
```

Para registrar una revisión, el comando funciona como simulación por defecto y solo escribe con `--apply`:

```bash
npm run record-review -- --input /ruta/revision.json
npm run record-review -- --input /ruta/revision.json --apply
```

La implementación se documenta en [scrapers/README.md](scrapers/README.md) y la puesta en marcha de Fase 5C en [docs/fases/2026-08-21-fase-5c-puesta-en-marcha-operativa.md](docs/fases/2026-08-21-fase-5c-puesta-en-marcha-operativa.md).

## API pública

`npm run build` genera documentación humana en español bajo `/api/`, su contraparte inglesa en `/api/en/`, un manifest y siete endpoints:

- `/api/proyectos.json`
- `/api/instituciones.json`
- `/api/legislacion.json`
- `/api/indicadores.json`
- `/api/brechas.json`
- `/api/enia-acciones.json`
- `/api/monitoreo.json`

Todos responden con `{version, lastUpdate, count, source, license, data}`. `lastUpdate` representa el último cambio editorial conocido y no la hora de compilación. Licencia de datos: CC BY 4.0.

## Política editorial

- Todo contenido público nuevo debe ser bilingüe.
- Cada afirmación relevante debe poder rastrearse a una fuente concreta.
- Existencia, ejecución, técnica, uso operativo, resultados y gobernanza se evalúan por separado.
- Los campos sin evidencia suficiente se publican como no determinados.
- La prensa puede orientar una investigación, pero no sustituye una fuente primaria al afirmar ejecución.
- No se publican recomendaciones tácticas, presupuestos ni planes privados del proyecto maestro.
- No se despliega ni se publica mientras el sitio esté en revisión local.

El plan vigente está en [docs/plan-modelo-evidencia-enia-2026-08-19.md](docs/plan-modelo-evidencia-enia-2026-08-19.md).
