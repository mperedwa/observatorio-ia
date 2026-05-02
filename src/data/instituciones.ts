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
  descripcion?: Bilingual;
  lecciones?: Bilingual;
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
    descripcion: {
      es: 'Es la institución pública costarricense con la cartera más amplia de IA en producción: cuatro sistemas operativos en clasificación documental, predicción presupuestaria, protección de datos y análisis jurisprudencial. Publicó los Lineamientos Básicos para el uso de IA Generativa Autorizada en el Poder Judicial, que enmarcan a la IA como herramienta de apoyo, nunca sustituto del juicio legal.',
      en: 'The Costa Rican public institution with the broadest portfolio of AI in production: four live systems covering document classification, budget forecasting, data protection and case-law analysis. It published the Basic Guidelines for Authorized Generative AI Use, which frame AI as a support tool, never a substitute for legal judgment.',
    },
    lecciones: {
      es: 'El liderazgo del Poder Judicial no se explica por presupuesto IA dedicado, sino por especialización temprana (ML presupuestal desde 2019), alianzas con academia pública (UCR e Instituto de Investigaciones Jurídicas) y un marco propio de gobernanza publicado antes que cualquier ley nacional.',
      en: 'The Judicial Branch did not lead through a dedicated AI budget but through early specialization (budget ML since 2019), partnerships with public academia (UCR and the Institute of Legal Research) and its own governance framework published ahead of any national law.',
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
    descripcion: {
      es: 'Combina el dataset clínico más grande del país (EDUS, cobertura 100% de asegurados desde 2010) con un programa de formación en IA médica con el TEC y un piloto activo de IA en atención primaria. La pregunta abierta es cuándo se materializa la capa predictiva del EDUS, planificada pero sin cronograma público.',
      en: 'Combines the country\u2019s largest clinical dataset (EDUS, 100% member coverage since 2010) with a medical AI training program with TEC and an active primary-care pilot. The open question is when the EDUS predictive layer, planned but without a public timeline, will actually ship.',
    },
    lecciones: {
      es: 'La CCSS apuesta primero a capacidad humana interna (formación con TEC) y a cobertura territorial (EBAIS), no a comprar software de proveedor. Es un patrón de adopción más lento pero menos dependiente.',
      en: 'CCSS is betting first on internal human capacity (TEC training) and territorial coverage (EBAIS), rather than vendor software procurement. It is a slower but less dependency-prone adoption pattern.',
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
    descripcion: {
      es: 'Es la única institución del Estado con retorno fiscal medible y publicado de IA en 2025. Su modelo se apoya en facturación electrónica v4.4 ya consolidada y en una alianza con Microsoft Azure. Maneja además el único asistente virtual ciudadano operativo del gobierno central.',
      en: 'The only state institution with measurable, publicly reported fiscal returns from AI in 2025. Its model rides on the consolidated v4.4 e-invoicing infrastructure and a Microsoft Azure partnership. It also runs the only operational citizen-facing virtual assistant in the central government.',
    },
    lecciones: {
      es: 'Donde existe infraestructura digital previa (facturación electrónica), la IA produce retorno rápido. Donde no existe, no hay atajo: el caso Hacienda no se replica sin esa base.',
      en: 'Where prior digital infrastructure exists (e-invoicing), AI yields fast returns. Where it does not, there is no shortcut: the Hacienda case is not replicable without that foundation.',
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
    descripcion: {
      es: 'Cuenta con un currículo formal de tres años en machine learning, ética y aspectos legales de IA, iniciado en cuatro CTPs en 2023 con meta de expansión. Adicionalmente reportó 90,000 becas docentes en alfabetización digital con componente IA, gestionadas con CENECOOP.',
      en: 'Runs a formal 3-year curriculum on machine learning, ethics and legal aspects of AI, launched in four vocational schools in 2023 with an expansion target. It also reported 90,000 teacher scholarships in digital literacy with an AI component, managed with CENECOOP.',
    },
    lecciones: {
      es: 'El programa demuestra que CR puede sostener un hito regional con muy poco presupuesto público propio, apoyado en alianzas privadas. La fragilidad es que la sostenibilidad depende del socio: si Intel reduce presencia local, el currículo necesita un nuevo anclaje.',
      en: 'The program shows Costa Rica can sustain a regional milestone with very little dedicated public budget, leaning on private partnerships. The fragility is that sustainability depends on the partner: if Intel scales back its local presence, the curriculum needs a new anchor.',
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
    descripcion: {
      es: 'Es el rector formal de la política nacional de IA. Publicó la ENIA 2024-2027 (primera política de su tipo en Centroamérica) y opera la red LINC con 16 laboratorios distribuidos en las 7 provincias. La ENIA contempla un Centro Nacional de Excelencia en IA que aún no está operativo y no tiene presupuesto público asignado.',
      en: 'Formally leads national AI policy. Published ENIA 2024-2027 (first such policy in Central America) and operates the LINC network with 16 labs across the 7 provinces. ENIA envisions a National AI Center of Excellence that is not yet operational and has no allocated public budget.',
    },
    lecciones: {
      es: 'MICITT logra resultados de capacitación con cobertura territorial y equidad de género (70% participación femenina). Pero el brazo regulador y el rol coordinador previstos en la ENIA siguen vacantes. Es la institución con la mayor distancia entre lo prometido en estrategia y lo entregado en operación.',
      en: 'MICITT delivers training results with territorial coverage and gender equity (70% female participation). But the regulatory and coordinating role envisioned in ENIA remains vacant. It is the institution with the largest gap between what its strategy promises and what its operations deliver.',
    },
  },
];
