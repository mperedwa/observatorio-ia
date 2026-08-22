# Observatorio IA Costa Rica: estado y próximas fases

Actualizado: 21 de agosto de 2026.

## Objetivo

Mantener un observatorio público, bilingüe y verificable sobre adopción de IA, iniciativas en seguimiento, capacidades institucionales, legislación, ENIA e indicadores del sector público costarricense.

## Entregado

### Plataforma y cobertura inicial

- [x] Sitio estático bilingüe en Next.js 14.
- [x] Páginas de iniciativas, instituciones, Marco país, análisis, historial y metodología.
- [x] Visualizaciones, filtros, búsqueda y assets compartibles.
- [x] 10 scrapers, clasificación asistida y flujo de revisión mediante GitHub Issues.
- [x] API pública JSON y validación AJV.

### Modelo de evidencia

- [x] Schema v2 con tipo de iniciativa, ubicación editorial, fase, confirmación de IA y seis dimensiones de evidencia.
- [x] Reclasificación completa del catálogo.
- [x] Interfaz en tres capas: adopción verificada, seguimiento, y ecosistema y capacidades.
- [x] Inventario completo y crosswalk del Plan de Acción ENIA.
- [x] Explorador ENIA con 129 registros y 120 intervenciones únicas.

### Fase 5B: monitoreo y trazabilidad editorial

- [x] Dataset y schema de monitoreo.
- [x] Cadencia semanal, mensual, trimestral o semestral según el frente.
- [x] Bitácora de cambios y revisiones sin cambios.
- [x] Monitor mensual de la página ENIA y de la huella del Plan de Acción.
- [x] Propuestas de evidencia de scrapers sin stubs ni altas automáticas.
- [x] Endpoint `/api/monitoreo.json`.
- [x] Herramienta editorial con dry-run para registrar revisiones.

### Fase 5C: puesta en marcha operativa

- [x] Corregir el handoff de cambios legislativos desde el reporte consolidado hasta el GitHub Issue.
- [x] Alinear el revisor automático con `evidence-proposals.json`, sin stubs, altas ni despliegues automáticos.
- [x] Recuperar MIDEPLAN con ruta directa y respaldo que solo conserva URLs oficiales.
- [x] Ampliar Google News a las nueve instituciones y un frente transversal sin convertir prensa en fuente primaria.
- [x] Generar recordatorios idempotentes cuando una revisión editorial esté próxima o vencida.
- [x] Probar de extremo a extremo los casos sin hallazgos, señal nueva, actualización y cambio legislativo.
- [x] Documentar operación, límites de cobertura y período inicial de comparación con revisión manual.

## Pendiente antes de publicar

- [x] Revisión local de la Fase 5B en escritorio y móvil.
- [x] Recoger y corregir las observaciones de la Fase 5B.
- [x] Completar y revisar localmente la Fase 5C técnica.
- [ ] Ejecutar un período de comparación entre monitoreo automático y revisión manual.
- [ ] Completar el rediseño visual previo al lanzamiento.
- [ ] Decisión explícita de push y despliegue.

## Próximas mejoras posibles

### Mantenimiento técnico

- [ ] Verificador de enlaces externos que distinga enlaces rotos de servidores que bloquean `HEAD`.
- [ ] Resolver o documentar la advertencia de `<img>` en `/comparte`.
- [ ] Añadir una indicación visible de desplazamiento horizontal en la línea de tiempo móvil.
- [ ] Regenerar assets de `/comparte` después de aprobar definitivamente titulares y cifras.
- [ ] Mantener revisión manual anual del informe PROSIC mientras su feed siga vacío.

### Diseño y experiencia

- [ ] Rediseño visual amplio para reducir la repetición de tarjetas, bordes sólidos y fondos tenues.
- [ ] Revisar densidad de navegación y longitud de portada después de acumular 30 días de analítica.
- [ ] Definir logo definitivo.

### Distribución

- [ ] Continuar campaña de publicaciones de LinkedIn 02-05.

## Reglas permanentes

1. Una meta o un anuncio no prueban ejecución.
2. Los scrapers proponen evidencia; no publican ni verifican iniciativas.
3. Todo cambio sustantivo debe citar una fuente y quedar en la bitácora.
4. Una revisión sin cambios también se registra cuando cubre completamente el frente previsto.
5. Cada fase se revisa localmente y se compromete por separado antes de cualquier despliegue.
