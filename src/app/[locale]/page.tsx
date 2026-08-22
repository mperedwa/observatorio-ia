import { Hero } from '@/components/Hero';
import { PortadaEditorial } from '@/components/PortadaEditorial';
import { getDictionary } from '@/i18n/dictionaries';
import { type Locale } from '@/i18n/config';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  return (
    <>
      <Hero locale={locale as Locale} t={t} />
      <PortadaEditorial locale={locale as Locale} t={t} />
    </>
  );
}
