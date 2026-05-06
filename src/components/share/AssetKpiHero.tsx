import { kpisHero } from '@/data/indicadores';
import { AssetFrame, type AssetSize } from './AssetFrame';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { applyCounters } from '@/i18n/applyCounters';
import { COUNTERS } from '@/data/counters';

export function AssetKpiHero({
  locale,
  t,
  size,
}: {
  locale: Locale;
  t: Dictionary;
  size: AssetSize;
}) {
  return (
    <AssetFrame size={size} locale={locale} variant="gradient">
      <div className="flex-1 flex flex-col p-16">
        <div>
          <p
            className="font-semibold uppercase tracking-widest text-institucional-700"
            style={{ fontSize: 24 }}
          >
            {t.hero.kicker}
          </p>
          <h1
            className="mt-4 font-bold text-slate-900 leading-tight"
            style={{ fontSize: 60, maxWidth: 920 }}
          >
            {applyCounters(t.comparte.assets.kpiHeroTitulo, COUNTERS)}
          </h1>
          <p className="mt-6 text-slate-600" style={{ fontSize: 26, maxWidth: 880 }}>
            {locale === 'es'
              ? 'Mapeo abierto de la adopción de IA en el sector público costarricense.'
              : 'Open map of AI adoption across Costa Rica\u2019s public sector.'}
          </p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-x-10 gap-y-12">
          {kpisHero.map((k) => (
            <div
              key={k.valor + k.label.es}
              className="border-l-4 border-institucional-700 pl-6"
            >
              <div
                className="font-bold text-institucional-900 tabular-nums leading-none"
                style={{ fontSize: 92 }}
              >
                {k.valor}
              </div>
              <div
                className="mt-3 font-medium text-slate-900"
                style={{ fontSize: 22, lineHeight: 1.25 }}
              >
                {k.label[locale]}
              </div>
              <div className="mt-1 text-slate-500" style={{ fontSize: 18 }}>
                {k.detalle[locale]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AssetFrame>
  );
}
