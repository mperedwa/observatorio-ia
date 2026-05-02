# Observatorio IA Costa Rica

Sitio público que mapea proyectos, legislación e indicadores de inteligencia artificial en el sector público costarricense. Dominio: observatorioia.org.

## Stack
- Next.js 14 (App Router) con `output: 'export'` — sitio 100% estático
- TypeScript estricto
- TailwindCSS + paleta institucional (`institucional-*` extendida en `tailwind.config.ts`)
- Datos en `src/data/*.ts` (TypeScript exports). Migrar a JSON en Fase 2 cuando los scrapers los pueblen.

## Comandos
```bash
npm run dev        # local dev (Webpack — Next 14 no tiene Turbopack default; sin leak)
npm run build      # genera out/ con HTML/CSS/JS estáticos
npm run start      # sirve la build (no usar para edición)
```

## Estructura
- `src/app/` — root layout + redirect page.tsx (`/` → `/es/`)
- `src/app/[locale]/` — layout + page.tsx home por idioma (`generateStaticParams` produce `es` y `en`)
  - `proyectos/[id]/page.tsx` — detalle por proyecto (22 páginas: 11 × 2 locales)
  - `instituciones/[id]/page.tsx` — detalle por institución (10 páginas: 5 × 2)
  - `analisis/page.tsx` — brechas y benchmarks regionales (público parcial del plan maestro)
  - `quien-mantiene/page.tsx` — autoría, metodología y contacto
- `src/i18n/` — `config.ts` (locales, tipo `Bilingual`) + `dictionaries.ts` (UI strings ES/EN tipados con `Dictionary`)
- `src/components/` — Hero, InstitucionesGrid, Legislacion, Indicadores, Recursos, Acerca, Nav, Footer, LanguageToggle, Breadcrumb, ProyectoCard, BrechaCard. Todos reciben `locale` y/o `t: Dictionary` por props.
- `src/data/` — fuente de verdad. **Strings de UI son `Bilingual = {es, en}`**, no strings planos. Campos no-traducibles (URLs, IDs, números, años) quedan como string/number plano.
  - `instituciones.ts` — 5 instituciones con `nombre`, `nombreCorto`, `resumen`, `descripcion`, `lecciones` bilingües
  - `proyectos.ts` — 11 proyectos con `titulo`, `descripcion`, `resultado`, `contexto` bilingües
  - `legislacion.ts` — 3 expedientes con `titulo`, `resumen`, `comision` bilingües
  - `indicadores.ts` — ILIA score 2025, comparativa regional ampliada, KPIs hero
  - `brechas.ts` — 7 capacidades faltantes vs Estonia/Singapur (extracto público parcial del plan maestro)
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
- Español de Costa Rica, sin guiones largos en copy ES (ver CLAUDE.md global de Mario). Inglés americano.
- Citas: cada dato debe tener `fuenteUrl` apuntando al documento original oficial.
- Estados: `operativo` / `piloto` / `planificado` para proyectos; estados legislativos siguen Asamblea.
- Tipografía: Inter (Google Fonts) — sans-serif limpia, headers grandes con números prominentes.
- Paleta: azul institucional `institucional-700/900` para acento, slate para texto, blanco/`slate-50` para fondos.

## Agregar contenido nuevo
- Cualquier string nuevo expuesto al usuario debe ir como `Bilingual` o entrar al diccionario.
- Si solo tienes la versión ES, escríbela en ambos campos y marca el EN como TODO en el commit; nunca dejes el campo en blanco (rompe tipos).

## Despliegue (próximo)
- Hosting: Vercel o Cloudflare Pages (gratis para static sites).
- Custom domain: observatorioia.org (ya comprado en Namecheap).

## iCloud build conflicts
El proyecto vive en `~/Desktop/Proyectos/` (sincronizado por iCloud Drive). Cuando dos `npm run build` corren contra el mismo `out/` en cierta ventana, iCloud crea duplicados con sufijo ` 2` (`out/_next 2`, `out/en 2`, etc.) y Next aborta el paso "Finalizing page optimization" con `ENOTEMPTY`, dejando subdirectorios vacíos (típicamente `out/en/` queda en 0 bytes). Si la build estática no genera todas las páginas:
1. `ls out/` y revisar dirs con sufijo ` 2`
2. Moverlos a `.icloud-trash/` (no borrar — pueden ser conflictos legítimos): `mv "out/en 2" .icloud-trash/`
3. Re-correr `npm run build`
4. Verificar `ls out/en/ out/es/` — ambos deben tener `index.html`

## Estado
Fase 2 entregada (mayo 2026): profundidad de contenido. 43 páginas estáticas: home + análisis + quien-mantiene + 11 proyectos + 5 instituciones, todo bilingüe. Plan archivado en `docs/fases/2026-05-02-fase-2-profundidad-contenido.md`. Próximas fases:
- Fase 3: scrapers automatizados (Playwright MICITT/CAMTIC + GitHub Actions cron) — reagendado desde la Fase 2 original
- Fase 4: timeline cronológico + charts con drill-down + búsqueda Fuse.js
- Fase 5: clasificación LLM + alertas + API pública

## Separación contenido público / privado
La sección `/analisis` y los textos de `contexto`/`lecciones`/`brechas` son extractos editoriales del plan maestro privado (Obsidian `Projects/CR-IA-Gobierno/`). **Lo que SÍ va público**: diagnóstico de brechas, benchmarks regionales, evidencia verificable. **Lo que NO va público**: recomendaciones tácticas de política pública, presupuesto USD 18-32M, plan de contacto MICITT, fellowship IA, plan de fundraising, fechas de reuniones. Antes de cada commit que toque `src/data/brechas.ts`, `src/data/instituciones.ts` (campo `lecciones`), `src/data/proyectos.ts` (campo `contexto`) o `src/i18n/dictionaries.ts` (bloque `analisis`), grep contra términos sensibles del plan maestro.

## NO hacer
- **NO usar Next.js 16** — bug conocido del Turbopack dev en macOS revienta RAM (ver CLAUDE.md global). Si se actualiza, default a `next dev --webpack`.
- **NO inventar proyectos**: si un dato no está en el scoping/research de Obsidian, no lo pongas. Pedir verificación a Mario.
- **NO publicar recomendaciones tácticas del plan maestro** en el observatorio. Las brechas y la evidencia son públicas; las recomendaciones se reservan para reuniones cara a cara.
- **NO publicar sin revisión** mientras esté en MVP — orquestador (cortextOS) coordina los GO de Mario.
