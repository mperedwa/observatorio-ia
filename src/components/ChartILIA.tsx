'use client';

import { useRouter } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { comparativaRegional } from '@/data/indicadores';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

interface TooltipRow {
  pais: string;
  ilia: number;
  inversion: string;
  ente: string;
  destacado?: boolean;
}

function CustomTooltip({
  active,
  payload,
  t,
}: {
  active?: boolean;
  payload?: Array<{ payload: TooltipRow }>;
  t: Dictionary;
}) {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-lg p-3 text-xs max-w-xs">
      <div className="font-semibold text-slate-900 mb-1">
        {row.pais} <span className="tabular-nums text-institucional-700">{row.ilia.toFixed(2)}</span>
      </div>
      <div className="text-slate-600">
        <span className="text-slate-500">{t.chartIlia.inversionTooltip}: </span>
        {row.inversion}
      </div>
      <div className="text-slate-600">
        <span className="text-slate-500">{t.chartIlia.enteTooltip}: </span>
        {row.ente}
      </div>
    </div>
  );
}

export function ChartILIA({ locale, t }: { locale: Locale; t: Dictionary }) {
  const router = useRouter();
  const data: TooltipRow[] = comparativaRegional
    .slice()
    .sort((a, b) => b.ilia - a.ilia)
    .map((p) => ({
      pais: p.pais[locale],
      ilia: p.ilia,
      inversion: p.inversion[locale],
      ente: p.enteEjecutor[locale],
      destacado: p.destacado,
    }));

  function handleClick() {
    router.push(`/${locale}/analisis`);
  }

  return (
    <div>
      <div className="h-[280px] sm:h-[320px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 48, bottom: 8, left: 8 }}
            barCategoryGap={12}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
          >
            <XAxis type="number" domain={[0, 80]} hide />
            <YAxis
              type="category"
              dataKey="pais"
              axisLine={false}
              tickLine={false}
              width={90}
              tick={{ fontSize: 13, fill: '#334155' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }}
              content={<CustomTooltip t={t} />}
            />
            <Bar dataKey="ilia" radius={[0, 6, 6, 0]}>
              {data.map((row, idx) => (
                <Cell
                  key={idx}
                  fill={row.destacado ? '#1d4ed8' : '#94a3b8'}
                />
              ))}
              <LabelList
                dataKey="ilia"
                position="right"
                formatter={(value) =>
                  typeof value === 'number' ? value.toFixed(2) : String(value ?? '')
                }
                style={{ fontSize: 12, fill: '#0f172a', fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="mt-4 text-xs text-institucional-700 hover:underline"
      >
        {t.chartIlia.drillCta}
      </button>
    </div>
  );
}
