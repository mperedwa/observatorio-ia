# Fase 4C: interfaz pública ENIA y fichas con evidencia

**Fecha de corte:** 21 de agosto de 2026

**Estado:** implementada localmente; pendiente de revisión visual de Mario antes de publicar.

## Objetivo

Convertir el inventario y crosswalk de la Fase 4B en una experiencia pública que permita distinguir una meta oficial de su ejecución, incorporar los dos hallazgos oficiales que ya justificaban ficha y documentar OIJ–TEC sin fusionarlo con iniciativas distintas.

## Resultado público

La nueva ruta bilingüe `/es/enia/` y `/en/enia/` publica:

- 129 filas tal como aparecen en la matriz fuente;
- 120 intervenciones canónicas después de identificar 9 repeticiones;
- 29 filas que el Plan presenta como soluciones de IA, 25 canónicas;
- 83 acciones de política, formación, investigación, coordinación, infraestructura o automatización que no se presentan como sistemas de IA;
- 6 coincidencias exactas y 9 parciales con el catálogo;
- 22 compromisos de solución que permanecen solo en ENIA porque no se corroboró ejecución fuera del Plan.

La vista inicial muestra las soluciones declaradas sin repeticiones. El usuario puede cambiar al cruce con el catálogo o al inventario completo, buscar por texto y filtrar por eje o estado. Cada registro conserva la redacción oficial en español, identifica responsable, página, objetivo, indicador, línea base y meta, y separa el fundamento del cruce, el estado de ejecución, las fuentes externas y las notas editoriales.

## Nuevas fichas v2

### `inamu-ela`

Se incorpora como **adopción verificada**:

- tipo: `sistema-ia`;
- fase: `operativo`;
- IA: `confirmada`;
- ejecución: `confirmado`;
- resultados: `no-determinado`;
- gobernanza: `parcialmente-confirmado`.

El [sitio oficial del INAMU](https://www.inamu.go.cr/inteligencia-artificial) identifica una aplicación disponible las 24 horas, GPT-4 Turbo y búsqueda de archivos. Los [términos de Ela](https://elainamu.inamu.go.cr/assets/terminos_condiciones) documentan tratamiento de datos y la función consentida de geolocalización hacia el 9-1-1. La ficha no afirma efectividad: mantiene abiertas las métricas de uso, precisión, respuestas incorrectas, derivaciones, seguridad, revisión humana y retención.

### `ins-reclamos-medicos-ia`

Se incorpora **en seguimiento**:

- tipo: `componente-ia`;
- fase: `operativo`;
- IA: `declarada-sin-tecnica`;
- ejecución: `confirmado`;
- resultados: `confirmado`, de naturaleza autorreportada;
- técnica y gobernanza: `no-determinado`.

El [boletín oficial INSignia de diciembre de 2024](https://www.grupoins.com/media/pyfkpyjz/bolet%C3%ADn-insignia-diciembre-2024.pdf) reporta cerca de 10.000 solicitudes mensuales, reducción del pago promedio de 12–13 a 6–7 días y 72% de eficiencia. Esos valores se publican como resultados institucionales, no como evaluación independiente. La ficha no suma a adopción verificada porque no se publican arquitectura, técnica, variables, criterios de clasificación, revisión humana, métricas de error o vías de impugnación.

### `pj-oij-tec-ia-investigacion`

Se incorpora como **investigación del ecosistema**:

- tipo: `investigacion`;
- fase: `desarrollo`;
- IA: `confirmada`;
- ejecución de I+D: `confirmado`;
- uso operativo: `no-determinado`.

La [ficha oficial del TEC](https://orion.tec.ac.cr/es/projects/sistemas-basados-en-inteligencia-artificial-usando-machine-learni/) registra el proyecto activo entre 2024 y 2026 para reconocimiento de imágenes, categorización automática de casos y predicción de incidentes por ubicación. El [Poder Judicial](https://pj.poder-judicial.go.cr/index.php/component/content/article/2076-encuentro-expone-sobre-los-beneficios-y-desafios-de-la-implementacion-de-la-inteligencia-artificial-en-la-labor-judicial?Itemid=409&catid=8) presentó en marzo de 2025 el subcaso de análisis de tatuajes. Un [acta de Nexus PJ](https://nexuspj.poder-judicial.go.cr/document/act-1-0003-8728-37) documenta equipo para entrenamiento y prueba.

La ficha no afirma despliegue productivo. Queda separada de:

- `enia-4-1-3-25`, compromiso atribuido a ICE sobre predicción de homicidios;
- SUPERCOP, cuya documentación revisada no acredita IA;
- cualquier resultado operativo o decisorio que las fuentes no demuestren.

## Cambio de contadores

| Capa | Antes | Fase 4C |
|---|---:|---:|
| Iniciativas documentadas | 26 | 29 |
| Adopciones verificadas | 5 | 6 |
| En seguimiento | 6 | 7 |
| Ecosistema y capacidades | 15 | 16 |
| Instituciones | 7 | 9 |

Se añaden INAMU e INS al índice institucional. Poder Judicial pasa de ocho a nueve fichas, con tres verificadas, dos en seguimiento y cuatro de ecosistema.

## Crosswalk actualizado

- `enia-4-1-3-05` pasa de `nuevo-con-evidencia` a `mapeado-exacto` y enlaza `inamu-ela`.
- `enia-4-1-3-14` conserva su condición de repetición y enlaza la misma ficha.
- `enia-4-1-3-24` pasa de `nuevo-con-evidencia` a `mapeado-exacto` y enlaza `ins-reclamos-medicos-ia`.
- OIJ–TEC no se enlaza a la fila ICE y no altera su estado `enia-solamente`.

La transformación sigue siendo reproducible con `npm run crosswalk:enia`. La incorporación de las tres fichas y las instituciones puede reproducirse con `npm run catalog:enia-phase-4c`.

## Integraciones

- navegación principal y conexión desde Marco país;
- sitemap bilingüe;
- endpoint público `/api/enia-acciones.json` con `count: 129`;
- manifest e índice HTML de la API;
- historial público de los tres registros y del explorador;
- contadores derivados, fichas institucionales y páginas estáticas de los proyectos.

## Controles de publicación

- no se publica ninguna recomendación táctica del plan maestro privado;
- la redacción del Plan se conserva como fuente y no se traduce como si fuera un nuevo hecho;
- las repeticiones permanecen auditables, pero no inflan el total canónico;
- los resultados del INS se etiquetan por su naturaleza autorreportada;
- Ela no publica resultados que el INAMU no haya medido públicamente;
- OIJ–TEC no se presenta como sistema productivo ni se fusiona con ICE o SUPERCOP.

## Verificación local

La fase se cierra únicamente después de ejecutar:

```bash
npm run validate-data
npm test
npx tsc --noEmit
npm run build
```

Además, se revisan `/es/enia/`, `/en/enia/` y las tres fichas nuevas en navegador de escritorio y móvil. No se despliega sin aprobación explícita.

Resultado del cierre local:

- validación AJV: 29 proyectos, 9 instituciones, 7 expedientes, 41 entradas de historial y datasets restantes válidos;
- pruebas automatizadas: 54 de 54 aprobadas en 7 archivos;
- TypeScript estricto: sin errores;
- build estática: 137 de 137 páginas generadas, incluidas las dos rutas ENIA, 58 páginas de proyecto y 18 de institución;
- QA de navegador: búsqueda por siglas, filtros, repeticiones, detalle de indicadores, español, inglés y vista móvil revisados sin errores de consola;
- API: `/api/enia-acciones.json` responde con `count: 129` y forma parte del manifest de seis endpoints.

La compilación conserva una advertencia no bloqueante, previa a esta fase, por el uso de `<img>` en `/comparte`. No afecta la generación estática ni la experiencia ENIA y se reserva para el trabajo visual posterior.
