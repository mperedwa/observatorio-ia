import Link from 'next/link';
import { instituciones } from '@/data/instituciones';
import type { Proyecto } from '@/data/proyectos';
import {
  formatearFechaCatalogo,
  obtenerCapaCatalogo,
  obtenerFechaReferencia,
} from '@/data/presentacion-catalogo';
import { resolverFaseImplementacion } from '@/data/modelo-evidencia';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { capaMarker } from './catalogoStyles';

export function ProyectoCard({
  proyecto,
  locale,
  t,
  variant = 'compact',
  showInstitution = false,
  registryIndex,
}: {
  proyecto: Proyecto;
  locale: Locale;
  t: Dictionary;
  variant?: 'compact' | 'register';
  showInstitution?: boolean;
  registryIndex?: number;
}) {
  const href = `/${locale}/proyectos/${proyecto.id}`;
  const capa = obtenerCapaCatalogo(proyecto);
  const fase = resolverFaseImplementacion(proyecto);
  const tipo = proyecto.tipoIniciativa ?? 'por-determinar';
  const institucion = instituciones.find((item) => item.id === proyecto.institucionId);
  const fechaReferencia = obtenerFechaReferencia(proyecto);

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className="group flex gap-2 text-xs text-slate-700 transition-colors hover:text-institucional-700"
        aria-label={`${proyecto.titulo[locale]} · ${t.catalogo.capas[capa].titulo}`}
      >
        <span
          className={`mt-1 h-3 w-1 flex-shrink-0 ${capaMarker[capa]}`}
          aria-hidden
        />
        <span className="leading-snug underline-offset-2 group-hover:underline">
          {proyecto.titulo[locale]}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group block border-b border-editorial-rule px-1 py-7 transition-colors duration-150 hover:bg-editorial-paper/55 focus-visible:outline-offset-[-3px] sm:px-4"
    >
      <article className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[3rem_minmax(0,1fr)_1.5rem] sm:gap-x-5">
        <span
          aria-hidden
          className="pt-1 font-mono text-xs tabular-nums text-slate-500"
        >
          {String(registryIndex ?? 0).padStart(2, '0')}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-600">
              <span className={`h-3 w-1 ${capaMarker[capa]}`} aria-hidden />
              {t.catalogo.capas[capa].titulo}
              <span aria-hidden className="text-slate-300">/</span>
              <span className="normal-case tracking-normal text-slate-500">
                {t.catalogo.fases[fase]}
              </span>
            </p>
            {proyecto.fechaUltimaVerificacion && (
              <p className="text-xs text-slate-500">
                {t.catalogo.ultimaVerificacionLabel}:{' '}
                <time dateTime={proyecto.fechaUltimaVerificacion}>
                  {formatearFechaCatalogo(proyecto.fechaUltimaVerificacion, locale)}
                </time>
              </p>
            )}
          </div>

          <h3 className="mt-3 max-w-4xl font-editorial text-2xl font-semibold leading-tight text-editorial-ink underline-offset-4 group-hover:underline sm:text-[1.75rem]">
            {proyecto.titulo[locale]}
          </h3>

          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-editorial-muted text-pretty sm:text-[0.95rem]">
            {proyecto.descripcion[locale]}
          </p>

          <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-slate-200 pt-4 text-xs sm:grid-cols-3">
            {showInstitution && institucion && (
              <div>
                <dt className="font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {t.proyectoDetalle.institucionLabel}
                </dt>
                <dd className="mt-1 text-slate-700">{institucion.nombreCorto[locale]}</dd>
              </div>
            )}
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-slate-500">
                {t.proyectoDetalle.tipoIniciativaLabel}
              </dt>
              <dd className="mt-1 text-slate-700">{t.catalogo.tipos[tipo]}</dd>
            </div>
            {fechaReferencia && (
              <div>
                <dt className="font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {t.timeline.fechaLabel[fechaReferencia.tipo]}
                </dt>
                <dd className="mt-1 text-slate-700">
                  <time dateTime={fechaReferencia.fecha}>
                    {formatearFechaCatalogo(fechaReferencia.fecha, locale)}
                  </time>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <span
          aria-hidden
          className="hidden pt-1 text-xl text-institucional-700 transition-transform duration-150 group-hover:translate-x-1 sm:block"
        >
          →
        </span>
      </article>
    </Link>
  );
}
