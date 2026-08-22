import Link from 'next/link';
import { kpisHero } from '@/data/indicadores';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { applyCounters } from '@/i18n/applyCounters';
import { COUNTERS } from '@/data/counters';
import { capaMarker } from './catalogoStyles';
import { CAPAS_CATALOGO } from '@/data/presentacion-catalogo';

const KPI_KEYS = ['proyectos', 'instituciones', 'legislacion', 'ranking'] as const;

export function Hero({ t, locale }: { t: Dictionary; locale: Locale }) {
  const layerCounts = {
    verificado: COUNTERS.adopcionVerificada,
    seguimiento: COUNTERS.seguimiento,
    ecosistema: COUNTERS.ecosistema,
  } as const;

  return (
    <section
      id="inicio"
      className="border-b border-editorial-rule bg-editorial-paper"
    >
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 lg:py-24">
        <header className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-institucional-700 sm:text-sm">
            {t.hero.kicker}
          </p>
          <h1 className="mt-4 max-w-5xl font-editorial text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl lg:text-[4.6rem]">
            {applyCounters(t.hero.headline, COUNTERS)}
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-editorial-muted text-pretty sm:text-xl">
            {applyCounters(t.hero.sub, COUNTERS)}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={`/${locale}/proyectos`}
              className="inline-flex items-center justify-center rounded-editorial bg-institucional-700 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-institucional-900"
            >
              {t.hero.ctaCatalogo} <span aria-hidden className="ml-2">→</span>
            </Link>
            <Link
              href={`/${locale}/quien-mantiene`}
              className="border-b border-editorial-ink pb-1 text-sm font-semibold text-editorial-ink transition-colors duration-150 hover:border-institucional-700 hover:text-institucional-700"
            >
              {t.hero.ctaMetodologia}
            </Link>
          </div>
        </header>

        <p className="mt-14 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {t.hero.capasIntro}
        </p>
        <div className="mt-4 grid border-y border-editorial-rule lg:grid-cols-3">
          {CAPAS_CATALOGO.map((capa) => (
            <Link
              key={capa}
              href={`/${locale}/proyectos`}
              className="group border-b border-editorial-rule px-1 py-6 transition-colors duration-150 last:border-b-0 hover:bg-white/55 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-1 lg:last:border-r-0"
            >
              <div className="flex items-start gap-4">
                <span className={`mt-1 h-8 w-1 flex-none ${capaMarker[capa]}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                      {t.catalogo.capas[capa].corto}
                    </span>
                    <span className="font-editorial text-4xl font-semibold tabular-nums text-editorial-ink">
                      {layerCounts[capa]}
                    </span>
                  </div>
                  <h2 className="mt-3 text-base font-semibold text-editorial-ink underline-offset-4 group-hover:underline">
                    {t.catalogo.capas[capa].titulo}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                    {t.catalogo.capas[capa].descripcion}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {t.hero.contextoIntro}
        </p>
        <div className="mt-4 grid grid-cols-2 border-y border-editorial-rule lg:grid-cols-4">
          {kpisHero.map((k, i) => {
            const key = KPI_KEYS[i];
            return (
              <div
                key={k.valor + k.label.es}
                className={`min-w-0 px-3 py-5 sm:px-5 ${
                  i % 2 === 0 ? 'border-r border-editorial-rule' : ''
                } ${i < 2 ? 'border-b border-editorial-rule' : ''} lg:border-b-0 lg:border-r lg:first:pl-1 lg:last:border-r-0`}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-[11px]">
                  {t.hero.kpiCategoria[key]}
                </div>
                <div className="mt-3 font-editorial text-4xl font-semibold leading-none tabular-nums text-editorial-ink sm:text-5xl">
                  {k.valor}
                </div>
                <div className="mt-3 text-sm font-semibold leading-snug text-editorial-ink">
                  {k.label[locale]}
                </div>
                <div className="mt-1 text-xs leading-snug text-slate-500">
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
