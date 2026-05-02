import type { Locale } from './config';

export interface Dictionary {
  siteName: string;
  siteCountry: string;
  nav: {
    inicio: string;
    instituciones: string;
    legislacion: string;
    indicadores: string;
    recursos: string;
    acerca: string;
  };
  hero: { kicker: string; headline: string; sub: string };
  instituciones: {
    kicker: string;
    titulo: string;
    sub: string;
    proyectosLabel: string;
    tipoLabel: {
      ministerio: string;
      judicial: string;
      autonoma: string;
      asamblea: string;
      universidad: string;
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
  };
  footer: {
    titulo: string;
    tagline: string;
    ultimaActualizacion: string;
    fuentes: string;
  };
  estado: { operativo: string; piloto: string; planificado: string };
  languageToggle: { label: string; es: string; en: string };
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
      recursos: 'Recursos',
      acerca: 'Acerca de',
    },
    hero: {
      kicker: 'Observatorio público',
      headline:
        '11 proyectos de inteligencia artificial activos en el gobierno de Costa Rica.',
      sub: 'Mapeo abierto de la adopción de IA en el sector público costarricense: instituciones, proyectos, legislación e indicadores comparados con la región.',
    },
    instituciones: {
      kicker: '01 / Instituciones',
      titulo: 'Quién está adoptando IA en el Estado',
      sub: 'Cinco instituciones públicas tienen al menos un proyecto de IA en operación o piloto activo.',
      proyectosLabel: 'proyectos',
      tipoLabel: {
        ministerio: 'Ministerio',
        judicial: 'Poder Judicial',
        autonoma: 'Institución autónoma',
        asamblea: 'Asamblea Legislativa',
        universidad: 'Universidad',
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
    },
    footer: {
      titulo: 'Observatorio IA Costa Rica',
      tagline: 'Datos públicos. Iniciativa independiente.',
      ultimaActualizacion: 'Última actualización: mayo 2026',
      fuentes: 'Fuentes: instituciones públicas de Costa Rica + ILIA (CEPAL).',
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
  },
  en: {
    siteName: 'AI Observatory',
    siteCountry: 'Costa Rica',
    nav: {
      inicio: 'Home',
      instituciones: 'Institutions',
      legislacion: 'Legislation',
      indicadores: 'Indicators',
      recursos: 'Resources',
      acerca: 'About',
    },
    hero: {
      kicker: 'Public observatory',
      headline:
        '11 active artificial intelligence projects in the Costa Rican government.',
      sub: 'Open map of AI adoption across Costa Rica\u2019s public sector: institutions, projects, legislation and indicators benchmarked against the region.',
    },
    instituciones: {
      kicker: '01 / Institutions',
      titulo: 'Who is adopting AI inside the State',
      sub: 'Five public institutions run at least one active AI project, in production or pilot.',
      proyectosLabel: 'projects',
      tipoLabel: {
        ministerio: 'Ministry',
        judicial: 'Judicial Branch',
        autonoma: 'Autonomous institution',
        asamblea: 'Legislative Assembly',
        universidad: 'University',
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
    },
    footer: {
      titulo: 'AI Observatory Costa Rica',
      tagline: 'Public data. Independent initiative.',
      ultimaActualizacion: 'Last updated: May 2026',
      fuentes: 'Sources: Costa Rican public institutions + ILIA (CEPAL).',
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
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
