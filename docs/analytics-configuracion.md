# Analítica del Observatorio IA

## Activación

1. En GA4, crear una propiedad y un flujo web para `https://www.observatorioia.org`.
2. Copiar `.env.example` a `.env.local` y reemplazar `G-XXXXXXXXXX` por el ID real. En Vercel, crear `NEXT_PUBLIC_GA_MEASUREMENT_ID` para Production, Preview y Development según corresponda.
3. En Search Console, crear una propiedad de dominio para `observatorioia.org`. Si se usa verificación HTML, añadir el token a `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`; la verificación DNS es preferible porque cubre dominio raíz y `www`.
4. Desplegar y enviar `https://www.observatorioia.org/sitemap.xml` a Search Console.
5. En GA4 DebugView, aceptar analítica y verificar los eventos descritos abajo. Rechazar analítica debe impedir solicitudes a `googletagmanager.com` y eventos GA4.

GA4 no se carga si falta el ID o mientras la persona no acepte. Vercel Analytics permanece como medición agregada. El consentimiento se guarda bajo `observatorioia.analytics-consent.v1`; no contiene datos personales.

## Taxonomía

| Evento | Uso |
| --- | --- |
| `content_open` | Apertura de proyecto o institución |
| `visualization_interaction` | Cambio de vista, filtro, orden o drill-down |
| `outbound_click` | Apertura de una fuente o sitio externo |
| `asset_download` | Descarga de un recurso de `/comparte/` |
| `api_open` | Acceso al índice o endpoint de API |
| `language_change` | Cambio ES/EN |
| `contact_click` | Clic en correo de contacto |
| `analysis_open` | Apertura del índice o un artículo de análisis |
| `reading_progress` | Profundidad de 25%, 50%, 75% o 90% |

Parámetros permitidos: `locale`, `section`, `content_type`, `content_id`, `interaction`, `destination_host` y `depth_percent`. No añadir nombres, correos, búsquedas escritas ni URLs con parámetros potencialmente personales.

## Línea base y reporte mensual

Antes de interpretar tendencias, guardar capturas de Vercel Analytics para 30 y 90 días con: visitantes, vistas, top pages, referrers, países, dispositivos y navegadores. La primera fecha con datos confiables será la línea base.

Reporte mensual:

| Área | Indicadores |
| --- | --- |
| Alcance | Usuarios, sesiones, vistas y variación mensual |
| Atención | Tiempo medio de interacción, sesiones con interacción y profundidad 75%/90% |
| Contenido | Proyectos, instituciones y análisis más abiertos |
| Adquisición | Orgánico, directo, referencias, redes y consultas de Search Console |
| Audiencia | País y dispositivo, siempre de forma agregada |
| Valor | Clics a fuentes, descargas, API, contacto y cambio de idioma |
| Calidad | Core Web Vitals, páginas 404 y cobertura de indexación |

Comparar GA4 y Vercel durante 14 días. GA4 será normalmente menor por rechazo de consentimiento y bloqueadores; documentar la diferencia porcentual, no intentar igualar ambos sistemas.
