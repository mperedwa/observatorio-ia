import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BrechaCard } from '@/components/BrechaCard';
import { articulosOrdenados } from '@/data/articulos';
import { brechas } from '@/data/brechas';
import { comparativaRegional } from '@/data/indicadores';
import { expedientes } from '@/data/legislacion';
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
  const titulo = `${t.analisis.titulo} — ${t.siteName}`;
  return {
    title: titulo,
    description: t.analisis.metaDescripcion,
    openGraph: {
      title: titulo,
      description: t.analisis.metaDescripcion,
      url: `https://observatorioia.org/${locale}/analisis/`,
      siteName: t.siteName,
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      type: 'article',
      images: [
        {
          url: `https://observatorioia.org/comparte-assets/${locale}/og-analisis-1200x630.png`,
          width: 1200,
          height: 630,
          alt: titulo,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: t.analisis.metaDescripcion,
      images: [`https://observatorioia.org/comparte-assets/${locale}/og-analisis-1200x630.png`],
    },
    alternates: {
      canonical: `/${locale}/analisis/`,
      languages: {
        es: '/es/analisis/',
        en: '/en/analisis/',
        'x-default': '/es/analisis/',
      },
    },
  };
}

export default async function AnalisisPage({
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
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-12">
          <Breadcrumb
            locale={lc}
            items={[
              { label: t.breadcrumb.inicio, href: `/${lc}/` },
              { label: t.analisis.kicker },
            ]}
          />
          <p className="mt-6 text-sm font-medium uppercase tracking-wider text-institucional-700">
            {t.analisis.kicker}
          </p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-slate-900 text-balance leading-tight max-w-4xl">
            {t.analisis.titulo}
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl text-pretty">
            {t.analisis.sub}
          </p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.analisis.articulosTitulo}
          </h2>
          <p className="mt-2 text-slate-600 max-w-3xl text-pretty">
            {t.analisis.articulosSub}
          </p>
        </header>
        {articulosOrdenados.length === 0 ? (
          <p className="text-sm text-slate-500 italic">{t.analisis.articulosVacio}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articulosOrdenados.map((a) => {
              const m = a.meta(lc);
              return (
                <Link
                  key={a.slug}
                  href={`/${lc}/analisis/${a.slug}/`}
                  className="group flex flex-col bg-white border border-slate-200 rounded-lg p-5 hover:border-institucional-700 hover:shadow-sm transition-all"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-institucional-700">
                    {m.kicker}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 text-balance leading-snug group-hover:text-institucional-900">
                    {m.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 text-pretty line-clamp-3">
                    {m.descripcion}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      <time dateTime={a.fecha}>{m.fechaDisplay}</time>
                      <span aria-hidden className="mx-2">·</span>
                      <span>{m.author}</span>
                    </span>
                    <span className="text-institucional-700 font-medium whitespace-nowrap group-hover:underline">
                      {t.analisis.articulosLeerMas} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.analisis.comparativaTitulo}
          </h2>
          <p className="mt-2 text-slate-600 max-w-3xl text-pretty">
            {t.analisis.comparativaSub}
          </p>
        </header>
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">{t.analisis.comparativaCols.pais}</th>
                <th className="text-right px-4 py-3">{t.analisis.comparativaCols.ilia}</th>
                <th className="text-left px-4 py-3">{t.analisis.comparativaCols.inversion}</th>
                <th className="text-left px-4 py-3">{t.analisis.comparativaCols.ente}</th>
                <th className="text-left px-4 py-3">{t.analisis.comparativaCols.hito}</th>
              </tr>
            </thead>
            <tbody>
              {comparativaRegional.map((p) => (
                <tr
                  key={p.pais.es}
                  className={`border-t border-slate-200 align-top ${
                    p.destacado ? 'bg-institucional-50' : ''
                  }`}
                >
                  <td className="px-4 py-4 font-semibold text-slate-900 whitespace-nowrap">
                    {p.pais[lc]}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums font-semibold text-institucional-900">
                    {p.ilia.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{p.inversion[lc]}</td>
                  <td className="px-4 py-4 text-slate-700">{p.enteEjecutor[lc]}</td>
                  <td className="px-4 py-4 text-slate-700 text-pretty">
                    {p.hito[lc]}{' '}
                    <a
                      href={p.fuenteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-institucional-700 hover:underline whitespace-nowrap"
                    >
                      ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <header className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
              {t.analisis.brechasTitulo}
            </h2>
            <p className="mt-2 text-slate-600 max-w-3xl text-pretty">
              {t.analisis.brechasSub}
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {brechas.map((b) => (
              <BrechaCard key={b.id} brecha={b} locale={lc} t={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.analisis.legislacionTitulo}
          </h2>
          <p className="mt-2 text-slate-600 max-w-3xl text-pretty">
            {t.analisis.legislacionSub}
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {expedientes.map((e) => (
            <article
              key={e.numero}
              className="bg-white border border-slate-200 rounded-lg p-5"
            >
              <div className="text-xs uppercase tracking-wide text-slate-500">
                {t.legislacion.expedienteLabel}
              </div>
              <div className="text-2xl font-bold text-institucional-900 tabular-nums">
                {e.numero}
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900 text-balance">
                {e.titulo[lc]}
              </h3>
              <p className="mt-2 text-sm text-slate-600 text-pretty">{e.resumen[lc]}</p>
              <div className="mt-3 inline-block text-xs px-2 py-0.5 rounded border bg-amber-50 text-amber-800 border-amber-200">
                {t.legislacion.estados[e.estado]}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <p className="text-sm text-slate-500 italic text-pretty border-l-4 border-slate-300 pl-4">
          {t.analisis.notaCierre}
        </p>
      </section>
    </div>
  );
}
