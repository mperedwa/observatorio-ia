---
fase: 8.2
titulo: Tier C scrapers — Contraloría (CGR) + MIDEPLAN
fecha_aprobacion: 2026-05-04
estado: entregado
aprobado_por: Mario Pérez Edwards
---

# Observatorio IA — Fase 8.2: Tier C scrapers

## Contexto

Tras Fase 8.1, el observatorio cubre 8 scrapers (asamblea, micitt, camtic, pj, delfino, citic, google-news, hacienda). Tier C era opcional — vigilancia anual de instituciones más periféricas:

- **MIDEPLAN**: Plan Nacional de Desarrollo + indicadores modernización del Estado.
- **Contraloría General (CGR)**: auditorías a sistemas digitales del Estado.
- **PROSIC (UCR)**: reporte anual estado digital de CR.

Smoke tests revelaron viabilidad real:

- ✅ **CGR**: 2 RSS feeds oficiales (`noticias_rss.xml` 14 items + `informes_recientes.xml` 27 items con DFOE PDFs).
- ✅ **MIDEPLAN**: Drupal Views, listado HTML parseable (`<div class="item-noticias views-row">` con `<h2>` + `<a>`).
- ❌ **PROSIC**: RSS oficial existe pero está VACÍO (sin `<item>`). Skip — Mario revisa manualmente cuando salga reporte anual.

## Alcance Fase 8.2

### 1. Scraper `scrapers/cgr.ts`

- **Estrategia**: corre los 2 feeds RSS de CGR en paralelo. Dedup por URL.
- **Filtrado**: `mentionsAI()` + keywords CGR (substrings + word-boundary):
  - Substring: `inteligencia`, `algoritm`, `datos abiertos`, `transformación digital`, `gobierno digital`, `sistema inform`, `fiscalización digital`, `ciberseguridad`, `expediente electrónico`, `firma digital`, `plataforma digital`.
  - Word-boundary: `TIC`, `TICs`, `SICOP`, `EDUS` (para evitar substring match en `licitación`/`noticia`).
- **Política**: candidatos llevan prefijo `[noticia]` o `[informe]`. El system-prompt del classifier LLM ahora le da peso especial a tipo `informe` (auditoría DFOE = evidencia oficial alta credibilidad).
- **Útil para detectar**: críticas técnicas a proyectos catalogados (Poder Judicial, CCSS, Hacienda) en informes DFOE.

### 2. Scraper `scrapers/mideplan.ts`

- **Estrategia**: parsea `https://www.mideplan.go.cr/listado-noticias` y `?page=1` (~20 notas). Drupal Views con cards `<div class="item-noticias views-row">`.
- **Selector**: regex sobre el card → `<h2>titulo</h2>` + primer `<a href="/slug">`.
- **Filtrado**: substring (`inteligencia`, `transformación digital`, `gobierno digital`, `modernización del estado`, `datos abiertos`, `innovación digital`, `plan nacional de desarrollo`, `algoritm`, `cooperación BID/BM`) + word-boundary (`PNDIP`, `ENIA`, `TIC`, `TICs`).
- **Útil para detectar**: actualizaciones del PNDIP con componente IA, cooperación digital internacional (CONECTA Luxemburgo €10M ya aparece).

### 3. Extensión del classifier

- `Source` ampliado a `'micitt' | 'camtic' | 'asamblea' | 'pj' | 'delfino' | 'citic' | 'google-news' | 'hacienda' | 'cgr' | 'mideplan'`.
- System prompt actualizado:
  - Para CGR: priorizar informes de fiscalización (tipo \`informe\`) que mencionen sistemas digitales o auditen proyectos catalogados.
  - Para MIDEPLAN: priorizar PNDIP, modernización del Estado, cooperación con componente digital.

### 4. Orquestador + scripts npm

`run-all.ts` corre los 10 scrapers en serie. Scripts: `scrape:cgr`, `scrape:mideplan`.

## Resultados de prueba (local, 2026-05-04)

```
asamblea       3/3   matched     (sin candidatos, ya catalogados)
micitt        11/0   matched     (sin contenido IA reciente)
camtic        20/4   matched     (Unesco IA Educación, LINC, Equifax/NIST)
pj            20/0   matched     (sin contenido IA reciente)
delfino       21/2   matched     (Asamblea, Transformar info en sabiduría)
citic         10/2   matched     (charla cuántica + IA visión computacional)
google-news  107/14  matched     (12 candidatos: TEC+CCSS, EBAIS, listas espera, ENIA, etc.)
hacienda       0/0   matched     (Playwright OK pero AJAX no-detectable)
cgr           41/2   matched     (2 noticias licitación — LLM las clasificará como ruido)
mideplan      20/5   matched     (5 candidatos: PNDIP 2027-2030, CONECTA Luxemburgo €10M, etc.)

Total: 253 fetched, 32 matched, 27 candidatos
Validación AJV: ✅ OK (5 datasets: 18 proyectos, 7 instituciones, 3 leyes, indicadores, 7 brechas)
```

Sample MIDEPLAN candidatos:
- `Mideplan avanza en formulación del Plan Nacional de Desarrollo e Inversión Pública 2027–2030`
- `Costa Rica inicia proceso PNDIP 2027-2030, alineado con prioridades Administración Fernández Delgado`
- `Luxemburgo y Mideplan impulsan transformación digital de CR mediante proyecto CONECTA con inversión de €10 millones`
- `Mideplan inicia rigurosa verificación de metas del PNDIP 2025`

Sample CGR candidatos:
- `[noticia]` CGR resuelve objeciones en licitación hangares Tobías Bolaños
- `[noticia]` CGR resuelve apelación en Torre de la Esperanza

(Las 2 noticias CGR son falsos positivos por matching de keyword `TIC` en el cuerpo expandido del feed; el LLM las clasificará como score bajo. Política editorial intacta — no se hace `add` automático.)

## Costo

- $0/mes adicional (3 RSS feeds + 1 listing HTML públicos sin auth).
- Sin nuevas dependencias.

## Tier D / vigilancia manual (futuro)

- **PROSIC (UCR)**: cuando publiquen reporte anual.
- **MEIC** (`meic.go.cr`): si emiten regulación AI/data.
- **TSE** (`tse.go.cr`): si despliegan IA en proceso electoral.
- **ICE/SUTEL**: telecomunicaciones + IA, no urgente.

## Próxima fase candidata

**Fase 9 — API pública JSON read-only**: con 27 candidatos detectables semanalmente vía 10 scrapers, vale la pena exponer el catálogo a periodistas/investigadores como `/api/proyectos.json`, `/api/instituciones.json`, `/api/legislacion.json` con headers `application/json` + CORS. Sin backend.
