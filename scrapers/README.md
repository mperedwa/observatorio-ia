# Scrapers

Scripts que detectan señales en fuentes públicas y abren colas de revisión humana mediante GitHub Issues. **Nunca** publican datos directamente ni convierten una mención en un proyecto verificado.

## Política editorial

Los scrapers **jamás** modifican los datasets curados. En particular, no alteran:

- `titulo`
- `descripcion`
- `resumen`
- `contexto`
- `lecciones`

Los cambios de estado legislativo y los candidatos se escriben en reportes dentro de `scraper-runs/`. Después de contrastarlos, una persona puede registrarlos editorialmente en los JSON fuente.

Para hallazgos nuevos o posibles actualizaciones, `classify-vs-repo` genera `evidence-proposals.json`. Cada paquete indica fuente sugerida, dimensiones que podrían estar respaldadas y si hace falta localizar una fuente primaria. Su estado siempre es `propuesta-no-verificada` y `puedeActualizarCatalogo` siempre es `false`.

## Clasificador LLM (opcional, Fase 6)

Si `GROQ_API_KEY` está disponible en el entorno, el orquestador clasifica cada candidato con **Llama 3.1 8B Instant vía Groq**. Cada candidato recibe:

- **score** (0-10): qué tan relevante es para el observatorio
- **tipo**: `proyecto-nuevo`, `actualizacion`, `comunicado`, `evento`, `ruido`
- **resumen**: 1-2 frases factuales
- **tags**: 2-5 etiquetas

El reporte de la corrida ordena los candidatos por score (alta → media → baja) para que Mario vea primero lo importante. **El LLM no autoriza cambios al catálogo**: la política de revisión humana se mantiene.

**Setup**:
1. Crear cuenta gratis en https://console.groq.com/
2. Generar API key en https://console.groq.com/keys
3. Configurar como secret de GitHub: Settings → Secrets and variables → Actions → New repository secret → nombre `GROQ_API_KEY`, valor pegar la key

**Costo**: $0/mes. Free tier de Groq: 1M tokens/día, 30 req/min. Uso estimado: 100K tokens/mes (<0.5% del límite mensual).

**Fallback**: si el secret no está configurado, el workflow corre igual y el reporte muestra los candidatos sin ranking (modo Fase 5).

**Test local**:
```bash
export GROQ_API_KEY=gsk_...
npm run scrape:all
cat scraper-runs/last-run.md
```

## Cómo correr local

```bash
# Validar JSONs contra schemas AJV
npm run validate-data

# Correr un scraper individual (requiere browsers de Playwright para fallback)
npm run scrape:micitt    # MICITT (Drupal)
npm run scrape:camtic    # CAMTIC (WordPress REST API)
npm run scrape:asamblea  # Asamblea Legislativa (7 expedientes relacionados con IA)
npm run scrape:pj           # Poder Judicial Sala de Prensa (Joomla, paginado)
npm run scrape:delfino      # Delfino.cr RSS (prensa editorial)
npm run scrape:citic        # CITIC-UCR RSS (académico, IA software + ético-IA)
npm run scrape:google-news  # Tier B: 9 instituciones + búsqueda transversal del sector público
npm run scrape:hacienda     # Tier B: Hacienda con Playwright (best-effort)
npm run scrape:cgr          # Tier C: Contraloría General (RSS noticias + RSS informes DFOE)
npm run scrape:mideplan     # Tier C: listado oficial + respaldo restringido a URLs MIDEPLAN

# Correr los 10 y escribir reportes/propuestas, sin aplicar cambios
npm run scrape:all

# Monitores de versiones e indicadores
npm run watch:enia
npm run watch:ilia
npm run watch:oecd

# Agenda editorial: genera reporte y previsualiza el issue sin crearlo
npm run check-monitoring-due
npm run create-monitoring-review-issue -- --dry-run

# Registrar una revisión editorial; dry-run por defecto
npm run record-review -- --input /ruta/revision.json
npm run record-review -- --input /ruta/revision.json --apply

# Tras un push autorizado, verifica y cierra issues resueltos (CI lo ejecuta)
npm run close-monitoring-review
```

Si Playwright no está instalado localmente, los scripts caen a `fetch` directo cuando es posible. Para instalar browsers:

```bash
npx playwright install chromium
```

## Estructura

```
scrapers/
├── lib/
│   ├── source.ts       # fetch (estático o Playwright) + helpers IA
│   ├── diff.ts         # tipos ProposedChange, applyChange, reportes
│   ├── validator.ts    # AJV + cross-checks de integridad
│   └── classifier.ts   # cliente Groq/Llama 3.1 (Fase 6)
├── enia-watch.ts       # huellas de la página MICITT + PDF del Plan de Acción
├── ilia-watch.ts       # detector de nueva edición del ILIA
├── oecd-watch.ts       # detector DGI / OURdata
├── micitt.ts           # noticias MICITT (Drupal)
├── camtic.ts           # noticias CAMTIC (WordPress REST API)
├── asamblea.ts         # estado de los 7 expedientes relacionados con IA
├── pj.ts               # Poder Judicial Sala de Prensa (Joomla, paginado)
├── delfino.ts          # Delfino.cr RSS (prensa editorial CR)
├── citic.ts            # CITIC-UCR RSS (académico, IA software + ético-IA)
├── google-news.ts      # Tier B: 9 instituciones + frente transversal
├── hacienda.ts         # Tier B: Hacienda con Playwright (best-effort)
├── cgr.ts              # Tier C: Contraloría (RSS noticias + RSS informes DFOE)
├── mideplan.ts         # Tier C: MIDEPLAN directo + respaldo con dominio oficial
└── run-all.ts          # orquestador, escribe scraper-runs/last-run.{json,md}
```

## Cómo agregar un scraper nuevo

1. Crear `scrapers/<fuente>.ts` siguiendo el patrón de `asamblea.ts`.
2. Exportar una función `scrape<Fuente>(): Promise<ScraperReport>`.
3. Importarla en `scrapers/run-all.ts` y agregarla al loop.
4. Agregar script `scrape:<fuente>` en `package.json`.

## GitHub Action

`.github/workflows/scrape.yml` corre lunes/miércoles/viernes a las 12:00 UTC (06:00 CR). Clasifica las señales y, cuando hace falta revisión, abre GitHub Issues con las etiquetas `scrape-review` o `legislacion-update`. Los reportes se guardan como artefactos por 30 días; el workflow no crea branches, PR ni commits de datos.

Los monitores dedicados tienen su propia cadencia:

- `enia-watch.yml`: mensual; compara página oficial y PDF.
- `ilia-watch.yml`: mensual, con vigilancia semanal entre septiembre y noviembre.
- `oecd-watch.yml`: semestral, acorde con la publicación histórica de DGI/OURdata.
- `monitoring-due.yml`: días hábiles; usa anticipación por cadencia, abre un issue idempotente y silencioso, y deja el aviso para cuando el watcher tenga un veredicto.
- `close-monitoring-review.yml`: después de que CI aprueba `main`, cierra únicamente issues con `issueUrl`, resultado final y próxima fecha avanzada.

Para correr manualmente desde GitHub: Actions → "Scrape fuentes oficiales" → Run workflow.

## Selector breakage

Si un sitio fuente cambia su HTML, el scraper falla y deja de detectar cambios. El Action falla visiblemente y manda email a Mario. Para arreglar:

1. Inspeccionar HTML actual del sitio (DevTools).
2. Actualizar selectores en `scrapers/<fuente>.ts` (función `fetchNotas` o equivalente).
3. Probar localmente con `npm run scrape:<fuente>`.
4. Commit y push.

Selectores actuales (mantener al día):

| Fuente | Función | URL/Selector |
|---|---|---|
| MICITT | `fetchNotas` en `micitt.ts` | URL: `/micitt-Informa/noticias`. Selector: `a[href^="/el-sector-informa/"]` (filtrando "Leer más"). |
| CAMTIC | `fetchNotas` en `camtic.ts` | WordPress REST API: `/wp-json/wp/v2/posts?per_page=20&_fields=id,date,link,title,excerpt`. Devuelve JSON estable; el RSS feed devolvía 0 items desde IPs no-CR. |
| Asamblea | `fetchExpedienteData` en `asamblea.ts` | Lee dinámicamente los 7 números de `legislacion.json`, consulta sus fichas y normaliza únicamente estados accionables. |
| Poder Judicial | `parseListing` en `pj.ts` | Joomla, categoría 8 Sala de Prensa. URL: `/index.php/component/content/category/8-sala-de-prensa?Itemid=409&start=N`. Pagina 4 páginas (≈20 notas). Extrae IDs+slugs de URLs `/article/<id>-<slug>`; el RSS de Joomla devuelve `<title>` vacío. |
| Delfino.cr | `parseFeed` en `delfino.ts` | RSS oficial: `https://delfino.cr/feed`. Filtra por keywords IA + nombres instituciones gov (CCSS, MICITT, Hacienda, Asamblea, ENIA, etc.). Prensa editorial — los candidatos exigen validación contra fuente primaria antes de cualquier `add`/`update`. |
| CITIC-UCR | `parseFeed` en `citic.ts` | RSS oficial: `https://citic.ucr.ac.cr/rss.xml`. Centro académico ya catalogado (proyecto ucr-citic-ia-software + Erasmus+ CIOdD). Filtra IA, ética IA, machine learning, computación cuántica, alianzas Erasmus. |
| Google News (Tier B) | `parseGoogleNewsFeed` en `google-news.ts` | RSS público `news.google.com/rss/search?q=<query>&hl=es-419&gl=CR&ceid=CR:es-419`. Diez consultas con ventana de 90 días cubren las nueve instituciones catalogadas y un frente transversal del sector público. Política: prensa, no fuente oficial; cada candidato exige validación primaria antes de cualquier cambio. |
| Hacienda (Tier B, best-effort) | `extractLinks` en `hacienda.ts` | Playwright headless contra `/noticias` y `/`. Pasa el WAF que rechaza fetch/curl, pero las noticias cargan vía AJAX no-detectable en HTML inicial. Cobertura real de Hacienda viene por `google-news.ts`. Si el sitio expone un endpoint listable en el futuro, este scraper queda listo. |
| CGR / Contraloría (Tier C) | `parseFeed` en `cgr.ts` | 2 RSS feeds oficiales: `noticias_rss.xml` (14 items) + `informes_recientes.xml` (27 items, informes DFOE PDF). Filtra por keywords IA + sistemas digitales + ciberseguridad. Útil para detectar auditorías a proyectos catalogados (Poder Judicial, CCSS, Hacienda) — los informes DFOE son evidencia oficial de alta credibilidad. |
| MIDEPLAN (Tier C) | `parseMideplanListing` en `mideplan.ts` | Intenta primero Drupal Views en `/listado-noticias`. Si el WAF devuelve 403 o cero ítems, Google News descubre candidatos mediante consultas acotadas y solo se conservan URLs finales de `mideplan.go.cr` o sus subdominios. La indexación puede tener retraso y no sustituye la revisión manual del Marco país. |

**Fuentes Tier B descartadas como scraper directo** (cubiertas vía `google-news.ts`):
- **CCSS** (`ccss.sa.cr`): timeout TCP total desde IPs no-CR. Subdominios `prensa.`, `transparencia.` igual bloqueados. Inviable sin proxy residencial CR.
- **CENAT** (`cenat.ac.cr`): sitio HTML estático sin feed ni sección de noticias unificada. Subdominios (PRIAS, CNCA, etc.) tampoco exponen feeds.

**Fuentes Tier C descartadas** (vigilancia manual cuando publiquen):
- **PROSIC (UCR)** (`prosic.ucr.ac.cr`): RSS oficial existe pero está vacío (sin `<item>`). Mario revisa manualmente cuando salga el reporte anual del estado digital de CR.
