import {
  EncabezadoSeccionExpediente,
  MarcaDocumental,
  type TonoDocumental,
} from '@/components/ExpedienteEditorial';
import {
  applyConteosLegislacion,
  expedientes,
  type EstadoLey,
} from '@/data/legislacion';
import { notasCoyuntura } from '@/data/coyuntura';
import { formatearFechaCatalogo } from '@/data/presentacion-catalogo';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

const estadoTone: Record<EstadoLey, TonoDocumental> = {
  'en-comision': 'atencion',
  dictaminado: 'parcial',
  'primer-debate': 'parcial',
  'segundo-debate': 'parcial',
  archivado: 'neutral',
  aprobada: 'confirmado',
};

export function Legislacion({
  locale,
  t,
  headingLevel = 'h2',
}: {
  locale: Locale;
  t: Dictionary;
  headingLevel?: 'h1' | 'h2';
}) {
  const Heading = headingLevel;
  const ItemHeading = 'h3';
  const registroIndex = notasCoyuntura.length > 0 ? '02' : '01';

  return (
    <section id="legislacion" className="border-y border-editorial-rule bg-white">
      <div className={`mx-auto max-w-7xl px-6 ${headingLevel === 'h1' ? 'pb-20 pt-10' : 'py-20'}`}>
        <header className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
            {t.legislacion.kicker}
          </p>
          <Heading className="mt-3 font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
            {applyConteosLegislacion(t.legislacion.titulo)}
          </Heading>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-editorial-muted">
            {applyConteosLegislacion(t.legislacion.sub)}
          </p>
        </header>

        {notasCoyuntura.length > 0 && (
          <section className="mt-16" aria-labelledby="coyuntura-legislativa">
            <EncabezadoSeccionExpediente
              index="01"
              id="coyuntura-legislativa"
              title={t.legislacion.coyunturaTitulo}
              description={t.legislacion.coyunturaSub}
            />

            <div className="mt-8 border-t border-editorial-rule">
              {notasCoyuntura.map((nota, index) => (
                <article
                  key={nota.id}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-editorial-rule py-7 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-x-5 sm:py-9"
                >
                  <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-editorial-accent">
                        {t.legislacion.coyunturaKicker}
                      </span>
                      <span aria-hidden className="text-slate-300">/</span>
                      <time dateTime={nota.fecha} className="text-xs tabular-nums text-slate-500">
                        {formatearFechaCatalogo(nota.fecha, locale)}
                      </time>
                    </div>
                    <ItemHeading className="mt-2 font-editorial text-2xl font-semibold leading-tight text-editorial-ink sm:text-3xl">
                      {nota.titulo[locale]}
                    </ItemHeading>
                    <p className="mt-4 max-w-5xl text-sm leading-relaxed text-slate-700 text-pretty">
                      {nota.texto[locale]}
                    </p>
                    {nota.implicacion && (
                      <p className="mt-4 max-w-5xl border-l-2 border-editorial-accent pl-4 text-sm leading-relaxed text-slate-600 text-pretty">
                        {nota.implicacion[locale]}
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-editorial-rule pt-4 text-xs">
                      {nota.fuentes.map((fuente, fuenteIndex) => (
                        <a
                          key={fuente.url}
                          href={fuente.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={fuente.descripcion[locale]}
                          className="font-semibold text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
                        >
                          {fuente.nombre
                            ? `${fuente.nombre[locale]} ↗`
                            : nota.fuentes.length > 1
                              ? `${t.legislacion.verFuente} ${fuenteIndex + 1} ↗`
                              : `${t.legislacion.verFuente} ↗`}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20" aria-labelledby="registro-legislativo">
          <EncabezadoSeccionExpediente
            index={registroIndex}
            id="registro-legislativo"
            title={t.legislacion.registroTitulo}
            description={t.legislacion.registroSub}
          />

          <div className="mt-8 border-t border-editorial-rule">
            {expedientes.map((expediente, index) => (
              <article
                key={expediente.numero}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-editorial-rule py-8 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-x-5 sm:py-10 lg:grid-cols-[3.25rem_10rem_minmax(0,1fr)]"
              >
                <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 lg:pr-8">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    {t.legislacion.expedienteLabel}
                  </p>
                  <p className="mt-1 font-editorial text-3xl font-semibold tabular-nums text-institucional-900">
                    {expediente.numero}
                  </p>
                </div>

                <div className="col-start-2 mt-5 min-w-0 lg:col-start-3 lg:mt-0">
                  <ItemHeading className="font-editorial text-2xl font-semibold leading-tight text-editorial-ink sm:text-3xl">
                    {expediente.titulo[locale]}
                  </ItemHeading>
                  <p className="mt-4 max-w-5xl text-sm leading-relaxed text-slate-700 text-pretty">
                    {expediente.resumen[locale]}
                  </p>

                  <dl className="mt-6 grid border-y border-editorial-rule text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div className="border-b border-editorial-rule py-4 sm:border-r sm:pr-4 lg:border-b-0">
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        {t.legislacion.estadoOficialLabel}
                      </dt>
                      <dd className="mt-2">
                        <MarcaDocumental
                          label={t.legislacion.estados[expediente.estado]}
                          tone={estadoTone[expediente.estado]}
                        />
                      </dd>
                    </div>
                    <div className="border-b border-editorial-rule py-4 sm:pl-4 lg:border-b-0 lg:border-r lg:pr-4">
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        {t.legislacion.alcanceLabel}
                      </dt>
                      <dd className="mt-2 text-slate-700">
                        {t.legislacion.alcances[expediente.alcanceIA]}
                      </dd>
                    </div>
                    <div className="py-4 sm:col-span-2 lg:col-span-1 lg:pl-4">
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        {t.legislacion.verificadoLabel}
                      </dt>
                      <dd className="mt-2 text-slate-700">
                        <time dateTime={expediente.fechaUltimaVerificacion}>
                          {formatearFechaCatalogo(expediente.fechaUltimaVerificacion, locale)}
                        </time>
                      </dd>
                    </div>
                  </dl>

                  <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-semibold text-slate-500">{t.legislacion.comisionLabel}</dt>
                      <dd className="mt-1 text-slate-700">{expediente.comision[locale]}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-500">{t.legislacion.presentadoLabel}</dt>
                      <dd className="mt-1 text-slate-700">
                        <time dateTime={expediente.presentado}>{expediente.presentado}</time>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 border-t border-editorial-rule pt-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      {t.legislacion.fuentesOficialesLabel}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      <a
                        href={expediente.fuenteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
                      >
                        {t.legislacion.verFuente} ↗
                      </a>
                      <a
                        href={expediente.fuenteEstadoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
                      >
                        {t.legislacion.verEstadoOficial} ↗
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
