---
fase: 8
titulo: Tier A scrapers — Poder Judicial + Delfino.cr + CITIC-UCR
fecha_aprobacion: 2026-05-04
estado: entregado
aprobado_por: Mario Pérez Edwards
---

# Observatorio IA — Fase 8: Tier A scrapers

## Contexto

Fase 5 dejó 3 scrapers operativos (Asamblea, MICITT, CAMTIC) y Fase 6 agregó clasificación LLM. Mario pidió ampliar la cobertura para alimentar el catálogo con señal temprana de las instituciones más activas (Poder Judicial, CCSS, CENAT).

Antes de codear hicimos smoke tests de los 3 candidatos originales:

- **Poder Judicial** (`pj.poder-judicial.go.cr`): Joomla, 200 OK, listing paginado en `/index.php/component/content/category/8-sala-de-prensa`. RSS feed disponible pero `<title>` viene vacío (bug Joomla); parseamos HTML directo.
- **CCSS** (`ccss.sa.cr`): timeout total desde IPs no-CR. Firewall geográfico que bloquea AWS/GitHub Actions. **Inviable sin proxy residencial**.
- **CENAT** (`cenat.ac.cr`): sitio HTML estático sin feed ni sección de noticias. Subdominios (PRIAS, CNCA) tampoco publican IA. **Inviable como scraper de noticias**.

Reemplazamos CCSS y CENAT por dos fuentes accesibles y útiles:

- **Delfino.cr** (`delfino.cr/feed`): prensa editorial CR, RSS oficial, 21 items rolling. Cubre CCSS/Hacienda/Asamblea/IA gov por mención editorial cuando los sitios oficiales tardan días.
- **CITIC-UCR** (`citic.ucr.ac.cr/rss.xml`): Centro de Investigación TIC de UCR, ya catalogado (proyecto `ucr-citic-ia-software` + Erasmus+ CIOdD). Feed estable con noticias y eventos de IA, ética IA, machine learning.

## Alcance Fase 8

### 1. Scraper `scrapers/pj.ts` (Poder Judicial)

- Estrategia: pagina 4 vueltas (`?start=0,5,10,15`) sobre la Sala de Prensa Joomla → ~20 notas recientes.
- Extracción: regex sobre URLs `/article/<id>-<slug>?catid=8&Itemid=409`.
- Filtrado: `mentionsAI()` + keywords PJ (`chatbot`, `automa`, `anonim`, `tipifica`, `giro continuo`, `nymiz`, `algoritm`, `predict`, `datos abiertos`, etc.).
- `slugToTitle()` capitaliza el slug para humanos (no es el título real, lo dejamos claro).

### 2. Scraper `scrapers/delfino.ts` (Delfino.cr)

- Estrategia: lee `https://delfino.cr/feed`, parsea con regex sobre `<item>...</item>` (sin dependencia XML).
- Filtrado: `mentionsAI()` + keywords gov (`micitt`, `ccss`, `hacienda`, `mep`, `poder judicial`, `asamblea`, `enia`, `tribu-cr`, `sinpe`, `edus`, `lidia`, `aida`, `expediente 23.771/23.919/24.484`, `gobierno digital`, `transformación digital`).
- Política: Delfino es **prensa, no fuente oficial**. Los candidatos exigen validación contra fuente primaria antes de cualquier `add` o `update` al catálogo. La `política editorial` ya existente lo bloquea automáticamente (no se hacen `add`).

### 3. Scraper `scrapers/citic.ts` (CITIC-UCR)

- Estrategia: lee `https://citic.ucr.ac.cr/rss.xml`, mismo parser que Delfino.
- Filtrado: `mentionsAI()` + keywords UCR (`ethical ai`, `ética`, `ciencia de datos`, `algoritm`, `predictiv`, `erasmus`, `ciodd`, `computación cuántica`, `software inteligente`, `modelo de lenguaje`).
- Útil para detectar nuevas ediciones de Erasmus+, papers IA, charlas o convocatorias relevantes para los 2 proyectos UCR ya catalogados.

### 4. Hardening de `mentionsAI()`

Bug detectado durante prueba PJ: `mentionsAI` matcheaba `ia` como substring → falsos positivos en `judic**ia**les`, `al**ia**nza`, `restaurat**iva**`, `anc**ia**na`, etc. Resultado en PJ: 13/20 falsos positivos.

Fix en `scrapers/lib/source.ts`:

- Substrings que sí funcionan como parte de palabra: `inteligencia artificial`, `machine learning`, `aprendizaje automático`, `algoritm`, `chatbot`, `asistente virtual`, `modelo predictivo`, `predicción`, `aprendizaje profundo`, `red neuronal`.
- Acrónimos con **word boundary** (`\bIA\b`, `\bAI\b`, `\bENIA\b`, `\bLINC\b`).

Consecuencia para CAMTIC: pasó de 12 candidatos (con ruido tipo "transferencia", "tecnología") a 4 candidatos limpios (Unesco IA Educación, LINC, Equifax/NIST, etc.).

### 5. Extensión del clasificador LLM

`scrapers/lib/classifier.ts`: tipo `Source` exportado y ampliado a `'micitt' | 'camtic' | 'asamblea' | 'pj' | 'delfino' | 'citic'`. Prompt actualizado con la lista nueva.

### 6. Orquestador

`scrapers/run-all.ts` ahora corre los 6 scrapers en serie. Sigue aplicando solo cambios de Asamblea (los demás son candidatos, política Fase 5/6 intacta).

### 7. Scripts npm + README

Agregados: `scrape:pj`, `scrape:delfino`, `scrape:citic`. README actualizado con la tabla de selectores y nota explícita sobre Tier B descartado (CCSS, Hacienda, CENAT).

## Resultados de prueba (local, 2026-05-04)

```
asamblea    3/3   matched     (sin candidatos, ya catalogados)
micitt     11/0   matched     (sin contenido IA reciente)
camtic     20/4   matched     (Unesco IA Educación, LINC ×2, Equifax/NIST)
pj         20/0   matched     (sin contenido IA reciente)
delfino    21/2   matched     (Asamblea nueva, Transformar info en sabiduría)
citic      10/2   matched     (charla cuántica + visión computacional/IA)

Total: 85 fetched, 11 matched, 8 candidatos
Validación AJV: ✅ OK (5 datasets: 18 proyectos, 7 instituciones, 3 leyes, indicadores, 7 brechas)
```

## Tier B descartado (con Playwright residencial sería viable, futuro)

| Fuente | Bloqueo | Workaround posible |
|---|---|---|
| CCSS (`ccss.sa.cr`) | Timeout TCP desde IPs no-CR. GitHub Actions tampoco accede. | Proxy residencial CR o agente cortextOS corriendo desde IP CR. |
| Hacienda (`hacienda.go.cr`) | WAF estricto, `400 Bad Request`. | Playwright headless con headers exactos de Chrome + cookies de sesión. |
| CENAT (`cenat.ac.cr`) | Sitio estático sin feed ni sección de noticias. | Solo si CENAT publica feed/sitemap o si scrapeamos subdominios temáticos puntualmente. |

## Costo

- $0/mes adicional (3 RSS feeds + 1 HTML paginado, todos públicos sin auth).
- Sin nuevas dependencias (cheerio + Playwright ya instalados desde Fase 5).

## Próxima fase candidata

**Fase 9 — API pública JSON read-only**: exponer `/api/proyectos.json`, `/api/instituciones.json`, `/api/legislacion.json` desde `out/` estático para periodistas/investigadores. Sin backend; solo copia los JSON validados al directorio público con headers `application/json` + CORS.
