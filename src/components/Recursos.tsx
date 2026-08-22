import type { Bilingual, Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

interface Recurso {
  titulo: Bilingual;
  fuente: string;
  url: string;
  tipo: Bilingual;
  /** Narrativa breve para contexto (evolución, datos clave, comparación entre ediciones). Renderizada bajo la fuente cuando existe. */
  nota?: Bilingual;
}

const recursos: Recurso[] = [
  {
    titulo: {
      es: 'Decreto 44507-MICITT — Código Nacional de Tecnologías Digitales',
      en: 'Decree 44507-MICITT — National Code of Digital Technologies',
    },
    fuente: 'PGR-SCIJ',
    url: 'https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?nValor1=1&nValor2=102229&nValor3=141218&param1=NRTC&strTipM=TC',
    tipo: { es: 'Marco normativo', en: 'Regulatory framework' },
  },
  {
    titulo: {
      es: 'CNTD vigente — Capítulos I al XIX',
      en: 'Current CNTD — Chapters I through XIX',
    },
    fuente: 'MICITT',
    url: 'https://www.micitt.go.cr/node/625',
    tipo: { es: 'Marco normativo', en: 'Regulatory framework' },
  },
  {
    titulo: {
      es: 'Estrategia Nacional de IA (ENIA) 2024-2027',
      en: 'National AI Strategy (ENIA) 2024-2027',
    },
    fuente: 'MICITT',
    url: 'https://www.micitt.go.cr/el-sector-informa/micitt-presento-estrategia-nacional-de-inteligencia-artificial-enia',
    tipo: { es: 'Política pública', en: 'Public policy' },
  },
  {
    titulo: {
      es: 'Diálogo Regional AI4LAC sobre Gobernanza de IA',
      en: 'AI4LAC Regional Dialogue on AI Governance',
    },
    fuente: 'MICITT / ONU Costa Rica / CEPAL',
    url: 'https://www.micitt.go.cr/el-sector-informa/costa-rica-lidera-dialogo-regional-sobre-inteligencia-artificial',
    tipo: { es: 'Hito regional / Gobernanza IA', en: 'Regional milestone / AI governance' },
    nota: {
      es: 'Costa Rica lidera el proceso regional AI4LAC convocado en mayo 2026 por MICITT, ONU Costa Rica y CEPAL para consolidar prioridades de gobernanza de IA de América Latina y el Caribe rumbo al Diálogo Global de IA en Suiza.',
      en: 'Costa Rica leads the AI4LAC regional process convened in May 2026 by MICITT, UN Costa Rica and ECLAC to consolidate Latin American and Caribbean AI governance priorities ahead of the Global AI Dialogue in Switzerland.',
    },
  },
  {
    titulo: {
      es: 'AILA: Evaluación del Panorama de la Inteligencia Artificial',
      en: 'AILA: Artificial Intelligence Landscape Assessment',
    },
    fuente: 'PNUD / MICITT',
    url: 'https://www.undp.org/es/costa-rica/comunicados-de-prensa/costa-rica-inicia-evaluacion-nacional-en-inteligencia-artificial-para-impulsar-su-transformacion-digital-0',
    tipo: { es: 'Evaluación diagnóstica', en: 'Diagnostic assessment' },
  },
  {
    titulo: {
      es: 'DisruptIA 2026: Decisión empresarial aumentada con IA',
      en: 'DisruptIA 2026: AI-Augmented Business Decision Making',
    },
    fuente: 'MICITT / INA',
    url: 'https://www.innovar.pro',
    tipo: { es: 'Programa de formación', en: 'Training program' },
  },
  {
    titulo: {
      es: 'Lineamientos Básicos para el uso de IA Generativa en el Poder Judicial',
      en: 'Basic Guidelines for Generative AI use in the Judicial Branch',
    },
    fuente: 'Poder Judicial',
    url: 'https://transparencia.poder-judicial.go.cr/index.php/declaracion-de-uso-de-inteligencia-artificial',
    tipo: { es: 'Marco institucional', en: 'Institutional framework' },
  },
  {
    titulo: {
      es: 'Programa LIDIA — IA predictiva en salud',
      en: 'LIDIA Program — Predictive AI in healthcare',
    },
    fuente: 'CCSS / Teletica',
    url: 'https://www.teletica.com/salud/lidia-el-programa-de-inteligencia-artificial-que-crece-en-la-ccss-en-medio-de-un-dilema-etico_376322',
    tipo: { es: 'Cobertura', en: 'Coverage' },
  },
  {
    titulo: {
      es: 'Reglamento de Protección de Datos del Poder Judicial',
      en: 'Judicial Branch Data Protection Regulation',
    },
    fuente: 'Poder Judicial',
    url: 'https://cij.poder-judicial.go.cr/images/ProteccionDatos/REGLAMENTO_PROTECCIN_DE_DATOS-PODER_JUDICIAL.pdf',
    tipo: { es: 'Reglamento', en: 'Regulation' },
  },
  {
    titulo: {
      es: 'Índice Latinoamericano de IA (ILIA)',
      en: 'Latin American AI Index (ILIA)',
    },
    fuente: 'CEPAL',
    url: 'https://www.indicelatam.cl/',
    tipo: { es: 'Indicador regional', en: 'Regional indicator' },
  },
  {
    titulo: {
      es: 'Government AI Readiness Index (GTMI)',
      en: 'Government AI Readiness Index (GTMI)',
    },
    fuente: 'Banco Mundial',
    url: 'https://www.worldbank.org/en/programs/govtech/gtmi',
    tipo: { es: 'Indicador internacional', en: 'International indicator' },
  },
  {
    titulo: {
      es: 'Decreto 276/025 — Sandboxes regulatorios IA (Uruguay, dic. 2025)',
      en: 'Decree 276/025 — AI regulatory sandboxes (Uruguay, Dec. 2025)',
    },
    fuente: 'IMPO',
    url: 'https://www.impo.com.uy/bases/decretos/276-2025',
    tipo: { es: 'Gobernanza regional', en: 'Regional governance' },
  },
  {
    titulo: {
      es: 'Decreto 276/025 — Comunicado oficial Presidencia (Uruguay)',
      en: 'Decree 276/025 — Official Presidency communication (Uruguay)',
    },
    fuente: 'Presidencia Uruguay',
    url: 'https://www.gub.uy/presidencia/institucional/normativa/decreto-n-276025-se-establece-esquema-gobernanza-para-creacion-gestion',
    tipo: { es: 'Gobernanza regional', en: 'Regional governance' },
  },
  {
    titulo: {
      es: 'Índice Latinoamericano de IA 2024 — Costa Rica',
      en: 'Latin American AI Index 2024 — Costa Rica',
    },
    fuente: 'CENIA Chile · UNESCO · CEPAL',
    url: 'https://indicelatam.cl/wp-content/uploads/2025/01/ILIA_2024_020125_compressed.pdf',
    tipo: { es: 'Benchmark regional', en: 'Regional benchmark' },
    nota: {
      es: 'CR 4° lugar en infraestructura (53,09 pts), tras Chile (67,19), Uruguay (65,27) y Brasil (59,65). Cómputo: 40,02 · HPC: 2,35. En ILIA 2025 CR subió a 53,83 puntos pero bajó al 5° lugar — el score absoluto creció mientras otros países (México) aceleraron más.',
      en: 'CR 4th in infrastructure (53.09 pts), behind Chile (67.19), Uruguay (65.27) and Brazil (59.65). Compute: 40.02 · HPC: 2.35. In ILIA 2025 CR rose to 53.83 points but dropped to 5th — absolute score grew while other countries (Mexico) accelerated faster.',
    },
  },
];

export function Recursos({
  locale,
  t,
  headingLevel = 'h2',
}: {
  locale: Locale;
  t: Dictionary;
  headingLevel?: 'h1' | 'h2';
}) {
  const Heading = headingLevel;

  return (
    <section id="recursos" className={headingLevel === 'h1' ? 'bg-white' : 'border-y border-editorial-rule bg-editorial-paper/55'}>
      <div className={`max-w-7xl mx-auto px-6 ${headingLevel === 'h1' ? 'pb-20 pt-10' : 'py-20'}`}>
        <header className="border-b border-editorial-rule pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
            {t.recursos.kicker}
          </p>
          <Heading className="mt-3 max-w-4xl font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
            {t.recursos.titulo}
          </Heading>
        </header>
        <ol className="border-b border-editorial-rule">
          {recursos.map((r, index) => (
            <li key={r.url} className="border-b border-editorial-rule last:border-b-0">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-3 py-6 transition-colors hover:bg-editorial-paper/55 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:gap-5 sm:px-3"
              >
                <span className="font-mono text-xs tabular-nums text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                    <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      {r.tipo[locale]}
                    </span>
                    <span className="mt-2 block max-w-3xl font-editorial text-xl font-semibold leading-snug text-editorial-ink group-hover:text-institucional-800 sm:text-2xl">
                      {r.titulo[locale]}
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">{r.fuente}</span>
                    {r.nota && (
                      <span className="mt-3 block max-w-4xl text-xs leading-relaxed text-slate-600">
                        {r.nota[locale]}
                      </span>
                    )}
                </span>
                <span className="self-end whitespace-nowrap border-b border-institucional-700 pb-0.5 text-xs font-semibold text-institucional-700">
                  {t.recursos.abrir}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
