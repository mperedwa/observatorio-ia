# Fase 4A: inventario ENIA y auditoría de Marco país

**Fecha:** 21 de agosto de 2026
**Estado:** implementada localmente; pendiente de revisión visual antes de cualquier publicación.

## Objetivo

Convertir el Plan de Acción ENIA en una fuente estructurada y auditable, sin tratar sus metas como proyectos ejecutados, y actualizar el corte de los instrumentos de Marco país.

## Entregables

- `src/data/json/eniaAcciones.json`: inventario íntegro de la matriz oficial.
- `src/data/schemas/eniaAcciones.schema.json`: contrato AJV para fuente, resumen, resultados, intervenciones, indicadores, evidencia externa y cruce con el catálogo.
- `src/data/eniaAcciones.ts`: tipos, enums y utilidades de conteo.
- Pruebas que fijan la extracción en 7 ejes, 13 líneas, 36 resultados, 129 intervenciones y 144 indicadores.
- Auditoría de ENIA, ILIA, OECD y legislación en `docs/auditoria-marco-pais-2026-08-21.md`.
- Inventario legislativo de 7 expedientes con alcance, evidencia oficial del estado y fecha de verificación.
- Conteos legislativos derivados para evitar otra divergencia entre datos, titular y KPI.

## Regla metodológica central

El Plan de Acción demuestra que una intervención fue declarada y tiene una meta oficial. No demuestra, por sí mismo, ejecución, técnica de IA verificable, uso operativo ni resultados. Por esa razón, las 129 intervenciones entran con:

- `estadoEjecucion: no-verificado`;
- `cruceCatalogo.estado: no-determinado`;
- `cruceCatalogo.proyectoIds: []`.

## Hallazgos de extracción

- La matriz oficial salta de 2.1.1 a 2.1.3. El bloque agrícola con celda de resultado vacía se conserva bajo 2.1.1; no se inventa 2.1.2.
- Algunas intervenciones e indicadores de la CCSS aparecen repetidos bajo 4.1.3. Se conservan como filas fuente; la Fase 4B resolverá duplicados semánticos.
- Se preservan literalmente líneas base y metas con valores comprimidos, aparentes errores de formato o “Por definir”.
- Solo 28 de las 129 filas se clasifican como `solucion-ia-declarada`; las demás corresponden a gobernanza, formación, investigación, articulación, infraestructura o automatización digital.

## Qué cambia visualmente

En esta subfase no se publica todavía una página ENIA. El cambio visible local está en la sección de legislación:

- 7 expedientes, 4 dictaminados y 3 en comisión;
- distinción entre regulación principal de IA y expedientes directamente relacionados;
- enlace de consulta, evidencia oficial del estado y fecha de última verificación.

La interfaz pública del inventario y del crosswalk corresponde a la Fase 4C, después de investigar y revisar las coincidencias.

## Siguiente subfase

**Fase 4B:** cruzar las 129 intervenciones con las 26 iniciativas del catálogo, resolver repeticiones y priorizar investigación únicamente para faltantes con señal de implementación o alto impacto.
