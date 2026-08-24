# Fase 5C: puesta en marcha operativa

Fecha: 21 de agosto de 2026.

## Resultado

La agenda pública de monitoreo ya tiene un circuito técnico que convierte fechas y señales en tareas editoriales. El circuito detecta, clasifica, recuerda y deja trazabilidad, pero no cambia el catálogo automáticamente.

Esta fase no publica datos nuevos sobre proyectos o expedientes. Su objetivo es que las próximas actualizaciones se tramiten de manera predecible, verificable y reversible.

## Flujo de una señal

1. Los scrapers y monitores consultan fuentes con su cadencia programada.
2. `classify-vs-repo` contrasta los candidatos con proyectos, recursos, análisis y decisiones previas.
3. Una señal relevante genera un paquete con estado fijo `propuesta-no-verificada`.
4. GitHub recibe una tarea `scrape-review` o `legislacion-update` con el hallazgo y su procedencia.
5. El revisor interno hace cross-check read-only y solicita verificación de fuente primaria cuando corresponde.
6. Mario decide `INVESTIGAR`, `UPDATE` o `NO` sobre una propuesta concreta.
7. Un cambio autorizado se prepara localmente, se valida y se deja en un commit para revisión.
8. Push y despliegue requieren una autorización posterior y separada.

Google News y Delfino siguen siendo señales secundarias. No prueban existencia, ejecución, técnica de IA, resultados ni estado legislativo por sí solos.

## Cambios técnicos

### Relevo legislativo reparado

`create-legislacion-update-issue` ahora lee primero el reporte consolidado `scraper-runs/last-run.json`, que es el artefacto real de `scrape:all`. Mantiene compatibilidad con los reportes individuales `asamblea-*.json` para ejecuciones aisladas.

La alerta contiene el valor anterior, el valor detectado, la fuente y el rationale. Delfino puede originar la señal, pero la guía de revisión exige contrastar comisión, estado o actividad con una fuente oficial antes de editar `legislacion.json`.

### Cobertura de noticias ampliada

Google News pasó de tres consultas a diez frentes:

- las nueve instituciones que tienen ficha en el observatorio;
- una búsqueda transversal de IA en el sector público costarricense.

Las consultas se limitan a los 90 días recientes y conservan el identificador institucional en cada candidato. Los enlaces se resuelven al medio original antes de entrar al clasificador cuando el navegador puede hacerlo.

El límite global se reparte por rondas: cada frente con resultados aporta primero un candidato antes de que una institución aporte el segundo. Esto evita que las primeras consultas desplacen a INAMU, INS o a la búsqueda transversal.

### MIDEPLAN con respaldo conservador

El listado oficial de MIDEPLAN responde 403 a la automatización desde el entorno actual. El scraper conserva ese intento como ruta principal. Si falla, ejecuta búsquedas acotadas en Google News y verifica uno por uno los enlaces resultantes.

Solo se conserva un resultado cuando la URL final pertenece a `mideplan.go.cr` o a uno de sus subdominios. Google sirve como mecanismo de descubrimiento; la evidencia que recibe el pipeline sigue siendo una página oficial de MIDEPLAN.

La corrida real de aceptación recuperó seis enlaces oficiales. Este respaldo depende de la indexación de Google y puede tener retraso, por lo que no reemplaza una revisión manual del marco país.

### Agenda editorial accionable

`check-monitoring-due` compara la fecha civil de Costa Rica con `fechaProximaRevision` y selecciona frentes vencidos, que vencen hoy o que entran en la anticipación hábil de su cadencia: un día para semanal, tres para mensual y cinco para trimestral o semestral.

El workflow `monitoring-due.yml` corre en días hábiles a las 07:00 de Costa Rica. Para cada combinación de frente y fecha:

- abre como máximo un issue `monitoring-review` mientras siga abierto;
- incluye fuente base, cadencia, última y próxima revisión;
- no envía Telegram cuando crea la tarea; el watcher avisa una vez cuando existe un veredicto listo para decisión;
- no registra automáticamente un resultado `sin-cambios`;
- no modifica ninguna fecha ni dataset.

La próxima fecha solo se mueve cuando una persona aprueba una revisión bilingüe con `issueUrl` y se ejecuta `record-review --apply` después de revisar su dry-run. El issue permanece abierto hasta que la revisión llega a `main` y CI aprueba el commit; entonces `close-monitoring-review.yml` comprueba el resultado final y el avance de fecha antes de cerrarlo.

Desde R10, `monitoreo` es una bitácora pública rodante y no se duplica en cada release sustantiva. Los otros once endpoints continúan dentro de releases inmutables. Así una revisión periódica sin cambios conserva trazabilidad sin crear un corte completo de datos cada semana.

### Revisor y permisos

La guía del watcher fue actualizada para consumir las secciones vigentes y los paquetes de evidencia. Se retiraron del procedimiento los stubs, el pull/rebase automático y el despliegue después de un GO.

El workflow general de scraping ahora usa permisos mínimos: lectura de contenido y escritura de issues. Ya no solicita permiso de escritura del repositorio ni de pull requests.

### Verificación de CI

La configuración de TypeScript para scripts recuperó la resolución de aliases `@/`. También se corrigió un acceso inseguro a un campo opcional de la migración histórica del modelo de evidencia. Con ello, el mismo typecheck declarado en CI vuelve a ser ejecutable.

## Operación manual

### Comprobar la agenda sin escribir datos

```bash
npm run check-monitoring-due
npm run create-monitoring-review-issue -- --dry-run
```

Para simular otra fecha:

```bash
npm run check-monitoring-due -- --as-of 2026-09-22 --lead-days 7
```

### Ejecutar el monitoreo general

```bash
npm run scrape:all
npm run classify-vs-repo
npm run create-scrape-review-issue -- --dry-run
npm run create-legislacion-update-issue -- --dry-run
```

### Registrar una revisión editorial

```bash
npm run record-review -- --input /ruta/revision.json
npm run record-review -- --input /ruta/revision.json --apply
npm run validate-data
npm run close-monitoring-review # CI después del push; localmente hace skip sin token
```

El primer comando es una simulación obligatoria. El segundo solo se ejecuta después de revisar la fuente, el contenido bilingüe y el `issueUrl`. El cierre remoto ocurre únicamente después de un push autorizado.

## Límites conocidos

- MIDEPLAN, CCSS y Hacienda aplican bloqueos que impiden o limitan el acceso directo desde algunos entornos.
- Google News y otros índices pueden omitir una publicación reciente o resolver tarde su URL final.
- PROSIC mantiene un feed vacío; su informe anual continúa bajo vigilancia manual.
- Una corrida sin candidatos no demuestra por sí sola que no hubo cambios; solo informa que las fuentes y consultas automatizadas no produjeron señales.
- Los workflows nuevos no quedan activos en GitHub hasta que esta fase reciba autorización de push.

## Período de comparación antes del lanzamiento

Después del push autorizado y antes del despliegue público, ejecutar un período mínimo de 14 días o seis corridas generales, lo que resulte mayor.

En cada corrida se debe comparar:

1. candidatos automáticos contra la búsqueda manual habitual de noticias;
2. falsos negativos encontrados manualmente;
3. falsos positivos y ruido por fuente;
4. enlaces que no lograron resolverse;
5. alertas legislativas contra la ficha oficial;
6. recordatorios creados, resueltos y repetidos.

El criterio de salida es que no haya pérdidas sistemáticas en una institución, que ningún dato se haya modificado sin decisión humana y que los recordatorios no se dupliquen mientras su issue siga abierto.

## Pruebas de aceptación

La suite cubre:

- lectura del reporte legislativo consolidado;
- una corrida sin institución mapeada desde una fuente oficial transversal;
- señal nueva y paquete de evidencia no verificado;
- actualización posible de una ficha existente;
- validación estricta del dominio oficial de MIDEPLAN;
- respaldo MIDEPLAN con descarte de URLs externas;
- cobertura de las nueve instituciones en Google News;
- agenda próxima, vencida y sin duplicación de issues;
- contratos integrados que impiden stubs y cambios automáticos.

Antes del commit se ejecutan validación AJV, ambos typechecks, toda la suite de Vitest y la build estática bilingüe.
