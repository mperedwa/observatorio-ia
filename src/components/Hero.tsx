import Link from 'next/link';
import { kpisHero } from '@/data/indicadores';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { applyCounters } from '@/i18n/applyCounters';
import { COUNTERS } from '@/data/counters';
import { CountUp } from './CountUp';
import { capaCard, capaChip } from './catalogoStyles';
import { CAPAS_CATALOGO } from '@/data/presentacion-catalogo';

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
  const layerCounts = {
    verificado: COUNTERS.adopcionVerificada,
    seguimiento: COUNTERS.seguimiento,
    ecosistema: COUNTERS.ecosistema,
  } as const;

  return (
    <section
      id="inicio"
      className="bg-gradient-to-b from-institucional-50 to-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          {t.hero.kicker}
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-slate-900 max-w-4xl leading-tight">
          {applyCounters(t.hero.headline, COUNTERS)}
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-3xl text-pretty">
          {applyCounters(t.hero.sub, COUNTERS)}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/proyectos`}
            className="inline-flex items-center justify-center rounded-lg bg-institucional-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-institucional-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-500 focus-visible:ring-offset-2"
          >
            {t.hero.ctaCatalogo} <span aria-hidden className="ml-2">→</span>
          </Link>
          <Link
            href={`/${locale}/quien-mantiene`}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-institucional-200 hover:text-institucional-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-500 focus-visible:ring-offset-2"
          >
            {t.hero.ctaMetodologia}
          </Link>
        </div>

        <p className="mt-12 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t.hero.capasIntro}
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {CAPAS_CATALOGO.map((capa) => (
            <Link
              key={capa}
              href={`/${locale}/proyectos`}
              className={`group rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${capaCard[capa]}`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${capaChip[capa]}`}>
                  {t.catalogo.capas[capa].corto}
                </span>
                <span className="text-3xl font-bold tabular-nums text-slate-900">
                  <CountUp value={String(layerCounts[capa])} />
                </span>
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-900 group-hover:text-institucional-700">
                {t.catalogo.capas[capa].titulo}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t.catalogo.capas[capa].descripcion}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t.hero.contextoIntro}
        </p>
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {kpisHero.map((k, i) => {
            const key = KPI_KEYS[i];
            return (
              <div
                key={k.valor + k.label.es}
                className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white pl-5 pr-4 py-4 transition-all duration-200 hover:border-institucional-200 hover:bg-institucional-50/60 hover:shadow-sm"
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
                <div className="mt-3 text-3xl sm:text-4xl font-bold text-institucional-900 tabular-nums leading-none">
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
