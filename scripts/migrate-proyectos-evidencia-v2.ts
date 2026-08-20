import { readFileSync, writeFileSync } from 'node:fs';
import type { Bilingual } from '../src/i18n/config';
import type { Proyecto } from '../src/data/proyectos';
import {
  MODELO_EVIDENCIA_VERSION,
  type DimensionEvidencia,
  type EstadoEvaluacion,
  type EvaluacionDimension,
  type EvaluacionEvidencia,
  type FuenteProyecto,
  type IniciativaEvidenciaV2,
} from '../src/data/modelo-evidencia';

const DATA_URL = new URL('../src/data/json/proyectos.json', import.meta.url);
const FECHA_CORTE = '2026-08-19';
const PROXIMA_REVISION = '2026-11-19';

type CampoLegacy =
  | 'titulo'
  | 'estado'
  | 'descripcion'
  | 'resultado'
  | 'contexto'
  | 'desde'
  | 'fuenteUrl';

interface Migracion {
  evidencia: IniciativaEvidenciaV2;
  legacy?: Partial<Pick<Proyecto, CampoLegacy>>;
  quitarResultado?: boolean;
}

type FuenteInput = Omit<FuenteProyecto, 'titulo' | 'fechaConsulta'> & {
  tituloEs: string;
  tituloEn: string;
};

type EvaluacionInput = Partial<
  Record<DimensionEvidencia, [EstadoEvaluacion, ...string[]]>
>;

function bilingue(es: string, en: string): Bilingual {
  return { es, en };
}

function fuente(input: FuenteInput): FuenteProyecto {
  const { tituloEs, tituloEn, ...campos } = input;
  return {
    ...campos,
    titulo: bilingue(tituloEs, tituloEn),
    fechaConsulta: FECHA_CORTE,
  };
}

function dimension(
  valor?: [EstadoEvaluacion, ...string[]],
): EvaluacionDimension {
  if (!valor) return { estado: 'no-determinado', fuenteIds: [] };
  const [estado, ...fuenteIds] = valor;
  return { estado, fuenteIds };
}

function evaluar(input: EvaluacionInput): EvaluacionEvidencia {
  return {
    existencia: dimension(input.existencia),
    ejecucion: dimension(input.ejecucion),
    tecnicaIA: dimension(input.tecnicaIA),
    usoOperativo: dimension(input.usoOperativo),
    resultados: dimension(input.resultados),
    gobernanza: dimension(input.gobernanza),
  };
}

const migraciones = {
  'pj-clasificacion-cobros': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'sistema-ia',
      estadoCatalogo: 'verificado',
      faseImplementacion: 'piloto',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'pj-clasificador-oficial'],
        ejecucion: ['confirmado', 'pj-clasificador-oficial'],
        tecnicaIA: ['confirmado', 'pj-clasificador-oficial'],
        usoOperativo: ['confirmado', 'pj-clasificador-oficial'],
        resultados: ['confirmado', 'pj-clasificador-oficial'],
      }),
      fuentes: [
        fuente({
          id: 'pj-clasificador-oficial',
          tituloEs:
            'Poder Judicial implementa inteligencia artificial para disminuir circulante en materia cobratoria',
          tituloEn:
            'Judicial Branch implements artificial intelligence to reduce the debt-collection caseload',
          url: 'https://pj.poder-judicial.go.cr/index.php/component/content/article/760-poder-judicial-implementa-inteligencia-artificial-para-disminuir-circulante-en-materia-cobratoria',
          publicador: 'Poder Judicial de Costa Rica',
          tipoFuente: 'primaria-oficial',
          respalda: [
            'existencia',
            'objetivo-declarado',
            'ejecucion',
            'tecnica-ia',
            'uso-operativo',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2023',
      fechaInicioPiloto: '2023',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Clasificar documentos que ingresan al Juzgado Especializado de Cobro Judicial de Pérez Zeledón para agilizar su tramitación.',
        'Classify documents received by the Specialized Debt Collection Court of Pérez Zeledón to speed up processing.',
      ),
      resultadosVerificados: [
        {
          id: 'mejora-tramitacion-reportada',
          texto: bilingue(
            'El Poder Judicial reporta mayor agilidad de procesamiento y una reducción del circulante tras dos años del piloto.',
            'The Judicial Branch reports faster processing and a lower caseload after two years of the pilot.',
          ),
          fuenteIds: ['pj-clasificador-oficial'],
        },
      ],
      datosConocidos: [
        bilingue(
          'La fuente institucional denomina la iniciativa como plan piloto y confirma el uso de inteligencia artificial.',
          'The institutional source calls the initiative a pilot plan and confirms the use of artificial intelligence.',
        ),
      ],
      datosNoDeterminados: [
        bilingue(
          'No se localizaron métricas públicas del volumen de documentos procesados atribuibles a este clasificador.',
          'No public metrics were found for the volume of documents processed by this classifier.',
        ),
      ],
    },
    legacy: {
      estado: 'piloto',
      descripcion: bilingue(
        'Plan piloto del Poder Judicial para clasificar automáticamente los documentos que ingresan al Juzgado Especializado de Cobro Judicial de Pérez Zeledón. La fuente oficial confirma el uso de inteligencia artificial y reporta mejoras en la agilidad de la tramitación.',
        'Judicial Branch pilot plan to automatically classify documents received by the Specialized Debt Collection Court of Pérez Zeledón. The official source confirms the use of artificial intelligence and reports faster case processing.',
      ),
      resultado: bilingue(
        'El Poder Judicial reporta mayor agilidad de procesamiento y una reducción del circulante tras dos años del piloto; no publica un volumen atribuible de documentos procesados.',
        'The Judicial Branch reports faster processing and a lower caseload after two years of the pilot; it does not publish an attributable document volume.',
      ),
      contexto: bilingue(
        'Se cataloga como piloto porque así lo denomina la fuente institucional. La cifra anterior de 1,302,899 documentos se retiró al no encontrarse respaldo atribuible a este sistema.',
        'It is catalogued as a pilot because that is how the institutional source describes it. The previous figure of 1,302,899 documents was removed because no source attributable to this system was found.',
      ),
    },
  },

  'pj-ml-presupuestal': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'sistema-ia',
      estadoCatalogo: 'verificado',
      faseImplementacion: 'operativo',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'pj-presupuesto-rendicion-2019'],
        ejecucion: ['confirmado', 'pj-presupuesto-rendicion-2019'],
        tecnicaIA: ['confirmado', 'pj-presupuesto-rendicion-2019'],
        usoOperativo: ['confirmado', 'pj-presupuesto-rendicion-2019'],
        resultados: ['confirmado', 'pj-presupuesto-rendicion-2019'],
      }),
      fuentes: [
        fuente({
          id: 'pj-presupuesto-rendicion-2019',
          tituloEs: 'Rendición de cuentas del Poder Judicial 2019',
          tituloEn: 'Judicial Branch 2019 accountability report',
          url: 'https://actualidadjudicial.poder-judicial.go.cr/vol251/discursos/dis3.html',
          publicador: 'Poder Judicial de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2020',
          respalda: [
            'existencia',
            'ejecucion',
            'tecnica-ia',
            'uso-operativo',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2019',
      fechaInicioOperacion: '2019',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Predecir el porcentaje de ejecución presupuestaria a partir de su comportamiento histórico.',
        'Predict the percentage of budget execution from its historical behavior.',
      ),
      resultadosVerificados: [
        {
          id: 'ahorro-reportado-2019',
          texto: bilingue(
            'La rendición de cuentas institucional reportó un ahorro superior a USD 379,965 asociado al modelo.',
            'The institutional accountability report stated savings above USD 379,965 associated with the model.',
          ),
          fuenteIds: ['pj-presupuesto-rendicion-2019'],
          fecha: '2019',
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'No se localizaron métricas públicas posteriores que actualicen el ahorro acumulado.',
          'No later public metrics updating cumulative savings were found.',
        ),
      ],
    },
    legacy: {
      descripcion: bilingue(
        'Modelo de aprendizaje automático utilizado por el Poder Judicial para predecir la ejecución presupuestaria según su comportamiento histórico. La rendición de cuentas institucional de 2019 documenta su uso y el ahorro asociado.',
        'Machine-learning model used by the Judicial Branch to predict budget execution from its historical behavior. The institution’s 2019 accountability report documents its use and associated savings.',
      ),
      resultado: bilingue(
        'Ahorro reportado superior a USD 379,965 en la rendición de cuentas de 2019.',
        'Reported savings above USD 379,965 in the 2019 accountability report.',
      ),
      contexto: bilingue(
        'La fuente primaria confirma la técnica, el uso y un resultado financiero reportado. No se extrapola ese monto a años posteriores.',
        'The primary source confirms the technique, use and a reported financial result. That amount is not extrapolated to later years.',
      ),
      fuenteUrl:
        'https://actualidadjudicial.poder-judicial.go.cr/vol251/discursos/dis3.html',
    },
  },

  'pj-nymiz': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'componente-ia',
      estadoCatalogo: 'verificado',
      faseImplementacion: 'operativo',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'pj-nymiz-implementacion'],
        ejecucion: ['confirmado', 'pj-nymiz-implementacion'],
        tecnicaIA: ['confirmado', 'pj-nymiz-implementacion'],
        usoOperativo: ['confirmado', 'pj-nymiz-adopcion-2025'],
        gobernanza: ['confirmado', 'pj-nymiz-implementacion'],
      }),
      fuentes: [
        fuente({
          id: 'pj-nymiz-implementacion',
          tituloEs:
            'Novedosa herramienta de inteligencia artificial se aplica en mejora de la protección de datos',
          tituloEn:
            'New artificial-intelligence tool is applied to improve data protection',
          url: 'https://pj.poder-judicial.go.cr/index.php/component/content/article/1186-novedosa-herramienta-de-inteligencia-artificial-se-aplica-en-mejora-de-la-proteccion-de-datos?Itemid=409&catid=8',
          publicador: 'Poder Judicial de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2024-03-20',
          respalda: [
            'existencia',
            'objetivo-declarado',
            'ejecucion',
            'tecnica-ia',
            'gobernanza',
          ],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado'],
        }),
        fuente({
          id: 'pj-nymiz-adopcion-2025',
          tituloEs:
            'Encuentro sobre beneficios y desafíos de la inteligencia artificial en la labor judicial',
          tituloEn:
            'Forum on the benefits and challenges of artificial intelligence in judicial work',
          url: 'https://pj.poder-judicial.go.cr/index.php/component/content/article/2076-encuentro-expone-sobre-los-beneficios-y-desafios-de-la-implementacion-de-la-inteligencia-artificial-en-la-labor-judicial?Itemid=409&catid=8',
          publicador: 'Poder Judicial de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2025-03-27',
          respalda: ['existencia', 'ejecucion', 'tecnica-ia', 'uso-operativo'],
          naturalezaAfirmacion: ['hecho'],
        }),
      ],
      fechaPrimeraEvidencia: '2024-03-20',
      fechaInicioOperacion: '2024',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Despersonalizar sentencias judiciales para proteger datos sensibles antes de su consulta o publicación.',
        'Depersonalize judicial rulings to protect sensitive data before consultation or publication.',
      ),
      datosConocidos: [
        bilingue(
          'El Poder Judicial confirma la implementación y el uso de Nymiz en procesos de despersonalización de sentencias.',
          'The Judicial Branch confirms the implementation and use of Nymiz in ruling-depersonalization processes.',
        ),
      ],
      datosNoDeterminados: [
        bilingue(
          'No se localizaron métricas institucionales públicas sobre ahorro de tiempo o volumen procesado.',
          'No public institutional metrics on time savings or processing volume were found.',
        ),
      ],
    },
    legacy: {
      desde: '2024',
      descripcion: bilingue(
        'Herramienta de inteligencia artificial implementada por el Poder Judicial para despersonalizar sentencias y proteger datos sensibles. La institución identifica a Nymiz como la plataforma utilizada y documenta su aplicación en el proceso.',
        'Artificial-intelligence tool implemented by the Judicial Branch to depersonalize rulings and protect sensitive data. The institution identifies Nymiz as the platform used and documents its application in the process.',
      ),
      contexto: bilingue(
        'El caso cuenta con respaldo institucional de implementación, técnica y finalidad de protección de datos. No se encontraron métricas públicas del Poder Judicial que sustenten la reducción de tiempo publicada anteriormente.',
        'The case has institutional evidence for implementation, technique and its data-protection purpose. No Judicial Branch public metrics were found to support the time reduction previously published.',
      ),
      fuenteUrl:
        'https://pj.poder-judicial.go.cr/index.php/component/content/article/1186-novedosa-herramienta-de-inteligencia-artificial-se-aplica-en-mejora-de-la-proteccion-de-datos?Itemid=409&catid=8',
    },
    quitarResultado: true,
  },

  'pj-sentencias-sala-iv': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'investigacion',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'operativo',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'ucr-sala-iv-2025'],
        ejecucion: ['confirmado', 'ucr-sala-iv-2025'],
        tecnicaIA: ['confirmado', 'ucr-sala-iv-2025'],
        usoOperativo: ['confirmado', 'ucr-sala-iv-2025'],
        resultados: ['confirmado', 'ucr-sala-iv-2025'],
      }),
      fuentes: [
        fuente({
          id: 'ucr-sala-iv-2025',
          tituloEs:
            'La inteligencia artificial analiza de manera automática sentencias de la Sala Cuarta',
          tituloEn:
            'Artificial intelligence automatically analyzes Constitutional Chamber rulings',
          url: 'https://www.ucr.ac.cr/noticias/2025/07/09/la-inteligencia-artificial-analiza-de-manera-automatica-sentencias-de-la-sala-cuarta.html',
          publicador: 'Universidad de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2025-07-09',
          respalda: [
            'existencia',
            'ejecucion',
            'tecnica-ia',
            'uso-operativo',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2020',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Facilitar investigaciones jurídicas mediante clasificación temática y análisis automatizado de sentencias de la Sala Constitucional.',
        'Support legal research through thematic classification and automated analysis of Constitutional Chamber rulings.',
      ),
      resultadosVerificados: [
        {
          id: 'corpus-sala-iv',
          texto: bilingue(
            'La herramienta de investigación tiene acceso a más de 500,000 sentencias emitidas entre 1989 y 2018.',
            'The research tool has access to more than 500,000 rulings issued between 1989 and 2018.',
          ),
          fuenteIds: ['ucr-sala-iv-2025'],
          fecha: '2025-07-09',
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'La herramienta no dispone de una interfaz pública de consulta.',
          'The tool does not have a public search interface.',
        ),
      ],
    },
    legacy: {
      desde: '2020',
      descripcion: bilingue(
        'Proyecto de investigación del Instituto de Investigaciones Jurídicas de la UCR y el Programa Estado de la Nación. Desde 2020 desarrolla una base estandarizada, clasificación temática y análisis automatizado de sentencias de la Sala Constitucional para investigación académica.',
        'Research project by UCR’s Legal Research Institute and the State of the Nation Program. Since 2020 it has developed a standardized database, thematic classification and automated analysis of Constitutional Chamber rulings for academic research.',
      ),
      resultado: bilingue(
        'La herramienta tiene acceso a más de 500,000 sentencias emitidas entre 1989 y 2018; no cuenta con una interfaz pública de consulta.',
        'The tool has access to more than 500,000 rulings issued between 1989 and 2018; it does not have a public search interface.',
      ),
      contexto: bilingue(
        'Se clasifica como investigación y no como adopción operativa del Poder Judicial: su uso documentado corresponde al análisis académico de jurisprudencia.',
        'It is classified as research rather than operational adoption by the Judicial Branch: its documented use is academic analysis of case law.',
      ),
    },
  },

  'pj-giro-continuo': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'digitalizacion-no-ia',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'operativo',
      estadoIA: 'no-determinada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'pj-giro-continuo-2024'],
        ejecucion: ['confirmado', 'pj-giro-continuo-2024'],
        usoOperativo: ['confirmado', 'pj-giro-continuo-2024'],
        resultados: ['confirmado', 'pj-giro-continuo-2024'],
      }),
      fuentes: [
        fuente({
          id: 'pj-giro-continuo-2024',
          tituloEs: 'Sistema de Giro Continuo automatiza depósitos judiciales',
          tituloEn: 'Continuous Disbursement System automates judicial deposits',
          url: 'https://actualidadjudicial.poder-judicial.go.cr/vol294/noticias_judiciales/nj4-294.html',
          publicador: 'Poder Judicial de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2025',
          respalda: [
            'existencia',
            'ejecucion',
            'uso-operativo',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2024',
      fechaInicioOperacion: '2024',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Automatizar giros de depósitos judiciales de menor cuantía.',
        'Automate lower-value judicial deposit disbursements.',
      ),
      resultadosVerificados: [
        {
          id: 'giros-2024',
          texto: bilingue(
            'El Poder Judicial reportó 223,154 giros por ₡5,245 millones durante 2024.',
            'The Judicial Branch reported 223,154 disbursements totaling ₡5.245 billion during 2024.',
          ),
          fuenteIds: ['pj-giro-continuo-2024'],
          fecha: '2024',
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'La fuente oficial describe automatización, pero no identifica una técnica de inteligencia artificial.',
          'The official source describes automation but does not identify an artificial-intelligence technique.',
        ),
      ],
      relaciones: [
        {
          iniciativaId: 'pj-clasificacion-cobros',
          tipo: 'relacion-no-acreditada',
          nota: bilingue(
            'No se encontró evidencia primaria que confirme que Giro Continuo dependa del clasificador documental.',
            'No primary evidence was found confirming that Continuous Disbursement depends on the document classifier.',
          ),
        },
      ],
    },
    legacy: {
      descripcion: bilingue(
        'Sistema del Poder Judicial que automatiza giros de depósitos judiciales de menor cuantía. La fuente institucional confirma su operación y resultados, pero no identifica una técnica de inteligencia artificial.',
        'Judicial Branch system that automates lower-value judicial deposit disbursements. The institutional source confirms its operation and results but does not identify an artificial-intelligence technique.',
      ),
      contexto: bilingue(
        'Se conserva por su relevancia para la automatización judicial, pero se clasifica como digitalización sin IA demostrada. No se encontró respaldo para presentarlo como una capa del clasificador documental.',
        'It remains in the catalog because of its relevance to judicial automation, but it is classified as digitalization without demonstrated AI. No evidence was found to present it as a layer of the document classifier.',
      ),
      fuenteUrl:
        'https://actualidadjudicial.poder-judicial.go.cr/vol294/noticias_judiciales/nj4-294.html',
    },
  },

  'pj-chatbot': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'sistema-ia',
      estadoCatalogo: 'seguimiento',
      faseImplementacion: 'operativo',
      estadoIA: 'declarada-sin-tecnica',
      evaluacion: evaluar({
        existencia: ['confirmado', 'pj-chatbot-rendicion-2019'],
        ejecucion: ['confirmado', 'pj-chatbot-rendicion-2019'],
        usoOperativo: ['confirmado', 'pj-chatbot-rendicion-2019'],
        resultados: ['confirmado', 'pj-chatbot-rendicion-2019'],
      }),
      fuentes: [
        fuente({
          id: 'pj-chatbot-rendicion-2019',
          tituloEs: 'Rendición de cuentas del Poder Judicial 2019',
          tituloEn: 'Judicial Branch 2019 accountability report',
          url: 'https://actualidadjudicial.poder-judicial.go.cr/vol251/discursos/dis3.html',
          publicador: 'Poder Judicial de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2020',
          respalda: [
            'existencia',
            'ejecucion',
            'uso-operativo',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2018',
      fechaInicioOperacion: '2018',
      fechaUltimaVerificacion: FECHA_CORTE,
      fechaProximaRevision: PROXIMA_REVISION,
      objetivoDeclarado: bilingue(
        'Responder consultas frecuentes sobre trámites y reducir la carga de la central telefónica.',
        'Answer frequently asked questions about procedures and reduce pressure on the call center.',
      ),
      resultadosVerificados: [
        {
          id: 'consultas-ahorro-2019',
          texto: bilingue(
            'La rendición de cuentas reportó más de 5,000 consultas mensuales y un ahorro de USD 13,000.',
            'The accountability report stated more than 5,000 monthly queries and USD 13,000 in savings.',
          ),
          fuenteIds: ['pj-chatbot-rendicion-2019'],
          fecha: '2019',
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'Las fuentes consultadas no publican la arquitectura, el proveedor ni la técnica utilizada.',
          'The sources reviewed do not publish the architecture, vendor or technique used.',
        ),
      ],
    },
    legacy: {
      titulo: bilingue(
        'ChatbotPJ: asistente virtual ciudadano',
        'ChatbotPJ: citizen virtual assistant',
      ),
      descripcion: bilingue(
        'Asistente virtual del Poder Judicial para responder preguntas frecuentes sobre trámites y servicios. Su operación y volumen de uso están documentados, pero las fuentes públicas no identifican la técnica utilizada.',
        'Judicial Branch virtual assistant for frequently asked questions about procedures and services. Its operation and usage volume are documented, but public sources do not identify the technique used.',
      ),
      resultado: bilingue(
        'La rendición de cuentas de 2019 reportó más de 5,000 consultas mensuales y un ahorro de USD 13,000.',
        'The 2019 accountability report stated more than 5,000 monthly queries and USD 13,000 in savings.',
      ),
      contexto: bilingue(
        'Permanece en seguimiento hasta que una fuente pública permita confirmar su técnica de IA. No se asume que todo chatbot utiliza aprendizaje automático.',
        'It remains under review until a public source confirms its AI technique. The catalog does not assume that every chatbot uses machine learning.',
      ),
      fuenteUrl:
        'https://actualidadjudicial.poder-judicial.go.cr/vol251/discursos/dis3.html',
    },
  },

  'ccss-tec-formacion': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'programa-capacidades',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'finalizado',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'tec-ccss-formacion-2025'],
        ejecucion: ['confirmado', 'tec-ccss-formacion-2025'],
        tecnicaIA: ['confirmado', 'tec-ccss-formacion-2025'],
        resultados: ['confirmado', 'tec-ccss-formacion-2025'],
      }),
      fuentes: [
        fuente({
          id: 'tec-ccss-formacion-2025',
          tituloEs:
            'TEC y CCSS impulsan uso de inteligencia artificial para resolver retos de salud pública',
          tituloEn:
            'TEC and CCSS advance the use of artificial intelligence for public-health challenges',
          url: 'https://www.tec.ac.cr/hoyeneltec/2025/12/15/tec-ccss-impulsan-uso-inteligencia-artificial-resolver-retos-salud-publica',
          publicador: 'Tecnológico de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2025-12-15',
          respalda: [
            'existencia',
            'ejecucion',
            'tecnica-ia',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2025',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Formar personal de la CCSS y desarrollar prototipos para retos de salud pública.',
        'Train CCSS staff and develop prototypes for public-health challenges.',
      ),
      resultadosVerificados: [
        {
          id: 'prototipos-formacion',
          texto: bilingue(
            'La fuente institucional reporta dos prototipos desarrollados durante el programa de ocho semanas.',
            'The institutional source reports two prototypes developed during the eight-week program.',
          ),
          fuenteIds: ['tec-ccss-formacion-2025'],
          fecha: '2025',
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'No se encontró evidencia de que los prototipos hayan sido desplegados en atención clínica.',
          'No evidence was found that the prototypes were deployed in clinical care.',
        ),
      ],
    },
    legacy: {
      contexto: bilingue(
        'Se clasifica como programa de capacidades. Los prototipos son productos de formación y no equivalen a sistemas clínicos desplegados.',
        'It is classified as a capacity-building program. The prototypes are training outputs and do not amount to deployed clinical systems.',
      ),
    },
  },

  'ccss-edus': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'infraestructura-digital',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'operativo',
      estadoIA: 'no-determinada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'bid-edus'],
        ejecucion: ['confirmado', 'bid-edus'],
        usoOperativo: ['confirmado', 'bid-edus'],
        resultados: ['confirmado', 'bid-edus'],
      }),
      fuentes: [
        fuente({
          id: 'bid-edus',
          tituloEs:
            'Expediente Digital Único en Salud de Costa Rica: historia, implementación y buenas prácticas',
          tituloEn:
            "Costa Rica's Unified Digital Health Record: history, implementation and best practices",
          url: 'https://publications.iadb.org/en/costa-ricas-unified-digital-health-record-edus-system-best-practices-history-and-implementation',
          publicador: 'Banco Interamericano de Desarrollo',
          tipoFuente: 'multilateral',
          respalda: [
            'existencia',
            'ejecucion',
            'uso-operativo',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2010',
      fechaInicioOperacion: '2010',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Centralizar el expediente clínico digital y habilitar el intercambio de información dentro de la CCSS.',
        'Centralize the digital clinical record and enable information exchange within CCSS.',
      ),
      resultadosVerificados: [
        {
          id: 'infraestructura-edus',
          texto: bilingue(
            'El BID documenta la implementación nacional de EDUS como expediente digital integrado de la CCSS.',
            'The IDB documents the nationwide implementation of EDUS as CCSS integrated digital health record.',
          ),
          fuenteIds: ['bid-edus'],
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'La fuente consultada no demuestra una capa predictiva general de IA operando dentro de EDUS.',
          'The source reviewed does not demonstrate a general predictive AI layer operating within EDUS.',
        ),
      ],
      relaciones: [
        {
          iniciativaId: 'ccss-lidia',
          tipo: 'alimenta-a',
          nota: bilingue(
            'LIDIA utiliza datos del EDUS para sus modelos predictivos.',
            'LIDIA uses EDUS data for its predictive models.',
          ),
        },
        {
          iniciativaId: 'ccss-aida',
          tipo: 'alimenta-a',
          nota: bilingue(
            'La CCSS anuncia que AIDA se integrará al EDUS.',
            'CCSS states that AIDA will be integrated with EDUS.',
          ),
        },
      ],
    },
    legacy: {
      titulo: bilingue(
        'EDUS: Expediente Digital Único en Salud',
        'EDUS: Unified Digital Health Record',
      ),
      descripcion: bilingue(
        'Infraestructura digital de la CCSS que centraliza expedientes clínicos y habilita el intercambio de información entre establecimientos. EDUS es la base de datos utilizada por iniciativas separadas como LIDIA y la integración anunciada de AIDA.',
        'CCSS digital infrastructure that centralizes clinical records and enables information exchange across facilities. EDUS is the data foundation used by separate initiatives such as LIDIA and the announced AIDA integration.',
      ),
      resultado: bilingue(
        'El BID documenta la implementación nacional de EDUS como expediente digital integrado de la CCSS.',
        'The IDB documents the nationwide implementation of EDUS as CCSS integrated digital health record.',
      ),
      contexto: bilingue(
        'Se separa la plataforma base de sus posibles componentes de IA. La operación de EDUS no demuestra por sí sola que exista una capa predictiva general en producción.',
        'The base platform is separated from its possible AI components. EDUS operation does not by itself demonstrate that a general predictive layer is in production.',
      ),
    },
  },

  'ccss-aida': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'componente-ia',
      estadoCatalogo: 'seguimiento',
      faseImplementacion: 'planificado',
      estadoIA: 'declarada-sin-tecnica',
      evaluacion: evaluar({
        existencia: ['confirmado', 'ccss-aida-anuncio'],
        gobernanza: ['confirmado', 'ccss-aida-anuncio'],
      }),
      fuentes: [
        fuente({
          id: 'ccss-aida-anuncio',
          tituloEs:
            'CCSS implementa nueva estrategia para fortalecer el primer nivel de atención',
          tituloEn:
            'CCSS introduces a new strategy to strengthen primary care',
          url: 'https://aissfa.ccss.sa.cr/noticias/noticia?v=101282054203',
          publicador: 'Caja Costarricense de Seguro Social',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2025-11-11',
          respalda: [
            'existencia',
            'objetivo-declarado',
            'meta',
            'gobernanza',
          ],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado', 'meta'],
        }),
      ],
      fechaPrimeraEvidencia: '2025-11-11',
      fechaAnuncio: '2025-11-11',
      fechaUltimaVerificacion: FECHA_CORTE,
      fechaProximaRevision: PROXIMA_REVISION,
      objetivoDeclarado: bilingue(
        'Apoyar decisiones clínicas en tiempo real desde el primer nivel de atención mediante una integración con EDUS.',
        'Support real-time clinical decisions in primary care through an integration with EDUS.',
      ),
      datosConocidos: [
        bilingue(
          'La Junta Directiva aprobó la estrategia general y la fuente oficial anuncia que AIDA se desplegará dentro de ella.',
          'The Board approved the broader strategy, and the official source states that AIDA will be deployed within it.',
        ),
      ],
      datosNoDeterminados: [
        bilingue(
          'No se localizó evidencia posterior que confirme el inicio del despliegue de AIDA, su proveedor o su arquitectura técnica.',
          'No later evidence was found confirming the start of AIDA deployment, its vendor or its technical architecture.',
        ),
      ],
      preguntasAbiertas: [
        bilingue(
          '¿Comenzó AIDA a utilizarse en alguna de las 15 áreas demostrativas durante 2026?',
          'Did AIDA begin being used in any of the 15 demonstration areas during 2026?',
        ),
      ],
      relaciones: [
        {
          iniciativaId: 'ccss-edus',
          tipo: 'depende-de',
          nota: bilingue(
            'La integración con EDUS es parte del objetivo anunciado.',
            'Integration with EDUS is part of the stated objective.',
          ),
        },
      ],
    },
    legacy: {
      titulo: bilingue(
        'AIDA: Asistente Inteligente Digital para la Atención',
        'AIDA: Intelligent Digital Assistant for Care',
      ),
      estado: 'planificado',
      desde: '2025',
      descripcion: bilingue(
        'Asistente Inteligente Digital para la Atención anunciado por la CCSS para apoyar decisiones clínicas en tiempo real e integrarse con EDUS dentro de la estrategia de fortalecimiento del primer nivel.',
        'Intelligent Digital Assistant for Care announced by CCSS to support real-time clinical decisions and integrate with EDUS as part of its primary-care strengthening strategy.',
      ),
      contexto: bilingue(
        'La fuente oficial usa tiempo futuro: indica que AIDA se desplegará. La estrategia contempla una fase piloto en 2026-2027, pero no se encontró evidencia pública posterior que confirme que AIDA ya entró en uso.',
        'The official source uses future tense: it states that AIDA will be deployed. The strategy includes a 2026-2027 pilot phase, but no later public evidence was found confirming that AIDA entered use.',
      ),
      fuenteUrl: 'https://aissfa.ccss.sa.cr/noticias/noticia?v=101282054203',
    },
    quitarResultado: true,
  },

  'ccss-lidia': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'componente-ia',
      estadoCatalogo: 'verificado',
      faseImplementacion: 'piloto',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'ccss-lidia-acta-9504'],
        ejecucion: ['confirmado', 'ccss-lidia-acta-9504'],
        tecnicaIA: ['confirmado', 'ccss-lidia-acta-9504'],
        usoOperativo: ['confirmado', 'ccss-lidia-acta-9504'],
        resultados: [
          'confirmado',
          'ccss-lidia-acta-9504',
          'teletica-lidia-2025',
        ],
      }),
      fuentes: [
        fuente({
          id: 'ccss-lidia-acta-9504',
          tituloEs: 'Acta de Junta Directiva de la CCSS, sesión 9504',
          tituloEn: 'CCSS Board minutes, session 9504',
          url: 'https://aissfa.ccss.sa.cr/arc/actas/2025/03/9504.pdf',
          publicador: 'Caja Costarricense de Seguro Social',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2025-03-18',
          respalda: [
            'existencia',
            'ejecucion',
            'tecnica-ia',
            'uso-operativo',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
        fuente({
          id: 'teletica-lidia-2025',
          tituloEs:
            'LIDIA, el programa de inteligencia artificial que crece en la CCSS',
          tituloEn:
            'LIDIA, the artificial-intelligence program growing within CCSS',
          url: 'https://www.teletica.com/salud/lidia-el-programa-de-inteligencia-artificial-que-crece-en-la-ccss-en-medio-de-un-dilema-etico_376322',
          publicador: 'Teletica',
          tipoFuente: 'prensa',
          fechaPublicacion: '2025',
          respalda: [
            'existencia',
            'ejecucion',
            'tecnica-ia',
            'uso-operativo',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2023',
      fechaInicioPiloto: '2023',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Identificar personas con riesgo elevado de enfermedades mediante modelos predictivos sobre información del EDUS.',
        'Identify people at elevated disease risk through predictive models using EDUS information.',
      ),
      resultadosVerificados: [
        {
          id: 'modelo-diabetes-alcance-inicial',
          texto: bilingue(
            'El acta institucional identifica el modelo de diabetes tipo 2 como el primer modelo de IA en salud de la CCSS, reporta finalizado su alcance inicial y registra una propuesta de escalamiento.',
            'Institutional minutes identify the type-2 diabetes model as CCSS first health AI model, report its initial scope as complete and record a scaling proposal.',
          ),
          fuenteIds: ['ccss-lidia-acta-9504'],
          fecha: '2025-03-18',
        },
        {
          id: 'resultados-piloto-reportados-prensa',
          texto: bilingue(
            'Teletica reportó más de un millón de registros analizados, 2,500 personas identificadas en riesgo, 1,800 contactadas y 130 casos ya diagnosticados.',
            'Teletica reported more than one million records analyzed, 2,500 people identified as at risk, 1,800 contacted and 130 already diagnosed.',
          ),
          fuenteIds: ['teletica-lidia-2025'],
          fecha: '2025',
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'No se localizaron métricas públicas de precisión, sensibilidad o falsos positivos auditadas independientemente.',
          'No independently audited public metrics for accuracy, sensitivity or false positives were found.',
        ),
      ],
      relaciones: [
        {
          iniciativaId: 'ccss-edus',
          tipo: 'depende-de',
          nota: bilingue(
            'Los modelos se construyen sobre información contenida en EDUS.',
            'The models are built using information held in EDUS.',
          ),
        },
      ],
    },
    legacy: {
      titulo: bilingue(
        'LIDIA: modelos predictivos en EDUS',
        'LIDIA: predictive models in EDUS',
      ),
      resultado: bilingue(
        'El acta de Junta Directiva confirma el alcance inicial del modelo de diabetes y una propuesta de escalamiento. Teletica reportó más de un millón de registros analizados, 2,500 personas en riesgo, 1,800 contactadas y 130 ya diagnosticadas.',
        'Board minutes confirm the initial scope of the diabetes model and a scaling proposal. Teletica reported more than one million records analyzed, 2,500 people at risk, 1,800 contacted and 130 already diagnosed.',
      ),
      contexto: bilingue(
        'Se cuenta como piloto verificado porque un acta institucional confirma la ejecución, la técnica y el uso del modelo. Las cifras detalladas provienen de prensa y se presentan como resultados reportados, no como evaluación independiente.',
        'It counts as a verified pilot because institutional minutes confirm execution, technique and use of the model. Detailed figures come from the press and are presented as reported results, not an independent evaluation.',
      ),
    },
  },

  'ccss-redimed': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'infraestructura-digital',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'desarrollo',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'ccss-redimed-oficial'],
        ejecucion: [
          'parcialmente-confirmado',
          'ccss-redimed-oficial',
          'redimed-cgr-prensa',
        ],
        tecnicaIA: ['confirmado', 'ccss-redimed-oficial'],
        usoOperativo: ['parcialmente-confirmado', 'ccss-redimed-oficial'],
        resultados: ['confirmado', 'redimed-cgr-prensa'],
        gobernanza: ['confirmado', 'redimed-cgr-prensa'],
      }),
      fuentes: [
        fuente({
          id: 'ccss-redimed-oficial',
          tituloEs:
            'CCSS logra gran avance en transformación digital de sus estudios radiológicos',
          tituloEn:
            'CCSS reports progress in the digital transformation of radiology studies',
          url: 'https://aissfa.ccss.sa.cr/noticias/noticia?v=caja-logra-gran-avance-en-transformacion-digital-de-sus-estudios-radiologicos',
          publicador: 'Caja Costarricense de Seguro Social',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2023',
          respalda: [
            'existencia',
            'objetivo-declarado',
            'ejecucion',
            'tecnica-ia',
            'uso-operativo',
            'meta',
          ],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado', 'meta'],
        }),
        fuente({
          id: 'redimed-cgr-prensa',
          tituloEs:
            'CGR advierte a la CCSS por incumplimientos en sistema de imágenes médicas',
          tituloEn:
            'Comptroller flags CCSS shortcomings in the medical-imaging system',
          url: 'https://semanariouniversidad.com/pais/cgr-advierte-a-la-ccss-por-incumplimientos-en-sistema-de-imagenes-medicas-y-ordena-medidas-correctivas/',
          publicador: 'Semanario Universidad',
          tipoFuente: 'prensa',
          fechaPublicacion: '2025-07',
          respalda: [
            'existencia',
            'ejecucion',
            'resultado-reportado',
            'gobernanza',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2023',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Compartir imágenes médicas entre establecimientos y evaluar apoyo de IA para priorizar mamografías.',
        'Share medical images across facilities and evaluate AI support for mammography prioritization.',
      ),
      resultadosVerificados: [
        {
          id: 'despliegue-parcial-redimed',
          texto: bilingue(
            'La cobertura de fiscalización reportó 13 centros habilitados de un alcance original de 50.',
            'Audit coverage reported 13 enabled facilities out of an original scope of 50.',
          ),
          fuenteIds: ['redimed-cgr-prensa'],
          fecha: '2025',
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'La evidencia disponible no permite separar con precisión la fase de REDIMED y la fase del componente de IA para mamografías.',
          'Available evidence does not allow the phase of REDIMED to be cleanly separated from the phase of the mammography AI component.',
        ),
      ],
      preguntasAbiertas: [
        bilingue(
          '¿El componente de priorización con IA superó el estudio de validación y se usa en atención?',
          'Did the AI prioritization component complete validation and enter care use?',
        ),
      ],
    },
    legacy: {
      titulo: bilingue(
        'REDIMED: Red Digital Institucional de Imágenes Médicas',
        'REDIMED: Institutional Digital Network for Medical Imaging',
      ),
      descripcion: bilingue(
        'Red de la CCSS para almacenar y compartir imágenes médicas entre establecimientos. La fuente institucional también documenta un componente de IA para analizar y priorizar mamografías, entonces en estudio de validación.',
        'CCSS network for storing and sharing medical images across facilities. The institutional source also documents an AI component to analyze and prioritize mammograms, then under validation study.',
      ),
      contexto: bilingue(
        'La ficha reúne una infraestructura digital parcialmente desplegada y un componente de IA cuya fase no está claramente actualizada. Por eso se ubica en ecosistema y no en el contador de adopción verificada.',
        'The entry combines partially deployed digital infrastructure and an AI component whose phase has not been clearly updated. It is therefore placed in the ecosystem layer and not in the verified-adoption count.',
      ),
    },
  },

  'ccss-depuracion-listas': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'componente-ia',
      estadoCatalogo: 'seguimiento',
      faseImplementacion: 'piloto',
      estadoIA: 'declarada-sin-tecnica',
      evaluacion: evaluar({
        existencia: ['confirmado', 'ccss-cleo-oficial'],
        ejecucion: ['confirmado', 'ccss-cleo-oficial'],
        usoOperativo: ['confirmado', 'ccss-cleo-oficial'],
        gobernanza: ['confirmado', 'ccss-cleo-oficial'],
      }),
      fuentes: [
        fuente({
          id: 'ccss-cleo-oficial',
          tituloEs: 'CCSS implementa herramienta para depurar listas de espera',
          tituloEn: 'CCSS introduces a tool to clean up waiting lists',
          url: 'https://www.ccss.sa.cr/noticias/noticia?v=752326066172',
          publicador: 'Caja Costarricense de Seguro Social',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2026',
          respalda: [
            'existencia',
            'objetivo-declarado',
            'ejecucion',
            'uso-operativo',
            'gobernanza',
          ],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado'],
        }),
      ],
      fechaPrimeraEvidencia: '2026-05',
      fechaInicioPiloto: '2026-07',
      fechaUltimaVerificacion: FECHA_CORTE,
      fechaProximaRevision: PROXIMA_REVISION,
      objetivoDeclarado: bilingue(
        'Contactar personas en lista de espera y ayudar a depurar registros con validación humana previa a cualquier cambio.',
        'Contact people on waiting lists and help clean records with human validation before any change.',
      ),
      datosConocidos: [
        bilingue(
          'La herramienta no asigna citas ni elimina personas automáticamente; el personal de la CCSS valida la información.',
          'The tool does not assign appointments or remove people automatically; CCSS staff validate the information.',
        ),
      ],
      datosNoDeterminados: [
        bilingue(
          'No se publicaron el proveedor, el modelo técnico ni resultados del piloto atribuibles a la herramienta.',
          'The vendor, technical model and pilot results attributable to the tool were not published.',
        ),
      ],
    },
    legacy: {
      estado: 'piloto',
      descripcion: bilingue(
        'Herramienta de la CCSS para contactar personas y apoyar la depuración de listas de espera. El piloto usa canales automatizados, pero toda modificación de un registro requiere validación del personal institucional.',
        'CCSS tool for contacting people and supporting waiting-list cleanup. The pilot uses automated channels, but every record change requires validation by institutional staff.',
      ),
      contexto: bilingue(
        'Se mantiene en seguimiento porque la institución documenta el piloto y la supervisión humana, pero no publica el proveedor, la arquitectura ni una técnica de IA verificable. Las cifras generales de listas de espera no se atribuyen a la herramienta.',
        'It remains under review because the institution documents the pilot and human oversight but does not publish the vendor, architecture or a verifiable AI technique. General waiting-list figures are not attributed to the tool.',
      ),
    },
    quitarResultado: true,
  },

  'ccss-logistica-ia-abastecimiento': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'componente-ia',
      estadoCatalogo: 'seguimiento',
      faseImplementacion: 'operativo',
      estadoIA: 'declarada-sin-tecnica',
      evaluacion: evaluar({
        existencia: ['parcialmente-confirmado', 'crhoy-logistica-ccss'],
        ejecucion: ['parcialmente-confirmado', 'crhoy-logistica-ccss'],
        usoOperativo: ['parcialmente-confirmado', 'crhoy-logistica-ccss'],
      }),
      fuentes: [
        fuente({
          id: 'crhoy-logistica-ccss',
          tituloEs:
            'CCSS activa medidas para anticipar riesgos internacionales de abastecimiento',
          tituloEn:
            'CCSS activates measures to anticipate international supply risks',
          url: 'https://crhoy.com/nacionales/ccss-activa-medidas-por-conflicto-en-medio-oriente-pakistan-y-afganistan-son-clave-para-insumos/',
          publicador: 'CRHoy',
          tipoFuente: 'prensa',
          fechaPublicacion: '2026',
          respalda: ['existencia', 'ejecucion', 'uso-operativo'],
          naturalezaAfirmacion: ['hecho'],
        }),
      ],
      fechaPrimeraEvidencia: '2026-02',
      fechaInicioOperacion: '2026-02',
      fechaUltimaVerificacion: FECHA_CORTE,
      fechaProximaRevision: PROXIMA_REVISION,
      objetivoDeclarado: bilingue(
        'Anticipar riesgos de desabastecimiento mediante el cruce de inventario y señales del mercado internacional.',
        'Anticipate shortage risks by combining inventory data with international-market signals.',
      ),
      datosNoDeterminados: [
        bilingue(
          'No se localizó una fuente primaria de la CCSS que confirme la arquitectura, el proveedor, la técnica de IA o métricas de impacto.',
          'No primary CCSS source was found confirming the architecture, vendor, AI technique or impact metrics.',
        ),
      ],
    },
    legacy: {
      titulo: bilingue(
        'Monitoreo de abastecimiento con IA: Gerencia de Logística',
        'AI supply monitoring: Logistics Management',
      ),
      descripcion: bilingue(
        'Herramienta de monitoreo de abastecimiento atribuida por cobertura periodística a la Gerencia de Logística de la CCSS. Combina información institucional y señales de riesgo internacional para anticipar posibles faltantes.',
        'Supply-monitoring tool attributed by press coverage to CCSS Logistics Management. It combines institutional information and international-risk signals to anticipate possible shortages.',
      ),
      contexto: bilingue(
        'La existencia y el uso se consideran parcialmente confirmados porque la evidencia disponible es periodística. Falta una fuente primaria que describa la técnica, el proveedor y el alcance exacto.',
        'Existence and use are considered partially confirmed because the available evidence is press reporting. A primary source describing the technique, vendor and exact scope is still needed.',
      ),
    },
    quitarResultado: true,
  },

  'hacienda-anomaly': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'sistema-ia',
      estadoCatalogo: 'verificado',
      faseImplementacion: 'operativo',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'microsoft-eiad-costa-rica'],
        ejecucion: [
          'confirmado',
          'microsoft-eiad-costa-rica',
          'nacion-anomaly-2026',
        ],
        tecnicaIA: ['confirmado', 'microsoft-eiad-costa-rica'],
        usoOperativo: [
          'confirmado',
          'microsoft-eiad-costa-rica',
          'nacion-anomaly-2026',
        ],
        resultados: ['confirmado', 'nacion-anomaly-2026'],
        gobernanza: ['confirmado', 'nacion-anomaly-2026'],
      }),
      fuentes: [
        fuente({
          id: 'microsoft-eiad-costa-rica',
          tituloEs:
            'Costa Rica y CIAT despliegan una solución de detección de anomalías en facturación electrónica',
          tituloEn:
            'Costa Rica and CIAT deploy an e-invoicing anomaly-detection solution',
          url: 'https://www.microsoft.com/en/customers/story/1653565125024864159-inter-american-center-of-tax-administrations-costa-rica-financial-services-e-invoicing-anomaly-detection-solution-accelerator',
          publicador: 'Microsoft',
          tipoFuente: 'otra-secundaria',
          fechaPublicacion: '2023-06-30',
          respalda: [
            'existencia',
            'ejecucion',
            'tecnica-ia',
            'uso-operativo',
          ],
          naturalezaAfirmacion: ['hecho'],
        }),
        fuente({
          id: 'nacion-anomaly-2026',
          tituloEs:
            'Hacienda revela la tecnología que le permitió recuperar ₡8,000 millones',
          tituloEn:
            'Finance Ministry explains the technology behind ₡8 billion in recoveries',
          url: 'https://www.nacion.com/economia/hacienda-revela-la-tecnologia-que-le-permitio/G63WRWKZ7NHLXBSHCS6RI3T4JU/story/',
          publicador: 'La Nación',
          tipoFuente: 'prensa',
          fechaPublicacion: '2026-03-19',
          respalda: [
            'existencia',
            'ejecucion',
            'tecnica-ia',
            'uso-operativo',
            'resultado-reportado',
            'gobernanza',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2022',
      fechaInicioPiloto: '2023',
      fechaInicioOperacion: '2024',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Detectar patrones anómalos en comprobantes electrónicos para priorizar casos de fiscalización tributaria.',
        'Detect anomalous patterns in electronic invoices to prioritize tax-audit cases.',
      ),
      resultadosVerificados: [
        {
          id: 'recuperacion-fiscal-2025',
          texto: bilingue(
            'Hacienda reportó 50 casos fiscalizados y cerca de ₡8,000 millones recuperados durante 2025.',
            'The Finance Ministry reported 50 audited cases and approximately ₡8 billion recovered during 2025.',
          ),
          fuenteIds: ['nacion-anomaly-2026'],
          fecha: '2025',
        },
      ],
      datosConocidos: [
        bilingue(
          'La revisión técnica humana ocurre antes de iniciar actuaciones de fiscalización.',
          'Human technical review takes place before audit actions begin.',
        ),
      ],
      datosNoDeterminados: [
        bilingue(
          'No se localizó una evaluación independiente de precisión o falsos positivos.',
          'No independent evaluation of accuracy or false positives was found.',
        ),
      ],
      relaciones: [
        {
          iniciativaId: 'hacienda-tribu-cr',
          tipo: 'distinto-de',
          nota: bilingue(
            'La detección de anomalías es una solución analítica distinta de la plataforma transaccional TRIBU-CR.',
            'Anomaly detection is an analytical solution distinct from the TRIBU-CR transaction platform.',
          ),
        },
      ],
    },
    legacy: {
      titulo: bilingue(
        'Detección de anomalías en facturación electrónica',
        'Electronic-invoicing anomaly detection',
      ),
      descripcion: bilingue(
        'Solución del Ministerio de Hacienda para detectar patrones anómalos en comprobantes electrónicos y priorizar fiscalizaciones. El proyecto inició en 2022, realizó pruebas en 2023 y tuvo implementación integral durante 2024-2025, con revisión técnica humana antes de cualquier actuación.',
        'Finance Ministry solution for detecting anomalous patterns in electronic invoices and prioritizing audits. The project began in 2022, was tested in 2023 and was fully implemented during 2024-2025, with human technical review before any action.',
      ),
      resultado: bilingue(
        'Hacienda reportó 50 casos fiscalizados y cerca de ₡8,000 millones recuperados durante 2025.',
        'The Finance Ministry reported 50 audited cases and approximately ₡8 billion recovered during 2025.',
      ),
      contexto: bilingue(
        'La ficha corresponde a la solución de detección de anomalías en facturación electrónica. TRIBU-CR y ATENA son sistemas distintos y ya no se presentan como un solo stack.',
        'This entry covers the electronic-invoicing anomaly-detection solution. TRIBU-CR and ATENA are distinct systems and are no longer presented as a single stack.',
      ),
    },
  },

  'hacienda-asistente': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'sistema-ia',
      estadoCatalogo: 'seguimiento',
      faseImplementacion: 'operativo',
      estadoIA: 'declarada-sin-tecnica',
      evaluacion: evaluar({
        existencia: ['confirmado', 'hacienda-infoyasistencia'],
        ejecucion: ['confirmado', 'hacienda-infoyasistencia'],
        usoOperativo: ['confirmado', 'hacienda-infoyasistencia'],
      }),
      fuentes: [
        fuente({
          id: 'hacienda-infoyasistencia',
          tituloEs: 'Plataforma Infoyasistencia',
          tituloEn: 'Infoyasistencia platform',
          url: 'https://infoyasistencia.hacienda.go.cr/',
          publicador: 'Ministerio de Hacienda',
          tipoFuente: 'primaria-oficial',
          respalda: ['existencia', 'ejecucion', 'uso-operativo'],
          naturalezaAfirmacion: ['hecho'],
        }),
        fuente({
          id: 'hacienda-infoyasistencia-resolucion',
          tituloEs: 'Propuesta de resolución para la plataforma Infoyasistencia',
          tituloEn: 'Draft resolution for the Infoyasistencia platform',
          url: 'https://www.hacienda.go.cr/docs/DGTRXX2022PLATAFORMAINFOYASISTENCIAV10.pdf',
          publicador: 'Ministerio de Hacienda',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2022',
          respalda: ['existencia', 'objetivo-declarado', 'meta'],
          naturalezaAfirmacion: ['objetivo-declarado', 'meta'],
        }),
      ],
      fechaPrimeraEvidencia: '2022',
      fechaInicioOperacion: '2022',
      fechaUltimaVerificacion: FECHA_CORTE,
      fechaProximaRevision: PROXIMA_REVISION,
      objetivoDeclarado: bilingue(
        'Brindar información tributaria mediante autoservicio y transferir consultas a personal cuando sea necesario.',
        'Provide tax information through self-service and transfer queries to staff when necessary.',
      ),
      datosNoDeterminados: [
        bilingue(
          'No se publican la técnica del asistente, el proveedor ni métricas de interacciones o resolución.',
          'The assistant technique, vendor and interaction or resolution metrics are not published.',
        ),
      ],
    },
    legacy: {
      desde: '2022',
      descripcion: bilingue(
        'Canal de asistencia tributaria del Ministerio de Hacienda disponible en Infoyasistencia. Permite consultar temas tributarios y derivar la atención a personal institucional, pero la documentación pública no identifica la técnica del asistente.',
        'Finance Ministry tax-assistance channel available through Infoyasistencia. It supports tax queries and escalation to institutional staff, but public documentation does not identify the assistant technique.',
      ),
      contexto: bilingue(
        'Se confirma la operación del canal, no una arquitectura concreta de IA. Permanece en seguimiento hasta obtener documentación técnica o métricas públicas.',
        'Operation of the channel is confirmed, but no specific AI architecture is. It remains under review pending technical documentation or public metrics.',
      ),
      fuenteUrl: 'https://infoyasistencia.hacienda.go.cr/',
    },
    quitarResultado: true,
  },

  'hacienda-tribu-cr': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'infraestructura-digital',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'operativo',
      estadoIA: 'no-determinada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'hacienda-tribu-resolucion'],
        ejecucion: ['confirmado', 'hacienda-tribu-resolucion'],
        usoOperativo: ['confirmado', 'hacienda-tribu-resolucion'],
      }),
      fuentes: [
        fuente({
          id: 'hacienda-tribu-resolucion',
          tituloEs: 'Resolución MH-DGT-RES-0043-2025 sobre TRIBU-CR',
          tituloEn: 'Resolution MH-DGT-RES-0043-2025 on TRIBU-CR',
          url: 'https://www.hacienda.go.cr/docs/ResolucionMH-DGT-RES-0043-2025.pdf',
          publicador: 'Ministerio de Hacienda',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2025',
          respalda: ['existencia', 'ejecucion', 'uso-operativo'],
          naturalezaAfirmacion: ['hecho'],
        }),
      ],
      fechaPrimeraEvidencia: '2025',
      fechaInicioOperacion: '2025-10-06',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Integrar en una plataforma los principales módulos de gestión tributaria y sustituir sistemas anteriores.',
        'Integrate the main tax-management modules into one platform and replace previous systems.',
      ),
      datosConocidos: [
        bilingue(
          'La resolución oficial fija el inicio de operación para el 6 de octubre de 2025.',
          'The official resolution sets the start of operation for October 6, 2025.',
        ),
      ],
      datosNoDeterminados: [
        bilingue(
          'La fuente no identifica un componente concreto de inteligencia artificial dentro de TRIBU-CR.',
          'The source does not identify a specific artificial-intelligence component within TRIBU-CR.',
        ),
      ],
      relaciones: [
        {
          iniciativaId: 'hacienda-anomaly',
          tipo: 'distinto-de',
          nota: bilingue(
            'TRIBU-CR es una plataforma tributaria; la detección de anomalías se documenta como una iniciativa analítica separada.',
            'TRIBU-CR is a tax platform; anomaly detection is documented as a separate analytical initiative.',
          ),
        },
      ],
    },
    legacy: {
      titulo: bilingue(
        'TRIBU-CR: plataforma tributaria integrada',
        'TRIBU-CR: integrated tax platform',
      ),
      descripcion: bilingue(
        'Plataforma integrada de gestión tributaria del Ministerio de Hacienda, operativa desde el 6 de octubre de 2025 y sustituta de módulos de sistemas anteriores como ATV. La evidencia consultada confirma digitalización e integración, no un componente específico de IA.',
        'Integrated tax-management platform operated by the Finance Ministry since October 6, 2025, replacing modules from earlier systems such as ATV. The evidence confirms digitalization and integration, not a specific AI component.',
      ),
      contexto: bilingue(
        'Se clasifica como infraestructura digital. Su relevancia para Hacienda Digital no convierte automáticamente todos sus módulos en inteligencia artificial.',
        'It is classified as digital infrastructure. Its importance to Hacienda Digital does not automatically make every module artificial intelligence.',
      ),
      fuenteUrl:
        'https://www.hacienda.go.cr/docs/ResolucionMH-DGT-RES-0043-2025.pdf',
    },
    quitarResultado: true,
  },

  'mep-intel': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'programa-capacidades',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'operativo',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'mep-intel-especialidad'],
        ejecucion: ['confirmado', 'mep-intel-especialidad'],
        resultados: ['confirmado', 'mep-intel-especialidad'],
      }),
      fuentes: [
        fuente({
          id: 'mep-intel-especialidad',
          tituloEs:
            'Convenio MEP e Intel habilita especialidad de inteligencia artificial en colegios técnicos',
          tituloEn:
            'MEP and Intel agreement introduces an artificial-intelligence specialization in technical schools',
          url: 'https://www.mep.go.cr/noticias/convenio-mep-e-intel-costa-rica-habilitara-especialidad-inteligencia-artificial-colegios-te',
          publicador: 'Ministerio de Educación Pública',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2023',
          respalda: ['existencia', 'objetivo-declarado', 'ejecucion', 'resultado-reportado'],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2023',
      fechaInicioOperacion: '2023',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Formar estudiantes de colegios técnicos en inteligencia artificial, aprendizaje automático, ética y aspectos legales.',
        'Train technical-school students in artificial intelligence, machine learning, ethics and legal issues.',
      ),
      resultadosVerificados: [
        {
          id: 'inicio-cuatro-ctp',
          texto: bilingue(
            'La especialidad inició en cuatro colegios técnicos profesionales.',
            'The specialization started in four technical vocational schools.',
          ),
          fuenteIds: ['mep-intel-especialidad'],
          fecha: '2023',
        },
      ],
    },
    legacy: {
      resultado: bilingue(
        'La especialidad comenzó en cuatro colegios técnicos profesionales.',
        'The specialization started in four technical vocational schools.',
      ),
      contexto: bilingue(
        'Es una iniciativa educativa para formar talento y no un sistema de IA utilizado por el MEP para prestar servicios públicos.',
        'This is an education initiative for developing talent, not an AI system used by MEP to deliver public services.',
      ),
    },
  },

  'micitt-linc': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'programa-capacidades',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'operativo',
      estadoIA: 'no-determinada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'micitt-linc-oficial'],
        ejecucion: ['confirmado', 'micitt-linc-oficial'],
        usoOperativo: ['confirmado', 'micitt-linc-oficial'],
        resultados: ['confirmado', 'micitt-linc-oficial'],
      }),
      fuentes: [
        fuente({
          id: 'micitt-linc-oficial',
          tituloEs: 'Programas y proyectos de innovación del MICITT',
          tituloEn: 'MICITT innovation programs and projects',
          url: 'https://www.micitt.go.cr/micitt/innovacion',
          publicador: 'MICITT',
          tipoFuente: 'primaria-oficial',
          respalda: [
            'existencia',
            'objetivo-declarado',
            'ejecucion',
            'uso-operativo',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2023',
      fechaInicioOperacion: '2023',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Fomentar innovación comunitaria mediante espacios de cocreación, investigación, formación y desarrollo de soluciones locales.',
        'Promote community innovation through spaces for co-creation, research, training and local solution development.',
      ),
      resultadosVerificados: [
        {
          id: 'personas-capacitadas-linc',
          texto: bilingue(
            'MICITT reporta 3,223 personas capacitadas entre 2023 y 2024, de ellas 1,522 durante 2024.',
            'MICITT reports 3,223 people trained during 2023-2024, including 1,522 in 2024.',
          ),
          fuenteIds: ['micitt-linc-oficial'],
          fecha: '2024',
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'Los cursos de IA forman parte de una oferta amplia; no demuestran el despliegue de un sistema de IA en los laboratorios.',
          'AI courses are part of a broad offering; they do not demonstrate deployment of an AI system in the labs.',
        ),
      ],
    },
    legacy: {
      titulo: bilingue(
        'LINC: Laboratorios de Innovación Comunitaria',
        'LINC: Community Innovation Labs',
      ),
      desde: '2023',
      descripcion: bilingue(
        'Red de Laboratorios de Innovación Comunitaria del MICITT para formación, cocreación y desarrollo de soluciones locales. Su oferta incluye programación, fabricación digital, robótica, ciberseguridad, inteligencia artificial y otras tecnologías emergentes.',
        'MICITT network of Community Innovation Labs for training, co-creation and local solution development. Its offering includes programming, digital fabrication, robotics, cybersecurity, artificial intelligence and other emerging technologies.',
      ),
      resultado: bilingue(
        'MICITT reporta 3,223 personas capacitadas entre 2023 y 2024, incluidas 1,522 durante 2024.',
        'MICITT reports 3,223 people trained during 2023-2024, including 1,522 in 2024.',
      ),
      contexto: bilingue(
        'Se clasifica como programa de capacidades. Ofrecer cursos sobre IA no equivale a operar un sistema de IA para un servicio público.',
        'It is classified as a capacity-building program. Offering AI courses is not equivalent to operating an AI system for a public service.',
      ),
      fuenteUrl: 'https://www.micitt.go.cr/micitt/innovacion',
    },
  },

  'micitt-conecta': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'infraestructura-digital',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'desarrollo',
      estadoIA: 'descartada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'micitt-conecta-lanzamiento'],
        ejecucion: ['confirmado', 'micitt-conecta-lanzamiento'],
        gobernanza: ['confirmado', 'micitt-conecta-lanzamiento'],
      }),
      fuentes: [
        fuente({
          id: 'micitt-conecta-lanzamiento',
          tituloEs:
            'Costa Rica lanza el proyecto CRI/003 Conecta para avanzar hacia la interoperabilidad',
          tituloEn:
            'Costa Rica launches CRI/003 Conecta to advance interoperability',
          url: 'https://www.micitt.go.cr/el-sector-informa/costa-rica-acelera-su-transformacion-digital-con-el-lanzamiento-del-proyecto',
          publicador: 'MICITT',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2026-03',
          respalda: [
            'existencia',
            'objetivo-declarado',
            'meta',
            'ejecucion',
            'gobernanza',
          ],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado', 'meta'],
        }),
      ],
      fechaPrimeraEvidencia: '2026-03',
      fechaAnuncio: '2026-03',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Definir y adoptar un modelo nacional de interoperabilidad gubernamental basado en X-Road.',
        'Define and adopt a national government-interoperability model based on X-Road.',
      ),
      datosConocidos: [
        bilingue(
          'Treinta instituciones participaron en un diagnóstico para construir la hoja de ruta de adopción.',
          'Thirty institutions participated in a diagnostic exercise to build the adoption roadmap.',
        ),
      ],
      datosNoDeterminados: [
        bilingue(
          'La participación en el taller no demuestra que X-Road ya esté integrado u operativo en las 30 instituciones.',
          'Participation in the workshop does not demonstrate that X-Road is already integrated or operational in all 30 institutions.',
        ),
      ],
    },
    legacy: {
      titulo: bilingue(
        'CONECTA: interoperabilidad nacional basada en X-Road',
        'CONECTA: national interoperability based on X-Road',
      ),
      estado: 'planificado',
      desde: '2026',
      descripcion: bilingue(
        'Proyecto de la Agencia Nacional de Gobierno Digital para construir una hoja de ruta y adoptar un modelo nacional de interoperabilidad basado en X-Road. Treinta instituciones participaron en el diagnóstico inicial.',
        'National Digital Government Agency project to build a roadmap and adopt a national interoperability model based on X-Road. Thirty institutions participated in the initial diagnostic exercise.',
      ),
      contexto: bilingue(
        'El lanzamiento ocurrió en marzo de 2026, no en 2025. CONECTA es infraestructura de gobierno digital, no un sistema de IA, y la participación de 30 instituciones corresponde al diagnóstico y la hoja de ruta, no a integraciones operativas.',
        'The launch took place in March 2026, not in 2025. CONECTA is digital-government infrastructure, not an AI system, and the involvement of 30 institutions refers to diagnosis and roadmap work, not operational integrations.',
      ),
    },
    quitarResultado: true,
  },

  'micitt-agroboost': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'programa-capacidades',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'operativo',
      estadoIA: 'declarada-sin-tecnica',
      evaluacion: evaluar({
        existencia: ['confirmado', 'micitt-agroboost-programa'],
        ejecucion: ['parcialmente-confirmado', 'micitt-agroboost-social'],
      }),
      fuentes: [
        fuente({
          id: 'micitt-agroboost-programa',
          tituloEs: 'Programas de formación empresarial del MICITT',
          tituloEn: 'MICITT business-training programs',
          url: 'https://www.micitt.go.cr/micitt/innovacion',
          publicador: 'MICITT',
          tipoFuente: 'primaria-oficial',
          respalda: ['existencia', 'objetivo-declarado', 'meta'],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado', 'meta'],
        }),
        fuente({
          id: 'micitt-agroboost-social',
          tituloEs: 'MICITT presenta AgroBoost en el Día de las Personas Agricultoras',
          tituloEn: "MICITT presents AgroBoost on Farmers' Day",
          url: 'https://www.facebook.com/micitcr/videos/en-el-d%C3%ADa-de-las-personas-agricultoras-costarricenses-reconocemos-c%C3%B3mo-la-innova/1275865677966444/',
          publicador: 'MICITT',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2026',
          respalda: ['existencia', 'ejecucion'],
          naturalezaAfirmacion: ['hecho'],
        }),
      ],
      fechaPrimeraEvidencia: '2025',
      fechaInicioOperacion: '2025',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Fortalecer competitividad, sostenibilidad y resiliencia de unidades productivas agrícolas mediante tecnologías de frontera.',
        'Strengthen the competitiveness, sustainability and resilience of agricultural production units through frontier technologies.',
      ),
      datosNoDeterminados: [
        bilingue(
          'No se localizaron documentos primarios reproducibles que describan el modelo de IA, la cifra de 86 productores o el aumento de productividad de 50%.',
          'No reproducible primary documents were found describing the AI model, the figure of 86 producers or a 50% productivity increase.',
        ),
      ],
      preguntasAbiertas: [
        bilingue(
          '¿Qué soluciones concretas implementaron las unidades participantes y qué métricas fueron medidas?',
          'What specific solutions did participating units implement, and what metrics were measured?',
        ),
      ],
    },
    legacy: {
      titulo: bilingue(
        'AgroBoost: tecnologías para unidades productivas agrícolas',
        'AgroBoost: technologies for agricultural production units',
      ),
      descripcion: bilingue(
        'Programa intensivo del MICITT para fortalecer unidades productivas agrícolas mediante tecnologías de frontera, asistencia técnica y transferencia de conocimiento. La información pública consultada no permite identificar un sistema de IA específico desplegado por el Estado.',
        'Intensive MICITT program to strengthen agricultural production units through frontier technologies, technical assistance and knowledge transfer. The public information reviewed does not identify a specific AI system deployed by the State.',
      ),
      contexto: bilingue(
        'Se clasifica como programa de capacidades. Se retiraron las cifras de 86 productores y 50% de productividad porque no se localizaron documentos primarios reproducibles que permitan atribuirlas y verificar su metodología.',
        'It is classified as a capacity-building program. Figures of 86 producers and a 50% productivity increase were removed because no reproducible primary documents were found to attribute them and verify their methodology.',
      ),
      fuenteUrl: 'https://www.micitt.go.cr/micitt/innovacion',
    },
    quitarResultado: true,
  },

  'ucr-citic-ia-software': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'investigacion',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'desarrollo',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'citic-ia-software-proyecto'],
        ejecucion: ['confirmado', 'citic-ia-software-proyecto'],
        tecnicaIA: ['confirmado', 'citic-ia-software-proyecto'],
        resultados: ['parcialmente-confirmado', 'citic-ia-software-proyecto'],
      }),
      fuentes: [
        fuente({
          id: 'citic-ia-software-proyecto',
          tituloEs:
            'Integración de estrategias de inteligencia artificial en procesos de ingeniería de software',
          tituloEn:
            'Integration of artificial-intelligence strategies into software-engineering processes',
          url: 'https://citic.ucr.ac.cr/proyectos/integracion-estrategias-inteligencia-artificial-procesos-ingenieria-software',
          publicador: 'CITIC, Universidad de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2025',
          respalda: [
            'existencia',
            'objetivo-declarado',
            'ejecucion',
            'tecnica-ia',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2025-03-01',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Diseñar y evaluar estrategias de IA para requisitos, generación y reparación de código, calidad y pruebas de software.',
        'Design and evaluate AI strategies for requirements, code generation and repair, quality and software testing.',
      ),
      resultadosVerificados: [
        {
          id: 'publicacion-pruebas-llm',
          texto: bilingue(
            'La ficha oficial asocia al proyecto una publicación de 2025 sobre generación automática de pruebas unitarias con modelos de lenguaje.',
            'The official project page links a 2025 publication on automatic unit-test generation with language models.',
          ),
          fuenteIds: ['citic-ia-software-proyecto'],
          fecha: '2025',
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'No se documenta un sistema de IA desplegado para prestar un servicio público.',
          'No AI system deployed to deliver a public service is documented.',
        ),
      ],
    },
    legacy: {
      desde: '2025',
      descripcion: bilingue(
        'Proyecto activo del CITIC-UCR, con vigencia de marzo de 2025 a febrero de 2028, para diseñar y evaluar estrategias de IA aplicadas a requisitos, generación y reparación de código, calidad y pruebas de software.',
        'Active CITIC-UCR project running from March 2025 to February 2028 to design and evaluate AI strategies for requirements, code generation and repair, quality and software testing.',
      ),
      resultado: bilingue(
        'La ficha oficial asocia al proyecto una publicación de 2025 sobre generación automática de pruebas unitarias con modelos de lenguaje.',
        'The official project page links a 2025 publication on automatic unit-test generation with language models.',
      ),
      contexto: bilingue(
        'Se corrigió la fuente: el estudio terciario sobre inundaciones no respaldaba esta descripción. La iniciativa es investigación académica activa, no adopción operativa en una institución pública.',
        'The source was corrected: the tertiary flood study did not support this description. The initiative is active academic research, not operational adoption in a public institution.',
      ),
      fuenteUrl:
        'https://citic.ucr.ac.cr/proyectos/integracion-estrategias-inteligencia-artificial-procesos-ingenieria-software',
    },
  },

  'ucr-ciodd-ethical-ai': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'politica-gobernanza',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'desarrollo',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'ucr-ethical-ai'],
        ejecucion: ['confirmado', 'ucr-ethical-ai'],
        resultados: ['parcialmente-confirmado', 'ucr-ethical-ai'],
      }),
      fuentes: [
        fuente({
          id: 'ucr-ethical-ai',
          tituloEs: 'Lanzamiento oficial del proyecto Ethical AI',
          tituloEn: 'Official launch of the Ethical AI project',
          url: 'https://ciodd.ucr.ac.cr/lanzamiento-oficial-del-proyecto-ethical-ia-compromiso-con-el-uso-etico-de-la-inteligencia-artificial',
          publicador: 'CIOdD, Universidad de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2025-08-25',
          respalda: [
            'existencia',
            'objetivo-declarado',
            'ejecucion',
            'resultado-reportado',
            'gobernanza',
          ],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2025-08-25',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Desarrollar capacidades y herramientas para el uso ético de IA en educación superior.',
        'Develop capabilities and tools for the ethical use of AI in higher education.',
      ),
      datosNoDeterminados: [
        bilingue(
          'Los resultados e impactos institucionales requieren fuentes adicionales para verificarse individualmente.',
          'Institutional results and impacts require additional sources for individual verification.',
        ),
      ],
    },
    legacy: {
      desde: '2025',
      resultado: bilingue(
        'El lanzamiento oficial reunió a más de 70 personas de universidades, equipos de investigación y autoridades académicas.',
        'The official launch brought together more than 70 participants from universities, research teams and academic authorities.',
      ),
      contexto: bilingue(
        'Se clasifica como iniciativa de política y gobernanza en educación superior. No corresponde a un sistema de IA desplegado para prestar un servicio público.',
        'It is classified as a policy and governance initiative in higher education. It is not an AI system deployed to deliver a public service.',
      ),
    },
  },

  'cenat-lania': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'programa-capacidades',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'planificado',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'micitt-lania-propuesta'],
      }),
      fuentes: [
        fuente({
          id: 'micitt-lania-propuesta',
          tituloEs: 'MICITT inicia formulación de estrategia de inteligencia artificial',
          tituloEn: 'MICITT begins formulating an artificial-intelligence strategy',
          url: 'https://www.micitt.go.cr/el-sector-informa/micitt-inicia-formulacion-de-estrategia-de-inteligencia-artificial',
          publicador: 'MICITT',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2023-02-27',
          respalda: ['existencia', 'objetivo-declarado', 'meta'],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado', 'meta'],
        }),
      ],
      fechaPrimeraEvidencia: '2023-02-27',
      fechaAnuncio: '2023-02-27',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Realizar capacitación, sensibilización, promoción y desarrollo de iniciativas de IA de alto impacto social.',
        'Conduct training, awareness, promotion and development of AI initiatives with high social impact.',
      ),
      datosNoDeterminados: [
        bilingue(
          'No se localizó evidencia posterior que confirme la puesta en operación de LaNIA como laboratorio nacional.',
          'No later evidence was found confirming that LaNIA entered operation as a national laboratory.',
        ),
      ],
      preguntasAbiertas: [
        bilingue(
          '¿La propuesta de LaNIA continuó después de su presentación en 2023 y cuenta con estructura, presupuesto o actividades propias?',
          'Did the LaNIA proposal continue after its 2023 presentation, and does it have its own structure, budget or activities?',
        ),
      ],
    },
    legacy: {
      titulo: bilingue(
        'LaNIA: Laboratorio Nacional de IA',
        'LaNIA: National AI Laboratory',
      ),
      estado: 'planificado',
      desde: '2023',
      descripcion: bilingue(
        'Propuesta de Laboratorio Nacional de Inteligencia Artificial presentada por CeNAT durante el inicio de la formulación de la estrategia nacional en febrero de 2023. Su objetivo declarado incluye formación, sensibilización y desarrollo de iniciativas de alto impacto.',
        'National Artificial Intelligence Laboratory proposal presented by CeNAT at the start of national-strategy formulation in February 2023. Its stated objectives include training, awareness and development of high-impact initiatives.',
      ),
      contexto: bilingue(
        'La fuente documenta la presentación de un plan piloto y una propuesta, no la operación del laboratorio. No se encontró una actualización pública que confirme su puesta en marcha.',
        'The source documents presentation of a pilot plan and proposal, not operation of the laboratory. No public update confirming its launch was found.',
      ),
    },
    quitarResultado: true,
  },

  'cenat-cnca-clasificacion-arritmias-ecg': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'investigacion',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'prueba-concepto',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'conare-cnca-ecg'],
        ejecucion: ['confirmado', 'conare-cnca-ecg'],
        tecnicaIA: ['confirmado', 'conare-cnca-ecg'],
        resultados: ['confirmado', 'conare-cnca-ecg'],
      }),
      fuentes: [
        fuente({
          id: 'conare-cnca-ecg',
          tituloEs: 'Clasificación multiclase de arritmias a partir de señales ECG',
          tituloEn: 'Multiclass arrhythmia classification from ECG signals',
          url: 'https://repositorio.conare.ac.cr/items/b8bb3b55-cc3c-402a-9df4-6fe66159230d',
          publicador: 'Repositorio CONARE',
          tipoFuente: 'academica',
          fechaPublicacion: '2024',
          respalda: [
            'existencia',
            'objetivo-declarado',
            'ejecucion',
            'tecnica-ia',
            'resultado-reportado',
          ],
          naturalezaAfirmacion: ['hecho', 'resultado-reportado'],
        }),
      ],
      fechaPrimeraEvidencia: '2024',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Evaluar aprendizaje automático para clasificar arritmias a partir de señales de electrocardiograma.',
        'Evaluate machine learning for classifying arrhythmias from electrocardiogram signals.',
      ),
      resultadosVerificados: [
        {
          id: 'prototipo-ecg-publicacion',
          texto: bilingue(
            'El repositorio académico documenta una publicación y un dispositivo prototipo para clasificación multiclase.',
            'The academic repository documents a publication and a prototype device for multiclass classification.',
          ),
          fuenteIds: ['conare-cnca-ecg'],
          fecha: '2024',
        },
      ],
      datosNoDeterminados: [
        bilingue(
          'No existe evidencia de validación clínica o uso en atención de pacientes.',
          'There is no evidence of clinical validation or use in patient care.',
        ),
      ],
    },
    legacy: {
      contexto: bilingue(
        'Se mantiene estrictamente como investigación y prueba de concepto. La publicación y el prototipo no equivalen a despliegue clínico.',
        'It remains strictly classified as research and proof of concept. The publication and prototype do not amount to clinical deployment.',
      ),
    },
  },

  'pj-sala-primera-induccion-ia': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'programa-capacidades',
      estadoCatalogo: 'ecosistema',
      faseImplementacion: 'desarrollo',
      estadoIA: 'declarada-sin-tecnica',
      evaluacion: evaluar({
        existencia: ['confirmado', 'pj-sala-primera-induccion'],
        ejecucion: ['confirmado', 'pj-sala-primera-induccion'],
      }),
      fuentes: [
        fuente({
          id: 'pj-sala-primera-induccion',
          tituloEs:
            'Sala Primera reduce casos pendientes y menciona proceso de inducción en IA',
          tituloEn:
            'First Chamber reduces pending cases and mentions an AI induction process',
          url: 'https://pj.poder-judicial.go.cr/index.php/component/content/article/2137-sala-primera-reduce-en-60-casos-pendientes-y-alcanza-cifra-record-de-resoluciones-de-fondo',
          publicador: 'Poder Judicial de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2026-07-17',
          respalda: ['existencia', 'objetivo-declarado', 'ejecucion'],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado'],
        }),
      ],
      fechaPrimeraEvidencia: '2026-07-17',
      fechaUltimaVerificacion: FECHA_CORTE,
      objetivoDeclarado: bilingue(
        'Formar al personal de la Sala Primera en uso de indicaciones para herramientas de IA como apoyo.',
        'Train First Chamber staff in prompting AI tools for support.',
      ),
      datosNoDeterminados: [
        bilingue(
          'No se anunció sistema, proveedor, cronograma de despliegue ni métricas.',
          'No system, vendor, deployment schedule or metrics were announced.',
        ),
      ],
    },
    legacy: {
      contexto: bilingue(
        'La fuente documenta un proceso de inducción, no un sistema de IA. La reducción de casos que da título al comunicado ocurrió antes y no se atribuye a esta capacitación.',
        'The source documents an induction process, not an AI system. The case reduction in the release title predates the training and is not attributed to it.',
      ),
    },
    quitarResultado: true,
  },

  'pj-conamaj-chat-facilitadores': {
    evidencia: {
      modeloVersion: MODELO_EVIDENCIA_VERSION,
      tipoIniciativa: 'sistema-ia',
      estadoCatalogo: 'seguimiento',
      faseImplementacion: 'prueba-concepto',
      estadoIA: 'confirmada',
      evaluacion: evaluar({
        existencia: ['confirmado', 'pj-conamaj-chat-2026'],
        ejecucion: ['parcialmente-confirmado', 'pj-conamaj-chat-2026'],
        tecnicaIA: ['confirmado', 'pj-conamaj-chat-2026'],
      }),
      fuentes: [
        fuente({
          id: 'pj-conamaj-chat-2026',
          tituloEs:
            'Agenda Conamaj 2026: vitrina de aplicaciones de inteligencia artificial en el sector justicia',
          tituloEn:
            'CONAMAJ 2026 agenda: a showcase of artificial-intelligence applications in the justice sector',
          url: 'https://pj.poder-judicial.go.cr/index.php/component/content/article/2317-agenda-conamaj-2026-vitrina-de-aplicaciones-de-inteligencia-artificial-en-sector-justicia',
          publicador: 'Poder Judicial de Costa Rica',
          tipoFuente: 'primaria-oficial',
          fechaPublicacion: '2026-08',
          respalda: ['existencia', 'objetivo-declarado', 'ejecucion', 'tecnica-ia'],
          naturalezaAfirmacion: ['hecho', 'objetivo-declarado'],
        }),
      ],
      fechaPrimeraEvidencia: '2026-08',
      fechaAnuncio: '2026-08',
      fechaUltimaVerificacion: FECHA_CORTE,
      fechaProximaRevision: PROXIMA_REVISION,
      objetivoDeclarado: bilingue(
        'Apoyar a personas facilitadoras judiciales en consultas y orientación jurídica mediante un chat basado en un modelo de lenguaje.',
        'Support judicial facilitators with queries and legal guidance through a language-model chat.',
      ),
      datosConocidos: [
        bilingue(
          'La fuente oficial confirma la existencia de un chat tipo LLM y su presentación en una feria de aplicaciones.',
          'The official source confirms the existence of an LLM-based chat and its presentation at an applications fair.',
        ),
      ],
      datosNoDeterminados: [
        bilingue(
          'No se publican proveedor, usuarios activos, cobertura, salvaguardas ni resultados medidos.',
          'The vendor, active users, coverage, safeguards and measured results are not published.',
        ),
      ],
      relaciones: [
        {
          iniciativaId: 'pj-chatbot',
          tipo: 'distinto-de',
          nota: bilingue(
            'Este chat está dirigido a personas facilitadoras judiciales; ChatbotPJ atiende consultas generales de la ciudadanía.',
            'This chat targets judicial facilitators; ChatbotPJ handles general public queries.',
          ),
        },
      ],
    },
    legacy: {
      descripcion: bilingue(
        'Chat tipo modelo de lenguaje presentado por CONAMAJ para apoyar a personas facilitadoras judiciales en consultas y orientación jurídica. La fuente confirma su existencia y demostración, pero no un despliegue operativo con usuarios medidos.',
        'Language-model chat presented by CONAMAJ to support judicial facilitators with queries and legal guidance. The source confirms its existence and demonstration, but not an operational deployment with measured users.',
      ),
      contexto: bilingue(
        'Se registra como prueba de concepto en seguimiento. La presentación en una feria institucional no basta para afirmar que existe un piloto operativo o resultados de uso.',
        'It is recorded as a proof of concept under review. Presentation at an institutional fair is not enough to claim an operational pilot or usage results.',
      ),
      fuenteUrl:
        'https://pj.poder-judicial.go.cr/index.php/component/content/article/2317-agenda-conamaj-2026-vitrina-de-aplicaciones-de-inteligencia-artificial-en-sector-justicia',
    },
    quitarResultado: true,
  },
} satisfies Record<string, Migracion>;

const proyectos = JSON.parse(readFileSync(DATA_URL, 'utf8')) as Proyecto[];
const idsCatalogo = new Set(proyectos.map((proyecto) => proyecto.id));
const idsMigracion = Object.keys(migraciones);

const faltantes = proyectos
  .map((proyecto) => proyecto.id)
  .filter((id) => !(id in migraciones));
const sobrantes = idsMigracion.filter((id) => !idsCatalogo.has(id));

if (faltantes.length > 0 || sobrantes.length > 0) {
  throw new Error(
    'La migración no cubre exactamente el catálogo. Faltantes: ' +
      faltantes.join(', ') +
      '. Sobrantes: ' +
      sobrantes.join(', '),
  );
}

const migrados = proyectos.map((proyecto) => {
  const migracion = migraciones[proyecto.id as keyof typeof migraciones];
  const actualizado: Proyecto = {
    ...proyecto,
    ...migracion.legacy,
    ...migracion.evidencia,
  };

  if (migracion.quitarResultado) delete actualizado.resultado;
  return actualizado;
});

writeFileSync(DATA_URL, JSON.stringify(migrados, null, 2) + '\n');
console.log('Migradas ' + migrados.length + ' iniciativas al modelo de evidencia v2.');
