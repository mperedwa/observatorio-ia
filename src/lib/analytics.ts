'use client';

import type { Locale } from '@/i18n/config';

export const ANALYTICS_CONSENT_KEY = 'observatorioia.analytics-consent.v1';

export type AnalyticsEventName =
  | 'content_open'
  | 'visualization_interaction'
  | 'outbound_click'
  | 'asset_download'
  | 'api_open'
  | 'language_change'
  | 'contact_click'
  | 'analysis_open'
  | 'reading_progress';

export interface AnalyticsEventParams {
  locale: Locale;
  section: string;
  content_type?: string;
  content_id?: string;
  interaction?: string;
  destination_host?: string;
  depth_percent?: 25 | 50 | 75 | 90;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function analyticsAllowed(): boolean {
  return typeof window !== 'undefined' && localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'granted';
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsEventParams): void {
  if (!analyticsAllowed() || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

export function localeFromPath(pathname: string): Locale {
  return pathname.startsWith('/en/') || pathname === '/en' ? 'en' : 'es';
}
