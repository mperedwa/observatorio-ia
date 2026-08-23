# Plan de consistencia metodológica y editorial

Fecha: 2026-08-23
Estado: ejecutado y publicado
Alcance: catálogo, fichas, portada, legislación, indicadores, consentimiento analítico y API pública.

## Objetivo

Cerrar las inconsistencias detectadas en la revisión independiente del sitio sin reducir el estándar de evidencia, sin reescribir la release inmutable R8 y sin publicar cambios antes de una nueva revisión y autorización explícita.

## Diagnóstico y decisión por hallazgo

| Prioridad | Hallazgo | Diagnóstico local / público | Decisión |
| --- | --- | --- | --- |
| Alta | Nueve instituciones, siete enumeradas | Confirmado en `indicadores.json`: faltan INAMU e INS en ES y EN. | Completar la enumeración y añadir una regresión que compare la lista con el catálogo institucional. |
| Alta | Hacienda sin fuente primaria de ejecución | Confirmado en la ficha publicada. La investigación localizó el Informe de Riesgos Macrofiscales 2025 de Hacienda, que registra el uso continuo del E-IAD, y documentación directa del CIAT sobre instalación y técnica. | Conservar la adopción verificada, cambiar la fuente principal a Hacienda, añadir Hacienda y CIAT a la matriz y reservar La Nación para resultados reportados. La regla derivada exigirá fuente primaria para ejecución. |
| Media | `IA confirmada` y `Uso operativo` mezclan objetos distintos | Confirmado en MEP y LINC. `estadoIA` se presenta como si confirmara técnica, aunque esa dimensión vive por separado. | Presentar el campo como `Relación con IA en la fuente`, introducir `no-aplica` en la matriz y rotular `usoOperativo` como uso operativo de IA. Mantener el nombre de campo `estadoIA` en la API por compatibilidad. |
| Media | Vacíos sin pregunta ni próxima revisión | Confirmado en fichas verificadas y de ecosistema. | Validar automáticamente que todo `no-determinado` tenga al menos una pregunta abierta o `fechaProximaRevision`. Marcar `no-aplica` cuando la dimensión no corresponde a un sistema de IA y programar revisiones según la cadencia editorial para los vacíos reales. |
| Media | `Fuentes oficiales` incluye Delfino | Confirmado: `fuenteUrl` es referencia complementaria y `fuenteEstadoUrl` es evidencia oficial. | Separar visualmente `Fuente oficial del estado` y `Referencia complementaria`; documentar esa semántica en el codebook y CSV. |
| Media | CCSS descrita como IA en producción | Confirmado en una nota de coyuntura; LIDIA está en piloto. | Sustituir por `instituciones con adopción de IA verificada en piloto u operación` en ES y EN. |
| Baja | Interpretación presentada como dato ILIA | Confirmado en el cierre del bloque ILIA. | Añadir el rótulo visible `Lectura del Observatorio` / `Observatory interpretation`. |
| Baja | Consentimiento en español en `/en/` | Confirmado en producción. El componente se renderiza inicialmente con `es` y corrige el idioma solo después de hidratar. | Renderizar el gestor dentro del layout localizado y pasar el locale desde el servidor para que el HTML inicial ya sea correcto. |
| Urgente | Posible API antigua de 23 proyectos | El endpoint y la documentación vivos reportan 29 proyectos y la release R8; el resultado antiguo corresponde a una versión previamente indexada. | No hay desincronización viva que migrar. Añadir paridad exacta entre fuente y endpoint, abrir una release R9 para los cambios actuales y conservar R8 byte por byte. |

## Contrato metodológico resultante

Una iniciativa solo cuenta como adopción verificada cuando:

1. usa el modelo de evidencia v2;
2. está en la capa `verificado`;
3. es un sistema o componente de IA;
4. está en piloto u operación;
5. la fuente establece una relación explícita con IA;
6. la técnica de IA está confirmada;
7. la ejecución está confirmada;
8. al menos una fuente primaria oficial o de acceso a información respalda la ejecución; y
9. la trazabilidad no contiene errores.

`no-determinado` significa que la evidencia revisada no permite resolver una afirmación y activa seguimiento. `no-aplica` significa que la dimensión no corresponde al objeto documentado, por ejemplo la técnica o el uso operativo de IA dentro de un programa de capacitación que no es un sistema.

## Fases de ejecución

### C1. Modelo y datos

- [x] Añadir `no-aplica` al tipo, schema, diccionario bilingüe y codebook.
- [x] Corregir MEP y LINC, y normalizar las mismas dimensiones en otros registros no sistémicos comparables.
- [x] Incorporar las fuentes directas de Hacienda y actualizar su trazabilidad.
- [x] Añadir preguntas y fechas de seguimiento donde los vacíos sí son materiales.
- [x] Endurecer el contador de adopción y la validación de completitud.

### C2. Presentación e internacionalización

- [x] Completar la lista de instituciones.
- [x] Cambiar las etiquetas ambiguas de relación con IA y uso operativo.
- [x] Separar fuentes legislativas oficiales y complementarias.
- [x] Corregir la nota sobre producción y rotular la interpretación de indicadores.
- [x] Renderizar el consentimiento analítico en el idioma de la ruta desde el HTML inicial.

### C3. API reproducible

- [x] Actualizar codebook, documentación humana y ejemplo `jq` con la regla completa.
- [x] Crear la release `2026-08-23-r9`; mantener intacta `2026-08-22-r8`.
- [x] Regenerar endpoints, schemas, checksums, bundle y CSV.
- [x] Añadir una prueba que compare el catálogo fuente con `/api/proyectos.json` y otra que preserve R8.

### C4. Control de calidad

- [x] `npm run validate-data`
- [x] TypeScript del sitio y de scrapers mediante la build de producción.
- [x] `npm run lint`
- [x] `npm test` — 107 pruebas aprobadas.
- [x] `npm run build` — 145 páginas estáticas generadas.
- [x] `npm run audit:static` — 143 HTML auditados, 140 localizados y paridad ES/EN completa.
- [x] Inspección ES/EN de portada, fichas MEP/LINC/Hacienda, legislación, indicadores, consentimiento y documentación API.
- [x] Escaneo de términos sensibles en los cambios de catálogo y diccionario.

La comparación SHA-256 antes/después confirmó que los 38 archivos de la release R8 permanecen idénticos. El filtro `jq` documentado reproduce exactamente las seis adopciones verificadas y el endpoint corriente de proyectos coincide de forma exacta con `src/data/json/proyectos.json`.

### C5. Publicación

- [x] Autorización explícita de Mario recibida el 2026-08-23.
- [x] Release implementada en el commit `7cbfdac` y enviada a `origin/main`.
- [x] GitHub Actions CI `32660404593` finalizó correctamente.
- [x] Vercel publicó el deployment `dpl_5vF6k59bJyPVncSsCpW81sSxybwn` en `observatorioia.org` y `www.observatorioia.org`.
- [x] Smoke test público ES/EN, API, releases, checksums y headers de descarga aprobado.

## Criterios de aceptación

- La portada enumera exactamente las nueve instituciones documentadas.
- Hacienda conserva su clasificación solo porque ejecución y técnica quedan respaldadas con fuentes directas adecuadas.
- Ningún programa de capacidades presenta la operación del programa como uso operativo de una IA.
- Ninguna ficha con dimensiones `no-determinado` carece simultáneamente de pregunta y próxima revisión.
- Delfino no aparece bajo un rótulo de fuente oficial.
- CCSS no se describe como producción cuando la adopción verificada es piloto.
- La interpretación ILIA queda identificada como editorial.
- `/en/` entrega el consentimiento en inglés desde el HTML inicial.
- La API corriente coincide con las fuentes, R9 es reproducible y R8 permanece inmutable.
- Los conteos siguen siendo 29 iniciativas, 9 instituciones, 6 adopciones verificadas, 7 en seguimiento y 16 de ecosistema, salvo que una validación sustantiva obligue a documentar otra decisión.

## Fuera de alcance

- No se añaden iniciativas nuevas.
- No se publican recomendaciones tácticas, presupuestos privados ni planes de contacto.
- No se ejecutan scrapers ni se aceptan candidatos automáticamente.
- No se hace push ni despliegue sin una autorización posterior y explícita.
