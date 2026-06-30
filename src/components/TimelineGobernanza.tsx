import { hitos } from '@/data/marcoPais';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

function formatFechaCompleta(fecha: string, locale: Locale): string {
  const d = new Date(`${fecha}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return fecha;
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function TimelineGobernanza({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const dict = t.marcoPais.timeline;

  return (
    <section id="hitos" className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <header className="mb-10 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {dict.kicker}
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            {dict.titulo}
          </h2>
          <p className="mt-3 text-slate-600 text-pretty">{dict.sub}</p>
        </header>

        <ol className="relative border-l-2 border-slate-200 pl-6 sm:pl-8 space-y-6">
          {hitos.map((h, i) => (
            <li key={`${h.anio}-${i}`} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[33px] sm:-left-[41px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  h.pendiente
                    ? 'bg-white border-slate-300 border-dashed'
                    : 'bg-institucional-700 border-institucional-700'
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {h.pendiente ? (
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 border-dashed px-2 py-0.5 rounded">
                    {dict.pendienteLabel}
                  </span>
                ) : (
                  <span
                    className="text-lg font-bold text-institucional-900 tabular-nums"
                    title={h.fecha ? formatFechaCompleta(h.fecha, locale) : undefined}
                  >
                    {h.anio}
                  </span>
                )}
              </div>
              <p
                className={`mt-1 text-sm sm:text-base text-pretty ${
                  h.pendiente ? 'text-slate-600' : 'text-slate-800'
                }`}
              >
                {h.evento[locale]}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
