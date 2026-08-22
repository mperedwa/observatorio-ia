import {
  EncabezadoSeccionExpediente,
  MarcaDocumental,
  type TonoDocumental,
} from '@/components/ExpedienteEditorial';
import { capas, type FuerzaTipo } from '@/data/marcoPais';
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

export function ArquitecturaCapas({
  locale,
  t,
  sectionIndex = '02',
}: {
  locale: Locale;
  t: Dictionary;
  sectionIndex?: string;
}) {
  const dict = t.marcoPais.arquitectura;
  const campos = dict.campos;
  const fuerzaLabels = t.marcoPais.fuerzaTipos;

  return (
    <section id="arquitectura" className="border-t border-editorial-rule bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <EncabezadoSeccionExpediente
          index={sectionIndex}
          title={dict.titulo}
          description={dict.sub}
        />

        <ol className="mt-9 border-t border-editorial-rule" aria-label={dict.titulo}>
          {capas.map((capa, index) => (
            <li key={capa.id}>
              <details open className="group border-b border-editorial-rule">
                <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_minmax(0,1fr)_1rem] gap-x-3 px-1 py-6 marker:hidden hover:bg-editorial-paper/55 focus-visible:outline-offset-[-3px] sm:grid-cols-[3.25rem_minmax(0,1fr)_10rem_1.5rem] sm:gap-x-5 sm:px-3 [&::-webkit-details-marker]:hidden">
                  <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      {dict.capaLabel} {capa.orden}
                    </p>
                    <h3 className="mt-1 font-editorial text-2xl font-semibold leading-tight text-editorial-ink sm:text-3xl">
                      {capa.nombreCorto[locale]}
                    </h3>
                  </div>
                  <MarcaDocumental
                    label={fuerzaLabels[capa.fuerzaTipo]}
                    tone={fuerzaTone[capa.fuerzaTipo]}
                    className="col-start-2 mt-3 sm:col-start-3 sm:mt-1"
                  />
                  <span aria-hidden className="col-start-3 row-start-1 pt-1 text-slate-500 transition-transform group-open:rotate-180 sm:col-start-4">
                    ↓
                  </span>
                </summary>

                <div className="ml-[3.25rem] border-t border-editorial-rule bg-editorial-paper/35 px-5 py-6 sm:ml-[4.5rem] sm:px-7">
                  <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                    <Field label={campos.instrumentos} value={capa.instrumentos[locale]} />
                    <Field label={campos.funcion} value={capa.funcion[locale]} />
                    <Field label={campos.alcance} value={capa.alcance[locale]} />
                    <Field label={campos.fuerza} value={capa.fuerza[locale]} />
                  </div>

                  <div className="mt-6 border-l-2 border-editorial-accent pl-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-editorial-accent">
                      {campos.vacio}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700 text-pretty">
                      {capa.vacio[locale]}
                    </p>
                  </div>

                  {capa.nota && (
                    <p className="mt-5 border-t border-editorial-rule pt-4 text-sm italic leading-relaxed text-slate-600 text-pretty">
                      {capa.nota[locale]}
                    </p>
                  )}

                  {capa.enlaces && capa.enlaces.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-editorial-rule pt-4">
                      {capa.enlaces.map((enlace) => (
                        <a
                          key={enlace.url}
                          href={enlace.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
                        >
                          {enlace.label[locale]} <span aria-hidden>↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ol>

        <p className="ml-0 mt-10 max-w-3xl border-l-2 border-institucional-700 pl-4 font-editorial text-xl font-semibold leading-snug text-editorial-ink sm:ml-[4.5rem] sm:text-2xl">
          {dict.tagline}
        </p>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-slate-700 text-pretty">{value}</p>
    </div>
  );
}
