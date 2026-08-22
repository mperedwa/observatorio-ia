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
  const chile = sorted.find((p) => p.pais.es === 'Chile')?.ilia ?? 0;
  const costaRica = sorted.find((p) => p.destacado)?.ilia ?? 0;
  const gap = new Intl.NumberFormat(locale === 'es' ? 'es-CR' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(chile - costaRica);

  return (
    <AssetFrame size={size} locale={locale} variant="light">
      <div className="flex-1 flex flex-col p-16 pb-24">
        <p
          className="font-semibold uppercase tracking-widest text-institucional-700"
          style={{ fontSize: 22 }}
        >
          {t.indicadores.kicker}
        </p>
        <h1
          className="mt-4 font-editorial font-semibold leading-[1.02] text-editorial-ink"
          style={{ fontSize: 52, maxWidth: 940 }}
        >
          {t.comparte.assets.iliaTitulo}
        </h1>

        <div className="mt-10 flex flex-1 flex-col border-y border-editorial-rule">
          {sorted.map((p) => {
            const w = (p.ilia / max) * 100;
            const isCR = p.destacado;
            return (
              <div key={p.pais.es} className={`border-b border-editorial-rule py-4 last:border-b-0 ${isCR ? 'border-l-8 border-l-institucional-700 pl-4' : ''}`}>
                <div className="mb-2 flex items-baseline justify-between">
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
                <div className="overflow-hidden bg-slate-100" style={{ height: 10 }}>
                  <div
                    className={isCR ? 'bg-institucional-700' : 'bg-slate-400'}
                    style={{ width: `${w}%`, height: '100%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 border-l-4 border-editorial-accent pl-5 text-slate-700" style={{ fontSize: 22, maxWidth: 900, lineHeight: 1.4 }}>
          {locale === 'es'
            ? `La brecha exacta entre Costa Rica y Chile es de ${gap} puntos en el ILIA 2025.`
            : `The exact gap between Costa Rica and Chile is ${gap} points in ILIA 2025.`}
        </p>
        <p className="mt-3 text-slate-500" style={{ fontSize: 16 }}>
          {locale === 'es' ? 'Fuente: CEPAL · ILIA 2025' : 'Source: ECLAC · ILIA 2025'}
        </p>
      </div>
    </AssetFrame>
  );
}
