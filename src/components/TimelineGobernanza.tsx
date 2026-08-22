import { EncabezadoSeccionExpediente, MarcaDocumental } from '@/components/ExpedienteEditorial';
import { hitos } from '@/data/marcoPais';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

function formatFechaCompleta(fecha: string, locale: Locale): string {
  const date = new Date(`${fecha}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return fecha;
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function TimelineGobernanza({
  locale,
  t,
  sectionIndex = '03',
}: {
  locale: Locale;
  t: Dictionary;
  sectionIndex?: string;
}) {
  const dict = t.marcoPais.timeline;

  return (
    <section id="hitos" className="border-t border-editorial-rule bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <EncabezadoSeccionExpediente
          index={sectionIndex}
          title={dict.titulo}
          description={dict.sub}
        />

        <ol className="mt-9 border-t border-editorial-rule">
          {hitos.map((hito, index) => (
            <li
              key={`${hito.anio}-${index}`}
              className="grid grid-cols-[2.5rem_4.5rem_minmax(0,1fr)] gap-x-3 border-b border-editorial-rule py-5 sm:grid-cols-[3.25rem_7rem_minmax(0,1fr)] sm:gap-x-5 sm:py-6"
            >
              <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                {hito.pendiente ? (
                  <MarcaDocumental label={dict.pendienteLabel} tone="pendiente" />
                ) : hito.fecha ? (
                  <time
                    dateTime={hito.fecha}
                    title={formatFechaCompleta(hito.fecha, locale)}
                    className="font-editorial text-xl font-semibold tabular-nums text-institucional-900"
                  >
                    {hito.anio}
                  </time>
                ) : (
                  <span className="font-editorial text-xl font-semibold tabular-nums text-institucional-900">
                    {hito.anio}
                  </span>
                )}
              </div>
              <p className={`text-sm leading-relaxed text-pretty sm:text-base ${hito.pendiente ? 'text-slate-600' : 'text-slate-800'}`}>
                {hito.evento[locale]}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
