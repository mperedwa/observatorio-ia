# Observatorio IA Costa Rica — Planning

## Visión

Sitio público que mapea proyectos, legislación e indicadores de IA en el sector público costarricense. Independiente, basado en datos verificables, accionable para tomadores de decisión.

## Audiencia

- Tomadores de decisión en gobierno (jerarcas, asesores)
- Prensa especializada en tecnología/política pública
- Academia e investigación
- Sector privado interesado en oportunidades con el Estado
- Ciudadanía interesada en cómo se usa IA con fondos públicos

## Fases

### Fase 1 — MVP (en curso)
- [x] Bootstrap Next.js 14 static export
- [x] Paleta institucional + tipografía
- [x] Sticky nav + footer
- [x] Hero con stat clave (11 proyectos)
- [x] Grid de instituciones con conteo de proyectos
- [x] Sección legislativa con 3 expedientes
- [x] Indicadores con barra ILIA regional
- [x] Recursos con docs oficiales
- [x] Sección Acerca de
- [x] Build estático limpio
- [ ] Despliegue a Vercel/CF Pages con observatorioia.org
- [ ] Favicon + OG image personalizado

### Fase 2 — Automation + más fuentes
- [ ] Scrapers para MICITT (Drupal), CAMTIC (WordPress sitemap)
- [ ] Workaround SharePoint para Asamblea (curl + UA, no Playwright)
- [ ] Pipeline JSON: scraper → validar AJV → commit → rebuild Vercel
- [ ] GitHub Actions para cron diario escalonado
- [ ] Páginas detalle por proyecto e institución
- [ ] Pipeline PDF para extraer texto de leyes/decretos

### Fase 3 — UX + visualización
- [ ] Timeline cronológico de eventos (proyectos, leyes, hitos)
- [ ] Charts adicionales: distribución por sector, evolución mensual
- [ ] Filtros (categoría, tecnología, estado, institución)
- [ ] Búsqueda client-side con Fuse.js
- [ ] Mapa de adopción geográfica (LINC labs por provincia)

### Fase 4 — Inteligencia (opcional)
- [ ] Auto-categorización con Gemini Pro / Claude Haiku
- [ ] Resúmenes automáticos de leyes largas
- [ ] Alertas semánticas vía Telegram cuando hay contenido nuevo
- [ ] API JSON pública read-only para terceros

## Decisiones tomadas
- **Dominio**: observatorioia.org (Namecheap)
- **Stack**: Next.js 14 static export, Tailwind, Inter, Vercel/CF Pages
- **Diseño**: paleta azul institucional + blanco + gris claro, headers grandes con números
- **Inspiración**: oecd.ai (cards), indicelatam.cl (minimalismo), kratid.ee (hero + 3 pilares)

## Decisiones pendientes
- Hosting final: ¿Vercel o Cloudflare Pages?
- Branding: ¿UnikPrompt visible, Mario Edwards, o marca neutral?
- Modelo de mantenimiento: solo Mario / colaboradores / donar a universidad
- Scope: ¿solo IA o también transformación digital general (RPA, e-government)?

## Riesgos identificados
1. Datos escasos al inicio (~11 proyectos). Mitigación: incluir investigación/academia para volumen.
2. Sitios gov.cr cambian sin aviso. Necesario test E2E semanal por scraper.
3. Sostenibilidad si el cron falla y nadie revisa. Health-check semanal + dashboard interno.
4. Aspectos políticos de clasificar proyectos. Tono editorial neutral basado en datos públicos.
