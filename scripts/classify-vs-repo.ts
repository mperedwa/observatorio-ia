/**
 * Clasifica cada candidato del último scrape contra los proyectos del repo.
 *
 * Entrada: `scraper-runs/last-run.json` (producido por scrapers/run-all.ts)
 *          `src/data/json/proyectos.json` (inventario actual)
 * Salida:  `scraper-runs/classification.json` con buckets ya_existe / ruido / nuevos
 *          `scraper-runs/stub-nuevos.json` (solo si nuevos.length > 0) con un
 *          esqueleto de proyecto listo para mergear tras revisión humana.
 *
 * El job en .github/workflows/scrape.yml corre este script después del scrape
 * principal. notify-classification-telegram.ts lee la salida y notifica.
 *
 * Reglas de clasificación (en orden, primer match gana):
 *   1. classification.tipo === 'ruido'                                     -> RUIDO
 *   2. URL exacta de candidato matchea fuenteUrl de algún proyecto         -> YA_EXISTE
 *   3. institución del candidato no es institución pública mapeada
 *      (camtic, mideplan, cgr, delfino sin hint público en el título)      -> RUIDO
 *   4. institución conocida + ≥2 tokens fuertes compartidos con algún
 *      proyecto de esa institución                                          -> YA_EXISTE
 *   5. classification.score < 5                                             -> RUIDO
 *   6. de lo contrario                                                      -> NUEVO
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const REPORT_PATH = join(ROOT, 'scraper-runs', 'last-run.json');
const PROYECTOS_PATH = join(ROOT, 'src', 'data', 'json', 'proyectos.json');
const CLASSIFICATION_OUT = join(ROOT, 'scraper-runs', 'classification.json');
const STUB_OUT = join(ROOT, 'scraper-runs', 'stub-nuevos.json');

type Bilingual = { es: string; en: string };

interface Proyecto {
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

interface Classification {
  score: number;
  tipo: string;
  resumen: string;
  tags: string[];
  modelo?: string;
}

interface ClassifiedCandidate {
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

function tokenize(s: string): Set<string> {
  const out = new Set<string>();
  for (const tok of normalize(s).split(/\s+/)) {
    if (STOPWORDS.has(tok)) continue;
    if (tok.length >= 4) {
      out.add(tok);
    } else if (tok.length >= 3 && SHORT_TOKEN_WHITELIST.has(tok)) {
      out.add(tok);
    }
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

function extractTituloHint(titulo: string): string | null {
  const m = HINT_PREFIX.exec(titulo);
  return m ? m[1] : null;
}

function resolveInstitucionId(c: ClassifiedCandidate): string | null {
  // 1. Hint en el título (`[ccss · teletica.com] ...`) tiene prioridad sobre source.
  const hint = extractTituloHint(c.candidate.titulo);
  if (hint && SOURCE_TO_INSTITUCION[hint]) return SOURCE_TO_INSTITUCION[hint];
  // 2. Mapeo directo del source.
  if (SOURCE_TO_INSTITUCION[c.source]) return SOURCE_TO_INSTITUCION[c.source];
  return null;
}

type Bucket = 'ya_existe' | 'ruido' | 'nuevo';

interface ClassifiedItem {
  bucket: Bucket;
  reason: string;
  matched_proyecto_id?: string;
  candidate: ClassifiedCandidate;
  institucionId: string | null;
}

function classifyOne(c: ClassifiedCandidate, proyectos: Proyecto[]): ClassifiedItem {
  const cls = c.classification;
  const institucionId = resolveInstitucionId(c);

  // 1. tipo ruido del LLM.
  if (cls?.tipo === 'ruido') {
    return { bucket: 'ruido', reason: 'LLM clasificó tipo=ruido', candidate: c, institucionId };
  }

  // 2. Score bajo: aunque la URL o tokens coincidan con algo del repo, el LLM
  // ya nos dijo que no es relevante. Filtrar antes de cualquier match evita
  // que charlas/eventos secundarios "confirmen" un proyecto existente solo
  // por compartir institución.
  const score = cls?.score ?? 0;
  if (score < 5) {
    return { bucket: 'ruido', reason: `score ${score} < 5`, candidate: c, institucionId };
  }

  // 3. URL exacta contra fuenteUrl.
  const exactMatch = proyectos.find((p) => p.fuenteUrl && p.fuenteUrl === c.candidate.url);
  if (exactMatch) {
    return {
      bucket: 'ya_existe',
      reason: `URL exacta matchea fuenteUrl de '${exactMatch.id}'`,
      matched_proyecto_id: exactMatch.id,
      candidate: c,
      institucionId,
    };
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

  // 4. Token overlap contra proyectos de la misma institución.
  if (institucionId) {
    const candidateTokens = tokenize(
      `${c.candidate.titulo} ${cls?.resumen ?? ''} ${cls?.tags?.join(' ') ?? ''}`,
    );
    let bestMatch: Proyecto | null = null;
    let bestOverlap = 0;
    for (const p of proyectos) {
      if (p.institucionId !== institucionId) continue;
      const projTokens = tokenize(`${p.titulo.es} ${p.descripcion.es} ${p.contexto?.es ?? ''}`);
      const overlap = weightedOverlap(candidateTokens, projTokens);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestMatch = p;
      }
    }
    if (bestMatch && bestOverlap >= 4) {
      return {
        bucket: 'ya_existe',
        reason: `overlap ponderado ${bestOverlap} con '${bestMatch.id}' (misma institución)`,
        matched_proyecto_id: bestMatch.id,
        candidate: c,
        institucionId,
      };
    }
  }

  // 6. Sobreviviente: candidato a NUEVO.
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

  console.log(
    `classify-vs-repo: ${report.classifiedCandidates.length} candidatos vs ${proyectos.length} proyectos del repo`,
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

  const classified = deduped.map((c) => classifyOne(c, proyectos));

  const ya_existe = classified.filter((x) => x.bucket === 'ya_existe');
  const ruido = classified.filter((x) => x.bucket === 'ruido');
  const nuevos = classified.filter((x) => x.bucket === 'nuevo');

  const output = {
    classifiedAt: new Date().toISOString(),
    sourceRanAt: report.ranAt,
    totalDeduped: deduped.length,
    totalRaw: report.classifiedCandidates.length,
    counts: {
      ya_existe: ya_existe.length,
      ruido: ruido.length,
      nuevos: nuevos.length,
    },
    ya_existe: ya_existe.map((x) => ({
      titulo: x.candidate.candidate.titulo,
      url: x.candidate.candidate.url,
      source: x.candidate.source,
      score: x.candidate.classification?.score ?? null,
      matched_proyecto_id: x.matched_proyecto_id,
      reason: x.reason,
    })),
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
    `classify-vs-repo: ${nuevos.length} nuevos, ${ya_existe.length} ya existen, ${ruido.length} ruido → ${CLASSIFICATION_OUT}`,
  );

  if (nuevos.length > 0) {
    const stubs = nuevos.map((x) => buildStub(x));
    writeFileSync(STUB_OUT, JSON.stringify(stubs, null, 2) + '\n');
    console.log(`classify-vs-repo: stub-nuevos.json escrito con ${stubs.length} esqueletos`);
  }
}

main();
