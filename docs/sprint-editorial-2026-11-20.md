# Ajustes editoriales de Salud y Moravia, 20 de noviembre de 2026

Preparación local autorizada por Mario a partir de la validación del informe del 15 de noviembre. El informe completo tiene el ID `a7a0ef10-093b-44ce-af49-03673448c0bf` en el chat investigador. No se solicita otra investigación programada ni se modifica la recepción semanal.

Mario autorizó el commit, push, despliegue y revisión en producción de este candidato el 20 de noviembre de 2026. La publicación incorpora únicamente este lote y conserva el trabajo previo del pipeline.

## Plan

- [x] Reconsultar las fuentes primarias de las dos intervenciones de Salud y la contratación de Moravia.
- [x] Incorporar evidencia y notas bilingües en las dos intervenciones ENIA y la ficha existente de Moravia.
- [x] Registrar la revisión parcial sin renovar las fechas de control integral de la agenda.
- [x] Preparar R21 local, conservar las releases anteriores y comprobar datos, API, tipos, build y páginas ES/EN.
- [x] Entregar el candidato para revisión. Commit, push y despliegue quedan fuera de esta preparación.

## Línea base y trabajo protegido

Contenido editorial de `main` local: `c30219d23884c70ae5edc0b28d426542663b5caa`, release `2026-11-09-r20`. El 20 de noviembre, `main` remoto está en `c98926625dec6b909196882d955749144e1cc883`; su único cambio posterior es `scraper-runs/ilia-state.json`, generado por el monitor. No se incorpora ni se sobrescribe ese estado durante esta preparación.

Línea base recalculada: 47 iniciativas, 11 verificadas, 19 en seguimiento y 17 de ecosistema; 22 instituciones u organismos. ENIA: 129 registros fuente, 120 intervenciones únicas; estas últimas se distribuyen en 3 verificadas, 13 parcialmente verificadas y 104 sin ejecución verificada.

Se conservan sin cambios los ocho archivos previos del pipeline: `.github/workflows/scrape.yml`, `scrapers/google-news.ts`, `scrapers/lib/classifier.ts`, `scripts/classify-vs-repo.ts`, `scripts/notify-classification-telegram.ts`, `tests/source-coverage.test.ts`, `docs/plan-monitoreo-2026-09-25.md` y `tests/monitoring-notifications.test.ts`.

## Fuentes y decisiones

Consulta de todas las fuentes de esta tabla: **20 de noviembre de 2026**. Las fechas de evidencia se conservan separadas de esta revisión editorial.

| Registro | Fuente primaria, emisor y fecha | Sección y decisión |
| --- | --- | --- |
| `enia-3-1-1-03` | [Salud presenta la Agenda Nacional de Prioridades de Investigación y Desarrollo Tecnológico en Salud 2025–2030](https://ministeriodesalud.go.cr/index.php/prensa/62-noticias-2025/2222-salud-presenta-la-agenda-nacional-de-prioridades-de-investigacion-y-desarrollo-tecnologico-en-salud-2025-2030), Ministerio de Salud, 22/08/2025; [Agenda oficial](https://www.ministeriodesalud.go.cr/index.php/biblioteca-de-archivos-left/documentos-ministerio-de-salud/ministerio-de-salud/planes-y-politicas-institucionales/documentos-vinculados-politicas-y-planes/9423-agenda-nacional-de-prioridades-de-investigacion-y-desarrollo-tecnologico-en-salud-2025-2030/file), Ministerio de Salud, edición 2025–2030; [Informe Final de Gestión de Ana Priscilla Herrera García, Dirección de Investigación y Tecnologías en Salud](https://www.ministeriodesalud.go.cr/index.php/biblioteca-de-archivos-left/documentos-ministerio-de-salud/ministerio-de-salud/informes-institucionales/informes-de-gestion/nivel-central/10322-informe-final-de-gestion-ana-priscilla-herrera-garcia-dits-2026/file#page=11), 11/05/2026 | Informe p. 11, agenda pp. 88–89 y comunicado completo. Verificar la existencia y oficialización del producto documental con líneas de IA. El informe de Salud lo vincula expresamente con ENIA. Mantener pendiente la corroboración del reporte del indicador por MICITT-DIDI, responsable en el Plan; no atribuir cumplimiento de otras intervenciones ni sistemas clínicos operativos. |
| `enia-1-1-2-01` | [Mismo informe de Salud](https://www.ministeriodesalud.go.cr/index.php/biblioteca-de-archivos-left/documentos-ministerio-de-salud/ministerio-de-salud/informes-institucionales/informes-de-gestion/nivel-central/10322-informe-final-de-gestion-ana-priscilla-herrera-garcia-dits-2026/file#page=27), 11/05/2026 | P. 27. Acredita formulación y coordinación mediante los oficios `MS-DVM-ADM-77-2024` y `MICITT-DVCTI-OF-226-2024`. Estado parcialmente verificado. No se localizó promulgación posterior en la búsqueda dirigida. El decreto 39061-S pertenece a otra fila del documento y no corresponde a este reglamento. |
| `moravia-chatbot-ia` | [Resolución A-PROV-189-11-2026 / documento 0182026000100025](https://www.sicop.go.cr/moduloOferta/search/EP_SEJ_POQ402.jsp?recursoSeqno=207376&cartelNo=20261003439&cartelSeq=00&cartelCate=&reqNew=1), Municipalidad de Moravia / SICOP, notificada el 09/11/2026; [expediente oficial](https://www.sicop.go.cr/moduloPcont/pcont/ctract/es/CE_CEJ_ESQ002.jsp?cartelNo=20261003439&cartelSeq=00), pliego vigente del 10/11/2026; [resultado de apertura](https://www.sicop.go.cr/moduloOferta/servlet/search/EP_SEV_COQ622?isPopup=Y&fromESFlag=Y&cartelNo=20261003439&cartelSeq=00&cartelCate=1&phase=), publicado el 16/11/2026 a las 08:44 | Resolución del recurso, secciones 2–4 y 8 del expediente y resumen de apertura. La objeción fue declarada parcialmente con lugar; el título vigente precisa SaaS con implementación e integración. La apertura finalizó y registra 22 proveedores y 22 ofertas. Se mantiene Seguimiento, fase planificada: no consta acto final en el expediente consultado. Los precios de apertura no son un monto adjudicado ni necesariamente comparables con el presupuesto global. |

Los PDF de Salud se recuperaron completos y las páginas 11 y 27 del informe se inspeccionaron visualmente. SICOP permitió consultar el expediente, la resolución y el resultado de apertura con su interfaz pública; el detalle del cartel devolvió un mensaje de error de consulta. No se fija un tope contractual ni un horario límite de recepción a partir de réplicas discrepantes. La fecha y las 22 ofertas se sustentan en el resultado oficial de apertura.

## Alcance y pendientes

No se crean iniciativas ni instituciones, no se revisa todo el catálogo y no se completa la auditoría de las 120 intervenciones. Las fechas de revisión integral de ENIA, legislación y catálogo se conservan. Tras el GO de publicación, los dos registros nuevos de monitoreo se preparan como `cambio-publicado`, con alcance parcial.

Cola de preguntas: reporte del indicador de Salud por MICITT-DIDI; promulgación y texto definitivo del reglamento; tope vigente, evaluación de ofertas, acto final, proveedor, técnica entregada y recepción de Moravia. La revisión semanal continuará según su programación.

## Validación

Resultado local: ENIA conserva los 129 registros fuente y las 120 intervenciones únicas, con **4 verificadas, 14 parcialmente verificadas y 102 sin ejecución verificada**. El catálogo conserva **47 iniciativas: 11 verificadas, 19 en seguimiento y 17 de ecosistema**, en 22 instituciones u organismos. Las únicas entradas curadas modificadas son las dos intervenciones de Salud y el chatbot de Moravia. El texto transcrito del Plan, sus responsables, indicadores y cruces de catálogo quedan intactos.

- JSON/AJV y referencias válidos.
- 148 pruebas aprobadas en 23 archivos; las expectativas de API se actualizan a R21 y a los dos nuevos registros de historial y monitoreo.
- Tipos de aplicación y scripts y lint correctos.
- Build de 207 rutas, con 205 HTML auditados y paridad de 202 documentos localizados.
- Doce comprobaciones de navegador: ENIA, ficha Moravia e historial, en ES/EN y móvil/escritorio; sin errores de JavaScript ni desbordamiento horizontal persistente. Inspección visual de las fichas ENIA y Moravia.
- API, descargas, manifest, schemas y checksums regenerados en `2026-11-20-r21`. Las trece releases anteriores y sus descargas históricas se conservaron byte a byte; solo cambian los índices de descubrimiento y los endpoints vigentes del candidato.
- Los ocho archivos previos del pipeline se conservaron con la misma huella SHA-256.

Al avanzar el corte editorial al 20 de noviembre, la agenda muestra tres frentes vencidos: legislación, ENIA e ILIA. Sus fechas no se renuevan: este lote no completa esos controles. Los dos registros nuevos constan como cambios publicados y revisión parcial en el candidato autorizado.

Vista previa local de la build: `http://127.0.0.1:4321/es/enia/` (seleccionar **Inventario completo**), `http://127.0.0.1:4321/es/proyectos/moravia-chatbot-ia/` y `http://127.0.0.1:4321/es/historial/`.

## Publicación autorizada

Se incorporó por fast-forward el commit remoto `c98926625dec6b909196882d955749144e1cc883`, limitado al estado automático de ILIA. El contenido editorial de R21 se conserva. Antes del commit se validará una copia aislada del índice de Git, excluyendo los ocho archivos previos del pipeline. Tras el push a `main`, se comprobarán CI, el despliegue Vercel del mismo commit y la paridad de producción con los datos y artefactos de R21.

El candidato aislado del índice aprobó 146 pruebas en 22 archivos, validación de datos, ambos chequeos de tipos, lint, build y auditoría estática. Las dos pruebas adicionales del directorio de trabajo pertenecen al pipeline previo excluido. La build validada generó las 207 rutas y los 205 HTML esperados. La única modificación posterior a esos controles es esta constancia documental.
