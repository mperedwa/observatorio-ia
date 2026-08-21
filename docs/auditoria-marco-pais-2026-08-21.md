# Auditoría de Marco país

**Corte:** 21 de agosto de 2026
**Alcance:** ENIA, Plan de Acción, ILIA, indicadores OCDE y expedientes legislativos relacionados con IA.
**Criterio:** una meta, una moción o una consulta institucional no se interpreta como ejecución, aprobación ni resultado.

## Resultado ejecutivo

| Elemento | Resultado de la verificación | Cambio en el sitio |
|---|---|---|
| ENIA | MICITT continúa publicando la ENIA 2024–2027. No se encontró una estrategia posterior. | Sin cambio de versión. |
| Plan de Acción ENIA | La versión vigente publicada por MICITT sigue siendo la del 11 de agosto de 2025. | Se estructura el inventario fuente: 7 ejes, 13 líneas, 36 resultados, 129 intervenciones y 144 indicadores. |
| Estado institucional de la ENIA | MICITT la identifica como “En ejecución” para el periodo 2024–2027. | Se conserva como estado del instrumento, no como prueba de ejecución de cada intervención. |
| ILIA | El portal oficial continúa en ILIA 2025; no se encontró una edición 2026 publicada. | Sin cambio de puntaje o posición. |
| OECD DGI / OURdata | La nota país del Digital Government Outlook 2026 confirma DGI 2025 = 0.45 y OURdata 2025 = 0.14. | Sin cambio de valores. |
| Legislación | El inventario anterior omitía dos expedientes directamente relacionados y el copy mostraba un conteo interno incorrecto. | 7 expedientes: 4 dictaminados, 3 en comisión, ninguno aprobado. |

## Fuentes oficiales consultadas

- [MICITT, Inteligencia Artificial](https://www.micitt.go.cr/gobierno_digital/inteligencia_artificial): página vigente de la estrategia y del Plan de Acción.
- [MICITT, Plan de Acción ENIA, versión 11 de agosto de 2025](https://www.micitt.go.cr/sites/default/files/2025-10/Plan%20de%20Acci%C3%B3n%20ENIA%20-%20Versi%C3%B3n%2011%20agosto%202025%20Versi%C3%B3n%20Publicaci%C3%B3n.pdf).
- [MICITT, Dirección de Investigación, Desarrollo e Innovación](https://micitt.go.cr/micitt/direccion-de-investigacion-desarrollo-e-innovacion): periodo 2024–2027 y estado “En ejecución”.
- [CEPAL, ILIA 2025](https://www.cepal.org/es/publicaciones/86007-indice-latinoamericano-inteligencia-artificial-ilia-2025-hallazgos-principales) y [portal oficial ILIA](https://indicelatam.cl/).
- [OECD, Costa Rica: Digital Government Outlook 2026](https://www.oecd.org/en/publications/digital-government-outlook-2026_d46c0555-en/costa-rica_c3064731-en.html).
- [Asamblea Legislativa, respuesta oficial sobre expedientes de IA, 7 de abril de 2026](https://www.asamblea.go.cr/ca/Lists/cp/DispForm.aspx?ContentTypeId=0x01008922D325D4FE564292B03FD67DF003A7&ID=22860).
- [Asamblea Legislativa, dictamen del expediente 23.919 en la Comisión de Derechos Humanos](https://www.asamblea.go.cr/p/_layouts/15/listform.aspx?ContentTypeID=0x01004E12B2E2CFD4F444AFB0294A74EFE734&ID=5337&ListId=%7B937EAF7C-558C-4582-9E6B-C0131EE9E1EB%7D&PageType=4).
- [TSE, acta 33-2026](https://www.tse.go.cr/actas/2026/33-2026-del-21-de-abril-de-2026.html), expediente 25.171.
- [TSE, acta 23-2026](https://www.tse.go.cr/actas/2026/23-2026-del-10-de-marzo-de-2026.html), expediente 25.379.
- [Asamblea Legislativa, mociones del expediente 23.885](https://www.asamblea.go.cr/glcp/Consultas_mociones/MOCIONES%20DE%20FONDO%20V%C3%8DA%20ART%C3%8DCULO%20137/23.885/23.885%20Primer%20d%C3%ADa%2023-4-2025.pdf).

## Auditoría legislativa

El inventario distingue dos alcances para no afirmar que los siete expedientes son leyes generales de IA:

- **Objeto principal de IA (4):** 23.771, 23.919, 24.484 y 24.875.
- **Directamente relacionados (3):** 23.885, 25.171 y 25.379.

Estado derivado del dataset:

- **Dictaminados (4):** 23.771, 23.885, 23.919 y 24.484.
- **En comisión (3):** 24.875, 25.171 y 25.379.
- **Aprobados (0).**

Correcciones editoriales relevantes:

- El copy anterior decía “dos dictaminados, tres en comisión”, aunque los cinco registros existentes ya contenían tres expedientes con estado `dictaminado`.
- Se incorpora el 23.885 porque sus mociones documentan reglas propuestas sobre propaganda digital, perfiles falsos, contenido sintético, IA y deepfakes. Se presenta como expediente directamente relacionado y no se confunden las mociones con texto aprobado.
- Se incorpora el 25.379 porque su objeto cubre manipulación coordinada mediante cuentas falsas o automatizadas, coordinación algorítmica e IA.
- Se amplía el resumen del 25.171: además de rasgos personales y creaciones artísticas, el texto consultado tiene alcance electoral. El TSE objetó esa redacción el 21 de abril de 2026; la objeción no equivale a archivo.
- Para el 24.875 se conserva `en-comision`: hubo actividad mediante mociones después del corte oficial del 7 de abril, pero no se encontró evidencia oficial de dictamen.

La iniciativa popular “Costa Rica 2035: Estrategia Nacional para el Desarrollo Ético y Responsable de la Inteligencia Artificial”, publicada en julio de 2026, queda como elemento de vigilancia. No se incorpora como expediente legislativo porque al corte no tiene número de proyecto de ley.

## Cobertura de monitoreo

| Objeto | Mecanismo actual | Cadencia propuesta | Regla editorial |
|---|---|---|---|
| 7 expedientes | `scrape:asamblea`, que lee `legislacion.json` dinámicamente | Semanal | El scraper propone cambios de estado y comisión; no reescribe resúmenes. La evidencia oficial se revisa antes de aceptar. |
| ILIA | `watch:ilia` | Mensual; semanal entre septiembre y noviembre | No modificar el año o puntaje hasta que exista una edición oficial publicada. |
| DGI / OURdata | `watch:oecd` | Mensual | Verificar la nota país y el dataset oficial antes de cambiar cifras. |
| ENIA y Plan de Acción | Revisión oficial documentada en esta auditoría | Mensual | Comparar versión, fecha y archivo publicado. Una nueva meta no prueba ejecución. |
| Iniciativas populares y nuevos expedientes | Búsqueda oficial y revisión editorial | Trimestral | No sumar propuestas sin número de expediente; clasificar su relación con IA antes de publicar. |

La automatización del fingerprint de la página y del PDF de la ENIA queda en la Fase 5. Los monitores existentes de Asamblea, ILIA y OECD ya cubren los otros tres frentes; al añadir los nuevos números al dataset, el scraper legislativo los incorpora automáticamente.

La corrida de control del 21 de agosto consultó los 7 expedientes y cerró con 0 actualizaciones aplicables. También permitió endurecer dos reglas del monitor:

- Delfino muestra “Ciencia, Tecnología y Educación” para el 23.919, pero la Asamblea documenta que el dictamen fue emitido por Derechos Humanos. Como el expediente ya está dictaminado, una divergencia secundaria de comisión se registra como nota y no como propuesta automática.
- Delfino muestra “Presentado” para el 25.379, mientras el TSE documenta una consulta aprobada por la Comisión de Asuntos Jurídicos. “Presentado” no pertenece al enum editorial y ahora se trata como estado no accionable hasta contar con verificación oficial.

## Decisiones de datos

- Cada expediente requiere `alcanceIA`, `fuenteEstadoUrl` y `fechaUltimaVerificacion`.
- Los titulares y el KPI legislativo derivan total y estados desde `legislacion.json`.
- Las URLs de Delfino se mantienen como ficha de consulta; el estado se respalda además con una fuente oficial de Asamblea o TSE.
- El inventario ENIA conserva las transcripciones fuente en español y no corrige por inferencia celdas vacías, valores comprimidos o repeticiones.
