import type { Locale } from './config';
import type {
  DimensionEvidencia,
  EstadoCatalogo,
  EstadoEvaluacion,
  EstadoIA,
  FaseImplementacion,
  RespaldoFuente,
  TipoFuente,
  TipoIniciativa,
  TipoRelacion,
} from '@/data/modelo-evidencia';
import type { CapaCatalogo, TipoFechaReferencia } from '@/data/presentacion-catalogo';

export interface Dictionary {
  siteName: string;
  siteCountry: string;
  nav: {
    inicio: string;
    proyectos: string;
    instituciones: string;
    legislacion: string;
    indicadores: string;
    analisis: string;
    actualizaciones: string;
    recursos: string;
    acerca: string;
    marcoPais: string;
    enia: string;
    navegacionPrincipal: string;
    abrirMenu: string;
    cerrarMenu: string;
  };
  hero: {
    kicker: string;
    headline: string;
    sub: string;
    capasIntro: string;
    contextoIntro: string;
    ctaCatalogo: string;
    ctaMetodologia: string;
    kpiCategoria: {
      proyectos: string;
      instituciones: string;
      legislacion: string;
      ranking: string;
    };
  };
  home: {
    seleccion: {
      kicker: string;
      titulo: string;
      sub: string;
      regla: string;
    };
    contexto: {
      kicker: string;
      titulo: string;
      marcoLabel: string;
      legislacionLabel: string;
      ultimaActividadLabel: string;
    };
    cambios: {
      kicker: string;
      titulo: string;
      sub: string;
    };
    rutas: {
      kicker: string;
      titulo: string;
      sub: string;
      metodologiaLabel: string;
      descripciones: {
        proyectos: string;
        instituciones: string;
        enia: string;
        legislacion: string;
        indicadores: string;
        metodologia: string;
      };
    };
  };
  instituciones: {
    kicker: string;
    titulo: string;
    sub: string;
    proyectosLabel: string;
    conteoDerivadoLabel: string;
    verDetalle: string;
    registroLabel: string;
    actividadLabel: string;
    ultimaVerificacionLabel: string;
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
    alcances: {
      principal: string;
      relacionado: string;
    };
    estados: {
      'en-comision': string;
      dictaminado: string;
      'primer-debate': string;
      'segundo-debate': string;
      archivado: string;
      aprobada: string;
    };
    verFuente: string;
    verEstadoOficial: string;
    verificadoLabel: string;
    coyunturaKicker: string;
    coyunturaTitulo: string;
    coyunturaSub: string;
    registroTitulo: string;
    registroSub: string;
    estadoOficialLabel: string;
    alcanceLabel: string;
    fuentesOficialesLabel: string;
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
  recursos: { kicker: string; titulo: string; abrir: string; metaDescripcion: string };
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
    historialMonitoreo: string;
    apiPublica: string;
    atribucion: string;
    explorarLabel: string;
    transparenciaLabel: string;
    privacidadLabel: string;
    recursosLabel: string;
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
    vistaVerificada: string;
    vistaCompleta: string;
    vistaVerificadaAyuda: string;
    vistaCompletaAyuda: string;
    scrollHint: string;
    fechaLabel: Record<TipoFechaReferencia, string>;
  };
  panorama: {
    kicker: string;
    titulo: string;
    sub: string;
    proyectoLabel: string;
    leyendaLabel: string;
  };
  catalogo: {
    kicker: string;
    titulo: string;
    sub: string;
    metaDescripcion: string;
    totalDocumentadas: string;
    capas: Record<
      CapaCatalogo,
      { titulo: string; corto: string; descripcion: string; criterio: string }
    >;
    verTodas: string;
    buscarLabel: string;
    buscarPlaceholder: string;
    institucionFiltroLabel: string;
    todasInstituciones: string;
    resultadosLabel: string;
    sinResultados: string;
    limpiarFiltros: string;
    fichaCta: string;
    ultimaVerificacionLabel: string;
    proximaRevisionLabel: string;
    metodologiaTitulo: string;
    metodologiaCuerpo: string;
    metodologiaCta: string;
    tipos: Record<TipoIniciativa, string>;
    estados: Record<EstadoCatalogo, string>;
    fases: Record<FaseImplementacion, string>;
    estadosIA: Record<EstadoIA, string>;
    evaluacionEstados: Record<EstadoEvaluacion, string>;
    dimensiones: Record<DimensionEvidencia, string>;
    tiposFuente: Record<TipoFuente, string>;
    respaldosFuente: Record<RespaldoFuente, string>;
    relaciones: Record<TipoRelacion, string>;
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
  indicadorDgi: {
    titulo: string;
    sub: string;
    fuenteLabel: string;
    scoreLabel: string;
    subdimsLabel: string;
    crProgresoLabel: string;
  };
  indicadorOurdata: {
    titulo: string;
    sub: string;
    fuenteLabel: string;
    scoreLabel: string;
    subdimsLabel: string;
    crProgresoLabel: string;
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
    expedienteLabel: string;
    institucionLabel: string;
    categoriaLabel: string;
    estadoLabel: string;
    desdeLabel: { operativo: string; piloto: string; planificado: string };
    queEsLabel: string;
    resultadoLabel: { operativo: string; piloto: string; planificado: string };
    contextoLabel: string;
    fuenteLabel: string;
    relacionadosLabel: string;
    volverLabel: string;
    metaDescripcion: string;
    fichaEvidenciaLabel: string;
    tipoIniciativaLabel: string;
    faseLabel: string;
    estadoIALabel: string;
    evidenciaEjecucionLabel: string;
    primeraEvidenciaLabel: string;
    ultimaVerificacionLabel: string;
    proximaRevisionLabel: string;
    objetivoDeclaradoLabel: string;
    alcanceTitulo: string;
    cronologiaTitulo: string;
    cronologiaSub: string;
    cronologiaEventos: {
      ultimaVerificacion: string;
      proximaRevision: string;
    };
    hallazgosTitulo: string;
    confirmadoLabel: string;
    noDeterminadoLabel: string;
    preguntasAbiertasLabel: string;
    resultadosDocumentadosLabel: string;
    resultadosSub: string;
    sinResultadosDocumentados: string;
    evidenciaTitulo: string;
    evidenciaSub: string;
    fuentesTitulo: string;
    fuentesSub: string;
    publicadorLabel: string;
    tipoFuenteLabel: string;
    fechaPublicacionLabel: string;
    fechaConsultaLabel: string;
    respaldaLabel: string;
    relacionesTitulo: string;
    verIniciativaLabel: string;
    sinDatosConfirmados: string;
    sinNoDeterminados: string;
    sinPreguntasAbiertas: string;
  };
  institucionDetalle: {
    expedienteLabel: string;
    tipoLabel: string;
    sitioOficialLabel: string;
    resumenLabel: string;
    proyectosLabel: string;
    leccionesLabel: string;
    operativosLabel: string;
    pilotosLabel: string;
    planificadosLabel: string;
    metaDescripcion: string;
    verificadosLabel: string;
    seguimientoLabel: string;
    ecosistemaLabel: string;
    conteoNota: string;
    ultimaVerificacionLabel: string;
    registroSub: string;
    fuenteInstitucionalLabel: string;
  };
  analisis: {
    kicker: string;
    titulo: string;
    sub: string;
    articulosTitulo: string;
    articulosSub: string;
    articulosLeerMas: string;
    articulosVacio: string;
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
  changelog: {
    kicker: string;
    titulo: string;
    intro: string;
    verHistorialCompleto: string;
    tableCols: {
      fecha: string;
      tipo: string;
      actualizacion: string;
      fuente: string;
    };
    tipos: {
      legislacion: string;
      institucion: string;
      indicador: string;
      proyecto: string;
      recurso: string;
    };
    historialPagina: {
      titulo: string;
      sub: string;
      metaDescripcion: string;
      volverHome: string;
    };
  };
  marcoPais: {
    kicker: string;
    titulo: string;
    sub: string;
    tesis: string;
    ultimaActualizacion: string;
    metaTitle: string;
    metaDescripcion: string;
    indicadores: {
      titulo: string;
      sub: string;
      cards: {
        estrategia: { numero: string; titulo: string; detalle: string };
        planAccion: { numero: string; titulo: string; detalle: string };
        capituloCntd: { numero: string; titulo: string; detalle: string };
        expedientes: { numero: string; titulo: string; detalle: string };
        instituciones: { numero: string; titulo: string; detalle: string };
        proyectos: { numero: string; titulo: string; detalle: string };
      };
    };
    arquitectura: {
      kicker: string;
      titulo: string;
      sub: string;
      tagline: string;
      capaLabel: string;
      campos: {
        instrumentos: string;
        funcion: string;
        alcance: string;
        fuerza: string;
        vacio: string;
      };
    };
    timeline: {
      kicker: string;
      titulo: string;
      sub: string;
      pendienteLabel: string;
    };
    matriz: {
      kicker: string;
      titulo: string;
      sub: string;
      cols: {
        instrumento: string;
        tipo: string;
        alcance: string;
        fuerza: string;
        queResuelve: string;
        queNoResuelve: string;
        estado: string;
        publicado: string;
      };
    };
    brechas: {
      kicker: string;
      titulo: string;
      sub: string;
    };
    conexion: {
      kicker: string;
      titulo: string;
      sub: string;
      ctaProyectos: string;
      ctaInstituciones: string;
      ctaLegislacion: string;
      ctaIndicadores: string;
      ctaRecursos: string;
      ctaEnia: string;
    };
    fuentes: {
      kicker: string;
      titulo: string;
      sub: string;
      fuentesLabel: string;
      criteriosLabel: string;
      criterios: string[];
      tipos: string[];
    };
    fuerzaTipos: {
      referencial: string;
      orientadora: string;
      obligatoria: string;
      'no-vigente': string;
      operativa: string;
      pendiente: string;
    };
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    siteName: 'Observatorio IA',
    siteCountry: 'Costa Rica',
    nav: {
      inicio: 'Inicio',
      proyectos: 'Catálogo',
      instituciones: 'Instituciones',
      legislacion: 'Legislación',
      indicadores: 'Indicadores',
      analisis: 'Análisis',
      actualizaciones: 'Actualizaciones',
      recursos: 'Recursos',
      acerca: 'Acerca de',
      marcoPais: 'Marco país',
      enia: 'Plan ENIA',
      navegacionPrincipal: 'Navegación principal',
      abrirMenu: 'Abrir menú',
      cerrarMenu: 'Cerrar menú',
    },
    hero: {
      kicker: 'Observatorio público',
      headline:
        '{adopcionVerificada} sistemas o componentes de IA con piloto u operación verificados en el sector público costarricense.',
      sub: 'El catálogo documenta {iniciativasDocumentadas} iniciativas y separa la adopción comprobada de los anuncios en seguimiento y de las capacidades del ecosistema.',
      capasIntro: 'Qué cuenta la evidencia',
      contextoIntro: 'Contexto del observatorio',
      ctaCatalogo: 'Explorar el catálogo',
      ctaMetodologia: 'Cómo verificamos',
      kpiCategoria: {
        proyectos: 'Iniciativas',
        instituciones: 'Instituciones',
        legislacion: 'Legislación',
        ranking: 'Ranking ILIA',
      },
    },
    home: {
      seleccion: {
        kicker: 'Evidencia destacada',
        titulo: 'Tres fichas verificadas para empezar',
        sub: 'Una entrada breve al catálogo completo, seleccionada mediante una regla pública y reproducible.',
        regla: 'Regla de selección: verificación más reciente; en empate, fecha documental e identificador.',
      },
      contexto: {
        kicker: 'Lectura de conjunto',
        titulo: 'Del marco país al movimiento legislativo',
        marcoLabel: 'Arquitectura pública',
        legislacionLabel: 'Actividad legislativa',
        ultimaActividadLabel: 'Último cambio registrado',
      },
      cambios: {
        kicker: 'Bitácora pública',
        titulo: 'Qué cambió en el Observatorio',
        sub: 'Las tres entradas más recientes del registro editorial, con fecha y procedencia.',
      },
      rutas: {
        kicker: 'Índice del Observatorio',
        titulo: 'Elegí el nivel de evidencia que necesitás',
        sub: 'Cada colección completa tiene su propia ruta; la portada solo ofrece la lectura de entrada.',
        metodologiaLabel: 'Metodología',
        descripciones: {
          proyectos: '{iniciativasDocumentadas} iniciativas clasificadas por evidencia, fase e institución.',
          instituciones: '{instituciones} carteras institucionales con sus conteos derivados del catálogo.',
          enia: 'La matriz oficial del Plan, sus intervenciones únicas y el cruce con evidencia pública.',
          legislacion: '{legislacion} expedientes con estado, comisión, fuente oficial y fecha de verificación.',
          indicadores: 'Series ILIA, DGI y OURdata para ubicar a Costa Rica en contexto regional.',
          metodologia: 'Criterios de inclusión, trazabilidad, autoría y canales para corregir datos.',
        },
      },
    },
    instituciones: {
      kicker: '01 / Instituciones',
      titulo: 'Dónde aparecen iniciativas de IA en el Estado',
      sub: '{instituciones} instituciones públicas tienen iniciativas documentadas relacionadas con IA. El catálogo incluye sistemas, pilotos, planes y capacidades.',
      proyectosLabel: 'iniciativas',
      conteoDerivadoLabel: 'clasificadas en el catálogo',
      verDetalle: 'Ver detalle',
      registroLabel: 'Registro institucional',
      actividadLabel: 'Iniciativas destacadas',
      ultimaVerificacionLabel: 'Último corte',
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
      titulo: '{total} expedientes relacionados con IA, ninguno aprobado',
      sub: 'El inventario distingue {principales} proyectos cuyo objeto principal es la IA y {relacionados} directamente relacionados. {dictaminados} cuentan con dictamen y {enComision} permanecen en comisión.',
      expedienteLabel: 'Expediente',
      comisionLabel: 'Comisión',
      presentadoLabel: 'Presentado',
      alcances: {
        principal: 'Regulación principal de IA',
        relacionado: 'Directamente relacionado',
      },
      estados: {
        'en-comision': 'En comisión',
        dictaminado: 'Dictaminado',
        'primer-debate': 'Primer debate',
        'segundo-debate': 'Segundo debate',
        archivado: 'Archivado',
        aprobada: 'Aprobada',
      },
      verFuente: 'Ver expediente',
      verEstadoOficial: 'Ver evidencia oficial del estado',
      verificadoLabel: 'Verificado',
      coyunturaKicker: 'Lectura editorial',
      coyunturaTitulo: 'Coyuntura alrededor de los expedientes',
      coyunturaSub:
        'Estas notas registran hechos y contexto público. No sustituyen el estado que publica la Asamblea Legislativa.',
      registroTitulo: 'Registro oficial de expedientes',
      registroSub:
        'Número, comisión, alcance, estado y verificación se transcriben por separado del contexto editorial.',
      estadoOficialLabel: 'Estado legislativo oficial',
      alcanceLabel: 'Alcance respecto de IA',
      fuentesOficialesLabel: 'Fuentes oficiales',
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
      metaDescripcion: 'Directorio bilingüe de documentos, normas, estrategias, indicadores y fuentes públicas utilizadas por el Observatorio IA Costa Rica.',
    },
    acerca: {
      kicker: '05 / Acerca de',
      titulo:
        'Una iniciativa independiente para distinguir evidencia, anuncios y capacidades',
      p1: 'El Observatorio IA Costa Rica nace para llenar un vacío: no existe una fuente pública y actualizada que distinga con criterios verificables dónde hay adopción de inteligencia artificial y dónde solo hay planes, menciones o capacidades relacionadas.',
      p2: 'Este sitio organiza las iniciativas en tres capas: adopción verificada, seguimiento, y ecosistema y capacidades. También documenta expedientes de ley e indicadores comparados con la región. Cada registro enlaza sus fuentes y publica los vacíos de información.',
      p3: 'La meta es construir una herramienta útil para tomadores de decisión, prensa, academia, sector privado y ciudadanía interesada en cómo se usa la IA con fondos públicos.',
      ctaPregunta:
        '¿Conoce un proyecto de IA en una institución pública que no aparece aquí?',
      verMas: 'Conozca quién mantiene el observatorio y cómo se verifican los datos →',
    },
    footer: {
      titulo: 'Observatorio IA Costa Rica',
      tagline: 'Datos públicos. Iniciativa independiente.',
      ultimaActualizacion: 'Última actualización: agosto 2026',
      fuentes: 'Fuentes públicas: instituciones de Costa Rica, organismos multilaterales, academia y prensa.',
      quienMantiene: 'Quién mantiene el observatorio',
      historialMonitoreo: 'Historial y monitoreo editorial',
      apiPublica: 'API pública JSON para periodistas/investigadores',
      atribucion: 'Un proyecto de',
      explorarLabel: 'Explorar',
      transparenciaLabel: 'Transparencia',
      privacidadLabel: 'Privacidad y analítica',
      recursosLabel: 'Fuentes y recursos',
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
      titulo: 'Cuándo aparece evidencia de adopción, planes y capacidades',
      sub: 'La vista principal muestra únicamente sistemas o componentes de IA con ejecución verificada en piloto u operación. La vista completa incorpora anuncios, investigación, infraestructura y capacidades con una fecha documental explícita.',
      desdeLabel: 'desde',
      sinResultadoLabel: 'Sin métrica pública',
      vistaVerificada: 'Adopción verificada',
      vistaCompleta: 'Todo lo documentado',
      vistaVerificadaAyuda: '{adopcionVerificada} sistemas o componentes con piloto u operación comprobados',
      vistaCompletaAyuda: '{iniciativasDocumentadas} iniciativas, incluidos planes y capacidades del ecosistema',
      scrollHint: 'Deslice horizontalmente para recorrer los años.',
      fechaLabel: {
        'inicio-operacion': 'Inicio de operación',
        'inicio-piloto': 'Inicio de piloto',
        anuncio: 'Anuncio',
        'primera-evidencia': 'Primera evidencia',
      },
    },
    panorama: {
      kicker: 'Panorama',
      titulo: 'Distribución de iniciativas por institución',
      sub: 'Vista compacta de las {proyectos} iniciativas agrupadas por institución y coloreadas según el estado actual del catálogo. Haga clic en cualquiera para abrir el detalle.',
      proyectoLabel: 'iniciativa',
      leyendaLabel: 'Clasificación editorial',
    },
    catalogo: {
      kicker: 'Catálogo basado en evidencia',
      titulo: 'Tres capas para no confundir anuncios con adopción',
      sub: 'Cada iniciativa se clasifica según lo que permiten afirmar sus fuentes. Solo la primera capa entra en el contador de adopción verificada; las demás siguen siendo visibles porque documentan compromisos, infraestructura, investigación y capacidades relevantes.',
      metaDescripcion: 'Catálogo verificable de sistemas, pilotos, planes y capacidades relacionadas con inteligencia artificial en el sector público costarricense.',
      totalDocumentadas: '{iniciativasDocumentadas} iniciativas documentadas en total',
      capas: {
        verificado: {
          titulo: 'Adopción verificada',
          corto: 'Verificada',
          descripcion: 'Sistemas o componentes de IA con evidencia de ejecución en piloto u operación.',
          criterio: 'Cuenta como adopción solo si la técnica de IA y la ejecución están confirmadas por fuentes trazables.',
        },
        seguimiento: {
          titulo: 'Iniciativas en seguimiento',
          corto: 'Seguimiento',
          descripcion: 'Anuncios, pilotos o sistemas reportados cuya técnica, ejecución o situación actual todavía requiere confirmación.',
          criterio: 'Se conservan las preguntas abiertas y una próxima fecha de revisión cuando corresponde.',
        },
        ecosistema: {
          titulo: 'Ecosistema y capacidades',
          corto: 'Ecosistema',
          descripcion: 'Infraestructura digital, investigación, formación, gobernanza y digitalización relacionadas con IA.',
          criterio: 'Aportan contexto, pero no se suman como sistemas de IA adoptados por el Estado.',
        },
      },
      verTodas: 'Ver las {iniciativasDocumentadas} iniciativas',
      buscarLabel: 'Buscar en el catálogo',
      buscarPlaceholder: 'Nombre, institución o descripción',
      institucionFiltroLabel: 'Filtrar por institución',
      todasInstituciones: 'Todas las instituciones',
      resultadosLabel: 'fichas visibles',
      sinResultados: 'No hay fichas que coincidan con estos filtros.',
      limpiarFiltros: 'Limpiar filtros',
      fichaCta: 'Abrir ficha de evidencia',
      ultimaVerificacionLabel: 'Verificada',
      proximaRevisionLabel: 'Próxima revisión',
      metodologiaTitulo: 'Una clasificación reproducible',
      metodologiaCuerpo: 'El estado visible no se decide por el nombre del proyecto ni por una mención de IA. Se evalúan por separado existencia, ejecución, técnica de IA, uso operativo, resultados y gobernanza, y cada conclusión conserva sus fuentes.',
      metodologiaCta: 'Leer la metodología completa',
      tipos: {
        'sistema-ia': 'Sistema de IA',
        'componente-ia': 'Componente de IA',
        'infraestructura-digital': 'Infraestructura digital',
        'programa-capacidades': 'Programa de capacidades',
        investigacion: 'Investigación',
        'politica-gobernanza': 'Política o gobernanza',
        'digitalizacion-no-ia': 'Digitalización sin IA confirmada',
        'por-determinar': 'Tipo por determinar',
      },
      estados: {
        verificado: 'Adopción verificada',
        seguimiento: 'En seguimiento',
        ecosistema: 'Ecosistema y capacidades',
        descartado: 'Descartada',
      },
      fases: {
        anunciado: 'Anunciado',
        planificado: 'Planificado',
        desarrollo: 'En desarrollo',
        'prueba-concepto': 'Prueba de concepto',
        piloto: 'Piloto',
        operativo: 'Operativo',
        pausado: 'Pausado',
        suspendido: 'Suspendido',
        finalizado: 'Finalizado',
        cancelado: 'Cancelado',
        'no-determinado': 'No determinado',
      },
      estadosIA: {
        confirmada: 'IA confirmada',
        'declarada-sin-tecnica': 'IA declarada, técnica no publicada',
        'no-determinada': 'IA no determinada',
        descartada: 'IA descartada',
      },
      evaluacionEstados: {
        confirmado: 'Confirmado',
        'parcialmente-confirmado': 'Parcialmente confirmado',
        inferido: 'Inferido',
        'no-determinado': 'No determinado',
        contradicho: 'Contradicho',
      },
      dimensiones: {
        existencia: 'Existencia',
        ejecucion: 'Ejecución',
        tecnicaIA: 'Técnica de IA',
        usoOperativo: 'Uso operativo',
        resultados: 'Resultados',
        gobernanza: 'Gobernanza',
      },
      tiposFuente: {
        'primaria-oficial': 'Primaria oficial',
        'acceso-informacion': 'Acceso a información',
        multilateral: 'Organismo multilateral',
        academica: 'Académica',
        prensa: 'Prensa',
        'otra-secundaria': 'Otra fuente secundaria',
      },
      respaldosFuente: {
        existencia: 'existencia',
        'objetivo-declarado': 'objetivo declarado',
        meta: 'meta',
        ejecucion: 'ejecución',
        'tecnica-ia': 'técnica de IA',
        'uso-operativo': 'uso operativo',
        'resultado-reportado': 'resultado reportado',
        'resultado-independiente': 'resultado independiente',
        gobernanza: 'gobernanza',
        'inferencia-editorial': 'inferencia editorial',
      },
      relaciones: {
        'mismo-que': 'Misma iniciativa',
        'posible-duplicado': 'Posible duplicado',
        'componente-de': 'Componente de',
        'depende-de': 'Depende de',
        'alimenta-a': 'Alimenta a',
        'distinto-de': 'Distinta de',
        'relacion-no-acreditada': 'Relación no acreditada',
      },
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
    indicadorDgi: {
      titulo: 'Digital Government Index (DGI) 2025',
      sub: 'Madurez del gobierno digital según la OCDE. Costa Rica obtiene 0.45 vs un promedio OCDE de 0.70. Mejora sustancial respecto a 2023 (0.22) pero aún por debajo del promedio.',
      fuenteLabel: 'Fuentes:',
      scoreLabel: 'Puntaje',
      subdimsLabel: 'Subdimensiones Costa Rica',
      crProgresoLabel: 'Costa Rica 2023 → 2025',
    },
    indicadorOurdata: {
      titulo: 'OURdata Index (Open, Useful, Reusable data) 2025',
      sub: 'Apertura y reutilización de datos públicos. Costa Rica obtiene 0.14 vs un promedio OCDE de 0.53. Retroceso respecto a 2023 (0.19), principalmente por falta de apoyo gubernamental a la reutilización.',
      fuenteLabel: 'Fuentes:',
      scoreLabel: 'Puntaje',
      subdimsLabel: 'Subdimensiones Costa Rica',
      crProgresoLabel: 'Costa Rica 2023 → 2025',
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
        kpiHeroTitulo: '{adopcionVerificada} verificadas · {seguimiento} en seguimiento · {ecosistema} de ecosistema',
        timelineTitulo: 'Adopción de IA verificada, 2019-2025',
        iliaTitulo: 'Costa Rica vs América Latina (ILIA 2025)',
        mapaTitulo: '{iniciativasDocumentadas} iniciativas en tres capas de evidencia',
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
        storyBrecha: 'Story — 17 puntos abajo de Chile',
      },
      notaUso: 'Atribución sugerida: "Observatorio IA Costa Rica · observatorioia.org". Las imágenes se pueden usar libremente en publicaciones, presentaciones y redes sociales.',
    },
    proyectoDetalle: {
      expedienteLabel: 'Expediente de iniciativa',
      institucionLabel: 'Institución',
      categoriaLabel: 'Categoría',
      estadoLabel: 'Estado',
      desdeLabel: {
        operativo: 'Operativo desde',
        piloto: 'Piloto desde',
        planificado: 'Primera evidencia',
      },
      queEsLabel: 'Qué es',
      resultadoLabel: {
        operativo: 'Resultados verificados',
        piloto: 'Evidencia del piloto',
        planificado: 'Evidencia disponible',
      },
      contextoLabel: 'Contexto',
      fuenteLabel: 'Fuente consultada',
      relacionadosLabel: 'Proyectos relacionados',
      volverLabel: '← Volver a la institución',
      metaDescripcion: 'Proyecto de IA en el sector público de Costa Rica.',
      fichaEvidenciaLabel: 'Ficha de evidencia',
      tipoIniciativaLabel: 'Tipo de iniciativa',
      faseLabel: 'Fase documentada',
      estadoIALabel: 'Confirmación de IA',
      evidenciaEjecucionLabel: 'Evidencia de ejecución',
      primeraEvidenciaLabel: 'Primera evidencia',
      ultimaVerificacionLabel: 'Última verificación',
      proximaRevisionLabel: 'Próxima revisión',
      objetivoDeclaradoLabel: 'Objetivo declarado por la institución',
      alcanceTitulo: 'Alcance documentado',
      cronologiaTitulo: 'Cronología conocida',
      cronologiaSub: 'Solo se muestran hitos con una fecha explícita en las fuentes o en la revisión editorial.',
      cronologiaEventos: {
        ultimaVerificacion: 'Última verificación editorial',
        proximaRevision: 'Próxima revisión programada',
      },
      hallazgosTitulo: 'Lectura de la evidencia',
      confirmadoLabel: 'Qué está confirmado',
      noDeterminadoLabel: 'Qué no se pudo determinar',
      preguntasAbiertasLabel: 'Preguntas abiertas',
      resultadosDocumentadosLabel: 'Resultados documentados',
      resultadosSub: 'Los resultados se publican solo cuando una fuente los atribuye de manera trazable a esta iniciativa.',
      sinResultadosDocumentados: 'No se localizaron resultados públicos atribuibles a esta iniciativa en el corte actual.',
      evidenciaTitulo: 'Matriz de evidencia',
      evidenciaSub: 'Cada dimensión se evalúa por separado. Un estado no determinado se publica como tal y no se completa por inferencia.',
      fuentesTitulo: 'Fuentes y trazabilidad',
      fuentesSub: 'Las fuentes indican qué afirmaciones respaldan, su origen y la fecha en que fueron consultadas.',
      publicadorLabel: 'Publicador',
      tipoFuenteLabel: 'Tipo de fuente',
      fechaPublicacionLabel: 'Publicación',
      fechaConsultaLabel: 'Consulta',
      respaldaLabel: 'Respalda',
      relacionesTitulo: 'Relaciones documentadas',
      verIniciativaLabel: 'Ver iniciativa relacionada',
      sinDatosConfirmados: 'La evidencia confirmada se detalla en la matriz y en los resultados documentados; no hay notas adicionales en este campo.',
      sinNoDeterminados: 'No se registraron campos no determinados en el corte actual.',
      sinPreguntasAbiertas: 'No se registraron preguntas abiertas adicionales en el corte actual.',
    },
    institucionDetalle: {
      expedienteLabel: 'Expediente institucional',
      tipoLabel: 'Tipo',
      sitioOficialLabel: 'Sitio oficial',
      resumenLabel: 'Resumen ejecutivo',
      proyectosLabel: 'Proyectos de IA',
      leccionesLabel: 'Lectura de la evidencia',
      operativosLabel: 'operativos',
      pilotosLabel: 'pilotos',
      planificadosLabel: 'planificados',
      metaDescripcion: 'Institución pública de Costa Rica con proyectos de IA.',
      verificadosLabel: 'adopciones verificadas',
      seguimientoLabel: 'en seguimiento',
      ecosistemaLabel: 'de ecosistema',
      conteoNota: 'Los conteos se calculan desde las fichas actuales del catálogo y no desde una cifra declarada por la institución.',
      ultimaVerificacionLabel: 'Último corte de verificación',
      registroSub: 'Todas las iniciativas asociadas a esta institución, ordenadas por capa de evidencia y corte de verificación.',
      fuenteInstitucionalLabel: 'Fuente institucional',
    },
    analisis: {
      kicker: 'Análisis',
      titulo: 'Costa Rica perdió 17 puntos vs Chile en el ILIA 2025',
      sub: 'Comparativa regional, brechas de capacidad estructural y estado del marco regulatorio. Datos verificados de fuentes oficiales y reportes multilaterales.',
      articulosTitulo: 'Estado y Algoritmo',
      articulosSub: 'Serie quincenal de análisis sobre IA en el Estado costarricense. Cada número desempaca una pieza del inventario: lo que funciona, lo que está detenido, y las preguntas abiertas.',
      articulosLeerMas: 'Leer artículo',
      articulosVacio: 'Próximamente.',
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
      legislacionTitulo: '{total} expedientes, cero leyes aprobadas',
      legislacionSub:
        'El inventario reúne {principales} proyectos cuyo objeto principal es la IA y {relacionados} directamente relacionados, presentados entre 2023 y 2026. {dictaminados} ya cuentan con dictamen de comisión y {enComision} permanecen en comisión. Costa Rica sigue sin un marco regulatorio formal de IA.',
      metaDescripcion:
        'Análisis de la brecha de Costa Rica frente a líderes regionales y globales en adopción de IA en gobierno.',
      notaCierre:
        'Este análisis presenta evidencia y brechas. No incluye recomendaciones de política pública: esa conversación corresponde a los actores institucionales del país.',
    },
    quienMantiene: {
      kicker: 'Quién mantiene el observatorio',
      titulo: 'Iniciativa independiente, datos verificables, fuentes públicas',
      autoria: {
        titulo: 'Autoría',
        cuerpo:
          'El Observatorio IA Costa Rica es mantenido por Mario Pérez Edwards (UnikPrompt), independiente de cualquier institución pública o empresa privada. La marca del sitio es neutra; la firma editorial es transparente.',
      },
      metodologia: {
        titulo: 'Metodología',
        cuerpo: 'El catálogo conserva iniciativas verificables aunque no todas representen adopción de IA. Cada ficha se revisa con los siguientes criterios:',
        bullets: [
          'La existencia, la ejecución, la técnica de IA, el uso operativo, los resultados y la gobernanza se evalúan como dimensiones separadas.',
          'Solo un sistema o componente de IA con técnica confirmada y ejecución confirmada en piloto u operación cuenta como adopción verificada.',
          'Un anuncio oficial demuestra que una iniciativa fue anunciada, no que comenzó a ejecutarse. Permanece en seguimiento hasta localizar evidencia posterior.',
          'Infraestructura, investigación, formación, gobernanza y digitalización se preservan como ecosistema y capacidades, sin sumarlas al contador de adopción.',
          'Cada afirmación enlaza fuentes trazables e indica qué respalda cada una. La prensa puede orientar la búsqueda, pero no sustituye una fuente primaria cuando se afirma ejecución.',
          'Los campos sin evidencia suficiente se publican como no determinados y las fichas con vacíos relevantes conservan preguntas abiertas o una fecha de próxima revisión.',
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
    changelog: {
      kicker: 'Actualizaciones',
      titulo: 'Historial de actualizaciones del catálogo',
      intro:
        'Este observatorio se actualiza conforme se identifican nuevas fuentes públicas, proyectos institucionales, expedientes legislativos e indicadores sobre inteligencia artificial en Costa Rica.',
      verHistorialCompleto: 'Ver historial y monitoreo',
      tableCols: {
        fecha: 'Fecha',
        tipo: 'Tipo',
        actualizacion: 'Actualización',
        fuente: 'Fuente',
      },
      tipos: {
        legislacion: 'Legislación',
        institucion: 'Institución',
        indicador: 'Indicador',
        proyecto: 'Proyecto',
        recurso: 'Recurso',
      },
      historialPagina: {
        titulo: 'Historial y monitoreo editorial',
        sub: 'Agenda de revisiones y registro cronológico de cambios, transiciones de estado y comprobaciones que terminaron sin cambios.',
        metaDescripcion:
          'Historial y monitoreo del Observatorio IA Costa Rica: próximas revisiones, cambios de estado, comprobaciones sin cambios y fuentes públicas.',
        volverHome: 'Volver a la página principal',
      },
    },
    marcoPais: {
      kicker: 'Marco país',
      titulo: 'Marco país de IA en Costa Rica',
      sub: 'Arquitectura de política pública, regulación, lineamientos técnicos y adopción institucional de IA en el Estado costarricense.',
      tesis: 'Costa Rica ya tiene principios, estrategia, lineamientos técnicos y adopción institucional. La brecha pendiente está en convertir ese marco en procedimientos comunes, verificables y aplicables por las instituciones públicas.',
      ultimaActualizacion: 'Última actualización: agosto 2026',
      metaTitle: 'Marco país de inteligencia artificial en Costa Rica',
      metaDescripcion:
        'Arquitectura de política pública, regulación, lineamientos técnicos y adopción institucional de IA en Costa Rica: principios OCDE, ENIA, CNTD, expedientes legislativos, implementación institucional y brechas pendientes.',
      indicadores: {
        titulo: 'Indicadores rápidos',
        sub: 'Lo que ya existe del marco país, en cifras verificables.',
        cards: {
          estrategia: {
            numero: '1',
            titulo: 'Estrategia nacional',
            detalle: 'ENIA 2024-2027',
          },
          planAccion: {
            numero: '1',
            titulo: 'Plan de Acción',
            detalle: 'Implementación interinstitucional',
          },
          capituloCntd: {
            numero: '1',
            titulo: 'Capítulo IA en el CNTD',
            detalle: 'Lineamientos técnicos obligatorios',
          },
          expedientes: {
            numero: '{legislacion}',
            titulo: 'Expedientes de ley',
            detalle: 'Ninguno aprobado todavía',
          },
          instituciones: {
            numero: '{instituciones}',
            titulo: 'Instituciones con iniciativas documentadas',
            detalle: 'Catálogo institucional en tres capas de evidencia',
          },
          proyectos: {
            numero: '{proyectos}',
            titulo: 'Iniciativas mapeadas',
            detalle: '{adopcionVerificada} verificadas, {seguimiento} en seguimiento y {ecosistema} de ecosistema',
          },
        },
      },
      arquitectura: {
        kicker: 'Arquitectura por capas',
        titulo: 'Arquitectura del marco país',
        sub: 'El marco de IA en Costa Rica no depende de un solo documento. Está compuesto por capas con distinta función, alcance y fuerza institucional. Algunas orientan, otras obligan, otras están en trámite y otras muestran adopción real.',
        tagline:
          'Costa Rica ya tiene marco. El siguiente paso es convertirlo en capacidad operativa compartida.',
        capaLabel: 'Capa',
        campos: {
          instrumentos: 'Instrumentos',
          funcion: 'Función',
          alcance: 'Alcance',
          fuerza: 'Fuerza',
          vacio: 'Vacío que deja',
        },
      },
      timeline: {
        kicker: 'Hitos país',
        titulo: 'Hitos de gobernanza IA en Costa Rica',
        sub: 'A diferencia de la línea de tiempo de proyectos institucionales, esta vista muestra la evolución del marco país: documentos, lineamientos, regulación, participación internacional y decisiones estratégicas.',
        pendienteLabel: 'Pendiente',
      },
      matriz: {
        kicker: 'Matriz comparativa',
        titulo: 'Qué resuelve cada instrumento',
        sub: 'No todos los instrumentos cumplen la misma función. Algunos definen principios, otros establecen dirección estratégica, otros fijan lineamientos técnicos, y otros buscan crear obligaciones legales. Esta matriz permite ver qué existe, a quién aplica y qué vacío deja.',
        cols: {
          instrumento: 'Instrumento',
          tipo: 'Tipo',
          alcance: 'Alcance',
          fuerza: 'Fuerza',
          queResuelve: 'Qué resuelve',
          queNoResuelve: 'Qué no resuelve',
          estado: 'Estado',
          publicado: 'Publicado',
        },
      },
      brechas: {
        kicker: 'Brechas pendientes',
        titulo: 'Brechas de gobernanza operativa',
        sub: 'Costa Rica ya cuenta con una base de política pública y lineamientos técnicos. El siguiente desafío es pasar de documentos marco a capacidad institucional instalada.',
      },
      conexion: {
        kicker: 'Conexión con el resto del Observatorio',
        titulo: 'De la política a la implementación documentada',
        sub: 'El marco país muestra reglas, estrategias y lineamientos. El inventario institucional reúne sistemas, pilotos, planes y capacidades con distintos niveles de evidencia. Ambas vistas son complementarias: una explica la arquitectura de gobernanza y la otra permite seguir su implementación.',
        ctaProyectos: 'Ver iniciativas institucionales',
        ctaInstituciones: 'Ver instituciones',
        ctaLegislacion: 'Ver legislación',
        ctaIndicadores: 'Ver indicadores',
        ctaRecursos: 'Ver recursos',
        ctaEnia: 'Explorar el Plan ENIA',
      },
      fuentes: {
        kicker: 'Fuentes y metodología',
        titulo: 'Fuentes y criterios de inclusión',
        sub: 'Esta página incluye documentos nacionales, instrumentos internacionales, lineamientos técnicos, expedientes legislativos e iniciativas institucionales documentadas. Los anuncios o pilotos sin evidencia de ejecución deben mostrarse como tales y no como adopción verificada.',
        fuentesLabel: 'Fuentes',
        criteriosLabel: 'Criterios de inclusión',
        tipos: [
          'Documentos oficiales de MICITT',
          'Decreto Ejecutivo 44507-MICITT y CNTD',
          'Asamblea Legislativa',
          'OCDE',
          'ILIA',
          'Instituciones públicas',
          'Mapeo propio del Observatorio IA Costa Rica',
        ],
        criterios: [
          'Documento público verificable como evidencia primaria.',
          'Inclusión proporcional al alcance del instrumento (país, sector público, institución).',
          'Distinción explícita entre fuerza referencial, orientadora y obligatoria.',
          'Distinción explícita entre sistemas operativos, pilotos, planes y capacidades; una mención oficial no equivale a ejecución.',
        ],
      },
      fuerzaTipos: {
        referencial: 'Referencial',
        orientadora: 'Orientadora',
        obligatoria: 'Obligatoria',
        'no-vigente': 'No vigente',
        operativa: 'Operativa',
        pendiente: 'Pendiente',
      },
    },
  },
  en: {
    siteName: 'AI Observatory',
    siteCountry: 'Costa Rica',
    nav: {
      inicio: 'Home',
      proyectos: 'Catalog',
      instituciones: 'Institutions',
      legislacion: 'Legislation',
      indicadores: 'Indicators',
      analisis: 'Analysis',
      actualizaciones: 'Updates',
      recursos: 'Resources',
      acerca: 'About',
      marcoPais: 'Country Framework',
      enia: 'ENIA Plan',
      navegacionPrincipal: 'Primary navigation',
      abrirMenu: 'Open menu',
      cerrarMenu: 'Close menu',
    },
    hero: {
      kicker: 'Public observatory',
      headline:
        '{adopcionVerificada} AI systems or components with verified pilot or operational execution across Costa Rica\u2019s public sector.',
      sub: 'The catalog documents {iniciativasDocumentadas} initiatives and separates verified adoption from announcements under review and ecosystem capabilities.',
      capasIntro: 'What the evidence shows',
      contextoIntro: 'Observatory context',
      ctaCatalogo: 'Explore the catalog',
      ctaMetodologia: 'How we verify',
      kpiCategoria: {
        proyectos: 'Initiatives',
        instituciones: 'Institutions',
        legislacion: 'Legislation',
        ranking: 'ILIA ranking',
      },
    },
    home: {
      seleccion: {
        kicker: 'Featured evidence',
        titulo: 'Start with three verified records',
        sub: 'A short entry point into the full catalog, selected through a public and reproducible rule.',
        regla: 'Selection rule: most recently verified; ties are ordered by documentary date and identifier.',
      },
      contexto: {
        kicker: 'Country reading',
        titulo: 'From the country framework to legislative activity',
        marcoLabel: 'Public architecture',
        legislacionLabel: 'Legislative activity',
        ultimaActividadLabel: 'Latest recorded change',
      },
      cambios: {
        kicker: 'Public log',
        titulo: 'What changed in the Observatory',
        sub: 'The three latest entries in the editorial record, with date and provenance.',
      },
      rutas: {
        kicker: 'Observatory index',
        titulo: 'Choose the level of evidence you need',
        sub: 'Every complete collection has its own route; the home page provides the opening read.',
        metodologiaLabel: 'Methodology',
        descripciones: {
          proyectos: '{iniciativasDocumentadas} initiatives classified by evidence, phase and institution.',
          instituciones: '{instituciones} institutional portfolios with counts derived from the catalog.',
          enia: 'The Plan’s official matrix, its unique interventions and its crosswalk to public evidence.',
          legislacion: '{legislacion} bills with status, committee, official source and verification date.',
          indicadores: 'ILIA, DGI and OURdata series placing Costa Rica in regional context.',
          metodologia: 'Inclusion criteria, traceability, authorship and channels for correcting data.',
        },
      },
    },
    instituciones: {
      kicker: '01 / Institutions',
      titulo: 'Where AI initiatives appear across the State',
      sub: '{instituciones} public institutions have documented AI-related initiatives. The catalog includes systems, pilots, plans and capabilities.',
      proyectosLabel: 'initiatives',
      conteoDerivadoLabel: 'classified in the catalog',
      verDetalle: 'View details',
      registroLabel: 'Institutional register',
      actividadLabel: 'Featured initiatives',
      ultimaVerificacionLabel: 'Latest review',
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
      titulo: '{total} AI-related bills, none passed',
      sub: 'The inventory distinguishes {principales} bills whose primary subject is AI and {relacionados} directly related bills. {dictaminados} have committee reports and {enComision} remain in committee.',
      expedienteLabel: 'File',
      comisionLabel: 'Committee',
      presentadoLabel: 'Filed',
      alcances: {
        principal: 'Core AI regulation',
        relacionado: 'Directly related',
      },
      estados: {
        'en-comision': 'In committee',
        dictaminado: 'Committee report issued',
        'primer-debate': 'First debate',
        'segundo-debate': 'Second debate',
        archivado: 'Archived',
        aprobada: 'Passed',
      },
      verFuente: 'View bill',
      verEstadoOficial: 'View official status evidence',
      verificadoLabel: 'Verified',
      coyunturaKicker: 'Editorial reading',
      coyunturaTitulo: 'Context surrounding the bills',
      coyunturaSub:
        'These notes record public events and context. They do not replace the status published by the Legislative Assembly.',
      registroTitulo: 'Official bill register',
      registroSub:
        'Number, committee, scope, status and verification are transcribed separately from editorial context.',
      estadoOficialLabel: 'Official legislative status',
      alcanceLabel: 'Scope in relation to AI',
      fuentesOficialesLabel: 'Official sources',
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
      metaDescripcion: 'Bilingual directory of documents, regulations, strategies, indicators and public sources used by AI Observatory Costa Rica.',
    },
    acerca: {
      kicker: '05 / About',
      titulo: 'An independent initiative that separates evidence, announcements and capabilities',
      p1: 'AI Observatory Costa Rica fills a gap: there is no public, up-to-date source applying verifiable criteria to distinguish where artificial intelligence is being adopted from where only plans, mentions or related capabilities exist.',
      p2: 'This site organizes initiatives into three layers: verified adoption, under review, and ecosystem and capabilities. It also documents pending bills and indicators benchmarked against the region. Every record links its sources and publishes information gaps.',
      p3: 'The goal is to build a useful tool for decision makers, journalists, academia, the private sector and citizens interested in how AI is being used with public funds.',
      ctaPregunta:
        'Do you know of an AI project in a public institution that is not listed here?',
      verMas: 'Learn who maintains the observatory and how data is verified →',
    },
    footer: {
      titulo: 'AI Observatory Costa Rica',
      tagline: 'Public data. Independent initiative.',
      ultimaActualizacion: 'Last updated: August 2026',
      fuentes: 'Public sources: Costa Rican institutions, multilateral organizations, academia and the press.',
      quienMantiene: 'Who maintains the observatory',
      historialMonitoreo: 'Editorial history and monitoring',
      apiPublica: 'Public JSON API for journalists/researchers',
      atribucion: 'A project by',
      explorarLabel: 'Explore',
      transparenciaLabel: 'Transparency',
      privacidadLabel: 'Privacy and analytics',
      recursosLabel: 'Sources and resources',
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
      titulo: 'When evidence of adoption, plans and capabilities appears',
      sub: 'The primary view shows only AI systems or components with verified pilot or operational execution. The complete view adds announcements, research, infrastructure and capabilities with an explicit documentary date.',
      desdeLabel: 'since',
      sinResultadoLabel: 'No public metric',
      vistaVerificada: 'Verified adoption',
      vistaCompleta: 'All documented',
      vistaVerificadaAyuda: '{adopcionVerificada} systems or components with verified pilot or operational execution',
      vistaCompletaAyuda: '{iniciativasDocumentadas} initiatives, including plans and ecosystem capabilities',
      scrollHint: 'Swipe horizontally to move across the years.',
      fechaLabel: {
        'inicio-operacion': 'Operational start',
        'inicio-piloto': 'Pilot start',
        anuncio: 'Announcement',
        'primera-evidencia': 'First evidence',
      },
    },
    panorama: {
      kicker: 'Overview',
      titulo: 'Initiative distribution by institution',
      sub: 'Compact view of all {proyectos} initiatives grouped by institution and colored by their current catalog status. Click any to open the detail page.',
      proyectoLabel: 'initiative',
      leyendaLabel: 'Editorial classification',
    },
    catalogo: {
      kicker: 'Evidence-based catalog',
      titulo: 'Three layers to keep announcements separate from adoption',
      sub: 'Each initiative is classified according to what its sources support. Only the first layer enters the verified-adoption count; the others remain visible because they document relevant commitments, infrastructure, research and capabilities.',
      metaDescripcion: 'Verifiable catalog of AI-related systems, pilots, plans and capabilities across Costa Rica\u2019s public sector.',
      totalDocumentadas: '{iniciativasDocumentadas} documented initiatives in total',
      capas: {
        verificado: {
          titulo: 'Verified adoption',
          corto: 'Verified',
          descripcion: 'AI systems or components with evidence of pilot or operational execution.',
          criterio: 'Counts as adoption only when both the AI technique and execution are confirmed by traceable sources.',
        },
        seguimiento: {
          titulo: 'Initiatives under review',
          corto: 'Under review',
          descripcion: 'Announcements, pilots or reported systems whose technique, execution or current status still needs confirmation.',
          criterio: 'Open questions and a next review date are retained when applicable.',
        },
        ecosistema: {
          titulo: 'Ecosystem and capabilities',
          corto: 'Ecosystem',
          descripcion: 'Digital infrastructure, research, training, governance and digitization related to AI.',
          criterio: 'These provide context but are not added to the count of AI systems adopted by the State.',
        },
      },
      verTodas: 'View all {iniciativasDocumentadas} initiatives',
      buscarLabel: 'Search the catalog',
      buscarPlaceholder: 'Name, institution or description',
      institucionFiltroLabel: 'Filter by institution',
      todasInstituciones: 'All institutions',
      resultadosLabel: 'visible records',
      sinResultados: 'No records match these filters.',
      limpiarFiltros: 'Clear filters',
      fichaCta: 'Open evidence record',
      ultimaVerificacionLabel: 'Verified',
      proximaRevisionLabel: 'Next review',
      metodologiaTitulo: 'A reproducible classification',
      metodologiaCuerpo: 'The visible status is not determined by a project name or an AI mention. Existence, execution, AI technique, operational use, results and governance are assessed separately, and every conclusion retains its sources.',
      metodologiaCta: 'Read the full methodology',
      tipos: {
        'sistema-ia': 'AI system',
        'componente-ia': 'AI component',
        'infraestructura-digital': 'Digital infrastructure',
        'programa-capacidades': 'Capacity-building program',
        investigacion: 'Research',
        'politica-gobernanza': 'Policy or governance',
        'digitalizacion-no-ia': 'Digitization without confirmed AI',
        'por-determinar': 'Type undetermined',
      },
      estados: {
        verificado: 'Verified adoption',
        seguimiento: 'Under review',
        ecosistema: 'Ecosystem and capabilities',
        descartado: 'Excluded',
      },
      fases: {
        anunciado: 'Announced',
        planificado: 'Planned',
        desarrollo: 'In development',
        'prueba-concepto': 'Proof of concept',
        piloto: 'Pilot',
        operativo: 'Operational',
        pausado: 'Paused',
        suspendido: 'Suspended',
        finalizado: 'Completed',
        cancelado: 'Canceled',
        'no-determinado': 'Undetermined',
      },
      estadosIA: {
        confirmada: 'AI confirmed',
        'declarada-sin-tecnica': 'AI declared, technique not published',
        'no-determinada': 'AI undetermined',
        descartada: 'AI excluded',
      },
      evaluacionEstados: {
        confirmado: 'Confirmed',
        'parcialmente-confirmado': 'Partially confirmed',
        inferido: 'Inferred',
        'no-determinado': 'Undetermined',
        contradicho: 'Contradicted',
      },
      dimensiones: {
        existencia: 'Existence',
        ejecucion: 'Execution',
        tecnicaIA: 'AI technique',
        usoOperativo: 'Operational use',
        resultados: 'Results',
        gobernanza: 'Governance',
      },
      tiposFuente: {
        'primaria-oficial': 'Official primary source',
        'acceso-informacion': 'Access-to-information response',
        multilateral: 'Multilateral organization',
        academica: 'Academic',
        prensa: 'News media',
        'otra-secundaria': 'Other secondary source',
      },
      respaldosFuente: {
        existencia: 'existence',
        'objetivo-declarado': 'stated objective',
        meta: 'target',
        ejecucion: 'execution',
        'tecnica-ia': 'AI technique',
        'uso-operativo': 'operational use',
        'resultado-reportado': 'reported result',
        'resultado-independiente': 'independent result',
        gobernanza: 'governance',
        'inferencia-editorial': 'editorial inference',
      },
      relaciones: {
        'mismo-que': 'Same initiative',
        'posible-duplicado': 'Possible duplicate',
        'componente-de': 'Component of',
        'depende-de': 'Depends on',
        'alimenta-a': 'Feeds into',
        'distinto-de': 'Distinct from',
        'relacion-no-acreditada': 'Unverified relationship',
      },
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
    indicadorDgi: {
      titulo: 'Digital Government Index (DGI) 2025',
      sub: 'OECD measure of digital government maturity. Costa Rica scores 0.45 vs OECD average of 0.70. Substantial improvement over 2023 (0.22) but still below the average.',
      fuenteLabel: 'Sources:',
      scoreLabel: 'Score',
      subdimsLabel: 'Costa Rica subdimensions',
      crProgresoLabel: 'Costa Rica 2023 → 2025',
    },
    indicadorOurdata: {
      titulo: 'OURdata Index (Open, Useful, Reusable data) 2025',
      sub: 'Openness and reuse of public data. Costa Rica scores 0.14 vs OECD average of 0.53. Regression from 2023 (0.19), driven mainly by lack of government support for data reuse.',
      fuenteLabel: 'Sources:',
      scoreLabel: 'Score',
      subdimsLabel: 'Costa Rica subdimensions',
      crProgresoLabel: 'Costa Rica 2023 → 2025',
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
        kpiHeroTitulo: '{adopcionVerificada} verified · {seguimiento} under review · {ecosistema} ecosystem',
        timelineTitulo: 'Verified AI adoption, 2019-2025',
        iliaTitulo: 'Costa Rica vs Latin America (ILIA 2025)',
        mapaTitulo: '{iniciativasDocumentadas} initiatives across three evidence layers',
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
        storyBrecha: 'Story — 17 points behind Chile',
      },
      notaUso: 'Suggested attribution: "AI Observatory Costa Rica · observatorioia.org". Images may be freely used in publications, presentations and social media.',
    },
    proyectoDetalle: {
      expedienteLabel: 'Initiative file',
      institucionLabel: 'Institution',
      categoriaLabel: 'Category',
      estadoLabel: 'Status',
      desdeLabel: {
        operativo: 'Live since',
        piloto: 'Pilot since',
        planificado: 'First documented',
      },
      queEsLabel: 'What it is',
      resultadoLabel: {
        operativo: 'Verified results',
        piloto: 'Pilot evidence',
        planificado: 'Available evidence',
      },
      contextoLabel: 'Context',
      fuenteLabel: 'Source consulted',
      relacionadosLabel: 'Related projects',
      volverLabel: '← Back to institution',
      metaDescripcion: 'AI project inside Costa Rica\u2019s public sector.',
      fichaEvidenciaLabel: 'Evidence record',
      tipoIniciativaLabel: 'Initiative type',
      faseLabel: 'Documented phase',
      estadoIALabel: 'AI confirmation',
      evidenciaEjecucionLabel: 'Execution evidence',
      primeraEvidenciaLabel: 'First evidence',
      ultimaVerificacionLabel: 'Last verified',
      proximaRevisionLabel: 'Next review',
      objetivoDeclaradoLabel: 'Objective stated by the institution',
      alcanceTitulo: 'Documented scope',
      cronologiaTitulo: 'Known timeline',
      cronologiaSub: 'Only milestones with an explicit date in the sources or editorial review are shown.',
      cronologiaEventos: {
        ultimaVerificacion: 'Latest editorial verification',
        proximaRevision: 'Next scheduled review',
      },
      hallazgosTitulo: 'Evidence reading',
      confirmadoLabel: 'What is confirmed',
      noDeterminadoLabel: 'What could not be determined',
      preguntasAbiertasLabel: 'Open questions',
      resultadosDocumentadosLabel: 'Documented results',
      resultadosSub: 'Results are published only when a source traceably attributes them to this initiative.',
      sinResultadosDocumentados: 'No public results attributable to this initiative were found in the current review.',
      evidenciaTitulo: 'Evidence matrix',
      evidenciaSub: 'Each dimension is assessed separately. An undetermined state is published as such and is not filled in by inference.',
      fuentesTitulo: 'Sources and traceability',
      fuentesSub: 'Sources state which claims they support, their origin and the date on which they were consulted.',
      publicadorLabel: 'Publisher',
      tipoFuenteLabel: 'Source type',
      fechaPublicacionLabel: 'Published',
      fechaConsultaLabel: 'Consulted',
      respaldaLabel: 'Supports',
      relacionesTitulo: 'Documented relationships',
      verIniciativaLabel: 'View related initiative',
      sinDatosConfirmados: 'Confirmed evidence is detailed in the matrix and documented results; there are no additional notes in this field.',
      sinNoDeterminados: 'No undetermined fields were recorded in the current review.',
      sinPreguntasAbiertas: 'No additional open questions were recorded in the current review.',
    },
    institucionDetalle: {
      expedienteLabel: 'Institutional file',
      tipoLabel: 'Type',
      sitioOficialLabel: 'Official website',
      resumenLabel: 'Executive summary',
      proyectosLabel: 'AI projects',
      leccionesLabel: 'Evidence reading',
      operativosLabel: 'live',
      pilotosLabel: 'pilots',
      planificadosLabel: 'planned',
      metaDescripcion: 'Costa Rican public institution with AI projects.',
      verificadosLabel: 'verified adoptions',
      seguimientoLabel: 'under review',
      ecosistemaLabel: 'ecosystem records',
      conteoNota: 'Counts are derived from the current catalog records, not from a figure declared by the institution.',
      ultimaVerificacionLabel: 'Latest verification cut',
      registroSub: 'All initiatives associated with this institution, ordered by evidence layer and verification cut.',
      fuenteInstitucionalLabel: 'Institutional source',
    },
    analisis: {
      kicker: 'Analysis',
      titulo: 'Costa Rica fell 17 points behind Chile in ILIA 2025',
      sub: 'Regional benchmarking, structural capability gaps and state of the regulatory framework. Verified data from official sources and multilateral reports.',
      articulosTitulo: 'State & Algorithm',
      articulosSub: 'Biweekly series of analyses on AI in the Costa Rican state. Each issue unpacks a piece of the inventory: what works, what is stalled, and the open questions.',
      articulosLeerMas: 'Read article',
      articulosVacio: 'Coming soon.',
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
      legislacionTitulo: '{total} bills, zero laws passed',
      legislacionSub:
        'The inventory covers {principales} bills whose primary subject is AI and {relacionados} directly related bills, filed between 2023 and 2026. {dictaminados} have committee reports and {enComision} remain in committee. Costa Rica still has no formal AI regulatory framework.',
      metaDescripcion:
        'Analysis of Costa Rica\u2019s gap versus regional and global leaders in AI adoption inside government.',
      notaCierre:
        'This analysis presents evidence and gaps. It does not include public-policy recommendations: that conversation belongs to the country\u2019s institutional actors.',
    },
    quienMantiene: {
      kicker: 'Who maintains the observatory',
      titulo: 'Independent initiative, verifiable data, public sources',
      autoria: {
        titulo: 'Authorship',
        cuerpo:
          'AI Observatory Costa Rica is maintained by Mario Pérez Edwards (UnikPrompt), independent of any public institution or private company. The site brand is neutral; the editorial signature is transparent.',
      },
      metodologia: {
        titulo: 'Methodology',
        cuerpo: 'The catalog retains verifiable initiatives even when they do not all represent AI adoption. Every record is reviewed under these criteria:',
        bullets: [
          'Existence, execution, AI technique, operational use, results and governance are assessed as separate dimensions.',
          'Only an AI system or component with a confirmed technique and confirmed pilot or operational execution counts as verified adoption.',
          'An official announcement proves that an initiative was announced, not that execution began. It remains under review until later evidence is found.',
          'Infrastructure, research, training, governance and digitization are retained as ecosystem and capabilities without adding them to the adoption count.',
          'Every claim links to traceable sources and states what each source supports. News reporting may guide research but does not replace a primary source when execution is asserted.',
          'Fields without sufficient evidence are published as undetermined, and records with material gaps retain open questions or a next review date.',
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
    changelog: {
      kicker: 'Updates',
      titulo: 'Catalog update history',
      intro:
        'This observatory is updated as new public sources, institutional projects, legislative bills and indicators on artificial intelligence in Costa Rica are identified.',
      verHistorialCompleto: 'View history and monitoring',
      tableCols: {
        fecha: 'Date',
        tipo: 'Type',
        actualizacion: 'Update',
        fuente: 'Source',
      },
      tipos: {
        legislacion: 'Legislation',
        institucion: 'Institution',
        indicador: 'Indicator',
        proyecto: 'Project',
        recurso: 'Resource',
      },
      historialPagina: {
        titulo: 'Editorial history and monitoring',
        sub: 'Review schedule and chronological record of changes, status transitions and checks that concluded with no changes.',
        metaDescripcion:
          'History and monitoring for AI Observatory Costa Rica: upcoming reviews, status changes, checks with no changes and public sources.',
        volverHome: 'Back to home',
      },
    },
    marcoPais: {
      kicker: 'Country framework',
      titulo: 'Costa Rica AI country framework',
      sub: 'Architecture of public policy, regulation, technical guidelines and institutional adoption of AI within the Costa Rican State.',
      tesis: 'Costa Rica already has principles, strategy, technical guidelines and institutional adoption. The pending gap is turning that framework into shared, verifiable and actionable procedures for public institutions.',
      ultimaActualizacion: 'Last update: August 2026',
      metaTitle: 'Costa Rica artificial intelligence country framework',
      metaDescripcion:
        'Architecture of public policy, regulation, technical guidelines and institutional AI adoption in Costa Rica: OECD principles, ENIA, CNTD, legislative files, institutional implementation and pending gaps.',
      indicadores: {
        titulo: 'Quick indicators',
        sub: 'What the country framework already shows, in verifiable numbers.',
        cards: {
          estrategia: {
            numero: '1',
            titulo: 'National strategy',
            detalle: 'ENIA 2024-2027',
          },
          planAccion: {
            numero: '1',
            titulo: 'Action Plan',
            detalle: 'Inter-institutional implementation',
          },
          capituloCntd: {
            numero: '1',
            titulo: 'AI chapter in the CNTD',
            detalle: 'Mandatory technical guidelines',
          },
          expedientes: {
            numero: '{legislacion}',
            titulo: 'Legislative files',
            detalle: 'None approved yet',
          },
          instituciones: {
            numero: '{instituciones}',
            titulo: 'Institutions with documented initiatives',
            detalle: 'Institutional catalog across three evidence layers',
          },
          proyectos: {
            numero: '{proyectos}',
            titulo: 'Initiatives mapped',
            detalle: '{adopcionVerificada} verified, {seguimiento} under review and {ecosistema} ecosystem records',
          },
        },
      },
      arquitectura: {
        kicker: 'Layered architecture',
        titulo: 'Country framework architecture',
        sub: 'The AI framework in Costa Rica does not rely on a single document. It is built from layers with different function, scope and institutional force. Some guide, some bind, some are in process and others show real adoption.',
        tagline:
          'Costa Rica already has a framework. The next step is turning it into shared operational capacity.',
        capaLabel: 'Layer',
        campos: {
          instrumentos: 'Instruments',
          funcion: 'Function',
          alcance: 'Scope',
          fuerza: 'Force',
          vacio: 'Gap it leaves',
        },
      },
      timeline: {
        kicker: 'Country milestones',
        titulo: 'AI governance milestones in Costa Rica',
        sub: 'Unlike the institutional adoption timeline, this view shows the evolution of the country framework: documents, guidelines, regulation, international engagement and strategic decisions.',
        pendienteLabel: 'Pending',
      },
      matriz: {
        kicker: 'Comparative matrix',
        titulo: 'What each instrument solves',
        sub: 'Not all instruments play the same role. Some define principles, others set strategic direction, others fix technical guidelines, and others seek to create legal obligations. This matrix shows what exists, who it applies to and what gap it leaves.',
        cols: {
          instrumento: 'Instrument',
          tipo: 'Type',
          alcance: 'Scope',
          fuerza: 'Force',
          queResuelve: 'What it solves',
          queNoResuelve: 'What it does not solve',
          estado: 'Status',
          publicado: 'Published',
        },
      },
      brechas: {
        kicker: 'Pending gaps',
        titulo: 'Operational governance gaps',
        sub: 'Costa Rica already has a base of public policy and technical guidelines. The next challenge is moving from framework documents to installed institutional capacity.',
      },
      conexion: {
        kicker: 'Connection with the rest of the Observatory',
        titulo: 'From policy to documented implementation',
        sub: 'The country framework shows rules, strategies and guidelines. The institutional inventory brings together systems, pilots, plans and capabilities with different levels of evidence. One explains the governance architecture; the other supports implementation tracking.',
        ctaProyectos: 'See institutional initiatives',
        ctaInstituciones: 'See institutions',
        ctaLegislacion: 'See legislation',
        ctaIndicadores: 'See indicators',
        ctaRecursos: 'See resources',
        ctaEnia: 'Explore the ENIA Plan',
      },
      fuentes: {
        kicker: 'Sources and methodology',
        titulo: 'Sources and inclusion criteria',
        sub: 'This page includes national documents, international instruments, technical guidelines, legislative files and documented institutional initiatives. Announcements or pilots without evidence of execution should be shown as such, not as verified adoption.',
        fuentesLabel: 'Sources',
        criteriosLabel: 'Inclusion criteria',
        tipos: [
          'Official MICITT documents',
          'Executive Decree 44507-MICITT and CNTD',
          'Legislative Assembly',
          'OECD',
          'ILIA',
          'Public institutions',
          'AI Observatory Costa Rica own mapping',
        ],
        criterios: [
          'Verifiable public document as primary evidence.',
          'Inclusion proportional to instrument scope (country, public sector, institution).',
          'Explicit distinction between referential, guiding and mandatory force.',
          'Explicit distinction among operational systems, pilots, plans and capabilities; an official mention does not equal execution.',
        ],
      },
      fuerzaTipos: {
        referencial: 'Referential',
        orientadora: 'Guiding',
        obligatoria: 'Mandatory',
        'no-vigente': 'Not in force',
        operativa: 'Operational',
        pendiente: 'Pending',
      },
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
