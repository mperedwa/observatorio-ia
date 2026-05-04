import { expedientes } from '@/data/legislacion';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

const estadoCls: Record<string, string> = {
  'en-comision': 'bg-amber-50 text-amber-800 border-amber-200',
  dictaminado: 'bg-sky-50 text-sky-800 border-sky-200',
  'primer-debate': 'bg-blue-50 text-blue-800 border-blue-200',
  'segundo-debate': 'bg-purple-50 text-purple-800 border-purple-200',
  archivado: 'bg-slate-100 text-slate-700 border-slate-300',
  aprobada: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

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
                    className={`inline-block text-xs px-2 py-1 rounded border ${estadoCls[e.estado]}`}
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
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
