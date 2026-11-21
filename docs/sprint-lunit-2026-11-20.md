# Ficha Lunit e investigación de relaciones, 20 de noviembre de 2026

Preparación local autorizada por Mario después de revisar el anuncio de Facebook de MICITT y los resultados de dos agentes de investigación. El alcance es una ficha de Seguimiento, notas recíprocas con REDIMED y LIDIA, actualización de la institución CCSS y sus contadores, historial y registro parcial de monitoreo. Se entrega para revisión antes de commit, push o despliegue.

Mario autorizó el commit, push, despliegue y revisión en producción de la R22 preparada el 20 de noviembre de 2026. El registro parcial de Lunit se actualiza a `cambio-publicado` en el candidato de publicación; las fechas de revisión integral se conservan.

## Plan

- [x] Contrastar el producto y el anuncio con MICITT y documentación técnica primaria.
- [x] Revisar duplicación por institución, función, producto, datos e instrumento; registrar los vínculos pendientes.
- [x] Preparar ficha y notas ES/EN, conservar los estados anteriores y comprobar referencias y conteos.
- [x] Preparar R22 local y sus recursos derivados sin modificar las releases publicadas.
- [x] Validar datos, tipos, pruebas existentes, build y presentación de las páginas en ES/EN y móvil/escritorio.
- [x] Entregar el candidato para revisión.

## Línea base

`main` local y remoto: `db224b9b4fdf82eed2ddc5c5bd4be2baec23053d`, R21 publicada. Catálogo y API: 47 iniciativas, 11 verificadas, 19 en seguimiento y 17 de ecosistema; 22 instituciones u organismos. La CCSS tiene siete registros. ENIA conserva 120 intervenciones únicas: 4 verificadas, 14 parcialmente verificadas y 102 sin ejecución verificada.

El trabajo previo del pipeline sigue excluido: `.github/workflows/scrape.yml`, `scrapers/google-news.ts`, `scrapers/lib/classifier.ts`, `scripts/classify-vs-repo.ts`, `scripts/notify-classification-telegram.ts`, `tests/source-coverage.test.ts`, `docs/plan-monitoreo-2026-09-25.md` y `tests/monitoring-notifications.test.ts`.

## Evidencia y alcance

Todas las fuentes se consultaron el **20 de noviembre de 2026**.

| Fuente y emisor | Fecha documental | Sección / alcance |
| --- | --- | --- |
| [Inteligencia artificial apoyará detección temprana de cáncer mama en CCSS](https://www.micitt.go.cr/el-sector-informa/inteligencia-artificial-apoyara-deteccion-temprana-de-cancer-mama-en-ccss), MICITT | El HTML recuperado no muestra fecha explícita de publicación. Consultado el 20/11/2026; no atribuirle una fecha documental inferida. | Anuncio inicial y «Del compromiso a la acción». Identifica convenio CCSS–Roche, Lunit INSIGHT MMG y Tibás-Uruca-Merced. Describe uso previsto y metas, sin acreditar primer examen procesado ni resultados locales. |
| [Lunit INSIGHT MMG, expediente K211678](https://www.accessdata.fda.gov/cdrh_docs/pdf21/K211678.pdf#page=14), documentación del fabricante alojada por FDA | Resumen técnico preparado el 15/11/2021; determinación del 07/10/2021 y corrección administrativa posterior. | Página física 14, página impresa 10 del resumen, tabla de características, columna Lunit. Documenta aprendizaje profundo para imágenes mamográficas. Acredita la técnica del producto; no su versión instalada, autorización o rendimiento en Costa Rica. |
| [Costa Rica pone en marcha agresiva estrategia para mejorar diagnóstico de cáncer de mama](https://www.teletica.com/amp/nacional/costa-rica-pone-en-marcha-agresiva-estrategia-para-mejorar-diagnostico-de-cancer-de-mama_415850), Teletica | 21/08/2026 | Antecedente secundario: describe convenio CCSS–Roche e ImpulSALUD, sin identificar Lunit. La primera evidencia histórica de la colaboración no equivale a inicio clínico ni a identificación del producto en agosto. |
| [Lunit INSIGHT MMG](https://www.lunit.io/en/ai-radiology-software/insight-mmg/), fabricante | Sin fecha visible | Página de producto y FAQ. Contexto técnico genérico, no evidencia de condiciones de tratamiento de imágenes ni integración con REDIMED en el piloto local. No se trasladan afirmaciones comerciales de desempeño al catálogo. |

El comunicado de MICITT se recuperó completo con `fetch` de Node (HTTP 200). El documento FDA y la nota de Teletica se contrastaron directamente. La noticia antigua de REDIMED y el acta 9504 de CCSS devolvieron 403 o timeout. El acta 9338 ofreció solo un extracto indexado de la página impresa 48, no una lectura integral ni captura; ese extracto no se utiliza para afirmar independencia del piloto de 2026.

## Decisiones

- ID propuesto: `ccss-lunit-mamografias`. Institución responsable: CCSS. Roche se registra como colaborador y Lunit como fabricante, sin añadir instituciones al contador ni atribuir una adjudicación a Roche.
- Tipo: componente de IA; catálogo: Seguimiento; fase documentada: anunciado; IA: técnica confirmada para el producto.
- Existencia y técnica confirmadas con fuentes separadas. Ejecución clínica, uso operativo y resultados no determinados. Gobernanza parcialmente documentada por la responsabilidad diagnóstica del radiólogo; el protocolo local queda pendiente.
- Primera evidencia: 21/08/2026, limitada al antecedente de colaboración. Identificación de Lunit comprobada el 20/11/2026. No se fija fecha de inicio de piloto ni de operación. Las 800 mamografías mensuales y 2.400 mujeres en tres meses se conservan como metas.
- Notas recíprocas con REDIMED y LIDIA mediante `relacion-no-acreditada`. No equivalencia, dependencia, continuidad ni independencia demostradas. Se mantienen sus clasificaciones y evaluaciones anteriores; la revisión actual de esas fichas se limita a la relación editorial.
- No cambia ENIA, legislación ni las fechas de revisión integral de la agenda. No se atribuye cumplimiento de metas ENIA ni se verifica una adopción del Ministerio de Salud.
- Las imágenes compartibles se regeneran con los conteos actuales. Su pie de fecha, antes fijado en agosto de 2026, se deriva ahora de la última entrada del historial público y se formatea según el idioma, sin depender del reloj de compilación.

## Preguntas pendientes

Texto, fecha, duración y obligaciones del convenio; financiación y licencias; primer estudio procesado y fecha de uso clínico; versión del software; integración con REDIMED o LIDIA; custodia de imágenes y validación local; resultados del piloto. No se contacta a instituciones durante esta preparación.

## Validación

El candidato local suma **48 iniciativas: 11 verificadas, 20 en seguimiento y 17 de ecosistema**, en las mismas **22 instituciones u organismos**. CCSS reúne ocho fichas: una verificada, cuatro en seguimiento y tres de ecosistema. ENIA permanece en 4 verificadas, 14 parciales y 102 sin ejecución verificada.

- Validación JSON/AJV y referencias correctas. Las únicas entradas anteriores modificadas son las relaciones de REDIMED y LIDIA y el resumen/descripción y contador de CCSS; no se alteran las evaluaciones ni fechas de verificación históricas de esas dos iniciativas.
- Candidato construido en una copia aislada que excluye el trabajo previo del pipeline: 146 pruebas en 22 archivos, tipos de app y scripts y lint correctos. Se actualizaron las expectativas existentes de conteos; no se añadieron pruebas que repliquen el contenido de la ficha.
- Build estática de 209 rutas; auditoría de 207 HTML y 204 documentos localizados, con paridad ES/EN.
- 28 comprobaciones de navegador: portada, catálogo, Lunit, REDIMED, LIDIA, CCSS e historial en ES/EN y móvil/escritorio; sin errores de JavaScript ni desbordamiento horizontal persistente, con fuentes y enlaces recíprocos correctos. Se inspeccionó visualmente la ficha de Lunit y el recurso de cifras.
- R22, API, manifest, descargas y checksums preparados. Las catorce releases anteriores y sus descargas se conservaron byte a byte. Los 32 PNG compartibles se regeneraron con los nuevos conteos y un pie de fecha derivado del historial, comprobado en ambos idiomas.
- Agenda: cambia únicamente el alcance derivado de Seguimiento (19 a 20) y se agrega una revisión parcial como `cambio-detectado`. Las fechas de revisión integral de todos los frentes y el inventario ENIA quedan intactos.
- Los ocho archivos previos del pipeline se conservaron. No se hizo staging, commit, push ni despliegue. Producción continúa en R21.

Vista previa: `http://127.0.0.1:4322/es/proyectos/ccss-lunit-mamografias/`, `http://127.0.0.1:4322/es/instituciones/ccss/` y `http://127.0.0.1:4322/es/historial/`. Antes de publicar habrá que registrar la revisión como cambio publicado y verificar el candidato exacto del índice; en producción se comprobará también la coherencia tipográfica tras el problema de caché observado en R21.

## Publicación autorizada

El alcance publicado será el candidato R22 revisado, sin los ocho archivos previos del pipeline. Se validará una copia aislada del índice de Git antes del commit y del push a `main`. Después se comprobarán CI, Vercel, paridad de los archivos públicos con el commit, tipografías, enlaces recíprocos, datos y presentación móvil/escritorio en ES/EN. Las notas de preparación anteriores describen el estado previo a este GO.

El candidato exacto del índice, con el registro parcial promovido a cambio publicado, aprobó 146 pruebas en 22 archivos, JSON/AJV, ambos chequeos de tipos, lint, build y auditoría de los 207 HTML esperados. Los archivos de datos y los 32 PNG coinciden con el candidato revisado. Solo se añade esta constancia documental después de los controles.
