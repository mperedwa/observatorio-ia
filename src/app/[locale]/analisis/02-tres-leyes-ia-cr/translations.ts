export const t = {
  es: {
    meta: {
      seriesLabel: 'Estado y Algoritmo · N.° 02',
      title: 'Costa Rica tiene tres leyes de IA esperando. Ninguna fue convocada.',
      description: 'Análisis técnico comparativo de los tres expedientes de regulación de IA en la Asamblea Legislativa de Costa Rica: estado procesal, arquitecturas institucionales incompatibles, posición documentada del MICITT, y comparativa internacional.',
      date: '21 de mayo de 2026',
      author: 'Mario Pérez Edwards',
      org: 'Observatorio IA Costa Rica',
    },

    breadcrumb: {
      home: 'Inicio',
      analysis: 'Análisis',
      current: 'Tres leyes de IA · Mayo 2026',
    },

    theme: {
      toDark: 'Activar modo oscuro',
      toLight: 'Activar modo claro',
    },

    sections: {
      resumen: 'Resumen',
      comparativa: 'Comparativa',
      micitt: 'Posición MICITT',
      riesgo: 'Análisis de riesgo',
      modelos: 'Modelos internacionales',
      recomendaciones: 'Componentes clave',
      fuentes: 'Fuentes',
    },

    summary: {
      heading: 'Resumen ejecutivo',
      bullets: [
        'Costa Rica tiene <strong>tres expedientes de regulación de IA activos</strong> en la Asamblea Legislativa (23.771, 23.919, 24.484). Ninguno fue convocado por el gobierno Fernández en las sesiones extraordinarias de mayo 2026.',
        'Los tres proponen <strong>arquitecturas institucionales incompatibles entre sí</strong>: 23.771 crea la ARIA (autoridad independiente nueva); 23.919 y 24.484 designan al MICITT como rector, pero con alcances distintos. La aprobación simultánea sin armonización generaría dos reguladores paralelos con mandatos superpuestos.',
        'Análisis técnico Sirius-Lex: <strong>57 hallazgos de riesgo</strong> en los tres textos (15 críticos, 32 moderados, 10 sin riesgo) y <strong>24 impactos normativos</strong> sobre legislación vigente.',
        'El MICITT <strong>se opone técnicamente</strong> a los textos actuales desde mayo 2023. Su posición ha evolucionado: de pedir cautela (2023) a declarar los proyectos demasiado amplios (2025) a favorecer el modelo de autorregulación estadounidense (abril 2026).',
        'Dos expedientes con dictamen afirmativo (23.771 y 23.919) <strong>pueden avanzar en sesiones ordinarias</strong> sin convocatoria del Ejecutivo.',
      ],
    },

    metrics: {
      expedientes: { value: '3', label: 'Expedientes activos', sub: 'Asamblea Legislativa CR' },
      claims: { value: '38', label: 'Claims verificadas', sub: 'Precisión verificador: 83%' },
      hallazgos: { value: '57', label: 'Hallazgos de riesgo', sub: '15 críticos · 32 moderados · 10 sin riesgo' },
      impactos: { value: '24', label: 'Impactos normativos', sub: '11 alta severidad · 10 media · 3 baja' },
      convocados: { value: '0', label: 'Expedientes IA convocados', sub: 'De 62 proyectos en convocatoria Fernández' },
    },

    comparativa: {
      sectionTitle: 'Los tres expedientes: comparativa',
      intro: 'Costa Rica tiene tres expedientes de regulación de IA activos en la Asamblea Legislativa, con distintos estados procesales y enfoques filosóficos. Los tres coexisten sin que ninguno haya avanzado a ley.',
      tableHeaders: ['', 'Exp. 23.771', 'Exp. 23.919', 'Exp. 24.484'],
      rows: [
        {
          field: 'Nombre',
          v1: 'Ley de Regulación de la IA en Costa Rica',
          v2: 'Ley para la Promoción Responsable de la IA',
          v3: 'Ley para la Implementación de Sistemas de IA',
        },
        {
          field: 'Proponente',
          v1: 'Diputada Vanessa De Paul Castro Mora (PUSC)',
          v2: 'Diputado Óscar Izquierdo Sandí (PLN)',
          v3: 'Diputada Johana Obando Bonilla (Partido Liberal Progresista)',
        },
        {
          field: 'Presentación',
          v1: 'May. 2023',
          v2: 'Sep. 2023',
          v3: 'Ago. 2024',
        },
        {
          field: 'Texto vigente',
          v1: 'Dictamen sep. 2024',
          v2: 'Sustitutivo mar. 2025 (27 págs.)',
          v3: 'Sustitutivo oct. 2025 (16 arts. + Transitorio Único)',
        },
        {
          field: 'Estado',
          v1: 'En comisión (devuelto tras plenario)',
          v2: 'Dictaminado — listo para debate en plenario',
          v3: 'Dictaminado',
        },
        {
          field: 'Autoridad propuesta',
          v1: 'ARIA — Autoridad Reguladora de IA (nueva, independiente)',
          v2: 'MICITT rector (institución existente)',
          v3: 'MICITT rector (institución existente)',
        },
        {
          field: 'Filosofía regulatoria',
          v1: 'Regulación estricta',
          v2: 'Fomento regulado',
          v3: 'Restricciones específicas',
        },
        {
          field: 'Sandboxes',
          v1: 'No',
          v2: 'Sí',
          v3: 'No',
        },
        {
          field: 'Nota clave',
          v1: 'Redactado con asistencia de ChatGPT-4 (Bloomberg Línea, 31 may. 2023). Revisores humanos corrigieron errores.',
          v2: 'Técnicamente el más avanzado. Alineado con principios OCDE y valores UNESCO.',
          v3: 'Art. 8 prohíbe: scoring social estatal, manipulación subliminal en grupos vulnerables, automatización exclusiva en decisiones judiciales.',
        },
      ],
      source: 'Fuente: Asamblea Legislativa CR, fichas Delfino.cr mayo 2026.',
    },

    cronologiaMICITT: {
      sectionTitle: 'Posición del MICITT: cronología documentada',
      intro: 'La posición del gobierno frente a los tres expedientes no es silencio ni indiferencia. Es oposición técnica documentada, sostenida durante dos años y medio, con argumentos que han evolucionado.',
      events: [
        {
          date: '31 de mayo de 2023',
          title: 'Cautela como señal temprana',
          body: 'La ministra Paula Bogantes Zamora cuestiona la metodología del Expediente 23.771, redactado con asistencia de ChatGPT-4. Pide cautela en el uso de IA para redactar legislación y señala que el equipo redactor no consultó al MICITT. La ministra de la Presidencia Natalia Díaz Quintana coincide: un proyecto técnico de esa naturaleza debería haber incorporado criterios del MICITT desde el inicio.',
          source: 'Fuente: Semanario Universidad, 31 mayo 2023',
        },
        {
          date: 'Octubre 2024',
          title: 'Regulación "prematura"',
          body: 'La ministra Bogantes Zamora declara prematuro avanzar en ese momento con un proyecto de ley de IA. Establece orden de prioridades: primero actualizar la Ley de Protección de Datos y la legislación de ciberseguridad, y solo entonces considerar regulación específica de IA.',
          source: 'Fuente: CRHoy, 29 octubre 2024',
        },
        {
          date: '29-30 de enero de 2025',
          title: 'Oposición técnica explícita',
          body: 'Delegación del MICITT comparece ante la mesa de trabajo convocada por la diputada Obando Bonilla. El director de Investigación, Desarrollo e Innovación del MICITT, Marlon Avalos Elizondo, declara:',
          quotes: [
            '"Desde la óptica del MICITT, ni el país ni el mundo están preparados para emitir una legislación que podría quedar obsoleta incluso antes de su publicación, lo que se convierte en un riesgo para la oportunidad que tiene el país de liderar el despliegue de esta tecnología y limitar los avances que hemos estado alcanzando."',
            '"Se establece una regulación previa, que nosotros consideramos muy amplia. Esto podría afectar cualquier implementación."',
          ],
          source: 'Fuentes: DPL News, 30 enero 2025; Semanario Universidad, 29 enero 2025',
        },
        {
          date: '6 de abril de 2026',
          title: 'Giro hacia el modelo estadounidense',
          body: 'La ministra Bogantes Zamora comparece ante la comisión legislativa. En un cambio notable respecto a la ENIA 2024-2027 (que tomó el EU AI Act como referencia), critica el modelo europeo y señala favorablemente el modelo estadounidense:',
          quotes: [
            '"Ya ellos publicaron y están en proceso de implementación del AI Act, bastante restrictivo en la aplicación de la IA en territorio europeo."',
            '"Más bien están limitando la sobrerregulación para buscar mayor y más rápida implementación de la IA."',
          ],
          reaction: 'El abogado Juan Esteban Durango advirtió: "La parte desprotegida es el usuario." El filósofo Luis Arturo Martínez Vásquez (UCR) señaló: "En el modelo europeo las instituciones regulan a las empresas; en el modelo estadounidense, las empresas se autorregulan."',
          source: 'Fuente: Semanario Universidad, 15 abril 2026',
        },
      ],
      paradox: {
        title: 'La paradoja central',
        body: 'El MICITT que se opone a los proyectos de ley es el mismo MICITT que elaboró la ENIA 2024-2027, que dice explícitamente que Costa Rica necesita un marco normativo. La ENIA incluye el "marco normativo" como uno de sus cinco ejes estratégicos. La diferencia: la ENIA es voluntaria, no vinculante. Los proyectos de ley son obligatorios. El MICITT prefiere el instrumento que controla (la estrategia) sobre el instrumento que no controla (la ley aprobada por la Asamblea).',
      },
    },

    riesgo: {
      sectionTitle: 'Análisis de riesgo técnico (Sirius-Lex)',
      methodNote: 'Análisis comparativo de los tres textos vigentes realizado en mayo de 2026 con Sirius-Lex, sistema de agentes de IA para análisis legislativo comparativo con trazabilidad de citas y revisión constitucional. Precisión del verificador: 83%. Trazabilidad completa: 96%. Sin citas inventadas.',
      claims: {
        label: 'Claims verificadas',
        value: '38',
        breakdown: '20 verificadas contra corpus legal costarricense · 14 pendientes de verificación adicional · 4 con referencias contradictorias',
      },
      hallazgos: {
        label: 'Hallazgos de riesgo por severidad',
        total: 57,
        items: [
          { level: 'Crítico', color: 'rojo', count: 15, description: 'Requieren corrección antes de aprobación' },
          { level: 'Moderado', color: 'amarillo', count: 32, description: 'Requieren revisión y ajuste' },
          { level: 'Sin riesgo', color: 'verde', count: 10, description: 'Sin riesgo identificado' },
        ],
      },
      impactos: {
        label: 'Impactos normativos sobre legislación vigente',
        total: 24,
        breakdown: '11 alta severidad · 10 media · 3 baja',
      },
      hallazgoPrincipal: {
        title: 'Hallazgo principal: arquitecturas institucionales incompatibles',
        body: 'El hallazgo más relevante emergió al analizar los tres expedientes en conjunto: los tres proponen arquitecturas institucionales incompatibles entre sí. El 23.771 crea una autoridad nueva e independiente (ARIA). El 23.919 designa al MICITT existente como rector. El 24.484 también designa al MICITT, pero con alcance y lógica distintos. Si se aprobaran los tres sin armonización, Costa Rica tendría dos reguladores paralelos con mandatos superpuestos y sin jerarquía definida.',
        note: 'Esto no es un problema de redacción. Es un problema de arquitectura institucional. Los tres proyectos fueron diseñados de forma independiente, sin coordinación entre los equipos proponentes. La Comisión de Ciencia y Tecnología convocó una mesa de trabajo en enero de 2025 para explorar la armonización. Los resultados no están documentados en fuentes públicas.',
      },
      dataSource: 'Datos del análisis comparativo Sirius-Lex MVP-A, mayo 2026. Disponible bajo solicitud.',
    },

    modelosInternacionales: {
      sectionTitle: 'El debate global: tres modelos con resultados observables',
      intro: 'El debate sobre regulación de IA no es entre "regular" o "no regular". Es entre tres modelos distintos que ya existen.',
      models: [
        {
          region: 'Unión Europea',
          name: 'EU AI Act',
          reference: 'Reglamento (UE) 2024/1689',
          status: 'Vigente',
          since: '1 de agosto de 2024',
          approach: 'Regulación por niveles de riesgo',
          description: 'Cuatro niveles: Prohibido (scoring social, manipulación cognitiva, identificación biométrica en tiempo real, predicción de crímenes) · Alto riesgo (salud, educación, empleo, justicia — obligaciones estrictas desde agosto 2026) · Riesgo limitado (transparencia) · Riesgo mínimo (sin restricciones).',
          sanctions: 'Hasta €35M o 7% de la facturación global anual por infracciones a las prohibiciones.',
          crContext: 'La ministra Bogantes lo calificó de "bastante restrictivo" en abril 2026. El AI Act no restringe la mayoría de aplicaciones: riesgo mínimo y limitado cubren la gran mayoría de los usos.',
        },
        {
          region: 'Estados Unidos',
          name: 'Modelo de autorregulación',
          reference: 'EO 14179 (Trump, 23 ene. 2025)',
          status: 'Sin ley federal',
          since: 'Enero 2025',
          approach: 'Innovación primero, mínima carga regulatoria',
          description: 'EO 14179 revocó la EO 14110 de Biden (oct. 2023), que establecía estándares de seguridad y protecciones para consumidores. Sin ley federal de aplicación general. Mosaico regulatorio estatal: Colorado, California y Nueva York tienen legislación activa. NIST AI Risk Management Framework adoptado voluntariamente.',
          sanctions: 'Sin sanciones federales unificadas.',
          crContext: 'El modelo que señaló favorablemente la ministra Bogantes en abril 2026. Es un modelo en transición activa y polarización política — no un referente estable. Los propios estados lo están compensando con legislación propia.',
        },
        {
          region: 'Uruguay',
          name: 'Sandboxes primero',
          reference: 'Decreto 276/025',
          status: 'Vigente',
          since: '2 de diciembre de 2025',
          approach: 'Entornos de prueba regulatorios, ley posterior',
          description: 'Decreto crea "espacios controlados de prueba" donde proyectos de IA pueden operar sin obstáculos de regulaciones no diseñadas para estas tecnologías. Plazo máximo de 2 años por entorno. Requiere evaluaciones de impacto en protección de datos. No puede violar disposiciones constitucionales ni obligaciones de derechos humanos. Comité Técnico presidido por AGESIC supervisa el proceso. AGESIC prepara una futura ley.',
          sanctions: 'N/A (decreto de habilitación, no regulación punitiva).',
          crContext: 'El modelo más transferible al contexto costarricense. El Expediente 23.919 ya propone este mecanismo. No es una idea ajena al debate costarricense.',
        },
        {
          region: 'Brasil',
          name: 'Marco Legal de IA',
          reference: 'PL 2.338/2023',
          status: 'En trámite',
          since: 'Aprobado Senado: diciembre 2024',
          approach: 'Regulación por riesgo con derechos de autor',
          description: 'Aprobado por el Senado Federal en diciembre de 2024. Sigue en análisis en la Cámara de Diputados. Incluye clasificación por riesgo, prohibiciones, derechos de autor para contenido de entrenamiento de modelos, y sanciones de hasta R$50M o 2% de la facturación anual.',
          sanctions: 'Hasta R$50M o 2% de la facturación anual.',
          crContext: 'Primer país de LATAM en aprobar su marco en el Senado. Referencia directa para el debate costarricense sobre prohibiciones y derechos.',
        },
        {
          region: 'Chile',
          name: 'Proyecto de Ley de IA',
          reference: 'Boletín 16821-19',
          status: 'En trámite',
          since: 'Cámara: octubre 2025 · Senado: en proceso',
          approach: 'Enfoque de Estado transversal (10 ministerios)',
          description: 'Presentado por el gobierno de Boric con participación de diez ministerios. Aprobado por la Cámara de Diputados en octubre de 2025. Sigue en segundo trámite en el Senado.',
          sanctions: 'Por definir en texto final.',
          crContext: 'Señal de enfoque de Estado: cuando 10 ministerios participan en un proyecto, hay coordinación institucional real. Contrasta con el proceso costarricense donde los proyectos surgieron sin coordinación entre el Ejecutivo y los proponentes.',
        },
      ],
      centroamerica: 'El IPANDETEC confirma que ningún país de Centroamérica ha aprobado legislación específica de IA. Costa Rica, que se presenta como líder en gobernanza digital en la región, no tiene ninguna ley de IA vigente.',
    },

    recomendaciones: {
      sectionTitle: 'Componentes de una primera regulación viable',
      intro: 'El problema central en Costa Rica hoy no es que haya demasiada IA sin regular. Es que el sector público ya opera sistemas de IA sin marco legal claro. Una primera regulación útil debería resolver exactamente eso.',
      items: [
        {
          number: '01',
          title: 'Definir el perímetro del sector público',
          body: 'La regulación más urgente no es la de IA en general, sino la de IA usada por el Estado para tomar o informar decisiones que afectan derechos de personas: sistemas de selección de beneficiarios de programas sociales, modelos predictivos en salud pública, algoritmos de priorización en listas de espera, herramientas de análisis de riesgo en materia fiscal o judicial. Estas aplicaciones ya existen y operan sin rendición de cuentas específica.',
        },
        {
          number: '02',
          title: 'Registro mínimo obligatorio',
          body: 'Toda institución pública que opere un sistema de IA que afecte directamente derechos de personas debe declararlo: qué hace el sistema, quién lo opera, sobre qué población actúa, con qué indicadores se evalúa, y quién tiene supervisión humana. No requiere crear un organismo nuevo. Puede ser una obligación de transparencia administrada por la Defensoría de los Habitantes o la Contraloría General de la República.',
        },
        {
          number: '03',
          title: 'Tres prohibiciones claras y específicas',
          body: 'El Expediente 24.484 ya las incluye en su sustitutivo: (1) scoring social estatal, (2) manipulación subliminal en grupos vulnerables, (3) automatización exclusiva en decisiones judiciales sin participación humana efectiva. Son técnicamente defendibles, políticamente no controversiales y alineadas con el AI Act europeo. Son el mínimo razonable.',
        },
        {
          number: '04',
          title: 'Sandboxes regulatorios',
          body: 'El Expediente 23.919 los incluye. Uruguay los aprobó en diciembre de 2025. Permiten que la CCSS escale LIDIA, que el Poder Judicial pilote análisis de expedientes, y que empresas privadas desarrollen soluciones en condiciones controladas sin quedar en un limbo legal. Es el mecanismo que convierte la estrategia (ENIA) en ejecución.',
        },
        {
          number: '05',
          title: 'No crear una nueva autoridad todavía',
          body: 'El MICITT ya existe. La Contraloría ya existe. Crear la ARIA antes de saber exactamente qué va a regular implica diseñar la burocracia antes que el problema. El modelo de designar al MICITT como rector con mandato reforzado es más eficiente. Si en tres años el volumen de regulación justifica una autoridad independiente, ese es el momento de crearla.',
        },
      ],
      synthesis: 'Una primera regulación corta, específica para el sector público, construida sobre lo que los tres textos tienen en común, y aprobable con el consenso mínimo disponible. No tiene que resolver todo. Tiene que resolver lo urgente.',
    },

    fuentes: {
      sectionTitle: 'Fuentes y referencias',
      groups: [
        {
          label: 'Documentos oficiales y fuentes primarias',
          items: [
            'Asamblea Legislativa de Costa Rica: Expedientes 23.771, 23.919 y 24.484 (fichas Delfino.cr, mayo 2026)',
            'Texto sustitutivo Exp. 23.919 (6 mar. 2025): Comisión Permanente Especial de Derechos Humanos',
            'Texto sustitutivo Exp. 24.484 (23 oct. 2025): Comisión Permanente Especial de Ciencia, Tecnología y Educación',
            'TEC SCI-662-2025 (ago. 2025) y SCI-361-2025 (may. 2025)',
            'MICITT: Estrategia Nacional de IA (ENIA) 2024-2027',
            'Reglamento (UE) 2024/1689 — EU AI Act (vigente 1 ago. 2024)',
            'EO 14179 Trump (23 ene. 2025): revocación EO 14110 Biden',
            'Senado Federal Brasil: aprobación PL 2.338/2023 (10 dic. 2024)',
            'Senado Chile: Boletín 16821-19 (en trámite)',
            'Decreto 276/025: sandboxes IA Uruguay (2 dic. 2025) — https://www.impo.com.uy/bases/decretos/276-2025',
          ],
        },
        {
          label: 'Prensa y análisis',
          items: [
            'Semanario Universidad (29 ene. 2025): citas textuales Marlon Avalos Elizondo, Dir. I+D+i MICITT',
            'DPL News (30 ene. 2025): cita textual Marlon Avalos Elizondo, Dir. I+D+i MICITT',
            'CRHoy (29 oct. 2024): declaraciones ministra Paula Bogantes Zamora',
            'Semanario Universidad (15 abr. 2026): giro MICITT hacia modelo EEUU',
            'Semanario Universidad (31 may. 2023): posición inicial MICITT sobre Exp. 23.771',
            'Teletica (15 mar. 2025): posición CAMTIC y Cámara de Comercio',
            'El Financiero CR (19 mar. 2025): análisis tres proyectos',
            'Infobae CR (13 may. 2026): convocatoria 62 proyectos gobierno Fernández',
            'Bloomberg Línea (31 may. 2023): Exp. 23.771 redactado con ChatGPT-4',
            'IPANDETEC (2025): Tendencias Legislativas IA Centroamérica',
            'Cooperativa.cl (13 oct. 2025): aprobación Cámara Diputados Chile',
            'Diario Constitucional Chile (23 feb. 2026): estado Senado',
          ],
        },
        {
          label: 'Análisis técnico propio',
          items: [
            'Sirius-Lex análisis comparativo MVP-A (mayo 2026): 38 claims, 57 hallazgos de riesgo clasificados — disponible bajo solicitud',
          ],
        },
      ],
    },

    footer: {
      bio: '<strong>Mario Pérez Edwards</strong> es analista de políticas de inteligencia artificial y fundador del Observatorio IA Costa Rica.',
      cadence: 'Análisis publicado el 21 de mayo de 2026.',
      orgLabel: 'Observatorio IA Costa Rica',
    },
  },

  en: {
    meta: {
      seriesLabel: 'Estado y Algoritmo · No. 02',
      title: 'Costa Rica has three AI bills waiting. None was summoned.',
      description: 'Technical comparative analysis of Costa Rica\'s three active AI regulation bills in the Legislative Assembly: procedural status, incompatible institutional architectures, documented MICITT opposition, and international comparison.',
      date: 'May 21, 2026',
      author: 'Mario Pérez Edwards',
      org: 'Observatorio IA Costa Rica',
    },

    breadcrumb: {
      home: 'Home',
      analysis: 'Analysis',
      current: 'Three AI Bills · May 2026',
    },

    theme: {
      toDark: 'Switch to dark mode',
      toLight: 'Switch to light mode',
    },

    sections: {
      resumen: 'Summary',
      comparativa: 'Comparison',
      micitt: 'MICITT Position',
      riesgo: 'Risk Analysis',
      modelos: 'International Models',
      recomendaciones: 'Key Components',
      fuentes: 'Sources',
    },

    summary: {
      heading: 'Executive Summary',
      bullets: [
        'Costa Rica has <strong>three active AI regulation bills</strong> in the Legislative Assembly (23.771, 23.919, 24.484). None was summoned by the Fernández government for the May 2026 extraordinary sessions.',
        'The three bills propose <strong>mutually incompatible institutional architectures</strong>: 23.771 creates ARIA (a new independent authority); 23.919 and 24.484 designate MICITT as regulator, but with different scopes. Simultaneous approval without harmonization would create two parallel regulators with overlapping mandates.',
        'Sirius-Lex technical analysis: <strong>57 risk findings</strong> across the three texts (15 critical, 32 moderate, 10 no-risk) and <strong>24 normative impacts</strong> on existing legislation.',
        'MICITT has <strong>technically opposed</strong> the current texts since May 2023. Its position evolved: from calling for caution (2023) to declaring the bills too broad (2025) to favoring the U.S. self-regulation model (April 2026).',
        'Two bills with affirmative committee reports (23.771 and 23.919) <strong>can advance in ordinary sessions</strong> without Executive summons.',
      ],
    },

    metrics: {
      expedientes: { value: '3', label: 'Active bills', sub: 'Costa Rica Legislative Assembly' },
      claims: { value: '38', label: 'Verified claims', sub: 'Verifier accuracy: 83%' },
      hallazgos: { value: '57', label: 'Risk findings', sub: '15 critical · 32 moderate · 10 no-risk' },
      impactos: { value: '24', label: 'Normative impacts', sub: '11 high severity · 10 medium · 3 low' },
      convocados: { value: '0', label: 'AI bills summoned', sub: 'Out of 62 projects in the Fernández call' },
    },

    comparativa: {
      sectionTitle: 'The Three Bills: Comparison',
      intro: 'Costa Rica has three active AI regulation bills in the Legislative Assembly, with different procedural statuses and regulatory philosophies. All three coexist without any having advanced to law.',
      tableHeaders: ['', 'Bill 23.771', 'Bill 23.919', 'Bill 24.484'],
      rows: [
        {
          field: 'Name',
          v1: 'Law on AI Regulation in Costa Rica',
          v2: 'Law for the Responsible Promotion of AI',
          v3: 'Law for the Implementation of AI Systems',
        },
        {
          field: 'Sponsor',
          v1: 'Rep. Vanessa De Paul Castro Mora (PUSC)',
          v2: 'Rep. Óscar Izquierdo Sandí (PLN)',
          v3: 'Rep. Johana Obando Bonilla (Liberal Progressive Party)',
        },
        {
          field: 'Introduced',
          v1: 'May 2023',
          v2: 'Sep. 2023',
          v3: 'Aug. 2024',
        },
        {
          field: 'Current text',
          v1: 'Committee report Sep. 2024',
          v2: 'Substitute text Mar. 2025 (27 pp.)',
          v3: 'Substitute text Oct. 2025 (16 arts. + single transitional provision)',
        },
        {
          field: 'Status',
          v1: 'In committee (returned after plenary)',
          v2: 'Reported — ready for plenary debate',
          v3: 'Reported',
        },
        {
          field: 'Proposed authority',
          v1: 'ARIA — AI Regulatory Authority (new, independent)',
          v2: 'MICITT as regulator (existing institution)',
          v3: 'MICITT as regulator (existing institution)',
        },
        {
          field: 'Regulatory philosophy',
          v1: 'Strict regulation',
          v2: 'Regulated promotion',
          v3: 'Specific restrictions',
        },
        {
          field: 'Regulatory sandboxes',
          v1: 'No',
          v2: 'Yes',
          v3: 'No',
        },
        {
          field: 'Key note',
          v1: 'Drafted with ChatGPT-4 assistance (Bloomberg Línea, May 31, 2023). Human reviewers corrected errors.',
          v2: 'Technically the most advanced. Aligned with OECD principles and UNESCO values.',
          v3: 'Art. 8 prohibits: state social scoring, subliminal manipulation of vulnerable groups, exclusive AI-based judicial decisions without human involvement.',
        },
      ],
      source: 'Source: Costa Rica Legislative Assembly, Delfino.cr records May 2026.',
    },

    cronologiaMICITT: {
      sectionTitle: 'MICITT Position: Documented Timeline',
      intro: 'The government\'s position on the three bills is not silence or indifference. It is documented technical opposition, sustained over two and a half years, with arguments that have evolved.',
      events: [
        {
          date: 'May 31, 2023',
          title: 'Early caution signal',
          body: 'Minister Paula Bogantes Zamora questions the methodology of Bill 23.771, drafted with ChatGPT-4 assistance. She calls for caution in using AI to draft legislation and notes that the drafting team did not consult MICITT. Minister of the Presidency Natalia Díaz Quintana agrees: a technical project of this nature should have incorporated MICITT criteria from the outset.',
          source: 'Source: Semanario Universidad, May 31, 2023',
        },
        {
          date: 'October 2024',
          title: '"Premature" regulation',
          body: 'Minister Bogantes Zamora declares it premature to advance with an AI bill at that time. She establishes a priority order: first update the Data Protection Law and cybersecurity legislation, and only then consider specific AI regulation.',
          source: 'Source: CRHoy, October 29, 2024',
        },
        {
          date: 'January 29–30, 2025',
          title: 'Explicit technical opposition',
          body: 'A MICITT delegation appears before the working group convened by Rep. Obando Bonilla. MICITT\'s Director of Research, Development and Innovation, Marlon Avalos Elizondo, states:',
          quotes: [
            '"From MICITT\'s perspective, neither the country nor the world is ready to issue legislation that could become obsolete even before it is published, which becomes a risk to the country\'s opportunity to lead the deployment of this technology and limit the progress we have been achieving."',
            '"A prior regulation is being established that we consider too broad. This could affect any implementation."',
          ],
          source: 'Sources: DPL News, January 30, 2025; Semanario Universidad, January 29, 2025',
        },
        {
          date: 'April 6, 2026',
          title: 'Shift toward the U.S. model',
          body: 'Minister Bogantes Zamora appears before the legislative commission. In a notable shift from the ENIA 2024-2027 (which used the EU AI Act as a reference), she criticizes the European model and signals favor for the U.S. approach:',
          quotes: [
            '"They have already published and are in the process of implementing the AI Act, which is quite restrictive in the application of AI in European territory."',
            '"Rather, they are limiting over-regulation to seek greater and faster implementation of AI."',
          ],
          reaction: 'Attorney Juan Esteban Durango warned: "The unprotected party is the user." Philosopher Luis Arturo Martínez Vásquez (UCR) noted: "In the European model, institutions regulate companies; in the U.S. model, companies self-regulate."',
          source: 'Source: Semanario Universidad, April 15, 2026',
        },
      ],
      paradox: {
        title: 'The central paradox',
        body: 'The MICITT that opposes the AI bills is the same MICITT that drafted the ENIA 2024-2027, which explicitly states that Costa Rica needs a normative framework. The ENIA includes "normative framework" as one of its five strategic pillars. The difference: the ENIA is voluntary and non-binding. The bills are mandatory. MICITT prefers the instrument it controls (the strategy) over the instrument it does not control (a law approved by the Assembly with text the Executive considers deficient).',
      },
    },

    riesgo: {
      sectionTitle: 'Technical Risk Analysis (Sirius-Lex)',
      methodNote: 'Comparative analysis of the three current texts conducted in May 2026 using Sirius-Lex, an AI agent system for comparative legislative analysis with citation traceability and constitutional review. Verifier accuracy: 83%. Full traceability: 96%. No hallucinated citations.',
      claims: {
        label: 'Verified claims',
        value: '38',
        breakdown: '20 verified against Costa Rican legal corpus · 14 pending additional verification · 4 with contradictory references',
      },
      hallazgos: {
        label: 'Risk findings by severity',
        total: 57,
        items: [
          { level: 'Critical', color: 'red', count: 15, description: 'Require correction before approval' },
          { level: 'Moderate', color: 'yellow', count: 32, description: 'Require review and adjustment' },
          { level: 'No risk', color: 'green', count: 10, description: 'No risk identified' },
        ],
      },
      impactos: {
        label: 'Normative impacts on existing legislation',
        total: 24,
        breakdown: '11 high severity · 10 medium · 3 low',
      },
      hallazgoPrincipal: {
        title: 'Key finding: mutually incompatible institutional architectures',
        body: 'The most significant finding emerged from analyzing all three bills together: they propose mutually incompatible institutional architectures. Bill 23.771 creates a new independent authority (ARIA). Bill 23.919 designates the existing MICITT as regulator. Bill 24.484 also designates MICITT, but with a different scope and logic. If all three were approved without harmonization, Costa Rica would have two parallel regulators with overlapping mandates and no defined hierarchy.',
        note: 'This is not a drafting problem. It is an institutional architecture problem. The three bills were designed independently, without coordination between the sponsoring teams. The Science and Technology Committee convened a working group in January 2025 to explore harmonization. The results are not documented in public sources.',
      },
      dataSource: 'Data from Sirius-Lex MVP-A comparative analysis, May 2026. Available upon request.',
    },

    modelosInternacionales: {
      sectionTitle: 'The Global Debate: Three Models with Observable Results',
      intro: 'The debate on AI regulation is not between "regulate" or "don\'t regulate." It is between three distinct models that already exist.',
      models: [
        {
          region: 'European Union',
          name: 'EU AI Act',
          reference: 'Regulation (EU) 2024/1689',
          status: 'In force',
          since: 'August 1, 2024',
          approach: 'Risk-based regulation',
          description: 'Four levels: Prohibited (social scoring, cognitive manipulation, real-time biometric identification in public spaces, crime prediction based on personal profiles) · High risk (health, education, employment, justice — strict obligations from August 2026) · Limited risk (transparency) · Minimal risk (no specific restrictions).',
          sanctions: 'Up to €35M or 7% of global annual turnover for violations of the prohibitions.',
          crContext: 'Minister Bogantes called it "quite restrictive" in April 2026. The AI Act does not restrict most applications: minimal and limited risk categories cover the vast majority of AI uses.',
        },
        {
          region: 'United States',
          name: 'Self-regulation model',
          reference: 'EO 14179 (Trump, Jan. 23, 2025)',
          status: 'No federal law',
          since: 'January 2025',
          approach: 'Innovation first, minimal regulatory burden',
          description: 'EO 14179 revoked Biden\'s EO 14110 (Oct. 2023), which established safety standards for frontier AI models and consumer protections. No general-purpose federal AI law. State regulatory patchwork: Colorado, California, and New York have active legislation. NIST AI Risk Management Framework adopted voluntarily.',
          sanctions: 'No unified federal sanctions.',
          crContext: 'The model Minister Bogantes signaled favorably in April 2026. It is a model in active transition and political polarization — not a stable reference. States are compensating with their own legislation, creating exactly the kind of patchwork the Costa Rican Executive says it wants to avoid.',
        },
        {
          region: 'Uruguay',
          name: 'Sandboxes first',
          reference: 'Decree 276/025',
          status: 'In force',
          since: 'December 2, 2025',
          approach: 'Regulatory testing environments, law to follow',
          description: 'Decree creates "controlled testing spaces" where AI projects can operate without obstacles from regulations not designed for these technologies. Maximum 2-year period per environment. Requires data protection impact assessments. Cannot violate constitutional provisions or human rights obligations. Technical Committee chaired by AGESIC oversees the process. AGESIC is preparing a future law.',
          sanctions: 'N/A (enabling decree, not punitive regulation).',
          crContext: 'The most transferable model to the Costa Rican context. Bill 23.919 already proposes this mechanism. It is not a foreign idea to the Costa Rican debate.',
        },
        {
          region: 'Brazil',
          name: 'AI Legal Framework',
          reference: 'PL 2.338/2023',
          status: 'In progress',
          since: 'Senate approved: December 2024',
          approach: 'Risk-based regulation with copyright protections',
          description: 'Approved by the Federal Senate in December 2024. Still under analysis in the Chamber of Deputies. Includes risk classification, prohibitions, copyright protections for model training content, and sanctions of up to R$50M or 2% of annual turnover.',
          sanctions: 'Up to R$50M or 2% of annual turnover.',
          crContext: 'First LATAM country to approve its framework in the Senate. Direct reference for the Costa Rican debate on prohibitions and rights.',
        },
        {
          region: 'Chile',
          name: 'AI Bill',
          reference: 'Bulletin 16821-19',
          status: 'In progress',
          since: 'Chamber: October 2025 · Senate: in process',
          approach: 'Cross-government approach (10 ministries)',
          description: 'Presented by the Boric government with participation from ten ministries. Approved by the Chamber of Deputies in October 2025. Currently in second legislative review in the Senate.',
          sanctions: 'To be defined in final text.',
          crContext: 'Signal of a whole-of-government approach: when 10 ministries participate in a bill, there is real institutional coordination. Contrasts with the Costa Rican process where bills emerged without coordination between the Executive and the sponsors.',
        },
      ],
      centroamerica: 'IPANDETEC confirms that no Central American country has approved specific AI legislation. Costa Rica, which positions itself as a leader in digital governance in the region, has no AI law in force.',
    },

    recomendaciones: {
      sectionTitle: 'Components of a Viable First Regulation',
      intro: 'The central problem in Costa Rica today is not that there is too much unregulated AI. It is that the public sector already operates AI systems without a clear legal framework. A useful first regulation should solve exactly that.',
      items: [
        {
          number: '01',
          title: 'Define the public sector perimeter',
          body: 'The most urgent regulation is not for AI in general, but for AI used by the State to make or inform decisions that affect people\'s rights: beneficiary selection systems for social programs, predictive models in public health, prioritization algorithms in waitlists, risk analysis tools in tax or judicial matters. These applications already exist and operate without specific accountability.',
        },
        {
          number: '02',
          title: 'Minimum mandatory registry',
          body: 'Every public institution operating an AI system that directly affects people\'s rights must declare it: what the system does, who operates it, what population it acts on, what indicators evaluate it, and who has human oversight. It does not require creating a new body. It can be a transparency obligation administered by the Ombudsman\'s Office or the General Comptroller.',
        },
        {
          number: '03',
          title: 'Three clear and specific prohibitions',
          body: 'Bill 24.484 already includes them in its substitute text: (1) state social scoring, (2) subliminal manipulation of vulnerable groups, (3) exclusive AI-based judicial decisions without effective human involvement. They are technically defensible, politically uncontroversial, and aligned with the EU AI Act. They are the reasonable minimum.',
        },
        {
          number: '04',
          title: 'Regulatory sandboxes',
          body: 'Bill 23.919 includes them. Uruguay approved them in December 2025. They allow CCSS to scale LIDIA, the Judiciary to pilot case file analysis, and private companies to develop solutions in controlled conditions without legal limbo. This is the mechanism that turns the strategy (ENIA) into execution.',
        },
        {
          number: '05',
          title: 'Do not create a new authority yet',
          body: 'MICITT already exists. The Comptroller already exists. Creating ARIA before knowing exactly what it will regulate means designing the bureaucracy before the problem. The model of designating MICITT as regulator with a reinforced mandate is more efficient. If in three years the volume of regulation justifies an independent authority, that is the time to create it.',
        },
      ],
      synthesis: 'A short first regulation, specific to the public sector, built on what the three texts have in common, and approvable with the minimum available consensus. It does not have to solve everything. It has to solve what is urgent.',
    },

    fuentes: {
      sectionTitle: 'Sources and References',
      groups: [
        {
          label: 'Official documents and primary sources',
          items: [
            'Costa Rica Legislative Assembly: Bills 23.771, 23.919, and 24.484 (Delfino.cr records, May 2026)',
            'Bill 23.919 substitute text (Mar. 6, 2025): Permanent Special Committee on Human Rights',
            'Bill 24.484 substitute text (Oct. 23, 2025): Permanent Special Committee on Science, Technology and Education',
            'TEC SCI-662-2025 (Aug. 2025) and SCI-361-2025 (May 2025)',
            'MICITT: National AI Strategy (ENIA) 2024-2027',
            'Regulation (EU) 2024/1689 — EU AI Act (in force Aug. 1, 2024)',
            'EO 14179 Trump (Jan. 23, 2025): revocation of Biden EO 14110',
            'Brazilian Federal Senate: approval of PL 2.338/2023 (Dec. 10, 2024)',
            'Chilean Senate: Bulletin 16821-19 (in process)',
            'Decree 276/025: Uruguay AI sandboxes (Dec. 2, 2025) — https://www.impo.com.uy/bases/decretos/276-2025',
          ],
        },
        {
          label: 'Press and analysis',
          items: [
            'Semanario Universidad (Jan. 29, 2025): direct quotes from Marlon Avalos Elizondo, MICITT Director of R&D&I',
            'DPL News (Jan. 30, 2025): direct quote from Marlon Avalos Elizondo, MICITT Director of R&D&I',
            'CRHoy (Oct. 29, 2024): statements by Minister Paula Bogantes Zamora',
            'Semanario Universidad (Apr. 15, 2026): MICITT shift toward U.S. model',
            'Semanario Universidad (May 31, 2023): initial MICITT position on Bill 23.771',
            'Teletica (Mar. 15, 2025): CAMTIC and Chamber of Commerce position',
            'El Financiero CR (Mar. 19, 2025): analysis of three bills',
            'Infobae CR (May 13, 2026): Fernández government calls 62 bills',
            'Bloomberg Línea (May 31, 2023): Bill 23.771 drafted with ChatGPT-4',
            'IPANDETEC (2025): AI Legislative Trends in Central America',
            'Cooperativa.cl (Oct. 13, 2025): Chilean Chamber of Deputies approval',
            'Diario Constitucional Chile (Feb. 23, 2026): Senate status',
          ],
        },
        {
          label: 'Original technical analysis',
          items: [
            'Sirius-Lex MVP-A comparative analysis (May 2026): 38 claims, 57 classified risk findings — available upon request',
          ],
        },
      ],
    },

    footer: {
      bio: '<strong>Mario Pérez Edwards</strong> is an artificial intelligence policy analyst and founder of Observatorio IA Costa Rica.',
      cadence: 'Analysis published May 21, 2026.',
      orgLabel: 'Observatorio IA Costa Rica',
    },
  },
} as const;

export type Locale = keyof typeof t;
export type Translations = typeof t[Locale];
