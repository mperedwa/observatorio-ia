---
fase: 2
titulo: Profundidad de contenido
fecha_aprobacion: 2026-05-02
estado: aprobado, no iniciado
aprobado_por: Mario Perez Edwards
ventana_critica: mayo-agosto 2026 (primeros 100 dias del nuevo gobierno)
---

# Observatorio IA — Fase 2: Profundidad de contenido

## Contexto

El observatorio (observatorioia.org) es la cara pública del proyecto macro **CR-IA-Gobierno** (plan maestro 2026-2032 en Obsidian). Fase 1 MVP terminó el 2 mayo 2026: home estática bilingüe con 5 instituciones, 11 proyectos, 3 expedientes legislativos e ILIA 2025. Cero deuda técnica, build estable, deploy en Vercel.

La ventana política es **crítica**: gobierno entra el 8 mayo 2026, los primeros 100 días (mayo-agosto) son la única ventana para influir en la agenda del nuevo MICITT. El observatorio debe funcionar como **vitrina de autoridad** que respalde reuniones cara a cara en junio-julio 2026, no como dashboard automático.

Decisiones acordadas:
- **Prioridad**: profundidad de contenido (no scrapers todavía).
- **Contenido analítico**: público parcial — diagnóstico de brechas y benchmarks regionales sí; recomendaciones tácticas del plan maestro **no** (se reservan para negociación).
- El roadmap original de Fase 2 (scrapers Playwright + GitHub Actions) se reagenda como Fase 3.

## Alcance Fase 2

### 1. Páginas detalle por proyecto (`/[locale]/proyectos/[id]`)

Una página por cada uno de los 11 proyectos. Reutilizar tipos de `src/data/proyectos.ts`. Contenido por página:
- Breadcrumb: Inicio › Institución › Proyecto.
- Header: título, institución (link), categoría chip, estado chip, año `desde`.
- Bloque "Qué es": `descripcion` bilingüe.
- Bloque "Resultados verificados": `resultado` bilingüe (cuando exista).
- Bloque "Fuente oficial": link único `fuenteUrl`.
- Bloque "Contexto": párrafo curado por proyecto (campo nuevo `contexto: Bilingual` opcional). Aquí entra el insight que diferencia al observatorio del catálogo crudo.
- Bloque "Proyectos relacionados": misma `categoria` o misma `institucionId`, máximo 3.

Generación estática vía `generateStaticParams`: producto cartesiano `locales × proyectos.id` = 22 páginas. Compatible con `output: 'export'`.

### 2. Páginas detalle por institución (`/[locale]/instituciones/[id]`)

Una página por cada una de las 5 instituciones:
- Header: nombre completo, tipo, link oficial.
- Bloque "Resumen ejecutivo": `resumen` bilingüe ampliado (extender campo o agregar `descripcion: Bilingual` largo).
- Lista de proyectos: filtrar `proyectos.filter(p => p.institucionId === id)` con cards-link a las páginas detalle.
- Bloque "Lecciones de adopción": párrafo curado por institución (campo nuevo `lecciones: Bilingual`). Ejemplo PJ: "Líder por especialización temprana y alianza con UCR/PEN, no por presupuesto IA dedicado".
- Footer: contadores (proyectos operativos / pilotos / planificados).

`generateStaticParams`: 10 páginas (5 instituciones × 2 locales).

### 3. Sección "Brechas y benchmarks" (`/[locale]/analisis`)

Nueva ruta. Es el contenido analítico que diferencia al observatorio de un simple catálogo. Fuente: `cr-ia-plan-maestro.md` y `cr-ia-linea-base-kpis.md`, **filtrado a la versión pública**:

- **Hero analítico**: "Costa Rica perdió 19 puntos vs Chile en ILIA 2025" — encuadre del problema sin recomendaciones tácticas.
- **Comparativa regional**: tabla CR vs Chile, Brasil, Uruguay, Colombia con los 6 sub-índices ILIA (datos ya disponibles en `indicadores.ts`, ampliar el dataset).
- **Mapa de brechas**: 7 capacidades que CR no tiene operativas (interoperabilidad tipo X-Road, marco de gobernanza IA, chatbot ciudadano nacional, asistente para funcionarios, testing IA pre-despliegue, meta de talento con presupuesto, acuerdos de datos transfronterizos). Una tarjeta por capacidad: qué es, qué país la tiene de referencia (Estonia/Singapur/Chile), por qué importa. **Sin** recomendaciones de cómo cerrarlas.
- **Estado de los 3 expedientes IA**: ampliar la sección actual de Legislación con un análisis por expediente (estancado, comisión, próximos pasos legislativos). Mantener tono neutro de observador, no de implementador.

Esta sección es donde Mario gana autoridad pública sin quemar las cartas de negociación.

### 4. Página "Quien lo mantiene" (`/[locale]/quien-mantiene`)

Reemplaza el bloque `Acerca` actual con una página dedicada, accesible desde el footer:
- Quien firma el observatorio (Mario Edwards) y por qué.
- Metodología: cómo se verifica cada dato, frecuencia de actualización, política editorial.
- Contacto: hola@observatorioia.org + link al perfil profesional de Mario.
- Disclaimer: sitio independiente, no oficial.

Mantiene la marca neutra "Observatorio IA" pero hace explícito el firmante (decisión ya tomada en `observatorio-ia-proyecto.md`).

### 5. Cambios transversales

- **Nav**: agregar enlaces a `/analisis` y dejar enlaces ancla actuales (instituciones, legislación, etc.) intactos. Footer gana link a `/quien-mantiene`.
- **`InstitucionesGrid`**: cards ahora son `<Link>` a `/[locale]/instituciones/[id]` (hoy son estáticas).
- **Hero KPI "11 proyectos"**: clickeable, scroll a sección de instituciones (no nueva ruta).
- **Componente `ProyectoCard` reutilizable**: extraído para usarlo tanto en homepage (fragmento) como en página institución (lista completa).

## Archivos a crear / modificar

**Nuevos**:
- `src/app/[locale]/proyectos/[id]/page.tsx` — detalle proyecto + `generateStaticParams`.
- `src/app/[locale]/instituciones/[id]/page.tsx` — detalle institución + `generateStaticParams`.
- `src/app/[locale]/analisis/page.tsx` — sección brechas y benchmarks.
- `src/app/[locale]/quien-mantiene/page.tsx` — autoría y metodología.
- `src/components/ProyectoCard.tsx` — card reutilizable.
- `src/components/Breadcrumb.tsx` — navegación contextual con locale.
- `src/components/BrechaCard.tsx` — tarjeta de capacidad faltante para `/analisis`.
- `src/data/brechas.ts` — 7 capacidades faltantes con país de referencia (extracto público del plan maestro).
- `src/data/lecciones-instituciones.ts` — texto curado por institución (o extender `instituciones.ts`).

**A modificar**:
- `src/data/proyectos.ts` — agregar campo opcional `contexto: Bilingual`.
- `src/data/instituciones.ts` — agregar campo `descripcion: Bilingual` (resumen ampliado) + `lecciones: Bilingual`.
- `src/data/indicadores.ts` — ampliar dataset ILIA con sub-índices (Insumos, Investigación-Desarrollo-Adopción, Gobernanza) para alimentar `/analisis`.
- `src/i18n/dictionaries.ts` — agregar bloques `proyectoDetalle`, `institucionDetalle`, `analisis`, `quienMantiene`, `breadcrumb`.
- `src/components/Nav.tsx` — link nuevo "Análisis".
- `src/components/Footer.tsx` — link nuevo "Quien lo mantiene".
- `src/components/InstitucionesGrid.tsx` — cards como `<Link>`.
- `src/components/Acerca.tsx` — reducir a teaser que linkea a `/quien-mantiene` (o eliminar, según tu llamada).
- `CLAUDE.md` — actualizar sección "Estado" a Fase 2 y reagendar Fase 3 = scrapers.

## Fuente de datos para el contenido nuevo

Antes de escribir cualquier `contexto` de proyecto, `lecciones` de institución o `brecha`, **leer de Obsidian**:
- `Projects/CR-IA-Gobierno/research/cr-ia-research-2-proyectos.md` (datos verificados con URL).
- `Projects/CR-IA-Gobierno/cr-ia-plan-maestro.md` (brechas vs Estonia/Singapur, sección pública parcial).
- `Projects/CR-IA-Gobierno/cr-ia-linea-base-kpis.md` (sub-índices ILIA).

Regla en CLAUDE.md ya vigente: si el dato no está en el scoping/research, no se inventa. Pedir verificación a Mario.

## Verificación

1. `npm run build` — debe generar 22 páginas proyecto + 10 páginas institución + 2 análisis + 2 quien-mantiene = ~36 nuevas páginas estáticas además de las actuales. Si Next aborta con `ENOTEMPTY` por iCloud, aplicar workaround documentado (`mv "out/<dir> 2" .icloud-trash/`).
2. `ls out/es/proyectos/ out/en/proyectos/` — confirmar 11 directorios cada uno con `index.html`.
3. `npm run dev` (sin Turbopack, Next 14 ya está en Webpack default) — recorrer manualmente:
   - Click en card de institución → llega a `/es/instituciones/poder-judicial`.
   - Desde detalle institución → click en proyecto → llega a `/es/proyectos/pj-clasificacion-cobros`.
   - Toggle ES↔EN en cualquier página detalle preserva la ruta y traduce contenido.
   - `/es/analisis` y `/en/analisis` cargan los 7 brecha-cards y la tabla comparativa.
   - Breadcrumb funciona desde cada nivel.
4. Lighthouse o inspección manual: cada página detalle tiene `<title>` y meta description únicos por proyecto/institución (importante para SEO — esta es la vitrina).
5. Verificar que **ningún** texto del plan maestro privado (recomendaciones tácticas, presupuesto USD 18-32M, plan de contacto MICITT, fellowship IA, etc.) terminó publicado por error. Grep en `src/data/` y rutas nuevas contra términos sensibles antes del deploy.

## Fuera de alcance (Fase 3 y posteriores)

- Scrapers Playwright para MICITT/CAMTIC/Asamblea + GitHub Actions cron diario (era la Fase 2 original).
- Migración datos `.ts` → `.json` con validación AJV.
- Búsqueda Fuse.js client-side.
- Timeline cronológico interactivo.
- Charts avanzados con drill-down.
- Newsletter / formulario de captura.
- API pública.

Esto se mantiene en el roadmap pero se ejecuta después de la ventana política crítica.
