# Plan de evolución: catálogo basado en evidencia y cruce ENIA

Fecha: 2026-08-19

## Decisión recomendada

El Observatorio no debería resolver el problema agregando un cuarto valor al campo `estado`. El problema de fondo es que hoy una sola entrada intenta responder preguntas diferentes:

1. ¿Existe una iniciativa documentada?
2. ¿Es realmente un sistema o componente de IA?
3. ¿Está anunciada, en desarrollo, en piloto o en operación?
4. ¿La ejecución está verificada o solo declarada?
5. ¿Qué fuente respalda cada afirmación?

La evolución recomendada es mantener un inventario amplio de iniciativas relacionadas con IA, pero dividir su presentación pública en tres conjuntos:

- **Sistemas verificados:** sistemas o componentes de IA con evidencia de piloto u operación. Son los únicos que alimentan el contador principal de adopción.
- **Iniciativas en seguimiento:** acciones oficiales, planes, anuncios o desarrollos cuya ejecución todavía no puede verificarse. Aquí deben vivir las acciones ENIA como la predicción cantonal de homicidios del ICE mientras no aparezca evidencia de implementación.
- **Ecosistema y capacidades:** formación, investigación, laboratorios, interoperabilidad, política y otra infraestructura habilitante. Son relevantes, pero no deben contarse como sistemas de IA adoptados por el Estado.

El sitio puede conservar y mostrar más información que hoy, sin inflar la cifra de adopción real.

## Diagnóstico confirmado

### El contador actual mezcla objetos distintos

Antes de esta auditoría, el hero y la API contaban las 26 entradas de `proyectos.json` como “proyectos IA activos”. El lenguaje visible ya se corrigió provisionalmente a “iniciativas documentadas”, pero el archivo todavía contiene:

- 18 entradas marcadas `operativo`;
- 6 marcadas `piloto`;
- 2 marcadas `planificado`;
- sistemas tecnológicos;
- programas de formación;
- líneas de investigación;
- laboratorios e infraestructura;
- declaraciones de intención sin sistema anunciado.

Por eso, `proyectos.length` no es una medida válida de sistemas de IA activos.

### Un solo estado produce contradicciones visibles

Antes de la corrección, la ficha `pj-sala-primera-induccion-ia` aparecía como `Planificado`, pero la interfaz mostraba simultáneamente:

- “Operativo desde: 2026”;
- “Resultados verificados”;
- “Sin resultados”.

El campo `desde` se usa como año de operación aunque en algunas entradas representa el año del anuncio o de la primera evidencia. El campo `resultado` es obligatorio incluso cuando no existe ningún resultado.

### La evidencia no está modelada

Cada ficha tiene una sola `fuenteUrl`. Esa URL no puede indicar qué afirmaciones respalda ni distinguir entre:

- existencia de la iniciativa;
- objetivo declarado;
- fase de ejecución;
- técnica de IA;
- uso operativo;
- resultado medido;
- salvaguardas o gobernanza.

También se rotulaba toda URL como “Fuente oficial”, aunque varias son prensa o fuentes secundarias. La auditoría encontró al menos una asociación incorrecta: `ccss-logistica-ia-abastecimiento` apuntaba a un artículo de Infobae sobre depuración de listas de espera, no sobre monitoreo de abastecimiento.

### Hay datos derivados desincronizados

La página Marco país mostraba un total dinámico de 26, pero conservaba un desglose antiguo de “18 operativos, 4 piloto, 1 planificado”, equivalente a 23. El pie de página y varias secciones todavía decían “junio 2026” o “mayo 2026” aunque el catálogo cambió en agosto. Estas inconsistencias visibles se corrigieron sin presentar el desglose actual como una auditoría de adopción verificada.

### La base técnica es estable

Al 19 de agosto de 2026:

- AJV valida los siete datasets;
- TypeScript pasa;
- Vitest pasa 14 pruebas;
- el build estático genera 123 páginas;
- no hay enlaces internos rotos en el `out/` generado;
- la portada y los gráficos funcionan visualmente en escritorio y móvil.

La única advertencia técnica restante es el uso de `<img>` en `/comparte`; no bloquea el sitio.

### Correcciones aplicadas durante la auditoría

- Se corrigió la fuente mal asociada de `ccss-logistica-ia-abastecimiento` y se registró la corrección en el historial público.
- Se cambió “Fuente oficial” por “Fuente consultada” en la ficha actual, porque el catálogo todavía mezcla fuentes primarias y secundarias.
- Se agregó `agricultura` a la unión TypeScript de categorías para alinearla con el schema y los datos.
- Las fichas y tarjetas ahora muestran “Operativo desde”, “Piloto desde” o “Primera evidencia” según el estado actual.
- El bloque de resultados cambia a “Evidencia del piloto” o “Evidencia disponible” y deja de mostrarse siempre en verde.
- Se definieron dimensiones iniciales para Recharts; la build dejó de emitir las seis advertencias de tamaño inválido.
- La portada, los KPIs, la línea de tiempo, el panorama, el marco país, los assets compartibles y la API ahora describen las 26 entradas como iniciativas documentadas, no como 26 proyectos activos.
- Se sincronizó el desglose visible del catálogo a 18 entradas marcadas operativas, 6 piloto y 2 planificadas, dejando claro que son estados actuales del catálogo.
- Se actualizaron las fechas editoriales visibles a agosto de 2026 y la metodología dejó de llamar “oficiales” a todas las fuentes públicas.
- Se actualizaron los metadatos SEO/OpenGraph y se regeneraron los 32 PNG bilingües de `/comparte` para que la redacción anterior no siga circulando en descargas o previews.

Tras estas correcciones, datos, pruebas, TypeScript y build vuelven a pasar. Permanece únicamente la advertencia no bloqueante del `<img>` usado en `/comparte`.

## Modelo de datos propuesto

### 1. Clasificación de la iniciativa

Agregar `tipoIniciativa`:

- `sistema-ia`
- `componente-ia`
- `infraestructura-digital`
- `programa-capacidades`
- `investigacion`
- `politica-gobernanza`
- `digitalizacion-no-ia`
- `por-determinar`

Esto evita contar formación, investigación o interoperabilidad como despliegue de un sistema de IA.

### 2. Ubicación editorial dentro del catálogo

Agregar `estadoCatalogo`:

- `verificado`
- `seguimiento`
- `ecosistema`
- `descartado`

`descartado` sirve para conservar decisiones editoriales, duplicados y casos investigados que resultaron no ser IA. No tiene que aparecer en la portada, pero evita investigar la misma pista repetidamente.

### 3. Fase de implementación

Reemplazar gradualmente el actual `estado` por `faseImplementacion`:

- `anunciado`
- `planificado`
- `desarrollo`
- `prueba-concepto`
- `piloto`
- `operativo`
- `pausado`
- `suspendido`
- `finalizado`
- `cancelado`
- `no-determinado`

La fase describe el ciclo de vida. No describe la calidad de la evidencia.

### 4. Confirmación de IA

Agregar `estadoIA`:

- `confirmada`
- `declarada-sin-tecnica`
- `no-determinada`
- `descartada`

Una acción incluida en la ENIA puede confirmar que una institución **declara** que usará IA, sin permitir todavía determinar si utiliza machine learning, reglas, estadística convencional o IA generativa.

### 5. Evaluación de evidencia por dimensión

Agregar un resumen por atributo:

```json
{
  "evaluacion": {
    "existencia": { "estado": "confirmado", "fuenteIds": ["enia-plan-2025"] },
    "ejecucion": { "estado": "no-determinado", "fuenteIds": [] },
    "tecnicaIA": { "estado": "no-determinado", "fuenteIds": [] },
    "usoOperativo": { "estado": "no-determinado", "fuenteIds": [] },
    "resultados": { "estado": "no-determinado", "fuenteIds": [] },
    "gobernanza": { "estado": "no-determinado", "fuenteIds": [] }
  }
}
```

Estados permitidos:

- `confirmado`
- `parcialmente-confirmado`
- `inferido`
- `no-determinado`
- `contradicho`

### 6. Fuentes múltiples y trazables

Reemplazar `fuenteUrl` por `fuentes[]`, manteniendo temporalmente el campo anterior para compatibilidad:

```json
{
  "id": "enia-plan-2025",
  "titulo": { "es": "Plan de Acción ENIA", "en": "ENIA Action Plan" },
  "url": "https://...",
  "publicador": "MICITT",
  "tipoFuente": "primaria-oficial",
  "fechaPublicacion": "2025-08-11",
  "fechaConsulta": "2026-08-19",
  "respalda": ["existencia", "objetivo-declarado", "meta"]
}
```

Tipos iniciales:

- `primaria-oficial`
- `acceso-informacion`
- `multilateral`
- `academica`
- `prensa`
- `otra-secundaria`

La etiqueta A/B/C/D/E de la investigación es útil como disciplina, pero mezcla procedencia y certeza. En el schema conviene separarlas:

- **procedencia:** oficial, académica, prensa, etc.;
- **naturaleza de la afirmación:** hecho, objetivo declarado, meta, resultado reportado, resultado independiente o inferencia editorial;
- **evaluación:** confirmada, parcial, inferida, no determinada o contradicha.

Así, “el Plan declara control, monitoreo y prevención” puede estar confirmado por fuente primaria sin convertir “el sistema mejora la prevención” en un resultado verificado.

### 7. Fechas sin ambigüedad

Sustituir `desde` por campos explícitos:

- `fechaPrimeraEvidencia`
- `fechaAnuncio`
- `fechaInicioPiloto`
- `fechaInicioOperacion`
- `fechaUltimaVerificacion`
- `fechaProximaRevision`

Solo se muestra “Operativo desde” cuando existe `fechaInicioOperacion` y la fase es `operativo`.

### 8. Objetivos, resultados y preguntas abiertas

Separar:

- `objetivoDeclarado`
- `resultadoVerificado[]`
- `preguntasAbiertas[]`
- `datosConocidos`
- `datosNoDeterminados`

Una ficha sin resultados debe omitir el bloque verde de resultados y mostrar, si corresponde, “No se localizaron resultados públicos”.

### 9. Relaciones entre iniciativas

Agregar `relaciones[]` con tipos:

- `mismo-que`
- `posible-duplicado`
- `componente-de`
- `depende-de`
- `alimenta-a`
- `distinto-de`
- `relacion-no-acreditada`

Esto permite expresar formalmente que SUPERCOP y la acción del ICE son sistemas distintos, y que una integración entre ambos no está acreditada.

## Regla del contador principal

Una entrada cuenta como adopción verificada únicamente si cumple todos estos criterios:

```text
modeloVersion = 2
AND
estadoCatalogo = verificado
AND tipoIniciativa IN (sistema-ia, componente-ia)
AND faseImplementacion IN (piloto, operativo)
AND estadoIA = confirmada
AND evaluacion.ejecucion.estado = confirmado
```

La regla debe vivir en una función compartida y tener pruebas. No se debe almacenar un booleano manual ni usar `proyectos.length`.

Hasta completar la reclasificación de las 26 entradas actuales, no conviene publicar una nueva cifra de sistemas verificados.

El requisito técnico `modeloVersion = 2` evita que una ficha parcialmente migrada alimente el contador. No añade una condición editorial nueva; garantiza que el núcleo de clasificación, fuentes y fechas pasó la validación completa del schema.

## Ejemplo: proyecto ICE sobre homicidios

Clasificación recomendada al 19 de agosto de 2026:

```json
{
  "id": "ice-perfiles-cantonales-homicidios",
  "nombreDescriptivo": {
    "es": "Perfiles cantonales y predicción de homicidios",
    "en": "Cantonal profiles and homicide prediction"
  },
  "nombreOficial": null,
  "tipoIniciativa": "sistema-ia",
  "estadoCatalogo": "seguimiento",
  "faseImplementacion": "planificado",
  "estadoIA": "declarada-sin-tecnica",
  "fechaPrimeraEvidencia": "2024-08-23",
  "fechaUltimaVerificacion": "2026-08-19",
  "instituciones": [
    { "id": "ice", "rol": "responsable-formal" },
    { "id": "oij", "rol": "fuente-de-datos-declarada" }
  ],
  "evaluacion": {
    "existencia": { "estado": "confirmado", "fuenteIds": ["enia-plan-2025"] },
    "ejecucion": { "estado": "no-determinado", "fuenteIds": [] },
    "tecnicaIA": { "estado": "no-determinado", "fuenteIds": [] },
    "usoOperativo": { "estado": "no-determinado", "fuenteIds": [] },
    "resultados": { "estado": "no-determinado", "fuenteIds": [] },
    "gobernanza": { "estado": "no-determinado", "fuenteIds": [] }
  }
}
```

No entra al contador de adopción. Sí aparece en seguimiento con su meta oficial, fecha de corte y preguntas pendientes.

## Crosswalk ENIA

Crear `src/data/json/eniaAcciones.json` y su schema. Cada fila del Plan de Acción debe registrar:

- eje y línea de acción;
- objetivo exacto;
- institución responsable y aliados;
- indicador;
- línea base;
- metas por año;
- tipo de intervención;
- IDs relacionados del catálogo;
- tipo de coincidencia;
- evidencia externa posterior;
- fase real verificada;
- fecha de última revisión;
- recomendación editorial.

Estados de cruce:

1. `mapeado-exacto`
2. `coincidencia-parcial`
3. `posible-duplicado`
4. `nuevo-con-evidencia`
5. `enia-solamente`
6. `no-es-sistema-ia`
7. `no-determinado`

La página pública recomendada es `/[locale]/enia/`, enlazada desde Marco país. Debe mostrar primero la diferencia entre meta oficial y ejecución verificable, no presentar las metas como progreso realizado.

Primeros casos para probar el modelo:

- ICE: perfiles cantonales y predicción de homicidios;
- AyA: análisis de precios y documentos para evaluación de ofertas;
- INS: clasificación automatizada de reclamos médicos;
- CCSS: auditoría automatizada, comportamientos inusuales y servicios predictivos;
- SUPERCOP: registro separado, IA no determinada e integración con ICE no acreditada.

## Cambios de experiencia pública

### Portada

- Cambiar el headline a “sistemas de IA verificados en piloto u operación”.
- Añadir una cifra separada de iniciativas oficiales en seguimiento.
- Evitar la expresión “instituciones con IA operativa” cuando la institución solo tenga formación, investigación o infraestructura.
- Mostrar la fecha de corte del catálogo, no un mes escrito manualmente.

### Catálogo de proyectos

Crear `/[locale]/proyectos/` con tres vistas:

- Verificados
- En seguimiento
- Ecosistema y capacidades

Los filtros avanzados y la búsqueda pueden esperar datos de analítica, pero la separación editorial no debe esperar porque determina el significado del inventario.

### Ficha de proyecto

Mostrar en la cabecera:

- tipo de iniciativa;
- fase;
- estado de IA;
- estado de evidencia de ejecución;
- última verificación.

Agregar secciones:

- Qué está confirmado
- Qué declara la institución
- Qué no se pudo determinar
- Resultados verificados
- Fuentes, con título, publicador, fecha y tipo
- Preguntas abiertas
- Relaciones con otros sistemas
- Historial de cambios de estado

### Línea de tiempo

- Vista predeterminada: solo pilotos y operaciones verificadas.
- Opción secundaria: mostrar anuncios y planes con puntos huecos o línea discontinua.
- Usar fecha de piloto u operación, no el actual `desde` ambiguo.

### Instituciones

Reemplazar `proyectosActivos` manual por contadores derivados:

- sistemas verificados;
- iniciativas en seguimiento;
- capacidades/ecosistema.

### Marco país

- Enlazar el crosswalk ENIA.
- Automatizar todos los desgloses numéricos.
- Cambiar “adopción real” por una formulación que distinga adopción verificada, seguimiento y capacidades.
- Mantener las metas ENIA claramente rotuladas como metas, no resultados.

### Metodología

Convertir `/quien-mantiene` en una metodología reproducible:

- criterios de inclusión y exclusión;
- regla de conteo;
- jerarquía de fuentes;
- diferencia entre objetivo declarado y resultado observado;
- política de correcciones;
- cadencia de revisión;
- tratamiento de campos no determinados.

### Análisis y publicaciones

El primer producto editorial derivado debería ser “Lo anunciado versus lo verificable en el Plan de Acción ENIA”. El valor no está en afirmar que las acciones fracasaron, sino en mostrar con fecha de corte qué ejecución puede demostrarse públicamente y qué sigue sin documentación.

### API pública

- Añadir `schemaVersion` separado de la versión del paquete.
- Publicar conteos desglosados por `estadoCatalogo`, fase y tipo de iniciativa.
- [x] Añadir `/api/enia-acciones.json`.
- [x] Derivar `lastUpdate` del último cambio real del dataset, no de la hora de cada build.
- Mantener temporalmente `fuenteUrl` y `estado` como campos de compatibilidad, marcados como deprecados.
- Documentar el cambio semántico antes de modificar el significado de `/api/proyectos.json`.

### Mantenimiento y experiencia general

- [x] Actualizar `README.md` y `planning.md`: ambos describen el catálogo, la API y las fases vigentes.
- Añadir una verificación automática de enlaces externos con distinción entre enlace roto y servidores que bloquean `HEAD`.
- Regenerar los assets de `/comparte` únicamente después de fijar la nueva cifra y el nuevo headline; hoy heredan la misma semántica amplia del contador.
- Resolver la advertencia de `<img>` en `/comparte` o documentar por qué se conserva para descargas de tamaño exacto.
- Añadir una indicación visible de desplazamiento horizontal en la línea de tiempo móvil.
- Revisar la densidad de navegación y la longitud de la portada después de acumular los 30 días de analítica ya previstos en la auditoría del 19 de agosto.

## Registros actuales que requieren revisión prioritaria

No es una reclasificación definitiva, sino una cola de auditoría:

- `pj-sala-primera-induccion-ia`: declaración e inducción, no sistema anunciado.
- `ccss-edus`: separar la plataforma EDUS operativa de una capa de IA planificada.
- `ccss-tec-formacion`: programa de formación.
- `mep-intel`: programa educativo.
- `micitt-linc`: infraestructura y capacidades.
- `micitt-conecta`: interoperabilidad digital, no necesariamente IA.
- `ucr-citic-ia-software`: línea de investigación; la fuente actual no coincide bien con la descripción general.
- `ucr-ciodd-ethical-ai`: investigación y formación.
- `cenat-lania`: laboratorio/propuesta institucional.
- `hacienda-tribu-cr`: plataforma digital; verificar qué componente concreto utiliza IA.
- `ccss-redimed`: distinguir red de imágenes, componente de priorización y fase de cada uno.
- `ccss-logistica-ia-abastecimiento`: corregir la fuente asociada y mantener explícita la confianza media hasta conseguir evidencia primaria.

## Plan de ejecución

### Fase 0 — Correcciones de credibilidad

- [x] Corregir fuentes mal asociadas identificadas en la auditoría.
- [x] Corregir la unión TypeScript de categorías.
- [x] Eliminar advertencias de tamaño de Recharts en build.
- [x] Evitar “Operativo desde” y “Resultados verificados” en entradas planificadas.
- [x] Sincronizar fechas, desglose y lenguaje provisional de los contadores visibles.

### Fase 1 — Schema v2 y reglas

- [x] Añadir enums y campos nuevos.
- [x] Crear funciones derivadas de inclusión y conteo.
- [x] Añadir pruebas unitarias de las reglas.
- [x] Mantener compatibilidad con los datos actuales durante la migración.

Implementado en `src/data/modelo-evidencia.ts` y `src/data/schemas/proyectos.schema.json`. Las fichas legacy continúan validando; una ficha que declare `modeloVersion: 2` debe incluir clasificación, evaluación, fuentes y fechas principales. El validador también comprueba IDs de fuente, referencias de resultados y relaciones entre iniciativas.

Estado técnico al cerrar la fase: 26 iniciativas documentadas, 26 pendientes de migración y 0 entradas elegibles todavía para el contador v2. Ese cero es un estado de migración, no una conclusión pública sobre la adopción actual; el sitio conserva el titular provisional de 26 iniciativas documentadas hasta completar la Fase 2.

### Fase 2 — Reclasificar las 26 entradas

- [x] Revisar tipo de iniciativa, fase, estado IA y evidencia.
- [x] Auditar que cada fuente respalde las afirmaciones indicadas.
- [x] Separar sistemas base de capas de IA.
- [x] No publicar una nueva cifra principal hasta terminar esta fase.

Implementado en `src/data/json/proyectos.json`, con migración reproducible en `scripts/migrate-proyectos-evidencia-v2.ts` y matriz de decisiones en `docs/auditoria-reclasificacion-proyectos-2026-08-19.md`. Las 26 fichas tienen núcleo v2 completo y trazabilidad sin errores.

Estado derivado al cerrar la fase: 26 iniciativas documentadas, 5 adopciones verificadas, 6 iniciativas en seguimiento, 15 registros de ecosistema y capacidades, 0 descartadas y 0 pendientes de migración. Las cinco adopciones verificadas son `pj-clasificacion-cobros`, `pj-ml-presupuestal`, `pj-nymiz`, `ccss-lidia` y `hacienda-anomaly`.

El sitio conserva por ahora el titular amplio de iniciativas documentadas. La nueva cifra y la separación editorial se expondrán de forma coherente en la Fase 3, después de revisar localmente la interfaz completa.

### Fase 3 — Nueva interfaz del catálogo

- [x] Crear el índice `/proyectos/`.
- [x] Actualizar cards, fichas, instituciones, timeline, hero y metodología.
- [x] Mostrar campos no determinados de forma explícita.
- [x] Actualizar mapa y assets de `/comparte` para usar las tres capas.
- [x] Corregir resúmenes institucionales que conservaban afirmaciones del modelo legado.

Implementado con una vista inicial de 5 adopciones verificadas y navegación hacia 6 iniciativas en seguimiento y 15 registros de ecosistema y capacidades. El catálogo incluye búsqueda y filtro institucional; las fichas presentan objetivo declarado, datos confirmados, campos no determinados, resultados, matriz de seis dimensiones, metadatos de fuentes, preguntas y relaciones. La línea de tiempo inicia con las cinco adopciones verificadas y permite ampliar a las 26 iniciativas con fecha documental explícita.

Los conteos institucionales ya no usan `proyectosActivos` para la presentación pública: se derivan de las fichas. También se revisaron los siete resúmenes institucionales para retirar afirmaciones que trataban AIDA, CONECTA, EDUS, Giro Continuo, TRIBU-CR, LaNIA u otras capacidades como sistemas de IA operativos sin la evidencia correspondiente.

### Fase 4 — Inventario y crosswalk ENIA

- [x] Extraer todas las intervenciones del Plan de Acción.
- [x] Clasificarlas sin decidir prematuramente que son sistemas.
- [x] Cruzarlas con el catálogo.
- [x] Investigar solo los faltantes con mayor impacto o evidencia de avance.

La Fase 4A estructura la versión oficial del 11 de agosto de 2025 en 7 ejes, 13 líneas de acción, 36 resultados esperados, 129 intervenciones y 144 indicadores. Todas las intervenciones comienzan con ejecución no verificada y cruce no determinado. En paralelo, la auditoría de Marco país corrige el inventario a 7 expedientes relacionados con IA (4 dictaminados y 3 en comisión), confirma que MICITT sigue publicando la ENIA 2024–2027 y su Plan de Acción 2025, y mantiene sin cambios ILIA 2025 y los valores OCDE ya publicados. Detalle en `docs/fases/2026-08-21-fase-4a-inventario-enia-marco-pais.md`.

La Fase 4B completa el crosswalk y la investigación priorizada; la Fase 4C publica el explorador, incorpora Ela, reclamos médicos del INS y OIJ–TEC con fichas v2 completas y actualiza el corte a 29 iniciativas: 6 verificadas, 7 en seguimiento y 16 de ecosistema. Detalle en `docs/fases/2026-08-21-fase-4b-crosswalk-enia.md` y `docs/fases/2026-08-21-fase-4c-interfaz-enia-fichas.md`.

### Fase 5 — API, historial y monitoreo

- [x] Publicar schema y endpoint ENIA.
- [x] Registrar transiciones de estado y revisiones sin cambios.
- [x] Añadir cadencia de revisión según el frente: semanal, mensual, trimestral o semestral.
- [x] Adaptar scrapers para proponer evidencias, no para convertir automáticamente menciones en proyectos verificados.

La Fase 5B publica `monitoreo.json` y `/api/monitoreo.json`, transforma `/historial` en agenda y bitácora editorial, añade un watcher mensual de la ENIA y del PDF del Plan de Acción, y reemplaza los stubs de proyectos del pipeline por paquetes con estado `propuesta-no-verificada`. El comando `record-review` funciona como dry-run por defecto y solo actualiza la bitácora con `--apply`; nunca altera los datasets sustantivos.

## Criterios de aceptación

- Ninguna iniciativa anunciada o planificada alimenta el contador de adopción verificada.
- Ningún programa de formación, investigación o infraestructura se cuenta como sistema desplegado.
- Una fuente oficial que describe una meta no se usa como prueba de ejecución.
- Cada afirmación pública relevante puede rastrearse a una o más fuentes concretas.
- Los campos desconocidos se muestran como “No determinado”, no se completan por inferencia.
- Las fichas planificadas nunca muestran “Operativo desde”.
- Un bloque “Resultados verificados” solo aparece si existen resultados y fuentes que los respalden.
- Los contadores se derivan del catálogo y no quedan hardcodeados en copy.
- El build no emite advertencias de dimensiones de gráficos.
- ES y EN conservan la misma estructura y el mismo significado metodológico.

## Orden recomendado

Primero schema y reclasificación; después UI; finalmente crosswalk completo ENIA y automatización. Construir primero la nueva interfaz sobre el modelo actual solo haría más visible la ambigüedad existente.
