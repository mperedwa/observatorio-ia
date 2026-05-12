'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { t as TRANSLATIONS, type Locale } from './translations';

/* ═══════════════════════════════════════════════════════════════════
   DATA — language-neutral fields only; localized strings come from translations
   ═══════════════════════════════════════════════════════════════════ */

type ProjectStatus = 'activo' | 'piloto' | 'detenido';
type FilterKey = 'todos' | ProjectStatus;

interface BaseProject {
  inst: string;
  year: string;
  status: ProjectStatus;
}

const BASE_PROJECTS: readonly BaseProject[] = [
  { inst: 'Poder Judicial', year: '2018', status: 'activo' },
  { inst: 'Poder Judicial', year: '2019', status: 'activo' },
  { inst: 'Poder Judicial', year: '2024', status: 'activo' },
  { inst: 'Poder Judicial', year: '2024', status: 'activo' },
  { inst: 'Hacienda', year: '2025', status: 'activo' },
  { inst: 'CCSS', year: '2023', status: 'activo' },
  { inst: 'CCSS', year: '2025', status: 'piloto' },
  { inst: 'CCSS', year: '—', status: 'detenido' },
  { inst: 'CCSS', year: '—', status: 'detenido' },
  { inst: 'CCSS', year: '—', status: 'detenido' },
] as const;

const TIMELINE_COLORS = ['#4f46e5', '#4f46e5', '#059669', '#0284c7', '#d97706', '#059669'];

const SECTION_KEYS = [
  { id: 'resumen', tkey: 'resumen' },
  { id: 'inventario', tkey: 'inventario' },
  { id: 'retorno', tkey: 'retorno' },
  { id: 'ccss', tkey: 'ccss' },
  { id: 'cronologia', tkey: 'cronologia' },
  { id: 'vacio', tkey: 'vacio' },
  { id: 'catalogo', tkey: 'catalogo' },
  { id: 'que-sigue', tkey: 'queSigue' },
] as const;

const FILTER_KEYS: readonly { key: FilterKey; tkey: keyof typeof TRANSLATIONS.es.catalogo.filters }[] = [
  { key: 'todos', tkey: 'all' },
  { key: 'activo', tkey: 'active' },
  { key: 'piloto', tkey: 'pilot' },
  { key: 'detenido', tkey: 'stalled' },
] as const;

/* ═══════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════ */

const CSS = `
.policy-brief {
  font-family: var(--font-inter, 'Inter', system-ui, -apple-system, sans-serif);
  line-height: 1.7;
  scroll-behavior: smooth;
}

/* ── Light theme (default) ── */
.policy-brief[data-theme="light"] {
  --pb-bg: #f8fafc;
  --pb-surface: #ffffff;
  --pb-surface-alt: #f1f5f9;
  --pb-text: #1e293b;
  --pb-text-secondary: #475569;
  --pb-text-muted: #94a3b8;
  --pb-border: #e2e8f0;
  --pb-primary: #1d4ed8;
  --pb-primary-light: #eff6ff;
  --pb-success: #059669;
  --pb-success-light: #ecfdf5;
  --pb-warning: #d97706;
  --pb-warning-light: #fffbeb;
  --pb-danger: #dc2626;
  --pb-danger-light: #fef2f2;
  --pb-chart-1: #2563eb;
  --pb-chart-2: #7c3aed;
  --pb-chart-3: #059669;
  --pb-chart-4: #dc2626;
}

/* ── Dark theme ── */
.policy-brief[data-theme="dark"] {
  --pb-bg: #0f172a;
  --pb-surface: #1e293b;
  --pb-surface-alt: #334155;
  --pb-text: #f1f5f9;
  --pb-text-secondary: #cbd5e1;
  --pb-text-muted: #94a3b8;
  --pb-border: #334155;
  --pb-primary: #60a5fa;
  --pb-primary-light: rgba(59,130,246,0.12);
  --pb-success: #34d399;
  --pb-success-light: rgba(16,185,129,0.12);
  --pb-warning: #fbbf24;
  --pb-warning-light: rgba(217,119,6,0.12);
  --pb-danger: #f87171;
  --pb-danger-light: rgba(220,38,38,0.12);
  --pb-chart-1: #60a5fa;
  --pb-chart-2: #c4b5fd;
  --pb-chart-3: #34d399;
  --pb-chart-4: #f87171;
}

.policy-brief * { box-sizing: border-box; }

/* Theme toggle */
.pb-theme-btn {
  position: fixed; top: 16px; right: 16px; z-index: 50;
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 6px; padding: 8px; cursor: pointer; display: inline-flex;
  align-items: center; justify-content: center; transition: background 0.15s;
}
.pb-theme-btn:hover { background: var(--pb-surface-alt); }

/* Links */
.policy-brief .pb-link {
  color: var(--pb-primary); text-decoration: underline; text-decoration-color: rgba(29,78,216,0.3);
  text-underline-offset: 2px; transition: text-decoration-color 0.15s;
}
.policy-brief .pb-link:hover { text-decoration-color: var(--pb-primary); }

/* TOC */
.pb-toc {
  display: flex; gap: 4px; padding: 10px 24px; overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.pb-toc::-webkit-scrollbar { height: 0; }
.pb-toc a {
  flex-shrink: 0; font-size: 0.78rem; padding: 6px 10px; color: var(--pb-text-secondary);
  text-decoration: none; border-radius: 4px; white-space: nowrap; transition: all 0.15s;
}
.pb-toc a:hover { background: var(--pb-primary-light); color: var(--pb-primary); }

/* Section headers */
.pb-sh { display: flex; align-items: center; gap: 14px; margin: 0 0 18px; }
.pb-sn {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 30px; min-height: 30px; padding: 0 8px;
  background: var(--pb-primary); color: white; font-weight: 700;
  font-size: 0.85rem; border-radius: 50%;
}
.pb-st {
  font-size: clamp(1.25rem, 2.2vw, 1.55rem);
  font-weight: 700; color: var(--pb-text); margin: 0; flex: 1;
}

.pb-p {
  color: var(--pb-text-secondary); font-size: 1rem; line-height: 1.75; margin: 0 0 16px;
}

/* Callouts */
.pb-callout {
  background: var(--pb-primary-light); border-left: 4px solid var(--pb-primary);
  padding: 18px 22px; border-radius: 8px; color: var(--pb-text);
}
.pb-callout-warn {
  background: var(--pb-warning-light); border-left-color: var(--pb-warning);
}

/* Metric cards */
.pb-metric-card {
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 8px; padding: 18px; text-align: center;
}
.pb-mn { font-size: clamp(1.5rem, 3vw, 1.9rem); font-weight: 800; color: var(--pb-text); }
.pb-ml { font-size: 0.82rem; color: var(--pb-text-secondary); font-weight: 600; margin-top: 4px; }
.pb-ms { font-size: 0.72rem; color: var(--pb-text-muted); margin-top: 2px; }

/* Chart container */
.pb-chart {
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 8px; padding: 18px 20px; margin: 14px 0 28px;
}
.pb-chart-title {
  font-size: 0.92rem; font-weight: 700; color: var(--pb-text); margin-bottom: 12px;
}
.pb-chart-source {
  font-size: 0.7rem; color: var(--pb-text-muted); margin-top: 10px; font-style: italic;
}

/* Chart SVG color helpers */
.policy-brief .ss-grid { stroke: var(--pb-border); stroke-dasharray: 2 3; }
.policy-brief .ss-border { stroke: var(--pb-border); fill: none; }
.policy-brief .ss-c1 { fill: var(--pb-chart-1); }
.policy-brief .ss-c2 { fill: var(--pb-chart-2); }
.policy-brief .ss-ok { stroke: var(--pb-success); fill: none; }
.policy-brief .ss-err { stroke: var(--pb-danger); fill: none; }
.policy-brief .s-text { fill: var(--pb-text); }
.policy-brief .s-sec { fill: var(--pb-text-secondary); }
.policy-brief .s-muted { fill: var(--pb-text-muted); }
.policy-brief .s-c1 { fill: var(--pb-chart-1); }
.policy-brief .s-c2 { fill: var(--pb-chart-2); }

/* Details/summary */
.policy-brief details {
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 6px; margin: 8px 0; padding: 0;
}
.policy-brief details > summary {
  list-style: none; cursor: pointer; padding: 12px 18px;
  font-weight: 600; font-size: 0.93rem; color: var(--pb-text);
  display: flex; align-items: center; justify-content: space-between;
}
.policy-brief details > summary::-webkit-details-marker { display: none; }
.policy-brief details > summary::after {
  content: '+'; font-size: 1.1rem; color: var(--pb-text-muted);
}
.policy-brief details[open] > summary::after { content: '−'; }
.policy-brief details > div {
  padding: 0 18px 16px; color: var(--pb-text-secondary);
  font-size: 0.94rem; line-height: 1.7;
}

/* HR */
.pb-hr { border: none; border-top: 1px solid var(--pb-border); margin: 36px 0; }

/* Badges */
.pb-badge {
  display: inline-block; padding: 2px 8px; border-radius: 4px;
  font-size: 0.72rem; font-weight: 600;
}
.pb-badge-ok { background: var(--pb-success-light); color: var(--pb-success); }
.pb-badge-warn { background: var(--pb-warning-light); color: var(--pb-warning); }
.pb-badge-err { background: var(--pb-danger-light); color: var(--pb-danger); }

/* Filter buttons */
.pb-fbtn {
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 4px; padding: 5px 12px; font-size: 0.8rem; cursor: pointer;
  color: var(--pb-text-secondary); transition: all 0.15s;
}
.pb-fbtn:hover { background: var(--pb-surface-alt); }
.pb-fbtn-on { background: var(--pb-primary); color: white; border-color: var(--pb-primary); }

/* Table */
.pb-tw { overflow-x: auto; background: var(--pb-surface); border: 1px solid var(--pb-border); border-radius: 6px; }
.pb-tbl { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.pb-tbl th {
  text-align: left; padding: 10px 14px; background: var(--pb-surface-alt);
  font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.04em;
  color: var(--pb-text-muted); cursor: pointer; user-select: none;
  border-bottom: 1px solid var(--pb-border);
}
.pb-tbl td {
  padding: 10px 14px; border-bottom: 1px solid var(--pb-border); color: var(--pb-text);
}
.pb-tbl tr:last-child td { border-bottom: none; }

/* Dual layout */
.pb-dual {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  margin: 28px 0;
}
@media (max-width: 540px) { .pb-dual { grid-template-columns: 1fr; } }

/* ── Print ── */
@media print {
  .policy-brief {
    --pb-bg: white !important; --pb-surface: white !important;
    --pb-surface-alt: #f5f5f5 !important; --pb-text: #111 !important;
    --pb-text-secondary: #333 !important; --pb-text-muted: #666 !important;
    --pb-border: #ddd !important; --pb-primary: #1d4ed8 !important;
  }
  .pb-theme-btn, .pb-toc-sticky { display: none !important; }
  .policy-brief details { border: 1px solid #ddd; }
  .policy-brief details > div { display: block !important; }
  .pb-chart, .pb-metric-card { break-inside: avoid; }
  .pb-tw { overflow: visible; }
}

@media (prefers-reduced-motion: reduce) {
  .policy-brief, .policy-brief * { transition: none !important; }
}
`;

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="pb-link">
      {children}
    </a>
  );
}

function Badge({ status, labels }: { status: ProjectStatus; labels: { activo: string; piloto: string; detenido: string } }) {
  const m: Record<ProjectStatus, { cls: string; label: string }> = {
    activo: { cls: 'pb-badge-ok', label: labels.activo },
    piloto: { cls: 'pb-badge-warn', label: labels.piloto },
    detenido: { cls: 'pb-badge-err', label: labels.detenido },
  };
  const s = m[status];
  return <span className={`pb-badge ${s.cls}`}>{s.label}</span>;
}

function SH({ n, title, id }: { n: number; title: string; id: string }) {
  return (
    <div className="pb-sh" id={id} style={{ scrollMarginTop: 60 }}>
      <span className="pb-sn">{n}</span>
      <h2 className="pb-st">{title}</h2>
    </div>
  );
}

/* Renders a translation string that contains <strong>...</strong> markup */
function Rich({ html, as: As = 'span', ...rest }: { html: string; as?: 'span' | 'p' | 'li'; [key: string]: unknown }) {
  return <As dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
}

/* ═══════════════════════════════════════════════════════════════════
   SVG CHARTS
   ═══════════════════════════════════════════════════════════════════ */

/* Chart prop types — explicit string fields so ES and EN literal types both fit */
type ChartRetornoT = { title: string; ariaLabel: string; svgTitle: string; haciendaSub: string; pjSub: string; source: string };
type ChartDepuracionT = { title: string; ariaLabel: string; svgTitle: string; rateLabel: string; before: string; beforeSub: string; after: string; afterSub: string; source: string };
type ChartLidiaT = { title: string; ariaLabel: string; svgTitle: string; accuracyLabel: string; recordsSub: string; source: string };
type ChartTimelineT = {
  title: string;
  ariaLabel: string;
  svgTitle: string;
  source: string;
  events: readonly { readonly year: number; readonly lines: readonly string[] }[];
};

function ChartRetorno({ T }: { T: ChartRetornoT }) {
  const barW1 = Math.round((8000 / 8500) * 400);
  const barW2 = Math.round((5245 / 8500) * 400);
  const gridValues = [0, 2000, 4000, 6000, 8000];

  return (
    <div className="pb-chart">
      <div className="pb-chart-title">{T.title}</div>
      <svg viewBox="0 0 620 130" role="img" aria-label={T.ariaLabel} style={{ width: '100%', height: 'auto' }}>
        <title>{T.svgTitle}</title>
        {gridValues.map(v => {
          const x = 150 + (v / 8500) * 400;
          return (
            <g key={v}>
              <line x1={x} y1={15} x2={x} y2={105} className="ss-grid" strokeWidth={1} />
              <text x={x} y={122} textAnchor="middle" className="s-muted" fontSize={10}>
                {v === 0 ? '0' : `₡${(v / 1000).toFixed(0)}B`}
              </text>
            </g>
          );
        })}
        <text x={140} y={42} textAnchor="end" className="s-text" fontSize={13} fontWeight={600}>Hacienda</text>
        <text x={140} y={55} textAnchor="end" className="s-muted" fontSize={9.5}>{T.haciendaSub}</text>
        <rect x={150} y={30} width={barW1} height={28} className="s-c1" rx={4} />
        <text x={150 + barW1 + 8} y={49} className="s-c1" fontSize={13} fontWeight={700}>₡8,000M</text>

        <text x={140} y={87} textAnchor="end" className="s-text" fontSize={13} fontWeight={600}>P. Judicial</text>
        <text x={140} y={100} textAnchor="end" className="s-muted" fontSize={9.5}>{T.pjSub}</text>
        <rect x={150} y={75} width={barW2} height={28} className="s-c2" rx={4} />
        <text x={150 + barW2 + 8} y={94} className="s-c2" fontSize={13} fontWeight={700}>₡5,245M</text>
      </svg>
      <div className="pb-chart-source">{T.source}</div>
    </div>
  );
}

function ChartDepuracion({ T }: { T: ChartDepuracionT }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash1 = (31.2 / 100) * circ;
  const dash2 = (18.2 / 100) * circ;

  return (
    <div className="pb-chart">
      <div className="pb-chart-title">{T.title}</div>
      <svg viewBox="0 0 460 200" role="img" aria-label={T.ariaLabel} style={{ width: '100%', height: 'auto', maxWidth: 460, margin: '0 auto', display: 'block' }}>
        <title>{T.svgTitle}</title>
        {/* Before */}
        <g transform="translate(115, 90)">
          <circle cx={0} cy={0} r={r} className="ss-border" strokeWidth={10} />
          <circle cx={0} cy={0} r={r} className="ss-err" strokeWidth={10}
            strokeDasharray={`${dash1} ${circ}`} strokeLinecap="round" transform="rotate(-90)" />
          <text x={0} y={-2} textAnchor="middle" className="s-text" fontSize={22} fontWeight={800}>31.2%</text>
          <text x={0} y={16} textAnchor="middle" className="s-muted" fontSize={10}>{T.rateLabel}</text>
        </g>
        <text x={115} y={162} textAnchor="middle" className="s-sec" fontSize={12} fontWeight={600}>{T.before}</text>
        <text x={115} y={178} textAnchor="middle" className="s-muted" fontSize={9.5}>{T.beforeSub}</text>

        {/* Arrow */}
        <g transform="translate(230, 90)">
          <line x1={-20} y1={0} x2={20} y2={0} style={{ stroke: 'var(--pb-text-muted)', strokeWidth: 2 }} />
          <polygon points="20,-5 30,0 20,5" style={{ fill: 'var(--pb-text-muted)' }} />
        </g>

        {/* After */}
        <g transform="translate(345, 90)">
          <circle cx={0} cy={0} r={r} className="ss-border" strokeWidth={10} />
          <circle cx={0} cy={0} r={r} className="ss-ok" strokeWidth={10}
            strokeDasharray={`${dash2} ${circ}`} strokeLinecap="round" transform="rotate(-90)" />
          <text x={0} y={-2} textAnchor="middle" className="s-text" fontSize={22} fontWeight={800}>18.2%</text>
          <text x={0} y={16} textAnchor="middle" className="s-muted" fontSize={10}>{T.rateLabel}</text>
        </g>
        <text x={345} y={162} textAnchor="middle" className="s-sec" fontSize={12} fontWeight={600}>{T.after}</text>
        <text x={345} y={178} textAnchor="middle" className="s-muted" fontSize={9.5}>{T.afterSub}</text>
      </svg>
      <div className="pb-chart-source">{T.source}</div>
    </div>
  );
}

function GaugeLIDIA({ T }: { T: ChartLidiaT }) {
  const r = 62;
  const arc = Math.PI * r;
  // Visual fill kept high as decorative "strong score" indicator. The specific
  // 95% literal was removed per the fact-check (no primary source); the gauge
  // is now framed qualitatively via T.accuracyLabel.
  const filled = 0.85 * arc;

  return (
    <div className="pb-chart" style={{ textAlign: 'center' }}>
      <div className="pb-chart-title">{T.title}</div>
      <svg viewBox="0 0 200 115" role="img" aria-label={T.ariaLabel} style={{ width: '100%', height: 'auto', maxWidth: 220, margin: '0 auto', display: 'block' }}>
        <title>{T.svgTitle}</title>
        <path d={`M ${100 - r} 90 A ${r} ${r} 0 0 1 ${100 + r} 90`} className="ss-border" strokeWidth={12} strokeLinecap="round" />
        <path d={`M ${100 - r} 90 A ${r} ${r} 0 0 1 ${100 + r} 90`} className="ss-ok" strokeWidth={12} strokeLinecap="round"
          strokeDasharray={`${filled} ${arc}`} />
        <text x={100} y={80} textAnchor="middle" className="s-text" fontSize={22} fontWeight={700}>{T.accuracyLabel}</text>
        <text x={100} y={108} textAnchor="middle" className="s-muted" fontSize={9}>{T.recordsSub}</text>
      </svg>
      <div className="pb-chart-source">{T.source}</div>
    </div>
  );
}

function ChartTimeline({ T }: { T: ChartTimelineT }) {
  const pad = 60;
  const w = 700;
  const usable = w - 2 * pad;
  const sp = usable / (T.events.length - 1);

  return (
    <div className="pb-chart">
      <div className="pb-chart-title">{T.title}</div>
      <svg viewBox={`0 0 ${w} 220`} role="img" aria-label={T.ariaLabel} style={{ width: '100%', height: 'auto' }}>
        <title>{T.svgTitle}</title>
        <line x1={pad} y1={110} x2={w - pad} y2={110} className="ss-border" strokeWidth={2} />

        {T.events.map((evt, i) => {
          const x = pad + i * sp;
          const above = i % 2 === 0;
          const color = TIMELINE_COLORS[i] ?? '#4f46e5';
          return (
            <g key={i}>
              <circle cx={x} cy={110} r={7} style={{ fill: color }} />
              <circle cx={x} cy={110} r={3} style={{ fill: 'var(--pb-surface)' }} />

              {above ? (
                <>
                  <line x1={x} y1={96} x2={x} y2={78} style={{ stroke: color, strokeWidth: 1.5 }} />
                  <text x={x} y={42} textAnchor="middle" style={{ fill: color }} fontSize={13} fontWeight={700}>{evt.year}</text>
                  {evt.lines.map((l, j) => (
                    <text key={j} x={x} y={56 + j * 13} textAnchor="middle" className="s-sec" fontSize={10}>{l}</text>
                  ))}
                </>
              ) : (
                <>
                  <line x1={x} y1={124} x2={x} y2={142} style={{ stroke: color, strokeWidth: 1.5 }} />
                  <text x={x} y={160} textAnchor="middle" style={{ fill: color }} fontSize={13} fontWeight={700}>{evt.year}</text>
                  {evt.lines.map((l, j) => (
                    <text key={j} x={x} y={174 + j * 13} textAnchor="middle" className="s-sec" fontSize={10}>{l}</text>
                  ))}
                </>
              )}
            </g>
          );
        })}
      </svg>
      <div className="pb-chart-source">{T.source}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function ArticleBrief({ locale }: { locale: Locale }) {
  const T = TRANSLATIONS[locale];
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [filter, setFilter] = useState<FilterKey>('todos');
  const [sortKey, setSortKey] = useState<'inst' | 'proyecto' | 'year' | 'status'>('inst');
  const [sortAsc, setSortAsc] = useState(true);

  // Merge language-neutral fields with localized project copy by index
  const allProjects = useMemo(
    () => BASE_PROJECTS.map((base, i) => ({
      ...base,
      proyecto: T.projects[i]?.proyecto ?? '',
      impacto: T.projects[i]?.impacto ?? '',
    })),
    [T]
  );

  const rows = useMemo(() => {
    let list = [...allProjects];
    if (filter !== 'todos') list = list.filter(p => p.status === filter);
    list.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [allProjects, filter, sortKey, sortAsc]);

  const doSort = (k: typeof sortKey) => {
    if (sortKey === k) setSortAsc(!sortAsc);
    else { setSortKey(k); setSortAsc(true); }
  };

  const arrow = (k: typeof sortKey) => sortKey === k ? (sortAsc ? ' ↑' : ' ↓') : ' ↕';

  const sections = SECTION_KEYS.map(s => ({ id: s.id, label: T.sections[s.tkey] }));
  const homeHref = `/${locale}/`;
  const analysisHref = `/${locale}/analisis/`;

  return (
    <>
      <style>{CSS}</style>
      <div className="policy-brief" data-theme={theme}>

        {/* Theme toggle */}
        <button
          type="button"
          className="pb-theme-btn"
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          aria-label={theme === 'light' ? T.theme.toDark : T.theme.toLight}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" style={{ fill: 'var(--pb-text)' }}>
            {theme === 'light' ? (
              <path d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm4.22 1.28a1 1 0 011.42 1.42l-.72.7a1 1 0 11-1.41-1.41l.71-.71zM17 9a1 1 0 110 2h-1a1 1 0 110-2h1zM15.66 14.3a1 1 0 01.02 1.42l-.02.02a1 1 0 01-1.42-1.42l.71-.71a1 1 0 011.42.28l-.71.41zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.3l.71.7a1 1 0 01-1.42 1.43l-.71-.71a1 1 0 011.42-1.42zM3 9h1a1 1 0 110 2H3a1 1 0 110-2zm1.64-4.01a1 1 0 011.42 0l.7.71a1 1 0 01-1.41 1.42l-.71-.71a1 1 0 010-1.42zM10 7a3 3 0 100 6 3 3 0 000-6z" />
            ) : (
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.003 8.003 0 1010.586 10.586z" />
            )}
          </svg>
        </button>

        {/* ──── HEADER ──── */}
        <header style={{ background: 'var(--pb-surface)', borderBottom: '1px solid var(--pb-border)' }}>
          <div style={{ maxWidth: 880, margin: '0 auto', padding: '36px 24px 44px' }}>
            <nav aria-label="breadcrumb" style={{ fontSize: 12, color: 'var(--pb-text-muted)', marginBottom: 20 }}>
              <Link href={homeHref} style={{ color: 'var(--pb-text-muted)', textDecoration: 'none' }}>{T.breadcrumb.home}</Link>
              <span style={{ margin: '0 6px' }}>›</span>
              <Link href={analysisHref} style={{ color: 'var(--pb-text-muted)', textDecoration: 'none' }}>{T.breadcrumb.analysis}</Link>
              <span style={{ margin: '0 6px' }}>›</span>
              <span style={{ color: 'var(--pb-text-secondary)', fontWeight: 500 }}>{T.breadcrumb.current}</span>
            </nav>
            <p style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pb-primary)' }}>
              {T.meta.seriesLabel}
            </p>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--pb-text)', lineHeight: 1.15, marginTop: 8 }}>
              {T.meta.title}
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--pb-text-secondary)', marginTop: 16, lineHeight: 1.6 }}>
              {T.meta.description}
            </p>
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 14px', fontSize: 13, color: 'var(--pb-text-muted)' }}>
              <span style={{ fontWeight: 600, color: 'var(--pb-text)' }}>{T.meta.author}</span>
              <span aria-hidden>·</span>
              <time dateTime="2026-05-11">{T.meta.date}</time>
              <span aria-hidden>·</span>
              <span>{T.meta.org}</span>
            </div>
          </div>
        </header>

        {/* ──── TOC ──── */}
        <nav style={{ background: 'var(--pb-surface)', borderBottom: '1px solid var(--pb-border)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 24px' }} className="pb-toc">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}>{s.label}</a>
            ))}
          </div>
        </nav>

        {/* ──── CONTENT ──── */}
        <main style={{ background: 'var(--pb-bg)' }}>
          <div style={{ maxWidth: 880, margin: '0 auto', padding: '44px 24px 64px' }}>

            {/* ── Executive Summary ── */}
            <section id="resumen" style={{ scrollMarginTop: 60 }}>
              <div className="pb-callout" style={{ marginBottom: 40 }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12, color: 'var(--pb-primary)' }}>{T.summary.heading}</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.92rem' }}>
                  {T.summary.bullets.map((html, i) => (
                    <li key={i}>→ <Rich html={html} /></li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── Metric Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 48 }}>
              <div className="pb-metric-card">
                <div className="pb-mn">{T.metrics.projects.value}</div>
                <div className="pb-ml">{T.metrics.projects.label}</div>
                <div className="pb-ms">{T.metrics.projects.sub}</div>
              </div>
              <div className="pb-metric-card">
                <div className="pb-mn" style={{ color: 'var(--pb-success)' }}>{T.metrics.returns.value}</div>
                <div className="pb-ml">{T.metrics.returns.label}</div>
                <div className="pb-ms">{T.metrics.returns.sub}</div>
              </div>
              <div className="pb-metric-card">
                <div className="pb-mn">{T.metrics.patients.value}</div>
                <div className="pb-ml">{T.metrics.patients.label}</div>
                <div className="pb-ms">{T.metrics.patients.sub}</div>
              </div>
              <div className="pb-metric-card">
                <div className="pb-mn" style={{ color: 'var(--pb-danger)' }}>{T.metrics.stalled.value}</div>
                <div className="pb-ml">{T.metrics.stalled.label}</div>
                <div className="pb-ms">{T.metrics.stalled.sub}</div>
              </div>
            </div>

            {/* ═══ SECTION 1: INVENTARIO ═══ */}
            <section>
              <SH n={1} title={T.inventario.sectionTitle} id="inventario" />
              <Rich as="p" html={T.inventario.body} {...{ className: 'pb-p' }} />
              <details>
                <summary>{T.inventario.criteriaLabel}</summary>
                <div>
                  <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {T.inventario.criteria.map((html, i) => (
                      <li key={i}><Rich html={html} /></li>
                    ))}
                  </ol>
                  <p style={{ marginTop: 12 }}>{T.inventario.exclusionNote}</p>
                </div>
              </details>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 2: RETORNO ═══ */}
            <section>
              <SH n={2} title={T.retorno.sectionTitle} id="retorno" />
              <Rich as="p" html={T.retorno.body} {...{ className: 'pb-p' }} />

              <ChartRetorno T={T.charts.retorno} />

              <details>
                <summary>{T.retorno.pjLabel}</summary>
                <div>
                  <p>{T.retorno.pjPara1}</p>
                  <p style={{ marginTop: 10 }}>{T.retorno.pjPara2}</p>
                  <p style={{ marginTop: 10, fontSize: '0.86rem' }}>
                    <Ext href="https://transparencia.poder-judicial.go.cr/index.php/declaracion-de-uso-de-inteligencia-artificial">
                      transparencia.poder-judicial.go.cr
                    </Ext>
                    {' · '}
                    <Ext href="https://pj.poder-judicial.go.cr/index.php/component/content/article/760-poder-judicial-implementa-inteligencia-artificial-para-disminuir-circulante-en-materia-cobratoria">
                      pj.poder-judicial.go.cr
                    </Ext>
                    {' · '}
                    <Ext href="https://observador.cr/sistema-de-inteligencia-artificial-judicial-ya-aplica-en-cobro-judicial/">
                      observador.cr
                    </Ext>
                  </p>
                </div>
              </details>

              <details>
                <summary>{T.retorno.haciendaLabel}</summary>
                <div>
                  <p>{T.retorno.haciendaPara}</p>
                  <p style={{ marginTop: 10, fontSize: '0.86rem' }}>
                    <Ext href="https://actualidadtributaria.com/?action=news-view&id=2002">
                      actualidadtributaria.com
                    </Ext>
                  </p>
                </div>
              </details>

              <div className="pb-callout" style={{ marginTop: 20 }}>
                <p style={{ fontStyle: 'italic', fontSize: '1.02rem' }}>&ldquo;{T.retorno.callout}&rdquo;</p>
              </div>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 3: CCSS ═══ */}
            <section>
              <SH n={3} title={T.ccss.sectionTitle} id="ccss" />
              <Rich as="p" html={T.ccss.intro} {...{ className: 'pb-p' }} />

              <ChartDepuracion T={T.charts.depuracion} />

              <Rich as="p" html={T.ccss.botPara} {...{ className: 'pb-p' }} />
              <p style={{ fontSize: '0.86rem', color: 'var(--pb-text-muted)', marginTop: -8, marginBottom: 16 }}>
                <Ext href="https://www.teletica.com/nacional/ccss-implementa-herramienta-de-inteligencia-artificial-en-intento-por-bajar-listas-de-espera_408381">
                  teletica.com
                </Ext>
              </p>

              <div className="pb-dual">
                <GaugeLIDIA T={T.charts.lidia} />
                <div className="pb-chart" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="pb-chart-title">{T.charts.stalledModels.title}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                    {T.charts.stalledModels.models.map(m => (
                      <div key={m} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--pb-danger-light)', borderRadius: 6 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--pb-text)' }}>{m}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pb-danger)' }}>₡130M</span>
                      </div>
                    ))}
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, color: 'var(--pb-danger)', marginTop: 4 }}>
                      {T.charts.stalledModels.total}
                    </div>
                  </div>
                  <div className="pb-chart-source">
                    <Ext href="https://www.teletica.com/salud/los-obstaculos-de-lidia-sistema-de-ia-de-la-ccss-para-crecer_377250">
                      {T.charts.stalledModels.sourceLabel}
                    </Ext>
                  </div>
                </div>
              </div>

              <details>
                <summary>{T.ccss.lidiaLabel}</summary>
                <div>
                  <p>{T.ccss.lidiaPara1}</p>
                  <p style={{ marginTop: 10 }}>{T.ccss.lidiaPara2}</p>
                  <p style={{ marginTop: 10, fontSize: '0.86rem' }}>
                    <Ext href="https://observador.cr/inteligencia-artificial-en-la-ccss-plan-piloto-en-la-clinica-clorito-picado-identifica-a-130-pacientes-con-diabetes/">
                      observador.cr
                    </Ext>
                    {' · '}
                    <Ext href="https://www.teletica.com/salud/los-obstaculos-de-lidia-sistema-de-ia-de-la-ccss-para-crecer_377250">
                      teletica.com
                    </Ext>
                  </p>
                </div>
              </details>

              <div className="pb-callout pb-callout-warn" style={{ marginTop: 20 }}>
                <p style={{ fontSize: '0.92rem' }}>
                  <strong>{T.ccss.calloutTitle}</strong> {T.ccss.callout}
                </p>
              </div>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 4: CRONOLOGÍA ═══ */}
            <section>
              <SH n={4} title={T.cronologia.sectionTitle} id="cronologia" />
              <p className="pb-p">{T.cronologia.body}</p>
              <ChartTimeline T={T.charts.timeline} />
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 5: VACÍO ═══ */}
            <section>
              <SH n={5} title={T.vacio.sectionTitle} id="vacio" />
              <Rich as="p" html={T.vacio.para1} {...{ className: 'pb-p' }} />
              <Rich as="p" html={T.vacio.para2} {...{ className: 'pb-p' }} />
              <Rich as="p" html={T.vacio.para3} {...{ className: 'pb-p' }} />
              <p style={{ fontSize: '0.86rem', color: 'var(--pb-text-muted)', marginTop: -4 }}>
                <Ext href="https://micitt.go.cr/el-sector-informa/micitt-presento-estrategia-nacional-de-inteligencia-artificial-enia">
                  micitt.go.cr
                </Ext>
                {' · '}
                <Ext href="https://ciodd.ucr.ac.cr/ciodd-lidera-taller-internacional-sobre-inteligencia-artificial-etica-en-la-universidad-de-costa-rica-en-el-marco-del-proyecto-ethical-ia">
                  ciodd.ucr.ac.cr
                </Ext>
                {' · '}
                <Ext href="https://dplnews.com/costa-rica-impulsa-investigacion-y-desarrollo-en-inteligencia-artificial/">
                  dplnews.com
                </Ext>
              </p>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 6: CATÁLOGO ═══ */}
            <section>
              <SH n={6} title={T.catalogo.sectionTitle} id="catalogo" />
              <p className="pb-p">{T.catalogo.body}</p>

              {/* Filters */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {FILTER_KEYS.map(f => {
                  const isOn = filter === f.key;
                  const baseLabel = T.catalogo.filters[f.tkey];
                  const count = f.key === 'todos' ? null : allProjects.filter(p => p.status === f.key).length;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      className={`pb-fbtn ${isOn ? 'pb-fbtn-on' : ''}`}
                      onClick={() => setFilter(f.key)}
                    >
                      {baseLabel}
                      {count !== null && ` (${count})`}
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              <div className="pb-tw">
                <table className="pb-tbl">
                  <thead>
                    <tr>
                      <th onClick={() => doSort('inst')}>{T.catalogo.table.institution}{arrow('inst')}</th>
                      <th onClick={() => doSort('proyecto')}>{T.catalogo.table.project}{arrow('proyecto')}</th>
                      <th onClick={() => doSort('year')}>{T.catalogo.table.year}{arrow('year')}</th>
                      <th onClick={() => doSort('status')}>{T.catalogo.table.status}{arrow('status')}</th>
                      <th>{T.catalogo.table.impact}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((p, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{p.inst}</td>
                        <td>{p.proyecto}</td>
                        <td style={{ textAlign: 'center' }}>{p.year}</td>
                        <td><Badge status={p.status} labels={T.catalogo.badges} /></td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--pb-text-secondary)' }}>{p.impacto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--pb-text-muted)', marginTop: 10, fontStyle: 'italic' }}>
                {T.catalogo.footnote}
              </p>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 7: QUÉ SIGUE ═══ */}
            <section>
              <SH n={7} title={T.queSigue.sectionTitle} id="que-sigue" />
              <p className="pb-p">{T.queSigue.intro}</p>
              <ul style={{ padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--pb-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {T.queSigue.questions.map((qa, i) => (
                  <li key={i}>
                    <strong style={{ color: 'var(--pb-text)' }}>{qa.q}</strong>{' '}
                    {qa.a}
                  </li>
                ))}
              </ul>
              <p className="pb-p" style={{ marginTop: 20 }}>{T.queSigue.closing}</p>
            </section>

          </div>
        </main>

        {/* ──── FOOTER ──── */}
        <footer style={{ background: 'var(--pb-surface)', borderTop: '1px solid var(--pb-border)', padding: '32px 24px' }}>
          <div style={{ maxWidth: 880, margin: '0 auto', fontSize: '0.85rem', color: 'var(--pb-text-secondary)' }}>
            <Rich as="p" html={T.footer.bio} />
            <p style={{ fontStyle: 'italic', marginTop: 8 }}>{T.footer.cadence}</p>
            <p style={{ marginTop: 8 }}>
              <Link href={homeHref} style={{ color: 'var(--pb-primary)', textDecoration: 'none' }}>
                {T.footer.orgLabel}
              </Link>{' '}
              — observatorioia.org
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
