import {
  EncabezadoSeccionExpediente,
  MarcaDocumental,
  type TonoDocumental,
} from '@/components/ExpedienteEditorial';
import { instrumentos, type FuerzaTipo } from '@/data/marcoPais';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

const fuerzaTone: Record<FuerzaTipo, TonoDocumental> = {
  referencial: 'neutral',
  orientadora: 'referencial',
  obligatoria: 'atencion',
  'no-vigente': 'contradicho',
  operativa: 'confirmado',
  pendiente: 'pendiente',
};

function formatPublicacion(fecha: string | undefined, locale: Locale): string {
  if (!fecha) return '—';
  const [year, month] = fecha.split('-');
  const date = new Date(`${year}-${month}-15T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return fecha;
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CR' : 'en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function MatrizInstrumentos({
  locale,
  t,
  sectionIndex = '04',
}: {
  locale: Locale;
  t: Dictionary;
  sectionIndex?: string;
}) {
  const dict = t.marcoPais.matriz;
  const fuerzaLabels = t.marcoPais.fuerzaTipos;

  return (
    <section id="matriz" className="border-t border-editorial-rule bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <EncabezadoSeccionExpediente
          index={sectionIndex}
          title={dict.titulo}
          description={dict.sub}
        />

        <div className="mt-9 hidden overflow-x-auto border-y border-editorial-rule lg:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-editorial-rule bg-editorial-paper/55 text-left">
                <th className="w-[18%] py-3 pl-3 pr-4 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {dict.cols.instrumento}
                </th>
                <th className="w-[10%] px-3 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {dict.cols.tipo}
                </th>
                <th className="w-[10%] px-3 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {dict.cols.alcance}
                </th>
                <th className="w-[12%] px-3 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {dict.cols.fuerza}
                </th>
                <th className="px-3 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {dict.cols.queResuelve}
                </th>
                <th className="px-3 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {dict.cols.queNoResuelve}
                </th>
                <th className="w-[10%] px-3 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {dict.cols.estado}
                </th>
                <th className="w-[10%] py-3 pl-3 pr-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {dict.cols.publicado}
                </th>
              </tr>
            </thead>
            <tbody>
              {instrumentos.map((instrumento) => (
                <tr key={instrumento.id} className="border-b border-editorial-rule align-top last:border-b-0">
                  <th scope="row" className="py-4 pl-3 pr-4 text-left font-semibold leading-snug text-institucional-900 text-pretty">
                    {instrumento.nombre[locale]}
                  </th>
                  <td className="px-3 py-4 text-slate-700">{instrumento.tipo[locale]}</td>
                  <td className="px-3 py-4 text-slate-700">{instrumento.alcance[locale]}</td>
                  <td className="px-3 py-4">
                    <MarcaDocumental
                      label={fuerzaLabels[instrumento.fuerzaTipo]}
                      tone={fuerzaTone[instrumento.fuerzaTipo]}
                    />
                  </td>
                  <td className="px-3 py-4 leading-relaxed text-slate-700 text-pretty">
                    {instrumento.queResuelve[locale]}
                  </td>
                  <td className="px-3 py-4 leading-relaxed text-slate-700 text-pretty">
                    {instrumento.queNoResuelve[locale]}
                  </td>
                  <td className="px-3 py-4 text-slate-700">{instrumento.estado[locale]}</td>
                  <td
                    className="py-4 pl-3 pr-3 tabular-nums text-slate-700"
                    title={instrumento._notaFechaPublicacion ?? undefined}
                  >
                    {instrumento.fechaPublicacion ? (
                      <time dateTime={instrumento.fechaPublicacion}>
                        {formatPublicacion(instrumento.fechaPublicacion, locale)}
                      </time>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-9 border-t border-editorial-rule lg:hidden">
          {instrumentos.map((instrumento, index) => (
            <article
              key={instrumento.id}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-editorial-rule py-7 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-x-5"
            >
              <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="font-editorial text-2xl font-semibold leading-tight text-editorial-ink">
                  {instrumento.nombre[locale]}
                </h3>
                <div className="mt-3">
                  <MarcaDocumental
                    label={fuerzaLabels[instrumento.fuerzaTipo]}
                    tone={fuerzaTone[instrumento.fuerzaTipo]}
                  />
                </div>
                <dl className="mt-5 grid gap-x-5 gap-y-4 border-t border-editorial-rule pt-4 text-sm sm:grid-cols-2">
                  <Row label={dict.cols.tipo} value={instrumento.tipo[locale]} />
                  <Row label={dict.cols.alcance} value={instrumento.alcance[locale]} />
                  <Row label={dict.cols.estado} value={instrumento.estado[locale]} />
                  <Row
                    label={dict.cols.publicado}
                    value={formatPublicacion(instrumento.fechaPublicacion, locale)}
                    title={instrumento._notaFechaPublicacion}
                    dateTime={instrumento.fechaPublicacion}
                  />
                  <Row label={dict.cols.queResuelve} value={instrumento.queResuelve[locale]} />
                  <Row label={dict.cols.queNoResuelve} value={instrumento.queNoResuelve[locale]} />
                </dl>
              </div>
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
  dateTime,
}: {
  label: string;
  value: string;
  title?: string;
  dateTime?: string;
}) {
  return (
    <div>
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 leading-relaxed text-slate-700 text-pretty" title={title}>
        {dateTime ? <time dateTime={dateTime}>{value}</time> : value}
      </dd>
    </div>
  );
}
