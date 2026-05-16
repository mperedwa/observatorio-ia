import type { Bilingual, Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

interface Recurso {
  titulo: Bilingual;
  fuente: string;
  url: string;
  tipo: Bilingual;
}

const recursos: Recurso[] = [
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
];

export function Recursos({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section id="recursos" className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {t.recursos.kicker}
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            {t.recursos.titulo}
          </h2>
        </header>
        <ul className="divide-y divide-slate-200 bg-white border border-slate-200 rounded-lg">
          {recursos.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {r.tipo[locale]}
                    </p>
                    <p className="mt-1 font-medium text-slate-900">{r.titulo[locale]}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{r.fuente}</p>
                  </div>
                  <span className="text-institucional-700 text-sm whitespace-nowrap">
                    {t.recursos.abrir}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
