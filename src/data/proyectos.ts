export type Categoria = 'judicial' | 'salud' | 'educacion' | 'fiscal' | 'infraestructura';
export type Estado = 'operativo' | 'piloto' | 'planificado';

export interface Proyecto {
  id: string;
  titulo: string;
  institucionId: string;
  categoria: Categoria;
  estado: Estado;
  descripcion: string;
  resultado?: string;
  desde?: string;
  fuenteUrl: string;
}

export const proyectos: Proyecto[] = [
  {
    id: 'pj-clasificacion-cobros',
    titulo: 'Clasificación documental de cobros',
    institucionId: 'poder-judicial',
    categoria: 'judicial',
    estado: 'operativo',
    desde: '2023',
    descripcion: 'Sistema IA para clasificación automática de documentos en el Juzgado Especializado de Cobro Judicial de Pérez Zeledón.',
    resultado: '1,302,899 documentos procesados; reducción del circulante en materia cobratoria.',
    fuenteUrl: 'https://pj.poder-judicial.go.cr/',
  },
  {
    id: 'pj-ml-presupuestal',
    titulo: 'Modelo ML de predicción presupuestaria',
    institucionId: 'poder-judicial',
    categoria: 'judicial',
    estado: 'operativo',
    desde: '2019',
    descripcion: 'Predicción de ejecución presupuestaria con machine learning, usado por 60+ centros de gestión.',
    resultado: 'Ahorro acumulado +₡100M.',
    fuenteUrl: 'https://pj.poder-judicial.go.cr/',
  },
  {
    id: 'pj-nymiz',
    titulo: 'Anonimización con Nymiz',
    institucionId: 'poder-judicial',
    categoria: 'judicial',
    estado: 'operativo',
    desde: '2023',
    descripcion: 'Anonimización automática de datos personales en documentos judiciales, alineada al Reglamento de Protección de Datos.',
    fuenteUrl: 'https://cij.poder-judicial.go.cr/',
  },
  {
    id: 'pj-sentencias-sala-iv',
    titulo: 'Análisis IA de sentencias Sala Cuarta',
    institucionId: 'poder-judicial',
    categoria: 'judicial',
    estado: 'operativo',
    desde: '2025',
    descripcion: 'Análisis con ML de 500,000+ sentencias del Tribunal Constitucional (1989-2018), en alianza con UCR/IIJ y Programa Estado de la Nación.',
    resultado: '433,043 sentencias analizadas; primera aplicación documentada de ciencia de datos a investigación jurídica en CR.',
    fuenteUrl: 'https://www.ucr.ac.cr/',
  },
  {
    id: 'ccss-tec-formacion',
    titulo: 'Programa TEC-CCSS de formación en IA médica',
    institucionId: 'ccss',
    categoria: 'salud',
    estado: 'operativo',
    desde: '2025',
    descripcion: 'Curso de 8 semanas para personal médico, TI y administrativo. Proyectos: detección de anomalías en mamografías, análisis de imágenes oftálmicas neonatales.',
    fuenteUrl: 'https://www.tec.ac.cr/',
  },
  {
    id: 'ccss-edus',
    titulo: 'EDUS con IA predictiva',
    institucionId: 'ccss',
    categoria: 'salud',
    estado: 'planificado',
    descripcion: 'Expediente Digital Único en Salud (operativo desde 2010, Ley 9162) con incorporación planificada de IA para medicina predictiva.',
    fuenteUrl: 'https://publications.iadb.org/',
  },
  {
    id: 'ccss-ebais',
    titulo: 'IA en EBAIS (atención primaria)',
    institucionId: 'ccss',
    categoria: 'salud',
    estado: 'piloto',
    desde: '2025',
    descripcion: 'Implementación de IA en Equipos Básicos de Atención Integral en Salud para mejorar diagnósticos y reducir referencias a hospitales.',
    fuenteUrl: 'https://observador.cr/',
  },
  {
    id: 'hacienda-anomaly',
    titulo: 'Detección de fraude fiscal con IA',
    institucionId: 'hacienda',
    categoria: 'fiscal',
    estado: 'operativo',
    desde: '2024',
    descripcion: 'Microsoft Anomaly Detector procesa millones de comprobantes electrónicos para detectar facturación falsa (EFOS) e inflación de deducciones (EDOS).',
    resultado: '₡8,000M (~USD 15.7M) recuperados en 2025; 70+ casos de facturación falsa identificados.',
    fuenteUrl: 'https://www.nacion.com/',
  },
  {
    id: 'hacienda-asistente',
    titulo: 'Asistente virtual para contribuyentes',
    institucionId: 'hacienda',
    categoria: 'fiscal',
    estado: 'operativo',
    descripcion: 'Asistente integrado en Hacienda Digital para mejorar la experiencia en declaraciones, pagos e importaciones/exportaciones.',
    fuenteUrl: 'https://www.hacienda.go.cr/',
  },
  {
    id: 'mep-intel',
    titulo: 'Especialización técnica en IA (MEP + Intel)',
    institucionId: 'mep',
    categoria: 'educacion',
    estado: 'operativo',
    desde: '2023',
    descripcion: 'Currículo de 3 años en machine learning, ética y aspectos legales de IA. Inicio en 4 CTPs (Santa Ana, Puriscal, Coronado, Calle Blancos).',
    resultado: 'Primer país latinoamericano con IA como carrera técnica formal en secundaria.',
    fuenteUrl: 'https://www.mep.go.cr/',
  },
  {
    id: 'micitt-linc',
    titulo: 'LINC — Laboratorios de Innovación Comunitaria',
    institucionId: 'micitt',
    categoria: 'infraestructura',
    estado: 'operativo',
    desde: '2025',
    descripcion: '16 laboratorios distribuidos en las 7 provincias con kits de robótica, drones, impresoras 3D, cortadoras láser.',
    resultado: '+4,500 personas capacitadas; 70% participación femenina.',
    fuenteUrl: 'https://www.micitt.go.cr/',
  },
];
