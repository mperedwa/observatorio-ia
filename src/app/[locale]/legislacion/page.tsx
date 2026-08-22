import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Legislacion } from '@/components/Legislacion';
import { applyConteosLegislacion } from '@/data/legislacion';
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
  const title = `${t.nav.legislacion} — ${t.siteName}`;
  const description = applyConteosLegislacion(t.legislacion.sub);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.observatorioia.org/${lc}/legislacion/`,
      siteName: t.siteName,
      locale: lc === 'es' ? 'es_CR' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `/${lc}/legislacion/`,
      languages: {
        es: '/es/legislacion/',
        en: '/en/legislacion/',
        'x-default': '/es/legislacion/',
      },
    },
  };
}

export default async function LegislacionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <Breadcrumb
          locale={lc}
          items={[
            { label: t.breadcrumb.inicio, href: `/${lc}/` },
            { label: t.nav.legislacion },
          ]}
        />
      </div>
      <Legislacion locale={lc} t={t} headingLevel="h1" />
    </div>
  );
}
