import { Hero } from '@/components/Hero';
import { TimelineAdopcion } from '@/components/TimelineAdopcion';
import { InstitucionesGrid } from '@/components/InstitucionesGrid';
import { MapaProyectos } from '@/components/MapaProyectos';
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
      <Hero locale={locale as Locale} t={t} />
      <TimelineAdopcion locale={locale as Locale} t={t} />
      <InstitucionesGrid locale={locale as Locale} t={t} />
      <MapaProyectos locale={locale as Locale} t={t} />
      <Legislacion locale={locale as Locale} t={t} />
      <Indicadores locale={locale as Locale} t={t} />
      <Recursos locale={locale as Locale} t={t} />
      <Acerca locale={locale as Locale} t={t} />
    </>
  );
}
