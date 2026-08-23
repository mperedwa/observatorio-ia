import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ANALYTICS_CONSENT_COPY } from '../src/lib/analytics';

describe('consentimiento de analítica bilingüe', () => {
  it('mantiene copy independiente para inglés y español', () => {
    expect(ANALYTICS_CONSENT_COPY.en.text).toContain('We use analytics');
    expect(ANALYTICS_CONSENT_COPY.en.accept).toBe('Accept analytics');
    expect(ANALYTICS_CONSENT_COPY.en.reject).toBe('Necessary only');
    expect(ANALYTICS_CONSENT_COPY.en.text).not.toContain('Usamos analítica');
    expect(ANALYTICS_CONSENT_COPY.es.text).toContain('Usamos analítica');
  });

  it('monta el consentimiento dentro del layout que ya conoce el locale', () => {
    const root = process.cwd();
    const rootLayout = readFileSync(join(root, 'src/app/layout.tsx'), 'utf8');
    const localeLayout = readFileSync(
      join(root, 'src/app/[locale]/layout.tsx'),
      'utf8',
    );

    expect(rootLayout).not.toContain('<AnalyticsManager');
    expect(localeLayout).toContain('<AnalyticsManager');
    expect(localeLayout).toContain('locale={locale as Locale}');
  });
});
