'use client';

import Link from 'next/link';
import { useState } from 'react';
import { proyectos } from '@/data/proyectos';
import { instituciones } from '@/data/instituciones';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { Estado } from '@/data/proyectos';
import { applyCounters } from '@/i18n/applyCounters';
import { COUNTERS } from '@/data/counters';

const estadoBg: Record<Estado, string> = {
  operativo: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-900',
  piloto: 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900',
  planificado: 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700',
};

export function MapaProyectos({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  const grupos = instituciones
    .map((inst) => ({
      inst,
      proyectos: proyectos.filter((p) => p.institucionId === inst.id),
    }))
    .filter((g) => g.proyectos.length > 0)
    .sort((a, b) => b.proyectos.length - a.proyectos.length);

  return (
    <section id="panorama" className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {t.panorama.kicker}
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 text-balance">
            {t.panorama.titulo}
          </h2>
          <p className="mt-3 text-slate-600 max-w-3xl text-pretty">{applyCounters(t.panorama.sub, COUNTERS)}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {grupos.map(({ inst, proyectos: ps }) => (
            <article
              key={inst.id}
              className="bg-white border border-slate-200 rounded-lg p-4"
            >
              <header className="flex items-baseline justify-between mb-3">
                <Link
                  href={`/${locale}/instituciones/${inst.id}`}
                  className="text-sm font-semibold text-slate-900 hover:text-institucional-700"
                >
                  {inst.nombreCorto[locale]}
                </Link>
                <span className="text-xs text-slate-500 tabular-nums">
                  {ps.length} {ps.length === 1 ? t.panorama.proyectoLabel : t.instituciones.proyectosLabel}
                </span>
              </header>
              <div className="grid grid-cols-2 gap-1.5">
                {ps.map((p) => (
                  <Link
                    key={p.id}
                    href={`/${locale}/proyectos/${p.id}`}
                    onMouseEnter={() => setHoverId(p.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onFocus={() => setHoverId(p.id)}
                    onBlur={() => setHoverId(null)}
                    className={`relative block border rounded p-2 text-[11px] leading-tight font-medium transition-colors ${estadoBg[p.estado]}`}
                  >
                    <span className="line-clamp-2">{p.titulo[locale]}</span>
                    {hoverId === p.id && (
                      <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 rounded-md border border-slate-200 bg-white p-3 shadow-lg text-xs text-slate-700 leading-snug pointer-events-none">
                        {p.descripcion[locale]}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
