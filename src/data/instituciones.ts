import type { Bilingual } from '@/i18n/config';

export type Tipo = 'ministerio' | 'asamblea' | 'judicial' | 'autonoma' | 'universidad' | 'camara';

export interface Institucion {
  id: string;
  nombre: Bilingual;
  nombreCorto: Bilingual;
  tipo: Tipo;
  url: string;
  proyectosActivos: number;
  resumen: Bilingual;
}

export const instituciones: Institucion[] = [
  {
    id: 'poder-judicial',
    nombre: { es: 'Poder Judicial', en: 'Judicial Branch' },
    nombreCorto: { es: 'Poder Judicial', en: 'Judicial Branch' },
    tipo: 'judicial',
    url: 'https://pj.poder-judicial.go.cr/',
    proyectosActivos: 4,
    resumen: {
      es: 'Líder en adopción institucional: clasificación documental, ML presupuestal con +₡100M ahorrados, anonimización con Nymiz, análisis de sentencias Sala Cuarta con UCR/PEN.',
      en: 'Institutional adoption leader: document classification, budget ML model with +₡100M saved, anonymization with Nymiz, Constitutional Chamber rulings analysis with UCR/PEN.',
    },
  },
  {
    id: 'ccss',
    nombre: {
      es: 'Caja Costarricense de Seguro Social',
      en: 'Costa Rican Social Security Fund',
    },
    nombreCorto: { es: 'CCSS', en: 'CCSS' },
    tipo: 'autonoma',
    url: 'https://www.ccss.sa.cr/',
    proyectosActivos: 3,
    resumen: {
      es: 'Programa TEC-CCSS de formación en IA médica (mamografías, imágenes neonatales), expediente digital EDUS con IA predictiva planificada, IA en EBAIS para atención primaria.',
      en: 'TEC-CCSS training program on medical AI (mammograms, neonatal imaging), digital health record (EDUS) with planned predictive AI, AI in EBAIS clinics for primary care.',
    },
  },
  {
    id: 'hacienda',
    nombre: {
      es: 'Ministerio de Hacienda',
      en: 'Ministry of Finance',
    },
    nombreCorto: { es: 'Hacienda', en: 'Finance' },
    tipo: 'ministerio',
    url: 'https://www.hacienda.go.cr/',
    proyectosActivos: 2,
    resumen: {
      es: 'Detección de fraude fiscal con Microsoft Anomaly Detector — ₡8,000M recuperados en 2025. Asistente virtual para contribuyentes en Hacienda Digital.',
      en: 'Tax fraud detection with Microsoft Anomaly Detector — ₡8,000M recovered in 2025. Virtual taxpayer assistant inside Hacienda Digital.',
    },
  },
  {
    id: 'mep',
    nombre: {
      es: 'Ministerio de Educación Pública',
      en: 'Ministry of Public Education',
    },
    nombreCorto: { es: 'MEP', en: 'MEP' },
    tipo: 'ministerio',
    url: 'https://www.mep.go.cr/',
    proyectosActivos: 1,
    resumen: {
      es: 'Especialización técnica en IA con Intel en colegios técnicos profesionales. Primer país latinoamericano con IA como carrera técnica formal en secundaria.',
      en: 'Technical AI specialization with Intel in vocational high schools. First Latin American country with AI as a formal technical track in secondary education.',
    },
  },
  {
    id: 'micitt',
    nombre: {
      es: 'Ministerio de Ciencia, Innovación, Tecnología y Telecomunicaciones',
      en: 'Ministry of Science, Innovation, Technology and Telecommunications',
    },
    nombreCorto: { es: 'MICITT', en: 'MICITT' },
    tipo: 'ministerio',
    url: 'https://www.micitt.go.cr/',
    proyectosActivos: 1,
    resumen: {
      es: 'Estrategia Nacional de IA (ENIA) 2024-2027 — primera política nacional de IA de Centroamérica. LINC Labs: 16 laboratorios, +4,500 personas capacitadas, 70% participación femenina.',
      en: 'National AI Strategy (ENIA) 2024-2027 — first national AI policy in Central America. LINC Labs: 16 labs, +4,500 people trained, 70% female participation.',
    },
  },
];
