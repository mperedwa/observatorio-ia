import { ChartOecdIndex } from './ChartOecdIndex';
import type { OecdIndex } from '@/data/indicadores';
import type { Locale } from '@/i18n/config';
import { EncabezadoSeccionExpediente } from './ExpedienteEditorial';

interface SectionCopy {
  titulo: string;
  sub: string;
  fuenteLabel: string;
  scoreLabel: string;
  subdimsLabel: string;
  crProgresoLabel: string;
}

export function IndicadorOecd({
  index,
  data,
  locale,
  copy,
}: {
  index: string;
  data: OecdIndex;
  locale: Locale;
  copy: SectionCopy;
}) {
  const delta = data.crVsAnterior.delta;
  const deltaSign = delta > 0 ? '+' : '';
  const deltaColor = delta > 0 ? 'text-emerald-700' : delta < 0 ? 'text-rose-700' : 'text-slate-600';

  return (
    <section className="border-b border-editorial-rule py-12 last:border-b-0 sm:py-16">
      <EncabezadoSeccionExpediente index={index} title={copy.titulo} description={copy.sub} />
      <div className="mt-8 sm:pl-[4.5rem]">
        <ChartOecdIndex data={data} locale={locale} scoreLabel={copy.scoreLabel} />

      <div className="mt-8 grid border-y border-editorial-rule sm:grid-cols-2 sm:divide-x sm:divide-editorial-rule">
        <div className="py-5 sm:pr-6">
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
        <div className="border-t border-editorial-rule py-5 sm:border-t-0 sm:pl-6">
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

      <div className="mt-7 border-t border-editorial-rule pt-5">
        <p className="text-xs text-slate-500 mb-2">{copy.fuenteLabel}</p>
        <ul className="space-y-1 text-xs">
          {data.fuentes.map((f, i) => (
            <li key={i}>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-institucional-700 underline decoration-institucional-200 underline-offset-2 hover:decoration-institucional-700"
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
    </section>
  );
}
