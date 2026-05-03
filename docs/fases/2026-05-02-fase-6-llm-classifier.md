---
fase: 6
titulo: Clasificación LLM de candidatos del scraper (Groq + Llama 3.3)
fecha_aprobacion: 2026-05-02
estado: aprobado
aprobado_por: Mario Pérez Edwards
---

# Observatorio IA — Fase 6: Clasificador LLM de candidatos

## Contexto

Fase 5 entregó scrapers que detectan ~12 candidatos por run cruzando palabras clave ("inteligencia artificial", "ENIA", etc.) contra los listados de MICITT y CAMTIC. Hoy Mario revisa cada PR auto-generado y decide qué candidato es relevante. La barrera no es técnica (el PR es claro) sino editorial: muchos candidatos son ruido (eventos, becas, comunicados administrativos) que no merecen entrar al observatorio.

Fase 6 agrega un **clasificador LLM** que enriquece cada candidato con un score de relevancia, tipo y resumen de una línea, ordenando el reporte del PR para que Mario vea primero lo importante. Mantiene la política editorial de Fase 5: cero auto-add, todos los cambios al catálogo siguen requiriendo revisión humana.

Decisiones acordadas:
- **LLM**: Groq con Llama 3.3 70B Instruct. Free tier 1M tokens/día (>>los ~6K que usamos), español nativo, latencia <500ms por inferencia.
- **Política**: clasificar y rankear, no auto-aprobar.
- **Costo**: $0/mes (free tier de Groq).

## Alcance Fase 6

### 1. Helper `scrapers/lib/classifier.ts`

Cliente Groq vía `fetch` directo a `https://api.groq.com/openai/v1/chat/completions` (compatible OpenAI). Sin SDK adicional para mantener bundle bajo.

Función pública:

```ts
classify(candidate: { titulo: string; url: string; source: 'micitt' | 'camtic' }): Promise<Classification>
```

Donde `Classification`:

```ts
{
  score: number;        // 0-10, qué tan relevante es para el observatorio
  tipo: 'proyecto-nuevo' | 'actualizacion' | 'comunicado' | 'evento' | 'ruido';
  resumen: string;      // 1-2 frases en español
  tags: string[];       // ej: ['salud', 'piloto', 'CCSS']
  modelo: string;       // 'llama-3.3-70b-versatile'
}
```

Prompt: instrucción en español pidiendo:
- Evaluar relevancia (10=proyecto IA concreto del Estado CR con métricas; 0=puro ruido)
- Clasificar tipo
- Resumen factual sin embellecer
- Tags útiles para filtro

Response format: JSON mode (`{ "type": "json_object" }`).

### 2. Modificar `scrapers/run-all.ts`

Después de cada scraper, antes de escribir el reporte:

- Si `GROQ_API_KEY` existe → llamar `classify()` para cada candidato; si falla una llamada, marcar `score: null` y seguir.
- Si no existe → skip classifier, comportamiento idéntico a Fase 5 (compatibilidad backwards).
- Limitar concurrencia a 2 inferencias en paralelo (para no saturar rate limit de Groq aunque sea generoso).

### 3. Mejorar `renderMarkdown` en `run-all.ts`

Reorganizar el cuerpo del PR:

```md
## Scrape automático — <fecha>

- Cambios aplicados a JSON: N
- Notas para revisión humana: N
- Validación AJV: ✅ OK
- Clasificación LLM: ✅ activa (Llama 3.3 70B vía Groq) | ⚠️ sin LLM (sin GROQ_API_KEY)

### 🔴 Alta relevancia (score ≥ 8)
- [9] **proyecto-nuevo** · CCSS lanza piloto X (CCSS) — 1-line summary  
  → https://...

### 🟡 Media relevancia (score 5-7)
- [6] **actualizacion** · MICITT amplía LINC a 20 labs — 1-line summary  
  → https://...

### ⚪ Baja relevancia (score < 5)
- [3] **evento** · Conferencia internacional X — 1-line summary  
  → https://...

### Sin clasificar (LLM falló o no disponible)
- titulo … → url
```

Ordenado por score descendente dentro de cada bucket. Tags entre paréntesis.

### 4. Update `.github/workflows/scrape.yml`

Agregar env var del secret:

```yaml
- name: Run scrapers
  env:
    GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
  run: npm run scrape:all
```

Si el secret no está configurado en GitHub, el workflow corre igual (clasificador en modo fallback). Mario configura el secret una sola vez en Settings → Secrets and variables → Actions.

### 5. Documentación

- `scrapers/README.md`: sección nueva "Clasificador LLM" con setup local (ANTHROPIC_API_KEY o GROQ_API_KEY env), comportamiento sin key, costo esperado.
- `CLAUDE.md`: actualizar Estado a Fase 6 entregada + scripts.

## Archivos a crear / modificar

**Nuevos**:
- `scrapers/lib/classifier.ts` — cliente Groq + tipos.

**A modificar**:
- `scrapers/run-all.ts` — clasificar candidatos + reorganizar markdown.
- `scrapers/lib/diff.ts` — extender `ProposedChange` y notas para incluir `Classification` opcional.
- `scrapers/{micitt,camtic,asamblea}.ts` — los `notes.push("Candidato MICITT: ...")` se reestructuran a una lista de candidates con `{ titulo, url, source }` que el orquestador clasifica después. (Refactor menor.)
- `.github/workflows/scrape.yml` — env GROQ_API_KEY.
- `scrapers/README.md` — sección clasificador.
- `CLAUDE.md` — Estado Fase 6.

## Verificación

1. Sin GROQ_API_KEY: `npm run scrape:all` debe correr igual que Fase 5 (notas planas, sin score).
2. Con GROQ_API_KEY local en `.env.local` (no committeado): `npm run scrape:all` debe enriquecer cada candidato con score+tipo+resumen+tags.
3. `npm run validate-data` sigue pasando (no tocamos schemas).
4. `npm run build` sin cambios.
5. GitHub Action manual dispatch con secret configurado: PR auto se crea con cuerpo markdown nuevo agrupado por relevancia.
6. Inspección del PR: candidatos relevantes (CCSS LIDIA actualización, nuevo proyecto IA, etc.) aparecen arriba; ruido (becas, eventos) abajo.

## Costo y limites

- **Groq free tier**: 1M tokens/día, 30 req/min.
- **Por run**: ~12 candidatos × ~500 tokens input + 200 output = ~8.4K tokens. <1% del límite diario.
- **Por mes**: 12 runs × 8.4K = 100K tokens. <0.5% del límite mensual implícito.
- **Latencia**: ~500ms por inferencia × 12 = 6 segundos extra por run, paralelizando 2 → 3 segundos. Negligible vs los 60+ segundos del workflow.

## Fuera de alcance

- Auto-add de candidatos con score alto (decisión Mario: mantener revisión humana siempre).
- Fine-tuning de prompt con ejemplos del propio observatorio (en el primer pase usamos prompt zero-shot; mejoramos después si la calidad lo requiere).
- Extracción automática de cifras del texto del candidato (Fase 6.1 si lo necesitamos).
- Alertas Telegram/email separadas del PR (puede ser Fase 8).
- API pública JSON read-only (Fase 8).
