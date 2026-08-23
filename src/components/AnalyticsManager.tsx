'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import {
  ANALYTICS_CONSENT_COPY,
  ANALYTICS_CONSENT_KEY,
  localeFromPath,
  trackEvent,
  type AnalyticsEventName,
  type AnalyticsEventParams,
} from '@/lib/analytics';
import type { Locale } from '@/i18n/config';

type Consent = 'granted' | 'denied' | null;

function classifyAnchor(anchor: HTMLAnchorElement): { name: AnalyticsEventName; params: Partial<AnalyticsEventParams> } | null {
  const href = anchor.getAttribute('href');
  if (!href) return null;
  const explicitName = anchor.dataset.analyticsEvent as AnalyticsEventName | undefined;
  if (explicitName) {
    return {
      name: explicitName,
      params: {
        section: anchor.dataset.analyticsSection,
        content_type: anchor.dataset.analyticsContentType,
        content_id: anchor.dataset.analyticsContentId,
        interaction: anchor.dataset.analyticsInteraction,
      },
    };
  }

  if (anchor.hasAttribute('download')) return { name: 'asset_download', params: { section: 'comparte', content_type: 'asset', content_id: anchor.getAttribute('download') ?? undefined } };
  if (href.startsWith('mailto:')) return { name: 'contact_click', params: { section: 'contacto', interaction: 'email' } };
  if (/^\/(es|en)\/proyectos\//.test(href)) return { name: 'content_open', params: { section: 'proyectos', content_type: 'proyecto', content_id: href.split('/').filter(Boolean).at(-1) } };
  if (/^\/(es|en)\/instituciones\//.test(href)) return { name: 'content_open', params: { section: 'instituciones', content_type: 'institucion', content_id: href.split('/').filter(Boolean).at(-1) } };
  if (/^\/(es|en)\/analisis(?:\/|$)/.test(href)) return { name: 'analysis_open', params: { section: 'analisis', content_type: 'analysis', content_id: href.split('/').filter(Boolean).at(-1) ?? 'index' } };
  if (/^\/(es|en)(?:\/|$)/.test(href) && anchor.hreflang) return { name: 'language_change', params: { section: 'navigation', interaction: anchor.hreflang } };
  if (href === '/api/' || href.startsWith('/api/')) return { name: 'api_open', params: { section: 'api', content_type: 'api' } };

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return { name: 'outbound_click', params: { section: anchor.dataset.analyticsSection ?? 'external_link', destination_host: url.hostname } };
  } catch {
    return null;
  }
  return null;
}

export function AnalyticsManager({
  measurementId,
  locale,
}: {
  measurementId?: string;
  locale: Locale;
}) {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    setConsent(stored === 'granted' || stored === 'denied' ? stored : null);
  }, []);

  useEffect(() => {
    if (consent !== 'granted') return;
    const sentDepths = new Set<number>();
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest('a');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const classified = classifyAnchor(anchor);
      if (!classified) return;
      trackEvent(classified.name, {
        locale: localeFromPath(window.location.pathname),
        section: classified.params.section ?? 'unknown',
        ...classified.params,
      });
    };
    const onScroll = () => {
      const root = document.documentElement;
      const scrollable = root.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((window.scrollY / scrollable) * 100);
      ([25, 50, 75, 90] as const).forEach((depth) => {
        if (percent >= depth && !sentDepths.has(depth)) {
          sentDepths.add(depth);
          trackEvent('reading_progress', {
            locale: localeFromPath(window.location.pathname),
            section: window.location.pathname.includes('/analisis/') ? 'analisis' : 'page',
            content_type: window.location.pathname.includes('/analisis/') ? 'article' : 'page',
            content_id: window.location.pathname,
            depth_percent: depth,
          });
        }
      });
    };
    document.addEventListener('click', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
    };
  }, [consent]);

  function choose(next: Exclude<Consent, null>) {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, next);
    setConsent(next);
  }

  return (
    <>
      {measurementId && consent === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
          <Script id="ga4-config" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {measurementId && consent === null && (
        <aside className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-lg border border-slate-300 bg-white p-4 shadow-xl" aria-label={ANALYTICS_CONSENT_COPY[locale].policy}>
          <p className="text-sm text-slate-700">
            {ANALYTICS_CONSENT_COPY[locale].text}{' '}
            <a href={`/${locale}/privacidad/`} className="font-medium text-institucional-700 underline underline-offset-2">{ANALYTICS_CONSENT_COPY[locale].policy}</a>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => choose('granted')} className="rounded-md bg-institucional-700 px-3 py-2 text-sm font-semibold text-white hover:bg-institucional-800">{ANALYTICS_CONSENT_COPY[locale].accept}</button>
            <button type="button" onClick={() => choose('denied')} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">{ANALYTICS_CONSENT_COPY[locale].reject}</button>
          </div>
        </aside>
      )}
    </>
  );
}
