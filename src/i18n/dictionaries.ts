import type { Locale } from './config';

export interface Dictionary {
  siteName: string;
  siteCountry: string;
  nav: {
    inicio: string;
    instituciones: string;
    legislacion: string;
    indicadores: string;
    analisis: string;
    recursos: string;
    acerca: string;
  };
  hero: {
    kicker: string;
    headline: string;
    sub: string;
    kpiCategoria: {
      proyectos: string;
      instituciones: string;
      legislacion: string;
      ranking: string;
    };
  };
  instituciones: {
    kicker: string;
    titulo: string;
    sub: string;
    proyectosLabel: string;
    verDetalle: string;
    tipoLabel: {
      ministerio: string;
      judicial: string;
      autonoma: string;
      asamblea: string;
      universidad: string;
      investigacion: string;
      camara: string;
    };
  };
  legislacion: {
    kicker: string;
    titulo: string;
    sub: string;
    expedienteLabel: string;
    comisionLabel: string;
    presentadoLabel: string;
    estados: {
      'en-comision': string;
      dictaminado: string;
      'primer-debate': string;
      'segundo-debate': string;
      archivado: string;
      aprobada: string;
    };
    verFuente: string;
    fuenteOficial: string;
  };
  indicadores: {
    kicker: string;
    titulo: string;
    sub: string;
    cardTitulo: string;
    fuente: string;
    brechaPre: string;
    brechaPuntos: string;
    brechaPost: string;
  };
  recursos: { kicker: string; titulo: string; abrir: string };
  acerca: {
    kicker: string;
    titulo: string;
    p1: string;
    p2: string;
    p3: string;
    ctaPregunta: string;
    verMas: string;
  };
  footer: {
    titulo: string;
    tagline: string;
    ultimaActualizacion: string;
    fuentes: string;
    quienMantiene: string;
    apiPublica: string;
  };
  estado: { operativo: string; piloto: string; planificado: string };
  languageToggle: { label: string; es: string; en: string };
  breadcrumb: { inicio: string };
  timeline: {
    kicker: string;
    titulo: string;
    sub: string;
    desdeLabel: string;
    sinResultadoLabel: string;
  };
  panorama: {
    kicker: string;
    titulo: string;
    sub: string;
    proyectoLabel: string;
  };
  chartIlia: {
    inversionTooltip: string;
    enteTooltip: string;
    drillCta: string;
    tabGrafico: string;
    tabTabla: string;
    tabRanking: string;
    colPos: string;
    colPais: string;
    colPuntaje: string;
    colBarra: string;
  };
  comparte: {
    kicker: string;
    titulo: string;
    sub: string;
    instrucciones: string;
    descargar: string;
    cuadradoLabel: string;
    horizontalLabel: string;
    storyLabel: string;
    secciones: {
      hero: string;
      timeline: string;
      ilia: string;
      mapa: string;
      brechas: string;
      og: string;
      stories: string;
    };
    assets: {
      kpiHeroTitulo: string;
      timelineTitulo: string;
      iliaTitulo: string;
      mapaTitulo: string;
      brechaXroad: string;
      brechaGobernanza: string;
      brechaChatbot: string;
      brechaAsistente: string;
      brechaTesting: string;
      brechaTalento: string;
      brechaDatos: string;
      ogHome: string;
      ogAnalisis: string;
      ogBrechas: string;
      storyTimeline: string;
      storyBrecha: string;
    };
    notaUso: string;
  };
  proyectoDetalle: {
    institucionLabel: string;
    categoriaLabel: string;
    estadoLabel: string;
    desdeLabel: string;
    queEsLabel: string;
    resultadoLabel: string;
    contextoLabel: string;
    fuenteLabel: string;
    relacionadosLabel: string;
    volverLabel: string;
    metaDescripcion: string;
  };
  institucionDetalle: {
    tipoLabel: string;
    sitioOficialLabel: string;
    resumenLabel: string;
    proyectosLabel: string;
    leccionesLabel: string;
    operativosLabel: string;
    pilotosLabel: string;
    planificadosLabel: string;
    metaDescripcion: string;
  };
  analisis: {
    kicker: string;
    titulo: string;
    sub: string;
    comparativaTitulo: string;
    comparativaSub: string;
    comparativaCols: {
      pais: string;
      ilia: string;
      inversion: string;
      ente: string;
      hito: string;
    };
    brechasTitulo: string;
    brechasSub: string;
    referenciaLabel: string;
    estadoCRLabel: string;
    porQueImporta: string;
    legislacionTitulo: string;
    legislacionSub: string;
    metaDescripcion: string;
    notaCierre: string;
  };
  quienMantiene: {
    kicker: string;
    titulo: string;
    autoria: { titulo: string; cuerpo: string };
    metodologia: { titulo: string; cuerpo: string; bullets: string[] };
    contacto: { titulo: string; cuerpo: string; emailLabel: string };
    disclaimer: { titulo: string; cuerpo: string };
    metaDescripcion: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    siteName: 'Observatorio IA',
    siteCountry: 'Costa Rica',
    nav: {
      inicio: 'Inicio',
      instituciones: 'Instituciones',
      legislacion: 'Legislación',
      indicadores: 'Indicadores',
      analisis: 'Análisis',
      recursos: 'Recursos',
      acerca: 'Acerca de',
    },
    hero: {
      kicker: 'Observatorio público',
      headline:
        '19 proyectos de inteligencia artificial activos en el sector público costarricense.',
      sub: 'Mapeo abierto de la adopción de IA en el sector público costarricense: instituciones, proyectos, legislación e indicadores comparados con la región.',
      kpiCategoria: {
        proyectos: 'Proyectos',
        instituciones: 'Instituciones',
        legislacion: 'Legislación',
        ranking: 'Ranking ILIA',
      },
    },
    instituciones: {
      kicker: '01 / Instituciones',
      titulo: 'Quién está adoptando IA en el Estado',
      sub: 'Siete instituciones públicas tienen al menos un proyecto de IA en operación o piloto activo.',
      proyectosLabel: 'proyectos',
      verDetalle: 'Ver detalle',
      tipoLabel: {
        ministerio: 'Ministerio',
        judicial: 'Poder Judicial',
        autonoma: 'Institución autónoma',
        asamblea: 'Asamblea Legislativa',
        universidad: 'Universidad',
        investigacion: 'Centro de investigación',
        camara: 'Cámara',
      },
    },
    legislacion: {
      kicker: '02 / Legislación',
      titulo: 'Cinco expedientes de ley en trámite, ninguno aprobado',
      sub: 'Costa Rica aún no tiene un marco regulatorio formal de IA. De los cinco proyectos de ley presentados desde 2023, dos ya cuentan con dictamen de comisión.',
      expedienteLabel: 'Expediente',
      comisionLabel: 'Comisión',
      presentadoLabel: 'Presentado',
      estados: {
        'en-comision': 'En comisión',
        dictaminado: 'Dictaminado',
        'primer-debate': 'Primer debate',
        'segundo-debate': 'Segundo debate',
        archivado: 'Archivado',
        aprobada: 'Aprobada',
      },
      verFuente: 'Ver expediente',
      fuenteOficial: 'Fuente: Asamblea Legislativa vía Delfino.cr',
    },
    indicadores: {
      kicker: '03 / Indicadores',
      titulo: 'Costa Rica en el contexto regional',
      sub: 'Posición en el Índice Latinoamericano de IA (ILIA), publicado anualmente por CEPAL. Datos 2025.',
      cardTitulo: 'ILIA 2025 / 100 puntos',
      fuente: 'Fuente: CEPAL',
      brechaPre: 'La brecha de Costa Rica con Chile (líder regional) es de',
      brechaPuntos: 'puntos',
      brechaPost:
        'Cerrar la brecha requiere implementación de la ENIA con metas medibles, presupuesto asignado y un marco regulatorio aprobado.',
    },
    recursos: {
      kicker: '04 / Recursos',
      titulo: 'Documentos y fuentes oficiales',
      abrir: '↗ Abrir',
    },
    acerca: {
      kicker: '05 / Acerca de',
      titulo:
        'Una iniciativa independiente para mapear la adopción de IA en el Estado',
      p1: 'El Observatorio IA Costa Rica nace para llenar un vacío: no existe una fuente pública, actualizada y verificable sobre dónde, cómo y con qué resultados se está adoptando inteligencia artificial en el sector público costarricense.',
      p2: 'Este sitio recopila proyectos en operación, expedientes de ley en trámite e indicadores comparados con la región. Toda la información proviene de fuentes oficiales y se cita con enlace al documento original.',
      p3: 'La meta es construir una herramienta útil para tomadores de decisión, prensa, academia, sector privado y ciudadanía interesada en cómo se usa la IA con fondos públicos.',
      ctaPregunta:
        '¿Conoce un proyecto de IA en una institución pública que no aparece aquí?',
      verMas: 'Conozca quién mantiene el observatorio y cómo se verifican los datos →',
    },
    footer: {
      titulo: 'Observatorio IA Costa Rica',
      tagline: 'Datos públicos. Iniciativa independiente.',
      ultimaActualizacion: 'Última actualización: mayo 2026',
      fuentes: 'Fuentes: instituciones públicas de Costa Rica + ILIA (CEPAL).',
      quienMantiene: 'Quién mantiene el observatorio',
      apiPublica: 'API pública JSON para periodistas/investigadores',
    },
    estado: {
      operativo: 'Operativo',
      piloto: 'Piloto',
      planificado: 'Planificado',
    },
    languageToggle: {
      label: 'Idioma',
      es: 'Español',
      en: 'English',
    },
    breadcrumb: {
      inicio: 'Inicio',
    },
    timeline: {
      kicker: 'Línea de tiempo',
      titulo: 'Adopción de IA en el Estado costarricense, 2018-2026',
      sub: 'Cada punto es un proyecto verificado en producción o piloto. La adopción se concentra en los últimos tres años, con el Poder Judicial liderando desde 2018.',
      desdeLabel: 'desde',
      sinResultadoLabel: 'Sin métrica pública',
    },
    panorama: {
      kicker: 'Panorama',
      titulo: 'Distribución de proyectos por institución',
      sub: 'Vista compacta de los 19 proyectos agrupados por institución y coloreados por estado. Click en cualquiera para abrir el detalle.',
      proyectoLabel: 'proyecto',
    },
    chartIlia: {
      inversionTooltip: 'Inversión',
      enteTooltip: 'Ente ejecutor',
      drillCta: 'Ver análisis completo →',
      tabGrafico: 'Gráfico',
      tabTabla: 'Tabla',
      tabRanking: 'Ranking',
      colPos: 'Pos.',
      colPais: 'País',
      colPuntaje: 'Puntaje',
      colBarra: 'Visual',
    },
    comparte: {
      kicker: 'Material para compartir',
      titulo: 'Imágenes descargables del observatorio',
      sub: 'Visualizaciones listas para LinkedIn, X (Twitter), Instagram y link previews. Descarga libre con atribución sugerida a observatorioia.org.',
      instrucciones: 'Click derecho → Guardar imagen, o tap el botón Descargar. Las dimensiones están optimizadas para cada red social.',
      descargar: 'Descargar',
      cuadradoLabel: '1080×1080 · LinkedIn / Instagram / X cuadrado',
      horizontalLabel: '1200×630 · Link preview (OpenGraph)',
      storyLabel: '1080×1920 · Stories / Reels',
      secciones: {
        hero: 'Cifras clave',
        timeline: 'Línea de tiempo',
        ilia: 'Comparativa regional ILIA',
        mapa: 'Mapa de instituciones',
        brechas: 'Brechas vs Estonia / Singapur',
        og: 'Link previews (OpenGraph)',
        stories: 'Stories verticales',
      },
      assets: {
        kpiHeroTitulo: '19 proyectos, 7 instituciones, 5 leyes',
        timelineTitulo: 'Adopción de IA en el Estado, 2018-2026',
        iliaTitulo: 'Costa Rica vs América Latina (ILIA 2025)',
        mapaTitulo: 'Distribución de proyectos por institución',
        brechaXroad: 'Brecha 1 — Interoperabilidad nacional',
        brechaGobernanza: 'Brecha 2 — Marco formal de gobernanza',
        brechaChatbot: 'Brecha 3 — Chatbot ciudadano nacional',
        brechaAsistente: 'Brecha 4 — Asistente IA para funcionarios',
        brechaTesting: 'Brecha 5 — Testing IA pre-despliegue',
        brechaTalento: 'Brecha 6 — Meta talento con presupuesto',
        brechaDatos: 'Brecha 7 — Datos transfronterizos',
        ogHome: 'Link preview — Home',
        ogAnalisis: 'Link preview — Análisis',
        ogBrechas: 'Link preview — Brechas',
        storyTimeline: 'Story — Línea de tiempo',
        storyBrecha: 'Story — 19 puntos abajo de Chile',
      },
      notaUso: 'Atribución sugerida: "Observatorio IA Costa Rica · observatorioia.org". Las imágenes se pueden usar libremente en publicaciones, presentaciones y redes sociales.',
    },
    proyectoDetalle: {
      institucionLabel: 'Institución',
      categoriaLabel: 'Categoría',
      estadoLabel: 'Estado',
      desdeLabel: 'Operativo desde',
      queEsLabel: 'Qué es',
      resultadoLabel: 'Resultados verificados',
      contextoLabel: 'Contexto',
      fuenteLabel: 'Fuente oficial',
      relacionadosLabel: 'Proyectos relacionados',
      volverLabel: '← Volver a la institución',
      metaDescripcion: 'Proyecto de IA en el sector público de Costa Rica.',
    },
    institucionDetalle: {
      tipoLabel: 'Tipo',
      sitioOficialLabel: 'Sitio oficial',
      resumenLabel: 'Resumen ejecutivo',
      proyectosLabel: 'Proyectos de IA',
      leccionesLabel: 'Lecciones de adopción',
      operativosLabel: 'operativos',
      pilotosLabel: 'pilotos',
      planificadosLabel: 'planificados',
      metaDescripcion: 'Institución pública de Costa Rica con proyectos de IA.',
    },
    analisis: {
      kicker: 'Análisis',
      titulo: 'Costa Rica perdió 19 puntos vs Chile en el ILIA 2025',
      sub: 'Comparativa regional, brechas de capacidad estructural y estado del marco regulatorio. Datos verificados de fuentes oficiales y reportes multilaterales.',
      comparativaTitulo: 'Comparativa regional',
      comparativaSub: 'Posición ILIA, inversión y ente ejecutor en los cinco países latinoamericanos del ranking 2025.',
      comparativaCols: {
        pais: 'País',
        ilia: 'ILIA 2025',
        inversion: 'Inversión IA',
        ente: 'Ente ejecutor',
        hito: 'Hito clave',
      },
      brechasTitulo: 'Siete capacidades que Costa Rica aún no tiene operativas',
      brechasSub:
        'Comparación con Estonia (1.3M habitantes) y Singapur (5.6M habitantes), dos referentes globales en gobierno digital. Cada brecha cita evidencia verificable.',
      referenciaLabel: 'Referencia',
      estadoCRLabel: 'Estado en Costa Rica',
      porQueImporta: 'Por qué importa',
      legislacionTitulo: 'Cinco expedientes, cero leyes aprobadas',
      legislacionSub:
        'Los cinco proyectos de ley sobre IA presentados entre 2023 y 2025 siguen sin aprobarse. Dos ya cuentan con dictamen de comisión. Costa Rica avanza sin marco regulatorio formal.',
      metaDescripcion:
        'Análisis de la brecha de Costa Rica frente a líderes regionales y globales en adopción de IA en gobierno.',
      notaCierre:
        'Este análisis presenta evidencia y brechas. No incluye recomendaciones de política pública: esa conversación corresponde a los actores institucionales del país.',
    },
    quienMantiene: {
      kicker: 'Quién mantiene el observatorio',
      titulo: 'Iniciativa independiente, datos verificables, fuentes oficiales',
      autoria: {
        titulo: 'Autoría',
        cuerpo:
          'El Observatorio IA Costa Rica es mantenido por Mario Pérez Edwards (UnikPrompt), independiente de cualquier institución pública o empresa privada. La marca del sitio es neutra; la firma editorial es transparente.',
      },
      metodologia: {
        titulo: 'Metodología',
        cuerpo: 'Cada dato publicado cumple con los siguientes criterios:',
        bullets: [
          'Proviene de una fuente oficial pública (institución del Estado costarricense, organismo multilateral o medio reconocido).',
          'Lleva enlace al documento original en el campo "Fuente oficial".',
          'Si una cifra no está confirmada en fuente verificable, no se publica.',
          'Las traducciones al inglés son revisadas; las cifras y nombres propios se mantienen idénticos en ambos idiomas.',
          'Los textos de "Contexto" y "Lecciones" son interpretación editorial sobre datos verificados, claramente separados del dato bruto.',
        ],
      },
      contacto: {
        titulo: 'Contacto',
        cuerpo:
          '¿Conoce un proyecto de IA en una institución pública que no aparece aquí? ¿Detectó un dato desactualizado? Escríbanos.',
        emailLabel: 'Escribir al observatorio',
      },
      disclaimer: {
        titulo: 'Aviso',
        cuerpo:
          'Este sitio no es oficial. No representa la posición del Gobierno de Costa Rica, del MICITT ni de ninguna otra institución pública. Su único compromiso es con la verificabilidad de los datos publicados.',
      },
      metaDescripcion:
        'Quién mantiene el Observatorio IA Costa Rica, cómo se verifican los datos y cómo contactar al equipo editorial.',
    },
  },
  en: {
    siteName: 'AI Observatory',
    siteCountry: 'Costa Rica',
    nav: {
      inicio: 'Home',
      instituciones: 'Institutions',
      legislacion: 'Legislation',
      indicadores: 'Indicators',
      analisis: 'Analysis',
      recursos: 'Resources',
      acerca: 'About',
    },
    hero: {
      kicker: 'Public observatory',
      headline:
        '19 active artificial intelligence projects in Costa Rica\u2019s public sector.',
      sub: 'Open map of AI adoption across Costa Rica\u2019s public sector: institutions, projects, legislation and indicators benchmarked against the region.',
      kpiCategoria: {
        proyectos: 'Projects',
        instituciones: 'Institutions',
        legislacion: 'Legislation',
        ranking: 'ILIA ranking',
      },
    },
    instituciones: {
      kicker: '01 / Institutions',
      titulo: 'Who is adopting AI inside the State',
      sub: 'Seven public institutions run at least one active AI project, in production or pilot.',
      proyectosLabel: 'projects',
      verDetalle: 'View details',
      tipoLabel: {
        ministerio: 'Ministry',
        judicial: 'Judicial Branch',
        autonoma: 'Autonomous institution',
        asamblea: 'Legislative Assembly',
        universidad: 'University',
        investigacion: 'Research center',
        camara: 'Chamber',
      },
    },
    legislacion: {
      kicker: '02 / Legislation',
      titulo: 'Five bills in progress, none passed',
      sub: 'Costa Rica still has no formal AI regulatory framework. Of the five bills filed since 2023, two already have a committee report.',
      expedienteLabel: 'File',
      comisionLabel: 'Committee',
      presentadoLabel: 'Filed',
      estados: {
        'en-comision': 'In committee',
        dictaminado: 'Committee report issued',
        'primer-debate': 'First debate',
        'segundo-debate': 'Second debate',
        archivado: 'Archived',
        aprobada: 'Passed',
      },
      verFuente: 'View bill',
      fuenteOficial: 'Source: Legislative Assembly via Delfino.cr',
    },
    indicadores: {
      kicker: '03 / Indicators',
      titulo: 'Costa Rica in the regional context',
      sub: 'Ranking in the Latin American AI Index (ILIA), published annually by CEPAL. 2025 data.',
      cardTitulo: 'ILIA 2025 / 100 points',
      fuente: 'Source: CEPAL',
      brechaPre: 'Costa Rica\u2019s gap behind Chile (regional leader) is',
      brechaPuntos: 'points',
      brechaPost:
        'Closing the gap requires implementing ENIA with measurable targets, allocated budget and an approved regulatory framework.',
    },
    recursos: {
      kicker: '04 / Resources',
      titulo: 'Official documents and sources',
      abrir: '↗ Open',
    },
    acerca: {
      kicker: '05 / About',
      titulo: 'An independent initiative to map AI adoption inside the State',
      p1: 'AI Observatory Costa Rica fills a gap: there is no public, up-to-date and verifiable source on where, how and with what results artificial intelligence is being adopted across Costa Rica\u2019s public sector.',
      p2: 'This site gathers active projects, pending bills and indicators benchmarked against the region. Every data point comes from official sources and links back to the original document.',
      p3: 'The goal is to build a useful tool for decision makers, journalists, academia, the private sector and citizens interested in how AI is being used with public funds.',
      ctaPregunta:
        'Do you know of an AI project in a public institution that is not listed here?',
      verMas: 'Learn who maintains the observatory and how data is verified →',
    },
    footer: {
      titulo: 'AI Observatory Costa Rica',
      tagline: 'Public data. Independent initiative.',
      ultimaActualizacion: 'Last updated: May 2026',
      fuentes: 'Sources: Costa Rican public institutions + ILIA (CEPAL).',
      quienMantiene: 'Who maintains the observatory',
      apiPublica: 'Public JSON API for journalists/researchers',
    },
    estado: {
      operativo: 'Live',
      piloto: 'Pilot',
      planificado: 'Planned',
    },
    languageToggle: {
      label: 'Language',
      es: 'Español',
      en: 'English',
    },
    breadcrumb: {
      inicio: 'Home',
    },
    timeline: {
      kicker: 'Timeline',
      titulo: 'AI adoption in the Costa Rican State, 2018-2026',
      sub: 'Each dot is a verified project in production or pilot. Adoption is concentrated in the past three years, with the Judicial Branch leading since 2018.',
      desdeLabel: 'since',
      sinResultadoLabel: 'No public metric',
    },
    panorama: {
      kicker: 'Overview',
      titulo: 'Project distribution by institution',
      sub: 'Compact view of all 19 projects grouped by institution and colored by status. Click any to open the detail page.',
      proyectoLabel: 'project',
    },
    chartIlia: {
      inversionTooltip: 'Investment',
      enteTooltip: 'Executing body',
      drillCta: 'See full analysis →',
      tabGrafico: 'Chart',
      tabTabla: 'Table',
      tabRanking: 'Ranking',
      colPos: 'Pos.',
      colPais: 'Country',
      colPuntaje: 'Score',
      colBarra: 'Visual',
    },
    comparte: {
      kicker: 'Shareable assets',
      titulo: 'Downloadable images from the observatory',
      sub: 'Visualizations ready for LinkedIn, X (Twitter), Instagram and link previews. Free use with attribution suggested to observatorioia.org.',
      instrucciones: 'Right-click → Save image, or tap the Download button. Dimensions are optimized for each social network.',
      descargar: 'Download',
      cuadradoLabel: '1080×1080 · LinkedIn / Instagram / X square',
      horizontalLabel: '1200×630 · Link preview (OpenGraph)',
      storyLabel: '1080×1920 · Stories / Reels',
      secciones: {
        hero: 'Key figures',
        timeline: 'Timeline',
        ilia: 'Regional ILIA comparison',
        mapa: 'Institution map',
        brechas: 'Gaps vs Estonia / Singapore',
        og: 'Link previews (OpenGraph)',
        stories: 'Vertical stories',
      },
      assets: {
        kpiHeroTitulo: '19 projects, 7 institutions, 5 bills',
        timelineTitulo: 'AI adoption in the Costa Rican State, 2018-2026',
        iliaTitulo: 'Costa Rica vs Latin America (ILIA 2025)',
        mapaTitulo: 'Project distribution by institution',
        brechaXroad: 'Gap 1 — National interoperability',
        brechaGobernanza: 'Gap 2 — Formal governance framework',
        brechaChatbot: 'Gap 3 — National citizen chatbot',
        brechaAsistente: 'Gap 4 — AI assistant for public servants',
        brechaTesting: 'Gap 5 — Pre-deployment AI testing',
        brechaTalento: 'Gap 6 — Numerical talent target with budget',
        brechaDatos: 'Gap 7 — Cross-border data agreements',
        ogHome: 'Link preview — Home',
        ogAnalisis: 'Link preview — Analysis',
        ogBrechas: 'Link preview — Gaps',
        storyTimeline: 'Story — Timeline',
        storyBrecha: 'Story — 19 points behind Chile',
      },
      notaUso: 'Suggested attribution: "AI Observatory Costa Rica · observatorioia.org". Images may be freely used in publications, presentations and social media.',
    },
    proyectoDetalle: {
      institucionLabel: 'Institution',
      categoriaLabel: 'Category',
      estadoLabel: 'Status',
      desdeLabel: 'Live since',
      queEsLabel: 'What it is',
      resultadoLabel: 'Verified results',
      contextoLabel: 'Context',
      fuenteLabel: 'Official source',
      relacionadosLabel: 'Related projects',
      volverLabel: '← Back to institution',
      metaDescripcion: 'AI project inside Costa Rica\u2019s public sector.',
    },
    institucionDetalle: {
      tipoLabel: 'Type',
      sitioOficialLabel: 'Official website',
      resumenLabel: 'Executive summary',
      proyectosLabel: 'AI projects',
      leccionesLabel: 'Adoption lessons',
      operativosLabel: 'live',
      pilotosLabel: 'pilots',
      planificadosLabel: 'planned',
      metaDescripcion: 'Costa Rican public institution with AI projects.',
    },
    analisis: {
      kicker: 'Analysis',
      titulo: 'Costa Rica fell 19 points behind Chile in ILIA 2025',
      sub: 'Regional benchmarking, structural capability gaps and state of the regulatory framework. Verified data from official sources and multilateral reports.',
      comparativaTitulo: 'Regional benchmark',
      comparativaSub: 'ILIA score, investment and executing body for the five Latin American countries in the 2025 ranking.',
      comparativaCols: {
        pais: 'Country',
        ilia: 'ILIA 2025',
        inversion: 'AI investment',
        ente: 'Executing body',
        hito: 'Key milestone',
      },
      brechasTitulo: 'Seven capabilities Costa Rica has not yet built',
      brechasSub:
        'Compared with Estonia (1.3M people) and Singapore (5.6M people), two global benchmarks in digital government. Each gap cites verifiable evidence.',
      referenciaLabel: 'Reference',
      estadoCRLabel: 'Status in Costa Rica',
      porQueImporta: 'Why it matters',
      legislacionTitulo: 'Five bills, zero laws passed',
      legislacionSub:
        'The five AI bills filed between 2023 and 2025 remain unapproved. Two already have a committee report. Costa Rica is moving forward without a formal regulatory framework.',
      metaDescripcion:
        'Analysis of Costa Rica\u2019s gap versus regional and global leaders in AI adoption inside government.',
      notaCierre:
        'This analysis presents evidence and gaps. It does not include public-policy recommendations: that conversation belongs to the country\u2019s institutional actors.',
    },
    quienMantiene: {
      kicker: 'Who maintains the observatory',
      titulo: 'Independent initiative, verifiable data, official sources',
      autoria: {
        titulo: 'Authorship',
        cuerpo:
          'AI Observatory Costa Rica is maintained by Mario Pérez Edwards (UnikPrompt), independent of any public institution or private company. The site brand is neutral; the editorial signature is transparent.',
      },
      metodologia: {
        titulo: 'Methodology',
        cuerpo: 'Every published data point meets the following criteria:',
        bullets: [
          'It comes from a public official source (Costa Rican State institution, multilateral body or recognized media outlet).',
          'It carries a link to the original document in the "Official source" field.',
          'If a number is not confirmed by a verifiable source, it is not published.',
          'English translations are reviewed; figures and proper names remain identical in both languages.',
          'The "Context" and "Lessons" sections are editorial interpretation built on verified data, clearly separated from the raw data.',
        ],
      },
      contacto: {
        titulo: 'Contact',
        cuerpo:
          'Do you know of an AI project in a public institution that is not listed here? Did you spot outdated data? Get in touch.',
        emailLabel: 'Email the observatory',
      },
      disclaimer: {
        titulo: 'Disclaimer',
        cuerpo:
          'This site is not official. It does not represent the position of the Government of Costa Rica, MICITT or any other public institution. Its only commitment is to the verifiability of the data published.',
      },
      metaDescripcion:
        'Who maintains AI Observatory Costa Rica, how data is verified and how to contact the editorial team.',
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
