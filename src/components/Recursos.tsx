import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { recursos } from '@/data/recursos';

export function Recursos({
  locale,
  t,
  headingLevel = 'h2',
}: {
  locale: Locale;
  t: Dictionary;
  headingLevel?: 'h1' | 'h2';
}) {
  const Heading = headingLevel;

  return (
    <section
      id="recursos"
      className={
        headingLevel === 'h1'
          ? 'bg-white'
          : 'border-y border-editorial-rule bg-editorial-paper/55'
      }
    >
      <div
        className={`max-w-7xl mx-auto px-6 ${
          headingLevel === 'h1' ? 'pb-20 pt-10' : 'py-20'
        }`}
      >
        <header className="border-b border-editorial-rule pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
            {t.recursos.kicker}
          </p>
          <Heading className="mt-3 max-w-4xl font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
            {t.recursos.titulo}
          </Heading>
        </header>
        <ol className="border-b border-editorial-rule">
          {recursos.map((recurso, index) => (
            <li
              key={recurso.id}
              className="border-b border-editorial-rule last:border-b-0"
            >
              <a
                href={recurso.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-3 py-6 transition-colors hover:bg-editorial-paper/55 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:gap-5 sm:px-3"
              >
                <span className="font-mono text-xs tabular-nums text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    {recurso.tipo[locale]}
                  </span>
                  <span className="mt-2 block max-w-3xl font-editorial text-xl font-semibold leading-snug text-editorial-ink group-hover:text-institucional-800 sm:text-2xl">
                    {recurso.titulo[locale]}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {recurso.fuente}
                  </span>
                  {recurso.nota && (
                    <span className="mt-3 block max-w-4xl text-xs leading-relaxed text-slate-600">
                      {recurso.nota[locale]}
                    </span>
                  )}
                </span>
                <span className="self-end whitespace-nowrap border-b border-institucional-700 pb-0.5 text-xs font-semibold text-institucional-700">
                  {t.recursos.abrir}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
