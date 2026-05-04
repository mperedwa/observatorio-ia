---
fase: 8.1
titulo: Tier B scrapers — Google News + Hacienda (best-effort)
fecha_aprobacion: 2026-05-04
estado: entregado
aprobado_por: Mario Pérez Edwards
---

# Observatorio IA — Fase 8.1: Tier B scrapers

## Contexto

Fase 8 entregó 6 scrapers de fuentes accesibles (Asamblea, MICITT, CAMTIC, PJ, Delfino, CITIC). El Tier B (CCSS, Hacienda, CENAT) quedó descartado por:

- **CCSS** (`ccss.sa.cr`): firewall geográfico — TCP RST inmediato desde IPs no-CR. Subdominios `prensa.`, `transparencia.` igual bloqueados.
- **Hacienda** (`hacienda.go.cr`): WAF estricto, `400 Bad Request` con curl/fetch incluso con headers full Chrome.
- **CENAT** (`cenat.ac.cr`): sitio HTML estático sin feed ni sección de noticias unificada.

Sin proxy residencial CR, ninguno es scrapeable directamente. Pero las noticias sobre estas instituciones SÍ aparecen indexadas en prensa CR (La Nación, El Financiero, crhoy, El Observador, monumental, Diario Extra, Semanario Universidad, La Teja, Revista SUMMA, tec.ac.cr, etc.).

**Insight clave**: `news.google.com/rss/search` devuelve 200 OK desde cualquier IP, sin auth, y permite queries multi-fuente. Es el agregador perfecto para cubrir las instituciones bloqueadas.

## Alcance Fase 8.1

### 1. Scraper `scrapers/google-news.ts` (Tier B principal)

- **Estrategia**: 3 queries paralelas:
  - `"CCSS" inteligencia artificial Costa Rica`
  - `Hacienda inteligencia artificial Costa Rica`
  - `CENAT OR LaNIA inteligencia artificial Costa Rica`
- Localización: `hl=es-419&gl=CR&ceid=CR:es-419` (resultados priorizando prensa CR).
- Parser: regex sobre `<item>...</item>` (sin dependencia XML).
- Filtrado: `mentionsAI()` como sanity check para descartar matches puramente del nombre institucional sin IA (ej: CCSS pensiones).
- Deduplicación: por URL Y por título normalizado (Google News a veces sirve la misma nota con URL distinta).
- Cap: 6 candidatos por query, 12 total.
- Política editorial: el título incluye prefijo `[institucion · fuente]` para que Mario vea de un vistazo qué medio cubrió la nota.
- **Importante**: Google News es agregador de prensa. El system-prompt del classifier LLM ahora **penaliza ligeramente** el score si la única evidencia es prensa sin link a fuente primaria.

### 2. Scraper `scrapers/hacienda.ts` (Tier B best-effort)

- **Estrategia**: Playwright headless contra `/noticias` y home `/`. Pasa el WAF (200 OK) que rechaza fetch/curl.
- Extracción: regex genérica de `<a>` con texto descriptivo + filtro de keywords Hacienda (TRIBU-CR, Atena, fraude, evasión, etc.).
- Resultado actual: el HTML inicial no contiene noticias listables — Hacienda carga el bloque "Noticias recientes" vía AJAX no-detectable. El scraper devuelve `0 fetched` con nota informativa.
- **Mantener el scraper** como hook: si Hacienda expone un endpoint JSON o cambia su renderizado, este scraper queda listo.
- Cobertura real de Hacienda viene por `google-news.ts` (query `Hacienda inteligencia artificial Costa Rica`).

### 3. Extensión del clasificador LLM

`scrapers/lib/classifier.ts`:
- Tipo `Source` ampliado a `'micitt' | 'camtic' | 'asamblea' | 'pj' | 'delfino' | 'citic' | 'google-news' | 'hacienda'`.
- Prompt actualizado con la lista nueva y la regla: "candidatos de Google News y Delfino.cr son prensa, no fuente oficial. Penaliza ligeramente el score si la única evidencia es prensa sin enlace a fuente primaria; favorece comunicados oficiales y feeds institucionales."

### 4. Orquestador

`scrapers/run-all.ts` corre los 8 scrapers en serie. La política aplicar-cambios sigue intacta: solo Asamblea modifica JSON automáticamente; los demás dejan candidatos.

### 5. Scripts npm + README

Agregados: `scrape:google-news`, `scrape:hacienda`. README scrapers actualizado con tabla completa y nota explícita sobre qué hace cada uno.

## Resultados de prueba (local, 2026-05-04)

```
asamblea       3/3   matched     (sin candidatos, ya catalogados)
micitt        11/0   matched     (sin contenido IA reciente)
camtic        20/4   matched     (Unesco IA Educación, LINC, Equifax/NIST)
pj            20/0   matched     (sin contenido IA reciente)
delfino       21/2   matched     (Asamblea nueva, Transformar info en sabiduría)
citic         10/2   matched     (charla cuántica + visión computacional/IA)
google-news  107/14  matched     (12 candidatos: TEC+CCSS, EBAIS, listas espera, ENIA, etc.)
hacienda       0/0   matched     (Playwright OK pero AJAX no-detectable — best-effort)

Total: 192 fetched, 25 matched, 20 candidatos
Validación AJV: ✅ OK (5 datasets: 18 proyectos, 7 instituciones, 3 leyes, indicadores, 7 brechas)
```

Sample candidatos Google News:
- `[ccss · tec.ac.cr]` TEC y CCSS impulsan IA para retos de salud pública
- `[ccss · La Teja]` CCSS anuncia uso de IA en delicado tema
- `[ccss · crhoy.com]` Ingeniero CR desarrolla IA para reducir listas de espera CCSS
- `[ccss · El Observador CR]` CCSS incorporará IA en EBAIS para agilizar diagnósticos
- `[hacienda · nacion.com]` Editorial: Gobernar en la era de la IA
- `[hacienda · Delfino.cr]` Capacitación tributaria + IA en Zona Atlántica
- `[cenat · Unesco]` CR primer país de Centroamérica en tener estrategia de IA
- `[cenat · crhoy.com]` Inicia formulación de Estrategia Nacional de IA

## Costo

- $0/mes adicional (Google News RSS público sin auth, sin rate-limit observado).
- Sin nuevas dependencias.

## Tier C candidato (vigilancia anual, no urgente)

- **MIDEPLAN** (`mideplan.go.cr`): Plan Nacional de Desarrollo, indicadores modernización Estado. Probable Drupal/HTML estático.
- **Contraloría General** (`cgr.go.cr`): auditorías a sistemas digitales. Útil para detectar críticas a proyectos catalogados.
- **PROSIC (UCR)** (`prosic.ucr.ac.cr`): reporte anual estado digital de CR. Una corrida por año basta.

## Próxima fase candidata

**Fase 9 — API pública JSON read-only**: exponer `/api/proyectos.json`, `/api/instituciones.json`, `/api/legislacion.json` desde `out/` estático con headers `application/json` + CORS. Útil para periodistas/investigadores que ahora ven candidatos enriquecidos por Google News.
