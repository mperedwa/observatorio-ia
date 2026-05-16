import { expedientes, estadoBadgeCls } from '@/data/legislacion';
import { notasCoyuntura } from '@/data/coyuntura';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function Legislacion({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section id="legislacion" className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {t.legislacion.kicker}
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            {t.legislacion.titulo}
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl">{t.legislacion.sub}</p>
        </header>
        {notasCoyuntura.length > 0 && (
          <div className="mb-8 space-y-4">
            {notasCoyuntura.map((n) => (
              <aside
                key={n.id}
                className="bg-white border-l-4 border-indigo-400 border-y border-r border-slate-200 rounded-r-lg p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="inline-block text-xs font-medium uppercase tracking-wide text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    {n.etiqueta[locale]}
                  </span>
                  <time
                    dateTime={n.fecha}
                    className="text-xs text-slate-500 tabular-nums"
                  >
                    {n.fecha}
                  </time>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {n.titulo[locale]}
                </h3>
                <p className="mt-2 text-sm text-slate-700 text-pretty">
                  {n.texto[locale]}
                </p>
                {n.implicacion && (
                  <p className="mt-3 text-sm text-slate-600 text-pretty">
                    {n.implicacion[locale]}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {n.fuentes.map((f, i) => (
                    <a
                      key={f.url}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={f.descripcion[locale]}
                      aria-label={f.descripcion[locale]}
                      className="text-institucional-700 hover:text-institucional-900 underline underline-offset-2"
                    >
                      {f.nombre
                        ? `${f.nombre[locale]} ↗`
                        : n.fuentes.length > 1
                        ? `${t.legislacion.verFuente} ${i + 1} ↗`
                        : `${t.legislacion.verFuente} ↗`}
                    </a>
                  ))}
                </div>
              </aside>
            ))}
          </div>
        )}
        <div className="space-y-4">
          {expedientes.map((e) => (
            <article
              key={e.numero}
              className="bg-white border border-slate-200 rounded-lg p-6 grid sm:grid-cols-[140px_1fr] gap-4 sm:gap-6"
            >
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  {t.legislacion.expedienteLabel}
                </div>
                <div className="text-2xl font-bold text-institucional-900 tabular-nums">
                  {e.numero}
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded border ${estadoBadgeCls[e.estado]}`}
                  >
                    {t.legislacion.estados[e.estado]}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{e.titulo[locale]}</h3>
                <p className="mt-2 text-sm text-slate-600 text-pretty">{e.resumen[locale]}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                  <span>
                    {t.legislacion.comisionLabel}:{' '}
                    <span className="text-slate-700">{e.comision[locale]}</span>
                  </span>
                  <span>
                    {t.legislacion.presentadoLabel}:{' '}
                    <span className="text-slate-700">{e.presentado}</span>
                  </span>
                  {e.fuenteUrl && (
                    <a
                      href={e.fuenteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-institucional-700 hover:text-institucional-900 underline underline-offset-2"
                    >
                      {t.legislacion.verFuente} ↗
                    </a>
                  )}
                  <span className="text-slate-400">
                    {t.legislacion.fuenteOficial}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
