import { comparativaRegional } from '@/data/indicadores';
import { AssetFrame, type AssetSize } from './AssetFrame';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function AssetIlia({
  locale,
  t,
  size,
}: {
  locale: Locale;
  t: Dictionary;
  size: AssetSize;
}) {
  const sorted = comparativaRegional.slice().sort((a, b) => b.ilia - a.ilia);
  const max = Math.max(...sorted.map((p) => p.ilia));

  return (
    <AssetFrame size={size} locale={locale} variant="light">
      <div className="flex-1 flex flex-col p-16">
        <p
          className="font-semibold uppercase tracking-widest text-institucional-700"
          style={{ fontSize: 22 }}
        >
          {t.indicadores.kicker}
        </p>
        <h1
          className="mt-4 font-bold text-slate-900 leading-tight"
          style={{ fontSize: 52, maxWidth: 940 }}
        >
          {t.comparte.assets.iliaTitulo}
        </h1>

        <div className="mt-12 flex-1 flex flex-col gap-6">
          {sorted.map((p) => {
            const w = (p.ilia / max) * 100;
            const isCR = p.destacado;
            return (
              <div key={p.pais.es}>
                <div className="flex items-baseline justify-between mb-2">
                  <span
                    className={isCR ? 'font-bold text-institucional-900' : 'font-semibold text-slate-700'}
                    style={{ fontSize: 28 }}
                  >
                    {p.pais[locale]}
                  </span>
                  <span
                    className={isCR ? 'font-bold text-institucional-900 tabular-nums' : 'text-slate-700 tabular-nums'}
                    style={{ fontSize: 28 }}
                  >
                    {p.ilia.toFixed(2)}
                  </span>
                </div>
                <div className="bg-slate-100 rounded-full overflow-hidden" style={{ height: 16 }}>
                  <div
                    className={isCR ? 'bg-institucional-700' : 'bg-slate-400'}
                    style={{ width: `${w}%`, height: '100%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-slate-700" style={{ fontSize: 22, maxWidth: 880, lineHeight: 1.4 }}>
          {locale === 'es'
            ? 'Costa Rica perdió 19 puntos vs Chile en el ILIA 2025. La brecha refleja ausencia de un ente ejecutor con presupuesto dedicado.'
            : 'Costa Rica fell 19 points behind Chile in ILIA 2025. The gap reflects the absence of an executing body with dedicated budget.'}
        </p>
        <p className="mt-3 text-slate-400" style={{ fontSize: 16 }}>
          {locale === 'es' ? 'Fuente: CEPAL · ILIA 2025' : 'Source: ECLAC · ILIA 2025'}
        </p>
      </div>
    </AssetFrame>
  );
}
