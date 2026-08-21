# Fase 4B: crosswalk ENIA y catálogo

**Fecha de corte:** 21 de agosto de 2026

**Estado:** implementada localmente; sin publicación ni cambios al catálogo público de 26 fichas.

## Objetivo

Cruzar las 129 intervenciones de la versión publicada del Plan de Acción ENIA con las 26 iniciativas del catálogo, conservar las repeticiones de la fuente sin contarlas dos veces e investigar solo los vacíos con señal de avance o impacto alto.

La decisión se ejecuta de forma reproducible con `npm run crosswalk:enia`. Cada fila conserva el texto oficial y añade una justificación bilingüe separada.

## Resultado cuantitativo

| Estado del cruce | Filas | Interpretación |
|---|---:|---|
| `mapeado-exacto` | 4 | La identidad de la iniciativa está suficientemente establecida. Esto no implica que toda la meta ENIA esté cumplida. |
| `coincidencia-parcial` | 9 | El catálogo documenta una parte del alcance, pero no existe identidad completa o la fila funciona como cartera amplia. |
| `posible-duplicado` | 9 | La fuente repite sustancialmente una intervención. Se conserva la fila y se remite a una decisión canónica. |
| `nuevo-con-evidencia` | 2 | Hay evidencia oficial externa suficiente para preparar una ficha nueva, pero todavía no se altera el catálogo público. |
| `enia-solamente` | 22 | La fila declara una solución o componente de IA, pero no se verificó ejecución fuera del Plan. |
| `no-es-sistema-ia` | 83 | La fila es gobernanza, formación, investigación, articulación, infraestructura habilitante o automatización sin evidencia de IA. |
| `no-determinado` | 0 | Todas las filas recibieron una decisión editorial. |

La revisión corrigió una clasificación individual: `enia-4-1-4-02`, adquisición de sistemas de IA por MINSA, pasa de capacitación a `solucion-ia-declarada`. El total queda en 29 soluciones declaradas y 47 intervenciones de capacitación; los 129 registros y 144 indicadores fuente no cambian.

## Regla de lectura

Los estados de cruce responden a identidad documental, no a cumplimiento de metas:

- una coincidencia exacta puede tener ejecución solo parcialmente verificada;
- una coincidencia parcial no autoriza a fusionar proyectos;
- una línea base distinta de cero es una afirmación del Plan, no evidencia externa;
- `enia-solamente` significa “sin corroboración localizada al corte”, no “inexistente”;
- las filas duplicadas no se eliminan porque forman parte de la matriz oficial.

## Coincidencias con el catálogo

### Identidad suficiente

| Fila ENIA | Catálogo | Decisión de ejecución |
|---|---|---|
| `enia-2-1-3-02` | `micitt-linc` | LINC está operativo; no se verificó toda la meta de implementación por gobiernos locales. |
| `enia-2-2-4-01` | `micitt-linc` | La red existe y capacita; no se atribuye automáticamente cada transferencia prevista. |
| `enia-5-2-2-01` | `micitt-linc` | LINC funciona como vehículo de formación; alianzas y metas futuras quedan abiertas. |
| `enia-5-2-5-01` | `mep-intel` | La especialidad técnica en IA inició en cuatro colegios y verifica esta parte de la oferta. |

### Cobertura parcial

| Fila ENIA | Fichas relacionadas | Límite del cruce |
|---|---|---|
| `enia-2-1-1-03` | `micitt-agroboost` | Mismo responsable, público agrícola y tecnologías de frontera; el Plan no usa el nombre AgroBoost. |
| `enia-2-2-2-01` | `micitt-agroboost` | AgroBoost cubre unidades agrícolas, no toda la asistencia prevista para PYMES y emprendimientos. |
| `enia-4-1-2-13` | `ccss-tec-formacion` | Confirma una acción concreta de formación, no el programa institucional completo. |
| `enia-4-1-3-10` | `hacienda-anomaly`, `hacienda-asistente` | Son funcionalidades reales relacionadas; la fila es una cartera genérica y no las nombra. |
| `enia-4-1-3-15` | cinco fichas CCSS | LIDIA, AIDA, REDIMED, depuración de listas y logística cubren partes del alcance; no prueban la línea base de 67 ni forman un solo proyecto. |
| `enia-4-1-3-16` | `ccss-lidia` | LIDIA confirma modelos clínicos predictivos, pero la fila incluye un alcance epidemiológico más amplio. |
| `enia-4-1-3-18` | `ccss-tec-formacion` | El curso y sus prototipos materializan una parte de la estrategia de tecnologías emergentes. |
| `enia-5-2-3-02` | `mep-intel` | La especialidad cubre educación técnica secundaria, no primaria y secundaria académica en general. |
| `enia-6-1-2-01` | `cenat-lania` | LaNIA comparte funciones de capacidad y articulación, pero no se acreditó que sea el Centro Nacional de Excelencia ni que esté operativo. |

Doce de las 26 fichas aparecen en al menos una correspondencia. Las otras 14 no se fuerzan dentro del Plan. Esto incluye todas las fichas del Poder Judicial, dos proyectos UCR, CONECTA, EDUS, TRIBU-CR y la prueba de arritmias del CENAT. La ausencia de relación no es una contradicción: la matriz ENIA no es un inventario exhaustivo de toda iniciativa pública.

## Repeticiones conservadas

| Fila repetida | Fila canónica | Motivo principal |
|---|---|---|
| `enia-3-1-1-04` | `enia-2-2-1-02` | Mismo diagnóstico CNFL, responsable y objetivo. |
| `enia-3-2-1-01` | `enia-2-1-1-03` | Mismo texto, responsable, indicador y metas agrícolas. |
| `enia-4-1-2-01` | `enia-2-1-1-01` | Misma capacitación IFAM y meta de 90 gobiernos locales. |
| `enia-4-1-3-14` | `enia-4-1-3-05` | Misma solución INAMU; la segunda fila convierte 1.200 en línea base. |
| `enia-4-1-3-21` | `enia-4-1-3-15` | Mismo indicador, línea base 67 y metas 75/85/100. |
| `enia-4-1-3-22` | `enia-4-1-3-18` | Misma estrategia CCSS de formación y pruebas piloto. |
| `enia-4-1-3-23` | `enia-4-1-3-19` | Misma auditoría con IA sobre SIES/MISE y mismas metas. |
| `enia-4-1-3-30` | `enia-4-1-3-16` | Mismo modelo predictivo clínico y metas 30/70/100. |
| `enia-5-1-3-04` | `enia-5-1-3-03` | Misma alfabetización RECOPE en niveles técnico y usuario, con metas diferentes. |

También se documenta una anomalía que no constituye un duplicado de proyecto: `enia-4-1-3-25` (predicción de homicidios) y `enia-5-1-1-02` (ubicación de espacios de educación virtual) reutilizan el indicador “porcentaje de cantones analizados” y las metas 0/30/65 pese a tener objetivos distintos.

## Dos faltantes con evidencia oficial

### Ela, aplicación de IA del INAMU

La intervención canónica `enia-4-1-3-05` queda como `nuevo-con-evidencia` y `operativo`; `enia-4-1-3-14` remite a ella como repetición.

El [micrositio oficial del INAMU](https://www.inamu.go.cr/inteligencia-artificial) confirma una aplicación disponible las 24 horas para información, orientación y atención inicial, e identifica GPT-4 Turbo y búsqueda de archivos. Los [términos de uso y privacidad](https://elainamu.inamu.go.cr/assets/terminos_condiciones) confirman que trata datos de registro y socioeconómicos, y que puede compartir geolocalización con el 9-1-1 cuando la persona activa la función.

No se localizaron métricas públicas de uso, precisión, respuestas incorrectas, derivaciones a personal ni activaciones de emergencia. Por su audiencia y los datos tratados, la futura ficha debe exigir una descripción clara de revisión humana, retención, proveedores, evaluación de seguridad y vías de corrección.

### IA del INS para reclamos de gastos médicos

`enia-4-1-3-24` queda como `nuevo-con-evidencia` y `operativo`.

El [boletín oficial INSignia de diciembre de 2024](https://www.grupoins.com/media/pyfkpyjz/bolet%C3%ADn-insignia-diciembre-2024.pdf) confirma IA en el proceso de reclamación e indemnización de gastos médicos. El INS reporta cerca de 10.000 solicitudes mensuales, reducción del pago promedio de entre 12 y 13 días a entre 6 y 7 días, y 72% de eficiencia. La fila del Plan, con línea base 1, aporta una segunda referencia institucional al análisis y clasificación automatizada de esos reclamos.

La evidencia todavía no publica arquitectura, variables, criterios de clasificación, revisión humana, errores, fraude detectado ni mecanismo de impugnación. La futura ficha debe permanecer en seguimiento hasta resolver esas dimensiones, aunque la operación general sí está verificada.

## Casos de alto impacto que siguen solo en ENIA

La búsqueda priorizada no encontró corroboración suficiente fuera del Plan para:

- `enia-4-1-3-25`: ICE, perfiles cantonales y predicción de homicidios;
- `enia-4-1-3-26`: AyA, IA en reclutamiento y selección;
- `enia-4-1-3-27`: AyA, análisis de precios y documentos de ofertas;
- `enia-4-1-3-20`: CCSS, perfiles y predicción para beneficios económicos;
- `enia-4-1-3-19`: CCSS, auditoría automatizada sobre SIES/MISE;
- `enia-4-1-3-12`: MSP, ampliación de IA en unidades policiales especiales;
- `enia-4-1-3-07`: CNE, preevaluaciones automatizadas de amenaza;
- `enia-4-1-3-06`: PANI, kioscos interactivos para personas menores de edad.

En AyA, una [publicación oficial de 2020 sobre RANC-EE](https://websolutionss.aya.go.cr/WebNoticiasAYA/TNotNoticias/DetalleTitulo/AyA-establece-ruta-para-reducir-agua-no-contabilizada-176) confirma el proyecto general y anunciaba detección de fugas con IA. No confirma el flujo específico de análisis e informes de `enia-4-1-3-28` ni su ejecución actual. El chat de atención del [MTSS](https://www.mtss.go.cr/prensa/comunicados/2018/agosto/cp_037_2018.html) existe desde 2018, pero las fuentes localizadas no lo describen como IA ni prueban la intervención nueva.

Las líneas base distintas de cero de CCSS, JPS y RECOPE se conservaron como texto fuente. La búsqueda oficial encontró estrategia, infraestructura o ciberseguridad adyacentes, pero no ejecución verificable de los componentes concretos de IA descritos en esas filas.

## Separaciones de identidad obligatorias

- La fila ICE de homicidios permanece `enia-solamente`. No se encontró formalización ICE-OIJ, convenio, contratación, piloto ni resultado.
- El proyecto OIJ-TEC 2024-2026 es real y distinto: desarrolla reconocimiento de imágenes, categorización de casos y predicción de incidentes por ubicación. Debe prepararse como ficha propia de I+D/seguimiento, no usarse para verificar la fila ICE.
- SUPERCOP es un sistema policial modular real, pero las fuentes revisadas no demuestran que sus módulos utilicen IA ni que incorporen OIJ-TEC.
- El Índice Cantonal de Seguridad Ciudadana del Ministerio de Justicia es estadística descriptiva, no IA predictiva.

Fuentes principales para esta separación: [ficha OIJ-TEC](https://orion.tec.ac.cr/en/projects/sistemas-basados-en-inteligencia-artificial-usando-machine-learni/), [cartera TEC 2024](https://www.tec.ac.cr/sites/default/files/media/doc/final-cartera-2024.pdf), [acta del Poder Judicial sobre entrenamiento y prueba](https://nexuspj.poder-judicial.go.cr/document/act-1-0003-8728-37) e [informe metodológico del índice cantonal](https://observatorio.mj.go.cr/sites/default/files/docs/ICSC_2025_RESUMEN_METODOLOGICO_Y%20_RESULTADOS.pdf).

## Controles técnicos

- El schema sube a versión 2 y exige `fundamento` bilingüe en las 129 decisiones.
- `intervencionCanonicaId` registra repeticiones sin borrar la fuente.
- Los estados exacto y parcial deben enlazar al menos una ficha existente.
- Un registro `nuevo-con-evidencia` debe incluir evidencia externa y no fingir un ID de proyecto que todavía no existe.
- Las pruebas fijan los conteos, los nueve duplicados, los 12 IDs de catálogo relacionados y los casos sensibles.
- `npm run validate-data` valida el JSON y sus referencias; `npm run crosswalk:enia` reproduce la transformación.

## Decisión para la Fase 4C

La interfaz pública ENIA debe partir de estas tres ideas:

1. separar las 29 soluciones declaradas de las 83 filas que no son sistemas de IA;
2. contar filas canónicas, no las nueve repeticiones;
3. mostrar Ela e INS como hallazgos con evidencia pendientes de ficha completa, y ICE, AyA y los demás como compromisos no verificados.

Antes de incorporarlos al catálogo público, Ela, INS y OIJ-TEC deben recibir fichas v2 completas con clasificación, fuentes, preguntas abiertas, dimensiones de evidencia y tratamiento explícito de riesgos. Esa incorporación cambiará los contadores públicos y se revisará visualmente en la siguiente fase.
