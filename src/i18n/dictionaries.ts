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
  hero: { kicker: string; headline: string; sub: string };
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
      'primer-debate': string;
      'segundo-debate': string;
      archivado: string;
      aprobada: string;
    };
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
  };
  estado: { operativo: string; piloto: string; planificado: string };
  languageToggle: { label: string; es: string; en: string };
  breadcrumb: { inicio: string };
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
        '16 proyectos de inteligencia artificial activos en el gobierno de Costa Rica.',
      sub: 'Mapeo abierto de la adopción de IA en el sector público costarricense: instituciones, proyectos, legislación e indicadores comparados con la región.',
    },
    instituciones: {
      kicker: '01 / Instituciones',
      titulo: 'Quién está adoptando IA en el Estado',
      sub: 'Seis instituciones públicas tienen al menos un proyecto de IA en operación o piloto activo.',
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
      titulo: 'Tres expedientes de ley en trámite, ninguno aprobado',
      sub: 'Costa Rica aún no tiene un marco regulatorio formal de IA. Los tres proyectos de ley presentados desde 2023 siguen en comisión.',
      expedienteLabel: 'Expediente',
      comisionLabel: 'Comisión',
      presentadoLabel: 'Presentado',
      estados: {
        'en-comision': 'En comisión',
        'primer-debate': 'Primer debate',
        'segundo-debate': 'Segundo debate',
        archivado: 'Archivado',
        aprobada: 'Aprobada',
      },
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
      legislacionTitulo: 'Tres expedientes, cero leyes aprobadas',
      legislacionSub:
        'Los tres proyectos de ley sobre IA presentados entre 2023 y 2025 siguen en comisión. Costa Rica avanza sin marco regulatorio formal.',
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
        '16 active artificial intelligence projects in the Costa Rican government.',
      sub: 'Open map of AI adoption across Costa Rica\u2019s public sector: institutions, projects, legislation and indicators benchmarked against the region.',
    },
    instituciones: {
      kicker: '01 / Institutions',
      titulo: 'Who is adopting AI inside the State',
      sub: 'Six public institutions run at least one active AI project, in production or pilot.',
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
      titulo: 'Three bills in progress, none passed',
      sub: 'Costa Rica still has no formal AI regulatory framework. The three bills filed since 2023 remain stuck in committee.',
      expedienteLabel: 'File',
      comisionLabel: 'Committee',
      presentadoLabel: 'Filed',
      estados: {
        'en-comision': 'In committee',
        'primer-debate': 'First debate',
        'segundo-debate': 'Second debate',
        archivado: 'Archived',
        aprobada: 'Passed',
      },
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
      legislacionTitulo: 'Three bills, zero laws passed',
      legislacionSub:
        'The three AI bills filed between 2023 and 2025 remain stuck in committee. Costa Rica is moving forward without a formal regulatory framework.',
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
