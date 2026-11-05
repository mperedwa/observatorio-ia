# Sprint de mantenimiento, 5 de noviembre de 2026

Autorizado por Mario: revisar los cuatro frentes vencidos y retirar los mensajes directos del pipeline del Observatorio a Telegram. La recepción y validación semanal en este chat continúa. Tras revisar los resultados, Mario autorizó el commit, push y despliegue de este lote el 5 de noviembre de 2026.

## Plan y límites

- [x] M1. Desactivar los cuatro emisores de Telegram del repositorio con configuración aislada en GitHub, sin borrar secretos, pausar CI ni modificar otros proyectos. Mantener los chequeos y sus artefactos. Probar el opt-in y comprobar el estado remoto.
- [x] M2. Revisar los siete expedientes: fuentes oficiales y contraste secundario. Documentar fallas de acceso; no transformar limitaciones en ausencia de actividad ni actualizar fechas de evidencia sin respaldo.
- [x] M3. Revisar ENIA: versión pública, huella del PDF, integridad de 129 registros y 120 intervenciones únicas, correspondencias y señales institucionales prioritarias. Distinguir control documental de verificación integral de ejecución.
- [x] M4. Revisar las 16 iniciativas en seguimiento, priorizando las preguntas técnicas y de ejecución pendientes. Conservar inventario de fuentes consultadas, resultados y límites. No confundir el proceso de licencias del TEC con su asistente de auditoría.
- [x] M5. Revisar ILIA: portal y publicación primaria de CENIA/CEPAL, nueva edición o correcciones, cifra y posición de Costa Rica. Un documento de 2025 publicado en 2026 no es necesariamente ILIA 2026.
- [x] M6. Aplicar únicamente resultados sustentados a la agenda y bitácora local. No declarar una revisión integral cuando solo fue posible un control parcial. Validar datos, regresiones, tipos, build y API, con historial de releases preservado.

## Línea base y trabajo protegido

Catálogo R17: 42 iniciativas, 10 verificadas, 16 en seguimiento, 16 de ecosistema, 19 instituciones. Los informes hasta el 1 de noviembre ya se recibieron; no propusieron altas ni reclasificaciones. La contratación TEC `2026LD-000300-0006300001` aporta actividad de adquisición, no uso acreditado.

El trabajo previo no publicado del pipeline se conserva: `.github/workflows/scrape.yml` (modelo Groq y comentarios), `scrapers/google-news.ts`, `scrapers/lib/classifier.ts`, `scripts/classify-vs-repo.ts`, `scripts/notify-classification-telegram.ts`, `tests/source-coverage.test.ts`, `docs/plan-monitoreo-2026-09-25.md` y `tests/monitoring-notifications.test.ts`. El commit de configuración incluirá solo la nueva protección de Telegram, no esos cambios.

No borrar credenciales, historial, informes ni issues. No cambiar automatizaciones o bots de otros proyectos. El lote editorial y sus resultados se entregan para revisión antes de cualquier commit, push o despliegue de contenido.

## Evidencia y resultados

La configuración de Telegram quedó publicada en `acb14835023861e60874d31af866e133b45bde6e`; CI finalizó correctamente y la variable del repositorio está en `false`. Los cuatro envíos directos requieren opt-in explícito. Los monitores siguen activos.

La revisión encontró cambios que no estaban en el informe semanal: ILIA 2026, la declaración técnica de ChatbotPJ y contrato notificado de Vincent INVU. El detalle de fuentes, fechas y límites está en [el registro de evidencia](evidencia-mantenimiento-2026-11-05.md).

- Catálogo local: 42 iniciativas y 19 instituciones, sin altas. ChatbotPJ pasa a verificado; Vincent sigue en seguimiento con contrato notificado. Resultado: 11 verificadas, 15 en seguimiento y 16 de ecosistema.
- ILIA local: edición 2026, Costa Rica quinta de 20 con 56,0 puntos y brecha de 15,4 con Chile. Se conserva 2025, sin inferir progreso temporal por cambios de metodología.
- Agenda: catálogo revisado el 05/11, próxima revisión 05/12; ILIA revisado el 05/11, próximo control 12/11. Legislación y ENIA conservan sus fechas vencidas porque la validación fue parcial. Las limitaciones de acceso se muestran como tales.
- Pipeline editorial: `alcanceRevision: parcial` conserva fechas y no cierra issues. El registro aplica la intensificación semanal de ILIA entre septiembre y noviembre. Se añadieron regresiones para ambas reglas.
- Cola: validación oficial de 25.171 y discrepancias 23.919/25.379; revisión de ejecución de las intervenciones ENIA no cubiertas; reintentos CCSS/INVU y preguntas abiertas de seguimiento. GovOS/CPI queda como señal de cooperación para investigar, sin alta de catálogo.
- API: propuesta R18 local, schemas, descargas y checksums; releases R8–R17 intactas. Se regeneraron 32 imágenes bilingües para evitar cifras anteriores en las descargas.

GO de publicación recibido el 5 de noviembre de 2026. Publicar R18 mediante commit selectivo y push a `main`, que activa Vercel; verificar después el estado del despliegue, la API, las fichas y la agenda públicas contra ese commit. Las revisiones completas de catálogo e ILIA se registran como cambios publicados; las revisiones parciales de legislación y ENIA conservan sus pendientes. El trabajo previo del pipeline queda excluido. La investigación semanal y su recepción en este chat no se modifican.

Validación cerrada: JSON/AJV y referencias correctos; 148 pruebas en 23 archivos; tipos de aplicación y scripts; lint; build estática de 191 rutas; auditoría de 189 HTML y 186 documentos localizados con paridad ES/EN. Se revisaron 28 combinaciones de página, idioma y viewport, sin errores de JavaScript ni desbordamiento horizontal. Inspección visual de agenda, ILIA móvil y ficha ChatbotPJ; 32 PNG regenerados. Se comprobó que las releases anteriores no tienen cambios y que el trabajo previo del pipeline permanece separado. Los controles parciales siguen pendientes con sus límites explícitos.

Validación del candidato exacto de publicación: copia aislada del índice de Git, con los ocho archivos previos del pipeline excluidos. Pasaron 146 pruebas en 22 archivos, ambos chequeos de tipos, lint, build y auditoría estática. La diferencia de pruebas respecto del directorio de trabajo corresponde a los tests locales del pipeline que no forman parte de este lote.
