---
fase: 9
titulo: API pública JSON read-only
fecha_aprobacion: 2026-05-04
estado: entregado
aprobado_por: Mario Pérez Edwards
---

# Observatorio IA — Fase 9: API pública JSON read-only

## Contexto

Con 18 proyectos catalogados, 7 instituciones, 3 expedientes y 10 scrapers detectando ~27 candidatos por run, el catálogo ya es un activo aprovechable por terceros: periodistas que cubren transformación digital, investigadores académicos, otros observatorios LATAM. Sin API, cada uno tendría que scrapear el HTML del observatorio — irónico para un proyecto que justamente expone data abierta.

Como el sitio usa `output: 'export'` (Next.js 14 estático) NO hay backend ni route handlers runtime. La "API" es simplemente archivos JSON servidos por Vercel desde `public/api/` con headers `Content-Type: application/json` + CORS abierto. Sin auth, sin rate-limit, sin tracking.

## Alcance Fase 9

### 1. Script `scripts/build-api.ts`

- Lee los 5 datasets validados de `src/data/json/` (fuente de verdad).
- Envuelve cada uno en un envelope estándar: `{version, lastUpdate, count, source, license, data}`.
- Escribe a `public/api/<dataset>.json`.
- Genera además:
  - `/api/index.json` — manifest con URL, descripción y count de cada endpoint.
  - `/api/index.html` — página HTML humano-amigable (tabla de endpoints + ejemplo de envelope + licencia + contacto).

### 2. Hook `prebuild` en `package.json`

```json
"prebuild": "tsx scripts/build-api.ts",
"build:api": "tsx scripts/build-api.ts",
"build": "next build"
```

Cada `npm run build` regenera la API automáticamente con `lastUpdate` actualizado al momento del deploy. Los JSON quedan en sincronía con el catálogo del sitio.

### 3. `vercel.json` con headers CORS

```json
{
  "headers": [
    {
      "source": "/api/(.*)\\.json",
      "headers": [
        { "key": "Content-Type", "value": "application/json; charset=utf-8" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, OPTIONS" },
        { "key": "Cache-Control", "value": "public, max-age=600, s-maxage=3600" }
      ]
    }
  ]
}
```

CORS abierto + cache 10 min cliente / 1h CDN.

### 4. `tsconfig.json` exclude

Next.js typecheck cubría `**/*.ts` incluyendo `scrapers/` y `scripts/`. La regex flag `/gs` (dotall) en `cgr.ts` rompía el build con `Type error: This regular expression flag is only available when targeting 'es2018' or later`. Excluí ambos directorios — `tsx` los corre con su propio target sin problemas.

```json
"exclude": ["node_modules", "scrapers/**", "scripts/**"]
```

### 5. Footer + i18n

`Footer` ahora lista 2 enlaces: "Quién mantiene" + "API pública JSON" (ES/EN). String agregado a `Dictionary.footer.apiPublica`.

## Endpoints

| URL | Items | Descripción |
|---|---|---|
| `/api/proyectos.json` | 18 | Catálogo completo de proyectos IA en sector público CR. |
| `/api/instituciones.json` | 7 | Instituciones con proyectos IA documentados. |
| `/api/legislacion.json` | 3 | Expedientes de ley IA en la Asamblea Legislativa. |
| `/api/indicadores.json` | 3 | ILIA 2025, comparativa regional, KPIs hero. |
| `/api/brechas.json` | 7 | 7 brechas vs Estonia/Singapur. |
| `/api/index.json` | — | Manifest con todos los endpoints. |
| `/api/` (HTML) | — | Página humano-amigable con tabla de endpoints. |

## Formato de respuesta

```json
{
  "version": "0.1.0",
  "lastUpdate": "2026-05-04T15:00:00.000Z",
  "count": 18,
  "source": "https://observatorioia.org",
  "license": "CC BY 4.0",
  "data": [ ... ]
}
```

## Licencia y atribución

Datos bajo **CC BY 4.0**. Atribuir "Observatorio IA Costa Rica" (observatorioia.org) con enlace.

## Costo

- $0/mes adicional. Vercel sirve los JSON estáticos sin compute. Tamaño total: ~66 KB (todos los endpoints).

## Verificación

`npm run build` produce `out/api/*.json` (66 KB total) + `out/api/index.html`. Build exitoso con 87.5 kB First Load JS sin cambio.

## Próxima fase candidata

- **Posts LinkedIn 02-05**: campaña editorial. Post 02 ("Lo que Uruguay nos enseña") puede ahora linkear directamente al endpoint `/api/proyectos.json` como evidencia.
- **Logo definitivo**: 16 opciones Canva + Gemini ya generadas, Mario revisando.
- **Tier D scrapers** (futuro): MEIC, TSE, ICE/SUTEL si publican proyectos IA.
