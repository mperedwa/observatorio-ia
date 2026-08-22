import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EncabezadoSeccionExpediente } from '@/components/ExpedienteEditorial';
import { ArquitecturaCapas } from '@/components/ArquitecturaCapas';
import { TimelineGobernanza } from '@/components/TimelineGobernanza';
import { MatrizInstrumentos } from '@/components/MatrizInstrumentos';
import { brechas } from '@/data/marcoPais';
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
  const t = getDictionary(locale as Locale);
  const titulo = `${t.marcoPais.metaTitle} — ${t.siteName}`;
  return {
    title: titulo,
    description: t.marcoPais.metaDescripcion,
    openGraph: {
      title: titulo,
      description: t.marcoPais.metaDescripcion,
      url: `https://www.observatorioia.org/${locale}/marco-pais/`,
      siteName: t.siteName,
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: t.marcoPais.metaDescripcion,
    },
    alternates: {
      canonical: `/${locale}/marco-pais/`,
      languages: {
        es: '/es/marco-pais/',
        en: '/en/marco-pais/',
        'x-default': '/es/marco-pais/',
      },
    },
  };
}

type CardKey =
  | 'estrategia'
  | 'planAccion'
  | 'capituloCntd'
  | 'expedientes'
  | 'instituciones'
  | 'proyectos';

const CARD_ORDER: CardKey[] = [
  'estrategia',
  'planAccion',
  'capituloCntd',
  'expedientes',
  'instituciones',
  'proyectos',
];

export default async function MarcoPaisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);
  const dict = t.marcoPais;

  return (
    <div className="bg-white">
      <header className="border-b border-editorial-rule bg-editorial-paper">
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-10 sm:pb-16">
          <Breadcrumb
            locale={lc}
            items={[
              { label: t.breadcrumb.inicio, href: `/${lc}/` },
              { label: dict.kicker },
            ]}
          />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
            {dict.kicker}
          </p>
          <h1 className="mt-3 max-w-4xl font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
            {dict.titulo}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-editorial-muted text-pretty">
            {dict.sub}
          </p>
          <p className="mt-6 max-w-3xl border-l-2 border-editorial-accent pl-4 text-base font-semibold leading-relaxed text-editorial-ink text-pretty sm:text-lg">
            {dict.tesis}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            {dict.ultimaActualizacion}
          </p>
        </div>
      </header>

      <section
        id="indicadores"
        aria-labelledby="indicadores-titulo"
        className="bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <EncabezadoSeccionExpediente
            index="01"
            id="indicadores-titulo"
            title={dict.indicadores.titulo}
            description={dict.indicadores.sub}
          />
          <dl className="mt-9 grid grid-cols-2 border-t border-editorial-rule sm:grid-cols-3 lg:grid-cols-6">
            {CARD_ORDER.map((key, index) => {
              const card = dict.indicadores.cards[key];
              const numero = applyCounters(card.numero, COUNTERS);
              const detalle = applyCounters(card.detalle, COUNTERS);
              return (
                <div
                  key={key}
                  className="border-b border-r border-editorial-rule px-3 py-5 even:border-r-0 sm:px-5 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(3n)]:border-r-0 lg:border-r lg:last:border-r-0"
                >
                  <dt className="sr-only">{lc === 'es' ? 'Registro' : 'Record'}</dt>
                  <dd aria-hidden className="font-mono text-[0.68rem] tabular-nums text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </dd>
                  <dd className="mt-2 font-editorial text-4xl font-semibold leading-none tabular-nums text-editorial-ink sm:text-5xl">
                    {numero}
                  </dd>
                  <dt className="mt-3 text-sm font-semibold leading-snug text-slate-900">
                    {card.titulo}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-slate-500">
                    {detalle}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <ArquitecturaCapas locale={lc} t={t} sectionIndex="02" />

      <TimelineGobernanza locale={lc} t={t} sectionIndex="03" />

      <MatrizInstrumentos locale={lc} t={t} sectionIndex="04" />

      <section
        id="brechas"
        className="border-t border-editorial-rule bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <EncabezadoSeccionExpediente
            index="05"
            title={dict.brechas.titulo}
            description={dict.brechas.sub}
          />
          <ul className="mt-9 border-t border-editorial-rule" role="list">
            {brechas.map((brecha, index) => (
              <li
                key={brecha.id}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-editorial-rule py-5 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-x-5"
              >
                <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="border-l-2 border-editorial-accent pl-4 text-sm leading-relaxed text-slate-800 text-pretty sm:text-base">
                  {brecha.descripcion[lc]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="conexion" className="border-t border-editorial-rule bg-editorial-paper/55">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <EncabezadoSeccionExpediente
            index="06"
            title={dict.conexion.titulo}
            description={dict.conexion.sub}
          />
          <nav className="mt-9 grid border-t border-editorial-rule sm:grid-cols-2 lg:grid-cols-3" aria-label={dict.conexion.titulo}>
            <CtaLink href={`/${lc}/enia`} label={dict.conexion.ctaEnia} />
            <CtaLink href={`/${lc}/instituciones`} label={dict.conexion.ctaInstituciones} />
            <CtaLink href={`/${lc}/proyectos`} label={dict.conexion.ctaProyectos} />
            <CtaLink href={`/${lc}/legislacion`} label={dict.conexion.ctaLegislacion} />
            <CtaLink href={`/${lc}/indicadores`} label={dict.conexion.ctaIndicadores} />
            <CtaLink href={`/${lc}/recursos`} label={dict.conexion.ctaRecursos} />
          </nav>
        </div>
      </section>

      <section id="fuentes" className="border-t border-editorial-rule bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <EncabezadoSeccionExpediente
            index="07"
            title={dict.fuentes.titulo}
            description={dict.fuentes.sub}
          />
          <div className="mt-9 grid border-y border-editorial-rule md:grid-cols-2 md:divide-x md:divide-editorial-rule">
            <div className="border-b border-editorial-rule py-6 md:border-b-0 md:pr-8">
              <h3 className="mb-3 text-base font-semibold text-institucional-900">
                {dict.fuentes.fuentesLabel}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {dict.fuentes.tipos.map((tipo, index) => (
                  <li key={tipo} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2">
                    <span aria-hidden className="font-mono text-[0.68rem] tabular-nums text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-pretty">{tipo}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="py-6 md:pl-8">
              <h3 className="mb-3 text-base font-semibold text-institucional-900">
                {dict.fuentes.criteriosLabel}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {dict.fuentes.criterios.map((criterio, index) => (
                  <li key={criterio} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2">
                    <span aria-hidden className="font-mono text-[0.68rem] tabular-nums text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-pretty">{criterio}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CtaLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 border-b border-editorial-rule py-4 text-sm font-semibold text-institucional-800 underline-offset-4 hover:underline sm:px-4 sm:[&:nth-child(odd)]:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0"
    >
      {label}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}
