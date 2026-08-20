'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { proyectos } from '@/data/proyectos';
import { instituciones } from '@/data/instituciones';
import { esAdopcionVerificada } from '@/data/modelo-evidencia';
import {
  formatearFechaCatalogo,
  obtenerAnioReferencia,
  obtenerCapaCatalogo,
  obtenerFechaReferencia,
} from '@/data/presentacion-catalogo';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { capaChip } from './catalogoStyles';
import { applyCounters } from '@/i18n/applyCounters';
import { COUNTERS } from '@/data/counters';

const institucionColor: Record<string, { dot: string; text: string; bg: string }> = {
  'poder-judicial': { dot: 'bg-indigo-600', text: 'text-indigo-700', bg: 'bg-indigo-50' },
  ccss: { dot: 'bg-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  hacienda: { dot: 'bg-amber-600', text: 'text-amber-700', bg: 'bg-amber-50' },
  mep: { dot: 'bg-rose-600', text: 'text-rose-700', bg: 'bg-rose-50' },
  micitt: { dot: 'bg-sky-600', text: 'text-sky-700', bg: 'bg-sky-50' },
  cenat: { dot: 'bg-violet-600', text: 'text-violet-700', bg: 'bg-violet-50' },
  ucr: { dot: 'bg-teal-600', text: 'text-teal-700', bg: 'bg-teal-50' },
};

const COLOR_FALLBACK = { dot: 'bg-slate-600', text: 'text-slate-700', bg: 'bg-slate-50' };
const DOT_NUDGE_PX = 14;

export function TimelineAdopcion({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [vista, setVista] = useState<'verificada' | 'completa'>('verificada');

  const { allYears, minYear, range, porInstitucion } = useMemo(() => {
    const datados = proyectos
      .filter((proyecto) => vista === 'completa' || esAdopcionVerificada(proyecto))
      .map((proyecto) => ({
        proyecto,
        year: obtenerAnioReferencia(proyecto),
        referencia: obtenerFechaReferencia(proyecto),
      }))
      .filter(
        (item): item is typeof item & { year: number; referencia: NonNullable<typeof item.referencia> } =>
          item.year !== null && item.referencia !== null,
      );

    const years = datados.map((item) => item.year);
    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);
    const yearRange = lastYear - firstYear || 1;

    const rows = instituciones
      .map((inst) => {
        const iniciativas = datados
          .filter((item) => item.proyecto.institucionId === inst.id)
          .sort((a, b) => a.year - b.year || a.proyecto.id.localeCompare(b.proyecto.id));

        const yearCounts = new Map<number, number>();
        for (const item of iniciativas) {
          yearCounts.set(item.year, (yearCounts.get(item.year) ?? 0) + 1);
        }
        const yearSeen = new Map<number, number>();
        const annotated = iniciativas.map((item) => {
          const total = yearCounts.get(item.year) ?? 1;
          const index = yearSeen.get(item.year) ?? 0;
          yearSeen.set(item.year, index + 1);
          return {
            ...item,
            offsetPx: (index - (total - 1) / 2) * DOT_NUDGE_PX,
          };
        });
        return { inst, iniciativas: annotated };
      })
      .filter((row) => row.iniciativas.length > 0);

    return {
      minYear: firstYear,
      range: yearRange,
      allYears: Array.from({ length: yearRange + 1 }, (_, index) => firstYear + index),
      porInstitucion: rows,
    };
  }, [vista]);

  const vistaAyuda =
    vista === 'verificada'
      ? applyCounters(t.timeline.vistaVerificadaAyuda, COUNTERS)
      : applyCounters(t.timeline.vistaCompletaAyuda, COUNTERS);

  return (
    <section id="timeline" className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {t.timeline.kicker}
          </p>
          <h2 className="mt-2 max-w-4xl text-3xl font-bold text-slate-900 text-balance sm:text-4xl">
            {t.timeline.titulo}
          </h2>
          <p className="mt-3 max-w-3xl text-slate-600 text-pretty">{t.timeline.sub}</p>
        </header>

        <div className="mb-5 flex flex-wrap items-center gap-3" role="group" aria-label={t.timeline.kicker}>
          {(['verificada', 'completa'] as const).map((opcion) => {
            const active = vista === opcion;
            const label =
              opcion === 'verificada' ? t.timeline.vistaVerificada : t.timeline.vistaCompleta;
            return (
              <button
                key={opcion}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setVista(opcion);
                  setHoverId(null);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-500 focus-visible:ring-offset-2 ${
                  active
                    ? 'border-institucional-700 bg-institucional-700 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-institucional-200 hover:text-institucional-700'
                }`}
              >
                {label}
              </button>
            );
          })}
          <span className="text-xs text-slate-500">{vistaAyuda}</span>
        </div>

        <p className="mb-3 text-xs text-slate-500 sm:hidden">↔ {t.timeline.scrollHint}</p>
        <div className="overflow-x-auto overflow-y-visible rounded-xl border border-slate-200 bg-white p-4 sm:p-8">
          <div className="min-w-[640px] pb-40">
            <div className="relative mb-6 grid h-8 grid-cols-[140px_1fr] items-end gap-4">
              <div />
              <div className="relative h-8">
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
                {allYears.map((year) => {
                  const x = ((year - minYear) / range) * 100;
                  return (
                    <div
                      key={year}
                      className="absolute top-0 -translate-x-1/2 text-xs font-medium tabular-nums text-slate-500"
                      style={{ left: `${x}%` }}
                    >
                      <div className="pb-1">{year}</div>
                      <div className="mx-auto h-3 w-px bg-slate-300" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              {porInstitucion.map(({ inst, iniciativas }) => {
                const color = institucionColor[inst.id] ?? COLOR_FALLBACK;
                return (
                  <div key={inst.id} className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <div className={`text-xs font-semibold uppercase tracking-wide ${color.text}`}>
                      {inst.nombreCorto[locale]}
                    </div>
                    <div className="relative h-10">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
                      {iniciativas.map(({ proyecto, year, referencia, offsetPx }) => {
                        const x = ((year - minYear) / range) * 100;
                        const isHover = hoverId === proyecto.id;
                        const tooltipAlignClass =
                          x < 18 ? 'left-0' : x > 82 ? 'right-0' : 'left-1/2 -translate-x-1/2';
                        const capa = obtenerCapaCatalogo(proyecto);
                        const resultado = proyecto.resultadosVerificados?.[0]?.texto[locale];
                        return (
                          <Link
                            key={proyecto.id}
                            href={`/${locale}/proyectos/${proyecto.id}`}
                            onMouseEnter={() => setHoverId(proyecto.id)}
                            onMouseLeave={() => setHoverId(null)}
                            onFocus={() => setHoverId(proyecto.id)}
                            onBlur={() => setHoverId(null)}
                            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none ${
                              isHover ? 'z-50' : 'z-10'
                            }`}
                            style={{ left: `calc(${x}% + ${offsetPx}px)` }}
                          >
                            <span
                              className={`block h-3.5 w-3.5 rounded-full ring-4 ring-white transition-transform hover:scale-125 focus:scale-125 ${color.dot}`}
                              aria-label={proyecto.titulo[locale]}
                            />
                            {isHover && (
                              <div className={`absolute top-full z-50 mt-3 w-72 rounded-lg border border-slate-300 bg-white p-3 shadow-xl ${tooltipAlignClass}`}>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${color.bg} ${color.text}`}>
                                    {inst.nombreCorto[locale]}
                                  </span>
                                  <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${capaChip[capa]}`}>
                                    {t.catalogo.capas[capa].corto}
                                  </span>
                                </div>
                                <div className="mt-2 text-sm font-semibold leading-snug text-slate-900">
                                  {proyecto.titulo[locale]}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                  {t.timeline.fechaLabel[referencia.tipo]}:{' '}
                                  {formatearFechaCatalogo(referencia.fecha, locale)}
                                </div>
                                {resultado && (
                                  <div className="mt-2 text-xs leading-snug text-slate-600">
                                    {resultado}
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
