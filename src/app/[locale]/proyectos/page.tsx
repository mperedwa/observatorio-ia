import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CatalogoProyectos } from '@/components/CatalogoProyectos';
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
  const t = getDictionary(locale as Locale);
  const title = `${t.nav.proyectos} — ${t.siteName}`;
  return {
    title,
    description: t.catalogo.metaDescripcion,
    openGraph: {
      title,
      description: t.catalogo.metaDescripcion,
      url: `https://www.observatorioia.org/${locale}/proyectos/`,
      siteName: t.siteName,
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}/proyectos/`,
      languages: {
        es: '/es/proyectos/',
        en: '/en/proyectos/',
        'x-default': '/es/proyectos/',
      },
    },
  };
}

export default async function CatalogoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);

  return (
    <article className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <Breadcrumb
          locale={lc}
          items={[
            { label: t.breadcrumb.inicio, href: `/${lc}/` },
            { label: t.nav.proyectos },
          ]}
        />

        <header className="mt-8 max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {t.catalogo.kicker}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-900 text-balance sm:text-5xl">
            {t.catalogo.titulo}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 text-pretty">
            {t.catalogo.sub}
          </p>
        </header>

        <CatalogoProyectos locale={lc} t={t} />

        <section className="mt-16 rounded-2xl border border-institucional-200 bg-institucional-50 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-institucional-700">
            {t.catalogo.metodologiaTitulo}
          </p>
          <p className="mt-3 max-w-4xl text-base leading-relaxed text-slate-700 text-pretty">
            {t.catalogo.metodologiaCuerpo}
          </p>
          <Link
            href={`/${lc}/quien-mantiene`}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-institucional-700 hover:underline"
          >
            {t.catalogo.metodologiaCta} <span aria-hidden>→</span>
          </Link>
        </section>
      </div>
    </article>
  );
}
