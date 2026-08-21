import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ExploradorEnia } from '@/components/ExploradorEnia';
import {
  contarIntervencionesEniaPorCruce,
  contarIntervencionesEniaPorTipo,
  inventarioEnia,
} from '@/data/eniaAcciones';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';
import { eniaTranslations } from './translations';

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
  const t = eniaTranslations[lc];
  const dictionary = getDictionary(lc);
  const title = `${t.metaTitle} — ${dictionary.siteName}`;

  return {
    title,
    description: t.metaDescription,
    openGraph: {
      title,
      description: t.metaDescription,
      url: `https://www.observatorioia.org/${lc}/enia/`,
      siteName: dictionary.siteName,
      locale: lc === 'es' ? 'es_CR' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `/${lc}/enia/`,
      languages: {
        es: '/es/enia/',
        en: '/en/enia/',
        'x-default': '/es/enia/',
      },
    },
  };
}

export default async function EniaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lc = locale as Locale;
  const dictionary = getDictionary(lc);
  const t = eniaTranslations[lc];
  const cruces = contarIntervencionesEniaPorCruce();
  const tipos = contarIntervencionesEniaPorTipo();
  const canonical = inventarioEnia.resumen.intervenciones - cruces['posible-duplicado'];
  const matches = cruces['mapeado-exacto'] + cruces['coincidencia-parcial'];

  const stats = [
    {
      value: inventarioEnia.resumen.intervenciones,
      label: t.stats.sourceRows,
      detail: `${cruces['posible-duplicado']} ${t.stats.repetitions}`,
    },
    { value: canonical, label: t.stats.canonicalRows },
    {
      value: tipos['solucion-ia-declarada'],
      label: t.stats.declaredSolutions,
      detail: t.stats.declaredSolutionsDetail,
    },
    { value: matches, label: t.stats.catalogLinks },
    { value: cruces['enia-solamente'], label: t.stats.unverifiedCommitments },
    { value: cruces['no-es-sistema-ia'], label: t.stats.nonSystems },
  ];

  return (
    <article className="bg-white">
      <header className="border-b border-slate-300 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-10 sm:pb-16">
          <Breadcrumb
            locale={lc}
            items={[
              { label: dictionary.breadcrumb.inicio, href: `/${lc}/` },
              { label: dictionary.nav.enia },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div className="max-w-4xl">
              <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
                {t.kicker}
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950 text-balance sm:text-6xl">
                {t.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 text-pretty">
                {t.intro}
              </p>
              <p className="mt-5 max-w-3xl border-l-4 border-institucional-700 pl-4 text-base font-semibold leading-relaxed text-slate-800">
                {t.thesis}
              </p>
            </div>
            <div className="border-t border-slate-300 pt-5 text-sm lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="text-slate-500">{t.updated}</p>
              <a
                href={inventarioEnia.fuente.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex font-semibold text-institucional-700 hover:underline"
              >
                {t.sourceLink} <span aria-hidden className="ml-1">↗</span>
              </a>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {t.sourceLanguage}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <section aria-label={lc === 'es' ? 'Resumen del inventario' : 'Inventory summary'}>
          <div className="grid grid-cols-2 border-y border-slate-300 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-4 py-5 sm:px-5 ${
                  index > 0 ? 'border-l border-slate-200' : ''
                } ${index === 3 ? 'md:border-l-0 lg:border-l' : ''}`}
              >
                <div className="text-3xl font-bold tabular-nums text-institucional-900 sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs font-semibold leading-snug text-slate-700">
                  {stat.label}
                </div>
                {stat.detail && (
                  <div className="mt-1 text-[11px] leading-snug text-slate-500">
                    {stat.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <ExploradorEnia locale={lc} />

        <section className="mt-16 border-t-4 border-institucional-800 bg-slate-50 px-6 py-8 sm:px-8">
          <h2 className="text-xl font-bold text-slate-900">{t.methodology.title}</h2>
          <p className="mt-3 max-w-4xl leading-relaxed text-slate-700">
            {t.methodology.body}
          </p>
          <ul className="mt-6 grid gap-5 text-sm leading-relaxed text-slate-700 md:grid-cols-3">
            <li className="border-t border-slate-300 pt-3">{t.methodology.canonical}</li>
            <li className="border-t border-slate-300 pt-3">{t.methodology.status}</li>
            <li className="border-t border-slate-300 pt-3">{t.methodology.evidence}</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
