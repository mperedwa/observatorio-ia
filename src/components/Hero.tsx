import { kpisHero } from '@/data/indicadores';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function Hero({ t, locale = 'es' }: { t: Dictionary; locale?: Locale }) {
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
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {kpisHero.map((k) => (
            <div key={k.valor + k.label.es} className="border-l-4 border-institucional-700 pl-4">
              <div className="text-4xl sm:text-5xl font-bold text-institucional-900 tabular-nums">
                {k.valor}
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">{k.label[locale]}</div>
              <div className="text-xs text-slate-500 mt-0.5">{k.detalle[locale]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
