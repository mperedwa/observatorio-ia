---
fase: 5
titulo: Scrapers automatizados (MICITT + CAMTIC + Asamblea)
fecha_aprobacion: 2026-05-02
estado: aprobado
aprobado_por: Mario Pérez Edwards
ventana_critica: mayo-agosto 2026
---

# Observatorio IA — Fase 5: Scrapers automatizados

## Contexto

Fases 1-4 entregadas. El sitio tiene 16 proyectos y 6 instituciones, todo curado manualmente. Cada actualización requiere editar `src/data/*.ts`, hacer commit, push, redeploy. Esto no escala cuando el catálogo crezca y limita la frecuencia de actualización.

Fase 5 introduce **detección automática de cambios en fuentes oficiales**, manteniendo el control editorial humano: los scrapers no publican directamente, abren un PR con el diff propuesto que Mario revisa y mergea.

Decisiones acordadas:
- **Alcance**: 3 fuentes (MICITT + CAMTIC + Asamblea Legislativa).
- **Flujo de publicación**: PR automático para revisión humana, no auto-commit.
- **Frecuencia**: 3 veces por semana (lunes, miércoles, viernes 12:00 UTC = 6am CR).

## Arquitectura

```
fuentes oficiales
    ↓ (Playwright headless 3x/semana via GitHub Actions)
scrapers/*.ts
    ↓ (genera diff propuesto)
.scrapers/diff-<fecha>.json
    ↓ (apply-diff.ts valida vs schemas AJV)
src/data/json/*.json (modificado)
    ↓ (GitHub Actions)
PR contra main con etiqueta scraper-auto + needs-review
    ↓ (Mario revisa diff, mergea)
push a main → Vercel redeploy → producción
```

**Principio rector**: el scraper nunca toca campos editoriales (`contexto`, `lecciones`, `resumen` curado). Solo actualiza campos verificables (`estado`, `desde`, `resultado` cuando la fuente cita métricas) y propone nuevos candidatos como entradas marcadas (`candidato: true`) para que Mario decida.

## Etapas

### Etapa 1: Migración datos `.ts` → `.json` + AJV

Pre-requisito para que los scrapers actualicen datos sin tocar código.

**A crear**:
- `src/data/json/proyectos.json`, `instituciones.json`, `legislacion.json`, `indicadores.json`, `brechas.json`
- `src/data/schemas/proyecto.schema.json`, `institucion.schema.json`, `expediente.schema.json`, `brecha.schema.json`, `indicador.schema.json` (AJV-compatible)
- `src/data/loader.ts` que carga los JSONs, valida en build con AJV y los exporta tipados

**A modificar**:
- `src/data/proyectos.ts`, `instituciones.ts`, etc. → quedan como reexports del loader (mantiene API actual sin tocar componentes)

**Verificación**: `npm run build` sigue produciendo 52 páginas idénticas.

### Etapa 2: Scaffolding de scrapers

**A crear**:
- `scrapers/lib/diff.ts` — compara estado actual vs scraped, genera diff legible
- `scrapers/lib/validator.ts` — wrapper AJV
- `scrapers/lib/source.ts` — helper común de fetch (Playwright headless o node-fetch+cheerio)
- `scrapers/run-all.ts` — orquesta los 3 scrapers, escribe diff consolidado

**Deps nuevas (devDependencies)**:
- `playwright` (browsers en CI, no se instala local por default)
- `ajv` + `ajv-formats`
- `cheerio` (fallback para Asamblea SharePoint)

**Scripts npm**:
- `scrape:micitt`, `scrape:camtic`, `scrape:asamblea`, `scrape:all`
- `validate-data` (corre AJV contra JSONs)

### Etapa 3: Scrapers concretos

**`scrapers/micitt.ts`** — Drupal en `micitt.go.cr`:
- Lista comunicados/noticias filtrando por palabras clave: "inteligencia artificial", "ENIA", "LINC", "IA"
- Extrae: título, fecha, URL, resumen
- Output: candidatos a nuevos proyectos o actualizaciones a `instituciones[micitt].descripcion`

**`scrapers/camtic.ts`** — WordPress en `camtic.org`:
- Lista publicaciones recientes filtradas por categoría/tag relacionado a IA
- Extrae: título, fecha, URL, resumen
- Output: candidatos a sección "Recursos" o detección de movimientos del sector que afectan los expedientes legislativos

**`scrapers/asamblea.ts`** — Asamblea Legislativa:
- Endpoints públicos para 3 expedientes (23.771, 23.919, 24.484)
- Detecta cambios de estado (en-comision → primer-debate → etc.) y nueva fecha de movimiento
- Fallback: si SharePoint bloquea Playwright headless, usa `node-fetch` + `cheerio` con headers de browser
- Output: actualiza `estado` y `presentado` en `legislacion.json`

### Etapa 4: GitHub Action

`.github/workflows/scrape.yml`:
- Trigger: cron `0 12 * * 1,3,5` (12:00 UTC lun/mié/vie) + manual dispatch
- Steps:
  1. Checkout
  2. Setup Node.js + cache
  3. Install deps
  4. Cache Playwright browsers
  5. `npm run scrape:all`
  6. `npm run validate-data`
  7. Si hay cambios: crear branch `auto/scrape-YYYY-MM-DD-HHMM`, commitear, abrir PR contra main con etiquetas `scraper-auto`, `needs-review`. Cuerpo del PR muestra diff legible
  8. Si no hay cambios: skip silencioso

### Etapa 5: Documentación y onboarding

- `scrapers/README.md` con cómo correr local, cómo agregar nuevo scraper, cómo manejar selector breakage
- Update `CLAUDE.md` con scripts npm y política editorial scraper
- Update Obsidian (`observatorio-ia-proyecto.md` + `tracker.md`)

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Sitio fuente cambia HTML, scraper falla | GitHub Action falla visiblemente → email a Mario. README documenta cómo actualizar selectors. |
| SharePoint Asamblea bloquea Playwright headless | Fallback `node-fetch` + `cheerio` con `User-Agent` real. |
| Scraper propone dato erróneo | PR review humano evita publicación. Mario rechaza/corrige antes de mergear. |
| Browsers Playwright pesados (~400MB) | Solo en CI; cache GHA. Local sin Playwright por default (script aparte). |
| Datos editoriales curados se sobreescriben | Política: scraper jamás toca `contexto`, `lecciones`, `resumen`. Validación en `apply-diff.ts`. |

## Verificación

1. `npm run build` post-migración: 52 páginas idénticas, sin diferencias visuales.
2. `npm run validate-data`: AJV pasa sin errores.
3. `npm run scrape:micitt` local: produce diff válido sin commitear.
4. Push del scraper code a main → primera corrida del Action funciona (manual dispatch).
5. Modificar localmente un dato (ej: borrar un proyecto del JSON), correr scraper, verificar que el PR auto lo propone de regreso.
6. PR auto-generado tiene diff visible y etiquetas correctas.

## Fuera de alcance (Fase 6+)

- Pipeline PDF para extraer texto de leyes (mover a Fase 6 si se necesita).
- Scrapers adicionales: MEP, CCSS, CENAT, Poder Judicial, Hacienda (después de validar approach con los 3 actuales).
- Clasificación LLM de noticias scrapeadas (Fase 6).
- Alertas semánticas vía Telegram/email (Fase 6).
- API pública JSON read-only.
