# Scrapers

Scripts que detectan cambios en fuentes oficiales y abren un PR para revisión humana. **Nunca** publican datos directamente a producción.

## Política editorial

Los scrapers **jamás** modifican estos campos (curados editorialmente):

- `titulo`
- `descripcion`
- `resumen`
- `contexto`
- `lecciones`

Solo actualizan campos verificables desde la fuente: `estado`, `presentado`, `desde`, `resultado` (cuando viene cifrado de fuente oficial).

Para nuevos proyectos detectados en MICITT/CAMTIC, los scrapers anotan el hallazgo como `candidate` en el reporte (no hacen `add` automático). Mario decide si promover el candidato a entrada formal.

## Clasificador LLM (opcional, Fase 6)

Si `GROQ_API_KEY` está disponible en el entorno, el orquestador clasifica cada candidato con **Llama 3.3 70B vía Groq** (free tier, español nativo). Cada candidato recibe:

- **score** (0-10): qué tan relevante es para el observatorio
- **tipo**: `proyecto-nuevo`, `actualizacion`, `comunicado`, `evento`, `ruido`
- **resumen**: 1-2 frases factuales
- **tags**: 2-5 etiquetas

El reporte del PR ordena los candidatos por score (alta → media → baja) para que Mario vea primero lo importante. **El LLM no autoriza cambios al catálogo**: la política de revisión humana se mantiene.

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
npm run scrape:asamblea  # Asamblea Legislativa (3 expedientes IA)
npm run scrape:pj           # Poder Judicial Sala de Prensa (Joomla, paginado)
npm run scrape:delfino      # Delfino.cr RSS (prensa editorial)
npm run scrape:citic        # CITIC-UCR RSS (académico, IA software + ético-IA)
npm run scrape:google-news  # Tier B: Google News RSS multi-query (CCSS, Hacienda, CENAT)
npm run scrape:hacienda     # Tier B: Hacienda con Playwright (best-effort)

# Correr los 8 + aplicar cambios + escribir reporte
npm run scrape:all
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
│   └── classifier.ts   # cliente Groq/Llama 3.3 (Fase 6)
├── micitt.ts           # noticias MICITT (Drupal)
├── camtic.ts           # noticias CAMTIC (WordPress REST API)
├── asamblea.ts         # estado de los 3 expedientes IA
├── pj.ts               # Poder Judicial Sala de Prensa (Joomla, paginado)
├── delfino.ts          # Delfino.cr RSS (prensa editorial CR)
├── citic.ts            # CITIC-UCR RSS (académico, IA software + ético-IA)
├── google-news.ts      # Tier B: agregador Google News (CCSS, Hacienda, CENAT)
├── hacienda.ts         # Tier B: Hacienda con Playwright (best-effort)
└── run-all.ts          # orquestador, escribe scraper-runs/last-run.{json,md}
```

## Cómo agregar un scraper nuevo

1. Crear `scrapers/<fuente>.ts` siguiendo el patrón de `asamblea.ts`.
2. Exportar una función `scrape<Fuente>(): Promise<ScraperReport>`.
3. Importarla en `scrapers/run-all.ts` y agregarla al loop.
4. Agregar script `scrape:<fuente>` en `package.json`.

## GitHub Action

`.github/workflows/scrape.yml` corre lunes/miércoles/viernes 12:00 UTC (06:00 CR). Si detecta cambios en `src/data/json/`, abre un PR contra `main` con:

- Etiquetas: `scraper-auto`, `needs-review`
- Cuerpo: contenido de `.scrapers/last-run.md`
- Branch: `auto/scrape-<run-id>`

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
| Asamblea | `fetchExpedienteData` en `asamblea.ts` | URL pattern `Detalle Proyectos de Ley.aspx?Numero_Proyecto=...`, extrae texto de `<body>` y normaliza a enum de estado. |
| Poder Judicial | `parseListing` en `pj.ts` | Joomla, categoría 8 Sala de Prensa. URL: `/index.php/component/content/category/8-sala-de-prensa?Itemid=409&start=N`. Pagina 4 páginas (≈20 notas). Extrae IDs+slugs de URLs `/article/<id>-<slug>`; el RSS de Joomla devuelve `<title>` vacío. |
| Delfino.cr | `parseFeed` en `delfino.ts` | RSS oficial: `https://delfino.cr/feed`. Filtra por keywords IA + nombres instituciones gov (CCSS, MICITT, Hacienda, Asamblea, ENIA, etc.). Prensa editorial — los candidatos exigen validación contra fuente primaria antes de cualquier `add`/`update`. |
| CITIC-UCR | `parseFeed` en `citic.ts` | RSS oficial: `https://citic.ucr.ac.cr/rss.xml`. Centro académico ya catalogado (proyecto ucr-citic-ia-software + Erasmus+ CIOdD). Filtra IA, ética IA, machine learning, computación cuántica, alianzas Erasmus. |
| Google News (Tier B) | `parseFeed` en `google-news.ts` | RSS público `news.google.com/rss/search?q=<query>&hl=es-419&gl=CR&ceid=CR:es-419`. Multi-query: CCSS, Hacienda, CENAT. Cubre instituciones bloqueadas vía agregación de prensa CR (La Nación, El Financiero, crhoy, El Observador, Diario Extra, monumental, Semanario Universidad, etc.). Política: prensa, no fuente oficial — cada candidato exige validación contra fuente primaria antes de cualquier `add`/`update`. |
| Hacienda (Tier B, best-effort) | `extractLinks` en `hacienda.ts` | Playwright headless contra `/noticias` y `/`. Pasa el WAF que rechaza fetch/curl, pero las noticias cargan vía AJAX no-detectable en HTML inicial. Cobertura real de Hacienda viene por `google-news.ts`. Si el sitio expone un endpoint listable en el futuro, este scraper queda listo. |

**Fuentes Tier B descartadas como scraper directo** (cubiertas vía `google-news.ts`):
- **CCSS** (`ccss.sa.cr`): timeout TCP total desde IPs no-CR. Subdominios `prensa.`, `transparencia.` igual bloqueados. Inviable sin proxy residencial CR.
- **CENAT** (`cenat.ac.cr`): sitio HTML estático sin feed ni sección de noticias unificada. Subdominios (PRIAS, CNCA, etc.) tampoco exponen feeds.
