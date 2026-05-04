/**
 * Classifier LLM via Groq (Llama 3.3 70B Versatile, free tier).
 *
 * Política editorial: enriquece candidatos con score y tipo, NO autoriza
 * cambios al catálogo. Mario sigue revisando manualmente cada PR.
 *
 * Compatible con OpenAI Chat Completions API (Groq es 1:1 compatible).
 * Si GROQ_API_KEY no está seteado en env, las funciones devuelven null
 * y el orquestador hace fallback a comportamiento Fase 5.
 */

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export type Tipo =
  | 'proyecto-nuevo'
  | 'actualizacion'
  | 'comunicado'
  | 'evento'
  | 'ruido';

export interface Classification {
  score: number;
  tipo: Tipo;
  resumen: string;
  tags: string[];
  modelo: string;
}

export type Source =
  | 'micitt'
  | 'camtic'
  | 'asamblea'
  | 'pj'
  | 'delfino'
  | 'citic'
  | 'google-news'
  | 'hacienda'
  | 'cgr'
  | 'mideplan';

export interface Candidate {
  titulo: string;
  url: string;
  source: Source;
}

const SYSTEM_PROMPT = `Eres un analista del Observatorio IA Costa Rica (observatorioia.org). El observatorio cataloga proyectos de inteligencia artificial en el sector público costarricense.

Tu tarea: clasificar candidatos detectados por scrapers de fuentes oficiales (MICITT, CAMTIC, Asamblea Legislativa, Poder Judicial, CITIC-UCR, Hacienda, Contraloría/CGR, MIDEPLAN) y editoriales/agregadores (Delfino.cr, Google News) según su relevancia para el catálogo del observatorio.

Importante: candidatos de Google News y Delfino.cr son **prensa, no fuente oficial**. Penaliza ligeramente el score si la única evidencia es prensa sin enlace a fuente primaria; favorece comunicados oficiales y feeds institucionales.

Para CGR (Contraloría) presta atención especial a informes de fiscalización (tipo \`informe\`) que mencionen sistemas digitales, IA, automatización o auditen proyectos catalogados — son evidencia de alta credibilidad. Para MIDEPLAN, prioriza menciones a Plan Nacional de Desarrollo (PNDIP), modernización del Estado o cooperación internacional con componente digital.

Criterios de scoring (0-10):
- 9-10: proyecto IA concreto en una institución pública costarricense, con métricas o cronograma o presupuesto explícito.
- 7-8: actualización significativa de proyecto ya catalogado (cambio de estado, expansión de cobertura, resultados nuevos), o proyecto IA piloto sin métricas todavía.
- 5-6: comunicado oficial sobre IA con contenido sustantivo (nueva política, alianza estratégica, marco regulatorio).
- 3-4: evento, conferencia, beca, programa de capacitación o curso (relevante pero no proyecto IA en sí).
- 0-2: ruido, mención superficial, contenido tangencial.

Tipos:
- proyecto-nuevo: implementación IA concreta no catalogada.
- actualizacion: cambio en proyecto/expediente ya catalogado o estado verificable.
- comunicado: política, alianza, declaración pública oficial.
- evento: conferencia, taller, evento puntual.
- ruido: mención sin sustancia o contenido no IA.

Resumen: 1-2 frases en español, factual, sin embellecer. Cita la métrica o resultado clave si la fuente lo menciona.

Tags: 2-5 etiquetas en minúsculas, útiles para filtro. Ejemplos: 'ccss', 'salud', 'piloto', 'micitt', 'enia', 'expediente-23.771', 'capacitacion', 'asamblea'.

Devuelve EXCLUSIVAMENTE un JSON válido con las claves: score (number), tipo (string), resumen (string), tags (array of strings).`;

function userPrompt(c: Candidate): string {
  return `Candidato detectado por scraper de **${c.source}**:

**Título**: ${c.titulo}
**URL**: ${c.url}

Clasifica este candidato. Solo devuelve el JSON.`;
}

interface GroqResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

async function callGroq(apiKey: string, candidate: Candidate, timeoutMs = 15000): Promise<Classification | null> {
  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt(candidate) },
    ],
    temperature: 0.2,
    max_tokens: 400,
    response_format: { type: 'json_object' },
  };

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    console.warn(`  classifier: fetch error: ${(err as Error).message}`);
    return null;
  }

  const json = (await res.json()) as GroqResponse;

  if (!res.ok) {
    console.warn(`  classifier: HTTP ${res.status} ${json.error?.message ?? 'unknown error'}`);
    return null;
  }

  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    console.warn(`  classifier: respuesta sin content`);
    return null;
  }

  let parsed: Partial<Classification>;
  try {
    parsed = JSON.parse(content) as Partial<Classification>;
  } catch (err) {
    console.warn(`  classifier: JSON inválido: ${(err as Error).message}`);
    return null;
  }

  // Validar shape mínimo
  if (
    typeof parsed.score !== 'number' ||
    typeof parsed.tipo !== 'string' ||
    typeof parsed.resumen !== 'string'
  ) {
    console.warn(`  classifier: shape inválido en respuesta`);
    return null;
  }

  // Coerce tipo a enum válido (si LLM devuelve algo raro, marcar como 'ruido')
  const validTipos: Tipo[] = ['proyecto-nuevo', 'actualizacion', 'comunicado', 'evento', 'ruido'];
  const tipo = validTipos.includes(parsed.tipo as Tipo) ? (parsed.tipo as Tipo) : 'ruido';

  return {
    score: Math.max(0, Math.min(10, Math.round(parsed.score * 10) / 10)),
    tipo,
    resumen: parsed.resumen.slice(0, 400),
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5).map((t) => String(t)) : [],
    modelo: MODEL,
  };
}

/** True si hay API key configurada. Llamar antes de classifyMany para fallback graceful. */
export function classifierAvailable(): boolean {
  return Boolean(process.env.GROQ_API_KEY?.trim());
}

/**
 * Clasifica varios candidatos en paralelo limitado.
 * Devuelve mismo orden que input. Cada slot puede ser null si la inferencia falló.
 */
export async function classifyMany(
  candidates: Candidate[],
  concurrency = 2,
): Promise<Array<Classification | null>> {
  const apiKeyRaw = process.env.GROQ_API_KEY?.trim();
  if (!apiKeyRaw) {
    return candidates.map(() => null);
  }
  const apiKey: string = apiKeyRaw;

  const results: Array<Classification | null> = new Array(candidates.length).fill(null);
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < candidates.length) {
      const idx = cursor++;
      const candidate = candidates[idx];
      if (!candidate) continue;
      results[idx] = await callGroq(apiKey, candidate);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, candidates.length) }, worker));
  return results;
}
