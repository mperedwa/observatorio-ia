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
import { capaChip, capaDot } from './catalogoStyles';

export function ProyectoCard({
  proyecto,
  locale,
  t,
  variant = 'compact',
  showInstitution = false,
}: {
  proyecto: Proyecto;
  locale: Locale;
  t: Dictionary;
  variant?: 'compact' | 'full';
  showInstitution?: boolean;
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
          className={`mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${capaDot[capa]}`}
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
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-institucional-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-500 focus-visible:ring-offset-2"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${capaChip[capa]}`}
        >
          {t.catalogo.capas[capa].corto}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700">
          {t.catalogo.fases[fase]}
        </span>
      </div>

      <h3 className="text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-institucional-700">
        {proyecto.titulo[locale]}
      </h3>

      {showInstitution && institucion && (
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          {institucion.nombreCorto[locale]}
        </p>
      )}

      <p className="mt-3 text-sm leading-relaxed text-slate-600 text-pretty">
        {proyecto.descripcion[locale]}
      </p>

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span>{t.catalogo.tipos[tipo]}</span>
          {fechaReferencia && (
            <>
              <span aria-hidden>·</span>
              <span>
                {t.timeline.fechaLabel[fechaReferencia.tipo]}:{' '}
                {formatearFechaCatalogo(fechaReferencia.fecha, locale)}
              </span>
            </>
          )}
        </div>
        {proyecto.fechaUltimaVerificacion && (
          <p className="mt-2 text-[11px] text-slate-500">
            {t.catalogo.ultimaVerificacionLabel}:{' '}
            {formatearFechaCatalogo(proyecto.fechaUltimaVerificacion, locale)}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-institucional-700">
          {t.catalogo.fichaCta}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
