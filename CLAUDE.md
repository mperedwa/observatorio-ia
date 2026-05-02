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
- `src/app/` — layout + page.tsx (homepage es el único route por ahora)
- `src/components/` — Hero, InstitucionesGrid, Legislacion, Indicadores, Recursos, Acerca, Nav, Footer
- `src/data/` — fuente de verdad de datos del observatorio
  - `instituciones.ts` — 5 instituciones con resumen y conteo de proyectos
  - `proyectos.ts` — 11 proyectos con fuente y resultado cuando aplica
  - `legislacion.ts` — 3 expedientes en trámite
  - `indicadores.ts` — ILIA score 2025 + KPIs hero
- `out/` — output del build estático (gitignored vía `.next/` patrón ya cubre, agregar `out/` explícito si se necesita)

## Datos — fuente de verdad

Toda la información viene del scoping en Obsidian: `Projects/CR-IA-Gobierno/`. Antes de actualizar `src/data/*.ts`, consultar:
- `cr-ia-linea-base-kpis.md` — KPIs y línea base
- `research/cr-ia-research-2-proyectos.md` — proyectos con fuentes URL
- `cr-ia-plan-maestro.md` — visión general del proyecto
- `observatorio-scoping.md` — scoping técnico completo

## Convenciones
- Lenguaje: **español de Costa Rica**, sin guiones largos (ver CLAUDE.md global de Mario).
- Citas: cada dato debe tener `fuenteUrl` apuntando al documento original oficial.
- Estados: `operativo` / `piloto` / `planificado` para proyectos; estados legislativos siguen Asamblea.
- Tipografía: Inter (Google Fonts) — sans-serif limpia, headers grandes con números prominentes.
- Paleta: azul institucional `institucional-700/900` para acento, slate para texto, blanco/`slate-50` para fondos.

## Despliegue (próximo)
- Hosting: Vercel o Cloudflare Pages (gratis para static sites).
- Custom domain: observatorioia.org (ya comprado en Namecheap).

## Estado
Fase 1 MVP — homepage con datos reales (mayo 2026). Próximas fases:
- Fase 2: scrapers automatizados + páginas detalle por proyecto
- Fase 3: timeline cronológico + charts adicionales
- Fase 4: clasificación LLM + alertas + API pública

## NO hacer
- **NO usar Next.js 16** — bug conocido del Turbopack dev en macOS revienta RAM (ver CLAUDE.md global). Si se actualiza, default a `next dev --webpack`.
- **NO inventar proyectos**: si un dato no está en el scoping/research de Obsidian, no lo pongas. Pedir verificación a Mario.
- **NO publicar sin revisión** mientras esté en MVP — orquestador (cortextOS) coordina los GO de Mario.
