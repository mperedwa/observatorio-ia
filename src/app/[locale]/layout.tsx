import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const meta = {
  es: {
    title: 'Observatorio IA Costa Rica',
    description:
      'Mapeo público y abierto de los proyectos, leyes e indicadores de inteligencia artificial en el sector público costarricense.',
    ogTitle: 'Observatorio IA Costa Rica',
    ogDesc: 'Proyectos, legislación e indicadores de IA en el gobierno de Costa Rica.',
    ogLocale: 'es_CR',
  },
  en: {
    title: 'AI Observatory Costa Rica',
    description:
      'Open public map of AI projects, laws and indicators across the Costa Rican public sector.',
    ogTitle: 'AI Observatory Costa Rica',
    ogDesc: 'AI projects, legislation and indicators in the government of Costa Rica.',
    ogLocale: 'en_US',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const m = meta[locale as Locale];
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDesc,
      url: `https://observatorioia.org/${locale}/`,
      siteName: m.ogTitle,
      locale: m.ogLocale,
      type: 'website',
      images: [
        {
          url: `https://observatorioia.org/comparte-assets/${locale}/og-home-1200x630.png`,
          width: 1200,
          height: 630,
          alt: m.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.ogTitle,
      description: m.ogDesc,
      images: [`https://observatorioia.org/comparte-assets/${locale}/og-home-1200x630.png`],
    },
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        es: '/es/',
        en: '/en/',
        'x-default': '/es/',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const t = getDictionary(locale as Locale);
  return (
    <>
      <Nav locale={locale as Locale} t={t} />
      <main lang={locale}>{children}</main>
      <Footer locale={locale as Locale} t={t} />
    </>
  );
}
