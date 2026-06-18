import Link from 'next/link';
import { changelog } from '@/data/changelog';
import type { ChangelogTipo } from '@/data/changelog';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

const HOME_LIMIT = 10;

/**
 * Subtle, neutral pill colors per change `tipo`. Distinct from the
 * `EstadoLey` palette used in legislacion badges (amber/sky/blue/purple/
 * emerald/slate) so the two taxonomies don't visually collide.
 */
const tipoCls: Record<ChangelogTipo, string> = {
  legislacion: 'bg-slate-100 text-slate-700 border-slate-300',
  institucion: 'bg-stone-100 text-stone-700 border-stone-300',
  indicador: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  proyecto: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  recurso: 'bg-gray-100 text-gray-700 border-gray-300',
};

export function Changelog({ locale, t }: { locale: Locale; t: Dictionary }) {
  const entries = changelog.slice(0, HOME_LIMIT);
  if (entries.length === 0) return null;

  return (
    <section id="actualizaciones" className="bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {t.changelog.kicker}
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            {t.changelog.titulo}
          </h2>
          <p className="mt-3 text-slate-600 max-w-3xl text-pretty">{t.changelog.intro}</p>
        </header>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium w-[110px]">
                  {t.changelog.tableCols.fecha}
                </th>
                <th scope="col" className="px-4 py-3 font-medium w-[130px]">
                  {t.changelog.tableCols.tipo}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {t.changelog.tableCols.actualizacion}
                </th>
                <th scope="col" className="px-4 py-3 font-medium w-[220px]">
                  {t.changelog.tableCols.fuente}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {entries.map((e) => (
                <tr key={`${e.fecha}-${e.commit_sha ?? e.actualizacion.es.slice(0, 32)}`}>
                  <td className="px-4 py-3 align-top tabular-nums text-slate-600 whitespace-nowrap">
                    <time dateTime={e.fecha}>{e.fecha}</time>
                  </td>
                  <td className="px-4 py-3 align-top whitespace-nowrap">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded border ${tipoCls[e.tipo]}`}
                    >
                      {t.changelog.tipos[e.tipo]}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-slate-700 text-pretty">
                    {e.actualizacion[locale]}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-600 text-pretty">
                    {e.fuente_url ? (
                      <a
                        href={e.fuente_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={e.fuente[locale]}
                        className="text-institucional-700 hover:text-institucional-900 underline underline-offset-2"
                      >
                        {e.fuente[locale]} ↗
                      </a>
                    ) : (
                      e.fuente[locale]
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Link
            href={`/${locale}/historial`}
            className="text-sm font-medium text-institucional-700 hover:text-institucional-900 underline underline-offset-2"
          >
            {t.changelog.verHistorialCompleto} →
          </Link>
        </div>
      </div>
    </section>
  );
}
