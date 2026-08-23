import type { CapaCatalogo } from '@/data/presentacion-catalogo';

export const capaChip: Record<CapaCatalogo, string> = {
  verificado: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  seguimiento: 'border-amber-200 bg-amber-50 text-amber-800',
  ecosistema: 'border-sky-200 bg-sky-50 text-sky-800',
};

export const capaDot: Record<CapaCatalogo, string> = {
  verificado: 'bg-emerald-500',
  seguimiento: 'bg-amber-500',
  ecosistema: 'bg-sky-500',
};

export const capaMarker: Record<CapaCatalogo, string> = {
  verificado: 'bg-emerald-600',
  seguimiento: 'bg-amber-500',
  ecosistema: 'bg-sky-600',
};

export const evaluacionChip: Record<string, string> = {
  confirmado: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'parcialmente-confirmado': 'border-lime-200 bg-lime-50 text-lime-800',
  inferido: 'border-violet-200 bg-violet-50 text-violet-800',
  'no-determinado': 'border-slate-200 bg-slate-100 text-slate-700',
  'no-aplica': 'border-slate-200 bg-white text-slate-600',
  contradicho: 'border-rose-200 bg-rose-50 text-rose-800',
};
