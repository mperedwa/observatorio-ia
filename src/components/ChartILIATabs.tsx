'use client';

import { useState } from 'react';
import { ChartILIA } from './ChartILIA';
import { comparativaRegional } from '@/data/indicadores';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

type View = 'grafico' | 'tabla' | 'ranking';

interface Row {
  pais: string;
  ilia: number;
  destacado: boolean;
}

function rows(locale: Locale): Row[] {
  return comparativaRegional
    .slice()
    .sort((a, b) => b.ilia - a.ilia)
    .map((p) => ({
      pais: p.pais[locale],
      ilia: p.ilia,
      destacado: !!p.destacado,
    }));
}

function TableView({ t, locale }: { t: Dictionary; locale: Locale }) {
  const data = rows(locale);
  const max = Math.max(...data.map((r) => r.ilia));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="py-2 pr-4 font-medium w-12">{t.chartIlia.colPos}</th>
            <th className="py-2 pr-4 font-medium">{t.chartIlia.colPais}</th>
            <th className="py-2 pr-4 font-medium tabular-nums w-20">{t.chartIlia.colPuntaje}</th>
            <th className="py-2 font-medium">{t.chartIlia.colBarra}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => {
            const pct = (r.ilia / max) * 100;
            return (
              <tr
                key={r.pais}
                className={`border-b border-slate-100 ${r.destacado ? 'bg-institucional-50' : ''}`}
              >
                <td className="py-3 pr-4 tabular-nums text-slate-500 font-medium">{i + 1}</td>
                <td className={`py-3 pr-4 ${r.destacado ? 'font-semibold text-institucional-900' : 'text-slate-900'}`}>
                  {r.pais}
                </td>
                <td className="py-3 pr-4 tabular-nums font-semibold text-slate-900">{r.ilia.toFixed(2)}</td>
                <td className="py-3 min-w-[120px]">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${r.destacado ? 'bg-institucional-700' : 'bg-slate-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RankingView({ locale }: { locale: Locale }) {
  const data = rows(locale);
  return (
    <ol className="space-y-2">
      {data.map((r, i) => {
        const pos = i + 1;
        return (
          <li
            key={r.pais}
            className={`flex items-center gap-4 px-4 py-3 rounded-md border ${
              r.destacado
                ? 'border-institucional-700 bg-institucional-50'
                : 'border-slate-200 bg-white'
            }`}
          >
            <span
              className={`text-2xl sm:text-3xl font-bold tabular-nums w-10 text-center ${
                r.destacado ? 'text-institucional-700' : 'text-slate-400'
              }`}
            >
              {pos}
            </span>
            <span
              className={`flex-1 text-base sm:text-lg ${
                r.destacado ? 'font-semibold text-institucional-900' : 'text-slate-900'
              }`}
            >
              {r.pais}
            </span>
            <span className="tabular-nums text-base sm:text-lg font-semibold text-slate-900">
              {r.ilia.toFixed(2)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function ChartILIATabs({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [view, setView] = useState<View>('grafico');

  const tab = (key: View, label: string) => {
    const active = view === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => setView(key)}
        aria-pressed={active}
        className={`px-4 py-1.5 text-sm font-medium rounded-md border transition-colors ${
          active
            ? 'bg-institucional-700 text-white border-institucional-700'
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2 mb-6">
        {tab('grafico', t.chartIlia.tabGrafico)}
        {tab('tabla', t.chartIlia.tabTabla)}
        {tab('ranking', t.chartIlia.tabRanking)}
      </div>

      {view === 'grafico' && <ChartILIA locale={locale} t={t} />}
      {view === 'tabla' && <TableView t={t} locale={locale} />}
      {view === 'ranking' && <RankingView locale={locale} />}
    </div>
  );
}
