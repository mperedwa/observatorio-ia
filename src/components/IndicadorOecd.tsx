import { ChartOecdIndex } from './ChartOecdIndex';
import type { OecdIndex } from '@/data/indicadores';
import type { Locale } from '@/i18n/config';

interface SectionCopy {
  titulo: string;
  sub: string;
  fuenteLabel: string;
  scoreLabel: string;
  subdimsLabel: string;
  crProgresoLabel: string;
}

export function IndicadorOecd({
  data,
  locale,
  copy,
}: {
  data: OecdIndex;
  locale: Locale;
  copy: SectionCopy;
}) {
  const delta = data.crVsAnterior.delta;
  const deltaSign = delta > 0 ? '+' : '';
  const deltaColor = delta > 0 ? 'text-emerald-700' : delta < 0 ? 'text-rose-700' : 'text-slate-600';

  return (
    <div className="border border-slate-200 rounded-lg p-6 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-900">{copy.titulo}</h3>
      </div>
      <p className="text-sm text-slate-600 mb-6">{copy.sub}</p>

      <ChartOecdIndex data={data} locale={locale} scoreLabel={copy.scoreLabel} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
            {copy.subdimsLabel}
          </p>
          <ul className="space-y-1.5 text-sm">
            {data.subdimensionesCostaRica.map((s) => (
              <li key={s.nombre.es} className="flex items-center justify-between gap-3">
                <span className="text-slate-700">{s.nombre[locale]}</span>
                <span className="tabular-nums font-semibold text-slate-900">
                  {s.score.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
            {copy.crProgresoLabel}
          </p>
          <p className="text-sm text-slate-700">
            <span className="tabular-nums">{data.crVsAnterior.score2023.toFixed(2)}</span>
            {' → '}
            <span className="tabular-nums font-semibold text-slate-900">
              {data.crVsAnterior.score2025.toFixed(2)}
            </span>
            {' '}
            <span className={`tabular-nums font-semibold ${deltaColor}`}>
              ({deltaSign}{delta.toFixed(2)})
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 mb-2">{copy.fuenteLabel}</p>
        <ul className="space-y-1 text-xs">
          {data.fuentes.map((f, i) => (
            <li key={i}>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-institucional-700 hover:underline"
              >
                {f.nombre ? f.nombre[locale] : new URL(f.url).hostname}
              </a>
              {' — '}
              <span className="text-slate-600">{f.descripcion[locale]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
