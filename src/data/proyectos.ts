import type { Bilingual } from '@/i18n/config';

export type Categoria = 'judicial' | 'salud' | 'educacion' | 'fiscal' | 'infraestructura';
export type Estado = 'operativo' | 'piloto' | 'planificado';

export interface Proyecto {
  id: string;
  titulo: Bilingual;
  institucionId: string;
  categoria: Categoria;
  estado: Estado;
  descripcion: Bilingual;
  resultado?: Bilingual;
  contexto?: Bilingual;
  desde?: string;
  fuenteUrl: string;
}

export const proyectos: Proyecto[] = [
  {
    id: 'pj-clasificacion-cobros',
    titulo: {
      es: 'Clasificación documental de cobros',
      en: 'Document classification for debt collection',
    },
    institucionId: 'poder-judicial',
    categoria: 'judicial',
    estado: 'operativo',
    desde: '2023',
    descripcion: {
      es: 'Sistema IA para clasificación automática de documentos en el Juzgado Especializado de Cobro Judicial de Pérez Zeledón.',
      en: 'AI system for automated document classification at the Specialized Debt Collection Court of Pérez Zeledón.',
    },
    resultado: {
      es: '1,302,899 documentos procesados; reducción del circulante en materia cobratoria.',
      en: '1,302,899 documents processed; reduction of the open caseload in debt collection.',
    },
    contexto: {
      es: 'Es el caso de uso más maduro del Estado costarricense en clasificación documental con IA. La adopción se hizo desde un juzgado regional, no desde una iniciativa central, lo que evidencia que la innovación judicial avanza sin coordinación nacional.',
      en: 'The most mature documented case of AI document classification in the Costa Rican State. Adoption came from a regional court, not from a central initiative, showing that judicial innovation is moving without national coordination.',
    },
    fuenteUrl:
      'https://pj.poder-judicial.go.cr/index.php/component/content/article/760-poder-judicial-implementa-inteligencia-artificial-para-disminuir-circulante-en-materia-cobratoria',
  },
  {
    id: 'pj-ml-presupuestal',
    titulo: {
      es: 'Modelo ML de predicción presupuestaria',
      en: 'ML model for budget execution forecasting',
    },
    institucionId: 'poder-judicial',
    categoria: 'judicial',
    estado: 'operativo',
    desde: '2019',
    descripcion: {
      es: 'Predicción de ejecución presupuestaria con machine learning, usado por 60+ centros de gestión.',
      en: 'Budget execution forecasting with machine learning, used by 60+ management centers.',
    },
    resultado: {
      es: 'Ahorro acumulado +₡100M.',
      en: 'Cumulative savings of +₡100M.',
    },
    contexto: {
      es: 'Operativo desde 2019, es la aplicación de IA con retorno cuantificado más antiguo del Estado costarricense. Demuestra que el Poder Judicial adoptó analítica predictiva años antes que cualquier otra institución pública del país.',
      en: 'Operational since 2019, this is the longest-running AI application with quantified ROI in the Costa Rican State. It shows the Judicial Branch adopted predictive analytics years before any other Costa Rican public institution.',
    },
    fuenteUrl:
      'https://pj.poder-judicial.go.cr/index.php/component/content/article/760-poder-judicial-implementa-inteligencia-artificial-para-disminuir-circulante-en-materia-cobratoria',
  },
  {
    id: 'pj-nymiz',
    titulo: {
      es: 'Anonimización con Nymiz',
      en: 'Anonymization with Nymiz',
    },
    institucionId: 'poder-judicial',
    categoria: 'judicial',
    estado: 'operativo',
    desde: '2023',
    descripcion: {
      es: 'Anonimización automática de datos personales en documentos judiciales, alineada al Reglamento de Protección de Datos.',
      en: 'Automated anonymization of personal data in judicial documents, aligned with the Data Protection Regulation.',
    },
    contexto: {
      es: 'El Poder Judicial es la única institución del Estado que aplica IA específicamente para cumplir con la Ley 8968 de protección de datos. Marca un piso de gobernanza que el resto del sector público todavía no replica.',
      en: 'The Judicial Branch is the only state institution applying AI specifically to comply with Law 8968 on data protection. It sets a governance floor that the rest of the public sector has yet to replicate.',
    },
    fuenteUrl:
      'https://cij.poder-judicial.go.cr/images/ProteccionDatos/REGLAMENTO_PROTECCIN_DE_DATOS-PODER_JUDICIAL.pdf',
  },
  {
    id: 'pj-sentencias-sala-iv',
    titulo: {
      es: 'Análisis IA de sentencias Sala Cuarta',
      en: 'AI analysis of Constitutional Chamber rulings',
    },
    institucionId: 'poder-judicial',
    categoria: 'judicial',
    estado: 'operativo',
    desde: '2025',
    descripcion: {
      es: 'Análisis con ML de 500,000+ sentencias del Tribunal Constitucional (1989-2018), en alianza con UCR/IIJ y Programa Estado de la Nación.',
      en: 'ML analysis of 500,000+ Constitutional Court rulings (1989-2018), in partnership with UCR/IIJ and the State of the Nation Program.',
    },
    resultado: {
      es: '433,043 sentencias analizadas; primera aplicación documentada de ciencia de datos a investigación jurídica en CR.',
      en: '433,043 rulings analyzed; first documented application of data science to legal research in Costa Rica.',
    },
    contexto: {
      es: 'Alianza tripartita Poder Judicial + UCR + Programa Estado de la Nación. El modelo de cooperación con academia pública es replicable en otras instituciones, pero hasta hoy es único en su tipo en el Estado costarricense.',
      en: 'A three-way partnership of the Judicial Branch, UCR and the State of the Nation Program. The model of cooperation with public academia is replicable elsewhere, but to date is unique in Costa Rica.',
    },
    fuenteUrl:
      'https://www.ucr.ac.cr/noticias/2025/7/09/la-inteligencia-artificial-analiza-de-manera-automatico-sentencias-de-la-sala-cuarta.html',
  },
  {
    id: 'ccss-tec-formacion',
    titulo: {
      es: 'Programa TEC-CCSS de formación en IA médica',
      en: 'TEC-CCSS training program in medical AI',
    },
    institucionId: 'ccss',
    categoria: 'salud',
    estado: 'operativo',
    desde: '2025',
    descripcion: {
      es: 'Curso de 8 semanas para personal médico, TI y administrativo. Proyectos: detección de anomalías en mamografías, análisis de imágenes oftálmicas neonatales.',
      en: '8-week course for medical, IT and administrative staff. Projects: anomaly detection in mammograms, analysis of neonatal eye imaging.',
    },
    contexto: {
      es: 'Primer programa formal de formación en IA clínica en Costa Rica. La CCSS financia capacitación en lugar de adquisición de software, lo que apunta a desarrollar capacidad interna antes que dependencia de proveedores.',
      en: 'First formal medical AI training program in Costa Rica. CCSS is funding training rather than buying software, signaling intent to build internal capacity before relying on vendors.',
    },
    fuenteUrl:
      'https://www.tec.ac.cr/hoyeneltec/2025/12/15/tec-ccss-impulsan-uso-inteligencia-artificial-resolver-retos-salud-publica',
  },
  {
    id: 'ccss-edus',
    titulo: {
      es: 'EDUS con IA predictiva',
      en: 'EDUS with predictive AI',
    },
    institucionId: 'ccss',
    categoria: 'salud',
    estado: 'planificado',
    descripcion: {
      es: 'Expediente Digital Único en Salud (operativo desde 2010, Ley 9162) con incorporación planificada de IA para medicina predictiva.',
      en: 'Single Digital Health Record (live since 2010, Law 9162) with planned AI incorporation for predictive medicine.',
    },
    contexto: {
      es: 'EDUS cubre al 100% de los asegurados de la CCSS y se probó durante la pandemia. La capa de IA está planificada pero sin cronograma público; es uno de los datasets más valiosos del Estado costarricense aún sin explotar con IA a escala.',
      en: 'EDUS covers 100% of CCSS members and was stress-tested during the pandemic. The AI layer is planned but has no public timeline; it is one of the most valuable Costa Rican state datasets still untapped at scale by AI.',
    },
    fuenteUrl:
      'https://publications.iadb.org/en/costa-ricas-unified-digital-health-record-edus-system-best-practices-history-and-implementation',
  },
  {
    id: 'ccss-ebais',
    titulo: {
      es: 'IA en EBAIS (atención primaria)',
      en: 'AI in EBAIS clinics (primary care)',
    },
    institucionId: 'ccss',
    categoria: 'salud',
    estado: 'piloto',
    desde: '2025',
    descripcion: {
      es: 'Implementación de IA en Equipos Básicos de Atención Integral en Salud para mejorar diagnósticos y reducir referencias a hospitales.',
      en: 'AI deployment in Basic Comprehensive Health Care Teams to improve diagnoses and reduce hospital referrals.',
    },
    contexto: {
      es: 'Piloto activo en 2025. Llevar IA a la atención primaria es una decisión de cobertura territorial: implica que la institución apuesta por descongestionar hospitales antes que por modernizar especialidades.',
      en: 'Active pilot in 2025. Taking AI to primary care is a territorial-coverage bet: the institution is prioritizing relief at the hospital level over modernizing specialty services.',
    },
    fuenteUrl:
      'https://observador.cr/ccss-incorporara-inteligencia-artificial-en-ebais-para-agilizar-diagnosticos-y-reducir-referencias-a-hospitales/',
  },
  {
    id: 'hacienda-anomaly',
    titulo: {
      es: 'Detección de fraude fiscal con IA',
      en: 'AI tax fraud detection',
    },
    institucionId: 'hacienda',
    categoria: 'fiscal',
    estado: 'operativo',
    desde: '2024',
    descripcion: {
      es: 'Microsoft Anomaly Detector procesa millones de comprobantes electrónicos para detectar facturación falsa (EFOS) e inflación de deducciones (EDOS).',
      en: 'Microsoft Anomaly Detector processes millions of electronic receipts to detect fake invoicing (EFOS) and inflated deductions (EDOS).',
    },
    resultado: {
      es: '₡8,000M (~USD 15.7M) recuperados en 2025; 70+ casos de facturación falsa identificados.',
      en: '₡8,000M (~USD 15.7M) recovered in 2025; 70+ fake-invoicing cases identified.',
    },
    contexto: {
      es: 'Único caso del Estado costarricense con retorno fiscal medible y reportado en 2025. Apoyado en infraestructura de facturación electrónica v4.4 ya consolidada; la IA agrega valor sobre datos transaccionales que el Estado ya recolectaba.',
      en: 'The only Costa Rican state case with measurable, publicly reported fiscal returns in 2025. It rides on the consolidated v4.4 e-invoicing infrastructure; AI adds value on top of transactional data the State was already collecting.',
    },
    fuenteUrl:
      'https://www.nacion.com/economia/hacienda-revela-la-tecnologia-que-le-permitio/G63WRWKZ7NHLXBSHCS6RI3T4JU/story/',
  },
  {
    id: 'hacienda-asistente',
    titulo: {
      es: 'Asistente virtual para contribuyentes',
      en: 'Virtual assistant for taxpayers',
    },
    institucionId: 'hacienda',
    categoria: 'fiscal',
    estado: 'operativo',
    descripcion: {
      es: 'Asistente integrado en Hacienda Digital para mejorar la experiencia en declaraciones, pagos e importaciones/exportaciones.',
      en: 'Assistant embedded in Hacienda Digital to improve the experience for filings, payments and imports/exports.',
    },
    contexto: {
      es: 'Es el único asistente virtual ciudadano operativo en el gobierno central. No hay un chatbot nacional unificado tipo Bürokratt (Estonia) o VICA (Singapur); cada institución resuelve por su cuenta.',
      en: 'The only operational citizen-facing virtual assistant in the central government. There is no unified national chatbot in the style of Estonia\u2019s Bürokratt or Singapore\u2019s VICA; each institution builds its own.',
    },
    fuenteUrl: 'https://www.hacienda.go.cr/',
  },
  {
    id: 'mep-intel',
    titulo: {
      es: 'Especialización técnica en IA (MEP + Intel)',
      en: 'AI technical specialization (MEP + Intel)',
    },
    institucionId: 'mep',
    categoria: 'educacion',
    estado: 'operativo',
    desde: '2023',
    descripcion: {
      es: 'Currículo de 3 años en machine learning, ética y aspectos legales de IA. Inicio en 4 CTPs (Santa Ana, Puriscal, Coronado, Calle Blancos).',
      en: '3-year curriculum on machine learning, ethics and legal aspects of AI. Started in 4 vocational schools (Santa Ana, Puriscal, Coronado, Calle Blancos).',
    },
    resultado: {
      es: 'Primer país latinoamericano con IA como carrera técnica formal en secundaria.',
      en: 'First Latin American country with AI as a formal technical track in secondary education.',
    },
    contexto: {
      es: 'Hito regional logrado por alianza público-privada con Intel. La salida de Intel de operaciones de manufactura en CR deja una pregunta abierta: ¿quién sostiene el currículo si el socio principal pierde presencia local?',
      en: 'Regional milestone achieved through a public-private partnership with Intel. With Intel scaling back its Costa Rica manufacturing footprint, there is an open question on who sustains the curriculum if the lead partner reduces local presence.',
    },
    fuenteUrl:
      'https://www.mep.go.cr/noticias/convenio-mep-e-intel-costa-rica-habilitara-especialidad-inteligencia-artificial-colegios-te',
  },
  {
    id: 'micitt-linc',
    titulo: {
      es: 'LINC — Laboratorios de Innovación Comunitaria',
      en: 'LINC — Community Innovation Labs',
    },
    institucionId: 'micitt',
    categoria: 'infraestructura',
    estado: 'operativo',
    desde: '2025',
    descripcion: {
      es: '16 laboratorios distribuidos en las 7 provincias con kits de robótica, drones, impresoras 3D, cortadoras láser.',
      en: '16 labs distributed across the 7 provinces with robotics kits, drones, 3D printers and laser cutters.',
    },
    resultado: {
      es: '+4,500 personas capacitadas; 70% participación femenina.',
      en: '+4,500 people trained; 70% female participation.',
    },
    contexto: {
      es: 'Cobertura geográfica en las 7 provincias y 70% de participación femenina marcan un piso de equidad inusual en programas tech del Estado. La meta declarada es expandir a 20+ laboratorios.',
      en: 'Coverage across all 7 provinces and 70% female participation mark an unusual equity floor for state-led tech programs. The stated goal is to expand to 20+ labs.',
    },
    fuenteUrl: 'https://www.micitt.go.cr/micitt/laboratorios-de-innovacion-comunitaria',
  },
];
