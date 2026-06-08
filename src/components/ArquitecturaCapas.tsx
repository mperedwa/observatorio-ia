import { capas, fuerzaBadgeCls } from '@/data/marcoPais';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function ArquitecturaCapas({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const dict = t.marcoPais.arquitectura;
  const campos = dict.campos;
  const fuerzaLabels = t.marcoPais.fuerzaTipos;

  return (
    <section
      id="arquitectura"
      className="bg-white border-y border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="mb-10 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {dict.kicker}
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            {dict.titulo}
          </h2>
          <p className="mt-3 text-slate-600 text-pretty">{dict.sub}</p>
        </header>

        <ol className="space-y-4" aria-label={dict.titulo}>
          {capas.map((capa, idx) => (
            <li key={capa.id}>
              {/*
                Mobile (< md): acordeón con <details>/<summary> — sin JS,
                colapsado por default excepto la primera capa.
                Desktop (md+): tarjeta siempre expandida.
              */}
              <details
                open
                className="group bg-white border border-slate-200 rounded-lg overflow-hidden"
              >
                <summary className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/60 cursor-pointer list-none md:cursor-default [&::-webkit-details-marker]:hidden">
                  <span className="text-xs uppercase tracking-wider text-slate-500">
                    {dict.capaLabel} {capa.orden}
                  </span>
                  <h3 className="text-lg sm:text-xl font-semibold text-institucional-900 text-balance">
                    {capa.nombreCorto[locale]}
                  </h3>
                  <span
                    className={`ml-auto inline-block text-xs px-2 py-1 rounded border ${fuerzaBadgeCls[capa.fuerzaTipo]}`}
                  >
                    {fuerzaLabels[capa.fuerzaTipo]}
                  </span>
                  <span
                    aria-hidden="true"
                    className="md:hidden text-slate-400 group-open:rotate-180 transition-transform"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </span>
                </summary>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 px-5 sm:px-6 py-5">
                  <Field label={campos.instrumentos} value={capa.instrumentos[locale]} />
                  <Field label={campos.funcion} value={capa.funcion[locale]} />
                  <Field label={campos.alcance} value={capa.alcance[locale]} />
                  <Field label={campos.fuerza} value={capa.fuerza[locale]} />
                  <div className="md:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                      {campos.vacio}
                    </p>
                    <p className="text-sm text-slate-700 text-pretty border-l-4 border-amber-400 pl-3 py-0.5">
                      {capa.vacio[locale]}
                    </p>
                  </div>
                </div>
              </details>

              {idx < capas.length - 1 && (
                <div
                  className="flex justify-center text-slate-300 py-2"
                  aria-hidden="true"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 3v12M3 11l6 4 6-4" />
                  </svg>
                </div>
              )}
            </li>
          ))}
        </ol>

        <p className="mt-10 text-center text-base sm:text-lg text-institucional-900 font-medium text-pretty max-w-3xl mx-auto">
          {dict.tagline}
        </p>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-sm text-slate-700 text-pretty">{value}</p>
    </div>
  );
}
