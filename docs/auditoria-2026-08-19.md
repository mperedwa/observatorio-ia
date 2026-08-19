# Auditoría del sitio — 2026-08-19

## Hallazgos confirmados

- **P0 — Medición incompleta:** Vercel Analytics estaba montado globalmente, pero no existía GA4 ni instrumentación de interacciones. No había forma de atribuir uso de gráficos, fuentes, descargas o profundidad de lectura.
- **P0 — Navegación rota:** “Marco país” enlazaba a `/{locale}/proyectos/`, ruta inexistente que devolvía 404. Se redirigió la llamada a la sección `#panorama` del inicio.
- **P1 — Descubrimiento:** `robots.txt` y `sitemap.xml` devolvían 404. Se añadieron rutas estáticas bilingües con proyectos, instituciones y análisis.
- **P1 — Dominio inconsistente:** producción redirige el dominio raíz hacia `www`, mientras canonical y Open Graph apuntaban al dominio raíz. Se adoptó `https://www.observatorioia.org` como URL canónica.
- **P1 — Privacidad:** no existía aviso ni explicación pública de medición. GA4 queda condicionado a consentimiento y se añadió `/es/privacidad/` y `/en/privacidad/`.
- **P2 — Navegación densa:** la barra de escritorio contiene siete destinos. Validar con analítica cuáles se usan antes de reagrupar o eliminar opciones.
- **P2 — Inicio extenso:** la portada concentra timeline, instituciones, mapa, legislación, indicadores, recursos y actualizaciones. Usar profundidad de lectura y navegación por sección para decidir si conviene crear índices dedicados.

## Backlog basado en evidencia

No implementar estas funciones hasta acumular al menos 30 días de datos:

1. Buscador y filtros del catálogo si proyectos/instituciones concentran aperturas y hay profundidad baja en el mapa completo.
2. Comparaciones descargables CSV/PNG si tablas, rankings o descargas muestran uso recurrente.
3. Suscripción a actualizaciones si historial, coyuntura y contacto tienen demanda verificable.
4. Páginas temáticas (salud, justicia, educación, gobernanza) si los datos muestran clústeres claros de interés.

## Pendientes externos

- Exportar o capturar Vercel Analytics para 30/90 días; el repositorio no contiene el histórico del panel.
- Crear la propiedad GA4, configurar el flujo web y añadir el ID a Vercel.
- Verificar Search Console, enviar el sitemap y observar indexación/consultas.
- Tras desplegar, ejecutar QA visual real en Chrome/Safari móvil y escritorio. La herramienta de navegador automatizado no estaba disponible durante esta auditoría; la revisión actual cubre código, HTML público y respuestas HTTP.
