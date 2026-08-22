import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BrechaCard } from '@/components/BrechaCard';
import {
  EncabezadoSeccionExpediente,
  MarcaDocumental,
} from '@/components/ExpedienteEditorial';
import { articulosOrdenados } from '@/data/articulos';
import { brechas } from '@/data/brechas';
import { comparativaRegional } from '@/data/indicadores';
import {
  applyConteosLegislacion,
  expedientes,
} from '@/data/legislacion';
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
      url: `https://www.observatorioia.org/${locale}/analisis/`,
      siteName: t.siteName,
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      type: 'article',
      images: [
        {
          url: `https://www.observatorioia.org/comparte-assets/${locale}/og-analisis-1200x630.png`,
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
      images: [`https://www.observatorioia.org/comparte-assets/${locale}/og-analisis-1200x630.png`],
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
  const estadoTone = {
    'en-comision': 'atencion',
    dictaminado: 'parcial',
    'primer-debate': 'referencial',
    'segundo-debate': 'referencial',
    archivado: 'neutral',
    aprobada: 'confirmado',
  } as const;

  return (
    <div className="bg-white">
      <header className="border-b border-editorial-rule bg-editorial-paper">
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-10 sm:pb-16">
          <Breadcrumb
            locale={lc}
            items={[
              { label: t.breadcrumb.inicio, href: `/${lc}/` },
              { label: t.analisis.kicker },
            ]}
          />
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
            {t.analisis.kicker}
          </p>
          <h1 className="mt-3 max-w-4xl font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
            {t.analisis.titulo}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-editorial-muted text-pretty">
            {t.analisis.sub}
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <EncabezadoSeccionExpediente
          index="01"
          title={t.analisis.articulosTitulo}
          description={t.analisis.articulosSub}
        />
        {articulosOrdenados.length === 0 ? (
          <p className="mt-8 text-sm italic text-slate-500 sm:pl-[4.5rem]">
            {t.analisis.articulosVacio}
          </p>
        ) : (
          <ol className="mt-9 border-y border-editorial-rule sm:ml-[4.5rem]">
            {articulosOrdenados.map((a, index) => {
              const m = a.meta(lc);
              return (
                <li key={a.slug} className="border-b border-editorial-rule last:border-b-0">
                  <Link
                    href={`/${lc}/analisis/${a.slug}/`}
                    className="group grid gap-3 py-7 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:gap-5"
                  >
                    <span className="font-mono text-xs tabular-nums text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-institucional-700">
                        {m.kicker}
                      </span>
                      <span className="mt-2 block max-w-3xl font-editorial text-2xl font-semibold leading-tight text-editorial-ink text-balance group-hover:text-institucional-800 sm:text-3xl">
                        {m.titulo}
                      </span>
                      <span className="mt-3 block max-w-3xl text-sm leading-relaxed text-editorial-muted text-pretty">
                        {m.descripcion}
                      </span>
                      <span className="mt-4 block text-xs text-slate-500">
                        <time dateTime={a.fecha}>{m.fechaDisplay}</time>
                        <span aria-hidden className="mx-2">·</span>
                        {m.author}
                      </span>
                    </span>
                    <span className="self-end whitespace-nowrap border-b border-institucional-700 pb-0.5 text-xs font-semibold text-institucional-700">
                      {t.analisis.articulosLeerMas} →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="border-y border-editorial-rule bg-editorial-paper/55">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <EncabezadoSeccionExpediente
            index="02"
            title={t.analisis.comparativaTitulo}
            description={t.analisis.comparativaSub}
          />
        <div className="mt-9 hidden overflow-x-auto border-y border-editorial-rule md:block md:ml-[4.5rem]">
          <table className="w-full text-sm">
            <thead className="bg-white/60 text-[0.68rem] uppercase tracking-[0.08em] text-slate-500">
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
                  className={`border-t border-editorial-rule align-top ${
                    p.destacado ? 'shadow-[inset_3px_0_0_0_#1d4ed8]' : ''
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
                    {p.hito[lc]}
                    {p.fuentes.map((f, i) => (
                      <span key={f.url} className="whitespace-nowrap">
                        {' '}
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={f.descripcion[lc]}
                          className="text-institucional-700 hover:underline"
                        >
                          <span aria-hidden>{p.fuentes.length > 1 ? `↗${i + 1}` : '↗'}</span>
                          <span className="sr-only">{f.descripcion[lc]}</span>
                        </a>
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ol className="mt-9 border-t border-editorial-rule md:hidden">
          {comparativaRegional.map((p, index) => (
            <li
              key={p.pais.es}
              className={`grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-editorial-rule py-6 ${
                p.destacado ? 'shadow-[inset_3px_0_0_0_#1d4ed8] pl-3' : ''
              }`}
            >
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-editorial text-2xl font-semibold text-editorial-ink">
                    {p.pais[lc]}
                  </h3>
                  <span className="font-editorial text-2xl font-semibold tabular-nums text-institucional-800">
                    {p.ilia.toFixed(2)}
                  </span>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">{t.analisis.comparativaCols.inversion}</dt>
                    <dd className="mt-1 text-slate-700">{p.inversion[lc]}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">{t.analisis.comparativaCols.ente}</dt>
                    <dd className="mt-1 text-slate-700">{p.enteEjecutor[lc]}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">{t.analisis.comparativaCols.hito}</dt>
                    <dd className="mt-1 text-slate-700">
                      {p.hito[lc]}
                      {p.fuentes.map((f, i) => (
                        <span key={f.url}> <a href={f.url} target="_blank" rel="noopener noreferrer" title={f.descripcion[lc]} className="font-semibold text-institucional-700 hover:underline"><span aria-hidden>{p.fuentes.length > 1 ? `↗${i + 1}` : '↗'}</span><span className="sr-only">{f.descripcion[lc]}</span></a></span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <EncabezadoSeccionExpediente
            index="03"
            title={t.analisis.brechasTitulo}
            description={t.analisis.brechasSub}
          />
          <div className="mt-9 border-t border-editorial-rule sm:ml-[4.5rem]">
            {brechas.map((b, index) => (
              <BrechaCard key={b.id} index={index + 1} brecha={b} locale={lc} t={t} />
            ))}
          </div>
      </section>

      <section className="border-y border-editorial-rule bg-editorial-paper/55">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <EncabezadoSeccionExpediente
            index="04"
            title={applyConteosLegislacion(t.analisis.legislacionTitulo)}
            description={applyConteosLegislacion(t.analisis.legislacionSub)}
          />
          <ol className="mt-9 border-t border-editorial-rule sm:ml-[4.5rem]">
            {expedientes.map((e, index) => (
              <li key={e.numero} className="grid gap-4 border-b border-editorial-rule py-7 sm:grid-cols-[3.25rem_minmax(0,1fr)_12rem] sm:gap-5">
                <span className="font-mono text-xs tabular-nums text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <article>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    {t.legislacion.expedienteLabel} {e.numero}
                  </p>
                  <h3 className="mt-2 font-editorial text-2xl font-semibold leading-tight text-editorial-ink text-balance">
                    {e.titulo[lc]}
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-editorial-muted text-pretty">
                    {e.resumen[lc]}
                  </p>
                </article>
                <div className="sm:pt-5">
                  <MarcaDocumental label={t.legislacion.estados[e.estado]} tone={estadoTone[e.estado]} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <p className="max-w-3xl border-l-2 border-editorial-accent pl-4 text-sm italic leading-relaxed text-editorial-muted text-pretty">
          {t.analisis.notaCierre}
        </p>
      </section>
    </div>
  );
}
