/**
 * Tests del classify-vs-repo: cubren los buckets que produce classifyOne()
 * para cada caso del flujo de clasificación. Cualquier regresión que afecte
 * el digest del scrape semanal debería disparar al menos uno de estos.
 *
 * Fixtures inline (no JSON externo) — el objetivo es documentar el
 * comportamiento esperado, no ejercitar el filesystem.
 */
import { describe, it, expect } from 'vitest';
import {
  classifyOne,
  hasCambioEstado,
  type ClassifiedCandidate,
  type Proyecto,
  type RecursoItem,
  type ArticuloItem,
} from '../scripts/classify-vs-repo';

// ---------- helpers ----------

function candidate(opts: {
  source: string;
  titulo: string;
  url: string;
  score?: number;
  tipo?: string;
  resumen?: string;
}): ClassifiedCandidate {
  return {
    source: opts.source,
    candidate: { titulo: opts.titulo, url: opts.url },
    classification: {
      score: opts.score ?? 7,
      tipo: opts.tipo ?? 'proyecto-existente',
      resumen: opts.resumen ?? '',
      tags: [],
    },
  };
}

function proyecto(opts: {
  id: string;
  institucionId: string;
  titulo: string;
  descripcion: string;
  fuenteUrl: string;
}): Proyecto {
  return {
    id: opts.id,
    titulo: { es: opts.titulo, en: opts.titulo },
    institucionId: opts.institucionId,
    categoria: 'salud',
    estado: 'operativo',
    descripcion: { es: opts.descripcion, en: opts.descripcion },
    fuenteUrl: opts.fuenteUrl,
  };
}

const NO_RECURSOS: RecursoItem[] = [];
const NO_ARTICULOS: ArticuloItem[] = [];

// ---------- tests ----------

describe('classifyOne', () => {
  it('A. match por URL exacta + keyword "publica" → ya_existe (no revisar)', () => {
    // Regresión del falso positivo del 3-jun-2026: la URL del candidato es la
    // misma fuenteUrl del proyecto; el título contiene "publica" pero NO es un
    // update real porque es la pieza original re-detectada.
    const proyectos = [proyecto({
      id: 'ccss-tec-formacion',
      institucionId: 'ccss',
      titulo: 'Programa TEC-CCSS de formación en IA médica',
      descripcion: 'Curso de 8 semanas para personal médico, TI y administrativo.',
      fuenteUrl: 'https://www.tec.ac.cr/hoyeneltec/2025/12/15/tec-ccss-impulsan-uso-inteligencia-artificial-resolver-retos-salud-publica',
    })];
    const c = candidate({
      source: 'google-news',
      titulo: '[ccss · tec.ac.cr] TEC y CCSS publica investigación IA salud pública',
      url: 'https://www.tec.ac.cr/hoyeneltec/2025/12/15/tec-ccss-impulsan-uso-inteligencia-artificial-resolver-retos-salud-publica',
      score: 7,
    });

    const result = classifyOne(c, proyectos, NO_RECURSOS, NO_ARTICULOS);

    expect(result.bucket).toBe('ya_existe');
    expect(result.matched_type).toBe('proyecto');
    expect(result.matched_id).toBe('ccss-tec-formacion');
    expect(result.reason).not.toMatch(/Trigger update/);
  });

  it('B. match por URL exacta + título sin keyword → ya_existe', () => {
    const proyectos = [proyecto({
      id: 'proj-x',
      institucionId: 'micitt',
      titulo: 'Proyecto X',
      descripcion: 'descripción del proyecto',
      fuenteUrl: 'https://example.org/proj-x',
    })];
    const c = candidate({
      source: 'micitt',
      titulo: 'Noticia sobre proyecto X',
      url: 'https://example.org/proj-x',
      score: 6,
    });

    const result = classifyOne(c, proyectos, NO_RECURSOS, NO_ARTICULOS);

    expect(result.bucket).toBe('ya_existe');
    expect(result.matched_id).toBe('proj-x');
  });

  it('C. match por overlap de tokens + keyword "lanza" → revisar', () => {
    // URL diferente, mismo proyecto (matchea por tokens). Como la noticia es
    // distinta a la fuente original y trae "lanza", el classifier la marca
    // para revisión humana.
    const proyectos = [proyecto({
      id: 'aila',
      institucionId: 'micitt',
      titulo: 'AILA Evaluación Nacional de IA',
      descripcion: 'Programa AILA del MICITT en alianza con PNUD para evaluación nacional de inteligencia artificial',
      fuenteUrl: 'https://example.org/aila-original',
    })];
    const c = candidate({
      source: 'micitt',
      titulo: 'MICITT lanza nueva fase del programa AILA evaluación nacional inteligencia artificial PNUD',
      url: 'https://example.org/distinta-nota-pero-mismo-tema',
      score: 7,
      resumen: 'AILA PNUD MICITT evaluación nacional inteligencia artificial',
    });

    const result = classifyOne(c, proyectos, NO_RECURSOS, NO_ARTICULOS);

    expect(result.bucket).toBe('revisar');
    expect(result.matched_id).toBe('aila');
    expect(result.reason).toMatch(/Trigger update: 'lanza'/);
  });

  it('D. match por overlap de tokens + título sin keyword → ya_existe', () => {
    const proyectos = [proyecto({
      id: 'aila',
      institucionId: 'micitt',
      titulo: 'AILA Programa Nacional de IA',
      descripcion: 'Programa AILA del MICITT en alianza con PNUD para diagnóstico nacional de inteligencia artificial',
      fuenteUrl: 'https://example.org/aila-original',
    })];
    const c = candidate({
      source: 'micitt',
      titulo: 'Reportaje sobre programa AILA diagnóstico nacional inteligencia artificial PNUD MICITT',
      url: 'https://example.org/otra-nota',
      score: 7,
      resumen: 'AILA PNUD MICITT diagnóstico nacional',
    });

    const result = classifyOne(c, proyectos, NO_RECURSOS, NO_ARTICULOS);

    expect(result.bucket).toBe('ya_existe');
    expect(result.matched_id).toBe('aila');
  });

  it('E. score < 5 → ruido', () => {
    const c = candidate({
      source: 'micitt',
      titulo: 'Cualquier título',
      url: 'https://example.org/cualquiera',
      score: 3,
    });

    const result = classifyOne(c, [], NO_RECURSOS, NO_ARTICULOS);

    expect(result.bucket).toBe('ruido');
    expect(result.reason).toMatch(/score 3/);
  });

  it('F. score ≥ 7, institución conocida, sin match → nuevo', () => {
    const c = candidate({
      source: 'micitt',
      titulo: 'Hacienda anuncia despliegue de IA para fiscalización 2027 — proyecto inédito',
      url: 'https://example.org/proyecto-nuevo',
      score: 8,
    });

    const result = classifyOne(c, [], NO_RECURSOS, NO_ARTICULOS);

    expect(result.bucket).toBe('nuevo');
    expect(result.institucionId).toBe('micitt');
  });

  it('G. fuente no institucional (camtic) sin hint en título → ruido', () => {
    // camtic está en SOURCES_NO_INSTITUCIONALES. Sin un prefijo de hint
    // tipo [ccss · ...] en el título, no hay institución mapeable → ruido.
    const c = candidate({
      source: 'camtic',
      titulo: 'Universidad XYZ desarrolla algo genérico de tecnología',
      url: 'https://camtic.org/nota-x',
      score: 6,
    });

    const result = classifyOne(c, [], NO_RECURSOS, NO_ARTICULOS);

    expect(result.bucket).toBe('ruido');
    expect(result.reason).toMatch(/no mapea a institución pública/);
  });

  it('I. URL google-news rss + publisher en prefijo del título coincide con fuenteUrl → ya_existe (no revisar por keyword)', () => {
    // Regresión del scrape 5-jun-2026: la URL del candidato viene como
    // news.google.com/rss/articles/CBMi... (encriptada), pero el prefijo
    // del título trae "[ccss · tec.ac.cr]" y el proyecto tiene fuenteUrl
    // en www.tec.ac.cr. Match por publisher debe colapsar el candidato a
    // ya_existe aunque el título traiga 'implementa' o 'publica'.
    const proyectos = [proyecto({
      id: 'ccss-tec-formacion',
      institucionId: 'ccss',
      titulo: 'Programa TEC-CCSS de formación en IA médica',
      descripcion: 'Curso de 8 semanas para personal médico, TI y administrativo',
      fuenteUrl: 'https://www.tec.ac.cr/hoyeneltec/2025/12/15/tec-ccss-impulsan-uso-inteligencia-artificial-resolver-retos-salud-publica',
    })];
    const c = candidate({
      source: 'google-news',
      titulo: '[ccss · tec.ac.cr] TEC y CCSS publica investigación IA salud pública',
      url: 'https://news.google.com/rss/articles/CBMiabc123_url_encriptada_del_rss?oc=5',
      score: 5,
      resumen: 'TEC CCSS IA médica',
    });

    const result = classifyOne(c, proyectos, NO_RECURSOS, NO_ARTICULOS);

    expect(result.bucket).toBe('ya_existe');
    expect(result.matched_id).toBe('ccss-tec-formacion');
    expect(result.reason).toMatch(/publisher 'tec\.ac\.cr' coincide/);
  });

  it('J. URL google-news rss + publisher friendly (sin punto) → revisar normal (no fuerza ya_existe)', () => {
    // Caso del scrape: "[ccss · Teletica]" donde "Teletica" es nombre
    // friendly, no hostname. Sin punto en el publisher, no podemos
    // garantizar el match contra teletica.com — fallback al flujo
    // normal (revisar si hay keyword, ya_existe si no).
    const proyectos = [proyecto({
      id: 'ccss-depuracion-listas',
      institucionId: 'ccss',
      titulo: 'CCSS IA Depuración Listas',
      descripcion: 'Bot CCSS depura listas de espera con IA y EDUS',
      fuenteUrl: 'https://www.teletica.com/nacional/ccss-implementa-herramienta',
    })];
    const c = candidate({
      source: 'google-news',
      titulo: '[ccss · Teletica] CCSS implementa herramienta IA listas espera',
      url: 'https://news.google.com/rss/articles/CBMixyz789_otra_url_encriptada?oc=5',
      score: 8,
      resumen: 'CCSS IA listas depuración',
    });

    const result = classifyOne(c, proyectos, NO_RECURSOS, NO_ARTICULOS);

    // Cae a revisar por 'implementa' — no podemos colapsar publisher friendly.
    expect(result.bucket).toBe('revisar');
    expect(result.matched_id).toBe('ccss-depuracion-listas');
  });

  it('H. tipo "ruido" del LLM siempre gana sobre todo lo demás', () => {
    const proyectos = [proyecto({
      id: 'whatever',
      institucionId: 'micitt',
      titulo: 'whatever',
      descripcion: 'whatever',
      fuenteUrl: 'https://example.org/url',
    })];
    const c = candidate({
      source: 'micitt',
      titulo: 'Cualquier cosa',
      url: 'https://example.org/url', // match exacta de URL
      score: 9,                        // score alto
      tipo: 'ruido',                   // ...pero LLM dijo ruido
    });

    const result = classifyOne(c, proyectos, NO_RECURSOS, NO_ARTICULOS);

    expect(result.bucket).toBe('ruido');
    expect(result.reason).toBe('LLM clasificó tipo=ruido');
  });
});

describe('hasCambioEstado', () => {
  it('detecta palabra individual ("lanza")', () => {
    const c = candidate({
      source: 'micitt',
      titulo: 'MICITT lanza política IA',
      url: 'https://example.org/x',
    });
    expect(hasCambioEstado(c)).toBe('lanza');
  });

  it('detecta bigram ("primer debate")', () => {
    const c = candidate({
      source: 'asamblea',
      titulo: 'Expediente IA pasa primer debate',
      url: 'https://example.org/x',
    });
    expect(hasCambioEstado(c)).toBe('primer debate');
  });

  it('devuelve null cuando no hay keyword', () => {
    const c = candidate({
      source: 'micitt',
      titulo: 'Reportaje neutro sobre tecnología',
      url: 'https://example.org/x',
    });
    expect(hasCambioEstado(c)).toBeNull();
  });

  it('respeta tildes y normalización ("aprobación" → "aprobacion")', () => {
    const c = candidate({
      source: 'asamblea',
      titulo: 'Aprobación de ley IA',
      url: 'https://example.org/x',
    });
    expect(hasCambioEstado(c)).toBe('aprobacion');
  });
});
