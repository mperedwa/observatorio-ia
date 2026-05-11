export const t = {
  es: {
    meta: {
      seriesLabel: 'Estado y Algoritmo · N.° 01',
      title: 'IA en el Estado costarricense: 20 proyectos, 7 instituciones, y las preguntas que nadie ha respondido todavía',
      description: 'Análisis del primer inventario sistemático de proyectos de IA en el sector público costarricense: lo que existe, lo que retorna, lo que está detenido, y lo que falta coordinar.',
      date: '11 de mayo de 2026',
      author: 'Mario Pérez Edwards',
      org: 'Observatorio IA Costa Rica',
    },

    breadcrumb: {
      home: 'Inicio',
      analysis: 'Análisis',
      current: 'Estado y Algoritmo N.° 01',
    },

    theme: {
      toDark: 'Activar modo oscuro',
      toLight: 'Activar modo claro',
    },

    sections: {
      resumen: 'Resumen',
      inventario: 'Inventario',
      retorno: 'Retorno',
      ccss: 'CCSS',
      cronologia: 'Cronología',
      vacio: 'Vacío institucional',
      catalogo: 'Catálogo',
      queSigue: 'Qué sigue',
    },

    summary: {
      heading: 'Resumen ejecutivo',
      bullets: [
        '<strong>20 proyectos de IA en 7 instituciones</strong> del sector público costarricense. 14 en producción.',
        'Poder Judicial (₡5,245M) y Hacienda (₡8,000M) tienen <strong>retorno financiero público documentado</strong>. Ambos operan sobre infraestructura digital preexistente.',
        'Tres modelos de la CCSS para detectar cáncer, enfermedades pulmonares y síndrome coronario están <strong>detenidos por ₡390M</strong> (menos del 0.02% del presupuesto CCSS).',
        'El Centro Nacional de Excelencia en IA, prometido en la ENIA 2024-2027, <strong>lleva dos años de retraso</strong> sin presupuesto asignado.',
        'No existe obligación institucional de compartir aprendizajes ni coordinar entre entidades.',
      ],
    },

    metrics: {
      projects: { value: '20', label: 'Proyectos documentados', sub: '7 instituciones públicas' },
      returns: { value: '₡13.2B', label: 'Retorno documentado', sub: 'PJ + Hacienda, datos públicos' },
      patients: { value: '367K', label: 'Pacientes resueltos', sub: 'CCSS depuración 2023-2026' },
      stalled: { value: '₡390M', label: 'Modelos detenidos', sub: '< 0.02% presupuesto CCSS' },
    },

    inventario: {
      sectionTitle: 'El inventario: qué se midió y cómo',
      body: 'El primer inventario sistemático del Observatorio IA Costa Rica documentó <strong>veinte proyectos de inteligencia artificial en producción o con estado verificado</strong> en siete instituciones del sector público costarricense. La cifra de veinte es un piso, no un techo: el inventario sigue en construcción.',
      criteriaLabel: 'Criterios de inclusión',
      criteria: [
        '<strong>Fuente pública verificable</strong>: comunicado oficial, declaración institucional, o cobertura periodística con datos confirmados.',
        '<strong>Institución del sector público costarricense</strong>: gobierno central, autónomas, o semiautónomas.',
        '<strong>Sistema que funciona o tiene estado documentado</strong>: no basta el anuncio; se requiere evidencia de operación o de estado actual.',
      ],
      exclusionNote: 'Se excluyen deliberadamente proyectos en fase de piloto sin datos públicos, iniciativas del sector privado, y proyectos universitarios sin convenio con entidades públicas.',
    },

    retorno: {
      sectionTitle: 'Retorno financiero documentado',
      body: 'De los veinte proyectos, dos tienen el nivel más alto de evidencia: retorno económico documentado públicamente por la propia institución. Ambos comparten una condición estructural: operan sobre infraestructura de datos que <strong>ya existía antes del proyecto de IA</strong>.',
      pjLabel: 'Poder Judicial: siete años sin titular',
      pjPara1: 'El chatbot de atención ciudadana lleva funcionando desde 2018, construido internamente sin proveedor externo. El modelo de predicción presupuestaria para gestión de cobros judiciales (2019) se extendió a más de 60 centros de gestión con un ahorro acumulado de más de ₡100 millones.',
      pjPara2: 'En 2024, el Poder Judicial procesó ₡5,245 millones en cobros judiciales sin revisión manual caso por caso. El sistema clasifica, prioriza por probabilidad de recuperación, y genera reportes automáticamente.',
      haciendaLabel: 'Ministerio de Hacienda: sobre la facturación electrónica',
      haciendaPara: 'En 2025, un detector de anomalías sobre el flujo de facturas electrónicas recuperó ₡8,000 millones en evasión fiscal. La facturación electrónica de Costa Rica procesa aproximadamente 3 millones de comprobantes diarios. Esa infraestructura preexistente fue la condición habilitante del detector.',
      callout: 'El retorno de la IA en el gobierno depende menos del modelo que se use y más de la calidad de los datos y sistemas que lo preceden. Las instituciones que no tienen esa base no pueden saltarse el paso.',
    },

    charts: {
      retorno: {
        title: 'Retorno financiero documentado (₡ millones)',
        ariaLabel: 'Retorno financiero documentado por institución',
        svgTitle: 'Comparación de retorno financiero: Hacienda ₡8,000M vs Poder Judicial ₡5,245M',
        haciendaSub: 'Evasión fiscal 2025',
        pjSub: 'Cobros judiciales 2024',
        source: 'Fuentes: actualidadtributaria.com (Hacienda), observador.cr (P. Judicial)',
      },
      depuracion: {
        title: 'Reducción de la tasa de depuración en listas de espera (CCSS)',
        ariaLabel: 'Tasa de depuración: de 31.2% a 18.2%',
        svgTitle: 'Tasa de depuración en listas de espera quirúrgica de la CCSS: antes 31.2%, después 18.2%',
        rateLabel: 'depuración',
        before: 'Antes',
        beforeSub: 'Inicio 2023',
        after: 'Después',
        afterSub: 'Q1 2026',
        source: '367,403 pacientes resueltos · 136,774 casos depurados · Fuente: Teletica / CCSS',
      },
      lidia: {
        title: 'Precisión del modelo LIDIA (diabetes tipo 2)',
        ariaLabel: 'LIDIA: 95% de precisión',
        svgTitle: 'Modelo LIDIA de la CCSS: 95% de precisión en detección de diabetes tipo 2',
        accuracyLabel: 'precisión',
        recordsSub: '1M+ expedientes · Clínica Clorito Picado',
        source: 'Fuente: Observador.cr / Teletica',
      },
      stalledModels: {
        title: 'Modelos detenidos por falta de presupuesto',
        models: ['Cáncer de mama', 'Enfermedades pulmonares', 'Síndrome coronario agudo'],
        total: 'Total: ₡390M (< 0.02% presupuesto CCSS)',
        sourceLabel: 'Fuente: Teletica',
      },
      timeline: {
        title: 'Cronología de IA en el Estado costarricense (2018 - 2026)',
        ariaLabel: 'Línea de tiempo de proyectos de IA en el Estado',
        svgTitle: 'Línea de tiempo: desde el chatbot del Poder Judicial en 2018 hasta LIDIA de la CCSS en 2026',
        source: 'Fuentes: inventario Observatorio IA Costa Rica, fuentes públicas verificadas',
        events: [
          { year: 2018, lines: ['PJ: Chatbot', 'ciudadano'] },
          { year: 2019, lines: ['PJ: Predicción', 'presupuestaria'] },
          { year: 2023, lines: ['CCSS: Depuración', 'listas de espera'] },
          { year: 2024, lines: ['ENIA publicada', 'PJ: ₡5,245M cobros'] },
          { year: 2025, lines: ['Hacienda:', '₡8,000M evasión'] },
          { year: 2026, lines: ['CCSS: Bot EDUS', '+ LIDIA piloto'] },
        ],
      },
    },

    ccss: {
      sectionTitle: 'El caso más urgente: CCSS',
      intro: 'Si el Poder Judicial y Hacienda representan lo que ya funciona, la CCSS representa tanto lo que funciona como lo que <strong>podría funcionar y está detenido</strong>.',
      botPara: 'El bot que cruza EDUS con el Registro Civil depura listas de espera quirúrgica: pacientes fallecidos, ya atendidos, o duplicados. Entre 2023 y Q1 2026, resolvió 367,403 pacientes y limpió 136,774 casos. La tasa de depuración bajó de 31.2% a 18.2%, indicando <strong>listas más precisas, no solo más cortas</strong>.',
      lidiaLabel: 'LIDIA: el modelo que funciona y los tres que están detenidos',
      lidiaPara1: 'LIDIA es un modelo de machine learning desarrollado en la Clínica Clorito Picado sobre más de un millón de expedientes en EDUS. Identifica pacientes con diabetes tipo 2 en riesgo con 95% de precisión, permitiendo intervención preventiva. El modelo cuesta ₡130 millones (aprox. USD 250,000).',
      lidiaPara2: 'Hay tres modelos adicionales diseñados para detectar cáncer de mama, enfermedades pulmonares y síndrome coronario agudo sobre el mismo dataset. Los tres están parados por falta de presupuesto: ₡390 millones en total (3 × ₡130M). Esa cifra representa menos del 0.02% del presupuesto ordinario de la CCSS.',
      calloutTitle: 'Decisión de política pendiente:',
      callout: 'Si el costo de activar estos modelos es verificablemente menor que el costo de una complicación evitable por caso detectado tardíamente, la justificación de la no-acción requiere argumentación explícita. Esa argumentación no existe en el dominio público.',
    },

    cronologia: {
      sectionTitle: 'Cronología: IA en el Estado (2018-2026)',
      body: 'Los proyectos documentados abarcan ocho años. Las instituciones con mayor madurez, Poder Judicial y CCSS, comenzaron antes de que existiera una estrategia nacional.',
    },

    vacio: {
      sectionTitle: 'El vacío institucional',
      para1: 'La Estrategia Nacional de Inteligencia Artificial (ENIA) 2024-2027 del MICITT prometió un Centro Nacional de Excelencia en IA. Costa Rica fue el primer país de Centroamérica en tener una política nacional de IA. <strong>El centro no existe</strong>: acumula dos años de retraso sin presupuesto asignado.',
      para2: 'Mientras tanto, la UCR investiga ética en IA con financiamiento Erasmus+ y el CeNAT propone LaNIA con apoyo del BID. Cada institución construye sus propios sistemas sin obligación formal de coordinar con el MICITT ni compartir aprendizajes.',
      para3: 'El Poder Judicial inventó su propio marco de gobernanza porque nadie más lo hizo: es el único que ha publicado formalmente lineamientos para el uso de IA generativa interna, según información pública disponible. El resultado práctico es que los aprendizajes de cada institución no están disponibles para las demás. <strong>Cada una parte de cero.</strong>',
    },

    catalogo: {
      sectionTitle: 'Catálogo de proyectos identificados',
      body: 'La tabla incluye los diez proyectos principales documentados con datos públicos verificables. El inventario completo contiene veinte proyectos en siete instituciones.',
      filters: { all: 'Todos', active: 'Activo', pilot: 'Piloto', stalled: 'Detenido' },
      table: {
        institution: 'Institución',
        project: 'Proyecto',
        year: 'Año',
        status: 'Estado',
        impact: 'Impacto',
      },
      badges: { activo: 'Activo', piloto: 'Piloto', detenido: 'Detenido' },
      footnote: 'Selección de proyectos con datos públicos verificados. El inventario completo del Observatorio incluye 20 proyectos.',
    },

    projects: [
      { proyecto: 'Chatbot ciudadano', impacto: 'Atención 24/7' },
      { proyecto: 'Predicción presupuestaria', impacto: '60+ centros, ₡100M+ ahorro' },
      { proyecto: 'Cobro judicial IA', impacto: '₡5,245M procesados' },
      { proyecto: 'Marco gobernanza IA generativa', impacto: 'Único lineamiento público' },
      { proyecto: 'Detector evasión fiscal', impacto: '₡8,000M recuperados' },
      { proyecto: 'Bot depuración listas de espera', impacto: '367,403 pacientes resueltos' },
      { proyecto: 'LIDIA (diabetes tipo 2)', impacto: '95% precisión, 1M+ expedientes' },
      { proyecto: 'Modelo cáncer de mama', impacto: '₡130M requeridos' },
      { proyecto: 'Modelo enfermedades pulmonares', impacto: '₡130M requeridos' },
      { proyecto: 'Modelo síndrome coronario agudo', impacto: '₡130M requeridos' },
    ],

    queSigue: {
      sectionTitle: 'Qué sigue en el Observatorio',
      intro: 'Este primer número del inventario es un punto de partida, no un estado final. Las preguntas abiertas que van a guiar los próximos números:',
      questions: [
        { q: '¿Cuál es el costo total de los proyectos activos?', a: 'El retorno está documentado para PJ y Hacienda. El costo de inversión no tiene la misma transparencia.' },
        { q: '¿Qué instituciones tienen la infraestructura de datos para el siguiente proyecto?', a: 'MEP, SUTEL, y las municipalidades tienen datos. La pregunta es si tienen la estructura para usarlos.' },
        { q: '¿Cuándo se activan los tres modelos de LIDIA?', a: 'La decisión de presupuesto tiene fecha. El seguimiento también.' },
      ],
      closing: 'El inventario acepta correcciones y adiciones. Si usted trabaja en una institución pública con un proyecto de IA que no está documentado, el canal es abierto.',
    },

    footer: {
      bio: '<strong>Mario Pérez Edwards</strong> es analista de políticas de inteligencia artificial y fundador del Observatorio IA Costa Rica.',
      cadence: 'Estado y Algoritmo se publica quincenalmente. Datos del catálogo al 8 de mayo de 2026.',
      orgLabel: 'Observatorio IA Costa Rica',
    },
  },

  en: {
    meta: {
      seriesLabel: 'State & Algorithm · No. 01',
      title: 'AI in Costa Rica\'s Public Sector: 20 projects, 7 institutions, and the questions no one has answered yet',
      description: 'Analysis of the first systematic inventory of AI projects in Costa Rica\'s public sector: what exists, what returns value, what is stalled, and what lacks coordination.',
      date: 'May 11, 2026',
      author: 'Mario Pérez Edwards',
      org: 'Observatorio IA Costa Rica',
    },

    breadcrumb: {
      home: 'Home',
      analysis: 'Analysis',
      current: 'State & Algorithm No. 01',
    },

    theme: {
      toDark: 'Switch to dark mode',
      toLight: 'Switch to light mode',
    },

    sections: {
      resumen: 'Summary',
      inventario: 'Inventory',
      retorno: 'Returns',
      ccss: 'CCSS',
      cronologia: 'Timeline',
      vacio: 'Institutional Gap',
      catalogo: 'Catalog',
      queSigue: "What's Next",
    },

    summary: {
      heading: 'Executive Summary',
      bullets: [
        '<strong>20 AI projects across 7 Costa Rican public institutions</strong>. 14 in production.',
        'Poder Judicial (₡5,245M) and Hacienda (₡8,000M) have <strong>publicly documented financial returns</strong>. Both operate on pre-existing digital infrastructure.',
        'Three CCSS models for detecting cancer, pulmonary disease, and acute coronary syndrome are <strong>stalled for ₡390M</strong> (less than 0.02% of the CCSS budget).',
        'The National AI Center of Excellence, promised in ENIA 2024-2027, is <strong>two years delayed</strong> with no assigned budget.',
        'There is no institutional obligation to share learnings or coordinate between entities.',
      ],
    },

    metrics: {
      projects: { value: '20', label: 'Documented projects', sub: '7 public institutions' },
      returns: { value: '₡13.2B', label: 'Documented return', sub: 'PJ + Hacienda, public data' },
      patients: { value: '367K', label: 'Patients resolved', sub: 'CCSS list cleanup 2023–2026' },
      stalled: { value: '₡390M', label: 'Stalled models', sub: '< 0.02% of CCSS budget' },
    },

    inventario: {
      sectionTitle: 'The Inventory: What Was Measured and How',
      body: 'The first systematic inventory of the Observatorio IA Costa Rica documented <strong>twenty AI projects in production or with verified status</strong> across seven Costa Rican public institutions. Twenty is a floor, not a ceiling: the inventory is ongoing.',
      criteriaLabel: 'Inclusion Criteria',
      criteria: [
        '<strong>Verifiable public source</strong>: official statement, institutional declaration, or press coverage with confirmed data.',
        '<strong>Costa Rican public sector institution</strong>: central government, autonomous, or semi-autonomous.',
        '<strong>System that operates or has documented status</strong>: the announcement alone is insufficient; evidence of operation or current status is required.',
      ],
      exclusionNote: 'Deliberately excluded: pilot-phase projects without public data, private sector initiatives, and university projects without public entity agreements.',
    },

    retorno: {
      sectionTitle: 'Documented Financial Returns',
      body: 'Of the twenty projects, two have the highest level of evidence: financial returns publicly documented by the institution itself. Both share a structural condition: they operate on data infrastructure that <strong>already existed before the AI project</strong>.',
      pjLabel: 'Poder Judicial: Seven Years Under the Radar',
      pjPara1: 'The citizen service chatbot has been running since 2018, built internally without an external vendor. The budget prediction model for judicial debt collection (2019) expanded to more than 60 management centers with accumulated savings exceeding ₡100 million.',
      pjPara2: 'In 2024, the Poder Judicial processed ₡5,245 million in judicial collections without manual case-by-case review. The system classifies, prioritizes by recovery probability, and generates reports automatically.',
      haciendaLabel: 'Ministry of Finance: Built on E-Invoicing Infrastructure',
      haciendaPara: 'In 2025, an anomaly detector applied to electronic invoice flows recovered ₡8,000 million in tax evasion. Costa Rica\'s e-invoicing system processes approximately 3 million receipts per day. That pre-existing infrastructure was the enabling condition for the detector.',
      callout: 'The return on government AI depends less on the model used and more on the quality of the data and systems that precede it. Institutions without that foundation cannot skip the step.',
    },

    charts: {
      retorno: {
        title: 'Documented financial returns (₡ millions)',
        ariaLabel: 'Documented financial return by institution',
        svgTitle: 'Financial return comparison: Hacienda ₡8,000M vs Poder Judicial ₡5,245M',
        haciendaSub: 'Tax evasion 2025',
        pjSub: 'Judicial collections 2024',
        source: 'Sources: actualidadtributaria.com (Hacienda), observador.cr (P. Judicial)',
      },
      depuracion: {
        title: 'Reduction in the waitlist cleanup rate (CCSS)',
        ariaLabel: 'Cleanup rate: from 31.2% to 18.2%',
        svgTitle: 'CCSS surgical waitlist cleanup rate: before 31.2%, after 18.2%',
        rateLabel: 'cleanup rate',
        before: 'Before',
        beforeSub: 'Start 2023',
        after: 'After',
        afterSub: 'Q1 2026',
        source: '367,403 patients resolved · 136,774 cases removed · Source: Teletica / CCSS',
      },
      lidia: {
        title: 'LIDIA model accuracy (type 2 diabetes)',
        ariaLabel: 'LIDIA: 95% accuracy',
        svgTitle: 'CCSS LIDIA model: 95% accuracy in type 2 diabetes detection',
        accuracyLabel: 'accuracy',
        recordsSub: '1M+ records · Clínica Clorito Picado',
        source: 'Source: Observador.cr / Teletica',
      },
      stalledModels: {
        title: 'Models stalled for lack of budget',
        models: ['Breast cancer', 'Pulmonary diseases', 'Acute coronary syndrome'],
        total: 'Total: ₡390M (< 0.02% of CCSS budget)',
        sourceLabel: 'Source: Teletica',
      },
      timeline: {
        title: 'Timeline of AI in Costa Rica\'s public sector (2018–2026)',
        ariaLabel: 'AI project timeline in the public sector',
        svgTitle: 'Timeline: from Poder Judicial\'s chatbot in 2018 to CCSS\'s LIDIA in 2026',
        source: 'Sources: Observatorio IA Costa Rica inventory, verified public sources',
        events: [
          { year: 2018, lines: ['PJ: Citizen', 'Chatbot'] },
          { year: 2019, lines: ['PJ: Budget', 'Prediction'] },
          { year: 2023, lines: ['CCSS: Waitlist', 'Cleanup'] },
          { year: 2024, lines: ['ENIA published', 'PJ: ₡5,245M collections'] },
          { year: 2025, lines: ['Hacienda:', '₡8,000M evasion'] },
          { year: 2026, lines: ['CCSS: EDUS Bot', '+ LIDIA pilot'] },
        ],
      },
    },

    ccss: {
      sectionTitle: 'The Most Urgent Case: CCSS',
      intro: 'If Poder Judicial and Hacienda represent what already works, CCSS represents both what works and what <strong>could work but is stalled</strong>.',
      botPara: 'The bot that cross-references EDUS with the Civil Registry cleans surgical waitlists: deceased patients, those already treated, and duplicates. Between 2023 and Q1 2026, it resolved 367,403 patients and removed 136,774 cases. The cleanup rate dropped from 31.2% to 18.2%, indicating <strong>more accurate lists, not just shorter ones</strong>.',
      lidiaLabel: 'LIDIA: the working model and the three that are stalled',
      lidiaPara1: 'LIDIA is a machine learning model developed at Clínica Clorito Picado on more than one million EDUS records. It identifies at-risk type 2 diabetes patients with 95% accuracy, enabling preventive intervention. The model costs ₡130 million (approx. USD 250,000).',
      lidiaPara2: 'Three additional models designed to detect breast cancer, pulmonary diseases, and acute coronary syndrome on the same dataset are stalled for lack of budget: ₡390 million in total (3 × ₡130M). That figure represents less than 0.02% of CCSS\'s ordinary budget.',
      calloutTitle: 'Pending policy decision:',
      callout: 'If the cost of activating these models is verifiably lower than the cost of a preventable complication per late-detected case, the justification for inaction requires explicit argumentation. That argument does not exist in the public domain.',
    },

    cronologia: {
      sectionTitle: 'Timeline: AI in Government (2018–2026)',
      body: 'The documented projects span eight years. The most mature institutions—Poder Judicial and CCSS—started before a national strategy existed.',
    },

    vacio: {
      sectionTitle: 'The Institutional Gap',
      para1: 'The MICITT\'s National AI Strategy (ENIA) 2024-2027 promised a National AI Center of Excellence. Costa Rica was the first country in Central America to adopt a national AI policy. <strong>The center does not exist</strong>: it is two years delayed with no assigned budget.',
      para2: 'Meanwhile, UCR conducts AI ethics research with Erasmus+ funding and CeNAT proposes LaNIA with IDB support. Each institution builds its own systems without a formal obligation to coordinate with MICITT or share learnings.',
      para3: 'Poder Judicial created its own governance framework because no one else did: it is the only institution to have formally published guidelines for internal generative AI use, according to available public information. The practical result is that learnings from each institution are not available to others. <strong>Each starts from zero.</strong>',
    },

    catalogo: {
      sectionTitle: 'Catalog of Identified Projects',
      body: 'The table includes the ten main projects documented with verifiable public data. The complete inventory contains twenty projects across seven institutions.',
      filters: { all: 'All', active: 'Active', pilot: 'Pilot', stalled: 'Stalled' },
      table: {
        institution: 'Institution',
        project: 'Project',
        year: 'Year',
        status: 'Status',
        impact: 'Impact',
      },
      badges: { activo: 'Active', piloto: 'Pilot', detenido: 'Stalled' },
      footnote: 'Selection of projects with verified public data. The full Observatory inventory includes 20 projects.',
    },

    projects: [
      { proyecto: 'Citizen chatbot', impacto: '24/7 service' },
      { proyecto: 'Budget prediction', impacto: '60+ centers, ₡100M+ saved' },
      { proyecto: 'AI judicial collections', impacto: '₡5,245M processed' },
      { proyecto: 'Generative AI governance framework', impacto: 'Only public guideline' },
      { proyecto: 'Tax evasion detector', impacto: '₡8,000M recovered' },
      { proyecto: 'Waitlist cleanup bot', impacto: '367,403 patients resolved' },
      { proyecto: 'LIDIA (type 2 diabetes)', impacto: '95% accuracy, 1M+ records' },
      { proyecto: 'Breast cancer model', impacto: '₡130M required' },
      { proyecto: 'Pulmonary disease model', impacto: '₡130M required' },
      { proyecto: 'Acute coronary syndrome model', impacto: '₡130M required' },
    ],

    queSigue: {
      sectionTitle: "What's Next at the Observatory",
      intro: 'This first edition of the inventory is a starting point, not a final state. The open questions that will guide future editions:',
      questions: [
        { q: 'What is the total cost of the active projects?', a: 'Returns are documented for PJ and Hacienda. Investment costs lack the same transparency.' },
        { q: 'Which institutions have the data infrastructure for the next project?', a: 'MEP, SUTEL, and municipalities have data. The question is whether they have the structure to use it.' },
        { q: 'When will the three LIDIA models be activated?', a: 'The budget decision has a deadline. So does the follow-up.' },
      ],
      closing: 'The inventory accepts corrections and additions. If you work at a public institution with an AI project that is not documented, the channel is open.',
    },

    footer: {
      bio: '<strong>Mario Pérez Edwards</strong> is an artificial intelligence policy analyst and founder of Observatorio IA Costa Rica.',
      cadence: 'Estado y Algoritmo is published biweekly. Catalog data as of May 8, 2026.',
      orgLabel: 'Observatorio IA Costa Rica',
    },
  },
} as const;

export type Locale = keyof typeof t;
export type Translations = typeof t[Locale];
