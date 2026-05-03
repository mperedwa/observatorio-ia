import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AssetKpiHero } from '@/components/share/AssetKpiHero';
import { AssetTimeline } from '@/components/share/AssetTimeline';
import { AssetIlia } from '@/components/share/AssetIlia';
import { AssetMapa } from '@/components/share/AssetMapa';
import { AssetBrecha } from '@/components/share/AssetBrecha';
import { AssetOg, type OgVariant } from '@/components/share/AssetOg';
import { AssetStory, type StoryVariant } from '@/components/share/AssetStory';
import { SIZES } from '@/components/share/AssetFrame';
import { ASSET_SPECS } from '@/components/share/specs';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    ASSET_SPECS.map((spec) => ({ locale, type: spec.type })),
  );
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AssetPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const spec = ASSET_SPECS.find((s) => s.type === type);
  if (!spec) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);
  const size = SIZES[spec.size];

  let asset;
  if (type === 'kpi-hero') asset = <AssetKpiHero locale={lc} t={t} size={size} />;
  else if (type === 'timeline') asset = <AssetTimeline locale={lc} t={t} size={size} />;
  else if (type === 'ilia') asset = <AssetIlia locale={lc} t={t} size={size} />;
  else if (type === 'mapa') asset = <AssetMapa locale={lc} t={t} size={size} />;
  else if (type.startsWith('brecha-'))
    asset = <AssetBrecha locale={lc} t={t} size={size} brechaId={type.replace(/^brecha-/, '')} />;
  else if (type.startsWith('og-'))
    asset = (
      <AssetOg
        locale={lc}
        t={t}
        size={size}
        variant={type.replace(/^og-/, '') as OgVariant}
      />
    );
  else if (type.startsWith('story-'))
    asset = (
      <AssetStory
        locale={lc}
        t={t}
        size={size}
        variant={type.replace(/^story-/, '') as StoryVariant}
      />
    );
  else notFound();

  return (
    <div
      style={{
        background: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      {asset}
    </div>
  );
}
