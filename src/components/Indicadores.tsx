import { ilia2025 } from '@/data/indicadores';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function Indicadores({ locale, t }: { locale: Locale; t: Dictionary }) {
  const max = Math.max(...ilia2025.map((p) => p.ilia));
  const chile = ilia2025.find((p) => p.pais.es === 'Chile')?.ilia ?? 0;
  const cr = ilia2025.find((p) => p.destacado)?.ilia ?? 0;
  const brecha = (chile - cr).toFixed(2);

  return (
    <section id="indicadores" className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          {t.indicadores.kicker}
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
          {t.indicadores.titulo}
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl">{t.indicadores.sub}</p>
      </header>

      <div className="border border-slate-200 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">{t.indicadores.cardTitulo}</h3>
          <span className="text-xs text-slate-500">{t.indicadores.fuente}</span>
        </div>
        <div className="space-y-4">
          {ilia2025.map((p) => (
            <div key={p.pais.es}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span
                  className={`text-sm ${p.destacado ? 'font-bold text-institucional-900' : 'text-slate-700'}`}
                >
                  {p.pais[locale]}
                </span>
                <span
                  className={`text-sm tabular-nums ${
                    p.destacado ? 'font-bold text-institucional-900' : 'text-slate-700'
                  }`}
                >
                  {p.ilia.toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    p.destacado ? 'bg-institucional-700' : 'bg-slate-400'
                  }`}
                  style={{ width: `${(p.ilia / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-600">
          {t.indicadores.brechaPre}{' '}
          <span className="font-semibold text-slate-900">
            {brecha} {t.indicadores.brechaPuntos}
          </span>
          . {t.indicadores.brechaPost}
        </p>
      </div>
    </section>
  );
}
