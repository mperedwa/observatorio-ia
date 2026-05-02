import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProyectoCard } from '@/components/ProyectoCard';
import { proyectos } from '@/data/proyectos';
import { instituciones } from '@/data/instituciones';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    proyectos.map((p) => ({ locale, id: p.id }))
  );
}

const categoriaLabel: Record<string, { es: string; en: string }> = {
  judicial: { es: 'Judicial', en: 'Judicial' },
  salud: { es: 'Salud', en: 'Health' },
  educacion: { es: 'Educación', en: 'Education' },
  fiscal: { es: 'Fiscal', en: 'Fiscal' },
  infraestructura: { es: 'Infraestructura', en: 'Infrastructure' },
};

const estadoChip: Record<string, string> = {
  operativo: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  piloto: 'bg-amber-50 text-amber-800 border-amber-200',
  planificado: 'bg-slate-100 text-slate-700 border-slate-300',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const proyecto = proyectos.find((p) => p.id === id);
  if (!proyecto || !locales.includes(locale as Locale)) return {};
  const t = getDictionary(locale as Locale);
  const institucion = instituciones.find((i) => i.id === proyecto.institucionId);
  const titulo = `${proyecto.titulo[locale as Locale]} — ${t.siteName}`;
  const descripcion = proyecto.descripcion[locale as Locale];
  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      url: `https://observatorioia.org/${locale}/proyectos/${id}/`,
      siteName: t.siteName,
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: `/${locale}/proyectos/${id}/`,
      languages: {
        es: `/es/proyectos/${id}/`,
        en: `/en/proyectos/${id}/`,
        'x-default': `/es/proyectos/${id}/`,
      },
    },
    other: institucion ? { 'article:section': institucion.nombreCorto[locale as Locale] } : {},
  };
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const proyecto = proyectos.find((p) => p.id === id);
  if (!proyecto) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);
  const institucion = instituciones.find((i) => i.id === proyecto.institucionId);

  const relacionados = proyectos
    .filter(
      (p) =>
        p.id !== proyecto.id &&
        (p.categoria === proyecto.categoria || p.institucionId === proyecto.institucionId),
    )
    .slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      <Breadcrumb
        locale={lc}
        items={[
          { label: t.breadcrumb.inicio, href: `/${lc}/` },
          ...(institucion
            ? [
                {
                  label: institucion.nombreCorto[lc],
                  href: `/${lc}/instituciones/${institucion.id}`,
                },
              ]
            : []),
          { label: proyecto.titulo[lc] },
        ]}
      />

      <header className="mt-6 mb-10 border-b border-slate-200 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs px-2 py-0.5 rounded border border-institucional-200 bg-institucional-50 text-institucional-800">
            {categoriaLabel[proyecto.categoria][lc]}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded border ${estadoChip[proyecto.estado]}`}
          >
            {t.estado[proyecto.estado]}
          </span>
          {proyecto.desde && (
            <span className="text-xs text-slate-500">
              {t.proyectoDetalle.desdeLabel}: {proyecto.desde}
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 text-balance leading-tight">
          {proyecto.titulo[lc]}
        </h1>
        {institucion && (
          <p className="mt-3 text-sm text-slate-600">
            {t.proyectoDetalle.institucionLabel}:{' '}
            <Link
              href={`/${lc}/instituciones/${institucion.id}`}
              className="text-institucional-700 hover:underline"
            >
              {institucion.nombre[lc]}
            </Link>
          </p>
        )}
      </header>

      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-wider text-institucional-700 font-medium mb-2">
          {t.proyectoDetalle.queEsLabel}
        </h2>
        <p className="text-base text-slate-700 text-pretty leading-relaxed">
          {proyecto.descripcion[lc]}
        </p>
      </section>

      {proyecto.resultado && (
        <section className="mb-10 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h2 className="text-xs uppercase tracking-wider text-emerald-800 font-medium mb-2">
            {t.proyectoDetalle.resultadoLabel}
          </h2>
          <p className="text-base text-slate-800 text-pretty leading-relaxed">
            {proyecto.resultado[lc]}
          </p>
        </section>
      )}

      {proyecto.contexto && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-wider text-institucional-700 font-medium mb-2">
            {t.proyectoDetalle.contextoLabel}
          </h2>
          <p className="text-base text-slate-700 text-pretty leading-relaxed">
            {proyecto.contexto[lc]}
          </p>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-wider text-institucional-700 font-medium mb-2">
          {t.proyectoDetalle.fuenteLabel}
        </h2>
        <a
          href={proyecto.fuenteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-institucional-700 hover:underline break-all"
        >
          ↗ {proyecto.fuenteUrl}
        </a>
      </section>

      {relacionados.length > 0 && (
        <section className="mt-16 pt-10 border-t border-slate-200">
          <h2 className="text-xs uppercase tracking-wider text-institucional-700 font-medium mb-4">
            {t.proyectoDetalle.relacionadosLabel}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relacionados.map((rel) => (
              <ProyectoCard key={rel.id} proyecto={rel} locale={lc} t={t} variant="full" />
            ))}
          </div>
        </section>
      )}

      {institucion && (
        <p className="mt-12">
          <Link
            href={`/${lc}/instituciones/${institucion.id}`}
            className="text-sm text-institucional-700 hover:underline"
          >
            {t.proyectoDetalle.volverLabel} {institucion.nombreCorto[lc]}
          </Link>
        </p>
      )}
    </article>
  );
}
