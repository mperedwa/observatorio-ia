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

# Correr un scraper individual (requiere browsers de Playwright)
npm run scrape:micitt
npm run scrape:camtic
npm run scrape:asamblea

# Correr los 3 + aplicar cambios + escribir reporte
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
│   └── validator.ts    # AJV + cross-checks de integridad
├── micitt.ts           # noticias MICITT (Drupal)
├── camtic.ts           # noticias CAMTIC (WordPress)
├── asamblea.ts         # estado de los 3 expedientes IA
└── run-all.ts          # orquestador, escribe .scrapers/last-run.{json,md}
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
