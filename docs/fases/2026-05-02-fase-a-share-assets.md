---
fase: A (paralela, no numerada en roadmap técnico)
titulo: Página /comparte con assets descargables para LinkedIn
fecha_aprobacion: 2026-05-02
estado: aprobado
aprobado_por: Mario Pérez Edwards
ventana_critica: mayo-agosto 2026 (primeros 100 días del nuevo gobierno)
objetivo: convertir lo que ya está construido en autoridad pública visible antes de las reuniones MICITT en junio
---

# Observatorio IA — Fase A: Assets compartibles

## Contexto

Fases 1-5 entregadas. El sitio tiene 16 proyectos, 6 instituciones, 3 visualizaciones interactivas, /analisis con brechas y benchmarks regionales, scrapers automatizados con PR para revisión humana. **El cuello de botella ya no es construir más, es hacer que llegue a quien tiene que llegar.**

Los 5 posts de LinkedIn ya están escritos en Obsidian (`linkedin/post-01..05.md`) pero pendientes de publicación. Falta material visual share-friendly que acompañe los posts, y falta editar copy para que linkeen a páginas concretas del observatorio (no solo a la home).

Esta Fase A es paralela al roadmap técnico (no es Fase 6); es la palanca de **distribución** que convierte el inventario técnico en thought leadership público antes de junio.

## Alcance Fase A

### 1. Página `/[locale]/comparte` (no indexable, no en Nav)

Página pública pero sin link en Nav (acceso directo por URL). Lista los assets descargables organizados por tipo. Componente único `<AssetGalleryGrid>` con:

- **Assets verticales (1080×1080, formato Instagram/LinkedIn cuadrado)**:
  - `timeline-2018-2026.png` — captura del componente Timeline con header propio
  - `chart-ilia-2025.png` — chart Recharts CR vs LATAM con CR destacado
  - `mapa-instituciones.png` — treemap de proyectos por institución
  - `brecha-x-road.png`, `brecha-gobernanza.png`, `brecha-chatbot.png` — una por cada brecha-card
  - `kpi-hero-16-proyectos.png` — números grandes "16 proyectos / 6 instituciones / 3 leyes / 5° ILIA"

- **Assets horizontales (1200×630, link preview/OpenGraph)**:
  - `og-home.png`, `og-analisis.png`, `og-brechas.png`

- **Assets vertical-story (1080×1920, Stories/Reels)**:
  - `story-timeline.png`, `story-brecha-19-puntos.png`

Cada asset es un `<a download href="/comparte-assets/<archivo>.png">` con preview thumbnail y label descriptivo. Click descarga directo.

### 2. Generar los assets

Estrategia: **componentes React específicos** que renderizan cada asset en su tamaño exacto, usados por un script Node + Playwright headless que captura screenshots PNG de cada uno.

- Crear `src/app/[locale]/comparte/_assets/page.tsx` (ruta no indexable, accesible con dimensiones específicas vía query params).
- Cada asset es un componente que recibe `width` y `height` (1080×1080, 1200×630, 1080×1920) y renderiza con margen interno + branding "observatorioia.org" abajo.
- Script `scripts/generate-share-assets.ts` (Node + Playwright) abre cada URL, captura PNG en la dimensión exacta, escribe a `public/comparte-assets/`.

Output queda versionado (no requiere build dinámico, son archivos estáticos).

### 3. Editar los 5 posts de LinkedIn (Obsidian)

Update de cada `linkedin/post-XX.md` para:
- Agregar al final: link específico a observatorioia.org (ej: `/es/proyectos/ccss-lidia` para post sobre LIDIA, `/es/analisis` para post sobre brechas).
- Sugerir asset visual del bloque `/comparte` (ej: "Adjuntar `chart-ilia-2025.png`").
- Mantener el texto curado por Mario, solo agregar bloques final de "Link al detalle" + "Visual sugerido".

### 4. Update OpenGraph del sitio

Reemplazar las imágenes OG genéricas actuales (que probablemente son blank) con las generadas en paso 2:
- `src/app/[locale]/layout.tsx` → metadata.openGraph.images apunta a `/comparte-assets/og-home.png`
- Páginas detalle con OG propio: `/proyectos/[id]` usa imagen genérica salvo que el proyecto tenga una designada; `/analisis` usa `og-analisis.png`; `/quien-mantiene` usa `og-home.png`.

Esto hace que cuando alguien comparta cualquier link del observatorio en LinkedIn/Twitter/Slack, aparezca preview visual con branding consistente.

## Archivos a crear / modificar

**Nuevos**:
- `src/app/[locale]/comparte/page.tsx` — galería de assets descargables.
- `src/app/[locale]/comparte/_assets/page.tsx` — vista interna por asset+dimensión (no indexable).
- `src/components/AssetGalleryGrid.tsx`, `src/components/share/AssetTimeline.tsx`, `AssetChartIlia.tsx`, `AssetMapaInstituciones.tsx`, `AssetBrecha.tsx`, `AssetKpiHero.tsx`, `AssetOgGeneric.tsx`, `AssetStoryTimeline.tsx`, `AssetStoryBrecha.tsx`.
- `scripts/generate-share-assets.ts` — Playwright headless que captura los PNGs.
- `public/comparte-assets/<archivo>.png` (versionados, ~10-15 archivos).

**A modificar**:
- `src/i18n/dictionaries.ts` — bloque `comparte` (titulo, sub, etiquetas de assets, instrucciones).
- `src/app/[locale]/layout.tsx` — metadata.openGraph.images con OG real.
- `src/app/[locale]/{analisis,quien-mantiene,proyectos/[id],instituciones/[id]}/page.tsx` — OG por sección.
- `package.json` — script `generate-assets`.
- `CLAUDE.md` — documentar el flujo de assets.

**Obsidian (paralelo, no toca repo)**:
- `Projects/CR-IA-Gobierno/linkedin/post-01..05.md` — edits de copy con links + visual sugerido.

## Decisiones técnicas

- **No usar canvas o servicios externos**: los assets son componentes React que ya tenemos, capturados con Playwright. Mantenemos consistencia visual con el sitio.
- **Branding**: cada asset incluye footer "observatorioia.org · Mayo 2026" abajo a la derecha.
- **Tipografía**: misma Inter del sitio, tamaños escalados al canvas del asset.
- **Paleta**: misma `institucional-700/900` + slate.
- **No noindex en `/comparte`**: la página de galería sí es pública (puede aparecer en Google si alguien la descubre); los assets sí son indexables como imágenes. La ruta `_assets/` interna sí va con noindex (es solo herramienta de generación).

## Verificación

1. `npm run build` — debe seguir generando 52 páginas + 2 nuevas (`/es/comparte`, `/en/comparte`) = 54 estáticas.
2. `npm run generate-assets` (script local, Playwright) — produce los ~15 PNGs en `public/comparte-assets/`.
3. Inspección manual: cada PNG es legible, tiene branding, dimensión exacta correcta.
4. Compartir un link a `/es/analisis` en LinkedIn (o usar https://www.opengraph.xyz/ para preview): debe mostrar la imagen OG correcta.
5. Recorrer `/es/comparte`: cada asset descarga al click; thumbnails se ven bien en mobile y desktop.

## Fuera de alcance

- Generación dinámica de assets (cada cambio en data requiere correr `generate-assets` localmente y commitear los PNGs).
- Plantillas para otros idiomas más allá de ES/EN.
- Post automation a LinkedIn (Mario los publica manualmente).
- Analytics de cuáles assets se descargaron más (Fase posterior si se necesita).

## Post-Fase A: lista de publicación LinkedIn

Cronograma sugerido (Mario decide cadencia exacta):
- Lunes 5 mayo: Post 1 (introducción + screenshot timeline) → link a `/es/`
- Miércoles 7 mayo: Post 5 priorizado (elecciones + ENIA sin ejecutor) → link a `/es/analisis`
- Lunes 12 mayo: Post 4 (caso Poder Judicial) → link a `/es/instituciones/poder-judicial`
- Miércoles 14 mayo: Post 2 (Uruguay benchmark) → link a `/es/analisis`
- Lunes 19 mayo: Post 3 (5 quick wins) → link a sección específica del análisis

(Cronograma se actualiza en `Projects/CR-IA-Gobierno/avance/tracker.md` cuando Fase A se entregue.)
