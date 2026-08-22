import type { Brecha } from '@/data/brechas';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function BrechaCard({
  index,
  brecha,
  locale,
  t,
}: {
  index: number;
  brecha: Brecha;
  locale: Locale;
  t: Dictionary;
}) {
  return (
    <article className="grid gap-4 border-b border-editorial-rule py-7 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-5">
      <span className="font-mono text-xs tabular-nums text-slate-400">
        {String(index).padStart(2, '0')}
      </span>
      <div>
      <header className="mb-5">
        <h3 className="font-editorial text-2xl font-semibold leading-tight text-editorial-ink text-balance">
          {brecha.capacidad[locale]}
        </h3>
        <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-institucional-700">
          {t.analisis.referenciaLabel}: {brecha.paisReferencia[locale]}
        </p>
      </header>
      <div className="space-y-4 text-sm">
        <p className="text-slate-700 text-pretty">{brecha.evidenciaReferencia[locale]}</p>
        <div className="border-l-2 border-amber-500 pl-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            {t.analisis.estadoCRLabel}
          </p>
          <p className="text-slate-700 text-pretty">{brecha.estadoCR[locale]}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            {t.analisis.porQueImporta}
          </p>
          <p className="text-slate-700 text-pretty">{brecha.porQueImporta[locale]}</p>
        </div>
      </div>
      <a
        href={brecha.fuenteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block border-b border-institucional-700 pb-0.5 text-xs font-semibold text-institucional-700 hover:text-institucional-900"
      >
        {t.recursos.abrir}
      </a>
      </div>
    </article>
  );
}
