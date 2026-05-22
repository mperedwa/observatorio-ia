/* ─────────────────────────────────────────────────────────────────────
 * Capa 3 — scaffold del componente principal de un análisis.
 *
 * Esta versión incluye:
 *  - El sistema de diseño completo (CSS variables light/dark, helpers
 *    `<Ext>`, `<SH>`, `<Rich>`, `linkify`, theme toggle, TOC sticky).
 *  - Header + breadcrumb + autor.
 *  - Resumen ejecutivo (callout con bullets).
 *  - 4 KPI cards.
 *  - 3 secciones placeholder (sectionA / sectionB / sectionC) que
 *    muestran los patrones más usados: párrafo + callout, lista de
 *    bullets, details/summary con métrica destacada.
 *  - Fuentes con grupos.
 *  - Footer.
 *
 * Al duplicar la carpeta:
 *  1. Renombra/reemplaza los `sectionX` por las secciones reales del
 *     número. Si el artículo no necesita la sección C, bórrala (también
 *     en `SECTION_KEYS` y en `translations.ts`).
 *  2. Si necesitas un SVG chart custom (timeline, gauge, bar stacked),
 *     copia el patrón de `01-ia-en-el-estado-costarricense/` o de
 *     `02-tres-leyes-ia-cr/`. NO inventes paletas: usa los
 *     `--pb-chart-1..4` ya declarados en el CSS de abajo.
 *  3. Los strings de las secciones del cuerpo viven en `translations.ts`.
 *     Mantén la simetría ES + EN.
 * ───────────────────────────────────────────────────────────────────── */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { t as TRANSLATIONS, type Locale } from './translations';

/* ═══════════════════════════════════════════════════════════════════
   SECCIONES (orden del TOC y del cuerpo)
   ═══════════════════════════════════════════════════════════════════ */

/** Mantener en sincronía con `translations.ts > sections`. */
const SECTION_KEYS = [
  { id: 'resumen', tkey: 'resumen' },
  { id: 'section-a', tkey: 'sectionA' },
  { id: 'section-b', tkey: 'sectionB' },
  { id: 'section-c', tkey: 'sectionC' },
  { id: 'fuentes', tkey: 'fuentes' },
] as const;

/* ═══════════════════════════════════════════════════════════════════
   STYLES — design system Capa 3.
   No edites paletas; el theme toggle alterna las variables.
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
   HELPERS (importables tal cual desde la copia)
   ═══════════════════════════════════════════════════════════════════ */

/** Anchor externo con `target="_blank"` y la clase `pb-link`. */
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="pb-link">
      {children}
    </a>
  );
}

/** Encabezado de sección numerado. `n` controla el badge circular; `id`
 *  alimenta los anchors del TOC sticky. */
function SH({ n, title, id }: { n: number; title: string; id: string }) {
  return (
    <div className="pb-sh" id={id} style={{ scrollMarginTop: 60 }}>
      <span className="pb-sn">{n}</span>
      <h2 className="pb-st">{title}</h2>
    </div>
  );
}

/** Render de strings que pueden contener `<strong>` (u otros tags
 *  inline básicos) vía `dangerouslySetInnerHTML`. Útil para mezclar
 *  énfasis sin partir el JSX. */
function Rich({ html, as: As = 'span', ...rest }: { html: string; as?: 'span' | 'p' | 'li'; [key: string]: unknown }) {
  return <As dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
}

/** Convierte cualquier `https?://...` dentro de un string en un `<Ext>`.
 *  Útil en bullets de fuentes o en `description` de tarjetas. */
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
   MAIN
   ═══════════════════════════════════════════════════════════════════ */

export default function ArticleBrief({ locale }: { locale: Locale }) {
  const T = TRANSLATIONS[locale];
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--pb-primary)',
              }}
            >
              {T.meta.seriesLabel}
            </p>
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
              <time>{T.meta.date}</time>
              <span aria-hidden>·</span>
              <span>{T.meta.org}</span>
            </div>
          </div>
        </header>

        {/* TOC sticky */}
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
                <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12, color: 'var(--pb-primary)' }}>
                  {T.summary.heading}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.92rem' }}>
                  {T.summary.bullets.map((html, i) => (
                    <li key={i}>
                      → <Rich html={html} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── KPI cards (4 por defecto; ajusta el grid si agregas/quitas) ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: 14,
                marginBottom: 48,
              }}
            >
              {(['metric1', 'metric2', 'metric3', 'metric4'] as const).map((key) => {
                const m = (T.metrics as Record<string, { value: string; label: string; sub: string }>)[key];
                return (
                  <div key={key} className="pb-metric-card">
                    <div className="pb-mn">{m.value}</div>
                    <div className="pb-ml">{m.label}</div>
                    <div className="pb-ms">{m.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* ═══ SECTION A — párrafo + callout opcional ═══ */}
            <section>
              <SH n={1} title={T.sectionA.sectionTitle} id="section-a" />
              <Rich as="p" html={T.sectionA.body} {...{ className: 'pb-p' }} />

              <div className="pb-callout" style={{ marginTop: 20 }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{T.sectionA.calloutTitle}</p>
                <p style={{ fontSize: '0.92rem', margin: 0 }}>{T.sectionA.callout}</p>
              </div>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION B — párrafo + lista de bullets ═══ */}
            <section>
              <SH n={2} title={T.sectionB.sectionTitle} id="section-b" />
              <p className="pb-p">{T.sectionB.body}</p>
              <ul
                style={{
                  padding: '0 0 0 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  color: 'var(--pb-text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                }}
              >
                {T.sectionB.bullets.map((b, i) => (
                  <li key={i}>{linkify(b)}</li>
                ))}
              </ul>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION C — párrafo + details/summary ═══ */}
            <section>
              <SH n={3} title={T.sectionC.sectionTitle} id="section-c" />
              <p className="pb-p">{T.sectionC.body}</p>
              <details>
                <summary>{T.sectionC.detailsLabel}</summary>
                <div>
                  <p>{T.sectionC.details}</p>
                </div>
              </details>
            </section>

            <hr className="pb-hr" />

            {/* ═══ SECTION FINAL — FUENTES ═══ */}
            <section>
              <SH n={4} title={T.fuentes.sectionTitle} id="fuentes" />
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
