# Auditoría de reclasificación del catálogo

Fecha de corte: 2026-08-19

## Resultado

Las 26 fichas de `src/data/json/proyectos.json` quedaron migradas al modelo de evidencia v2. El resumen se deriva con `resumirCatalogo`; no se almacena como un contador manual.

| Capa editorial | Total | Significado |
|---|---:|---|
| Adopción verificada | 5 | Sistema o componente de IA, en piloto u operación, con ejecución confirmada y trazabilidad limpia. |
| Seguimiento | 6 | Existe una iniciativa o servicio, pero falta confirmar la técnica, la ejecución completa o el uso operativo. |
| Ecosistema y capacidades | 15 | Investigación, formación, gobernanza, infraestructura o digitalización que no debe contarse como sistema de IA adoptado. |
| Descartadas | 0 | Ninguna ficha se ocultó del catálogo en esta fase. |
| Pendientes de migración | 0 | Las 26 fichas tienen núcleo v2 completo. |

Los cinco casos que cumplen la regla de adopción verificada al corte son:

1. `pj-clasificacion-cobros`
2. `pj-ml-presupuestal`
3. `pj-nymiz`
4. `ccss-lidia`
5. `hacienda-anomaly`

La cifra no expresa una auditoría de todo el Estado. Expresa únicamente cuántas fichas del inventario actual cumplen todos los criterios definidos y cuentan con evidencia pública localizada al 19 de agosto de 2026.

## Criterio aplicado

Una ficha alimenta el contador de adopción verificada únicamente cuando cumple simultáneamente:

```text
modeloVersion = 2
estadoCatalogo = verificado
tipoIniciativa IN (sistema-ia, componente-ia)
faseImplementacion IN (piloto, operativo)
estadoIA = confirmada
evaluacion.ejecucion.estado = confirmado
trazabilidad = sin errores
```

La revisión distinguió seis dimensiones de evidencia: existencia, ejecución, técnica de IA, uso operativo, resultados y gobernanza. Una fuente que respalda una meta o un objetivo no se reutilizó como prueba de ejecución.

## Matriz de decisiones

| ID | Tipo | Capa | Fase v2 | IA | Decisión editorial |
|---|---|---|---|---|---|
| `pj-clasificacion-cobros` | Sistema IA | Verificado | Piloto | Confirmada | La fuente institucional lo denomina plan piloto; se retiró la cifra de 1,302,899 documentos por falta de respaldo atribuible. |
| `pj-ml-presupuestal` | Sistema IA | Verificado | Operativo | Confirmada | La rendición de cuentas confirma aprendizaje automático, uso y ahorro reportado. |
| `pj-nymiz` | Componente IA | Verificado | Operativo | Confirmada | La implementación y el uso institucional están confirmados; se retiró el supuesto ahorro de tiempo de 80% por no ser una métrica del Poder Judicial. |
| `pj-sentencias-sala-iv` | Investigación | Ecosistema | Operativo | Confirmada | Es una herramienta de investigación académica, sin interfaz pública ni uso jurisdiccional operativo demostrado. |
| `pj-giro-continuo` | Digitalización no IA | Ecosistema | Operativo | No determinada | La automatización y los giros están confirmados; no se localizó técnica de IA ni dependencia acreditada del clasificador. |
| `pj-chatbot` | Sistema IA | Seguimiento | Operativo | Declarada sin técnica | El canal y sus métricas históricas están confirmados; la arquitectura no es pública. |
| `ccss-tec-formacion` | Programa de capacidades | Ecosistema | Finalizado | Confirmada | Curso y prototipos de formación, no sistemas clínicos desplegados. |
| `ccss-edus` | Infraestructura digital | Ecosistema | Operativo | No determinada | EDUS es la plataforma base; LIDIA y AIDA se registran por separado como capas de IA. |
| `ccss-aida` | Componente IA | Seguimiento | Planificado | Declarada sin técnica | La fuente anuncia que se desplegará; no se localizó confirmación posterior de inicio de uso. |
| `ccss-lidia` | Componente IA | Verificado | Piloto | Confirmada | Acta institucional confirma modelo, ejecución y uso; las cifras detalladas quedan rotuladas como resultados reportados por prensa. |
| `ccss-redimed` | Infraestructura digital | Ecosistema | Desarrollo | Confirmada | La ficha mezcla la red de imágenes parcialmente desplegada y un componente de IA en validación; requiere separación futura. |
| `ccss-depuracion-listas` | Componente IA | Seguimiento | Piloto | Declarada sin técnica | Piloto y supervisión humana confirmados; no hay técnica, proveedor ni resultados atribuibles publicados. |
| `ccss-logistica-ia-abastecimiento` | Componente IA | Seguimiento | Operativo | Declarada sin técnica | La evidencia disponible sigue siendo periodística; falta fuente primaria de la CCSS. |
| `hacienda-anomaly` | Sistema IA | Verificado | Operativo | Confirmada | Se separó de TRIBU-CR y ATENA; técnica, ejecución, revisión humana y resultado fiscal están documentados. |
| `hacienda-asistente` | Sistema IA | Seguimiento | Operativo | Declarada sin técnica | Infoyasistencia está operativa, pero no publica técnica ni métricas. |
| `hacienda-tribu-cr` | Infraestructura digital | Ecosistema | Operativo | No determinada | Plataforma tributaria integrada; no se localizó un componente de IA concreto en la fuente oficial. |
| `mep-intel` | Programa de capacidades | Ecosistema | Operativo | Confirmada | Especialidad educativa, no un sistema utilizado por el MEP para prestar servicios. |
| `micitt-linc` | Programa de capacidades | Ecosistema | Operativo | No determinada | Red de formación e innovación; ofrecer cursos de IA no equivale a operar IA. |
| `micitt-conecta` | Infraestructura digital | Ecosistema | Desarrollo | Descartada | Interoperabilidad basada en X-Road, lanzada en marzo de 2026; 30 instituciones participaron en diagnóstico, no en integraciones ya operativas. |
| `micitt-agroboost` | Programa de capacidades | Ecosistema | Operativo | Declarada sin técnica | Se retiraron las cifras de 86 productores y 50% de productividad al no localizarse documentación primaria reproducible. |
| `ucr-citic-ia-software` | Investigación | Ecosistema | Desarrollo | Confirmada | Se sustituyó la fuente sobre inundaciones por la ficha oficial del proyecto activo 2025-2028. |
| `ucr-ciodd-ethical-ai` | Política y gobernanza | Ecosistema | Desarrollo | Confirmada | Proyecto de ética y capacidades en educación superior, no un sistema operativo. |
| `cenat-lania` | Programa de capacidades | Ecosistema | Planificado | Confirmada | La fuente de 2023 presenta una propuesta y un plan piloto; no confirma que el laboratorio entrara en operación. |
| `cenat-cnca-clasificacion-arritmias-ecg` | Investigación | Ecosistema | Prueba de concepto | Confirmada | Publicación y prototipo, sin validación clínica ni uso en pacientes. |
| `pj-sala-primera-induccion-ia` | Programa de capacidades | Ecosistema | Desarrollo | Declarada sin técnica | Proceso de inducción; la reducción histórica de casos no se atribuye a IA. |
| `pj-conamaj-chat-facilitadores` | Sistema IA | Seguimiento | Prueba de concepto | Confirmada | La fuente confirma un chat tipo LLM presentado en una feria, no usuarios operativos ni resultados. |

## Correcciones de mayor impacto

- Clasificación de cobros: la [fuente del Poder Judicial](https://pj.poder-judicial.go.cr/index.php/component/content/article/760-poder-judicial-implementa-inteligencia-artificial-para-disminuir-circulante-en-materia-cobratoria) dice “plan piloto”; no respalda el volumen que aparecía antes.
- Nymiz: la [implementación institucional](https://pj.poder-judicial.go.cr/index.php/component/content/article/1186-novedosa-herramienta-de-inteligencia-artificial-se-aplica-en-mejora-de-la-proteccion-de-datos?Itemid=409&catid=8) está confirmada, pero no la reducción de tiempo de 80% publicada anteriormente.
- Sala IV: la [UCR documenta](https://www.ucr.ac.cr/noticias/2025/07/09/la-inteligencia-artificial-analiza-de-manera-automatica-sentencias-de-la-sala-cuarta.html) acceso a más de 500,000 sentencias y uso académico, no 433,043 sentencias procesadas como resultado operativo.
- AIDA: la [CCSS usa tiempo futuro](https://aissfa.ccss.sa.cr/noticias/noticia?v=101282054203) al indicar que el asistente se desplegará; el calendario del plan no sustituye evidencia de ejecución.
- Hacienda: la solución de [detección de anomalías](https://www.microsoft.com/en/customers/story/1653565125024864159-inter-american-center-of-tax-administrations-costa-rica-financial-services-e-invoicing-anomaly-detection-solution-accelerator) se separó de TRIBU-CR y ATENA. La recuperación fiscal reportada se mantiene vinculada a la [fuente periodística que recoge la explicación de Hacienda](https://www.nacion.com/economia/hacienda-revela-la-tecnologia-que-le-permitio/G63WRWKZ7NHLXBSHCS6RI3T4JU/story/).
- CONECTA: el [comunicado del MICITT](https://www.micitt.go.cr/el-sector-informa/costa-rica-acelera-su-transformacion-digital-con-el-lanzamiento-del-proyecto) documenta lanzamiento, diagnóstico y hoja de ruta en marzo de 2026, no X-Road ya operativo en 30 instituciones.
- CITIC: la ficha ahora enlaza el [proyecto de investigación correcto](https://citic.ucr.ac.cr/proyectos/integracion-estrategias-inteligencia-artificial-procesos-ingenieria-software), activo de 2025 a 2028.

## Controles técnicos

- AJV exige el núcleo v2 completo para cada ficha.
- `encontrarErroresTrazabilidad` verifica IDs duplicados, referencias inexistentes y que cada fuente respalde la dimensión citada.
- Las pruebas fijan los cinco IDs que cumplen la regla de adopción al corte.
- El script `scripts/migrate-proyectos-evidencia-v2.ts` conserva una migración reproducible y falla si el inventario añade o elimina una ficha sin actualizar la matriz.
- `fuenteUrl` y `estado` permanecen como campos de compatibilidad hasta actualizar la API y la interfaz en fases posteriores.

## Pendiente para la Fase 3

La reclasificación todavía no cambia el titular principal ni presenta las tres capas de forma completa. La siguiente fase debe crear el índice de proyectos, actualizar fichas, tarjetas, instituciones, timeline, hero y metodología para exponer este modelo sin perder la compatibilidad actual.
