'use client';

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
import type { OecdIndex } from '@/data/indicadores';
import type { Locale } from '@/i18n/config';

interface Row {
  pais: string;
  score: number;
  destacado?: boolean;
  esPromedio?: boolean;
}

function CustomTooltip({
  active,
  payload,
  scoreLabel,
}: {
  active?: boolean;
  payload?: Array<{ payload: Row }>;
  scoreLabel: string;
}) {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-lg p-3 text-xs max-w-xs">
      <div className="font-semibold text-slate-900 mb-1">{row.pais}</div>
      <div className="text-slate-600">
        <span className="text-slate-500">{scoreLabel}: </span>
        <span className="tabular-nums">{row.score.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function ChartOecdIndex({
  data,
  locale,
  scoreLabel,
}: {
  data: OecdIndex;
  locale: Locale;
  scoreLabel: string;
}) {
  const rows: Row[] = data.ranking
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((p) => ({
      pais: p.pais[locale],
      score: p.score,
      destacado: p.destacado,
      esPromedio: p.esPromedio,
    }));

  return (
    <div className="h-[280px] sm:h-[320px] -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 8, right: 48, bottom: 8, left: 8 }}
          barCategoryGap={10}
        >
          <XAxis type="number" domain={[0, 1]} hide />
          <YAxis
            type="category"
            dataKey="pais"
            axisLine={false}
            tickLine={false}
            width={140}
            tick={{ fontSize: 12, fill: '#334155' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }}
            content={<CustomTooltip scoreLabel={scoreLabel} />}
          />
          <Bar dataKey="score" radius={[0, 6, 6, 0]}>
            {rows.map((row, idx) => (
              <Cell
                key={idx}
                fill={
                  row.destacado
                    ? '#1d4ed8'
                    : row.esPromedio
                      ? '#0f766e'
                      : '#94a3b8'
                }
              />
            ))}
            <LabelList
              dataKey="score"
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
  );
}
