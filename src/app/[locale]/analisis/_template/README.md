# Plantilla para nuevos análisis (Capa 3)

Esta carpeta es un scaffold reutilizable para publicar nuevos números de **Estado y Algoritmo** en `observatorioia.org/[locale]/analisis/<slug>/`. Se basa en el patrón de los dos artículos en producción:

- `01-ia-en-el-estado-costarricense/` — NL01 (inventario, 21 proyectos / 7 instituciones).
- `02-tres-leyes-ia-cr/` — NL02 (comparativa tres leyes de IA, cronología MICITT).

> **Esta carpeta NO se enruta**: Next.js excluye automáticamente los directorios cuyo nombre empieza por `_` del routing del App Router. Eso permite que los archivos vivan junto al resto del módulo `analisis/` y que cualquier import compartido se resuelva con las mismas rutas relativas que usarán los nuevos artículos.

---

## Pasos para crear un nuevo análisis

1. **Copiar la carpeta** y renombrarla con el slug del nuevo número:

   ```bash
   cp -R src/app/\[locale\]/analisis/_template src/app/\[locale\]/analisis/<NN-slug-nuevo>
   ```

   Convención de slug: `NN-<tema-en-kebab-case>`, dos dígitos del orden cronológico de publicación (`03-`, `04-`, etc.) seguido de un tema corto descriptivo.

2. **Editar `page.tsx`**:
   - Reemplazar las tres constantes al inicio del archivo:
     - `SLUG` → mismo string que el nombre de carpeta (`'NN-slug-nuevo'`).
     - `PUBLISHED_AT` → ISO 8601 con offset `-06:00` (zona Costa Rica).
     - `FECHA` → `YYYY-MM-DD` para `article:tag` y el `<time dateTime>` del header.

3. **Editar `translations.ts`**:
   - Llenar `meta`, `breadcrumb`, `summary`, `metrics`, y las secciones del cuerpo (`sectionA`, `sectionB`, `sectionC` por defecto).
   - **Mantener la misma estructura en `es` y `en`**: cualquier campo nuevo debe añadirse en ambos idiomas.
   - Si el artículo tiene secciones que el scaffold no contempla, añadir la nueva clave a `sections` (orden = orden de TOC y de aparición en el cuerpo) y a la rama ES + EN.

4. **Editar `ArticleBrief.tsx`**:
   - Ajustar la lista `SECTION_KEYS` para que coincida con las secciones reales del artículo.
   - Reemplazar el cuerpo de cada `<section>` con el contenido específico (gráficos, tablas, callouts).
   - Si necesitas SVG charts personalizados, copia los patrones de `01-ia-en-el-estado-costarricense/ArticleBrief.tsx` (gauge LIDIA, timeline, bar chart) o de `02-tres-leyes-ia-cr/ArticleBrief.tsx` (semáforo stacked, model cards, timeline vertical). **NO inventes nuevas paletas de color**: usa los `--pb-*` CSS variables del scaffold.

5. **Verificar localmente**:

   ```bash
   npx tsc --noEmit
   npm run dev -- --webpack  # ver el preview en local
   ```

6. **Agregar al changelog** (opcional pero recomendado): añadir una entrada en `src/data/json/changelog.json` con `tipo: 'indicador'` o el tipo que corresponda, vinculando al `commit_sha` de publicación.

7. **Branch + PR + deploy**: branch feature, PR con preview en Vercel, review de Mario, merge → Vercel deploya producción.

---

## Sistema de diseño (CSS variables)

El scaffold incluye el design system completo de Capa 3. Las CSS variables disponibles, declaradas en `.policy-brief[data-theme="light|dark"]`:

| Variable | Uso |
|---|---|
| `--pb-bg` | Fondo de página (zona de contenido). |
| `--pb-surface` | Fondo de tarjetas y headers (más claro que el fondo). |
| `--pb-surface-alt` | Fondo alterno (table headers, callout neutral). |
| `--pb-text` | Texto principal. |
| `--pb-text-secondary` | Texto secundario / párrafos. |
| `--pb-text-muted` | Texto terciario / meta. |
| `--pb-border` | Bordes y separadores. |
| `--pb-primary` | Color de marca (badges, callouts default). |
| `--pb-primary-light` | Variante claro del primary. |
| `--pb-success` / `--pb-success-light` | Verde semántico (OK, pasa). |
| `--pb-warning` / `--pb-warning-light` | Amarillo semántico (alerta). |
| `--pb-danger` / `--pb-danger-light` | Rojo semántico (crítico, error). |
| `--pb-chart-1..4` | Paleta para charts (azul, violeta, verde, rojo). |

Clases utility ya incluidas en el scaffold:

- `.pb-callout`, `.pb-callout-warn`, `.pb-callout-danger`
- `.pb-metric-card` + `.pb-mn`, `.pb-ml`, `.pb-ms`
- `.pb-chart`, `.pb-chart-title`, `.pb-chart-source`
- `.pb-sh`, `.pb-sn`, `.pb-st` (encabezado de sección numerada)
- `.pb-hr`
- `.pb-badge`, `.pb-badge-ok`, `.pb-badge-warn`, `.pb-badge-err`, `.pb-badge-neutral`
- `.pb-fbtn`, `.pb-fbtn-on` (filter buttons)
- `.pb-tw`, `.pb-tbl` (tabla institucional)
- `.pb-link` (anchor with subtle underline)

---

## Helpers del scaffold

Ya importables desde `ArticleBrief.tsx`:

- `<Ext href="...">` — anchor con `target="_blank"` + `rel="noopener noreferrer"` y la clase `pb-link`.
- `<SH n={1} title="..." id="..."/>` — encabezado de sección numerado con anchor para el TOC.
- `<Rich html="..."/>` — renderiza una cadena con `<strong>` u otros tags básicos usando `dangerouslySetInnerHTML`. Útil para mezclar prosa + énfasis sin partir el JSX.
- `linkify(text)` — convierte cualquier `https?://...` dentro de un string en un `<Ext>` clickeable. Útil en bullets de fuentes o en `description` de tarjetas.

---

## Convenciones editoriales

- Tono institucional/académico, no blog. Sin emojis decorativos. Sin em-dash (`—` está permitido para listas estructuradas pero NO en prosa). Sin patrones de IA en el texto (oraciones demasiado balanceadas, listas tripartitas redundantes).
- Cifras siempre verificables: cada métrica numérica en `metrics` debe tener fuente en `fuentes`. Si no hay fuente, no publicar.
- Bilingüe: las traducciones EN no son la versión "ligera" — son equivalentes en calidad y precisión. Si un EN bullet no se puede sostener, el ES tampoco.
- Series cronológicas: usar el campo `commit_sha` del changelog para vincular la entrada con el commit que la generó. Auditabilidad sin convertir el sitio en un blob de git.
