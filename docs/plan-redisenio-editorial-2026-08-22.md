# Plan ejecutable de rediseño editorial

Fecha: 22 de agosto de 2026.

Estado: R1-R8 implementadas y validadas localmente. Push y despliegue no autorizados.

Punto de partida técnico: Fase 5C comprometida en `e6786ba`. Este plan no autoriza push, despliegue ni publicación.

## Resultado buscado

Transformar el Observatorio IA Costa Rica en un **observatorio editorial de evidencia pública**, con una identidad propia, sobria y reconocible. La referencia conceptual es un **archivo cívico contemporáneo**: combina investigación, periodismo de datos, expedientes públicos y visualización clara.

El rediseño debe conservar el rigor del modelo de evidencia y hacer que la interfaz deje de sentirse como una colección de componentes genéricos de SaaS o de sitios generados por IA.

Al terminar:

- la evidencia, la procedencia y la fecha de verificación serán parte central de la identidad visual;
- la mayoría del contenido dejará de aparecer dentro de tarjetas redondeadas;
- el color servirá para orientar y comunicar estado, no para decorar cada contenedor;
- la portada funcionará como entrada editorial y no como copia extensa de todas las secciones;
- proyectos, instituciones, ENIA, Marco país y legislación tendrán formatos adecuados a su tipo de información;
- las versiones ES y EN conservarán la misma jerarquía y funcionalidad;
- el sitio seguirá siendo estático, rápido, accesible y compatible con la arquitectura actual.

## Decisiones ya tomadas

1. La dirección visual no será futurista ni usará clichés de IA como cerebros, circuitos, redes luminosas o degradados tecnológicos.
2. Se conservará el azul institucional como color de identidad.
3. El estilo de trabajo será editorial y documental: tipografía, espacio, reglas, registros, tablas y anotaciones antes que tarjetas.
4. Las tarjetas quedarán reservadas para objetos que realmente se comporten como unidades independientes o seleccionables.
5. Los estados no dependerán solo del color. Tendrán texto y, cuando ayude, símbolo o marca.
6. Se trabajará primero sobre un piloto representativo. No se aplicará una sustitución global de estilos sin comprobar el resultado con contenido real.
7. Cada fase tendrá validación automática, commit propio y revisión local antes de continuar.
8. No habrá push ni despliegue sin autorización explícita posterior de Mario.
9. El logo definitivo puede incorporarse después. El sistema visual debe funcionar con el logo actual y no depender de una ilustración específica.
10. Figma es opcional. El prototipo de verdad se construirá en el repositorio con los datos reales.

## Diagnóstico de la interfaz actual

### Lo que funciona y se conserva

- La navegación principal es clara y el logo tiene buena presencia.
- El encabezado de portada comunica con claridad la nueva distinción entre adopción verificada, seguimiento y ecosistema.
- El modelo de evidencia, los enlaces a fuentes y las fechas de verificación son una base diferenciadora.
- El explorador ENIA ya avanzó hacia una composición más editorial mediante franjas de cifras, divisores y registros.
- Los gráficos, filtros y páginas bilingües ya funcionan y no deben perder capacidad durante el cambio visual.

### El patrón que produce la apariencia genérica

La auditoría del código encontró, en los archivos TSX:

- 96 usos de clases `rounded-*`;
- 32 usos de `rounded-full`;
- 33 usos de `rounded-lg`;
- 16 usos de `rounded-xl`;
- 14 usos de `rounded-md`;
- 31 líneas que combinan bordes o fondos de familias semánticas como emerald, amber, sky, violet, rose o lime.

La cantidad no es por sí sola el problema. El problema es que estas decisiones se repiten en casi todas las jerarquías:

- contenedor con borde;
- fondo tenue del mismo color;
- texto oscuro de la misma familia;
- cápsula de estado;
- sombra o pequeño desplazamiento en hover;
- cuadrícula de dos o tres columnas.

En la portada se muestran nueve módulos completos después del encabezado. Proyectos, instituciones, legislación, indicadores y recursos aparecen como colecciones extensas, por lo que la página pierde capacidad de priorizar.

### Superficies prioritarias

1. `/[locale]/proyectos`: es la manifestación más clara de la repetición de tarjetas y servirá como prueba de densidad.
2. Portada `/[locale]/`: servirá para probar identidad, jerarquía y ritmo editorial.
3. `/[locale]/enia`: necesita conservar su capacidad de exploración mientras reduce cápsulas y repeticiones.
4. `/[locale]/marco-pais`: debe leerse como un expediente de política pública, no como una biblioteca de componentes.
5. Legislación e instituciones: necesitan índices propios para que la portada pueda resumir en vez de contenerlo todo.

## Referentes y principio que aporta cada uno

No se copiará la interfaz de ningún referente. Se tomarán principios y se adaptarán al contenido costarricense.

- [Our World in Data](https://ourworldindata.org/): datos y preguntas como objetos principales, navegación por temas y jerarquía editorial.
- [Our World in Data Explorers](https://ourworldindata.org/explorers): controles unidos directamente a la visualización, sin encerrar cada elemento en una tarjeta independiente.
- [Ada Lovelace Institute](https://www.adalovelaceinstitute.org/): identidad humana y firme para una institución que trabaja con IA, usando grandes superficies planas y una voz editorial propia.
- [GOV.UK Design System](https://design-system.service.gov.uk/): disciplina de servicio público, consistencia y accesibilidad.
- [GOV.UK Colour](https://design-system.service.gov.uk/styles/colour/): colores funcionales, previsibles y con contraste suficiente.
- [GOV.UK Type scale](https://design-system.service.gov.uk/styles/type-scale/): escala tipográfica y ritmo vertical consistentes.
- [The Pudding](https://pudding.cool/about/): historias visuales para análisis especiales donde la visualización realmente explica.
- [OECD.AI](https://oecd.ai/en/): taxonomía y arquitectura para relacionar política, datos y análisis.

## Tesis visual: archivo cívico contemporáneo

### Personalidad

- precisa, no fría;
- institucional, no burocrática;
- costarricense, no folclórica;
- tecnológica por su capacidad, no por su decoración;
- editorial, no promocional;
- transparente sobre lo conocido y lo no determinado.

### Paleta inicial para el piloto

Los valores son candidatos y se aprueban visualmente en R1 antes de convertirse en definitivos.

| Función | Candidato | Uso |
|---|---:|---|
| Tinta principal | `#10243e` | Titulares, navegación y texto de alto énfasis |
| Azul institucional oscuro | `#1e3a8a` | Identidad y superficies institucionales |
| Azul interactivo | `#1d4ed8` | Enlaces, foco y acciones |
| Papel cálido | `#f7f5ef` | Fondo editorial alternativo |
| Blanco | `#ffffff` | Fondo principal y contraste |
| Texto secundario | `#475569` | Metadatos y explicaciones |
| Acento cálido provisional | `#b4533c` | Hallazgos o llamadas editoriales muy puntuales |

Regla aproximada: 80 % neutros, 15 % azul institucional y 5 % acentos. Verde, ámbar y rojo se reservarán para significados verificables.

### Tipografía

- **Inter** se conserva para texto, navegación, controles, tablas y cifras.
- **Source Serif 4** se probará para titulares editoriales, introducciones y citas de evidencia.
- Los identificadores, números de expediente y códigos pueden usar la fuente monoespaciada del sistema de manera puntual.
- No habrá más de dos familias principales en una misma pantalla.

La serif es una hipótesis del piloto. Si perjudica la lectura bilingüe o se siente demasiado periodística, se probará una alternativa antes de extenderla.

### Forma y profundidad

- Radio por defecto entre 0 y 4 px.
- Sin sombras flotantes en contenido editorial.
- Sin desplazamientos verticales de tarjetas en hover.
- Divisores y cambios de espacio reemplazan cajas innecesarias.
- `rounded-full` queda reservado para controles que realmente sean cápsulas, no para cada estado o categoría.
- Las llamadas críticas pueden usar borde lateral o franja superior, pero no fondo, borde y texto del mismo color simultáneamente.

### Movimiento

- Transiciones entre 120 y 180 ms para foco, subrayado y apertura.
- Sin animaciones decorativas que retrasen la lectura.
- Respetar `prefers-reduced-motion`.
- Los contadores pueden conservar movimiento solo si el valor final está disponible inmediatamente y no causa cambio de diseño.

### Identidad mediante evidencia

La personalidad propia no dependerá de ilustraciones generativas. Se construirá con elementos funcionales:

- fecha de última verificación;
- tipo y procedencia de la fuente;
- dimensión que respalda cada fuente;
- número de expediente o identificador;
- estado de evidencia;
- preguntas abiertas;
- notas editoriales;
- vínculos entre ENIA, catálogo, legislación e instituciones.

Estos elementos pueden presentarse como sellos documentales, numeración editorial, márgenes anotados y fichas de expediente.

## Arquitectura de información propuesta

### Portada

La portada dejará de contener versiones completas de casi todas las secciones. Su secuencia objetivo será:

1. Encabezado editorial con tesis, alcance y dos acciones principales.
2. Franja única con estado de la evidencia y cifras principales.
3. Tres hallazgos o iniciativas verificadas seleccionadas mediante una regla explícita y estable.
4. Resumen de Marco país y actividad legislativa reciente.
5. Últimos cambios del Observatorio con fecha de verificación.
6. Rutas claras hacia Proyectos, Instituciones, ENIA, Legislación, Indicadores y Metodología.

No se eliminará información. Las colecciones completas pasarán a páginas de índice dedicadas.

### Proyectos

- Mantener búsqueda, filtro institucional y tres capas editoriales.
- Sustituir la cuadrícula de tarjetas por un registro editorial de fichas horizontales.
- Mostrar título, institución, capa, fase y última verificación en la vista de conjunto.
- Mantener descripción y tipo como segundo nivel, sin repetir múltiples cápsulas.
- Usar una tarjeta o composición destacada únicamente para casos seleccionados, no para todos.

### Instituciones

- Crear `/[locale]/instituciones/` como índice independiente.
- Presentar las nueve instituciones como registro numerado con sus conteos y actividad más relevante.
- Mantener las páginas individuales existentes.
- En la portada mostrar solo una síntesis y un enlace al índice completo.

### Legislación

- Crear `/[locale]/legislacion/` como índice independiente.
- Presentar expedientes como fichas documentales, con número, título, comisión, estado, fecha de verificación y fuente oficial.
- Separar claramente coyuntura editorial de estado legislativo oficial.
- En la portada mostrar el movimiento más reciente y el total, no los siete expedientes completos.

### Indicadores

- Crear `/[locale]/indicadores/` como índice independiente.
- Usar azul institucional y escala de grises como base de los gráficos.
- Resaltar Costa Rica y una comparación relevante, evitando una paleta diferente por cada serie cuando no sea necesaria.
- Usar etiquetas directas y notas de fuente cerca del gráfico.
- En la portada mostrar una lectura principal con enlace a la serie completa.

### ENIA

- Conservar las tres vistas, búsqueda, filtros y duplicados.
- Mantener la franja actual de cifras, que ya funciona como lenguaje editorial.
- Convertir estados en marcas compactas con texto, sin fondo teñido por defecto.
- Aumentar la densidad del registro y permitir que evidencia, indicadores y notas se abran cuando se necesiten.
- Diferenciar visualmente texto oficial, interpretación editorial y evidencia externa.

### Marco país

- Presentar estrategia, plan, instrumentos y expedientes como una estructura documental numerada.
- Unir arquitectura, cronología y matriz dentro de una narrativa continua.
- Reducir indicadores rápidos dentro de tarjetas.
- Mantener brechas y fuentes públicas, sin incorporar recomendaciones tácticas privadas.

### Páginas de detalle

Las fichas de proyecto e institución se convertirán gradualmente en expedientes:

1. resumen y clasificación;
2. estado de evidencia;
3. cronología conocida;
4. fuentes y qué respalda cada una;
5. resultados o ausencia de resultados públicos;
6. preguntas abiertas y relaciones;
7. última verificación.

## Componentes y archivos principales

| Superficie actual | Acción prevista |
|---|---|
| `tailwind.config.ts` | Añadir tokens editoriales y familia serif sin eliminar compatibilidad institucional |
| `src/app/globals.css` | Variables, ritmo tipográfico, estilos de foco, reglas y utilidades editoriales |
| `src/app/layout.tsx` | Cargar la fuente editorial y mantener Inter como base |
| `src/components/Hero.tsx` | Sustituir capas y KPIs en tarjetas por encabezado y franjas documentales |
| `src/components/CatalogoProyectos.tsx` | Reorganizar capas, filtros y resultados como registro |
| `src/components/ProyectoCard.tsx` | Conservar variante compacta o migrarla; retirar la tarjeta completa repetida |
| `src/components/catalogoStyles.ts` | Reemplazar superficies tintadas por marcas semánticas accesibles |
| `src/components/InstitucionesGrid.tsx` | Convertir cuadrícula en resumen editorial e índice dedicado |
| `src/components/Legislacion.tsx` | Convertir tarjetas en expedientes y extraer página independiente |
| `src/components/Indicadores.tsx` y charts | Simplificar paleta, contenedores, etiquetas y notas de fuente |
| `src/components/ExploradorEnia.tsx` | Refinar densidad, estados, jerarquía y disclosures |
| `src/app/[locale]/marco-pais/` | Unificar secciones como documento de política pública |
| `src/components/Nav.tsx` | Apuntar a índices propios y mejorar estado activo |
| `src/components/Footer.tsx` | Simplificar jerarquía y reforzar metodología, historial y API |
| `src/components/share/` | Regenerar al final, cuando titulares, cifras y sistema visual estén aprobados |

Los componentes nuevos deben surgir de patrones repetidos que ya hayan funcionado en el piloto. No se creará una biblioteca abstracta completa antes de comprobarla.

## Fases de implementación

### R0. Plan y punto de recuperación

Estado: completado con el commit documental que incorpora este archivo.

Entregables:

- diagnóstico persistente;
- dirección visual;
- fases y criterios de aceptación;
- referencia desde `planning.md` y `AGENTS.md`;
- handoff para una sesión nueva.

No incluye cambios visuales.

### R1. Fundamentos y piloto funcional

Objetivo: comprobar la dirección usando contenido real antes de extenderla.

Estado: implementación local completada y aprobada por Mario el 22 de agosto de 2026 en la rama `redesign/editorial-v1`.

Resultado del piloto:

- Source Serif 4 y tokens provisionales de tinta, papel, regla, acento, radio y foco;
- portada superior en papel editorial, con encabezado tipográfico y dos franjas continuas de evidencia y contexto;
- selector de capas documental, compacto en móvil y con estado activo textual más `aria-pressed`;
- catálogo en registro numerado de una columna, sin tarjetas elevables, conservando institución, capa, fase, tipo, fecha documental y última verificación;
- equivalencia ES/EN y ausencia de desborde horizontal a 360 px;
- foco por teclado visible, búsqueda, filtros, tres capas y vista total verificados en navegador;
- AJV válido, TypeScript de app y scripts limpio, 91/91 pruebas y build de 137/137 páginas estáticas.

Superficies del piloto:

- parte superior de la portada;
- selector de capas, filtros y registro de `/[locale]/proyectos`.

Entregables:

- tokens provisionales de color, tipografía, radios, divisores y foco;
- Source Serif 4 disponible como clase editorial;
- encabezado de portada sin degradado genérico ni siete tarjetas consecutivas;
- franja de cifras sin contenedores individuales;
- capas del catálogo como selector editorial;
- resultados de proyectos como registros o fichas horizontales;
- estado expresado mediante texto y marca, no solo color;
- comportamiento equivalente en ES y EN;
- capturas comparativas de escritorio y móvil para revisión.

Archivos probables:

- `tailwind.config.ts`;
- `src/app/globals.css`;
- `src/app/layout.tsx`;
- `src/components/Hero.tsx`;
- `src/components/CatalogoProyectos.tsx`;
- `src/components/ProyectoCard.tsx` o un nuevo componente de registro;
- `src/components/catalogoStyles.ts`;
- strings bilingües estrictamente necesarios.

Criterios de aceptación:

- búsqueda y filtros conservan exactamente su funcionalidad;
- no se pierde ninguna de las tres capas ni ninguna iniciativa visible;
- estados comprensibles en escala de grises y mediante lector de pantalla;
- sin overflow horizontal a 360 px;
- navegación por teclado y foco visibles;
- sin errores de consola ni hidratación;
- Mario puede comparar portada y catálogo localmente antes de R2.

Commit sugerido:

```text
feat(design): establece piloto editorial del observatorio
```

### R2. Estructura global, portada e índices

Objetivo: convertir el piloto aprobado en el sistema general de navegación y descubrimiento.

Estado: implementación local completada y aprobada por Mario el 22 de agosto de 2026 en la rama `redesign/editorial-v1`.

Resultado de la fase:

- navegación principal con rutas reales, estado activo mediante texto, regla y `aria-current`, y menú móvil que gestiona foco, Escape y etiquetas abiertas/cerradas;
- pie simplificado en dos grupos, con acceso directo a colecciones, metodología, historial, API, privacidad y recursos;
- portada reducida a cuatro bloques editoriales después del encabezado: tres fichas verificadas mediante regla estable, lectura de Marco país y legislación, tres cambios recientes e índice de rutas;
- índices bilingües y estáticos para instituciones, legislación e indicadores, con títulos `h1`, metadatos, canonical y alternates propios;
- ruta bilingüe de Recursos para conservar su inventario completo al retirarlo de la portada;
- enlaces de Marco país, breadcrumbs y sitemap actualizados para las rutas nuevas;
- ausencia de desborde horizontal comprobada en portada e índices a 390 px;
- AJV válido, TypeScript de app y scripts limpio, 91/91 pruebas y build de 145/145 páginas estáticas.

Entregables:

- navegación y pie ajustados al nuevo lenguaje;
- estado activo y foco claros;
- portada reducida a una secuencia editorial de síntesis;
- página índice de instituciones;
- página índice de legislación;
- página índice de indicadores;
- actualización del sitemap y enlaces internos;
- todos los datos completos accesibles a un clic desde la portada.

Criterios de aceptación:

- la portada deja de renderizar nueve módulos completos;
- no se rompe ningún enlace o ancla existente sin ruta equivalente;
- las páginas nuevas se generan en ambos idiomas;
- navegación móvil operable por teclado y lector de pantalla;
- título, descripción y alternates correctos en ES y EN.

Commit sugerido:

```text
feat(design): reorganiza portada e indices editoriales
```

### R3. Catálogos, instituciones y expedientes

Objetivo: aplicar la gramática aprobada a la exploración y a las fichas de detalle.

Estado: implementación local completada y aprobada por Mario el 22 de agosto de 2026 en la rama `redesign/editorial-v1`.

Resultado de la fase:

- índice institucional convertido de cuadrícula de tarjetas a registro numerado, con conteos derivados, último corte y tres iniciativas destacadas mediante una regla estable;
- fichas institucionales convertidas en expedientes con metadatos continuos, distribución por capa, resumen, registro completo y lectura editorial;
- fichas de proyecto reorganizadas en alcance, cronología conocida, lectura de evidencia, resultados documentados, matriz, fuentes, preguntas, contexto y relacionados;
- ausencia de resultados publicada explícitamente como vacío documental neutral, sin panel verde ni señal positiva;
- fuentes presentadas como referencias numeradas con publicador, tipo, fecha de publicación, fecha de consulta y dimensiones respaldadas;
- componentes reutilizables para metadatos, encabezados de sección y estados documentales, con texto y marca además del color;
- catálogo conservado con búsqueda, filtro institucional, tres capas y vista total; su bloque metodológico adopta el lenguaje editorial;
- corrección del desborde de 4 px de la cabecera móvil, con ancho exacto a 360 px;
- 29 iniciativas y 9 instituciones conservadas sin cambios en los JSON de evidencia;
- AJV válido, TypeScript de app y scripts limpio, 93/93 pruebas y build de 145/145 páginas estáticas;
- auditoría de 142 HTML con 58 fichas de proyecto, 18 institucionales, 80 referencias de fuente y cero enlaces, anclas, metadatos o jerarquías de encabezado defectuosas.

Entregables:

- catálogo completo de proyectos refinado después de la revisión de R1;
- índice e individuales de instituciones;
- fichas de proyecto con jerarquía de expediente;
- fuentes, dimensiones de evidencia, cronología y preguntas abiertas legibles;
- variantes reutilizables de registro, metadatos, fuente y estado.

Criterios de aceptación:

- todos los proyectos e instituciones generan sus páginas estáticas;
- la clasificación y la evidencia no cambian por el rediseño;
- ausencia de resultados se comunica sin panel verde ni falsa señal positiva;
- enlaces externos mantienen su etiqueta de procedencia y fecha de consulta;
- ninguna recomendación táctica privada entra en contenido público.

Commit sugerido:

```text
feat(design): convierte catalogos y fichas en expedientes
```

### R4. ENIA, Marco país, legislación e historial

Objetivo: rediseñar las superficies documentales más densas sin reducir su trazabilidad.

Estado: implementación local completada y aprobada por Mario el 22 de agosto de 2026 en la rama `redesign/editorial-v1`.

Resultado de la fase:

- explorador ENIA convertido en un registro compacto y progresivo: conserva las vistas de 25, 120 y 129 filas, la búsqueda, los filtros, los duplicados, los estados y los enlaces al catálogo;
- cada intervención separa explícitamente texto oficial, cruce editorial y evidencia externa, conserva el título oficial en español y ofrece indicadores como definiciones apiladas en móvil y tabla en escritorio;
- Marco país convertido en un documento continuo con siete secciones numeradas para indicadores, arquitectura, cronología, instrumentos, brechas, conexiones y fuentes;
- arquitectura y matriz sustituyen tarjetas por registros reglados, con fuerza normativa y estado expresados mediante texto y marca además del color;
- legislación separa la coyuntura editorial del registro oficial y conserva siete expedientes con número, comisión, estado, alcance, fuentes y fecha de verificación;
- historial alinea política, agenda de ocho frentes, ocho revisiones y 42 cambios publicados, con tablas en escritorio y registros completos en móvil;
- estados, fechas, resultados y vacíos usan etiquetas textuales, reglas y elementos semánticos como `time`, `details`, listas, definiciones y tablas;
- navegación ajustada para eliminar un desborde de 7 px a 360 px y conservar apertura, Escape y devolución de foco en el menú móvil;
- 29 iniciativas, 9 instituciones, 129 registros ENIA, 120 intervenciones únicas y 7 expedientes legislativos conservados sin cambios en los JSON de evidencia;
- AJV válido, TypeScript de app y scripts limpio, 93/93 pruebas y build de 145/145 páginas estáticas;
- auditoría de 142 HTML con 58 fichas de proyecto, 18 institucionales y cero enlaces internos, anclas, IDs o jerarquías de encabezado defectuosas; todas las rutas de contenido conservan canonical y atributo de idioma;
- revisión interactiva en ES y EN, escritorio y 360/390 px, sin errores de consola ni desbordamientos; los dos hallazgos menores detectados quedaron corregidos dentro de R4.

Entregables:

- explorador ENIA más compacto y escaneable;
- distinción visible entre texto oficial, cruce editorial y evidencia externa;
- Marco país como documento continuo de estrategia, instrumentos, cronología y brechas;
- expedientes legislativos con estado oficial y coyuntura separados;
- historial de monitoreo alineado con el mismo lenguaje documental.

Criterios de aceptación:

- los 129 registros del documento oficial y las 120 intervenciones únicas siguen consultables;
- duplicados, filtros, búsqueda y enlaces al catálogo siguen funcionando;
- los siete expedientes conservan número, comisión, estado, alcance, fuente y verificación;
- las fechas y estados no dependen únicamente del color;
- tablas y registros densos tienen una alternativa usable en móvil.

Commit sugerido:

```text
feat(design): unifica registros de politica y monitoreo
```

### R5. Indicadores, análisis y superficies secundarias

Objetivo: completar el lenguaje visual y evitar que las páginas menos frecuentes conserven el sistema anterior.

Estado: implementación local completada y aprobada por Mario el 22 de agosto de 2026 en la rama `redesign/editorial-v1`.

Resultado de la fase:

- Indicadores convertido en un documento de tres secciones numeradas para ILIA, Digital Government Index y OURdata, con barras rectas, paleta contenida, fuentes visibles y vistas de gráfico, tabla y ranking conservadas;
- índice de Análisis convertido en registro editorial para artículos, comparativa regional, siete brechas y siete expedientes, con tabla de escritorio y registros completos en móvil;
- los dos artículos de Estado y Algoritmo adoptan papel, tinta, tipografía editorial, reglas y llamadas laterales sin perder filtros, ordenamiento, tablas, detalles ni gráficos SVG;
- corregida la hidratación de los artículos: el CSS embebido ya produce el mismo contenido en servidor y cliente y no fuerza el reemplazo del árbol React;
- Recursos, Quién mantiene y Privacidad convertidos en documentos continuos y registros numerados; autoría, método, capas de catálogo y matriz de evidencia quedan explícitos sin tarjetas decorativas;
- la galería de material para compartir adopta la misma jerarquía editorial y sustituye imágenes HTML sin optimización por `next/image` compatible con la exportación estática;
- 32 PNG bilingües regenerados en formatos cuadrado, OpenGraph y story, con papel, tinta, reglas y una paleta funcional común;
- brecha ILIA corregida desde el texto obsoleto de 19 puntos al cálculo exacto derivado de los datos, 16,73 en ES y 16.73 en EN; el titular redondeado conserva 17;
- titular de la línea de tiempo actualizado de 2019-2024 a 2019-2025 para incluir la adopción verificada de INAMU;
- el logo actual se conserva porque todavía no se ha aprobado una variante definitiva;
- ningún JSON de evidencia cambió; AJV, TypeScript, lint y la build de 145/145 páginas estáticas pasan sin errores;
- revisión interactiva en ES y EN, escritorio de 1440 px y móvil de 390 px, sin errores de consola ni desbordamientos; las 16 imágenes de la galería cargan con sus dimensiones esperadas en la build estática.

Entregables:

- gráficos ILIA, OECD y OurData con paleta contenida y etiquetas claras;
- páginas de análisis y artículos;
- Recursos, Acerca, Quién mantiene y Privacidad;
- componentes de comparte alineados con el sistema aprobado;
- regeneración de assets bilingües solo después de aprobar cifras y titulares;
- incorporación del logo definitivo si Mario ya lo seleccionó.

Criterios de aceptación:

- tooltips y drill-downs de gráficos conservan comportamiento;
- datos y fuentes permanecen visibles sin depender de hover;
- artículos mantienen legibilidad en líneas largas y pantallas pequeñas;
- assets no contienen cifras ni redacción obsoletas;
- el sitio no mezcla de forma visible dos sistemas de diseño.

Commit sugerido:

```text
feat(design): completa visualizaciones y superficies editoriales
```

### R6. Accesibilidad, rendimiento y candidato de publicación

Objetivo: cerrar el rediseño como candidato local de lanzamiento.

Estado: implementación y validación técnica completadas localmente el 22 de agosto de 2026 en la rama `redesign/editorial-v1`; pendiente la revisión visual final de Mario. No se hizo push ni despliegue.

Resultado de la fase:

- contraste editorial ajustado a WCAG AA mediante un papel ligeramente más claro, ordinales y metadatos secundarios más legibles y colores semánticos oscuros sin fondos teñidos;
- Lighthouse alcanza 100 en accesibilidad, buenas prácticas y SEO en las plantillas públicas indexables representativas; rendimiento móvil registra 92 en portada, 93 en Indicadores y 96 en ENIA, y la portada de escritorio registra 100, servidas con compresión;
- ordenamiento de la tabla del artículo 01 operable con teclado, `aria-sort` y nombre accesible; filtros de ambos artículos y vistas ILIA publican `aria-pressed`;
- corregidos nombres accesibles de fuentes y registros, subrayado persistente de enlaces dentro de párrafos, estructura de listas de definición y semántica de las vistas ILIA;
- el idioma del documento cambia correctamente durante navegación cliente y el postbuild fija `lang="es"` o `lang="en"` en los 138 HTML localizados de la exportación;
- Vercel Analytics solo se incorpora en builds de Vercel o cuando se habilita explícitamente, evitando un 404 en el candidato local y en hosts estáticos alternativos;
- nueva auditoría `npm run audit:static`: revisa 142 HTML, paridad ES/EN, idioma, metadatos, `main`, `h1`, encabezados, IDs, imágenes, nombres y etiquetas accesibles, enlaces internos y anclas;
- las cuatro páginas story ahora tienen `h1`; los 32 PNG bilingües se regeneraron con el contraste final;
- QA ES/EN en 360 × 800, 390 × 844, 768 × 1024 y 1440 × 1000, más equivalente de zoom 200 %, movimiento reducido, foco y menú por teclado, filtros, ordenamiento y vistas de gráficos, sin errores de consola ni overflow;
- la comparación antes/después conserva capturas de portada, proyectos, ENIA y Marco país fuera del repositorio;
- los 96 usos iniciales de `rounded-*` quedaron reducidos a 18 y no existen desplazamientos verticales de tarjetas en hover;
- ningún JSON de evidencia cambió; datos, filtros, drill-downs y enlaces a fuentes permanecen disponibles.

Validación obligatoria:

```bash
npm run validate-data
npx tsc --noEmit
npx tsc -p tsconfig.scripts.json --noEmit
npm test
npm run build
npm run audit:static
```

QA visual mínima:

- ES y EN;
- 360 × 800;
- 390 × 844;
- 768 × 1024;
- 1440 × 1000;
- navegación con teclado;
- zoom al 200 %;
- preferencia de movimiento reducido;
- errores de consola;
- enlaces internos y páginas estáticas generadas;
- comparación antes/después de portada, proyectos, ENIA y Marco país.

Criterios de salida:

- contraste WCAG AA en texto y controles;
- foco visible en todos los elementos interactivos;
- estado nunca comunicado únicamente con color;
- sin overflow no intencional;
- sin pérdida de datos, filtros o enlaces a fuentes;
- sin errores de build, tipos, tests o consola;
- revisión local final aprobada por Mario;
- push y despliegue siguen siendo una decisión separada.

Commit sugerido:

```text
chore(design): valida candidato editorial de lanzamiento
```

### R7. Documentación editorial bilingüe de la API pública

Objetivo: convertir `/api/` en una puerta de entrada comprensible y coherente para periodistas, investigadores, desarrolladores y organizaciones que reutilizan los datos, sin cambiar las URLs ni el contrato de los siete endpoints JSON.

Estado: implementada y validada localmente el 22 de agosto de 2026 sobre `redesign/editorial-v1`. No se hizo push ni despliegue.

Resultado de la fase:

- `/api/` funciona como documentación española por defecto y `/api/en/` como contraparte inglesa, con canonical, `hreflang` y alternancia visibles;
- las siete colecciones se presentan como registros numerados con descripción humana, unidad de conteo y fecha editorial;
- contrato, criterios de interpretación, modelo de evidencia, licencia, límites, mantenimiento y contacto quedan documentados en ambos idiomas;
- ejemplos copiables con `curl`, `jq` y JavaScript funcionan sin JavaScript de interfaz ni dependencias de cliente;
- el pie del sitio enlaza la versión correspondiente al idioma y el sitemap publica ambas rutas con sus alternates;
- las pruebas verifican los siete enlaces, manifest, metadatos, estructura ES/EN y la envoltura exacta de todos los payloads;
- la auditoría estática pasa con 143 HTML, 140 localizados y paridad ES/EN completa;
- QA cubrió 360 × 800, 390 × 844, 768 × 1024 y 1440 × 1000; se corrigió un desbordamiento móvil inicial de los bloques de código;
- salto al contenido, foco visible, cambio de idioma, enlace desde el pie y apertura por teclado de un JSON fueron verificados en navegador;
- Lighthouse alcanza 100 en rendimiento, accesibilidad, buenas prácticas y SEO para ES móvil y EN escritorio;
- 95 pruebas, AJV, ambos proyectos TypeScript, lint y build estática de 145 rutas pasan;
- los siete JSON públicos, `src/data/json/`, contadores y manifest conservaron su contenido.

Alcance:

- conservar `/api/` como documentación española por defecto y añadir `/api/en/` como contraparte inglesa;
- aplicar papel, tinta, reglas, numeración y jerarquía tipográfica del archivo cívico contemporáneo;
- explicar el significado de `version`, `lastUpdate`, `count`, `source`, `license` y `data`;
- publicar la unidad de conteo propia de cada endpoint, evitando que los totales se sumen o se interpreten como adopciones verificadas;
- documentar el modelo de evidencia, los campos bilingües, el significado de no determinado y la función de las fuentes;
- añadir ejemplos reproducibles con `curl`, `jq` y JavaScript;
- explicar atribución CC BY 4.0, límites editoriales, mantenimiento y contacto;
- enlazar la documentación localizada desde el pie del sitio e incorporarla al sitemap;
- extender pruebas y auditoría estática a ambas versiones humanas.

Criterios de aceptación:

- los siete endpoints y `/api/index.json` conservan sus rutas;
- los payloads mantienen exactamente la envoltura `{version,lastUpdate,count,source,license,data}`;
- `src/data/json/` no cambia y una nueva build produce los mismos JSON públicos;
- ES y EN contienen los siete enlaces, manifest, contrato, criterios de interpretación, ejemplos y atribución;
- existe exactamente un `main` y un `h1` por documento, foco visible y navegación completa por teclado;
- no hay desbordamiento no intencional en 360, 390, 768 y 1440 px;
- la documentación funciona sin JavaScript y conserva enlaces directos copiables;
- tipos, lint, pruebas, AJV, build y `audit:static` pasan antes del commit.

QA visual mínima:

- `/api/` y `/api/en/` en escritorio y móvil;
- alternancia ES/EN;
- apertura del manifest y de al menos un endpoint;
- navegación por teclado y foco visible;
- consola sin errores;
- comparación antes/después de `/api/`.

Commit sugerido:

```text
feat(api): publica documentación editorial bilingüe
```

### R8. Producto público de datos reproducible

Objetivo: convertir la exportación JSON actual en un producto de datos completo para reutilización periodística e investigativa, manteniendo las siete rutas existentes y su envoltura, y haciendo explícitas cobertura, semántica, procedencia y versión editorial.

Estado: implementada y validada localmente el 22 de agosto de 2026 sobre `redesign/editorial-v1`. No se hizo push ni despliegue.

Resultado de la fase:

- las siete rutas originales y la envoltura `{version,lastUpdate,count,source,license,data}` permanecen intactas;
- la API crece a doce rutas con Marco país, Historial, Coyuntura, Recursos y Codebook;
- los doce endpoints publican schema de respuesta y schema de `data`; los segundos coinciden byte por byte con los schemas AJV fuente;
- la release `2026-08-22-r8` congela doce payloads y veinticuatro schemas, declara checksums SHA-256 y queda protegida por `release.lock` contra reescrituras silenciosas;
- las descargas incluyen un bundle JSON completo y CSV de 29 proyectos, 7 expedientes y 129 registros fuente del Plan de Acción ENIA;
- Recursos pasa de datos embebidos en el componente a 16 registros JSON validables con IDs estables y tipo de fuente;
- ILIA 2025 declara edición y URL oficial en el ranking y en cada fila comparativa; GTMI queda identificado correctamente como índice de madurez GovTech y no como ranking de preparación para IA;
- las siete brechas distinguen la fuente del referente internacional, la síntesis editorial fechada sobre Costa Rica y el análisis editorial; las afirmaciones absolutas se reformulan según el corpus público revisado;
- el codebook publica contrato, bilingüismo, significado de no determinado, trazabilidad, diez vocabularios, regla exacta de adopción verificada, campos clave, notas de interpretación, corpus de procedencia, licencia y exclusiones deliberadas;
- el manifest añade descubrimiento bilingüe, unidad de conteo, documentación, schemas, release y descargas sin retirar campos anteriores;
- la documentación humana ofrece enlaces directos al bundle y los tres CSV y reproduce correctamente la regla de adopción verificada;
- AJV, integridad referencial, ambos proyectos TypeScript, lint, 101 pruebas, build de 145 rutas y auditoría de 143 HTML pasan;
- QA ES/EN en 360, 390, 768 y 1440 px confirma foco visible, teclado, idioma, apertura de dataset, schema y release, `Content-Type` JSON/CSV, cero overflow y consola limpia;
- la QA detectó y corrigió el encabezado impreciso “fuentes oficiales” por “fuentes de referencia”, coherente con la presencia explícita de prensa y fuentes secundarias.

Arquitectura:

- conservar exactamente `{version,lastUpdate,count,source,license,data}` en todos los endpoints de datasets;
- sumar de forma aditiva Marco país, Historial, Coyuntura, Recursos y un codebook bilingüe;
- mover Recursos a JSON validable y añadir schema AJV a Coyuntura;
- publicar los JSON Schema usados por el repositorio y un índice con checksum;
- publicar vocabularios controlados, regla de adopción verificada, campos clave, plantillas de URL y límites de interpretación;
- mantener `version` como versión de aplicación por compatibilidad y añadir una identidad de release independiente en manifest, snapshots y descargas;
- generar una release fechada, determinista e inmutable en su ruta, con checksums y un bundle completo;
- ofrecer CSV aplanados para los conjuntos tabulares prioritarios sin degradar los JSON anidados;
- distinguir la licencia CC BY 4.0 de la compilación de los derechos propios de cada documento fuente.

Cobertura prevista:

- los siete endpoints actuales conservan URL y contrato;
- `/api/marco-pais.json` publica capas, hitos, instrumentos y brechas del marco nacional;
- `/api/historial.json` publica la bitácora editorial curada;
- `/api/coyuntura.json` publica notas de contexto claramente separadas del estado legislativo oficial;
- `/api/recursos.json` publica el directorio de documentos y fuentes con IDs estables;
- `/api/codebook.json` publica metodología, vocabularios, campos clave y reglas derivadas;
- `/api/schemas/`, `/api/releases/` y `/api/downloads/` permiten validar, reproducir y descargar el corte.

Procedencia:

- ILIA 2025 incorporará su fuente oficial dentro del bloque de datos;
- las brechas declararán que `fuenteUrl` respalda el referente internacional y que `estadoCR` es una síntesis editorial del corpus público revisado, no una prueba de inexistencia absoluta;
- Marco país relacionará instrumentos con recursos o endpoints públicos cuando exista una referencia directa;
- Recursos corregirá nombres contra la fuente primaria antes de entrar al pipeline JSON.

Criterios de aceptación:

- las siete URLs existentes y su envoltura permanecen compatibles;
- todos los JSON fuente públicos están cubiertos por schema y por la API, salvo contenido narrativo que deliberadamente no sea un dataset;
- manifest y codebook son bilingües y enlazan schema, release y documentación;
- cada schema de `data` publicado coincide byte por byte con el schema fuente correspondiente y cada schema de respuesta valida la envoltura completa;
- los checksums de release se recomputan en pruebas y coinciden;
- el bundle y los CSV se generan determinísticamente y sus conteos coinciden con los JSON;
- las reglas del codebook coinciden con las constantes TypeScript del modelo de evidencia;
- la documentación humana explica datasets, schemas, releases, licencias y límites sin exigir JavaScript;
- AJV, integridad referencial, TypeScript, lint, pruebas, build, auditoría estática y QA ES/EN pasan;
- no se publican recomendaciones tácticas, no se hace push y no se despliega.

QA mínima:

- apertura por teclado de un dataset nuevo, un schema y una release;
- paridad de `/api/` y `/api/en/` en 360, 390, 768 y 1440 px;
- verificación de `Content-Type`, CORS previsto, checksums, descarga CSV y bundle;
- consola limpia, foco visible, sin overflow y enlaces internos válidos.

Commit sugerido:

```text
feat(api): completa producto público de datos
```

## Flujo de trabajo de cada fase

1. Leer este plan y confirmar la fase activa.
2. Revisar `git status --short` y preservar cambios ajenos.
3. Implementar únicamente el alcance de la fase.
4. Validar tipos y pruebas proporcionales durante el desarrollo.
5. Ejecutar la build estática antes de cerrar la fase.
6. Iniciar el sitio local en el puerto 3001.
7. Tomar capturas ES/EN en escritorio y móvil.
8. Revisar el diff y hacer un commit con rutas explícitas.
9. Mostrar el resultado local a Mario.
10. Registrar ajustes de revisión en un commit adicional de la misma fase si son necesarios.
11. No hacer push ni desplegar.

## Comandos para revisión local

```bash
npm run dev -- -p 3001
```

Abrir:

```text
http://localhost:3001/es/
http://localhost:3001/es/proyectos/
http://localhost:3001/es/enia/
http://localhost:3001/es/marco-pais/
http://localhost:3001/en/
```

La utilidad de navegador está instalada localmente en el proyecto. Se invoca con `npx`, no como comando global:

```bash
npx agent-browser --session observatorio-redesign open http://localhost:3001/es/
npx agent-browser --session observatorio-redesign set viewport 1440 1000
npx agent-browser --session observatorio-redesign screenshot /tmp/observatorio-home.png
npx agent-browser --session observatorio-redesign set viewport 390 844
npx agent-browser --session observatorio-redesign screenshot /tmp/observatorio-home-mobile.png
```

Las capturas de revisión se guardan temporalmente fuera del repositorio, salvo que se decida crear una documentación visual permanente.

## Disciplina de commits

Existe un archivo ajeno sin seguimiento: `docs/plan-dashboard-analytics-looker-studio.md`. No debe incluirse en commits de rediseño sin instrucción específica de Mario.

Por esa razón:

- usar `git add` con rutas explícitas;
- no usar `git add .`;
- revisar `git diff --cached --stat`;
- revisar `git diff --cached` antes del commit;
- mantener un commit por fase y commits de corrección claramente identificados;
- no reescribir ni borrar cambios previos del usuario;
- no hacer push ni desplegar por inferencia.

## Guardas contra una nueva estética genérica

Estas son preguntas de revisión, no métricas ciegas:

1. ¿El contenedor existe porque agrupa una unidad funcional o porque era el patrón más fácil?
2. ¿La jerarquía seguiría entendiéndose si todos los colores se vieran en escala de grises?
3. ¿Hay más de una tarjeta consecutiva con exactamente la misma estructura?
4. ¿El color comunica una categoría real o solo añade variedad visual?
5. ¿La página parece una herramienta de evidencia pública o una landing page de software?
6. ¿La fecha, fuente y certeza se perciben tan claramente como el título?
7. ¿Se puede encontrar el registro completo sin que la portada tenga que mostrarlo todo?
8. ¿El inglés conserva el ritmo y no desborda controles diseñados solo para español?

Guardas cuantitativas orientativas para el cierre:

- reducir al menos a la mitad los 96 usos actuales de `rounded-*`, sin reemplazarlos mecánicamente;
- eliminar desplazamientos verticales de tarjetas en hover;
- eliminar fondos semánticos teñidos en contenedores principales;
- limitar `rounded-full` a controles o marcas que realmente lo necesiten;
- mantener la mayoría de superficies en blanco, papel o tinta institucional.

## Decisiones diferidas que no bloquean las siguientes fases

- logo definitivo;
- elección final entre el acento coral o un sistema completamente azul y neutro;
- incorporación de Figma como archivo formal;
- animaciones o relatos visuales especiales;
- ajustes de navegación derivados de 30 días de analítica real;
- publicación del sitio.

## Siguiente acción después de R7

1. Revisar localmente el candidato completo en ES y EN, con énfasis en portada, catálogo, ENIA, Marco país, Indicadores, Análisis, API pública y los 32 PNG bilingües.
2. Resolver en un commit de ajuste cualquier observación final de legibilidad, densidad, contraste o responsive.
3. Aprobar o diferir de forma separada el logo definitivo; no bloquea el candidato actual.
4. Decidir explícitamente si se fusiona, publica la rama y activa el monitoreo remoto. Ninguno de esos actos está autorizado por este plan.

## Definición final de terminado

El rediseño estará completo cuando todas las rutas públicas compartan una gramática editorial coherente, los datos y fuentes sigan intactos, la portada priorice en lugar de acumular, las superficies densas sean usables en móvil y el sitio pase todas las validaciones técnicas y visuales.

El rediseño completo no equivale a publicación. La activación de workflows remotos, el push y el despliegue continúan sujetos a las decisiones separadas establecidas en la Fase 5C.
