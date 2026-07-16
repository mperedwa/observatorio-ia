/**
 * Clasifica cada candidato del último scrape contra TRES fuentes del repo:
 *   - src/data/json/proyectos.json (proyectos institucionales mapeados)
 *   - src/components/Recursos.tsx (recursos / políticas públicas / indicadores)
 *   - src/app/[locale]/analisis/<slug>/translations.ts (artículos publicados)
 *
 * Salida: scraper-runs/classification.json con buckets:
 *   - nuevos      : sin match contra repo, ameritan agregarse
 *   - ya_existe   : matcheados con un proyecto / recurso / artículo, sin señal de update
 *   - revisar     : matcheados PERO el titulo trae keywords de cambio de estado
 *                   (aprueba, pospone, lanza, resultado, etc.). Requieren revisión
 *                   humana porque pueden ser updates relevantes del item existente.
 *   - ruido       : descartados (score bajo, fuente no institucional, tipo=ruido)
 *   - ya_decidido : YA se descartó (NO) en un scrape-review previo — memoria del
 *                   ledger entre corridas. NO entra al issue ni al analista. Evita
 *                   que un re-reporte vuelva a correr todo el ciclo cada semana.
 *
 * Y scraper-runs/stub-nuevos.json (sólo si nuevos > 0): esqueleto con shape de
 * proyectos.json + placeholders TODO_* para revisión humana antes de mergear.
 *
 * Reglas en orden (primer match gana):
 *   0. firma (URL o título) matchea una decisión 'rejected' del ledger        -> YA_DECIDIDO
 *   1. classification.tipo === 'ruido'                                     -> RUIDO
 *   2. score < 5                                                            -> RUIDO
 *   3. URL exacta == proyecto/recurso/artículo                              -> match (ya_existe o revisar)
 *   4. source sin institución mapeada y sin hint en el título               -> RUIDO
 *   5. overlap ponderado >=4 con proyecto de la misma institución           -> match
 *   6. overlap ponderado >=4 con recurso o artículo                          -> match
 *   7. resto                                                                 -> NUEVO
 *
 * Cuando hay match (regla 3/5/6): si el título o el resumen del candidato
 * contiene keywords de "cambio de estado" (aprueba, pospone, lanza, etc.) y
 * todo viene de un scrape reciente -> REVISAR. Sino -> YA_EXISTE.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadLedger, matchDecision, type Ledger } from './lib/decisions-ledger.js';

const ROOT = process.cwd();
const REPORT_PATH = join(ROOT, 'scraper-runs', 'last-run.json');
const PROYECTOS_PATH = join(ROOT, 'src', 'data', 'json', 'proyectos.json');
const RECURSOS_PATH = join(ROOT, 'src', 'components', 'Recursos.tsx');
const ANALISIS_DIR = join(ROOT, 'src', 'app', '[locale]', 'analisis');
const CLASSIFICATION_OUT = join(ROOT, 'scraper-runs', 'classification.json');
const STUB_OUT = join(ROOT, 'scraper-runs', 'stub-nuevos.json');

type Bilingual = { es: string; en: string };

export interface Proyecto {
  id: string;
  titulo: Bilingual;
  institucionId: string;
  categoria: string;
  estado: string;
  desde?: string;
  descripcion: Bilingual;
  resultado?: Bilingual;
  contexto?: Bilingual;
  fuenteUrl: string;
}

export interface Classification {
  score: number;
  tipo: string;
  resumen: string;
  tags: string[];
  modelo?: string;
}

export interface ClassifiedCandidate {
  source: string;
  candidate: { titulo: string; url: string };
  classification: Classification | null;
}

interface Consolidated {
  ranAt: string;
  classifiedCandidates: ClassifiedCandidate[];
}

// Mapeo del campo `source` del scrape (origen del feed) Y del hint en el
// título (google-news manda `[ccss · ...]` como prefijo) al `institucionId`
// del repo. Las fuentes que NO mapean caen a RUIDO o requieren hint.
const SOURCE_TO_INSTITUCION: Record<string, string> = {
  micitt: 'micitt',
  pj: 'poder-judicial',
  asamblea: 'asamblea',
  hacienda: 'hacienda',
  citic: 'ucr',
  // Hints directos del título (cuando google-news prefija con [ccss · ...]).
  ccss: 'ccss',
  mep: 'mep',
  cenat: 'cenat',
  ucr: 'ucr',
  tec: 'tec',
};

// Fuentes que NO mapean a institución pública por sí solas. Sin hint en el
// título, se descartan como RUIDO directamente.
const SOURCES_NO_INSTITUCIONALES = new Set([
  'camtic',
  'mideplan',
  'cgr',
  'delfino',
]);

// Stopwords comunes en titulares (ES + EN) y términos demasiado genéricos
// del dominio que producirían falsos matches (todo proyecto IA en CR comparte
// "costa rica inteligencia artificial").
const STOPWORDS = new Set([
  'a', 'al', 'algun', 'alguna', 'algunas', 'algunos', 'ante', 'cada', 'con',
  'contra', 'de', 'del', 'desde', 'donde', 'durante', 'el', 'ella', 'ellas',
  'ellos', 'en', 'entre', 'era', 'eran', 'es', 'esa', 'esas', 'ese', 'eso',
  'esos', 'esta', 'estan', 'estas', 'este', 'esto', 'estos', 'hacia', 'hasta',
  'la', 'las', 'le', 'les', 'lo', 'los', 'mas', 'me', 'mi', 'mis', 'muy',
  'nos', 'nuestra', 'nuestras', 'nuestro', 'nuestros', 'o', 'os', 'para',
  'pero', 'por', 'porque', 'pues', 'que', 'quien', 'quienes', 'se', 'segun',
  'ser', 'si', 'sin', 'sobre', 'son', 'su', 'sus', 'te', 'ti', 'todo',
  'toda', 'todas', 'todos', 'tras', 'tu', 'tus', 'un', 'una', 'unas', 'unos',
  'y', 'ya', 'yo',
  'the', 'and', 'for', 'with', 'from', 'this', 'that', 'have', 'has', 'are',
  'was', 'were', 'will', 'would', 'into', 'about', 'after', 'before', 'where',
  'when', 'which', 'these', 'those',
  // Domain noise — tokens compartidos por casi todo proyecto del observatorio.
  'noticia', 'noticias', 'comunicado', 'editorial',
  'costa', 'rica', 'costarricense', 'costarricenses', 'pais', 'nacional',
  'nacionales', 'inteligencia', 'artificial', 'tecnologia', 'tecnologias',
  'tecnologica', 'tecnologicas', 'tecnologico', 'estado', 'sistema', 'sistemas',
  'institucion', 'institucional', 'institucionales', 'publico', 'publica',
  'publicas', 'publicos', 'gobierno', 'ministerio', 'servicio', 'servicios',
  'oficial', 'oficiales', 'proyecto', 'proyectos', 'programa', 'programas',
  'avance', 'avances', 'iniciativa', 'iniciativas', 'desarrollo', 'desarrollos',
  'plan', 'planes', 'planificacion',
]);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Acrónimos institucionales cortos que valen como token fuerte aunque tengan
// <4 caracteres. Sin esto, "TEC", "UCR", "MEP", "IA" desaparecerían y
// candidatos legítimos quedarían sin match.
const SHORT_TOKEN_WHITELIST = new Set([
  'tec', 'ucr', 'mep', 'ice', 'cgr', 'aya', 'edus', 'gtmi', 'gtmi',
  'una', 'utn', 'eut', 'rsn', 'aida', 'enia',
]);

// Aliases conocidos: cuando el texto contiene la frase, agregamos el token
// expandido. Soluciona el caso donde un titular menciona "Estrategia Nacional
// de Inteligencia Artificial" pero el recurso del repo está catalogado como
// "ENIA" (acrónimo). Sin esto, el overlap pierde la conexión semántica.
const PHRASE_ALIASES: Array<{ phrase: RegExp; token: string }> = [
  // Cubrimos las variantes que aparecen en prensa: "Estrategia Nacional de IA",
  // "Estrategia de IA", "Estrategia de Inteligencia Artificial", "ENIA" suelto.
  { phrase: /\benia\b/, token: 'enia' },
  { phrase: /\bestrategia nacional\b/, token: 'enia' },
  { phrase: /\bestrategia (?:nacional )?(?:de )?(?:la )?(?:ia|inteligencia artificial)\b/, token: 'enia' },
  { phrase: /\bexpediente digital unico\b/, token: 'edus' },
  { phrase: /\bplan nacional de desarrollo\b/, token: 'pnd' },
  { phrase: /\bcentro nacional de alta tecnologia\b/, token: 'cenat' },
  { phrase: /\buniversidad de costa rica\b/, token: 'ucr' },
  { phrase: /\bcaja costarricense de seguro social\b/, token: 'ccss' },
];

function tokenize(s: string): Set<string> {
  const norm = normalize(s);
  const out = new Set<string>();
  for (const tok of norm.split(/\s+/)) {
    if (STOPWORDS.has(tok)) continue;
    if (tok.length >= 4) {
      out.add(tok);
    } else if (tok.length >= 3 && SHORT_TOKEN_WHITELIST.has(tok)) {
      out.add(tok);
    }
  }
  // Expand frases conocidas a su acrónimo institucional.
  for (const { phrase, token } of PHRASE_ALIASES) {
    if (phrase.test(norm)) out.add(token);
  }
  return out;
}

// Tokens "fuertes": acrónimos institucionales que cuando aparecen en común
// pesan doble. Un title que comparte `ccss + tec` con un proyecto del repo
// es casi seguro el mismo proyecto, aunque el resto de los tokens difiera.
function weightedOverlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of a) {
    if (!b.has(t)) continue;
    const isStrong = SHORT_TOKEN_WHITELIST.has(t) || INSTITUCION_IDS_AS_TOKENS.has(t);
    n += isStrong ? 2 : 1;
  }
  return n;
}

// Tokens que coinciden con institucionId conocidos cuentan como señal fuerte.
const INSTITUCION_IDS_AS_TOKENS = new Set([
  'ccss', 'micitt', 'hacienda', 'mep', 'ucr', 'cenat',
]);

const HINT_PREFIX = /^\[([a-z][a-z0-9-]*)\s*·/;
// Captura institucionId + publisher del prefijo del título:
// `[ccss · tec.ac.cr]`  → groups: ('ccss', 'tec.ac.cr')
// `[ccss · Teletica]`   → groups: ('ccss', 'Teletica')
const HINT_PREFIX_FULL = /^\[([a-z][a-z0-9-]*)\s*·\s*([^\]]+)\]/;

function extractTituloHint(titulo: string): string | null {
  const m = HINT_PREFIX.exec(titulo);
  return m ? m[1] : null;
}

/**
 * Extrae el publisher del prefijo del título (segundo grupo). Devuelve null
 * si no hay prefijo. Útil para chequear dedup contra fuenteUrl de un
 * proyecto cuando la url del candidato es una URL encriptada de Google News
 * que `curl -I -L` no resuelve confiablemente al medio final.
 */
function extractTituloPublisher(titulo: string): string | null {
  const m = HINT_PREFIX_FULL.exec(titulo);
  return m ? m[2].trim() : null;
}

/**
 * True si el publisher del prefijo del título matchea con el hostname de la
 * fuenteUrl del proyecto/recurso. Solo confiable cuando el publisher
 * contiene un punto (es hostname tipo `tec.ac.cr`, no nombre friendly tipo
 * `Teletica`). Para nombres friendly devolvemos false porque el mapeo
 * publisher→hostname es ambiguo (Teletica = teletica.com, pero "Infobae"
 * podría ser infobae.com o infobae.es).
 */
function publisherMatchesFuenteUrl(publisher: string, fuenteUrl: string): boolean {
  if (!publisher.includes('.')) return false;
  try {
    const url = new URL(fuenteUrl);
    // hostname puede venir con `www.` — normalizar quitándolo.
    const host = url.hostname.replace(/^www\./, '');
    const pub = publisher.toLowerCase().replace(/^www\./, '');
    return host === pub || host.endsWith('.' + pub) || pub.endsWith('.' + host);
  } catch {
    return false;
  }
}

function resolveInstitucionId(c: ClassifiedCandidate): string | null {
  // 1. Hint en el título (`[ccss · teletica.com] ...`) tiene prioridad sobre source.
  const hint = extractTituloHint(c.candidate.titulo);
  if (hint && SOURCE_TO_INSTITUCION[hint]) return SOURCE_TO_INSTITUCION[hint];
  // 2. Mapeo directo del source.
  if (SOURCE_TO_INSTITUCION[c.source]) return SOURCE_TO_INSTITUCION[c.source];
  return null;
}

export type Bucket = 'ya_existe' | 'ruido' | 'nuevo' | 'revisar' | 'ya_decidido';
export type MatchedType = 'proyecto' | 'recurso' | 'articulo';

export interface RecursoItem {
  id: string;          // slug derivado del título
  titulo: string;      // titulo.es
  url: string;
  fuente: string;
  tipo: string;        // tipo.es
}

export interface ArticuloItem {
  id: string;          // basename del directorio (01-ia-en-el-estado-costarricense)
  titulo: string;
  description: string;
}

export interface MatchResult {
  type: MatchedType;
  id: string;
  reason: string;
  /** true si el match fue por URL idéntica a la fuenteUrl del proyecto/recurso. En ese caso el candidato ES la misma noticia ya enlazada y no debe promoverse a 'revisar' por keyword. */
  byUrl?: boolean;
  /** true si el publisher del prefijo del título (ej. [ccss · tec.ac.cr]) matchea con el hostname de fuenteUrl del proyecto/recurso. Mismo efecto que byUrl para casos de google-news rss donde la URL viene encriptada y no podemos comparar directo. */
  bySamePublisher?: boolean;
}

export interface ClassifiedItem {
  bucket: Bucket;
  reason: string;
  matched_type?: MatchedType;
  matched_id?: string;
  candidate: ClassifiedCandidate;
  institucionId: string | null;
}

// Palabras que sugieren cambio de estado / update sobre un tema existente.
// Sin tildes (post-normalize). Si una de estas aparece en el título o resumen
// del candidato, el match contra el repo se promueve a REVISAR para que un
// humano evalúe si el item existente del repo necesita actualizarse.
const CAMBIO_ESTADO_KEYWORDS = new Set([
  'aprueba', 'aprobado', 'aprobada', 'aprueban', 'aprobacion',
  'pospone', 'pospuesto', 'pospuesta', 'posponen', 'postergan', 'postergado',
  'lanza', 'lanzado', 'lanzada', 'lanzan', 'lanzamiento',
  'resultado', 'resultados',
  'evaluacion', 'evalua', 'evaluan', 'evaluado', 'evaluada',
  'implementa', 'implementan', 'implementado', 'implementada', 'implementacion',
  'modifica', 'modificado', 'modificacion', 'modifican',
  'deroga', 'derogado', 'derogada', 'derogan',
  'rechaza', 'rechazado', 'rechazada', 'rechazan',
  'suspende', 'suspendido', 'suspendida', 'suspenden',
  'cancela', 'cancelado', 'cancelada', 'cancelan',
  'actualiza', 'actualizado', 'actualizacion', 'actualizan',
  'sanciona', 'sancionado', 'sancionada',
  'ratifica', 'ratificado', 'ratificacion',
  'decreta', 'decretado', 'decreto',
  'oficializa', 'oficializado',
  'inaugura', 'inaugurado', 'inauguracion',
  'amplia', 'ampliado', 'ampliacion', 'amplian',
  'reduce', 'reduccion',
  'incrementa', 'incremento',
  'firma', 'firmado', 'firmada',
  'expande', 'expansion', 'expanden',
  'concluye', 'concluyen', 'concluido',
  'publica', 'publicado', 'publicacion',
  'reanuda', 'reanudado', 'reanudan',
]);

// Frases bigram (post-normalize, separadas por espacio) que también disparan
// REVISAR. Las detectamos sobre la cadena normalizada completa.
const CAMBIO_ESTADO_BIGRAMS = [
  'primer debate', 'segundo debate', 'aprueba primer', 'aprobado primer',
  'aprueba segundo', 'aprobado segundo', 'sin convocar',
  'en consulta', 'entra vigencia', 'entran vigencia',
];

export function hasCambioEstado(c: ClassifiedCandidate): string | null {
  const text = `${c.candidate.titulo} ${c.classification?.resumen ?? ''}`;
  const norm = normalize(text);
  for (const phrase of CAMBIO_ESTADO_BIGRAMS) {
    if (norm.includes(phrase)) return phrase;
  }
  for (const tok of norm.split(/\s+/)) {
    if (CAMBIO_ESTADO_KEYWORDS.has(tok)) return tok;
  }
  return null;
}

export function decideBucketForMatch(c: ClassifiedCandidate, match: MatchResult): ClassifiedItem {
  // Si el match fue por URL exacta o el publisher del título matchea con el
  // medio de la fuenteUrl, el candidato ES la misma noticia ya enlazada en
  // el repo (la única razón por la que llega como "candidato" es porque el
  // scrape la re-detectó en otra fuente o vía Google News rss). Aunque el
  // título contenga keywords como 'publica' / 'lanza' / 'implementa', no
  // hay update real — es la pieza original re-detectada. Lo marcamos
  // ya_existe sin pasar por hasCambioEstado.
  if (match.byUrl || match.bySamePublisher) {
    return {
      bucket: 'ya_existe',
      reason: match.reason,
      matched_type: match.type,
      matched_id: match.id,
      candidate: c,
      institucionId: resolveInstitucionId(c),
    };
  }

  const cambio = hasCambioEstado(c);
  if (cambio) {
    return {
      bucket: 'revisar',
      reason: `${match.reason}. Trigger update: '${cambio}'`,
      matched_type: match.type,
      matched_id: match.id,
      candidate: c,
      institucionId: resolveInstitucionId(c),
    };
  }
  return {
    bucket: 'ya_existe',
    reason: match.reason,
    matched_type: match.type,
    matched_id: match.id,
    candidate: c,
    institucionId: resolveInstitucionId(c),
  };
}

export function classifyOne(
  c: ClassifiedCandidate,
  proyectos: Proyecto[],
  recursos: RecursoItem[],
  articulos: ArticuloItem[],
  ledger: Ledger = { decisions: [] },
): ClassifiedItem {
  const cls = c.classification;
  const institucionId = resolveInstitucionId(c);

  // 0. Memoria de decisiones ENTRE corridas: si este item ya se descartó (NO)
  //    en un scrape-review previo, no vuelve a molestar al analista ni a Mario.
  //    Corre PRIMERO (antes que ruido/score) para cortar el ciclo lo antes
  //    posible. Solo suprime decisiones 'rejected'; las 'catalogued'/'updated'
  //    ya caen en ya_existe por URL y se dejan seguir el flujo normal.
  const decided = matchDecision(c.candidate, ledger);
  if (decided && decided.decision === 'rejected') {
    return {
      bucket: 'ya_decidido',
      reason: `ya descartado el ${decided.date}${decided.issue ? ` (issue #${decided.issue})` : ''}${decided.note ? `: ${decided.note}` : ''}`,
      candidate: c,
      institucionId,
    };
  }

  // 1. tipo ruido del LLM.
  if (cls?.tipo === 'ruido') {
    return { bucket: 'ruido', reason: 'LLM clasificó tipo=ruido', candidate: c, institucionId };
  }

  // 2. Score bajo.
  const score = cls?.score ?? 0;
  if (score < 5) {
    return { bucket: 'ruido', reason: `score ${score} < 5`, candidate: c, institucionId };
  }

  // 3. URL exacta contra proyectos.
  const projUrlMatch = proyectos.find((p) => p.fuenteUrl && p.fuenteUrl === c.candidate.url);
  if (projUrlMatch) {
    return decideBucketForMatch(c, {
      type: 'proyecto',
      id: projUrlMatch.id,
      reason: `URL exacta matchea fuenteUrl de proyecto '${projUrlMatch.id}'`,
      byUrl: true,
    });
  }

  // 3b. URL exacta contra recursos.
  const recUrlMatch = recursos.find((r) => r.url === c.candidate.url);
  if (recUrlMatch) {
    return decideBucketForMatch(c, {
      type: 'recurso',
      id: recUrlMatch.id,
      reason: `URL exacta matchea recurso '${recUrlMatch.id}'`,
      byUrl: true,
    });
  }

  // 4. Fuente sin institución pública mapeada y sin hint útil en el título.
  if (!institucionId && SOURCES_NO_INSTITUCIONALES.has(c.source)) {
    return {
      bucket: 'ruido',
      reason: `source '${c.source}' no mapea a institución pública y sin hint en el título`,
      candidate: c,
      institucionId,
    };
  }

  // 5. Token overlap contra proyectos (filtrado por institución).
  const candidateTokens = tokenize(
    `${c.candidate.titulo} ${cls?.resumen ?? ''} ${cls?.tags?.join(' ') ?? ''}`,
  );
  if (institucionId) {
    let bestProyecto: Proyecto | null = null;
    let bestProyectoOverlap = 0;
    for (const p of proyectos) {
      if (p.institucionId !== institucionId) continue;
      const projTokens = tokenize(`${p.titulo.es} ${p.descripcion.es} ${p.contexto?.es ?? ''}`);
      const overlap = weightedOverlap(candidateTokens, projTokens);
      if (overlap > bestProyectoOverlap) {
        bestProyectoOverlap = overlap;
        bestProyecto = p;
      }
    }
    if (bestProyecto && bestProyectoOverlap >= 4) {
      // Si la URL del candidato es google-news rss (encriptada), no podemos
      // comparar contra fuenteUrl directo. Pero el publisher del prefijo del
      // título (ej. `[ccss · tec.ac.cr]`) suele ser el hostname del medio
      // que apunta el rss → comparable con el hostname de fuenteUrl.
      const publisher = extractTituloPublisher(c.candidate.titulo);
      const samePublisher =
        publisher !== null &&
        bestProyecto.fuenteUrl !== '' &&
        publisherMatchesFuenteUrl(publisher, bestProyecto.fuenteUrl);
      return decideBucketForMatch(c, {
        type: 'proyecto',
        id: bestProyecto.id,
        reason: samePublisher
          ? `overlap ponderado ${bestProyectoOverlap} con proyecto '${bestProyecto.id}' y publisher '${publisher}' coincide con fuenteUrl`
          : `overlap ponderado ${bestProyectoOverlap} con proyecto '${bestProyecto.id}'`,
        bySamePublisher: samePublisher,
      });
    }
  }

  // 6. Token overlap contra recursos y artículos (sin filtrar por institución
  // porque recursos pueden ser intersectoriales, ej. ENIA = MICITT + intersect).
  let bestRecurso: RecursoItem | null = null;
  let bestRecursoOverlap = 0;
  for (const r of recursos) {
    const rTokens = tokenize(`${r.titulo} ${r.fuente} ${r.tipo}`);
    const overlap = weightedOverlap(candidateTokens, rTokens);
    if (overlap > bestRecursoOverlap) {
      bestRecursoOverlap = overlap;
      bestRecurso = r;
    }
  }
  // Threshold más bajo (3) para recursos porque son entries de pocas palabras
  // (titulo + fuente + tipo) y un overlap de 4 sería prácticamente imposible.
  if (bestRecurso && bestRecursoOverlap >= 3) {
    return decideBucketForMatch(c, {
      type: 'recurso',
      id: bestRecurso.id,
      reason: `overlap ponderado ${bestRecursoOverlap} con recurso '${bestRecurso.id}'`,
    });
  }

  let bestArticulo: ArticuloItem | null = null;
  let bestArticuloOverlap = 0;
  for (const a of articulos) {
    const aTokens = tokenize(`${a.titulo} ${a.description}`);
    const overlap = weightedOverlap(candidateTokens, aTokens);
    if (overlap > bestArticuloOverlap) {
      bestArticuloOverlap = overlap;
      bestArticulo = a;
    }
  }
  if (bestArticulo && bestArticuloOverlap >= 4) {
    return decideBucketForMatch(c, {
      type: 'articulo',
      id: bestArticulo.id,
      reason: `overlap ponderado ${bestArticuloOverlap} con artículo '${bestArticulo.id}'`,
    });
  }

  // 7. Sobreviviente: candidato a NUEVO.
  return {
    bucket: 'nuevo',
    reason: institucionId
      ? `score ${score}, institución '${institucionId}' conocida, sin match en repo`
      : `score ${score}, institución no mapeada pero score relevante — requiere revisión humana`,
    candidate: c,
    institucionId,
  };
}

const INSTITUCION_TO_CATEGORIA: Record<string, string> = {
  'poder-judicial': 'judicial',
  ccss: 'salud',
  hacienda: 'fiscal',
  mep: 'educacion',
  micitt: 'infraestructura',
  ucr: 'educacion',
  cenat: 'infraestructura',
};

function slugify(s: string): string {
  return normalize(s).split(/\s+/).slice(0, 6).join('-').slice(0, 60) || 'sin-titulo';
}

function buildStub(item: ClassifiedItem): Partial<Proyecto> {
  const c = item.candidate;
  const inst = item.institucionId ?? 'TODO';
  const id = `${inst.replace('poder-judicial', 'pj')}-${slugify(c.candidate.titulo)}`;
  const categoria = inst === 'TODO' ? 'TODO_categoria' : (INSTITUCION_TO_CATEGORIA[inst] ?? 'TODO_categoria');
  return {
    id,
    titulo: { es: c.candidate.titulo, en: 'TODO_translate_en' },
    institucionId: inst,
    categoria,
    estado: 'planificado',
    desde: new Date().toISOString().slice(0, 4),
    descripcion: {
      es: c.classification?.resumen ?? 'TODO_descripcion_es',
      en: 'TODO_translate_en',
    },
    fuenteUrl: c.candidate.url,
  };
}

// Parsers tolerantes para Recursos.tsx y translations.ts de artículos. Estos
// archivos son TypeScript "casi declarativo": un array literal con objetos.
// Usamos regex en vez de parser TS completo para evitar dependencias nuevas.
function loadRecursos(): RecursoItem[] {
  if (!existsSync(RECURSOS_PATH)) return [];
  const src = readFileSync(RECURSOS_PATH, 'utf8');
  const items: RecursoItem[] = [];
  // Cada bloque {titulo:{es:'...',en:'...'},fuente:'...',url:'...',tipo:{es:'...',en:'...'}}.
  // Permitimos comas trailing y saltos de línea entre campos.
  const blockRe = /\{\s*titulo:\s*\{\s*es:\s*'([^']+)',\s*en:\s*'([^']+)',?\s*\},\s*fuente:\s*'([^']+)',\s*url:\s*'([^']+)',\s*tipo:\s*\{\s*es:\s*'([^']+)',\s*en:\s*'([^']+)',?\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(src)) !== null) {
    const titulo = m[1];
    const fuente = m[3];
    const url = m[4];
    const tipo = m[5];
    items.push({
      id: slugify(titulo).slice(0, 50),
      titulo,
      url,
      fuente,
      tipo,
    });
  }
  return items;
}

function loadArticulos(): ArticuloItem[] {
  if (!existsSync(ANALISIS_DIR)) return [];
  const items: ArticuloItem[] = [];
  const subdirs = readdirSync(ANALISIS_DIR).filter((name) => {
    if (name.startsWith('_') || name.startsWith('.')) return false;
    try {
      return statSync(join(ANALISIS_DIR, name)).isDirectory();
    } catch {
      return false;
    }
  });
  for (const slug of subdirs) {
    const tPath = join(ANALISIS_DIR, slug, 'translations.ts');
    if (!existsSync(tPath)) continue;
    const src = readFileSync(tPath, 'utf8');
    // Extraer meta.title y meta.description del bloque es: { meta: { ... } }.
    // El archivo tiene `meta: { ..., title: '...', description: '...', ...}`.
    // No es perfecto pero captura los artículos actuales.
    const esMetaMatch = /es:\s*\{[\s\S]*?meta:\s*\{([\s\S]*?)\},/i.exec(src);
    let titulo = slug;
    let description = '';
    if (esMetaMatch) {
      const metaBlock = esMetaMatch[1];
      const titleMatch = /title:\s*'([^']+)'/.exec(metaBlock);
      const descMatch = /description:\s*'([^']+)'/.exec(metaBlock);
      if (titleMatch) titulo = titleMatch[1];
      if (descMatch) description = descMatch[1];
    }
    items.push({ id: slug, titulo, description });
  }
  return items;
}

function main(): void {
  if (!existsSync(REPORT_PATH)) {
    console.error(`classify-vs-repo: no existe ${REPORT_PATH}, skip.`);
    return;
  }
  if (!existsSync(PROYECTOS_PATH)) {
    console.error(`classify-vs-repo: no existe ${PROYECTOS_PATH}, skip.`);
    process.exit(1);
  }

  const report = JSON.parse(readFileSync(REPORT_PATH, 'utf8')) as Consolidated;
  const proyectos = JSON.parse(readFileSync(PROYECTOS_PATH, 'utf8')) as Proyecto[];
  const recursos = loadRecursos();
  const articulos = loadArticulos();
  const ledger = loadLedger();

  console.log(
    `classify-vs-repo: ${report.classifiedCandidates.length} candidatos vs ${proyectos.length} proyectos + ${recursos.length} recursos + ${articulos.length} artículos · ${ledger.decisions.length} decisiones en memoria`,
  );

  // Dedupe candidatos por URL antes de clasificar (3 fuentes de la misma
  // historia no necesitan 3 entries en el reporte). Conservamos el de mayor
  // score como representante.
  const byUrl = new Map<string, ClassifiedCandidate>();
  for (const c of report.classifiedCandidates) {
    const key = c.candidate.url || `${c.source}::${c.candidate.titulo}`;
    const prev = byUrl.get(key);
    const score = c.classification?.score ?? 0;
    const prevScore = prev?.classification?.score ?? 0;
    if (!prev || score > prevScore) byUrl.set(key, c);
  }
  const deduped = [...byUrl.values()];

  const classified = deduped.map((c) => classifyOne(c, proyectos, recursos, articulos, ledger));

  const ya_existe = classified.filter((x) => x.bucket === 'ya_existe');
  const ruido = classified.filter((x) => x.bucket === 'ruido');
  const nuevos = classified.filter((x) => x.bucket === 'nuevo');
  const revisar = classified.filter((x) => x.bucket === 'revisar');
  // ya_decidido: items descartados en corridas previas (memoria del ledger). NO
  // entran al scrape-review issue ni al analista — el punto de la mejora.
  const ya_decidido = classified.filter((x) => x.bucket === 'ya_decidido');
  if (ya_decidido.length > 0) {
    console.log(
      `classify-vs-repo: ${ya_decidido.length} candidato(s) suprimido(s) por memoria de decisiones (ya descartados antes):`,
    );
    for (const x of ya_decidido) {
      console.log(`  · ${x.candidate.candidate.titulo?.slice(0, 70)} — ${x.reason}`);
    }
  }

  const serializeItem = (x: ClassifiedItem) => ({
    titulo: x.candidate.candidate.titulo,
    url: x.candidate.candidate.url,
    source: x.candidate.source,
    score: x.candidate.classification?.score ?? null,
    matched_type: x.matched_type ?? null,
    matched_id: x.matched_id ?? null,
    reason: x.reason,
  });

  const output = {
    classifiedAt: new Date().toISOString(),
    sourceRanAt: report.ranAt,
    totalDeduped: deduped.length,
    totalRaw: report.classifiedCandidates.length,
    counts: {
      ya_existe: ya_existe.length,
      ruido: ruido.length,
      nuevos: nuevos.length,
      revisar: revisar.length,
      ya_decidido: ya_decidido.length,
    },
    ya_existe: ya_existe.map(serializeItem),
    revisar: revisar.map(serializeItem),
    ya_decidido: ya_decidido.map(serializeItem),
    ruido: ruido.map((x) => ({
      titulo: x.candidate.candidate.titulo,
      url: x.candidate.candidate.url,
      source: x.candidate.source,
      score: x.candidate.classification?.score ?? null,
      reason: x.reason,
    })),
    nuevos: nuevos.map((x) => ({
      titulo: x.candidate.candidate.titulo,
      url: x.candidate.candidate.url,
      source: x.candidate.source,
      institucionId: x.institucionId,
      score: x.candidate.classification?.score ?? null,
      resumen: x.candidate.classification?.resumen ?? null,
      tags: x.candidate.classification?.tags ?? [],
      reason: x.reason,
    })),
  };

  writeFileSync(CLASSIFICATION_OUT, JSON.stringify(output, null, 2) + '\n');
  console.log(
    `classify-vs-repo: ${nuevos.length} nuevos, ${revisar.length} a revisar, ${ya_existe.length} ya existen, ${ruido.length} ruido, ${ya_decidido.length} ya decididos (suprimidos) → ${CLASSIFICATION_OUT}`,
  );

  if (nuevos.length > 0) {
    const stubs = nuevos.map((x) => buildStub(x));
    writeFileSync(STUB_OUT, JSON.stringify(stubs, null, 2) + '\n');
    console.log(`classify-vs-repo: stub-nuevos.json escrito con ${stubs.length} esqueletos`);
  }
}

// Solo ejecutar main() cuando se invoca el script directamente (no al
// importarlo desde tests).
const isDirectInvocation =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectInvocation) {
  main();
}
