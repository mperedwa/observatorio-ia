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
    fuenteUrl: 'https://pj.poder-judicial.go.cr/',
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
    fuenteUrl: 'https://pj.poder-judicial.go.cr/',
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
    fuenteUrl: 'https://cij.poder-judicial.go.cr/',
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
    fuenteUrl: 'https://www.ucr.ac.cr/',
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
    fuenteUrl: 'https://www.tec.ac.cr/',
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
    fuenteUrl: 'https://publications.iadb.org/',
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
    fuenteUrl: 'https://observador.cr/',
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
    fuenteUrl: 'https://www.nacion.com/',
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
    fuenteUrl: 'https://www.mep.go.cr/',
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
    fuenteUrl: 'https://www.micitt.go.cr/',
  },
];
