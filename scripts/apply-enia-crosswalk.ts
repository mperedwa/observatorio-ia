import { readFileSync, writeFileSync } from 'node:fs';
import type { Bilingual } from '../src/i18n/config';
import type {
  EstadoCruceEnia,
  EstadoEjecucionEnia,
  EvidenciaExternaEnia,
  IntervencionEnia,
  InventarioEnia,
  RecomendacionEditorialEnia,
  ResultadoEnia,
  TipoIntervencionEnia,
} from '../src/data/eniaAcciones';

const ENIA_URL = new URL('../src/data/json/eniaAcciones.json', import.meta.url);
const PROYECTOS_URL = new URL('../src/data/json/proyectos.json', import.meta.url);
const FECHA_REVISION = '2026-08-21';

type CruceAnterior = Omit<IntervencionEnia['cruceCatalogo'], 'fundamento'> & {
  fundamento?: Bilingual;
};

type IntervencionAnterior = Omit<IntervencionEnia, 'cruceCatalogo'> & {
  cruceCatalogo: CruceAnterior;
};

type ResultadoAnterior = Omit<ResultadoEnia, 'intervenciones'> & {
  intervenciones: IntervencionAnterior[];
};

type InventarioAnterior = Omit<InventarioEnia, 'schemaVersion' | 'resultados'> & {
  schemaVersion: number;
  resultados: ResultadoAnterior[];
};

interface DecisionCruce {
  estado: EstadoCruceEnia;
  proyectoIds: string[];
  fundamento: Bilingual;
  intervencionCanonicaId?: string;
  estadoEjecucion?: EstadoEjecucionEnia;
  faseRealVerificada?: IntervencionEnia['faseRealVerificada'];
  evidenciasExternas?: EvidenciaExternaEnia[];
  notasEditoriales?: Bilingual;
  tipoIntervencion?: TipoIntervencionEnia;
  recomendacionEditorial?: RecomendacionEditorialEnia;
}

interface Duplicado {
  intervencionCanonicaId: string;
  proyectoIds?: string[];
  estadoEjecucion?: EstadoEjecucionEnia;
  faseRealVerificada?: IntervencionEnia['faseRealVerificada'];
}

function bilingue(es: string, en: string): Bilingual {
  return { es, en };
}

function decision(
  estado: EstadoCruceEnia,
  proyectoIds: string[],
  es: string,
  en: string,
  campos: Omit<
    DecisionCruce,
    'estado' | 'proyectoIds' | 'fundamento'
  > = {},
): DecisionCruce {
  return {
    estado,
    proyectoIds,
    fundamento: bilingue(es, en),
    ...campos,
  };
}

const decisionesEspecificas: Record<string, DecisionCruce> = {
  'enia-2-1-1-03': decision(
    'coincidencia-parcial',
    ['micitt-agroboost'],
    'AgroBoost coincide en institución, público meta y transferencia de tecnologías de frontera al sector agrícola, pero el Plan no lo identifica por nombre ni permite demostrar que sea toda la intervención.',
    'AgroBoost matches the institution, target population and transfer of frontier technologies to agriculture, but the Plan does not name it or establish that it represents the entire intervention.',
    {
      estadoEjecucion: 'parcialmente-verificado',
      faseRealVerificada: 'operativo',
    },
  ),
  'enia-2-1-3-02': decision(
    'mapeado-exacto',
    ['micitt-linc'],
    'La fila nombra expresamente a LINC y el catálogo contiene la misma red de Laboratorios de Innovación Comunitaria. La operación general está verificada; no lo está el cumplimiento íntegro de la meta municipal de esta fila.',
    'The row expressly names LINC, and the catalogue contains the same Community Innovation Labs network. General operation is verified; full delivery of this row’s municipal target is not.',
    {
      estadoEjecucion: 'parcialmente-verificado',
      faseRealVerificada: 'operativo',
    },
  ),
  'enia-2-2-2-01': decision(
    'coincidencia-parcial',
    ['micitt-agroboost'],
    'AgroBoost aporta evidencia de asistencia y transferencia tecnológica a unidades productivas agrícolas, una parte del alcance amplio para emprendimientos, PYMES y PYMPAS. No hay identidad documental con toda la fila.',
    'AgroBoost provides evidence of assistance and technology transfer to agricultural production units, part of the broader scope for ventures, SMEs and small agricultural producers. Documentary identity with the full row is not established.',
    {
      estadoEjecucion: 'parcialmente-verificado',
      faseRealVerificada: 'operativo',
    },
  ),
  'enia-2-2-4-01': decision(
    'mapeado-exacto',
    ['micitt-linc'],
    'La intervención se refiere por nombre a los LINC y el catálogo documenta esa misma red. La fuente externa verifica operación y formación, aunque no cada transferencia tecnológica prevista por la meta.',
    'The intervention names LINC, and the catalogue documents that same network. External evidence verifies operation and training, although not every technology transfer anticipated by the target.',
    {
      estadoEjecucion: 'parcialmente-verificado',
      faseRealVerificada: 'operativo',
    },
  ),
  'enia-4-1-2-13': decision(
    'coincidencia-parcial',
    ['ccss-tec-formacion'],
    'El programa TEC-CCSS confirma una acción de formación institucional en IA y dos prototipos formativos, pero no se encontró una fuente que lo identifique como la ejecución completa de este compromiso amplio de capacitación.',
    'The TEC-CCSS program confirms an institutional AI training action and two training prototypes, but no source identifies it as full delivery of this broad training commitment.',
    {
      estadoEjecucion: 'parcialmente-verificado',
      faseRealVerificada: 'finalizado',
    },
  ),
  'enia-4-1-3-05': decision(
    'nuevo-con-evidencia',
    [],
    'No existe aún una ficha equivalente en el catálogo. El INAMU documenta que la aplicación Ela está disponible, utiliza inteligencia artificial y brinda atención, orientación y referencias a mujeres durante las 24 horas.',
    'No equivalent catalogue record exists yet. INAMU documents that the Ela application is available, uses artificial intelligence and provides women with support, guidance and referrals around the clock.',
    {
      estadoEjecucion: 'verificado',
      faseRealVerificada: 'operativo',
      evidenciasExternas: [
        {
          id: 'inamu-ela-ia-oficial',
          titulo: bilingue(
            'Aplicación móvil Ela con inteligencia artificial',
            'Ela mobile application with artificial intelligence',
          ),
          url: 'https://www.inamu.go.cr/inteligencia-artificial',
          publicador: 'Instituto Nacional de las Mujeres',
          fechaConsulta: FECHA_REVISION,
          respalda: ['existencia', 'ejecucion', 'tecnica-ia', 'uso-operativo'],
        },
        {
          id: 'inamu-ela-terminos-privacidad',
          titulo: bilingue(
            'Términos, condiciones de uso y privacidad de la aplicación Ela',
            'Ela application terms, conditions of use and privacy notice',
          ),
          url: 'https://elainamu.inamu.go.cr/assets/terminos_condiciones',
          publicador: 'Instituto Nacional de las Mujeres',
          fechaConsulta: FECHA_REVISION,
          respalda: ['existencia', 'uso-operativo', 'gobernanza'],
        },
      ],
      notasEditoriales: bilingue(
        'La ficha técnica institucional identifica GPT-4 Turbo y búsqueda de archivos. La aplicación trata datos de registro y socioeconómicos, y puede compartir geolocalización con el 9-1-1 cuando la persona usuaria activa esa función. No se localizaron métricas públicas de uso, precisión o derivaciones.',
        'The institutional technical page identifies GPT-4 Turbo and file search. The application processes registration and socioeconomic data and can share geolocation with emergency services when the user activates that function. No public usage, accuracy or referral metrics were found.',
      ),
    },
  ),
  'enia-4-1-3-10': decision(
    'coincidencia-parcial',
    ['hacienda-anomaly', 'hacienda-asistente'],
    'El catálogo documenta una solución analítica de detección de anomalías y un asistente tributario en operación. Ambos cubren partes de la formulación amplia, pero la fila no los nombra ni prueba todas las funcionalidades previstas.',
    'The catalogue documents an anomaly-detection analytics solution and an operating tax assistant. Both cover parts of the broad wording, but the row does not name them or prove every planned function.',
    {
      estadoEjecucion: 'parcialmente-verificado',
      faseRealVerificada: 'operativo',
    },
  ),
  'enia-4-1-3-15': decision(
    'coincidencia-parcial',
    [
      'ccss-aida',
      'ccss-lidia',
      'ccss-redimed',
      'ccss-depuracion-listas',
      'ccss-logistica-ia-abastecimiento',
    ],
    'La fila describe una cartera institucional amplia. Las cinco fichas relacionadas demuestran capacidades o soluciones que cubren partes del alcance, pero ninguna fuente permite atribuirles el porcentaje base de 67 ni tratarlas como una sola iniciativa.',
    'The row describes a broad institutional portfolio. The five related records demonstrate capabilities or solutions covering parts of that scope, but no source supports attributing the 67 baseline percentage to them or treating them as one initiative.',
    {
      estadoEjecucion: 'parcialmente-verificado',
    },
  ),
  'enia-4-1-3-16': decision(
    'coincidencia-parcial',
    ['ccss-lidia'],
    'LIDIA confirma modelos predictivos clínicos sobre EDUS y coincide con una parte sustantiva del objetivo. La fila es más amplia: incluye patrones epidemiológicos, patologías y comportamientos, y no nombra a LIDIA.',
    'LIDIA confirms clinical predictive models using EDUS and matches a substantial part of the objective. The row is broader: it includes epidemiological patterns, pathologies and service behavior, and does not name LIDIA.',
    {
      estadoEjecucion: 'parcialmente-verificado',
      faseRealVerificada: 'piloto',
    },
  ),
  'enia-4-1-3-18': decision(
    'coincidencia-parcial',
    ['ccss-tec-formacion'],
    'El programa TEC-CCSS verifica formación y prototipos en IA, por lo que materializa parte de la fila. No demuestra la estrategia institucional completa de tecnologías emergentes, automatización y programación visual.',
    'The TEC-CCSS program verifies AI training and prototypes, so it delivers part of the row. It does not establish the full institutional strategy for emerging technologies, automation and visual programming.',
    {
      estadoEjecucion: 'parcialmente-verificado',
      faseRealVerificada: 'finalizado',
    },
  ),
  'enia-4-1-3-24': decision(
    'nuevo-con-evidencia',
    [],
    'No existe aún una ficha equivalente en el catálogo. Un boletín oficial del INS anterior al Plan confirma IA en reclamaciones e indemnizaciones de gastos médicos, automatización de flujos y resultados operativos; el Plan aporta una segunda referencia institucional al mismo proceso.',
    'No equivalent catalogue record exists yet. An official INS bulletin predating the Plan confirms AI in medical-expense claims and reimbursements, workflow automation and operating results; the Plan provides a second institutional reference to the same process.',
    {
      estadoEjecucion: 'verificado',
      faseRealVerificada: 'operativo',
      evidenciasExternas: [
        {
          id: 'ins-reclamos-medicos-ia-2024',
          titulo: bilingue(
            'INS revoluciona su seguro de gastos médicos con inteligencia artificial y agilidad',
            'INS transforms its medical-expense insurance with artificial intelligence and agile methods',
          ),
          url: 'https://www.grupoins.com/media/pyfkpyjz/bolet%C3%ADn-insignia-diciembre-2024.pdf',
          publicador: 'Instituto Nacional de Seguros',
          fechaConsulta: FECHA_REVISION,
          respalda: ['existencia', 'ejecucion', 'uso-operativo', 'resultado'],
        },
      ],
      notasEditoriales: bilingue(
        'El INS reporta cerca de 10.000 solicitudes mensuales, una reducción del tiempo promedio de pago de entre 12 y 13 días a entre 6 y 7 días, y un nivel de eficiencia de 72%. La fuente no publica arquitectura, criterios de clasificación, revisión humana ni métricas de error.',
        'INS reports about 10,000 monthly requests, a reduction in average payment time from 12-13 to 6-7 days, and a 72% efficiency level. The source does not publish the architecture, classification criteria, human-review process or error metrics.',
      ),
    },
  ),
  'enia-5-2-2-01': decision(
    'mapeado-exacto',
    ['micitt-linc'],
    'La fila identifica expresamente a LINC como medio para capacitar población y el catálogo documenta la misma red en operación. La evidencia no permite verificar todas las alianzas o metas futuras.',
    'The row expressly identifies LINC as a vehicle for public training, and the catalogue documents the same operating network. The evidence does not verify every partnership or future target.',
    {
      estadoEjecucion: 'parcialmente-verificado',
      faseRealVerificada: 'operativo',
    },
  ),
  'enia-5-2-3-02': decision(
    'coincidencia-parcial',
    ['mep-intel'],
    'La especialidad MEP-Intel demuestra incorporación curricular de IA en educación técnica secundaria. La fila abarca primaria y secundaria académica de forma más amplia, por lo que no se considera identidad exacta.',
    'The MEP-Intel specialization demonstrates AI curriculum adoption in technical secondary education. The row more broadly covers primary and academic secondary education, so it is not treated as an exact identity.',
    {
      estadoEjecucion: 'parcialmente-verificado',
      faseRealVerificada: 'operativo',
    },
  ),
  'enia-5-2-5-01': decision(
    'mapeado-exacto',
    ['mep-intel'],
    'El objetivo corresponde a la especialidad técnica en inteligencia artificial del MEP, documentada en el catálogo con inicio en cuatro colegios técnicos profesionales.',
    'The objective corresponds to MEP’s technical specialization in artificial intelligence, documented in the catalogue as having started in four technical vocational schools.',
    {
      estadoEjecucion: 'verificado',
      faseRealVerificada: 'operativo',
    },
  ),
  'enia-6-1-2-01': decision(
    'coincidencia-parcial',
    ['cenat-lania'],
    'LaNIA comparte la función de capacitación, sensibilización y desarrollo de iniciativas de alto impacto, pero la evidencia disponible no demuestra que sea el Centro Nacional de Excelencia definido por esta fila ni que esté operativo.',
    'LaNIA shares the training, awareness and high-impact initiative-development function, but available evidence does not establish that it is the National Center of Excellence defined by this row or that it is operating.',
    {
      estadoEjecucion: 'no-verificado',
      faseRealVerificada: 'planificado',
    },
  ),
};

const duplicados: Record<string, Duplicado> = {
  'enia-3-1-1-04': {
    intervencionCanonicaId: 'enia-2-2-1-02',
  },
  'enia-3-2-1-01': {
    intervencionCanonicaId: 'enia-2-1-1-03',
    proyectoIds: ['micitt-agroboost'],
    estadoEjecucion: 'parcialmente-verificado',
    faseRealVerificada: 'operativo',
  },
  'enia-4-1-2-01': {
    intervencionCanonicaId: 'enia-2-1-1-01',
  },
  'enia-4-1-3-14': {
    intervencionCanonicaId: 'enia-4-1-3-05',
    estadoEjecucion: 'verificado',
    faseRealVerificada: 'operativo',
  },
  'enia-4-1-3-21': {
    intervencionCanonicaId: 'enia-4-1-3-15',
    proyectoIds: [
      'ccss-aida',
      'ccss-lidia',
      'ccss-redimed',
      'ccss-depuracion-listas',
      'ccss-logistica-ia-abastecimiento',
    ],
    estadoEjecucion: 'parcialmente-verificado',
  },
  'enia-4-1-3-22': {
    intervencionCanonicaId: 'enia-4-1-3-18',
    proyectoIds: ['ccss-tec-formacion'],
    estadoEjecucion: 'parcialmente-verificado',
    faseRealVerificada: 'finalizado',
  },
  'enia-4-1-3-23': {
    intervencionCanonicaId: 'enia-4-1-3-19',
  },
  'enia-4-1-3-30': {
    intervencionCanonicaId: 'enia-4-1-3-16',
    proyectoIds: ['ccss-lidia'],
    estadoEjecucion: 'parcialmente-verificado',
    faseRealVerificada: 'piloto',
  },
  'enia-5-1-3-04': {
    intervencionCanonicaId: 'enia-5-1-3-03',
  },
};

const notasEspecificas: Record<string, Bilingual> = {
  'enia-4-1-3-04': bilingue(
    'El MTSS mantiene un chat de atención desde 2018, pero las fuentes oficiales localizadas no lo describen como IA ni demuestran la creación del chatbot previsto por esta fila.',
    'MTSS has operated a support chat since 2018, but the official sources found do not describe it as AI or establish creation of the chatbot anticipated by this row.',
  ),
  'enia-4-1-3-06': bilingue(
    'No se localizó evidencia oficial posterior que confirme diseño, aprobación o uso de los kioscos interactivos del PANI.',
    'No later official evidence was found confirming the design, approval or use of PANI’s interactive kiosks.',
  ),
  'enia-4-1-3-07': bilingue(
    'No se localizó una herramienta oficial de CNE que atribuya a IA la generación de preevaluaciones de amenaza.',
    'No official CNE tool was found that attributes generation of preliminary hazard assessments to AI.',
  ),
  'enia-4-1-3-12': bilingue(
    'Las fuentes oficiales revisadas confirman análisis de inteligencia, escáneres y coordinación policial, pero no identifican una herramienta concreta de IA desplegada en las unidades especiales.',
    'The official sources reviewed confirm intelligence analysis, scanners and police coordination, but do not identify a specific deployed AI tool in the special units.',
  ),
  'enia-4-1-3-19': bilingue(
    'No se localizó evidencia externa del componente de auditoría automatizada con IA sobre SIES/MISE. La fila reaparece con redacción equivalente en enia-4-1-3-23.',
    'No external evidence was found for the AI-based automated-audit component over SIES/MISE. The row reappears with equivalent wording in enia-4-1-3-23.',
  ),
  'enia-4-1-3-20': bilingue(
    'Por su posible efecto en perfiles y beneficios económicos, esta intervención requiere evidencia sobre variables, base jurídica, revisión humana, error y mecanismo de impugnación antes de catalogarse como implementada.',
    'Because it may affect profiles and financial benefits, this intervention requires evidence on variables, legal basis, human review, error and appeal mechanisms before being catalogued as implemented.',
  ),
  'enia-4-1-3-25': bilingue(
    'La investigación documental no encontró formalización, convenio, contratación, piloto ni resultado ICE-OIJ. OIJ-TEC y SUPERCOP son iniciativas distintas y no deben fusionarse con esta fila. El Plan reutiliza además el mismo indicador y metas en enia-5-1-1-02 para un objetivo educativo diferente.',
    'Documentary research found no formalization, agreement, procurement, pilot or result for ICE-OIJ. OIJ-TEC and SUPERCOP are separate initiatives and must not be merged with this row. The Plan also reuses the same indicator and targets in enia-5-1-1-02 for a different education objective.',
  ),
  'enia-4-1-3-26': bilingue(
    'No se localizó evidencia oficial posterior que confirme IA en reclutamiento y selección de AyA. La política y los procedimientos de selección preexistentes no demuestran esta intervención.',
    'No later official evidence was found confirming AI in AyA recruitment and selection. Pre-existing selection policy and procedures do not establish this intervention.',
  ),
  'enia-4-1-3-27': bilingue(
    'El objetivo es apoyo para análisis de precios, revisión documental e informes; el Plan no delega en IA la adjudicación ni la aceptación o rechazo de ofertas. No se localizó evidencia externa de implementación.',
    'The objective is support for price analysis, document review and reports; the Plan does not delegate award, acceptance or rejection of bids to AI. No external implementation evidence was found.',
  ),
  'enia-4-1-3-28': bilingue(
    'AyA documentó en 2020 el proyecto RANC-EE y una medida futura de detección de fugas con IA. Esa fuente confirma el proyecto de agua, pero no la ejecución del flujo específico de análisis e informes descrito aquí ni el uso de IA en 2026.',
    'In 2020 AyA documented the RANC-EE project and a future AI-enabled leak-detection measure. That source confirms the water project, but not execution of the specific analysis-and-reporting workflow described here or AI use in 2026.',
  ),
  'enia-4-1-3-29': bilingue(
    'RPA automatiza tareas mediante reglas y no constituye por sí sola evidencia de inteligencia artificial. La fila se conserva como automatización digital.',
    'RPA automates tasks through rules and is not, by itself, evidence of artificial intelligence. The row remains classified as digital automation.',
  ),
  'enia-5-1-1-02': bilingue(
    'La fila describe análisis estadístico para ubicar espacios de educación virtual, no un sistema de IA. El indicador y las metas 0/30/65 son idénticos a los de predicción de homicidios en enia-4-1-3-25, una anomalía de la fuente que no se corrige por inferencia.',
    'The row describes statistical analysis to locate virtual-education spaces, not an AI system. Its indicator and 0/30/65 targets are identical to those for homicide prediction in enia-4-1-3-25, a source anomaly that is not corrected by inference.',
  ),
};

const excepcionesEniaSolamente = new Set([
  'enia-6-1-3-02',
  'enia-6-1-3-03',
]);

const reclasificacionesTipo: Partial<Record<string, TipoIntervencionEnia>> = {
  'enia-4-1-4-02': 'solucion-ia-declarada',
};

const etiquetaTipo: Record<TipoIntervencionEnia, Bilingual> = {
  'politica-gobernanza': bilingue(
    'política o gobernanza',
    'policy or governance',
  ),
  'capacitacion-formacion': bilingue(
    'capacitación o formación',
    'training or education',
  ),
  'investigacion-diagnostico': bilingue(
    'investigación o diagnóstico',
    'research or diagnostic work',
  ),
  'articulacion-financiamiento': bilingue(
    'articulación o financiamiento',
    'coordination or funding',
  ),
  'infraestructura-habilitante': bilingue(
    'infraestructura habilitante',
    'enabling infrastructure',
  ),
  'solucion-ia-declarada': bilingue(
    'solución de IA declarada',
    'declared AI solution',
  ),
  'automatizacion-digital': bilingue(
    'automatización digital',
    'digital automation',
  ),
  'por-determinar': bilingue('acción por determinar', 'undetermined action'),
};

function decisionPorDefecto(
  intervencion: IntervencionAnterior,
  tipoIntervencion: TipoIntervencionEnia,
): DecisionCruce {
  const esSolucionDeclarada =
    tipoIntervencion === 'solucion-ia-declarada' ||
    excepcionesEniaSolamente.has(intervencion.id);

  if (esSolucionDeclarada) {
    return decision(
      'enia-solamente',
      [],
      'La fila declara una solución o componente de IA, pero al corte solo se verificó su inclusión en el Plan: no tiene coincidencia suficiente en el catálogo ni evidencia externa de ejecución.',
      'The row declares an AI solution or component, but at the cutoff only its inclusion in the Plan was verified: it has neither a sufficient catalogue match nor external execution evidence.',
    );
  }

  const etiqueta = etiquetaTipo[tipoIntervencion];
  return decision(
    'no-es-sistema-ia',
    [],
    `La fila corresponde a ${etiqueta.es}; es relevante para el ecosistema, pero no describe por sí misma la implementación de un sistema de IA.`,
    `The row concerns ${etiqueta.en}; it is relevant to the ecosystem but does not itself describe implementation of an AI system.`,
  );
}

function decisionDuplicado(id: string, duplicado: Duplicado): DecisionCruce {
  return decision(
    'posible-duplicado',
    duplicado.proyectoIds ?? [],
    `La redacción, institución, indicador o metas reproducen sustancialmente la fila ${duplicado.intervencionCanonicaId}. Se conserva como registro fuente y se remite a esa fila como decisión canónica.`,
    `The wording, institution, indicator or targets substantially reproduce row ${duplicado.intervencionCanonicaId}. It is retained as a source record and points to that row as the canonical decision.`,
    {
      intervencionCanonicaId: duplicado.intervencionCanonicaId,
      estadoEjecucion: duplicado.estadoEjecucion,
      faseRealVerificada: duplicado.faseRealVerificada,
      notasEditoriales: notasEspecificas[id],
    },
  );
}

const inventario = JSON.parse(
  readFileSync(ENIA_URL, 'utf8'),
) as InventarioAnterior;
const proyectoIds = new Set(
  (JSON.parse(readFileSync(PROYECTOS_URL, 'utf8')) as Array<{ id: string }>).map(
    (proyecto) => proyecto.id,
  ),
);
const intervenciones = inventario.resultados.flatMap(
  (resultado) => resultado.intervenciones,
);
const intervencionIds = new Set(intervenciones.map((intervencion) => intervencion.id));

if (intervenciones.length !== 129 || intervencionIds.size !== 129) {
  throw new Error(
    `El script está fijado a 129 intervenciones únicas; recibió ${intervenciones.length} filas y ${intervencionIds.size} IDs.`,
  );
}

for (const id of [
  ...Object.keys(decisionesEspecificas),
  ...Object.keys(duplicados),
  ...Object.keys(notasEspecificas),
  ...Object.keys(reclasificacionesTipo),
]) {
  if (!intervencionIds.has(id)) {
    throw new Error(`La matriz de decisiones referencia una intervención inexistente: ${id}`);
  }
}

for (const [id, duplicado] of Object.entries(duplicados)) {
  if (!intervencionIds.has(duplicado.intervencionCanonicaId)) {
    throw new Error(
      `${id} referencia una fila canónica inexistente: ${duplicado.intervencionCanonicaId}`,
    );
  }
}

const resultados = inventario.resultados.map((resultado) => ({
  ...resultado,
  intervenciones: resultado.intervenciones.map((intervencion): IntervencionEnia => {
    const {
      evidenciasExternas: _evidenciasAnteriores,
      faseRealVerificada: _faseAnterior,
      notasEditoriales: _notasAnteriores,
      ...base
    } = intervencion;
    const tipoIntervencion =
      reclasificacionesTipo[intervencion.id] ?? intervencion.tipoIntervencion;
    const decisionFinal = duplicados[intervencion.id]
      ? decisionDuplicado(intervencion.id, duplicados[intervencion.id])
      : decisionesEspecificas[intervencion.id] ??
        decisionPorDefecto(intervencion, tipoIntervencion);
    const notasEditoriales =
      decisionFinal.notasEditoriales ?? notasEspecificas[intervencion.id];

    for (const proyectoId of decisionFinal.proyectoIds) {
      if (!proyectoIds.has(proyectoId)) {
        throw new Error(
          `${intervencion.id} referencia un proyecto inexistente: ${proyectoId}`,
        );
      }
    }

    return {
      ...base,
      tipoIntervencion: decisionFinal.tipoIntervencion ?? tipoIntervencion,
      estadoEjecucion: decisionFinal.estadoEjecucion ?? 'no-verificado',
      cruceCatalogo: {
        estado: decisionFinal.estado,
        proyectoIds: decisionFinal.proyectoIds,
        ...(decisionFinal.intervencionCanonicaId
          ? { intervencionCanonicaId: decisionFinal.intervencionCanonicaId }
          : {}),
        fundamento: decisionFinal.fundamento,
      },
      ...(decisionFinal.evidenciasExternas
        ? { evidenciasExternas: decisionFinal.evidenciasExternas }
        : {}),
      ...(decisionFinal.faseRealVerificada
        ? { faseRealVerificada: decisionFinal.faseRealVerificada }
        : {}),
      ...(notasEditoriales ? { notasEditoriales } : {}),
      recomendacionEditorial:
        decisionFinal.recomendacionEditorial ??
        (tipoIntervencion === 'solucion-ia-declarada' ||
        excepcionesEniaSolamente.has(intervencion.id)
          ? 'investigar-como-seguimiento'
          : base.recomendacionEditorial),
      fechaUltimaRevision: FECHA_REVISION,
    };
  }),
}));

const salida: InventarioEnia = {
  ...inventario,
  schemaVersion: 2,
  fechaCorte: FECHA_REVISION,
  resultados,
};

writeFileSync(ENIA_URL, `${JSON.stringify(salida, null, 2)}\n`);

const conteos = Object.fromEntries(
  salida.resultados
    .flatMap((resultado) => resultado.intervenciones)
    .reduce((acumulado, intervencion) => {
      const estado = intervencion.cruceCatalogo.estado;
      acumulado.set(estado, (acumulado.get(estado) ?? 0) + 1);
      return acumulado;
    }, new Map<EstadoCruceEnia, number>()),
);

console.log(
  `Crosswalk ENIA aplicado a 129 intervenciones (${JSON.stringify(conteos)}).`,
);
