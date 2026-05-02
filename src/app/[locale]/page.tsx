import { Hero } from '@/components/Hero';
import { InstitucionesGrid } from '@/components/InstitucionesGrid';
import { Legislacion } from '@/components/Legislacion';
import { Indicadores } from '@/components/Indicadores';
import { Recursos } from '@/components/Recursos';
import { Acerca } from '@/components/Acerca';
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
      <Hero t={t} />
      <InstitucionesGrid locale={locale as Locale} t={t} />
      <Legislacion locale={locale as Locale} t={t} />
      <Indicadores locale={locale as Locale} t={t} />
      <Recursos locale={locale as Locale} t={t} />
      <Acerca t={t} />
    </>
  );
}
