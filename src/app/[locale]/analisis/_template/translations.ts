/* ─────────────────────────────────────────────────────────────────────
 * Capa 3 — scaffold de traducciones bilingüe.
 *
 * Estructura mínima esperada por `ArticleBrief.tsx`. Mantener simetría
 * 1:1 entre `es` y `en` — cualquier campo nuevo agregado en una rama
 * debe replicarse en la otra (TypeScript fuerza esto vía el tipo
 * derivado `Translations`).
 *
 * Las secciones del cuerpo se declaran como `sectionA`, `sectionB`,
 * `sectionC` por defecto. Renómbralas según el tema (ver NL01 y NL02
 * para ejemplos: `inventario` / `retorno` / `ccss` / `cronologia` /
 * `comparativa` / `micitt` / `riesgo` / `modelos` / `recomendaciones`).
 * ───────────────────────────────────────────────────────────────────── */

export const t = {
  es: {
    meta: {
      seriesLabel: 'Estado y Algoritmo · N.° NN',
      title: 'TODO: título principal del análisis',
      description: 'TODO: meta description (140-200 chars). Describe el ángulo, no resume el contenido.',
      date: 'DD de mes de AAAA',
      author: 'Mario Pérez Edwards',
      org: 'Observatorio IA Costa Rica',
    },

    breadcrumb: {
      home: 'Inicio',
      analysis: 'Análisis',
      current: 'Estado y Algoritmo N.° NN',
    },

    theme: {
      toDark: 'Activar modo oscuro',
      toLight: 'Activar modo claro',
    },

    /* Orden = orden en el TOC y en el cuerpo. Cada clave debe tener un
     * id en `SECTION_KEYS` dentro de `ArticleBrief.tsx`. */
    sections: {
      resumen: 'Resumen',
      sectionA: 'Sección A',
      sectionB: 'Sección B',
      sectionC: 'Sección C',
      fuentes: 'Fuentes',
    },

    summary: {
      heading: 'Resumen ejecutivo',
      bullets: [
        '<strong>TODO bullet 1:</strong> hallazgo principal con cifra.',
        '<strong>TODO bullet 2:</strong> hallazgo secundario.',
        '<strong>TODO bullet 3:</strong> implicación o decisión pendiente.',
        '<strong>TODO bullet 4:</strong> contexto comparado o histórico.',
      ],
    },

    /* 4-5 KPI cards. value/label/sub son strings; el color del valor
     * se controla en ArticleBrief.tsx según la severidad semántica. */
    metrics: {
      metric1: { value: 'XX', label: 'TODO label 1', sub: 'TODO contexto' },
      metric2: { value: 'XX', label: 'TODO label 2', sub: 'TODO contexto' },
      metric3: { value: 'XX', label: 'TODO label 3', sub: 'TODO contexto' },
      metric4: { value: 'XX', label: 'TODO label 4', sub: 'TODO contexto' },
    },

    sectionA: {
      sectionTitle: 'TODO: título de la sección A',
      body:
        'TODO: párrafo introductorio. Puede incluir <strong>énfasis</strong> con HTML básico — se renderiza vía <Rich html>.',
      calloutTitle: 'Observación clave (opcional)',
      callout:
        'TODO: callout destacado. Se renderiza como pb-callout. Para variantes usar pb-callout-warn o pb-callout-danger.',
    },

    sectionB: {
      sectionTitle: 'TODO: título de la sección B',
      body: 'TODO: párrafo introductorio.',
      bullets: [
        'TODO bullet 1.',
        'TODO bullet 2.',
        'TODO bullet 3.',
      ],
    },

    sectionC: {
      sectionTitle: 'TODO: título de la sección C',
      body: 'TODO: párrafo introductorio.',
      detailsLabel: 'Detalle expandible (opcional)',
      details:
        'TODO: contenido del details/summary. Usar para nota metodológica, evidencia adicional o citas extendidas.',
    },

    /* Estructura uniforme con NL02: grupos de fuentes con label + items.
     * Items pueden incluir URLs inline; ArticleBrief.tsx las detecta con
     * `linkify()` y las renderiza como <Ext>. */
    fuentes: {
      sectionTitle: 'Fuentes y referencias',
      groups: [
        {
          label: 'Documentos oficiales',
          items: [
            'TODO: fuente primaria 1 (institución, documento, fecha).',
            'TODO: fuente primaria 2 — incluir URL si aplica, e.g. https://example.gov',
          ],
        },
        {
          label: 'Prensa y análisis',
          items: [
            'TODO: fuente secundaria 1 (medio, autor, fecha).',
            'TODO: fuente secundaria 2.',
          ],
        },
      ],
    },

    footer: {
      bio: '<strong>Mario Pérez Edwards</strong> es analista de políticas de inteligencia artificial y fundador del Observatorio IA Costa Rica.',
      cadence: 'TODO: nota de publicación. Ej. "Análisis publicado el DD de mes de AAAA."',
      orgLabel: 'Observatorio IA Costa Rica',
    },
  },

  en: {
    meta: {
      seriesLabel: 'State & Algorithm · No. NN',
      title: 'TODO: primary article title',
      description: 'TODO: meta description (140-200 chars). State the angle, do not summarize.',
      date: 'Month DD, YYYY',
      author: 'Mario Pérez Edwards',
      org: 'Observatorio IA Costa Rica',
    },

    breadcrumb: {
      home: 'Home',
      analysis: 'Analysis',
      current: 'State & Algorithm No. NN',
    },

    theme: {
      toDark: 'Switch to dark mode',
      toLight: 'Switch to light mode',
    },

    sections: {
      resumen: 'Summary',
      sectionA: 'Section A',
      sectionB: 'Section B',
      sectionC: 'Section C',
      fuentes: 'Sources',
    },

    summary: {
      heading: 'Executive Summary',
      bullets: [
        '<strong>TODO bullet 1:</strong> headline finding with a number.',
        '<strong>TODO bullet 2:</strong> secondary finding.',
        '<strong>TODO bullet 3:</strong> implication or pending decision.',
        '<strong>TODO bullet 4:</strong> comparative or historical context.',
      ],
    },

    metrics: {
      metric1: { value: 'XX', label: 'TODO label 1', sub: 'TODO context' },
      metric2: { value: 'XX', label: 'TODO label 2', sub: 'TODO context' },
      metric3: { value: 'XX', label: 'TODO label 3', sub: 'TODO context' },
      metric4: { value: 'XX', label: 'TODO label 4', sub: 'TODO context' },
    },

    sectionA: {
      sectionTitle: 'TODO: section A title',
      body:
        'TODO: opening paragraph. May include <strong>emphasis</strong> via inline HTML — rendered through <Rich html>.',
      calloutTitle: 'Key observation (optional)',
      callout:
        'TODO: highlighted callout. Renders as pb-callout. Use pb-callout-warn or pb-callout-danger for variants.',
    },

    sectionB: {
      sectionTitle: 'TODO: section B title',
      body: 'TODO: opening paragraph.',
      bullets: [
        'TODO bullet 1.',
        'TODO bullet 2.',
        'TODO bullet 3.',
      ],
    },

    sectionC: {
      sectionTitle: 'TODO: section C title',
      body: 'TODO: opening paragraph.',
      detailsLabel: 'Expandable detail (optional)',
      details:
        'TODO: details/summary content. Use for methodological notes, extra evidence or extended quotes.',
    },

    fuentes: {
      sectionTitle: 'Sources and references',
      groups: [
        {
          label: 'Official documents',
          items: [
            'TODO: primary source 1 (institution, document, date).',
            'TODO: primary source 2 — include URL when applicable, e.g. https://example.gov',
          ],
        },
        {
          label: 'Press and analysis',
          items: [
            'TODO: secondary source 1 (outlet, author, date).',
            'TODO: secondary source 2.',
          ],
        },
      ],
    },

    footer: {
      bio: '<strong>Mario Pérez Edwards</strong> is an artificial intelligence policy analyst and founder of Observatorio IA Costa Rica.',
      cadence: 'TODO: publication note. e.g. "Analysis published on Month DD, YYYY."',
      orgLabel: 'Observatorio IA Costa Rica',
    },
  },
} as const;

export type Locale = keyof typeof t;
export type Translations = typeof t[Locale];
