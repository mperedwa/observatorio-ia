import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { InstitucionesGrid } from '@/components/InstitucionesGrid';
import { COUNTERS } from '@/data/counters';
import { applyCounters } from '@/i18n/applyCounters';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';

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
  const t = getDictionary(lc);
  const title = `${t.nav.instituciones} — ${t.siteName}`;
  const description = applyCounters(t.instituciones.sub, COUNTERS);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.observatorioia.org/${lc}/instituciones/`,
      siteName: t.siteName,
      locale: lc === 'es' ? 'es_CR' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `/${lc}/instituciones/`,
      languages: {
        es: '/es/instituciones/',
        en: '/en/instituciones/',
        'x-default': '/es/instituciones/',
      },
    },
  };
}

export default async function InstitucionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <Breadcrumb
          locale={lc}
          items={[
            { label: t.breadcrumb.inicio, href: `/${lc}/` },
            { label: t.nav.instituciones },
          ]}
        />
      </div>
      <InstitucionesGrid locale={lc} t={t} headingLevel="h1" />
    </div>
  );
}
