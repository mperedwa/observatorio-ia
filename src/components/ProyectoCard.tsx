import Link from 'next/link';
import type { Proyecto } from '@/data/proyectos';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

const estadoDot: Record<Proyecto['estado'], string> = {
  operativo: 'bg-emerald-500',
  piloto: 'bg-amber-500',
  planificado: 'bg-slate-300',
};

const estadoChip: Record<Proyecto['estado'], string> = {
  operativo: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  piloto: 'bg-amber-50 text-amber-800 border-amber-200',
  planificado: 'bg-slate-100 text-slate-700 border-slate-300',
};

export function ProyectoCard({
  proyecto,
  locale,
  t,
  variant = 'compact',
}: {
  proyecto: Proyecto;
  locale: Locale;
  t: Dictionary;
  variant?: 'compact' | 'full';
}) {
  const href = `/${locale}/proyectos/${proyecto.id}`;
  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className="text-xs text-slate-700 flex gap-2 group hover:text-institucional-700 transition-colors"
      >
        <span
          className={`mt-1 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${estadoDot[proyecto.estado]}`}
          aria-hidden
        />
        <span className="leading-snug group-hover:underline underline-offset-2">
          {proyecto.titulo[locale]}
        </span>
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="block border border-slate-200 rounded-lg p-5 bg-white hover:border-institucional-700 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-slate-900 group-hover:underline">
          {proyecto.titulo[locale]}
        </h3>
        <span
          className={`text-xs px-2 py-0.5 rounded border whitespace-nowrap ${estadoChip[proyecto.estado]}`}
        >
          {t.estado[proyecto.estado]}
        </span>
      </div>
      <p className="text-sm text-slate-600 text-pretty">{proyecto.descripcion[locale]}</p>
      {proyecto.desde && (
        <p className="mt-3 text-xs text-slate-500">
          {t.proyectoDetalle.desdeLabel}: {proyecto.desde}
        </p>
      )}
    </Link>
  );
}
