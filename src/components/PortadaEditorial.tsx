import Link from 'next/link';
import { changelog } from '@/data/changelog';
import { instituciones } from '@/data/instituciones';
import {
  applyConteosLegislacion,
  expedientes,
} from '@/data/legislacion';
import {
  esAdopcionVerificada,
  resolverFaseImplementacion,
} from '@/data/modelo-evidencia';
import {
  formatearFechaCatalogo,
  obtenerFechaReferencia,
} from '@/data/presentacion-catalogo';
import { proyectos } from '@/data/proyectos';
import { COUNTERS } from '@/data/counters';
import { applyCounters } from '@/i18n/applyCounters';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

const HOME_SELECTION_LIMIT = 3;
const HOME_CHANGE_LIMIT = 3;

function fechaDocumental(proyecto: (typeof proyectos)[number]): string {
  return obtenerFechaReferencia(proyecto)?.fecha ?? proyecto.fechaPrimeraEvidencia ?? '';
}

/**
 * La portada no mantiene una selección editorial manual. Enseña las fichas
 * verificadas más recientemente y resuelve empates con datos estables.
 */
const seleccionVerificada = proyectos
  .filter(esAdopcionVerificada)
  .sort((a, b) => {
    const porVerificacion = (b.fechaUltimaVerificacion ?? '').localeCompare(
      a.fechaUltimaVerificacion ?? '',
    );
    if (porVerificacion !== 0) return porVerificacion;

    const porFechaDocumental = fechaDocumental(b).localeCompare(fechaDocumental(a));
    if (porFechaDocumental !== 0) return porFechaDocumental;

    return a.id.localeCompare(b.id);
  })
  .slice(0, HOME_SELECTION_LIMIT);

function primerEnunciado(texto: string): string {
  const cierre = texto.indexOf('. ');
  return cierre === -1 ? texto : texto.slice(0, cierre + 1);
}

export function PortadaEditorial({ locale, t }: { locale: Locale; t: Dictionary }) {
  const ultimoCambioLegislativo = changelog.find((entrada) => entrada.tipo === 'legislacion');
  const ultimaVerificacionLegislativa = expedientes.reduce(
    (ultima, expediente) =>
      expediente.fechaUltimaVerificacion > ultima
        ? expediente.fechaUltimaVerificacion
        : ultima,
    '',
  );

  const rutas = [
    {
      key: 'proyectos',
      href: `/${locale}/proyectos`,
      label: t.nav.proyectos,
      description: t.home.rutas.descripciones.proyectos,
    },
    {
      key: 'instituciones',
      href: `/${locale}/instituciones`,
      label: t.nav.instituciones,
      description: t.home.rutas.descripciones.instituciones,
    },
    {
      key: 'enia',
      href: `/${locale}/enia`,
      label: t.nav.enia,
      description: t.home.rutas.descripciones.enia,
    },
    {
      key: 'legislacion',
      href: `/${locale}/legislacion`,
      label: t.nav.legislacion,
      description: t.home.rutas.descripciones.legislacion,
    },
    {
      key: 'indicadores',
      href: `/${locale}/indicadores`,
      label: t.nav.indicadores,
      description: t.home.rutas.descripciones.indicadores,
    },
    {
      key: 'metodologia',
      href: `/${locale}/quien-mantiene`,
      label: t.home.rutas.metodologiaLabel,
      description: t.home.rutas.descripciones.metodologia,
    },
  ] as const;

  return (
    <>
      <section id="evidencia-destacada" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <header className="grid gap-6 border-b border-editorial-rule pb-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-institucional-700">
                {t.home.seleccion.kicker}
              </p>
              <h2 className="mt-3 font-editorial text-4xl font-semibold leading-tight tracking-[-0.02em] text-editorial-ink text-balance sm:text-5xl">
                {t.home.seleccion.titulo}
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-editorial-muted text-pretty">
                {t.home.seleccion.sub}
              </p>
            </div>
            <p className="border-l-2 border-editorial-accent pl-4 text-xs leading-relaxed text-slate-500">
              {t.home.seleccion.regla}
            </p>
          </header>

          <ol className="divide-y divide-editorial-rule border-b border-editorial-rule">
            {seleccionVerificada.map((proyecto, index) => {
              const institucion = instituciones.find(
                (item) => item.id === proyecto.institucionId,
              );
              const fase = resolverFaseImplementacion(proyecto);
              const lectura = proyecto.resultado?.[locale] ?? proyecto.descripcion[locale];

              return (
                <li
                  key={proyecto.id}
                  className="grid gap-5 py-8 sm:grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[3rem_minmax(0,1fr)_14rem] lg:gap-8"
                >
                  <span
                    aria-hidden
                    className="font-editorial text-2xl font-semibold tabular-nums text-slate-500"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      {institucion && (
                        <Link
                          href={`/${locale}/instituciones/${institucion.id}`}
                          className="font-semibold text-institucional-700 hover:underline"
                        >
                          {institucion.nombreCorto[locale]}
                        </Link>
                      )}
                      <span aria-hidden>·</span>
                      <span>{t.catalogo.fases[fase]}</span>
                    </div>
                    <h3 className="mt-2 font-editorial text-2xl font-semibold leading-tight text-editorial-ink text-balance sm:text-3xl">
                      <Link
                        href={`/${locale}/proyectos/${proyecto.id}`}
                        className="underline-offset-4 hover:text-institucional-700 hover:underline"
                      >
                        {proyecto.titulo[locale]}
                      </Link>
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-editorial-muted text-pretty sm:text-base">
                      {lectura}
                    </p>
                  </div>
                  <div className="sm:col-start-2 lg:col-start-3">
                    {proyecto.fechaUltimaVerificacion && (
                      <p className="text-xs leading-relaxed text-slate-500">
                        <span className="block font-semibold uppercase tracking-[0.1em] text-slate-600">
                          {t.catalogo.ultimaVerificacionLabel}
                        </span>
                        <time dateTime={proyecto.fechaUltimaVerificacion}>
                          {formatearFechaCatalogo(
                            proyecto.fechaUltimaVerificacion,
                            locale,
                          )}
                        </time>
                      </p>
                    )}
                    <Link
                      href={`/${locale}/proyectos/${proyecto.id}`}
                      className="mt-4 inline-flex border-b border-editorial-ink pb-0.5 text-xs font-semibold text-editorial-ink hover:border-institucional-700 hover:text-institucional-700"
                    >
                      {t.catalogo.fichaCta} <span aria-hidden className="ml-1">→</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>

          <Link
            href={`/${locale}/proyectos`}
            className="mt-7 inline-flex text-sm font-semibold text-institucional-700 hover:underline"
          >
            {applyCounters(t.catalogo.verTodas, COUNTERS)} <span aria-hidden className="ml-1">→</span>
          </Link>
        </div>
      </section>

      <section id="lectura-pais" className="border-y border-editorial-rule bg-editorial-paper">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <header className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-institucional-700">
              {t.home.contexto.kicker}
            </p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold leading-tight tracking-[-0.02em] text-editorial-ink text-balance sm:text-5xl">
              {t.home.contexto.titulo}
            </h2>
          </header>

          <div className="mt-10 grid border-y border-editorial-rule lg:grid-cols-2">
            <article className="py-8 lg:border-r lg:border-editorial-rule lg:pr-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {t.home.contexto.marcoLabel}
              </p>
              <h3 className="mt-3 font-editorial text-3xl font-semibold leading-tight text-editorial-ink">
                {t.marcoPais.titulo}
              </h3>
              <p className="mt-4 max-w-xl leading-relaxed text-editorial-muted text-pretty">
                {t.marcoPais.tesis}
              </p>
              <p className="mt-4 text-xs text-slate-500">{t.marcoPais.ultimaActualizacion}</p>
              <Link
                href={`/${locale}/marco-pais`}
                className="mt-6 inline-flex text-sm font-semibold text-institucional-700 hover:underline"
              >
                {t.nav.marcoPais} <span aria-hidden className="ml-1">→</span>
              </Link>
            </article>

            <article className="border-t border-editorial-rule py-8 lg:border-t-0 lg:pl-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {t.home.contexto.legislacionLabel}
              </p>
              <h3 className="mt-3 font-editorial text-3xl font-semibold leading-tight text-editorial-ink">
                {applyConteosLegislacion(t.legislacion.titulo)}
              </h3>
              {ultimoCambioLegislativo && (
                <>
                  <p className="mt-4 max-w-xl leading-relaxed text-editorial-muted text-pretty">
                    {primerEnunciado(ultimoCambioLegislativo.actualizacion[locale])}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    {t.home.contexto.ultimaActividadLabel}:{' '}
                    <time dateTime={ultimoCambioLegislativo.fecha}>
                      {formatearFechaCatalogo(ultimoCambioLegislativo.fecha, locale)}
                    </time>
                  </p>
                </>
              )}
              {ultimaVerificacionLegislativa && (
                <p className="mt-1 text-xs text-slate-500">
                  {t.legislacion.verificadoLabel}:{' '}
                  <time dateTime={ultimaVerificacionLegislativa}>
                    {formatearFechaCatalogo(ultimaVerificacionLegislativa, locale)}
                  </time>
                </p>
              )}
              <Link
                href={`/${locale}/legislacion`}
                className="mt-6 inline-flex text-sm font-semibold text-institucional-700 hover:underline"
              >
                {t.nav.legislacion} <span aria-hidden className="ml-1">→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section id="actualizaciones" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-institucional-700">
              {t.home.cambios.kicker}
            </p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold leading-tight tracking-[-0.02em] text-editorial-ink text-balance sm:text-5xl">
              {t.home.cambios.titulo}
            </h2>
            <p className="mt-4 leading-relaxed text-editorial-muted">
              {t.home.cambios.sub}
            </p>
          </header>

          <ol className="mt-9 divide-y divide-editorial-rule border-y border-editorial-rule">
            {changelog.slice(0, HOME_CHANGE_LIMIT).map((entrada, index) => (
              <li
                key={`${entrada.fecha}-${entrada.commit_sha ?? index}`}
                className="grid gap-3 py-6 sm:grid-cols-[8rem_minmax(0,1fr)] lg:grid-cols-[8rem_minmax(0,1fr)_16rem] lg:gap-8"
              >
                <div>
                  <time
                    dateTime={entrada.fecha}
                    className="font-editorial text-lg font-semibold tabular-nums text-editorial-ink"
                  >
                    {formatearFechaCatalogo(entrada.fecha, locale)}
                  </time>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {t.changelog.tipos[entrada.tipo]}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-slate-700 text-pretty sm:text-base">
                  {primerEnunciado(entrada.actualizacion[locale])}
                </p>
                <div className="text-xs leading-relaxed text-slate-500 sm:col-start-2 lg:col-start-3">
                  {entrada.fuente_url ? (
                    <a
                      href={entrada.fuente_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
                    >
                      {entrada.fuente[locale]} <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    entrada.fuente[locale]
                  )}
                </div>
              </li>
            ))}
          </ol>

          <Link
            href={`/${locale}/historial`}
            className="mt-7 inline-flex text-sm font-semibold text-institucional-700 hover:underline"
          >
            {t.changelog.verHistorialCompleto} <span aria-hidden className="ml-1">→</span>
          </Link>
        </div>
      </section>

      <section id="explorar" className="border-y border-editorial-rule bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <header className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-institucional-700">
              {t.home.rutas.kicker}
            </p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold leading-tight tracking-[-0.02em] text-editorial-ink text-balance sm:text-5xl">
              {t.home.rutas.titulo}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-editorial-muted text-pretty">
              {t.home.rutas.sub}
            </p>
          </header>

          <ol className="mt-10 grid border-y border-editorial-rule md:grid-cols-2">
            {rutas.map((ruta, index) => (
              <li
                key={ruta.key}
                className={`border-b border-editorial-rule ${
                  index >= rutas.length - 2 ? 'md:border-b-0' : ''
                } ${index % 2 === 0 ? 'md:border-r' : ''}`}
              >
                <Link
                  href={ruta.href}
                  className={`group grid h-full grid-cols-[2.5rem_minmax(0,1fr)] gap-4 px-1 py-7 transition-colors hover:bg-white md:pr-6 ${
                    index % 2 === 0 ? 'md:pl-1' : 'md:pl-6'
                  }`}
                >
                  <span
                    aria-hidden
                    className="font-editorial text-xl font-semibold tabular-nums text-slate-500"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="font-editorial text-2xl font-semibold text-editorial-ink underline-offset-4 group-hover:text-institucional-700 group-hover:underline">
                      {ruta.label}
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed text-editorial-muted text-pretty">
                      {applyCounters(ruta.description, COUNTERS)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
