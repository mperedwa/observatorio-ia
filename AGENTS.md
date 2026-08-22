# Observatorio IA Costa Rica

Sitio público que mapea proyectos, legislación e indicadores de inteligencia artificial en el sector público costarricense. Dominio: observatorioia.org.

## Stack
- Next.js 14 (App Router) con `output: 'export'` — sitio 100% estático
- TypeScript estricto
- TailwindCSS + paleta institucional (`institucional-*` extendida en `tailwind.config.ts`)
- Datos fuente en `src/data/json/*.json`, validados con AJV y reexportados con tipos desde `src/data/*.ts`.

## Comandos
```bash
npm run dev        # local dev (Webpack — Next 14 no tiene Turbopack default; sin leak)
npm run build      # genera out/ con HTML/CSS/JS estáticos
npm run start      # sirve la build (no usar para edición)
```

## Estructura
- `src/app/` — root layout + redirect page.tsx (`/` → `/es/`)
- `src/app/[locale]/` — layout + page.tsx home por idioma (`generateStaticParams` produce `es` y `en`)
  - `proyectos/[id]/page.tsx` — detalle por iniciativa (58 páginas: 29 × 2 locales)
  - `instituciones/[id]/page.tsx` — detalle por institución (18 páginas: 9 × 2)
  - `analisis/page.tsx` — brechas y benchmarks regionales (público parcial del plan maestro)
  - `quien-mantiene/page.tsx` — autoría, metodología y contacto
- `src/i18n/` — `config.ts` (locales, tipo `Bilingual`) + `dictionaries.ts` (UI strings ES/EN tipados con `Dictionary`)
- `src/components/` — Hero, TimelineAdopcion, InstitucionesGrid, MapaProyectos, Legislacion, Indicadores (incluye ChartILIA con Recharts), Recursos, Acerca, Nav, Footer, LanguageToggle, Breadcrumb, ProyectoCard, BrechaCard. Todos reciben `locale` y/o `t: Dictionary` por props. Las visualizaciones de Fase 4 (TimelineAdopcion, ChartILIA, MapaProyectos) son client components con tooltips en hover y drill-down al click.
- `src/data/` — fuente de verdad. Datos viven como **JSON validable con AJV** en `src/data/json/`; los `.ts` son reexports tipados. **Strings de UI son `Bilingual = {es, en}`**, no strings planos. Campos no-traducibles (URLs, IDs, números, años) quedan como string/number plano.
  - `json/instituciones.json` (9 instituciones)
  - `json/proyectos.json` (29 iniciativas)
  - `json/legislacion.json` (7 expedientes)
  - `json/eniaAcciones.json` (129 registros fuente, 120 intervenciones únicas)
  - `json/monitoreo.json` (8 frentes, cadencias y bitácora editorial)
  - `json/indicadores.json` (ilia2025 + comparativaRegional + kpisHero)
  - `json/brechas.json` (7 brechas vs Estonia/Singapur)
  - `schemas/*.schema.json` — JSON Schema draft-07 que valida cada dataset (ejecutar con `npm run validate-data`)
  - `proyectos.ts`, `instituciones.ts`, etc. — interfaces TS + reexports del JSON correspondiente
- `out/` — output del build estático

## Datos — fuente de verdad

Toda la información viene del scoping en Obsidian: `Projects/CR-IA-Gobierno/`. Antes de actualizar `src/data/*.ts`, consultar:
- `cr-ia-linea-base-kpis.md` — KPIs y línea base
- `research/cr-ia-research-2-proyectos.md` — proyectos con fuentes URL
- `cr-ia-plan-maestro.md` — visión general del proyecto
- `observatorio-scoping.md` — scoping técnico completo

## Convenciones
- Lenguaje: **bilingüe ES/EN**. Default es `es`. Locale por URL: `/es/` y `/en/`. Toggle ES|EN en navbar (esquina superior derecha) vía `LanguageToggle`.
- Strings públicos en `src/data/` son `Bilingual = {es, en}`; UI strings en `src/i18n/dictionaries.ts`.
- Español de Costa Rica, sin guiones largos en copy ES (ver AGENTS.md global de Mario). Inglés americano.
- Citas: cada dato debe tener `fuenteUrl` apuntando al documento original oficial.
- Estados: `operativo` / `piloto` / `planificado` para proyectos; estados legislativos siguen Asamblea.
- Tipografía: Source Serif 4 para títulos editoriales e Inter para interfaz y cuerpo; números prominentes cuando aporten jerarquía documental.
- Paleta: azul institucional `institucional-700/900` para acento, slate para texto, blanco/`slate-50` para fondos.

## Agregar contenido nuevo
- Cualquier string nuevo expuesto al usuario debe ir como `Bilingual` o entrar al diccionario.
- Si solo tienes la versión ES, escríbela en ambos campos y marca el EN como TODO en el commit; nunca dejes el campo en blanco (rompe tipos).

## Despliegue (próximo)
- Hosting: Vercel o Cloudflare Pages (gratis para static sites).
- Custom domain: observatorioia.org (ya comprado en Namecheap).

## iCloud build conflicts (histórico, ya no aplica)
El proyecto VIVÍA en `~/Desktop/Proyectos/` (sincronizado por iCloud Drive). Movido a `~/Code/` el 2026-05-04 precisamente para escapar de iCloud. Histórico: cuando dos `npm run build` corrían contra el mismo `out/` en cierta ventana, iCloud creaba duplicados con sufijo ` 2` (`out/_next 2`, `out/en 2`, etc.) y Next abortaba el paso "Finalizing page optimization" con `ENOTEMPTY`, dejando subdirectorios vacíos (típicamente `out/en/` quedaba en 0 bytes). Ya no aplica desde la migración. Si la build estática alguna vez no genera todas las páginas:
1. `ls out/` y revisar dirs con sufijo ` 2`
2. Moverlos a `.icloud-trash/` (no borrar — pueden ser conflictos legítimos): `mv "out/en 2" .icloud-trash/`
3. Re-correr `npm run build`
4. Verificar `ls out/en/ out/es/` — ambos deben tener `index.html`

## Estado
Fase 5C entregada localmente (2026-08-21): **puesta en marcha operativa del monitoreo**. Handoff legislativo reparado desde `last-run.json`, MIDEPLAN con respaldo restringido a URLs oficiales, Google News para las 9 instituciones más un frente transversal, agenda editorial idempotente con issues/Telegram, revisor sin stubs/push/deploy y pruebas E2E. El workflow nuevo no queda activo hasta un push explícitamente autorizado.

Rediseño editorial R1-R8 entregado localmente (2026-08-22): dirección **observatorio editorial de evidencia pública** o archivo cívico contemporáneo. El plan ejecutable está en `docs/plan-redisenio-editorial-2026-08-22.md`. R1 estableció Source Serif 4, papel/tinta/reglas, portada superior y catálogo horizontal; R2 convirtió la portada en síntesis editorial y añadió navegación e índices; R3 convirtió instituciones y fichas en registros y expedientes; R4 convirtió ENIA, Marco país, legislación e historial en documentos continuos; R5 alineó Indicadores, Análisis, artículos, superficies secundarias y 32 activos bilingües; R6 cerró contraste WCAG AA, teclado, idioma HTML, movimiento reducido, rendimiento y auditoría del export; R7 incorporó `/api/` y `/api/en/` como documentación editorial bilingüe; R8 convirtió la exportación en un producto de datos reproducible con doce rutas, codebook, procedencia, schemas de respuesta y datos, release bloqueada, checksums, bundle JSON y CSV. `npm run audit:static` revisa 143 HTML, 140 localizados y su paridad ES/EN. Lighthouse obtiene 100 en accesibilidad, buenas prácticas y SEO en plantillas indexables representativas; la API alcanza además 100 de rendimiento en ES móvil y EN escritorio. El candidato espera revisión visual final de Mario; no hacer push, desplegar ni activar workflows sin autorización explícita posterior.

Fase 5B (mismo día): monitoreo y trazabilidad editorial con ocho frentes, bitácora de cambios y revisiones sin cambios, monitor mensual ENIA/Plan, propuestas de evidencia sin stubs ni altas automáticas, herramienta `record-review` con dry-run y endpoint `/api/monitoreo.json`.

La API pública JSON read-only tiene 12 endpoints + manifest + documentación humana en `/api/` (ES) y `/api/en/` (EN): proyectos, instituciones, legislación, indicadores, brechas, ENIA, monitoreo, Marco país, historial, coyuntura, recursos y codebook. Cada endpoint conserva `{version, lastUpdate, count, source, license, data}`. `/api/schemas/` publica schemas de respuesta y datos; `/api/releases/2026-08-22-r8/` es el primer corte bloqueado; `/api/downloads/` ofrece bundle JSON y tres CSV con SHA-256. Licencia CC BY 4.0 para la compilación y el contenido original del Observatorio; los documentos enlazados conservan sus propios términos.

Antes (mismo día): Fase 8.2 (Tier C: CGR + MIDEPLAN, **10 scrapers** totales, 27 candidatos típicos). Fase 8.1 (Tier B vía Google News + Hacienda Playwright). Fase 8 (Tier A: pj + delfino + citic + `mentionsAI` con word boundaries).

Anteriormente (mayo 2026): Fase 6.1 (notificación Telegram filtrada tras scrape), Fase 6 (clasificador LLM Groq/Llama-3.1-8b-instant), Fase 7 (UCR 7° institución, 18 proyectos), Fase A (assets /comparte), Fase 5 (scrapers MVP + JSON validable).

Próximas fases potenciales:
- Comparación durante 14 días o 6 corridas entre monitoreo automático y revisión manual
- Revisión visual final y decisión explícita de publicación del candidato editorial R1-R8
- Posts LinkedIn 02-05 (campaña ya iniciada con post 01)
- Logo definitivo (Mario revisando 16 opciones Canva + Gemini)
- Vigilancia manual anual: PROSIC reporte estado digital CR (feed vacío hoy)

Datos en `src/data/json/` validados por schemas en `src/data/schemas/`. Los `.ts` quedan como reexports tipados. Política editorial: scrapers nunca tocan campos curados (titulo, descripcion, contexto, lecciones, resumen). Candidatos de Google News y Delfino son **prensa, no fuente oficial** — exigen validación contra fuente primaria. Informes CGR/DFOE son evidencia oficial.

Scripts npm: `audit:static`, `validate-data`, `scrape:micitt`, `scrape:camtic`, `scrape:asamblea`, `scrape:pj`, `scrape:delfino`, `scrape:citic`, `scrape:google-news`, `scrape:hacienda`, `scrape:cgr`, `scrape:mideplan`, `scrape:all`, `watch:enia`, `watch:ilia`, `watch:oecd`, `check-monitoring-due`, `create-monitoring-review-issue`, `record-review`. Detalle en `scrapers/README.md`.

Dependencias nuevas: `recharts@3.8.1` (Fase 4), `ajv@8` + `ajv-formats@3` + `tsx@4` + `playwright@1` + `cheerio@1` (Fase 5, todas devDeps salvo recharts).

## Separación contenido público / privado
La sección `/analisis` y los textos de `contexto`/`lecciones`/`brechas` son extractos editoriales del plan maestro privado (Obsidian `Projects/CR-IA-Gobierno/`). **Lo que SÍ va público**: diagnóstico de brechas, benchmarks regionales, evidencia verificable. **Lo que NO va público**: recomendaciones tácticas de política pública, presupuesto USD 18-32M, plan de contacto MICITT, fellowship IA, plan de fundraising, fechas de reuniones. Antes de cada commit que toque `src/data/brechas.ts`, `src/data/instituciones.ts` (campo `lecciones`), `src/data/proyectos.ts` (campo `contexto`) o `src/i18n/dictionaries.ts` (bloque `analisis`), grep contra términos sensibles del plan maestro.

## NO hacer
- **NO usar Next.js 16** — bug conocido del Turbopack dev en macOS revienta RAM (ver AGENTS.md global). Si se actualiza, default a `next dev --webpack`.
- **NO inventar proyectos**: si un dato no está en el scoping/research de Obsidian, no lo pongas. Pedir verificación a Mario.
- **NO publicar recomendaciones tácticas del plan maestro** en el observatorio. Las brechas y la evidencia son públicas; las recomendaciones se reservan para reuniones cara a cara.
- **NO publicar sin revisión** mientras esté en MVP — orquestador (cortextOS) coordina los GO de Mario.
