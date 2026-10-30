# Sprint editorial: informes del 18 y 25 de octubre de 2026

Estado: implementado y validado localmente. Mario autorizó commit selectivo, push y despliegue el 29/10/2026, tras revisar el lote. No incluye el pipeline de monitoreo pendiente. La comprobación en producción se registra en la entrega de publicación.

## Objetivo y controles

Integrar evidencia ya validada sin confundir fecha de hallazgo, lanzamiento, técnica declarada, operación histórica o cumplimiento ENIA. Línea base: API pública y fuente local coinciden en 39 iniciativas, 9 verificadas, 14 en seguimiento, 16 de ecosistema y 16 instituciones.

Resultado esperado: **42 iniciativas, 10 verificadas, 16 en seguimiento, 16 de ecosistema y 19 instituciones**. No se altera ninguna de las 39 fichas anteriores ni se duplica `ccss-depuracion-listas`.

## Plan de ejecución

- [x] S1. Tres fichas bilingües y tres instituciones: TEC, CGR y TSE. Fuentes, límites, fechas y preguntas de seguimiento trazables.
- [x] S2. Censo TIC de la UCR como recurso y evidencia adyacente del IFAM, sin nueva adopción ni atribución a sus metas.
- [x] S3. Decreto 45961-MSP como recurso e instrumento sectorial de Marco país, sin expediente legislativo ni ficha de adopción.
- [x] S4. Historial bilingüe, conteos y API R17 reproducible. Mantener intactas las releases R8–R16 y las fechas de revisiones integrales no realizadas.
- [x] S5. Pruebas de regresión, schemas, tipos, lint, build estático, auditoría y revisión visual ES/EN en escritorio y móvil. Entregar vista local y reporte del lote, sin publicar.

## S1. Iniciativas e instituciones

### TEC: Asistente de Auditoría con IA

- ID previsto: `tec-asistente-auditoria-ia`, institución `tec`.
- Seguimiento; fase desarrollo declarado; RAG declarado por la institución. Prototipo funcional, utilización por auditores, proveedor, presupuesto y resultados no determinados.
- La noticia acredita presentación del proyecto el 15/10/2026, no adopción operativa. Es distinto de OIJ–TEC, SBD Auditoría y dIAra.
- Fuente: https://tec.ac.cr/medio-siglo-transparencia-control-auditoria-interna-tec-celebra-50-anos-trayectoria-servicio

### CGR: dIAra

- ID previsto: `cgr-diara`, institución `cgr`.
- Adopción verificada en fase piloto, limitada a la experiencia técnica documentada, no afirmación de continuidad o cobertura generalizada actual.
- Modelo Faster R-CNN con ResNet50. El repositorio documenta inferencias y archivos de resultados sobre imágenes reales de la obra de Pococí. La detección de la clase persona no equivale a identificar individuos ni a reconocimiento facial.
- IoU 82,7 % y recall 85,4 % son resultados técnicos reportados por el equipo, no validación independiente, eficacia de fiscalización ni detección de corrupción. El modelo fue preparado para una obra específica.
- No atribuir IA a seis obras por la sola presencia de dispositivos. No presentar como completo el aplicativo de automatización pendiente descrito ante OGP. No confundir con la herramienta interna de planificación de Auditoría de la CGR.
- Snapshot técnico verificado: `26a53a7fe89032e56dde014674ac0b830034692d`, publicado el 10/05/2024. Primera evidencia localizada no equivale a fecha inicial de despliegue.
- Fuentes: https://github.com/cgrcostarica/dIAra y https://www.opengovpartnership.org/the-open-gov-challenge/costa-rica-artificial-intelligence-alerts-citizen-control-public-infrastructure/
- Informes: `IA/Documentación/Documentación-IA-CGR.pdf` y `IA/Documentación/Proyecto CGR-GIZ-CENFOTEC Resultados.pdf` del snapshot indicado.
- Diario Extra presenta fechas visibles y metadatos contradictorios. No usar el 28/09 del informe como hito confirmado ni depender de esa nota para verificar ejecución.

### TSE: Chat Votante Informado

- ID previsto: `tse-chat-votante-informado`, institución `tse`.
- Seguimiento, operación histórica acreditada en el proceso electoral 2025–2026. Técnica y continuidad actual no determinadas. No inventar una categoría de contador ni una fecha de retiro.
- Registrar solo el componente chatbot, no todo el programa Votante Informado. No atribuirle funciones de recomendación de voto, conteo de votos o toma de decisiones electorales.
- El lector web devolvió 404 en el enlace histórico; el acceso directo derivó a protección antibot. Ninguna de esas señales acredita cancelación o cierre del servicio.
- Fuentes: https://www.tse.go.cr/comunicado1120.html (12/12/2025), https://www.tse.go.cr/comunicado1131.html (05/01/2026), https://www.tse.go.cr/comunicado1194.html (29/06/2026).

## S2. Censo TIC y contexto IFAM

- Fuente: https://www.ucr.ac.cr/noticias/2026/10/15/voz-experta-las-municipalidades-en-la-era-de-la-inteligencia-artificial-ia.html
- Artículo de Voz experta de un investigador del CIOdD que comunica resultados del Censo TIC 2026. No se recuperó el informe metodológico completo ni sus microdatos.
- Denominador: 43 gobiernos locales participantes, 41 municipalidades y 2 concejos municipales de distrito. Reportan: 88,4 % funcionarios que usan herramientas de IA; 4 capacitación realizada; 15 en desarrollo; 67,4 % sin lineamientos ni elaboración; 1 con lineamientos.
- No extrapolar al país, no convertir usos individuales en sistemas institucionales y no fabricar 38 fichas municipales a partir del porcentaje.
- Ampliar solo `enia-4-1-3-02`: conservar estado de ejecución, cruce, IDs mapeados, indicador y metas. La nota ya reconoce MuniBot y R.O.D.U; el censo es evidencia adicional de contexto, no atribución al IFAM.

## S3. Decreto 45961-MSP

- Fuente primaria recuperada: https://www.imprentanacional.go.cr/pub/2026/10/14/ALCA138_14_10_2026.pdf, Alcance 138 a La Gaceta 194, páginas 101–113.
- Publicación y vigencia inicial: 14/10/2026, según artículo 32. Firma del decreto: 18/08/2026; no confundir las fechas.
- Artículo 25: análisis con IA y valoración humana para decisiones que afecten derechos. Artículo 26: límites y condiciones de reconocimiento biométrico. No resumirlo como autorización irrestricta o prohibición absoluta.
- Transitorios: manuales en un mes y protocolos en un año desde publicación. Son plazos normativos, no cumplimiento acreditado. Mantener su seguimiento en la cola interna.
- Marco país debe reconocer regulación sectorial vigente sin afirmar que existe una ley general de IA. Revisar frases absolutas incompatibles con esa distinción.

## Fuera de alcance y pendientes

- BID CR-T1308: ficha oficial aún en preparación, sin aprobación; no incorporar al contador hasta completar la investigación sobre ejecución y responsable. https://www.iadb.org/es/proyecto/CR-T1308
- CGR planificación de Auditoría, SBD jurídico y controles de continuidad de las tres nuevas fichas siguen como preguntas abiertas, no equivalencias.
- ICE/OIJ, AyA, Vincent, SBD Auditoría, INA y CCSS: sin reclasificación ni nuevas fechas de revisión integral en este lote.
- No reparar ni publicar `.github/workflows/scrape.yml`, scrapers, clasificadores, notificaciones o pruebas de pipeline preexistentes.
- Consultados el scoping, research, línea base y plan maestro de Obsidian. Son antecedentes de mayo; las altas nuevas proceden de la validación primaria y el GO editorial explícito de Mario del 29/10. No trasladar estrategias, presupuestos privados ni recomendaciones tácticas a la web.

## Archivos previstos y aceptación

- Datos: `proyectos`, `instituciones`, `indicadores` (lista institucional del KPI), `recursos`, `marcoPais`, `eniaAcciones`, `monitoreo`, `changelog`; todos los textos nuevos ES/EN.
- API: `scripts/build-api.ts`, contadores derivados y artefactos de la release `2026-10-29-r17`, con snapshots y descargas anteriores intactos.
- Pruebas: corte actual y regresiones históricas. Los tests de Hello Brete conservarán sus aserciones históricas sobre R16 sin impedir altas posteriores aprobadas.
- Sin nuevos estados de schema, dependencias, widgets o rediseño. Solo ajustar presentación si es imprescindible para expresar correctamente operación histórica o el nuevo recurso.
- Fechas de agenda: no convertir incorporación de evidencia parcial en revisión integral. Actualizar únicamente cantidades derivadas de seguimiento, adopciones e instrumentos. Las revisiones vencidas no se posponen artificialmente.
- Entrega: archivos afectados, resultados de pruebas, controles 42/10/16/16/19, rutas de vista local y pendientes explícitos. Publicación en producción fuera de este GO.

## Resultado de ejecución

Completado localmente el 29/10/2026, sin commit, push ni despliegue.

- Catálogo: 42 iniciativas, 10 adopciones verificadas, 16 en seguimiento, 16 de ecosistema y 19 instituciones. Las 39 fichas anteriores se conservan exactamente.
- Tres altas: dIAra como adopción verificada en fase piloto; TEC como desarrollo en seguimiento; Chat Votante Informado como operación histórica documentada y continuidad actual no determinada.
- Dos recursos nuevos: Censo TIC municipal y Decreto 45961-MSP. El IFAM mantiene sin cambios su indicador, metas, cruce y ejecución no verificada. Marco país distingue regulación sectorial de una ley general de IA y ahora permite abrir las fuentes desde la matriz, tanto en móvil como en escritorio.
- API R17 generada y bloqueada. La regeneración con `release.lock` presente pasó correctamente. Releases R8–R16 y sus descargas fechadas sin modificaciones.
- Validación: `npm run validate-data`, 136/136 pruebas en 21 archivos, tipos de scripts y build de producción con lint y tipos correctos. Next generó 191 páginas; `audit:static` verificó 189 HTML, 186 localizados y paridad ES/EN completa. `git diff --check` y búsqueda de contenido táctico privado sin hallazgos en las adiciones públicas.
- Control previo a publicación: copia aislada del índice selectivo, sin los archivos pendientes del pipeline, con 134/134 pruebas en 20 archivos, build y auditoría correctos. Sus 54 artefactos generados coinciden byte a byte con los preparados. Las dos pruebas adicionales del workspace pertenecen al lote de monitoreo excluido.
- QA local: 28 rutas ES/EN con respuesta 200, idioma correcto y un único H1; fuentes del decreto accesibles en ambas vistas; API con 42 registros. Revisión de fichas, IFAM, Marco país e historial en navegador aislado, a 390 y 1440 píxeles, sin desbordamiento horizontal persistente ni errores de consola detectados. Capturas temporales en `/tmp/observatorio-*`.
- Agenda: siguen vencidas las revisiones integrales de legislación, ENIA, catálogo en seguimiento e ILIA. Se conservaron sus fechas; no se presentó la incorporación parcial como una revisión completa. Las tres fichas nuevas tienen revisión individual prevista para el 29/11/2026.
- Pipeline: hashes del diff de los seis archivos preexistentes y de los dos archivos no rastreados del monitoreo coinciden con la línea base. No se incorporaron a este sprint ni se alteraron.
- La consulta a la base de conocimiento no estuvo disponible por falta de contexto de organización. Se utilizaron el repositorio, el scoping de Obsidian y las fuentes primarias indicadas; no se modificó la configuración de la organización.

Vista local: http://127.0.0.1:4316/es/proyectos/cgr-diara/ . El servidor sirve únicamente el export estático de este lote; la página pública no ha cambiado.

GO de publicación recibido el 29/10/2026. Publicar mediante el commit selectivo y el push a `main` que activa Vercel; comprobar después las rutas y datos públicos contra ese commit. Los cinco commits automáticos de monitores recibidos desde R16 se integran por fast-forward, sin cambios en contenido curado. Las investigaciones abiertas y la recuperación de las cuatro revisiones vencidas quedan fuera del alcance completado.
