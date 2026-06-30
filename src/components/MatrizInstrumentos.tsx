import { instrumentos, fuerzaBadgeCls } from '@/data/marcoPais';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

function formatPublicacion(fecha: string | undefined, locale: Locale): string {
  if (!fecha) return '—';
  // YYYY-MM-DD -> "may 2019" / "May 2019". Si el día es 01 asumimos precisión mes.
  const [yyyy, mm] = fecha.split('-');
  const d = new Date(`${yyyy}-${mm}-15T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return fecha;
  const fmt = new Intl.DateTimeFormat(locale === 'es' ? 'es-CR' : 'en-US', {
    month: 'short',
    year: 'numeric',
  });
  return fmt.format(d);
}

export function MatrizInstrumentos({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const dict = t.marcoPais.matriz;
  const fuerzaLabels = t.marcoPais.fuerzaTipos;

  return (
    <section id="matriz" className="bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-10 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {dict.kicker}
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            {dict.titulo}
          </h2>
          <p className="mt-3 text-slate-600 text-pretty">{dict.sub}</p>
        </header>

        {/* Desktop: tabla. md+ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-left">
                <th className="py-3 pr-4 text-xs uppercase tracking-wide text-slate-500 font-semibold w-[18%]">
                  {dict.cols.instrumento}
                </th>
                <th className="py-3 pr-4 text-xs uppercase tracking-wide text-slate-500 font-semibold w-[10%]">
                  {dict.cols.tipo}
                </th>
                <th className="py-3 pr-4 text-xs uppercase tracking-wide text-slate-500 font-semibold w-[10%]">
                  {dict.cols.alcance}
                </th>
                <th className="py-3 pr-4 text-xs uppercase tracking-wide text-slate-500 font-semibold w-[12%]">
                  {dict.cols.fuerza}
                </th>
                <th className="py-3 pr-4 text-xs uppercase tracking-wide text-slate-500 font-semibold">
                  {dict.cols.queResuelve}
                </th>
                <th className="py-3 pr-4 text-xs uppercase tracking-wide text-slate-500 font-semibold">
                  {dict.cols.queNoResuelve}
                </th>
                <th className="py-3 pr-4 text-xs uppercase tracking-wide text-slate-500 font-semibold w-[10%]">
                  {dict.cols.estado}
                </th>
                <th className="py-3 text-xs uppercase tracking-wide text-slate-500 font-semibold w-[10%]">
                  {dict.cols.publicado}
                </th>
              </tr>
            </thead>
            <tbody>
              {instrumentos.map((inst) => (
                <tr
                  key={inst.id}
                  className="border-b border-slate-100 align-top"
                >
                  <th
                    scope="row"
                    className="py-4 pr-4 text-left font-semibold text-institucional-900 text-pretty"
                  >
                    {inst.nombre[locale]}
                  </th>
                  <td className="py-4 pr-4 text-slate-700">{inst.tipo[locale]}</td>
                  <td className="py-4 pr-4 text-slate-700">{inst.alcance[locale]}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded border ${fuerzaBadgeCls[inst.fuerzaTipo]}`}
                    >
                      {fuerzaLabels[inst.fuerzaTipo]}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-slate-700 text-pretty">
                    {inst.queResuelve[locale]}
                  </td>
                  <td className="py-4 pr-4 text-slate-700 text-pretty">
                    {inst.queNoResuelve[locale]}
                  </td>
                  <td className="py-4 pr-4 text-slate-700">{inst.estado[locale]}</td>
                  <td
                    className="py-4 text-slate-700 tabular-nums whitespace-nowrap"
                    title={inst._notaFechaPublicacion ?? undefined}
                  >
                    {formatPublicacion(inst.fechaPublicacion, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: cards apiladas. < md */}
        <div className="md:hidden space-y-4">
          {instrumentos.map((inst) => (
            <article
              key={inst.id}
              className="bg-white border border-slate-200 rounded-lg p-5"
            >
              <header className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-base font-semibold text-institucional-900 text-pretty">
                  {inst.nombre[locale]}
                </h3>
                <span
                  className={`ml-auto inline-block text-xs px-2 py-1 rounded border ${fuerzaBadgeCls[inst.fuerzaTipo]}`}
                >
                  {fuerzaLabels[inst.fuerzaTipo]}
                </span>
              </header>
              <dl className="space-y-3 text-sm">
                <Row label={dict.cols.tipo} value={inst.tipo[locale]} />
                <Row label={dict.cols.alcance} value={inst.alcance[locale]} />
                <Row label={dict.cols.estado} value={inst.estado[locale]} />
                <Row
                  label={dict.cols.publicado}
                  value={formatPublicacion(inst.fechaPublicacion, locale)}
                  title={inst._notaFechaPublicacion}
                />
                <Row label={dict.cols.queResuelve} value={inst.queResuelve[locale]} />
                <Row label={dict.cols.queNoResuelve} value={inst.queNoResuelve[locale]} />
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  title,
}: {
  label: string;
  value: string;
  title?: string;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500 mb-0.5">
        {label}
      </dt>
      <dd className="text-slate-700 text-pretty" title={title}>
        {value}
      </dd>
    </div>
  );
}
