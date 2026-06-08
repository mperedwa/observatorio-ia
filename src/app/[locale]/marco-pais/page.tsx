import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
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
      url: `https://observatorioia.org/${locale}/marco-pais/`,
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
    <div className="bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-12">
          <Breadcrumb
            locale={lc}
            items={[
              { label: t.breadcrumb.inicio, href: `/${lc}/` },
              { label: dict.kicker },
            ]}
          />
          <p className="mt-6 text-sm font-medium uppercase tracking-wider text-institucional-700">
            {dict.kicker}
          </p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-slate-900 text-balance leading-tight max-w-4xl">
            {dict.titulo}
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl text-pretty">
            {dict.sub}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            {dict.ultimaActualizacion}
          </p>
        </div>
      </header>

      {/* KPI cards (6 indicadores rápidos) */}
      <section
        id="indicadores"
        aria-labelledby="indicadores-titulo"
        className="bg-white"
      >
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <header className="mb-8 max-w-3xl">
            <h2
              id="indicadores-titulo"
              className="text-2xl sm:text-3xl font-bold text-slate-900"
            >
              {dict.indicadores.titulo}
            </h2>
            <p className="mt-2 text-slate-600">{dict.indicadores.sub}</p>
          </header>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {CARD_ORDER.map((key) => {
              const card = dict.indicadores.cards[key];
              const numero = applyCounters(card.numero, COUNTERS);
              return (
                <div
                  key={key}
                  className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white pl-5 pr-4 py-5 transition-all duration-200 hover:border-institucional-200 hover:bg-institucional-50/60 hover:shadow-sm"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-institucional-700 transition-colors group-hover:bg-institucional-800"
                  />
                  <div className="text-4xl sm:text-5xl font-bold text-institucional-900 tabular-nums leading-none">
                    {numero}
                  </div>
                  <div className="mt-3 text-sm font-medium text-slate-900 leading-snug">
                    {card.titulo}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 leading-snug">
                    {card.detalle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Arquitectura por capas */}
      <ArquitecturaCapas locale={lc} t={t} />

      {/* Timeline de hitos país */}
      <TimelineGobernanza locale={lc} t={t} />

      {/* Matriz comparativa de instrumentos */}
      <MatrizInstrumentos locale={lc} t={t} />

      {/* Brechas pendientes */}
      <section
        id="brechas"
        className="bg-slate-50 border-y border-slate-200"
      >
        <div className="max-w-5xl mx-auto px-6 py-20">
          <header className="mb-10 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
              {dict.brechas.kicker}
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
              {dict.brechas.titulo}
            </h2>
            <p className="mt-3 text-slate-600 text-pretty">{dict.brechas.sub}</p>
          </header>
          <ul className="space-y-3" role="list">
            {brechas.map((b) => (
              <li
                key={b.id}
                className="flex items-start gap-3 bg-white border border-slate-200 rounded-md px-4 py-3"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded border border-slate-300 bg-white text-slate-400"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3"
                  >
                    <path d="M4 4l12 12M16 4L4 16" />
                  </svg>
                </span>
                <span className="text-sm sm:text-base text-slate-800 text-pretty">
                  {b.descripcion[lc]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Conexión con el resto del Observatorio */}
      <section id="conexion" className="bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <header className="mb-8 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
              {dict.conexion.kicker}
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
              {dict.conexion.titulo}
            </h2>
            <p className="mt-3 text-slate-600 text-pretty">{dict.conexion.sub}</p>
          </header>
          <div className="flex flex-wrap gap-3">
            <CtaLink href={`/${lc}/#instituciones`} label={dict.conexion.ctaInstituciones} />
            <CtaLink href={`/${lc}/proyectos`} label={dict.conexion.ctaProyectos} />
            <CtaLink href={`/${lc}/#legislacion`} label={dict.conexion.ctaLegislacion} />
            <CtaLink href={`/${lc}/#indicadores`} label={dict.conexion.ctaIndicadores} />
            <CtaLink href={`/${lc}/#recursos`} label={dict.conexion.ctaRecursos} />
          </div>
        </div>
      </section>

      {/* Fuentes y metodología */}
      <section id="fuentes" className="bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <header className="mb-8 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
              {dict.fuentes.kicker}
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
              {dict.fuentes.titulo}
            </h2>
            <p className="mt-3 text-slate-600 text-pretty">{dict.fuentes.sub}</p>
          </header>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-base font-semibold text-institucional-900 mb-3">
                {dict.fuentes.fuentesLabel}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {dict.fuentes.tipos.map((tipo) => (
                  <li key={tipo} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 flex-none w-1.5 h-1.5 rounded-full bg-institucional-700"
                    />
                    <span className="text-pretty">{tipo}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-base font-semibold text-institucional-900 mb-3">
                {dict.fuentes.criteriosLabel}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {dict.fuentes.criterios.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 flex-none w-1.5 h-1.5 rounded-full bg-institucional-700"
                    />
                    <span className="text-pretty">{c}</span>
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
      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-md bg-institucional-700 text-white hover:bg-institucional-800 transition-colors"
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
