import type { Locale } from '@/i18n/config';
import type {
  EstadoCruceEnia,
  EstadoEjecucionEnia,
  TipoIntervencionEnia,
} from '@/data/eniaAcciones';

export type VistaEnia = 'soluciones' | 'catalogo' | 'completo';

export interface EniaTranslations {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  intro: string;
  thesis: string;
  updated: string;
  sourceLink: string;
  sourceLanguage: string;
  stats: {
    sourceRows: string;
    canonicalRows: string;
    declaredSolutions: string;
    declaredSolutionsDetail: string;
    catalogLinks: string;
    unverifiedCommitments: string;
    nonSystems: string;
    repetitions: string;
  };
  explorer: {
    kicker: string;
    title: string;
    intro: string;
    viewsLabel: string;
    views: Record<VistaEnia, { label: string; description: string }>;
    searchLabel: string;
    searchPlaceholder: string;
    axisLabel: string;
    allAxes: string;
    statusLabel: string;
    allStatuses: string;
    showDuplicates: string;
    results: string;
    resultSingular: string;
    noResults: string;
    clear: string;
    officialWording: string;
    planObjective: string;
    expectedResult: string;
    responsible: string;
    allies: string;
    planPage: string;
    crosswalk: string;
    execution: string;
    relatedCatalog: string;
    openRecord: string;
    evidence: string;
    indicators: string;
    baseline: string;
    target: string;
    noValue: string;
    editorialNote: string;
    canonicalReference: string;
    axis: string;
    type: string;
  };
  methodology: {
    title: string;
    body: string;
    canonical: string;
    status: string;
    evidence: string;
  };
  typeLabels: Record<TipoIntervencionEnia, string>;
  crossLabels: Record<EstadoCruceEnia, string>;
  executionLabels: Record<EstadoEjecucionEnia, string>;
}

export const eniaTranslations: Record<Locale, EniaTranslations> = {
  es: {
    metaTitle: 'Seguimiento del Plan de Acción ENIA',
    metaDescription:
      'Explorador verificable de las 129 intervenciones del Plan de Acción ENIA de Costa Rica, con repeticiones, cruces al catálogo y evidencia de ejecución separada de las metas oficiales.',
    kicker: 'Plan de Acción ENIA',
    title: 'Lo anunciado y lo verificado, en una misma vista',
    intro:
      'El Plan oficial reúne metas de política, formación, infraestructura y soluciones tecnológicas. Este explorador conserva las 129 filas fuente, identifica 9 repeticiones y muestra qué intervenciones tienen correspondencia o evidencia fuera del documento.',
    thesis:
      'Una meta oficial prueba que existe un compromiso. No prueba por sí sola que el sistema se haya construido, que use IA verificable o que produzca resultados.',
    updated: 'Corte editorial: 21 de agosto de 2026',
    sourceLink: 'Abrir el Plan de Acción oficial',
    sourceLanguage: 'El texto fuente del Plan se conserva en español, incluso en la versión en inglés del sitio.',
    stats: {
      sourceRows: 'filas en la fuente',
      canonicalRows: 'intervenciones canónicas',
      declaredSolutions: 'soluciones de IA declaradas',
      declaredSolutionsDetail: '25 canónicas al retirar repeticiones',
      catalogLinks: 'cruces exactos o parciales',
      unverifiedCommitments: 'compromisos solo en ENIA',
      nonSystems: 'filas que no son sistemas de IA',
      repetitions: 'repeticiones conservadas',
    },
    explorer: {
      kicker: 'Explorador',
      title: 'Intervenciones del Plan',
      intro:
        'La vista inicial muestra únicamente las soluciones declaradas y omite repeticiones. Podés ampliar al cruce con el catálogo o a las 120 intervenciones canónicas.',
      viewsLabel: 'Vista',
      views: {
        soluciones: {
          label: 'Soluciones declaradas',
          description: 'Filas que el Plan presenta como solución o componente de IA.',
        },
        catalogo: {
          label: 'Cruce con catálogo',
          description: 'Coincidencias exactas o parciales con fichas públicas del observatorio.',
        },
        completo: {
          label: 'Inventario completo',
          description: 'Política, formación, investigación, infraestructura y soluciones.',
        },
      },
      searchLabel: 'Buscar',
      searchPlaceholder: 'Intervención, objetivo, responsable o código',
      axisLabel: 'Eje',
      allAxes: 'Todos los ejes',
      statusLabel: 'Estado del cruce',
      allStatuses: 'Todos los estados',
      showDuplicates: 'Mostrar las 9 repeticiones de la fuente',
      results: 'intervenciones visibles',
      resultSingular: 'intervención visible',
      noResults: 'No hay intervenciones que coincidan con estos filtros.',
      clear: 'Limpiar filtros',
      officialWording: 'Redacción oficial de la intervención',
      planObjective: 'Objetivo del Plan',
      expectedResult: 'Resultado esperado',
      responsible: 'Responsable oficial',
      allies: 'Aliados',
      planPage: 'Página del Plan',
      crosswalk: 'Cruce con el catálogo',
      execution: 'Ejecución',
      relatedCatalog: 'Fichas relacionadas',
      openRecord: 'Abrir ficha de evidencia',
      evidence: 'Evidencia externa',
      indicators: 'Indicadores y metas del Plan',
      baseline: 'Línea base fuente',
      target: 'Meta fuente',
      noValue: 'Sin valor en la celda fuente',
      editorialNote: 'Nota editorial',
      canonicalReference: 'Decisión canónica',
      axis: 'Eje',
      type: 'Tipo',
    },
    methodology: {
      title: 'Cómo leer los números',
      body:
        'El total de 129 reproduce las filas del documento. Para analizar intervenciones se usan 120 registros canónicos, porque nueve filas repiten sustancialmente otra acción. Los estados del cruce describen identidad documental; la ejecución se evalúa por separado.',
      canonical:
        'Canónica: una intervención contada una vez, aunque el Plan repita su redacción o indicador.',
      status:
        'Coincidencia: relación acreditada con una ficha del catálogo; no equivale a cumplimiento total de la meta.',
      evidence:
        'Ejecución: solo cambia cuando existe evidencia pública adicional al Plan y se publica qué dimensión respalda.',
    },
    typeLabels: {
      'politica-gobernanza': 'Política o gobernanza',
      'capacitacion-formacion': 'Capacitación o formación',
      'investigacion-diagnostico': 'Investigación o diagnóstico',
      'articulacion-financiamiento': 'Articulación o financiamiento',
      'infraestructura-habilitante': 'Infraestructura habilitante',
      'solucion-ia-declarada': 'Solución de IA declarada',
      'automatizacion-digital': 'Automatización digital',
      'por-determinar': 'Tipo por determinar',
    },
    crossLabels: {
      'mapeado-exacto': 'Coincidencia exacta',
      'coincidencia-parcial': 'Coincidencia parcial',
      'posible-duplicado': 'Repetición de la fuente',
      'nuevo-con-evidencia': 'Hallazgo con evidencia',
      'enia-solamente': 'Solo en ENIA',
      'no-es-sistema-ia': 'No es un sistema de IA',
      'no-determinado': 'No determinado',
    },
    executionLabels: {
      'no-verificado': 'Ejecución no verificada',
      'parcialmente-verificado': 'Ejecución parcialmente verificada',
      verificado: 'Ejecución verificada',
      contradicho: 'Ejecución contradicha',
    },
  },
  en: {
    metaTitle: 'ENIA Action Plan tracker',
    metaDescription:
      'Verifiable explorer of Costa Rica’s 129 ENIA Action Plan rows, with repetitions, catalog matches and execution evidence kept separate from official targets.',
    kicker: 'ENIA Action Plan',
    title: 'What was announced and what is verified, in one view',
    intro:
      'The official Plan combines policy, training, infrastructure and technology-solution targets. This explorer preserves all 129 source rows, identifies 9 repetitions and shows which interventions have a catalog match or evidence outside the document.',
    thesis:
      'An official target proves that a commitment exists. By itself, it does not prove that a system was built, uses verifiable AI or produced results.',
    updated: 'Editorial cutoff: August 21, 2026',
    sourceLink: 'Open the official Action Plan',
    sourceLanguage: 'The Plan’s source wording remains in Spanish, including on the English version of this site.',
    stats: {
      sourceRows: 'rows in the source',
      canonicalRows: 'canonical interventions',
      declaredSolutions: 'declared AI solutions',
      declaredSolutionsDetail: '25 canonical after repetitions are removed',
      catalogLinks: 'exact or partial matches',
      unverifiedCommitments: 'ENIA-only commitments',
      nonSystems: 'rows that are not AI systems',
      repetitions: 'preserved repetitions',
    },
    explorer: {
      kicker: 'Explorer',
      title: 'Action Plan interventions',
      intro:
        'The initial view shows declared solutions only and hides repetitions. Expand to the catalog crosswalk or all 120 canonical interventions.',
      viewsLabel: 'View',
      views: {
        soluciones: {
          label: 'Declared solutions',
          description: 'Rows the Plan presents as an AI solution or component.',
        },
        catalogo: {
          label: 'Catalog crosswalk',
          description: 'Exact or partial matches to the observatory’s public records.',
        },
        completo: {
          label: 'Full inventory',
          description: 'Policy, training, research, infrastructure and solutions.',
        },
      },
      searchLabel: 'Search',
      searchPlaceholder: 'Intervention, objective, responsible entity or code',
      axisLabel: 'Axis',
      allAxes: 'All axes',
      statusLabel: 'Crosswalk status',
      allStatuses: 'All statuses',
      showDuplicates: 'Show the 9 source repetitions',
      results: 'visible interventions',
      resultSingular: 'visible intervention',
      noResults: 'No interventions match these filters.',
      clear: 'Clear filters',
      officialWording: 'Official intervention wording',
      planObjective: 'Plan objective',
      expectedResult: 'Expected result',
      responsible: 'Official responsible entity',
      allies: 'Partners',
      planPage: 'Plan page',
      crosswalk: 'Catalog crosswalk',
      execution: 'Execution',
      relatedCatalog: 'Related records',
      openRecord: 'Open evidence record',
      evidence: 'External evidence',
      indicators: 'Plan indicators and targets',
      baseline: 'Source baseline',
      target: 'Source target',
      noValue: 'No value in the source cell',
      editorialNote: 'Editorial note',
      canonicalReference: 'Canonical decision',
      axis: 'Axis',
      type: 'Type',
    },
    methodology: {
      title: 'How to read the figures',
      body:
        'The total of 129 reproduces the document’s rows. Analysis uses 120 canonical records because nine rows substantially repeat another action. Crosswalk status describes documentary identity; execution is evaluated separately.',
      canonical:
        'Canonical: one intervention counted once, even when the Plan repeats its wording or indicator.',
      status:
        'Match: an evidenced relationship to a catalog record; it does not mean the full target has been delivered.',
      evidence:
        'Execution: changes only when public evidence beyond the Plan exists and states which dimension it supports.',
    },
    typeLabels: {
      'politica-gobernanza': 'Policy or governance',
      'capacitacion-formacion': 'Training or education',
      'investigacion-diagnostico': 'Research or diagnostic work',
      'articulacion-financiamiento': 'Coordination or funding',
      'infraestructura-habilitante': 'Enabling infrastructure',
      'solucion-ia-declarada': 'Declared AI solution',
      'automatizacion-digital': 'Digital automation',
      'por-determinar': 'Undetermined type',
    },
    crossLabels: {
      'mapeado-exacto': 'Exact match',
      'coincidencia-parcial': 'Partial match',
      'posible-duplicado': 'Source repetition',
      'nuevo-con-evidencia': 'Finding with evidence',
      'enia-solamente': 'ENIA only',
      'no-es-sistema-ia': 'Not an AI system',
      'no-determinado': 'Undetermined',
    },
    executionLabels: {
      'no-verificado': 'Execution unverified',
      'parcialmente-verificado': 'Execution partially verified',
      verificado: 'Execution verified',
      contradicho: 'Execution contradicted',
    },
  },
};
