import { readFileSync, writeFileSync } from 'node:fs';
import type { Institucion } from '../src/data/instituciones';
import type { Proyecto } from '../src/data/proyectos';

const PROYECTOS_URL = new URL('../src/data/json/proyectos.json', import.meta.url);
const INSTITUCIONES_URL = new URL(
  '../src/data/json/instituciones.json',
  import.meta.url,
);

const FECHA_REVISION = '2026-08-21';
const PROXIMA_REVISION = '2026-09-21';
const PLAN_ENIA_URL =
  'https://www.micitt.go.cr/sites/default/files/2025-10/Plan%20de%20Acci%C3%B3n%20ENIA%20-%20Versi%C3%B3n%2011%20agosto%202025%20Versi%C3%B3n%20Publicaci%C3%B3n.pdf';

const proyectosFase4C: Proyecto[] = [
  {
    id: 'inamu-ela',
    titulo: {
      es: 'Ela, aplicación de orientación para mujeres',
      en: 'Ela, guidance application for women',
    },
    institucionId: 'inamu',
    categoria: 'social',
    estado: 'operativo',
    desde: '2025',
    descripcion: {
      es: 'Aplicación móvil del INAMU que ofrece información, orientación y atención inicial durante las 24 horas mediante un chat con inteligencia artificial. La documentación institucional identifica GPT-4 Turbo y búsqueda de archivos como componentes de la solución.',
      en: 'INAMU mobile application providing information, guidance and initial support around the clock through an artificial-intelligence chat. Institutional documentation identifies GPT-4 Turbo and file search as solution components.',
    },
    contexto: {
      es: 'La disponibilidad y la técnica están confirmadas por fuentes oficiales. La ficha no equipara esa evidencia con efectividad, seguridad o calidad demostradas: no se localizaron métricas públicas de uso, precisión, respuestas incorrectas, derivaciones ni activaciones de emergencia.',
      en: 'Availability and technique are confirmed by official sources. This record does not equate that evidence with demonstrated effectiveness, safety or quality: no public metrics were found for usage, accuracy, incorrect responses, referrals or emergency activations.',
    },
    fuenteUrl: 'https://www.inamu.go.cr/inteligencia-artificial',
    modeloVersion: 2,
    tipoIniciativa: 'sistema-ia',
    estadoCatalogo: 'verificado',
    faseImplementacion: 'operativo',
    estadoIA: 'confirmada',
    evaluacion: {
      existencia: {
        estado: 'confirmado',
        fuenteIds: ['inamu-ela-informacion', 'inamu-ela-terminos'],
      },
      ejecucion: {
        estado: 'confirmado',
        fuenteIds: ['inamu-ela-informacion'],
      },
      tecnicaIA: {
        estado: 'confirmado',
        fuenteIds: ['inamu-ela-informacion'],
      },
      usoOperativo: {
        estado: 'confirmado',
        fuenteIds: ['inamu-ela-informacion', 'inamu-ela-terminos'],
      },
      resultados: { estado: 'no-determinado', fuenteIds: [] },
      gobernanza: {
        estado: 'parcialmente-confirmado',
        fuenteIds: ['inamu-ela-terminos'],
      },
    },
    fuentes: [
      {
        id: 'inamu-ela-informacion',
        titulo: {
          es: 'Aplicación móvil Ela con inteligencia artificial',
          en: 'Ela mobile application with artificial intelligence',
        },
        url: 'https://www.inamu.go.cr/inteligencia-artificial',
        publicador: 'Instituto Nacional de las Mujeres',
        tipoFuente: 'primaria-oficial',
        fechaPublicacion: '2025',
        fechaConsulta: FECHA_REVISION,
        respalda: [
          'existencia',
          'ejecucion',
          'tecnica-ia',
          'uso-operativo',
        ],
        naturalezaAfirmacion: ['hecho'],
      },
      {
        id: 'inamu-ela-terminos',
        titulo: {
          es: 'Términos, condiciones de uso y privacidad de Ela',
          en: 'Ela terms, conditions of use and privacy notice',
        },
        url: 'https://elainamu.inamu.go.cr/assets/terminos_condiciones',
        publicador: 'Instituto Nacional de las Mujeres',
        tipoFuente: 'primaria-oficial',
        fechaPublicacion: '2025',
        fechaConsulta: FECHA_REVISION,
        respalda: ['existencia', 'uso-operativo', 'gobernanza'],
        naturalezaAfirmacion: ['hecho'],
      },
      {
        id: 'micitt-plan-enia-ela',
        titulo: {
          es: 'Plan de Acción de la Estrategia Nacional de Inteligencia Artificial',
          en: 'National Artificial Intelligence Strategy Action Plan',
        },
        url: PLAN_ENIA_URL,
        publicador: 'MICITT',
        tipoFuente: 'primaria-oficial',
        fechaPublicacion: '2025-08-11',
        fechaConsulta: FECHA_REVISION,
        respalda: ['objetivo-declarado', 'meta'],
        naturalezaAfirmacion: ['objetivo-declarado', 'meta'],
      },
    ],
    fechaPrimeraEvidencia: '2025',
    fechaUltimaVerificacion: FECHA_REVISION,
    fechaProximaRevision: PROXIMA_REVISION,
    objetivoDeclarado: {
      es: 'Mejorar la atención y orientación a mujeres mediante soluciones tecnológicas con IA y fortalecer la rectoría técnica del INAMU.',
      en: 'Improve support and guidance for women through AI-enabled technology and strengthen INAMU technical stewardship.',
    },
    datosConocidos: [
      {
        es: 'El chat está disponible las 24 horas para información, orientación y atención inicial.',
        en: 'The chat is available around the clock for information, guidance and initial support.',
      },
      {
        es: 'La página institucional identifica GPT-4 Turbo y búsqueda de archivos.',
        en: 'The institutional page identifies GPT-4 Turbo and file search.',
      },
      {
        es: 'La aplicación puede compartir geolocalización con el 9-1-1 cuando la persona usuaria activa y consiente esa función.',
        en: 'The application may share geolocation with emergency services when the user activates and consents to that feature.',
      },
    ],
    datosNoDeterminados: [
      {
        es: 'No se publican métricas de uso, exactitud, respuestas incorrectas, derivaciones o activaciones de emergencia.',
        en: 'Usage, accuracy, incorrect-response, referral and emergency-activation metrics are not published.',
      },
      {
        es: 'No se localizó una descripción completa de revisión humana, retención, tratamiento por proveedores ni evaluación de seguridad del modelo.',
        en: 'No complete description was found for human review, retention, provider processing or model-safety evaluation.',
      },
    ],
    preguntasAbiertas: [
      {
        es: '¿Qué controles y rutas de escalamiento se aplican cuando una respuesta puede afectar la seguridad de una persona usuaria?',
        en: 'What controls and escalation paths apply when a response may affect a user’s safety?',
      },
      {
        es: '¿Qué resultados de calidad, uso y derivación publica el INAMU para la aplicación?',
        en: 'What quality, usage and referral outcomes does INAMU publish for the application?',
      },
    ],
  },
  {
    id: 'ins-reclamos-medicos-ia',
    titulo: {
      es: 'IA para reclamos de gastos médicos del INS',
      en: 'AI for INS medical-expense claims',
    },
    institucionId: 'ins',
    categoria: 'salud',
    estado: 'operativo',
    desde: '2024',
    descripcion: {
      es: 'Componente de inteligencia artificial reportado por el INS para automatizar flujos de reclamación e indemnización de gastos médicos. La operación general y resultados institucionales están documentados, pero la arquitectura y la técnica específica no son públicas.',
      en: 'Artificial-intelligence component reported by INS for automating medical-expense claim and reimbursement workflows. General operation and institution-reported results are documented, but the architecture and specific technique are not public.',
    },
    resultado: {
      es: 'El INS reportó una reducción del tiempo promedio de pago de entre 12 y 13 días a entre 6 y 7 días, y un nivel de eficiencia de 72%. Son resultados institucionales, no una evaluación independiente.',
      en: 'INS reported a reduction in average payment time from 12–13 days to 6–7 days and a 72% efficiency level. These are institution-reported results, not an independent evaluation.',
    },
    contexto: {
      es: 'La ficha permanece en seguimiento porque la mención institucional de IA no identifica modelo, arquitectura, variables, criterios de clasificación, revisión humana ni métricas de error. La operación no se convierte por sí sola en adopción verificada bajo la regla del catálogo.',
      en: 'The record remains under review because the institution’s AI statement does not identify the model, architecture, variables, classification criteria, human review or error metrics. Operation alone does not qualify as verified adoption under the catalog rule.',
    },
    fuenteUrl:
      'https://www.grupoins.com/media/pyfkpyjz/bolet%C3%ADn-insignia-diciembre-2024.pdf',
    modeloVersion: 2,
    tipoIniciativa: 'componente-ia',
    estadoCatalogo: 'seguimiento',
    faseImplementacion: 'operativo',
    estadoIA: 'declarada-sin-tecnica',
    evaluacion: {
      existencia: {
        estado: 'confirmado',
        fuenteIds: ['ins-reclamos-medicos-2024'],
      },
      ejecucion: {
        estado: 'confirmado',
        fuenteIds: ['ins-reclamos-medicos-2024'],
      },
      tecnicaIA: { estado: 'no-determinado', fuenteIds: [] },
      usoOperativo: {
        estado: 'confirmado',
        fuenteIds: ['ins-reclamos-medicos-2024'],
      },
      resultados: {
        estado: 'confirmado',
        fuenteIds: ['ins-reclamos-medicos-2024'],
      },
      gobernanza: { estado: 'no-determinado', fuenteIds: [] },
    },
    fuentes: [
      {
        id: 'ins-reclamos-medicos-2024',
        titulo: {
          es: 'INS revoluciona su seguro de gastos médicos con inteligencia artificial y agilidad',
          en: 'INS transforms its medical-expense insurance with artificial intelligence and agile methods',
        },
        url: 'https://www.grupoins.com/media/pyfkpyjz/bolet%C3%ADn-insignia-diciembre-2024.pdf',
        publicador: 'Instituto Nacional de Seguros',
        tipoFuente: 'primaria-oficial',
        fechaPublicacion: '2024-12',
        fechaConsulta: FECHA_REVISION,
        respalda: [
          'existencia',
          'ejecucion',
          'uso-operativo',
          'resultado-reportado',
        ],
        naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
      },
      {
        id: 'micitt-plan-enia-ins-reclamos',
        titulo: {
          es: 'Plan de Acción de la Estrategia Nacional de Inteligencia Artificial',
          en: 'National Artificial Intelligence Strategy Action Plan',
        },
        url: PLAN_ENIA_URL,
        publicador: 'MICITT',
        tipoFuente: 'primaria-oficial',
        fechaPublicacion: '2025-08-11',
        fechaConsulta: FECHA_REVISION,
        respalda: ['objetivo-declarado', 'meta'],
        naturalezaAfirmacion: ['objetivo-declarado', 'meta'],
      },
    ],
    fechaPrimeraEvidencia: '2024-12',
    fechaUltimaVerificacion: FECHA_REVISION,
    fechaProximaRevision: PROXIMA_REVISION,
    objetivoDeclarado: {
      es: 'Analizar y clasificar reclamos médicos para reducir tiempos de atención, mejorar el servicio y fortalecer la trazabilidad operativa.',
      en: 'Analyze and classify medical claims to reduce service times, improve service and strengthen operational traceability.',
    },
    resultadosVerificados: [
      {
        id: 'ins-tiempo-pago-reportado',
        texto: {
          es: 'El INS reportó que el tiempo promedio de pago bajó de entre 12 y 13 días a entre 6 y 7 días.',
          en: 'INS reported that average payment time fell from 12–13 days to 6–7 days.',
        },
        fuenteIds: ['ins-reclamos-medicos-2024'],
        fecha: '2024-12',
      },
      {
        id: 'ins-eficiencia-reportada',
        texto: {
          es: 'El INS reportó un nivel de eficiencia de 72% en el proceso transformado.',
          en: 'INS reported a 72% efficiency level for the transformed process.',
        },
        fuenteIds: ['ins-reclamos-medicos-2024'],
        fecha: '2024-12',
      },
    ],
    datosConocidos: [
      {
        es: 'El boletín institucional reporta cerca de 10.000 solicitudes mensuales y señala que la mayoría de los flujos fueron automatizados.',
        en: 'The institutional bulletin reports about 10,000 monthly requests and states that most workflows were automated.',
      },
      {
        es: 'Los resultados publicados son autorreportados por el INS y no corresponden a una evaluación independiente.',
        en: 'Published results are self-reported by INS and do not constitute an independent evaluation.',
      },
    ],
    datosNoDeterminados: [
      {
        es: 'No se publican el modelo, la arquitectura, las variables ni los criterios utilizados para clasificar reclamos.',
        en: 'The model, architecture, variables and criteria used to classify claims are not published.',
      },
      {
        es: 'No se localizaron métricas de error, falsos positivos, revisión humana, fraude detectado o vías de impugnación.',
        en: 'No metrics were found for errors, false positives, human review, detected fraud or appeal mechanisms.',
      },
    ],
    preguntasAbiertas: [
      {
        es: '¿Qué decisiones automatiza el componente y cuáles requieren revisión humana antes de afectar un reclamo?',
        en: 'Which decisions does the component automate, and which require human review before affecting a claim?',
      },
      {
        es: '¿Cómo mide el INS errores, sesgos y calidad del proceso frente al flujo anterior?',
        en: 'How does INS measure errors, bias and process quality against the previous workflow?',
      },
    ],
  },
  {
    id: 'pj-oij-tec-ia-investigacion',
    titulo: {
      es: 'Investigación OIJ–TEC en IA para análisis criminal',
      en: 'OIJ–TEC AI research for criminal analysis',
    },
    institucionId: 'poder-judicial',
    categoria: 'judicial',
    estado: 'piloto',
    desde: '2024',
    descripcion: {
      es: 'Proyecto de investigación y desarrollo activo entre el OIJ y el Tecnológico de Costa Rica para crear sistemas de reconocimiento de imágenes, categorización automática de casos y predicción de incidentes por ubicación mediante aprendizaje automático y profundo.',
      en: 'Active research and development project between OIJ and the Costa Rica Institute of Technology to create image-recognition, automatic case-categorization and location-based incident-prediction systems using machine learning and deep learning.',
    },
    resultado: {
      es: 'En marzo de 2025 el Poder Judicial presentó el subcaso de análisis de tatuajes y describió una herramienta que permite buscar imágenes específicas. La fuente no demuestra despliegue productivo ni uso decisorio rutinario.',
      en: 'In March 2025 the Judiciary presented the tattoo-analysis subcase and described a tool that supports searches for specific images. The source does not establish production deployment or routine decision-making use.',
    },
    contexto: {
      es: 'Esta investigación es distinta del compromiso ENIA atribuido a ICE para predicción de homicidios y del sistema policial SUPERCOP. Ninguna fuente revisada permite fusionar esas tres iniciativas. La ficha se conserva como I+D del ecosistema, no como adopción operativa verificada.',
      en: 'This research is distinct from the ENIA commitment attributed to ICE for homicide prediction and from the SUPERCOP police system. No reviewed source supports merging those three initiatives. The record remains ecosystem R&D, not verified operational adoption.',
    },
    fuenteUrl:
      'https://orion.tec.ac.cr/es/projects/sistemas-basados-en-inteligencia-artificial-usando-machine-learni/',
    modeloVersion: 2,
    tipoIniciativa: 'investigacion',
    estadoCatalogo: 'ecosistema',
    faseImplementacion: 'desarrollo',
    estadoIA: 'confirmada',
    evaluacion: {
      existencia: {
        estado: 'confirmado',
        fuenteIds: ['tec-oij-ia-proyecto', 'pj-oij-tatuajes-2025'],
      },
      ejecucion: {
        estado: 'confirmado',
        fuenteIds: [
          'tec-oij-ia-proyecto',
          'pj-oij-tatuajes-2025',
          'pj-oij-tec-equipo-2025',
        ],
      },
      tecnicaIA: {
        estado: 'confirmado',
        fuenteIds: ['tec-oij-ia-proyecto', 'pj-oij-tatuajes-2025'],
      },
      usoOperativo: { estado: 'no-determinado', fuenteIds: [] },
      resultados: {
        estado: 'parcialmente-confirmado',
        fuenteIds: ['pj-oij-tatuajes-2025'],
      },
      gobernanza: { estado: 'no-determinado', fuenteIds: [] },
    },
    fuentes: [
      {
        id: 'tec-oij-ia-proyecto',
        titulo: {
          es: 'Sistemas basados en IA para reconocimiento, categorización y predicción de incidentes',
          en: 'AI-based systems for recognition, categorization and incident prediction',
        },
        url: 'https://orion.tec.ac.cr/es/projects/sistemas-basados-en-inteligencia-artificial-usando-machine-learni/',
        publicador: 'Tecnológico de Costa Rica',
        tipoFuente: 'primaria-oficial',
        fechaPublicacion: '2024',
        fechaConsulta: FECHA_REVISION,
        respalda: ['existencia', 'objetivo-declarado', 'ejecucion', 'tecnica-ia'],
        naturalezaAfirmacion: ['hecho', 'objetivo-declarado'],
      },
      {
        id: 'pj-oij-tatuajes-2025',
        titulo: {
          es: 'Encuentro sobre beneficios y desafíos de la IA en la labor judicial',
          en: 'Forum on benefits and challenges of AI in judicial work',
        },
        url: 'https://pj.poder-judicial.go.cr/index.php/component/content/article/2076-encuentro-expone-sobre-los-beneficios-y-desafios-de-la-implementacion-de-la-inteligencia-artificial-en-la-labor-judicial?Itemid=409&catid=8',
        publicador: 'Poder Judicial',
        tipoFuente: 'primaria-oficial',
        fechaPublicacion: '2025-03-27',
        fechaConsulta: FECHA_REVISION,
        respalda: [
          'existencia',
          'ejecucion',
          'tecnica-ia',
          'resultado-reportado',
        ],
        naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
      },
      {
        id: 'pj-oij-tec-equipo-2025',
        titulo: {
          es: 'Acta sobre préstamo de equipo para entrenamiento y prueba del proyecto OIJ–TEC',
          en: 'Minutes on equipment loan for OIJ–TEC project training and testing',
        },
        url: 'https://nexuspj.poder-judicial.go.cr/document/act-1-0003-8728-37',
        publicador: 'Poder Judicial',
        tipoFuente: 'primaria-oficial',
        fechaPublicacion: '2025',
        fechaConsulta: FECHA_REVISION,
        respalda: ['existencia', 'ejecucion'],
        naturalezaAfirmacion: ['hecho'],
      },
    ],
    fechaPrimeraEvidencia: '2024-01-01',
    fechaUltimaVerificacion: FECHA_REVISION,
    fechaProximaRevision: PROXIMA_REVISION,
    objetivoDeclarado: {
      es: 'Desarrollar tres sistemas de software con IA para reconocimiento de imágenes, categorización automática de casos y predicción de incidentes por ubicación en apoyo a la lucha contra el crimen organizado.',
      en: 'Develop three AI software systems for image recognition, automatic case categorization and location-based incident prediction in support of efforts against organized crime.',
    },
    resultadosVerificados: [
      {
        id: 'oij-modelo-tatuajes-presentado',
        texto: {
          es: 'El Poder Judicial presentó en marzo de 2025 un modelo de análisis de tatuajes y describió la búsqueda de imágenes específicas como una capacidad desarrollada.',
          en: 'In March 2025 the Judiciary presented a tattoo-analysis model and described specific-image search as a developed capability.',
        },
        fuenteIds: ['pj-oij-tatuajes-2025'],
        fecha: '2025-03-27',
      },
    ],
    datosConocidos: [
      {
        es: 'La ficha del TEC registra el proyecto como activo del 1 de enero de 2024 al 31 de diciembre de 2026.',
        en: 'The TEC record lists the project as active from January 1, 2024 through December 31, 2026.',
      },
      {
        es: 'Las tres líneas de trabajo son reconocimiento de imágenes, categorización automática de casos y predicción de incidentes por ubicación.',
        en: 'The three workstreams are image recognition, automatic case categorization and location-based incident prediction.',
      },
      {
        es: 'Un acta del Poder Judicial documenta equipo prestado para entrenar y probar modelos, lo que confirma desarrollo y no prueba operación productiva.',
        en: 'Judiciary minutes document loaned equipment for model training and testing, confirming development but not production operation.',
      },
    ],
    datosNoDeterminados: [
      {
        es: 'No se localizó evidencia de despliegue productivo, integración en decisiones rutinarias o fecha de entrada en operación.',
        en: 'No evidence was found for production deployment, integration into routine decisions or an operational start date.',
      },
      {
        es: 'No se publican métricas de precisión, falsos positivos, validación externa o desempeño por grupo para reconocimiento de imágenes y predicción.',
        en: 'Accuracy, false-positive, external-validation and group-level performance metrics are not published for recognition and prediction.',
      },
      {
        es: 'No se localizó documentación pública completa sobre base jurídica, categorías de datos, retención, revisión humana o mecanismos de impugnación.',
        en: 'No complete public documentation was found on legal basis, data categories, retention, human review or appeal mechanisms.',
      },
    ],
    preguntasAbiertas: [
      {
        es: '¿Alguno de los tres sistemas pasó de investigación a piloto o uso operativo dentro del OIJ?',
        en: 'Did any of the three systems move from research into a pilot or operational use within OIJ?',
      },
      {
        es: '¿Qué controles de calidad, sesgo, revisión humana y trazabilidad se aplicarán antes de cualquier uso investigativo?',
        en: 'What quality, bias, human-review and traceability controls will apply before any investigative use?',
      },
    ],
  },
];

const institucionesFase4C: Institucion[] = [
  {
    id: 'inamu',
    nombre: {
      es: 'Instituto Nacional de las Mujeres',
      en: 'National Institute for Women',
    },
    nombreCorto: { es: 'INAMU', en: 'INAMU' },
    tipo: 'autonoma',
    url: 'https://www.inamu.go.cr/',
    proyectosActivos: 1,
    resumen: {
      es: 'Una adopción verificada: Ela, una aplicación con chat de IA para información, orientación y atención inicial a mujeres durante las 24 horas.',
      en: 'One verified adoption: Ela, an AI-chat application providing women with information, guidance and initial support around the clock.',
    },
    descripcion: {
      es: 'Las fuentes institucionales confirman disponibilidad, GPT-4 Turbo, búsqueda de archivos y tratamiento de datos personales. La ficha separa esa evidencia de los resultados todavía no publicados sobre calidad, seguridad, uso y derivaciones.',
      en: 'Institutional sources confirm availability, GPT-4 Turbo, file search and personal-data processing. The record separates that evidence from still-unpublished outcomes on quality, safety, usage and referrals.',
    },
    lecciones: {
      es: 'En un servicio dirigido a personas potencialmente vulnerables, confirmar la técnica y la disponibilidad no sustituye la evidencia sobre desempeño, escalamiento humano y protección de datos.',
      en: 'For a service aimed at potentially vulnerable users, confirming technique and availability does not replace evidence on performance, human escalation and data protection.',
    },
  },
  {
    id: 'ins',
    nombre: {
      es: 'Instituto Nacional de Seguros',
      en: 'National Insurance Institute',
    },
    nombreCorto: { es: 'INS', en: 'INS' },
    tipo: 'autonoma',
    url: 'https://www.grupoins.com/',
    proyectosActivos: 1,
    resumen: {
      es: 'Una iniciativa en seguimiento: automatización con IA reportada para reclamos e indemnizaciones de gastos médicos.',
      en: 'One initiative under review: reported AI automation for medical-expense claims and reimbursements.',
    },
    descripcion: {
      es: 'El INS reporta operación, volumen y mejoras de tiempo y eficiencia. La ficha no entra en adopción verificada porque las fuentes disponibles no identifican la técnica, las reglas de clasificación, la revisión humana ni las métricas de error.',
      en: 'INS reports operation, volume and improvements in time and efficiency. The record does not qualify as verified adoption because available sources do not identify the technique, classification rules, human review or error metrics.',
    },
    lecciones: {
      es: 'Un resultado institucional puede documentarse sin convertirlo en evaluación independiente. Publicar la naturaleza de la fuente y los campos no determinados mantiene visible ese límite.',
      en: 'An institution-reported result can be documented without treating it as an independent evaluation. Publishing source nature and undetermined fields keeps that boundary visible.',
    },
  },
];

function upsertById<T extends { id: string }>(items: T[], additions: T[]): T[] {
  const additionsById = new Map(additions.map((item) => [item.id, item]));
  const updated = items.map((item) => additionsById.get(item.id) ?? item);
  const existingIds = new Set(items.map((item) => item.id));
  return [
    ...updated,
    ...additions.filter((item) => !existingIds.has(item.id)),
  ];
}

const proyectos = JSON.parse(
  readFileSync(PROYECTOS_URL, 'utf8'),
) as Proyecto[];
const instituciones = JSON.parse(
  readFileSync(INSTITUCIONES_URL, 'utf8'),
) as Institucion[];

const poderJudicial = instituciones.find(
  (institucion) => institucion.id === 'poder-judicial',
);
if (!poderJudicial) {
  throw new Error('No se encontró la institución poder-judicial.');
}

const poderJudicialActualizado: Institucion = {
  ...poderJudicial,
  proyectosActivos: 9,
  resumen: {
    es: 'Nueve iniciativas documentadas: tres adopciones verificadas, dos sistemas en seguimiento y cuatro registros de investigación, capacidades o digitalización sin IA confirmada.',
    en: 'Nine documented initiatives: three verified adoptions, two systems under review, and four research, capacity-building or digitization records without confirmed AI.',
  },
  descripcion: {
    es: 'El catálogo confirma un piloto de clasificación documental, un modelo de aprendizaje automático para presupuesto y el uso de Nymiz. ChatbotPJ y el chat de CONAMAJ permanecen en seguimiento. La investigación OIJ–TEC, el análisis de sentencias, Giro Continuo y la inducción de Sala Primera se conservan como contexto, sin contarlos como sistemas de IA adoptados.',
    en: 'The catalog confirms a document-classification pilot, a machine-learning budget model and the use of Nymiz. ChatbotPJ and the CONAMAJ chat remain under review. OIJ–TEC research, rulings analysis, Continuous Disbursement and the First Chamber induction are retained as context without counting them as adopted AI systems.',
  },
};

const proyectosSalida = upsertById(proyectos, proyectosFase4C);
const institucionesSalida = upsertById(instituciones, [
  poderJudicialActualizado,
  ...institucionesFase4C,
]);

for (const [nombre, items] of [
  ['proyectos', proyectosSalida],
  ['instituciones', institucionesSalida],
] as const) {
  const ids = items.map((item) => item.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error(`La salida de ${nombre} contiene IDs duplicados.`);
  }
}

writeFileSync(PROYECTOS_URL, `${JSON.stringify(proyectosSalida, null, 2)}\n`);
writeFileSync(
  INSTITUCIONES_URL,
  `${JSON.stringify(institucionesSalida, null, 2)}\n`,
);

console.log(
  `Fase 4C aplicada: ${proyectosSalida.length} iniciativas y ${institucionesSalida.length} instituciones.`,
);
