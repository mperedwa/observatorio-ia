import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import ArticleBrief from './ArticleBrief';
import { t as TRANSLATIONS } from './translations';

const SLUG = '02-tres-leyes-ia-cr';
const PUBLISHED_AT = '2026-05-22T12:00:00-06:00';
const FECHA = '2026-05-22';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const lc = locale as Locale;
  const T = TRANSLATIONS[lc];
  const titulo = `${T.meta.title} — ${T.meta.org}`;
  const ogImage =
    lc === 'es'
      ? 'https://observatorioia.org/comparte-assets/es/og-analisis-1200x630.png'
      : 'https://observatorioia.org/comparte-assets/en/og-analisis-1200x630.png';
  return {
    title: titulo,
    description: T.meta.description,
    authors: [{ name: T.meta.author }],
    openGraph: {
      title: T.meta.title,
      description: T.meta.description,
      url: `https://observatorioia.org/${lc}/analisis/${SLUG}/`,
      siteName: T.meta.org,
      locale: lc === 'es' ? 'es_CR' : 'en_US',
      type: 'article',
      publishedTime: PUBLISHED_AT,
      authors: [T.meta.author],
      images: [{ url: ogImage, width: 1200, height: 630, alt: T.meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: T.meta.title,
      description: T.meta.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/${lc}/analisis/${SLUG}/`,
      languages: {
        es: `/es/analisis/${SLUG}/`,
        en: `/en/analisis/${SLUG}/`,
        'x-default': `/es/analisis/${SLUG}/`,
      },
    },
    other: {
      'article:published_time': PUBLISHED_AT,
      'article:section': T.breadcrumb.analysis,
      'article:tag': FECHA,
    },
  };
}

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lc = locale as Locale;

  return <ArticleBrief locale={lc} />;
}
