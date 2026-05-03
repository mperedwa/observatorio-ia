---
fase: 4
titulo: Visualizaciones (timeline + chart ILIA + mapa instituciones)
fecha_aprobacion: 2026-05-02
estado: aprobado
aprobado_por: Mario Pérez Edwards
ventana_critica: mayo-agosto 2026
---

# Observatorio IA — Fase 4: Visualizaciones

## Contexto

Fase 3 entregó cobertura ampliada: 16 proyectos, 6 instituciones, /analisis con brechas, todo bilingüe. El sitio ya tiene la información que justifica reuniones con MICITT. La siguiente palanca es **convertir esa data en piezas visuales compartibles** que aceleren el thought leadership en LinkedIn durante la ventana política (mayo-agosto 2026).

Decisiones: 3 visualizaciones completas, estilo balanceado (estética limpia para screenshot + tooltips en hover + drill-down simple por click; sin filtros).

## Alcance Fase 4

### 1. Timeline de adopción 2018-2026 (`TimelineAdopcion`)

Línea de tiempo horizontal con los 16 proyectos posicionados por su año `desde`:
- 2018 (ChatbotPJ) → 2019 (ML presupuestal PJ) → 2023 (Nymiz, MEP-Intel, LIDIA) → 2024 (Hacienda fraude, Giro Continuo, Clasificación cobros) → 2025 (Sala IV, TEC-CCSS, LINC, TRIBU-CR) → 2026 (AIDA).
- Eje X: años; eje Y: agrupación por institución (color por institución).
- Cada proyecto = dot/barra etiquetada, hover muestra título y resultado, click navega a `/proyectos/[id]`.
- Componente client React con SVG/CSS custom (sin librería pesada).
- Ubicación: home, justo después del Hero.

### 2. Chart ILIA con drill-down (refactor de `Indicadores`)

Reemplazar la tabla/lista actual de `Indicadores.tsx` con un chart de barras horizontal visual (Recharts):
- 5 países comparados, CR destacado en color de acento, valor visible al final de cada barra.
- Hover sobre barra: tooltip con país, score, inversión y ente ejecutor.
- Click sobre cualquier barra: navega a `/[locale]/analisis` (drill-down al contexto completo).
- Mantiene anclaje `#indicadores` y los strings ya traducidos.
- Ubicación: home, mismo lugar que el componente actual.

### 3. Mapa de proyectos por institución (`MapaProyectos`)

Treemap-style HTML/CSS (no geográfico) que muestra los 16 proyectos agrupados visualmente por institución:
- 6 columnas/bloques (uno por institución), proporcionalmente al número de proyectos.
- Cada celda = proyecto con título corto, color por estado (operativo/piloto/planificado).
- Hover: tooltip con descripción.
- Click: navega a `/proyectos/[id]`.
- Ubicación: home, después de `InstitucionesGrid` (sección "panorama").

### 4. Strings i18n y Nav

- `dictionaries.ts`: agregar bloques `timeline`, `panorama` (etiquetas, kicker, sub) ES/EN.
- `Nav.tsx`: nuevos anchors `#panorama` y `#timeline` opcionales (no obligatorios; los 3 viven en home).

## Archivos a crear / modificar

**Nuevos**:
- `src/components/TimelineAdopcion.tsx` (client component, SVG/CSS).
- `src/components/MapaProyectos.tsx` (client component, CSS grid).
- `src/components/ChartILIA.tsx` (client component, Recharts BarChart).

**A modificar**:
- `src/components/Indicadores.tsx` — usar `ChartILIA` para reemplazar la lista actual; mantener brecha textual debajo.
- `src/app/[locale]/page.tsx` — insertar `TimelineAdopcion` después de Hero, `MapaProyectos` después de InstitucionesGrid.
- `src/i18n/dictionaries.ts` — agregar bloques nuevos.
- `package.json` — `npm install recharts`.
- `CLAUDE.md` — actualizar "Estado" a Fase 4 entregada.

## Verificación

1. `npm run build` — debe seguir generando 52 páginas estáticas sin errores. Recharts es tree-shakeable; bundle no debería crecer drásticamente.
2. `npm run dev` y recorrer:
   - Home `/es/`: Hero → Timeline (los 16 proyectos visibles, ordenados por año) → Instituciones → Mapa (6 grupos) → Legislación → Indicadores (chart de barras CR destacado) → Recursos → Acerca.
   - Hover sobre dot del timeline muestra tooltip; click navega a detalle.
   - Hover sobre celda del mapa muestra descripción; click navega a detalle.
   - Hover sobre barra ILIA muestra país + score + inversión; click navega a `/analisis`.
   - Toggle ES↔EN traduce todos los labels nuevos.
3. Screenshot test: cada visualización aislada se ve bien capturada para LinkedIn (alto contraste, sin elementos cortados).
4. Mobile: las 3 visualizaciones funcionan en pantalla angosta (timeline scrollea horizontal o se apila; mapa colapsa a una columna; chart se mantiene legible).

## Fuera de alcance (Fase 5+)

- Filtros por categoría/estado (sin UI de filtrado todavía).
- Animaciones de entrada (entry transitions).
- Scrapers automatizados (Fase 5).
- Clasificación LLM y API pública (Fase 6).
