import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EncabezadoSeccionExpediente } from '@/components/ExpedienteEditorial';
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
      <header className="border-b border-editorial-rule bg-editorial-paper">
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
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
                {t.kicker}
              </p>
              <h1 className="mt-3 font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
                {t.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-editorial-muted text-pretty">
                {t.intro}
              </p>
              <p className="mt-6 max-w-3xl border-l-2 border-editorial-accent pl-4 text-base font-semibold leading-relaxed text-editorial-ink">
                {t.thesis}
              </p>
            </div>
            <div className="border-t border-editorial-rule pt-5 text-sm lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
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
          <div className="grid grid-cols-2 border-t border-editorial-rule sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-b border-r border-editorial-rule px-3 py-5 even:border-r-0 sm:px-5 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(3n)]:border-r-0 lg:border-r lg:last:border-r-0"
              >
                <div className="font-editorial text-3xl font-semibold tabular-nums text-editorial-ink sm:text-4xl">
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

        <section className="mt-20 border-t border-editorial-rule pt-10">
          <EncabezadoSeccionExpediente index="02" title={t.methodology.title} />
          <div className="mt-7 grid gap-7 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-5">
            <span aria-hidden />
            <div>
              <p className="max-w-4xl leading-relaxed text-slate-700">
                {t.methodology.body}
              </p>
              <ol className="mt-7 grid border-t border-editorial-rule text-sm leading-relaxed text-slate-700 md:grid-cols-3 md:divide-x md:divide-editorial-rule">
                {[t.methodology.canonical, t.methodology.status, t.methodology.evidence].map((item, index) => (
                  <li key={item} className="border-b border-editorial-rule py-4 md:border-b-0 md:px-5 md:first:pl-0">
                    <span className="mb-2 block font-mono text-[0.68rem] tabular-nums text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
