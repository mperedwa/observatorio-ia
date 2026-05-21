'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { t as TRANSLATIONS, type Locale } from './translations';

/* ═══════════════════════════════════════════════════════════════════
   SECTIONS
   ═══════════════════════════════════════════════════════════════════ */

const SECTION_KEYS = [
  { id: 'resumen', tkey: 'resumen' },
  { id: 'comparativa', tkey: 'comparativa' },
  { id: 'micitt', tkey: 'micitt' },
  { id: 'riesgo', tkey: 'riesgo' },
  { id: 'modelos', tkey: 'modelos' },
  { id: 'recomendaciones', tkey: 'recomendaciones' },
  { id: 'fuentes', tkey: 'fuentes' },
] as const;

type FilterKey = 'all' | '23771' | '23919' | '24484';

/* ═══════════════════════════════════════════════════════════════════
   STYLES — copied from NL01 to keep visual parity
   ═══════════════════════════════════════════════════════════════════ */

const CSS = `
.policy-brief {
  font-family: var(--font-inter, 'Inter', system-ui, -apple-system, sans-serif);
  line-height: 1.7;
  scroll-behavior: smooth;
}
.policy-brief[data-theme="light"] {
  --pb-bg: #f8fafc; --pb-surface: #ffffff; --pb-surface-alt: #f1f5f9;
  --pb-text: #1e293b; --pb-text-secondary: #475569; --pb-text-muted: #94a3b8;
  --pb-border: #e2e8f0; --pb-primary: #1d4ed8; --pb-primary-light: #eff6ff;
  --pb-success: #059669; --pb-success-light: #ecfdf5;
  --pb-warning: #d97706; --pb-warning-light: #fffbeb;
  --pb-danger: #dc2626; --pb-danger-light: #fef2f2;
  --pb-chart-1: #2563eb; --pb-chart-2: #7c3aed; --pb-chart-3: #059669; --pb-chart-4: #dc2626;
}
.policy-brief[data-theme="dark"] {
  --pb-bg: #0f172a; --pb-surface: #1e293b; --pb-surface-alt: #334155;
  --pb-text: #f1f5f9; --pb-text-secondary: #cbd5e1; --pb-text-muted: #94a3b8;
  --pb-border: #334155; --pb-primary: #60a5fa; --pb-primary-light: rgba(59,130,246,0.12);
  --pb-success: #34d399; --pb-success-light: rgba(16,185,129,0.12);
  --pb-warning: #fbbf24; --pb-warning-light: rgba(217,119,6,0.12);
  --pb-danger: #f87171; --pb-danger-light: rgba(220,38,38,0.12);
  --pb-chart-1: #60a5fa; --pb-chart-2: #c4b5fd; --pb-chart-3: #34d399; --pb-chart-4: #f87171;
}
.policy-brief * { box-sizing: border-box; }

.pb-theme-btn {
  position: fixed; top: 16px; right: 16px; z-index: 50;
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 6px; padding: 8px; cursor: pointer; display: inline-flex;
  align-items: center; justify-content: center; transition: background 0.15s;
}
.pb-theme-btn:hover { background: var(--pb-surface-alt); }

.policy-brief .pb-link {
  color: var(--pb-primary); text-decoration: underline; text-decoration-color: rgba(29,78,216,0.3);
  text-underline-offset: 2px; transition: text-decoration-color 0.15s;
}
.policy-brief .pb-link:hover { text-decoration-color: var(--pb-primary); }

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

.pb-p { color: var(--pb-text-secondary); font-size: 1rem; line-height: 1.75; margin: 0 0 16px; }

.pb-callout {
  background: var(--pb-primary-light); border-left: 4px solid var(--pb-primary);
  padding: 18px 22px; border-radius: 8px; color: var(--pb-text);
}
.pb-callout-warn { background: var(--pb-warning-light); border-left-color: var(--pb-warning); }
.pb-callout-danger { background: var(--pb-danger-light); border-left-color: var(--pb-danger); }

.pb-metric-card {
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 8px; padding: 18px; text-align: center;
}
.pb-mn { font-size: clamp(1.5rem, 3vw, 1.9rem); font-weight: 800; color: var(--pb-text); }
.pb-ml { font-size: 0.82rem; color: var(--pb-text-secondary); font-weight: 600; margin-top: 4px; }
.pb-ms { font-size: 0.72rem; color: var(--pb-text-muted); margin-top: 2px; }

.pb-chart {
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 8px; padding: 18px 20px; margin: 14px 0 28px;
}
.pb-chart-title { font-size: 0.92rem; font-weight: 700; color: var(--pb-text); margin-bottom: 12px; }
.pb-chart-source { font-size: 0.7rem; color: var(--pb-text-muted); margin-top: 10px; font-style: italic; }

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
.policy-brief details > summary::after { content: '+'; font-size: 1.1rem; color: var(--pb-text-muted); }
.policy-brief details[open] > summary::after { content: '−'; }
.policy-brief details > div {
  padding: 0 18px 16px; color: var(--pb-text-secondary);
  font-size: 0.94rem; line-height: 1.7;
}

.pb-hr { border: none; border-top: 1px solid var(--pb-border); margin: 36px 0; }

.pb-badge {
  display: inline-block; padding: 2px 8px; border-radius: 4px;
  font-size: 0.72rem; font-weight: 600;
}
.pb-badge-ok { background: var(--pb-success-light); color: var(--pb-success); }
.pb-badge-warn { background: var(--pb-warning-light); color: var(--pb-warning); }
.pb-badge-err { background: var(--pb-danger-light); color: var(--pb-danger); }
.pb-badge-neutral { background: var(--pb-surface-alt); color: var(--pb-text-secondary); }

.pb-fbtn {
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 4px; padding: 5px 12px; font-size: 0.8rem; cursor: pointer;
  color: var(--pb-text-secondary); transition: all 0.15s;
}
.pb-fbtn:hover { background: var(--pb-surface-alt); }
.pb-fbtn-on { background: var(--pb-primary); color: white; border-color: var(--pb-primary); }

.pb-tw { overflow-x: auto; background: var(--pb-surface); border: 1px solid var(--pb-border); border-radius: 6px; }
.pb-tbl { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.pb-tbl th {
  text-align: left; padding: 10px 14px; background: var(--pb-surface-alt);
  font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.04em;
  color: var(--pb-text-muted); border-bottom: 1px solid var(--pb-border);
}
.pb-tbl td {
  padding: 10px 14px; border-bottom: 1px solid var(--pb-border); color: var(--pb-text);
  vertical-align: top;
}
.pb-tbl tr:last-child td { border-bottom: none; }
.pb-tbl tr td:first-child { font-weight: 600; color: var(--pb-text-secondary); white-space: nowrap; }

/* Timeline (MICITT) */
.pb-timeline { position: relative; padding: 6px 0 6px 32px; margin: 12px 0 8px; }
.pb-timeline::before {
  content: ''; position: absolute; left: 12px; top: 8px; bottom: 8px;
  width: 2px; background: var(--pb-border);
}
.pb-tl-event { position: relative; margin-bottom: 28px; }
.pb-tl-event:last-child { margin-bottom: 0; }
.pb-tl-dot {
  position: absolute; left: -25px; top: 5px; width: 14px; height: 14px;
  border-radius: 50%; background: var(--pb-primary); border: 3px solid var(--pb-surface);
  box-shadow: 0 0 0 2px var(--pb-border);
}
.pb-tl-date {
  font-size: 0.78rem; font-weight: 700; color: var(--pb-primary);
  text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px;
}
.pb-tl-title { font-size: 1rem; font-weight: 700; color: var(--pb-text); margin: 0 0 6px; }
.pb-tl-body { font-size: 0.92rem; color: var(--pb-text-secondary); margin: 0 0 8px; line-height: 1.65; }
.pb-tl-quote {
  font-style: italic; color: var(--pb-text);
  background: var(--pb-surface-alt); padding: 10px 14px; border-radius: 6px;
  border-left: 3px solid var(--pb-primary); margin: 6px 0; font-size: 0.9rem;
}
.pb-tl-source { font-size: 0.72rem; color: var(--pb-text-muted); margin-top: 6px; font-style: italic; }

/* Recommendations */
.pb-rec {
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 8px; padding: 18px 20px; margin-bottom: 12px;
  display: grid; grid-template-columns: 56px 1fr; gap: 14px; align-items: start;
}
.pb-rec-num {
  font-size: 1.4rem; font-weight: 800; color: var(--pb-primary);
  background: var(--pb-primary-light); border-radius: 6px;
  width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;
}
.pb-rec-title { font-size: 1.02rem; font-weight: 700; color: var(--pb-text); margin: 0 0 6px; }
.pb-rec-body { font-size: 0.93rem; color: var(--pb-text-secondary); margin: 0; line-height: 1.7; }

/* Model card */
.pb-model {
  background: var(--pb-surface); border: 1px solid var(--pb-border);
  border-radius: 8px; padding: 18px 20px; margin-bottom: 14px;
}
.pb-model-head {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline;
  border-bottom: 1px solid var(--pb-border); padding-bottom: 10px; margin-bottom: 10px;
}
.pb-model-region { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--pb-primary); }
.pb-model-name { font-size: 1.08rem; font-weight: 700; color: var(--pb-text); }
.pb-model-ref { font-size: 0.78rem; color: var(--pb-text-muted); }
.pb-model-meta { display: flex; flex-wrap: wrap; gap: 14px; font-size: 0.82rem; color: var(--pb-text-secondary); margin-bottom: 8px; }
.pb-model-meta strong { color: var(--pb-text); font-weight: 600; }
.pb-model-desc { font-size: 0.92rem; color: var(--pb-text-secondary); margin: 6px 0; line-height: 1.65; }
.pb-model-cr {
  font-size: 0.88rem; color: var(--pb-text); background: var(--pb-primary-light);
  border-left: 3px solid var(--pb-primary); padding: 8px 12px; border-radius: 4px;
  margin-top: 8px;
}

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
  .pb-chart, .pb-metric-card, .pb-rec, .pb-model { break-inside: avoid; }
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

function SH({ n, title, id }: { n: number; title: string; id: string }) {
  return (
    <div className="pb-sh" id={id} style={{ scrollMarginTop: 60 }}>
      <span className="pb-sn">{n}</span>
      <h2 className="pb-st">{title}</h2>
    </div>
  );
}

function Rich({ html, as: As = 'span', ...rest }: { html: string; as?: 'span' | 'p' | 'li'; [key: string]: unknown }) {
  return <As dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
}

/* Render a string body that may contain inline URLs. Detects http(s) URLs and
   anchors them; everything else is plain text. Keeps the article's editorial
   prose readable while making sources clickable. */
function linkify(text: string): React.ReactNode[] {
  const urlRe = /(https?:\/\/[^\s)]+)/g;
  const parts = text.split(urlRe);
  return parts.map((p, i) =>
    urlRe.test(p) ? (
      <Ext key={i} href={p}>
        {p}
      </Ext>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SVG CHART: SEMÁFORO (stacked horizontal bar of 57 findings)
   ═══════════════════════════════════════════════════════════════════ */

function SemaforoBar({
  items,
  total,
  label,
}: {
  items: readonly { level: string; color: string; count: number; description: string }[];
  total: number;
  label: string;
}) {
  const W = 620;
  const H = 56;
  let x = 0;
  const segments = items.map((it) => {
    const w = Math.round((it.count / total) * W);
    const seg = { x, w, ...it };
    x += w;
    return seg;
  });
  const colorVar = (c: string): string => {
    if (c === 'rojo') return 'var(--pb-danger)';
    if (c === 'amarillo') return 'var(--pb-warning)';
    if (c === 'verde') return 'var(--pb-success)';
    return 'var(--pb-text-muted)';
  };

  return (
    <div className="pb-chart">
      <div className="pb-chart-title">{label}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label}
        style={{ width: '100%', height: 'auto' }}
      >
        <title>{label}</title>
        {segments.map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={0} width={s.w} height={H} style={{ fill: colorVar(s.color) }} />
            <text
              x={s.x + s.w / 2}
              y={H / 2 + 5}
              textAnchor="middle"
              style={{ fill: 'white', fontWeight: 700, fontSize: 16 }}
            >
              {s.count}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 14 }}>
        {items.map((it) => (
          <div
            key={it.level}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              fontSize: '0.85rem',
              color: 'var(--pb-text-secondary)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: 3,
                background: colorVar(it.color),
                marginTop: 4,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <span>
              <strong style={{ color: 'var(--pb-text)' }}>
                {it.level} ({it.count})
              </strong>
              <br />
              <span style={{ color: 'var(--pb-text-muted)', fontSize: '0.78rem' }}>{it.description}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════════ */

export default function ArticleBrief({ locale }: { locale: Locale }) {
  const T = TRANSLATIONS[locale];
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [filter, setFilter] = useState<FilterKey>('all');

  const sections = useMemo(
    () =>
      SECTION_KEYS.map((s) => ({
        id: s.id,
        label: (T.sections as Record<string, string>)[s.tkey] ?? s.tkey,
      })),
    [T],
  );

  const homeHref = `/${locale}/`;
  const analysisHref = `/${locale}/analisis/`;

  const FILTER_KEYS: readonly { key: FilterKey; col: 0 | 1 | 2 | 3 }[] = [
    { key: 'all', col: 0 },
    { key: '23771', col: 1 },
    { key: '23919', col: 2 },
    { key: '24484', col: 3 },
  ] as const;

  return (
    <>
      <style>{CSS}</style>
      <div className="policy-brief" data-theme={theme}>

        {/* Theme toggle */}
        <button
          type="button"
          className="pb-theme-btn"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
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

        {/* HEADER */}
        <header style={{ background: 'var(--pb-surface)', borderBottom: '1px solid var(--pb-border)' }}>
          <div style={{ maxWidth: 880, margin: '0 auto', padding: '36px 24px 44px' }}>
            <nav aria-label="breadcrumb" style={{ fontSize: 12, color: 'var(--pb-text-muted)', marginBottom: 20 }}>
              <Link href={homeHref} style={{ color: 'var(--pb-text-muted)', textDecoration: 'none' }}>
                {T.breadcrumb.home}
              </Link>
              <span style={{ margin: '0 6px' }}>›</span>
              <Link href={analysisHref} style={{ color: 'var(--pb-text-muted)', textDecoration: 'none' }}>
                {T.breadcrumb.analysis}
              </Link>
              <span style={{ margin: '0 6px' }}>›</span>
              <span style={{ color: 'var(--pb-text-secondary)', fontWeight: 500 }}>{T.breadcrumb.current}</span>
            </nav>
            <h1
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                fontWeight: 800,
                color: 'var(--pb-text)',
                lineHeight: 1.15,
                marginTop: 8,
              }}
            >
              {T.meta.title}
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--pb-text-secondary)', marginTop: 16, lineHeight: 1.6 }}>
              {T.meta.description}
            </p>
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '6px 14px',
                fontSize: 13,
                color: 'var(--pb-text-muted)',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--pb-text)' }}>{T.meta.author}</span>
              <span aria-hidden>·</span>
              <time dateTime="2026-05-22">{T.meta.date}</time>
              <span aria-hidden>·</span>
              <span>{T.meta.org}</span>
            </div>
          </div>
        </header>

        {/* TOC */}
        <nav
          style={{
            background: 'var(--pb-surface)',
            borderBottom: '1px solid var(--pb-border)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 24px' }} className="pb-toc">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        {/* CONTENT */}
        <main style={{ background: 'var(--pb-bg)' }}>
          <div style={{ maxWidth: 880, margin: '0 auto', padding: '44px 24px 64px' }}>

            {/* ── Executive Summary ── */}
            <section id="resumen" style={{ scrollMarginTop: 60 }}>
              <div className="pb-callout" style={{ marginBottom: 40 }}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    marginBottom: 12,
                    color: 'var(--pb-primary)',
                  }}
                >
                  {T.summary.heading}
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    fontSize: '0.92rem',
                  }}
                >
                  {T.summary.bullets.map((html, i) => (
                    <li key={i}>
                      → <Rich html={html} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── Metric Cards (5) ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: 14,
                marginBottom: 48,
              }}
            >
              {(['expedientes', 'claims', 'hallazgos', 'impactos', 'convocados'] as const).map((key, i) => {
                const m = (T.metrics as Record<string, { value: string; label: string; sub: string }>)[key];
                const isStalled = key === 'convocados';
                const isCritical = key === 'hallazgos';
                return (
                  <div key={key} className="pb-metric-card">
                    <div
                      className="pb-mn"
                      style={{
                        color: isStalled
                          ? 'var(--pb-danger)'
                          : isCritical
                          ? 'var(--pb-warning)'
                          : i === 0
                          ? 'var(--pb-primary)'
                          : undefined,
                      }}
                    >
                      {m.value}
                    </div>
                    <div className="pb-ml">{m.label}</div>
                    <div className="pb-ms">{m.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* ═══ SECTION 1: COMPARATIVA ═══ */}
            <section>
              <SH n={1} title={T.comparativa.sectionTitle} id="comparativa" />
              <p className="pb-p">{T.comparativa.intro}</p>

              {/* Filter buttons (highlight one column at a time) */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {FILTER_KEYS.map((f) => {
                  const label = (T.comparativa.tableHeaders[f.col] || (T.sections as Record<string, string>).comparativa) as string;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      className={`pb-fbtn ${filter === f.key ? 'pb-fbtn-on' : ''}`}
                      onClick={() => setFilter(f.key)}
                    >
                      {f.key === 'all' ? (locale === 'es' ? 'Todos' : 'All') : label}
                    </button>
                  );
                })}
              </div>

              <div className="pb-tw">
                <table className="pb-tbl">
                  <thead>
                    <tr>
                      {T.comparativa.tableHeaders.map((h, i) => {
                        const dim = filter !== 'all' && i !== 0 && FILTER_KEYS[i]?.key !== filter;
                        return (
                          <th
                            key={i}
                            style={{
                              opacity: dim ? 0.35 : 1,
                              minWidth: i === 0 ? 130 : 180,
                            }}
                          >
                            {h || (locale === 'es' ? 'Atributo' : 'Attribute')}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {T.comparativa.rows.map((row, i) => (
                      <tr key={i}>
                        <td>{row.field}</td>
                        {(['v1', 'v2', 'v3'] as const).map((vKey, vi) => {
                          const colIdx = vi + 1;
                          const dim = filter !== 'all' && FILTER_KEYS[colIdx]?.key !== filter;
                          return (
                            <td key={vKey} style={{ opacity: dim ? 0.35 : 1, fontSize: '0.86rem' }}>
                              {row[vKey]}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--pb-text-muted)', marginTop: 10, fontStyle: 'italic' }}>
                {T.comparativa.source}
              </p>

              <div className="pb-callout pb-callout-warn" style={{ marginTop: 24 }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>
                  {locale === 'es'
                    ? 'Hallazgo central'
                    : 'Headline finding'}
                </p>
                <p style={{ fontSize: '0.92rem', margin: 0 }}>
                  {locale === 'es' ? (
                    <>
                      Los tres expedientes proponen <strong>arquitecturas institucionales incompatibles entre sí</strong>. Si se aprobaran sin armonización, Costa Rica tendría dos reguladores paralelos (ARIA + MICITT) con mandatos superpuestos y sin jerarquía definida.
                    </>
                  ) : (
                    <>
                      The three bills propose <strong>institutional architectures that are mutually incompatible</strong>. Approved without harmonization, Costa Rica would have two parallel regulators (ARIA + MICITT) with overlapping mandates and no defined hierarchy.
                    </>
                  )}
                </p>
              </div>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 2: CRONOLOGÍA MICITT ═══ */}
            <section>
              <SH n={2} title={T.cronologiaMICITT.sectionTitle} id="micitt" />
              <p className="pb-p">{T.cronologiaMICITT.intro}</p>

              <div className="pb-timeline">
                {T.cronologiaMICITT.events.map((evt, i) => (
                  <div key={i} className="pb-tl-event">
                    <div className="pb-tl-dot" aria-hidden="true" />
                    <div className="pb-tl-date">{evt.date}</div>
                    <h3 className="pb-tl-title">{evt.title}</h3>
                    <p className="pb-tl-body">{evt.body}</p>
                    {Array.isArray((evt as { quotes?: readonly string[] }).quotes)
                      ? (evt as { quotes: readonly string[] }).quotes.map((q, qi) => (
                          <p key={qi} className="pb-tl-quote">
                            {q}
                          </p>
                        ))
                      : null}
                    <p className="pb-tl-source">{evt.source}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 3: RIESGO ═══ */}
            <section>
              <SH n={3} title={T.riesgo.sectionTitle} id="riesgo" />

              <SemaforoBar
                items={T.riesgo.hallazgos.items}
                total={T.riesgo.hallazgos.total}
                label={T.riesgo.hallazgos.label}
              />

              <div className="pb-dual" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
                <div className="pb-chart">
                  <div className="pb-chart-title">{T.riesgo.claims.label}</div>
                  <div
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      fontWeight: 800,
                      color: 'var(--pb-primary)',
                    }}
                  >
                    {T.riesgo.claims.value}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--pb-text-secondary)', marginTop: 6 }}>
                    {T.riesgo.claims.breakdown}
                  </p>
                </div>
                <div className="pb-chart">
                  <div className="pb-chart-title">{T.riesgo.impactos.label}</div>
                  <div
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      fontWeight: 800,
                      color: 'var(--pb-warning)',
                    }}
                  >
                    {T.riesgo.impactos.total}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--pb-text-secondary)', marginTop: 6 }}>
                    {T.riesgo.impactos.breakdown}
                  </p>
                </div>
              </div>

              <div className="pb-callout pb-callout-danger" style={{ marginTop: 24 }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>
                  {T.riesgo.hallazgoPrincipal.title}
                </p>
                <p style={{ fontSize: '0.92rem', marginBottom: 8 }}>{T.riesgo.hallazgoPrincipal.body}</p>
                <p style={{ fontSize: '0.86rem', color: 'var(--pb-text-secondary)', margin: 0 }}>
                  {T.riesgo.hallazgoPrincipal.note}
                </p>
              </div>

              <details style={{ marginTop: 16 }}>
                <summary>
                  {locale === 'es' ? 'Sobre el método del análisis' : 'About the analysis method'}
                </summary>
                <div>
                  <p>{T.riesgo.methodNote}</p>
                  <p style={{ marginTop: 8, fontSize: '0.8rem', fontStyle: 'italic' }}>{T.riesgo.dataSource}</p>
                </div>
              </details>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 4: MODELOS INTERNACIONALES ═══ */}
            <section>
              <SH n={4} title={T.modelosInternacionales.sectionTitle} id="modelos" />
              <p className="pb-p">{T.modelosInternacionales.intro}</p>

              <div>
                {T.modelosInternacionales.models.map((m) => (
                  <div key={m.region} className="pb-model">
                    <div className="pb-model-head">
                      <span className="pb-model-region">{m.region}</span>
                      <span className="pb-model-name">{m.name}</span>
                      <span className="pb-model-ref">· {m.reference}</span>
                    </div>
                    <div className="pb-model-meta">
                      <span>
                        <strong>{locale === 'es' ? 'Estado:' : 'Status:'}</strong> {m.status}
                      </span>
                      <span>
                        <strong>{locale === 'es' ? 'Desde:' : 'Since:'}</strong> {m.since}
                      </span>
                      <span>
                        <strong>{locale === 'es' ? 'Enfoque:' : 'Approach:'}</strong> {m.approach}
                      </span>
                    </div>
                    <p className="pb-model-desc">{linkify(m.description)}</p>
                    <p className="pb-model-desc" style={{ fontSize: '0.85rem', color: 'var(--pb-text-muted)' }}>
                      <strong style={{ color: 'var(--pb-text-secondary)' }}>
                        {locale === 'es' ? 'Sanciones:' : 'Penalties:'}
                      </strong>{' '}
                      {m.sanctions}
                    </p>
                    <p className="pb-model-cr">{m.crContext}</p>
                  </div>
                ))}
              </div>

              <div className="pb-callout" style={{ marginTop: 18 }}>
                <p style={{ fontSize: '0.92rem', margin: 0 }}>{T.modelosInternacionales.centroamerica}</p>
              </div>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 5: RECOMENDACIONES ═══ */}
            <section>
              <SH n={5} title={T.recomendaciones.sectionTitle} id="recomendaciones" />
              <p className="pb-p">{T.recomendaciones.intro}</p>

              {T.recomendaciones.items.map((it) => (
                <div key={it.number} className="pb-rec">
                  <div className="pb-rec-num">{it.number}</div>
                  <div>
                    <h3 className="pb-rec-title">{it.title}</h3>
                    <p className="pb-rec-body">{it.body}</p>
                  </div>
                </div>
              ))}

              <div className="pb-callout" style={{ marginTop: 20 }}>
                <p style={{ fontStyle: 'italic', fontSize: '0.95rem', margin: 0 }}>
                  {T.recomendaciones.synthesis}
                </p>
              </div>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION 6: FUENTES ═══ */}
            <section>
              <SH n={6} title={T.fuentes.sectionTitle} id="fuentes" />
              {T.fuentes.groups.map((g) => (
                <div key={g.label} style={{ marginBottom: 22 }}>
                  <h3
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: 'var(--pb-text)',
                      margin: '0 0 8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {g.label}
                  </h3>
                  <ul
                    style={{
                      listStyle: 'disc',
                      paddingLeft: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      fontSize: '0.88rem',
                      color: 'var(--pb-text-secondary)',
                    }}
                  >
                    {g.items.map((it, i) => (
                      <li key={i}>{linkify(it)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

          </div>
        </main>

        {/* FOOTER */}
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
