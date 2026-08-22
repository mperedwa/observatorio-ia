import type { ReactNode } from 'react';
import type { EstadoEvaluacion } from '@/data/modelo-evidencia';

export interface ExpedienteMetaItem {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
}

const estadoMarker: Record<EstadoEvaluacion, string> = {
  confirmado: 'bg-emerald-600',
  'parcialmente-confirmado': 'bg-amber-500',
  inferido: 'bg-violet-600',
  'no-determinado': 'border border-slate-400 bg-white',
  contradicho: 'bg-rose-600',
};

export function ExpedienteMeta({ items }: { items: ExpedienteMetaItem[] }) {
  return (
    <dl className="grid border-y border-editorial-rule sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={`${index}-${item.label}`}
          className="min-w-0 border-b border-editorial-rule py-4 last:border-b-0 sm:px-5 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0 lg:[&:nth-child(odd)]:border-r"
        >
          <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm font-semibold leading-snug text-editorial-ink">
            {item.value}
          </dd>
          {item.detail && (
            <dd className="mt-1 text-xs leading-relaxed text-slate-500">
              {item.detail}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}

export function EstadoDocumental({
  estado,
  label,
}: {
  estado: EstadoEvaluacion;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
      <span aria-hidden className={`h-2 w-2 flex-shrink-0 ${estadoMarker[estado]}`} />
      {label}
    </span>
  );
}

export function EncabezadoSeccionExpediente({
  index,
  title,
  description,
  id,
}: {
  index: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <header className="grid gap-2 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-5">
      <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-400">
        {index}
      </span>
      <div>
        <h2
          id={id}
          className="font-editorial text-3xl font-semibold leading-tight tracking-[-0.015em] text-editorial-ink sm:text-4xl"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-editorial-muted">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
