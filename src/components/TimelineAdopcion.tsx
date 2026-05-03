'use client';

import Link from 'next/link';
import { useState } from 'react';
import { proyectos } from '@/data/proyectos';
import { instituciones } from '@/data/instituciones';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

const institucionColor: Record<string, { dot: string; text: string; bg: string }> = {
  'poder-judicial': { dot: 'bg-indigo-600', text: 'text-indigo-700', bg: 'bg-indigo-50' },
  ccss: { dot: 'bg-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  hacienda: { dot: 'bg-amber-600', text: 'text-amber-700', bg: 'bg-amber-50' },
  mep: { dot: 'bg-rose-600', text: 'text-rose-700', bg: 'bg-rose-50' },
  micitt: { dot: 'bg-sky-600', text: 'text-sky-700', bg: 'bg-sky-50' },
  cenat: { dot: 'bg-violet-600', text: 'text-violet-700', bg: 'bg-violet-50' },
  ucr: { dot: 'bg-teal-600', text: 'text-teal-700', bg: 'bg-teal-50' },
};

export function TimelineAdopcion({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  const datados = proyectos.filter((p) => p.desde);
  const minYear = Math.min(...datados.map((p) => Number(p.desde)));
  const maxYear = Math.max(...datados.map((p) => Number(p.desde)));
  const range = maxYear - minYear || 1;
  const allYears = Array.from({ length: range + 1 }, (_, i) => minYear + i);

  const porInstitucion = instituciones
    .map((inst) => ({
      inst,
      proyectos: datados.filter((p) => p.institucionId === inst.id).sort(
        (a, b) => Number(a.desde) - Number(b.desde),
      ),
    }))
    .filter((row) => row.proyectos.length > 0);

  return (
    <section
      id="timeline"
      className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {t.timeline.kicker}
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 text-balance">
            {t.timeline.titulo}
          </h2>
          <p className="mt-3 text-slate-600 max-w-3xl text-pretty">{t.timeline.sub}</p>
        </header>

        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-8 overflow-x-auto overflow-y-visible">
          <div className="min-w-[640px] pb-40">
            {/* eje X: TODOS los años del rango, no solo los que tienen proyectos */}
            <div className="relative h-8 mb-6 grid grid-cols-[140px_1fr] gap-4 items-end">
              <div />
              <div className="relative h-8">
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
                {allYears.map((y) => {
                  const x = ((y - minYear) / range) * 100;
                  return (
                    <div
                      key={y}
                      className="absolute top-0 -translate-x-1/2 text-xs font-medium text-slate-500 tabular-nums"
                      style={{ left: `${x}%` }}
                    >
                      <div className="pb-1">{y}</div>
                      <div className="w-px h-3 bg-slate-300 mx-auto" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* filas por institución */}
            <div className="space-y-3">
              {porInstitucion.map(({ inst, proyectos: ps }) => {
                const color = institucionColor[inst.id];
                return (
                  <div key={inst.id} className="grid grid-cols-[140px_1fr] gap-4 items-center">
                    <div
                      className={`text-xs font-semibold uppercase tracking-wide ${color.text}`}
                    >
                      {inst.nombreCorto[locale]}
                    </div>
                    <div className="relative h-10">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
                      {ps.map((p) => {
                        const x = ((Number(p.desde) - minYear) / range) * 100;
                        const isHover = hoverId === p.id;
                        const isLeftEdge = x < 18;
                        const isRightEdge = x > 82;
                        const tooltipAlignClass = isLeftEdge
                          ? 'left-0'
                          : isRightEdge
                            ? 'right-0'
                            : 'left-1/2 -translate-x-1/2';
                        return (
                          <Link
                            key={p.id}
                            href={`/${locale}/proyectos/${p.id}`}
                            onMouseEnter={() => setHoverId(p.id)}
                            onMouseLeave={() => setHoverId(null)}
                            onFocus={() => setHoverId(p.id)}
                            onBlur={() => setHoverId(null)}
                            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${x}%` }}
                          >
                            <span
                              className={`block w-3.5 h-3.5 rounded-full ring-4 ring-white ${color.dot} hover:scale-125 transition-transform`}
                              aria-label={p.titulo[locale]}
                            />
                            {isHover && (
                              <div
                                className={`absolute z-30 top-full mt-3 w-64 rounded-md border border-slate-200 bg-white p-3 shadow-lg ${tooltipAlignClass}`}
                              >
                                <div
                                  className={`inline-block text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${color.bg} ${color.text} mb-1`}
                                >
                                  {inst.nombreCorto[locale]} · {p.desde}
                                </div>
                                <div className="text-sm font-semibold text-slate-900 leading-snug">
                                  {p.titulo[locale]}
                                </div>
                                {p.resultado && (
                                  <div className="mt-1 text-xs text-slate-600 leading-snug">
                                    {p.resultado[locale]}
                                  </div>
                                )}
                                {!p.resultado && (
                                  <div className="mt-1 text-xs text-slate-400 italic">
                                    {t.timeline.sinResultadoLabel}
                                  </div>
                                )}
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
