# Plan: flujo de agenda editorial de bajo ruido

Fecha: 2026-08-24

Estado: implementación local autorizada; publicación pendiente de autorización separada.

## Objetivo

Convertir la agenda editorial en un flujo donde la automatización prepare una revisión trazable y Mario reciba una decisión concreta, sin tratar una fecha próxima como si fuera evidencia de cambio y sin crear una release completa por cada revisión semanal sin novedades.

## Contrato operativo

1. El calendario abre un issue `monitoring-review` cerca de la fecha de revisión, según la cadencia y en días hábiles.
2. La creación del issue no envía Telegram ni modifica datos.
3. El watcher revisa el issue en modo de solo lectura, contrasta la fuente primaria y publica un veredicto estructurado.
4. Telegram se reserva para el veredicto listo para decisión: `SIN CAMBIOS`, `CAMBIO` o `INVESTIGAR`.
5. Un GO autoriza el cambio local exacto y su validación. Push y despliegue requieren autorización separada, salvo que Mario los incluya expresamente en el mismo mensaje.
6. El issue se cierra únicamente después de comprobar que `main` contiene la revisión aprobada y que la próxima fecha avanzó.
7. El issue #42 permanece abierto y sin procesar durante esta implementación.

## Arquitectura

### Anticipación por cadencia

La política pública de monitoreo declarará `diasAnticipacionHabiles`:

- semanal: 1;
- mensual: 3;
- trimestral: 5;
- semestral: 5.

El CLI conservará `--lead-days` como override explícito para simulaciones y compatibilidad, pero la ejecución programada usará la política por cadencia.

### Bitácora rodante y releases

La API distinguirá dos modos de publicación:

- `release`: dataset incluido en el corte inmutable, su manifest y su bundle;
- `rolling`: bitácora append-only servida por el endpoint vivo, con schema y fecha editorial, pero sin `releaseUrl` del corte sustantivo.

`monitoreo` será la única colección rodante. `historial` seguirá siendo el changelog de cambios publicados y permanecerá dentro de las releases. R10 establecerá este contrato una sola vez y conservará R8/R9 byte por byte.

### Trazabilidad y cierre

Las nuevas entradas de revisión exigirán `issueUrl`. Un script de cierre verificará simultáneamente:

- que el issue es `monitoring-review` y contiene un marcador válido;
- que existe una revisión con ese `issueUrl`;
- que su resultado es `sin-cambios` o `cambio-publicado`;
- que la fecha próxima del frente avanzó más allá de la fecha cubierta.

Solo entonces cerrará el issue. `cambio-detectado` lo mantendrá abierto.

## Archivos previstos

- `src/data/json/monitoreo.json`: anticipación por cadencia.
- `src/data/monitoreo.ts`: tipos de anticipación e `issueUrl`.
- `src/data/schemas/monitoreo.schema.json`: contrato JSON correspondiente.
- `scripts/check-monitoring-due.ts`: cálculo por días hábiles y política por cadencia.
- `scripts/create-monitoring-review-issue.ts`: marker v2, runbook accionable y eliminación del Telegram inicial.
- `scripts/record-monitoring-review.ts`: validación de `issueUrl`.
- `scripts/close-resolved-monitoring-issues.ts`: cierre remoto seguro tras publicación.
- `.github/workflows/monitoring-due.yml`: creación silenciosa de la tarea.
- `.github/workflows/close-monitoring-review.yml`: cierre posterior a cambios en la bitácora publicados en `main`.
- `scripts/build-api.ts`: modo `release`/`rolling` y R10.
- `src/data/json/apiCodebook.json` y schema: política de publicación.
- `package.json`, tests y documentación operativa: comandos y cobertura.
- skill local `scrape-review-watcher`: soporte de issues `monitoring-review:v2`, activado solo para marcadores nuevos o petición explícita.

## Riesgos y controles

- No reescribir R8/R9: comparar hashes antes y después.
- No cerrar #42: verificar su estado al final.
- No silenciar fallas: el issue sigue siendo la cola auditable aunque Telegram inicial desaparezca.
- No cerrar un cambio todavía no publicado: exigir coincidencia por `issueUrl` y resultado final.
- No romper consumidores de la API: conservar las doce rutas y la envoltura; añadir metadata en el manifest sin modificar el payload de cada endpoint.
- No publicar automáticamente datos curados: el watcher solo investiga y recomienda.

## Validación

- AJV y validador referencial.
- Pruebas unitarias de días hábiles, override, marker v2, runbook y cierre.
- Prueba E2E del pipeline sin mutaciones automáticas.
- Pruebas de API: doce endpoints vivos, once datasets en R10, `monitoreo` rodante, R8/R9 intactos.
- Typecheck, lint, suite completa, build y auditoría estática.
