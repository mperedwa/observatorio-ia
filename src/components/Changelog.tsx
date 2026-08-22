import Link from 'next/link';
import { MarcaDocumental } from '@/components/ExpedienteEditorial';
import { changelog } from '@/data/changelog';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

const HOME_LIMIT = 10;

export function Changelog({ locale, t }: { locale: Locale; t: Dictionary }) {
  const entries = changelog.slice(0, HOME_LIMIT);
  if (entries.length === 0) return null;

  return (
    <section id="actualizaciones" className="border-y border-editorial-rule bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <header className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
            {t.changelog.kicker}
          </p>
          <h2 className="mt-2 font-editorial text-3xl font-semibold leading-tight text-editorial-ink sm:text-4xl">
            {t.changelog.titulo}
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600 text-pretty">{t.changelog.intro}</p>
        </header>

        <div className="hidden border-y border-editorial-rule md:block">
          <table className="min-w-full divide-y divide-editorial-rule text-sm">
            <thead className="bg-editorial-paper/55 text-left text-[0.68rem] uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th scope="col" className="w-[110px] px-4 py-3 font-semibold">{t.changelog.tableCols.fecha}</th>
                <th scope="col" className="w-[130px] px-4 py-3 font-semibold">{t.changelog.tableCols.tipo}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t.changelog.tableCols.actualizacion}</th>
                <th scope="col" className="w-[220px] px-4 py-3 font-semibold">{t.changelog.tableCols.fuente}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-editorial-rule bg-white">
              {entries.map((entry) => (
                <tr key={`${entry.fecha}-${entry.commit_sha ?? entry.actualizacion.es.slice(0, 32)}`}>
                  <td className="whitespace-nowrap px-4 py-4 align-top tabular-nums text-slate-600">
                    <time dateTime={entry.fecha}>{entry.fecha}</time>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <MarcaDocumental label={t.changelog.tipos[entry.tipo]} />
                  </td>
                  <td className="px-4 py-4 align-top leading-relaxed text-slate-700 text-pretty">
                    {entry.actualizacion[locale]}
                  </td>
                  <td className="px-4 py-4 align-top text-slate-600 text-pretty">
                    <Fuente entry={entry} locale={locale} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-editorial-rule md:hidden">
          {entries.map((entry, index) => (
            <article
              key={`${entry.fecha}-${entry.commit_sha ?? entry.actualizacion.es.slice(0, 32)}`}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-editorial-rule py-6"
            >
              <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <time dateTime={entry.fecha} className="text-xs tabular-nums text-slate-500">
                    {entry.fecha}
                  </time>
                  <MarcaDocumental label={t.changelog.tipos[entry.tipo]} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 text-pretty">
                  {entry.actualizacion[locale]}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  <Fuente entry={entry} locale={locale} />
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href={`/${locale}/historial`}
            className="text-sm font-semibold text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
          >
            {t.changelog.verHistorialCompleto} →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Fuente({
  entry,
  locale,
}: {
  entry: (typeof changelog)[number];
  locale: Locale;
}) {
  if (!entry.fuente_url) return entry.fuente[locale];

  return (
    <a
      href={entry.fuente_url}
      target="_blank"
      rel="noopener noreferrer"
      title={entry.fuente[locale]}
      className="font-semibold text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
    >
      {entry.fuente[locale]} ↗
    </a>
  );
}
