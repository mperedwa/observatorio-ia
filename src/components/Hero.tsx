import { kpisHero } from '@/data/indicadores';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { CountUp } from './CountUp';

const KPI_KEYS = ['proyectos', 'instituciones', 'legislacion', 'ranking'] as const;

const KPI_ICONS: Record<(typeof KPI_KEYS)[number], JSX.Element> = {
  proyectos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  instituciones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M5 21V8l7-5 7 5v13" />
      <path d="M10 21v-6h4v6" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
    </svg>
  ),
  legislacion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  ),
  ranking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  ),
};

export function Hero({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section
      id="inicio"
      className="bg-gradient-to-b from-institucional-50 to-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          {t.hero.kicker}
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-slate-900 max-w-4xl leading-tight">
          {t.hero.headline}
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl text-pretty">{t.hero.sub}</p>
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {kpisHero.map((k, i) => {
            const key = KPI_KEYS[i];
            return (
              <div
                key={k.valor + k.label.es}
                className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white pl-5 pr-4 py-5 transition-all duration-200 hover:border-institucional-200 hover:bg-institucional-50/60 hover:shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-institucional-700 transition-colors group-hover:bg-institucional-800"
                />
                <div className="flex items-center gap-2 text-institucional-700">
                  {KPI_ICONS[key]}
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {t.hero.kpiCategoria[key]}
                  </span>
                </div>
                <div className="mt-3 text-4xl sm:text-5xl font-bold text-institucional-900 tabular-nums leading-none">
                  <CountUp value={k.valor} />
                </div>
                <div className="mt-3 text-sm font-medium text-slate-900 leading-snug">
                  {k.label[locale]}
                </div>
                <div className="mt-1 text-xs text-slate-500 leading-snug">
                  {k.detalle[locale]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
