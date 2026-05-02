import type { Brecha } from '@/data/brechas';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function BrechaCard({
  brecha,
  locale,
  t,
}: {
  brecha: Brecha;
  locale: Locale;
  t: Dictionary;
}) {
  return (
    <article className="border border-slate-200 rounded-lg p-6 bg-white">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 text-balance">
          {brecha.capacidad[locale]}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-wider text-institucional-700">
          {t.analisis.referenciaLabel}: {brecha.paisReferencia[locale]}
        </p>
      </header>
      <div className="space-y-4 text-sm">
        <p className="text-slate-700 text-pretty">{brecha.evidenciaReferencia[locale]}</p>
        <div className="border-l-4 border-amber-400 pl-3">
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
        className="mt-5 inline-block text-xs text-institucional-700 hover:underline"
      >
        ↗ {t.recursos.abrir}
      </a>
    </article>
  );
}
