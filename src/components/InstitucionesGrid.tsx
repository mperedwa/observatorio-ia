import Link from 'next/link';
import { instituciones } from '@/data/instituciones';
import { proyectos } from '@/data/proyectos';
import { ProyectoCard } from './ProyectoCard';
import {
  formatearFechaCatalogo,
  obtenerUltimaVerificacion,
  ordenarProyectosExpediente,
  resumirInstitucionCatalogo,
} from '@/data/presentacion-catalogo';
import { applyCounters } from '@/i18n/applyCounters';
import { COUNTERS } from '@/data/counters';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function InstitucionesGrid({
  locale,
  t,
  headingLevel = 'h2',
}: {
  locale: Locale;
  t: Dictionary;
  headingLevel?: 'h1' | 'h2';
}) {
  const Heading = headingLevel;
  const ItemHeading = headingLevel === 'h1' ? 'h2' : 'h3';

  return (
    <section
      id="instituciones"
      className={`max-w-7xl mx-auto px-6 ${headingLevel === 'h1' ? 'pb-20 pt-10' : 'py-20'}`}
    >
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          {t.instituciones.kicker}
        </p>
        <Heading className="mt-2 font-editorial text-4xl font-semibold leading-tight tracking-[-0.02em] text-editorial-ink text-balance sm:text-6xl">
          {t.instituciones.titulo}
        </Heading>
        <p className="mt-3 text-slate-600 max-w-2xl">
          {applyCounters(t.instituciones.sub, COUNTERS)}
        </p>
      </header>

      <div className="border-t border-editorial-rule">
        {instituciones.map((inst, index) => {
          const proyectosInst = proyectos.filter((p) => p.institucionId === inst.id);
          const resumen = resumirInstitucionCatalogo(proyectosInst);
          const proyectosOrdenados = ordenarProyectosExpediente(proyectosInst, locale);
          const ultimaVerificacion = obtenerUltimaVerificacion(proyectosInst);
          return (
            <article
              key={inst.id}
              className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-b border-editorial-rule py-8 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-5 sm:py-10"
            >
              <span
                aria-hidden
                className="pt-1 font-mono text-xs tabular-nums text-slate-400"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
                  <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                      {t.instituciones.tipoLabel[inst.tipo]}
                    </p>
                    <Link
                      href={`/${locale}/instituciones/${inst.id}`}
                      className="group mt-1 inline-block underline-offset-4 hover:underline"
                    >
                      <ItemHeading className="font-editorial text-3xl font-semibold leading-tight text-editorial-ink sm:text-4xl">
                        {inst.nombreCorto[locale]}
                      </ItemHeading>
                    </Link>
                    <p className="mt-3 text-sm leading-relaxed text-editorial-muted text-pretty">
                      {inst.resumen[locale]}
                    </p>
                  </div>

                  <div className="min-w-[7rem] text-left sm:text-right">
                    <div className="font-editorial text-5xl font-semibold leading-none text-editorial-ink tabular-nums">
                      {resumen.total}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {resumen.total === 1
                        ? t.panorama.proyectoLabel
                        : t.instituciones.proyectosLabel}
                    </div>
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-2 border-y border-editorial-rule text-xs sm:grid-cols-4">
                  <div className="border-b border-r border-editorial-rule py-3 pr-3 sm:border-b-0">
                    <dt className="text-slate-500">{t.catalogo.capas.verificado.corto}</dt>
                    <dd className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
                      <span aria-hidden className="h-3 w-1 bg-emerald-600" />
                      <span className="tabular-nums">{resumen.verificado}</span>
                    </dd>
                  </div>
                  <div className="border-b border-editorial-rule py-3 pl-3 sm:border-b-0 sm:border-r sm:pr-3">
                    <dt className="text-slate-500">{t.catalogo.capas.seguimiento.corto}</dt>
                    <dd className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
                      <span aria-hidden className="h-3 w-1 bg-amber-500" />
                      <span className="tabular-nums">{resumen.seguimiento}</span>
                    </dd>
                  </div>
                  <div className="border-r border-editorial-rule py-3 pr-3 sm:pl-3">
                    <dt className="text-slate-500">{t.catalogo.capas.ecosistema.corto}</dt>
                    <dd className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
                      <span aria-hidden className="h-3 w-1 bg-sky-600" />
                      <span className="tabular-nums">{resumen.ecosistema}</span>
                    </dd>
                  </div>
                  <div className="py-3 pl-3">
                    <dt className="text-slate-500">{t.instituciones.ultimaVerificacionLabel}</dt>
                    <dd className="mt-1 font-semibold text-slate-800">
                      {ultimaVerificacion ? (
                        <time dateTime={ultimaVerificacion}>
                          {formatearFechaCatalogo(ultimaVerificacion, locale)}
                        </time>
                      ) : (
                        '—'
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  <div>
                    <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      {t.instituciones.actividadLabel}
                    </p>
                    <ul className="space-y-2">
                      {proyectosOrdenados.slice(0, 3).map((proyecto) => (
                        <li key={proyecto.id}>
                          <ProyectoCard
                            proyecto={proyecto}
                            locale={locale}
                            t={t}
                            variant="compact"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={`/${locale}/instituciones/${inst.id}`}
                    className="text-sm font-semibold text-institucional-700 underline-offset-4 hover:underline"
                  >
                    {t.instituciones.verDetalle} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
