export type Tipo = 'ministerio' | 'asamblea' | 'judicial' | 'autonoma' | 'universidad' | 'camara';

export interface Institucion {
  id: string;
  nombre: string;
  nombreCorto: string;
  tipo: Tipo;
  url: string;
  proyectosActivos: number;
  resumen: string;
}

export const instituciones: Institucion[] = [
  {
    id: 'poder-judicial',
    nombre: 'Poder Judicial',
    nombreCorto: 'Poder Judicial',
    tipo: 'judicial',
    url: 'https://pj.poder-judicial.go.cr/',
    proyectosActivos: 4,
    resumen: 'Líder en adopción institucional: clasificación documental, ML presupuestal con +₡100M ahorrados, anonimización con Nymiz, análisis de sentencias Sala Cuarta con UCR/PEN.',
  },
  {
    id: 'ccss',
    nombre: 'Caja Costarricense de Seguro Social',
    nombreCorto: 'CCSS',
    tipo: 'autonoma',
    url: 'https://www.ccss.sa.cr/',
    proyectosActivos: 3,
    resumen: 'Programa TEC-CCSS de formación en IA médica (mamografías, imágenes neonatales), expediente digital EDUS con IA predictiva planificada, IA en EBAIS para atención primaria.',
  },
  {
    id: 'hacienda',
    nombre: 'Ministerio de Hacienda',
    nombreCorto: 'Hacienda',
    tipo: 'ministerio',
    url: 'https://www.hacienda.go.cr/',
    proyectosActivos: 2,
    resumen: 'Detección de fraude fiscal con Microsoft Anomaly Detector — ₡8,000M recuperados en 2025. Asistente virtual para contribuyentes en Hacienda Digital.',
  },
  {
    id: 'mep',
    nombre: 'Ministerio de Educación Pública',
    nombreCorto: 'MEP',
    tipo: 'ministerio',
    url: 'https://www.mep.go.cr/',
    proyectosActivos: 1,
    resumen: 'Especialización técnica en IA con Intel en colegios técnicos profesionales. Primer país latinoamericano con IA como carrera técnica formal en secundaria.',
  },
  {
    id: 'micitt',
    nombre: 'Ministerio de Ciencia, Innovación, Tecnología y Telecomunicaciones',
    nombreCorto: 'MICITT',
    tipo: 'ministerio',
    url: 'https://www.micitt.go.cr/',
    proyectosActivos: 1,
    resumen: 'Estrategia Nacional de IA (ENIA) 2024-2027 — primera política nacional de IA de Centroamérica. LINC Labs: 16 laboratorios, +4,500 personas capacitadas, 70% participación femenina.',
  },
];
