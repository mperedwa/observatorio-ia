# Actualización editorial, 5 de octubre de 2026

Estado: implementado y validado. Mario autorizó commit, push a main y despliegue el 5 de octubre, tras la revisión local del lote. La publicación y su verificación se registran en la entrega.

## Alcance

1. Añadir `ina-hello-brete` como componente de IA en Seguimiento, con servicio educativo operativo. No fusionarlo con `ina-sne-brete-ia` ni convertir operación de la plataforma en uso de IA confirmado.
2. Actualizar la institución INA para mostrar dos iniciativas y la nota de `enia-4-1-3-01` con evidencia adyacente. Conservar el cruce parcial de SNE/Brete, sus IDs mapeados y ejecución no verificada. Hello Brete no se atribuye a la meta ENIA.
3. Añadir historial bilingüe, ajustar solo la cantidad de seguimiento en la agenda y preparar API R16. Preservar las releases R8–R15, las fechas de revisión de frentes no revisados íntegramente y los cambios previos del pipeline.
4. Conservar CGR y SBD jurídico en investigación interna, sin altas ni instituciones nuevas en el catálogo.
5. La comprobación visual detectó que el encabezado ENIA mostraba una fecha fija de agosto. Se sustituye por la fecha editorial del dataset, con traducción ES/EN y prueba de regresión; no implica una revisión exhaustiva de las 120 intervenciones.

## Fuentes y decisiones de Hello Brete

- MICITT, 13/04/2026: inicio del servicio, reconocimiento de voz y asistencia mediante IA. Fuente primaria para ejecución del servicio, no prueba funcional de sus componentes de IA.
  https://www.micitt.go.cr/el-sector-informa/plataforma-gratuita-hello-brete-permitira-capacitar-hasta-2-millones-de-personas
- INA, acta 31-2025, sesión 10/11/2025, páginas 29–30: adjudicación de `2025LY-000011-0002100001` al consorcio Say Pura Vida! by Open Education & RACSA. Open Education LLC: 93,18%; RACSA: 6,82%. USD 82,99 por licencia anual y USD 77,99 por encima de 71.023 licencias, con IVA, cuatro años. No usar estos precios como gasto ejecutado o presupuesto exclusivo de IA.
  https://www.ina.ac.cr/transparencia/Decisiones%20tomadas%20directrices%20actas%20y%20circulares/2025/Acta_Sesion_Ordinaria-31-2025.pdf
- Open English, 16/04/2026: describe FluentIA, Jenny y AI+Teacher Class en la alianza costarricense. Es una declaración del proveedor, no una validación independiente ni una prueba de configuración local. El vocabulario actual no tiene una categoría de fuente de proveedor; se conserva como `otra-secundaria`, con publicador y alcance explícitos, sin utilizarla como fuente oficial de ejecución.
  https://www.openenglish.com/blog/es/open-english-impulsa-la-meta-de-bilinguismo-de-costa-rica/
- Defensoría, 23/04/2026: solicita información al INA sobre datos sensibles de inscripción y su manejo. No es una resolución de infracción. Respuesta y conclusión no localizadas.
  https://www.dhr.go.cr/informacion_relevante/comunicados/2026/Abril/017_Defensoria_pide_informe_INA.pdf

No se incorpora el número de cuentas como resultado de IA. Falta verificar componentes habilitados, uso específico, controles y resultados atribuibles. El nombre exacto de un modelo no es requisito por sí solo para identificar una técnica; el vacío es la confirmación de la técnica desplegada y su uso local.

## Investigación dirigida: CGR

Nombre de trabajo: herramienta para monitoreo del entorno y planificación de Auditoría Interna.

Fuente primaria: Informe anual de labores 2025, Anexo 3, páginas 21–22. El anexo está actualizado **al 25 de marzo de 2026**, aunque el informe anual tiene corte de diciembre de 2025. Describe un avance basado en IA usado en la formulación del PAO 2026, pendiente de depuración. El plazo señalado era 30/06/2026: no afirmar cumplimiento ni trasladar el estado de marzo a octubre.

https://cgrfiles.cgr.go.cr/publico/docsweb/documentos/auditoria/informes/rendicion-cuentas/informe-anual-labores-2025.pdf

Pendientes:

- Localizar el resultado del proyecto de innovación y una actualización posterior a junio.
- Identificar herramienta, técnica, modelo, datos, responsables y alcance del uso en el PAO.
- Distinguir una prueba de concepto de un proceso estable de monitoreo.
- No confundirlo con AuditAI+, comunidad virtual de auditorías internas, ni con la herramienta AppSheet de control de tiempos descrita en otra fila del anexo. La abreviatura AI en el informe también significa Auditoría Interna.

Referencia de AuditAI+: https://www.cgr.go.cr/03-docs-ai.html

## Investigación dirigida: SBD jurídico

Procedimiento separado: `2026LD-000020-0002000001`, INDEX Portal Notarial y servicio de plataforma jurídica con IA. No fusionar con `sbd-ia-auditoria`.

Expediente oficial identificado en la revisión del 1 de octubre, pendiente de recuperar y verificar el acto vigente:
https://www.sicop.go.cr/moduloPcont/pcont/ctract/es/CE_CEJ_ESQ002.jsp?cartelNo=20260802614&cartelSeq=00

Las réplicas sugieren cierre de recepción el 28/08 y monto referencial CRC 4.448.000. No se trasladan estos valores a una ficha pública ni se usan para afirmar adjudicación. El objeto incluye más de un servicio: no atribuir todo el monto a IA.

Pendientes: acto final, contrato, proveedor, producto concreto, desglose de licencias y evidencia de activación o recepción conforme.

## Control editorial y de validación

- Resultado esperado: 39 iniciativas, 16 instituciones; 9 verificadas, 14 en seguimiento y 16 de ecosistema.
- No modificar las 38 fichas previas. No reclasificar ICE/OIJ, AyA, Vincent ni SBD Auditoría.
- No dar por revisada toda la agenda. Legislación conserva próximo control el 8/10; ENIA y seguimiento conservan el 15/10. La ficha nueva tiene revisión propia el 5/11.
- Las fechas de API de indicadores y Marco país avanzan solo porque cambian sus conteos derivados, no porque exista una edición nueva de ILIA, AILA o ENIA.
- La consulta a la base de conocimiento no estuvo disponible sin contexto de organización. Las decisiones y fuentes quedan en este documento y en los datos, sin configurar servicios nuevos.
- Validaciones aprobadas: schemas y referencias, 129 pruebas, lint y TypeScript, build de 179 páginas y auditoría de 177 HTML (174 localizados, paridad ES/EN).
- Regresión: las 38 fichas de R15 permanecen idénticas. No hay modificaciones en los snapshots ni descargas históricos de R8–R15; solo avanzan sus índices al nuevo corte.
- Revisión visual local: ficha Hello Brete en escritorio y móvil, idioma EN, registro del INA, búsqueda INA en ENIA y nuevas entradas del historial. Sin desbordamiento horizontal a 390 px. Se verificó en navegador la fecha dinámica de ENIA en ambos idiomas.
- Fuentes oficiales y referencias internas comprobadas; la página del proveedor se recuperó mediante su índice público, con acceso directo restringido. No se utilizaron cuentas, biometría ni datos personales para probar el servicio educativo.

## Rutas afectadas

- `/es/proyectos/ina-hello-brete/` y `/en/proyectos/ina-hello-brete/`.
- `/es/instituciones/ina/` y `/en/instituciones/ina/`.
- `/es/enia/` y `/en/enia/`, nota del INA.
- `/es/historial/` y `/en/historial/`.
- Catálogo, síntesis y Marco país: conteos derivados.
- `/api/`: R16 con snapshots y descargas; versiones anteriores intactas.
