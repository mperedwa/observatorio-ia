---
fase: 3
titulo: Cobertura ampliada (más proyectos verificables)
fecha_aprobacion: 2026-05-02
fecha_entrega: 2026-05-02
estado: entregada
aprobado_por: Mario Pérez Edwards
ventana_critica: mayo-agosto 2026 (primeros 100 dias del nuevo gobierno)
---

# Observatorio IA — Fase 3: Cobertura ampliada

## Contexto

Fase 1 (MVP) y Fase 2 (profundidad de contenido) ya entregadas. El observatorio está en producción en https://observatorioia.org. Repo público en GitHub conectado a Vercel: cada `git push` redeployea.

La ventana política sigue activa (mayo-agosto 2026, primeros 100 días del nuevo gobierno). Después de Fase 2, la siguiente palanca de mayor impacto político por menor esfuerzo es **ampliar cobertura con proyectos verificables** que ya estaban documentados en el research de Obsidian pero no aparecían en el sitio. Esto refuerza la vitrina antes de las reuniones con MICITT en junio sin agregar deuda técnica.

Decisiones acordadas:
- **Sí** agregar LaNIA + nueva institución CENAT (mostrar ecosistema I+D).
- **No** crear proyecto separado para las 90K becas docentes; queda mencionado en la `descripcion` ampliada del MEP.

Las visualizaciones (timeline, charts) y los scrapers automáticos quedan para Fase 4 y Fase 5 respectivamente.

## Entregado

### Proyectos refinados / nuevos en `src/data/proyectos.ts`

| id | Acción | Institución | Estado | Métrica clave | Fuente |
|---|---|---|---|---|---|
| `ccss-aida` | Refinado (antes `ccss-ebais`) | CCSS | piloto | 15 áreas de salud, expansión nacional planificada 2031 | monumental.co.cr (feb 2026) |
| `ccss-lidia` | Nuevo | CCSS | piloto | 4 modelos predictivos, 95% precisión modelo diabetes, 1M+ pacientes analizados, ¢130M por modelo | teletica.com |
| `pj-giro-continuo` | Nuevo | Poder Judicial | operativo | 223,154 giros / ¢5,245M en 2024 | observador.cr |
| `pj-chatbot` | Nuevo | Poder Judicial | operativo (desde 2018) | sin métricas públicas | transparencia.poder-judicial.go.cr |
| `hacienda-tribu-cr` | Nuevo | Hacienda | operativo (oct 2025) | reemplaza ATV/Travi, integra SINPE Móvil, +140 cambios técnicos en facturación electrónica v4.4 | dfvasesores.com |
| `cenat-lania` | Nuevo | CENAT (nueva) | piloto | 5 laboratorios redireccionados, alianza fAIr LAC del BID | dplnews.com |

**Conteo de proyectos: 11 → 16** (5 nuevos + 1 renombrado/refinado, no 6 nuevos como el plan inicial: AIDA y el antiguo "IA en EBAIS" eran la misma iniciativa; se fundieron en uno con datos precisos).

### Nueva institución CENAT en `src/data/instituciones.ts`

- `id: 'cenat'`
- `tipo: 'investigacion'` (tipo nuevo agregado al union type `Tipo`)
- nombre: "Centro Nacional de Alta Tecnología" / "National Center for High Technology"
- `proyectosActivos: 1`
- resumen + descripcion + lecciones bilingües
- url: https://cenat.ac.cr/

**Conteo de instituciones: 5 → 6.**

### Conteos `proyectosActivos` actualizados

- Poder Judicial: 4 → 6
- CCSS: 3 → 4 (refinamiento + 1 nuevo)
- Hacienda: 2 → 3
- MEP: 1 (sin cambio; descripcion ampliada para mencionar 90K becas docentes con CENECOOP, meta 65,000 docentes formados)
- MICITT: 1 (sin cambio)
- CENAT: nueva con 1

### Tipos extendidos

- `src/data/instituciones.ts` — `Tipo` ahora incluye `'investigacion'`.
- `src/i18n/dictionaries.ts` — `Dictionary.instituciones.tipoLabel.investigacion` agregado.
- ES: "Centro de investigación" / EN: "Research center".

### KPIs hero y diccionarios

- `src/data/indicadores.ts` `kpisHero`:
  - "11 proyectos IA activos" → "16"
  - "5 instituciones con IA operativa" → "6"
  - Detalle institucional: incluye CENAT en español e inglés
- `src/i18n/dictionaries.ts`:
  - `hero.headline`: "11 proyectos…" → "16 proyectos…" (ES y EN)
  - `instituciones.sub`: "Cinco instituciones…" → "Seis instituciones…" (ES y EN)
- `src/data/legislacion.ts`: sin cambios (research confirmó que no hay expedientes nuevos verificables además de los 3 existentes).

### Notas curatoriales

- "Tipificador de Escritos" (Poder Judicial) es la misma iniciativa que `pj-clasificacion-cobros` (mismo conteo de 1,302,899 documentos, mismo juzgado). No se duplicó.
- "Asistente IA Magistrados Sala Primera" es prototipo sin métricas; no se incluyó.
- "Sistema Atena" se mencionó en research sin URL específica verificable; se omitió.
- AIDA y el antiguo "IA en EBAIS" eran la misma iniciativa CCSS; el id `ccss-ebais` se sustituyó por `ccss-aida` con información precisa de las fuentes monumental.co.cr.

## Verificación cumplida

1. `npm run build` → 52 páginas estáticas generadas sin errores TypeScript ni `ENOTEMPTY` de iCloud.
2. `ls out/es/proyectos/` y `ls out/en/proyectos/` → 16 directorios cada uno (incluye `ccss-aida`, `ccss-lidia`, `pj-giro-continuo`, `pj-chatbot`, `hacienda-tribu-cr`, `cenat-lania`).
3. `ls out/es/instituciones/` y `ls out/en/instituciones/` → 6 directorios cada uno (incluye `cenat`).
4. Sin duplicados de iCloud en `out/`.
5. Grep de sanidad contra términos sensibles del plan privado: solo aparecen datos públicos verificables (USD 32M es la inversión Chile en el dataset comparativo regional; "Mónica Taylor" y "fAIr LAC" son referencias públicas a notas de prensa, no contenido del plan privado).
6. `git push origin main` dispara redeploy automático en Vercel.

## Fuera de alcance (Fase 4 y posteriores)

- **Fase 4: Visualizaciones** — chart de barras ILIA con drill-down, línea de tiempo de adopción 2018-2026 (ChatbotPJ desde 2018, ML PJ desde 2019, LIDIA desde 2023, AIDA desde 2026), mapa de proyectos por institución. Compartible en LinkedIn.
- **Fase 5: Scrapers** — Playwright + GitHub Actions cron diario. Migración `.ts` → `.json` con AJV.
- **Fase 6: Inteligencia** — clasificación LLM, alertas semánticas, API pública JSON.
