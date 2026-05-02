import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProyectoCard } from '@/components/ProyectoCard';
import { instituciones } from '@/data/instituciones';
import { proyectos } from '@/data/proyectos';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    instituciones.map((i) => ({ locale, id: i.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const inst = instituciones.find((i) => i.id === id);
  if (!inst || !locales.includes(locale as Locale)) return {};
  const t = getDictionary(locale as Locale);
  const titulo = `${inst.nombre[locale as Locale]} — ${t.siteName}`;
  const descripcion = inst.resumen[locale as Locale];
  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      url: `https://observatorioia.org/${locale}/instituciones/${id}/`,
      siteName: t.siteName,
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: `/${locale}/instituciones/${id}/`,
      languages: {
        es: `/es/instituciones/${id}/`,
        en: `/en/instituciones/${id}/`,
        'x-default': `/es/instituciones/${id}/`,
      },
    },
  };
}

export default async function InstitucionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const inst = instituciones.find((i) => i.id === id);
  if (!inst) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);
  const proyectosInst = proyectos.filter((p) => p.institucionId === inst.id);
  const operativos = proyectosInst.filter((p) => p.estado === 'operativo').length;
  const pilotos = proyectosInst.filter((p) => p.estado === 'piloto').length;
  const planificados = proyectosInst.filter((p) => p.estado === 'planificado').length;

  return (
    <article className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
      <Breadcrumb
        locale={lc}
        items={[
          { label: t.breadcrumb.inicio, href: `/${lc}/` },
          { label: inst.nombreCorto[lc] },
        ]}
      />

      <header className="mt-6 mb-10 border-b border-slate-200 pb-8">
        <p className="text-xs uppercase tracking-wider text-institucional-700">
          {t.instituciones.tipoLabel[inst.tipo]}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 text-balance leading-tight">
          {inst.nombre[lc]}
        </h1>
        <a
          href={inst.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-institucional-700 hover:underline"
        >
          ↗ {t.institucionDetalle.sitioOficialLabel}
        </a>

        <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
          <div>
            <div className="text-2xl font-bold text-emerald-700 tabular-nums">{operativos}</div>
            <div className="text-xs text-slate-500">{t.institucionDetalle.operativosLabel}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700 tabular-nums">{pilotos}</div>
            <div className="text-xs text-slate-500">{t.institucionDetalle.pilotosLabel}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-500 tabular-nums">{planificados}</div>
            <div className="text-xs text-slate-500">{t.institucionDetalle.planificadosLabel}</div>
          </div>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-wider text-institucional-700 font-medium mb-3">
          {t.institucionDetalle.resumenLabel}
        </h2>
        <p className="text-base text-slate-700 text-pretty leading-relaxed">
          {(inst.descripcion ?? inst.resumen)[lc]}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-wider text-institucional-700 font-medium mb-4">
          {t.institucionDetalle.proyectosLabel} ({proyectosInst.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proyectosInst.map((p) => (
            <ProyectoCard key={p.id} proyecto={p} locale={lc} t={t} variant="full" />
          ))}
        </div>
      </section>

      {inst.lecciones && (
        <section className="mb-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
          <h2 className="text-xs uppercase tracking-wider text-institucional-700 font-medium mb-2">
            {t.institucionDetalle.leccionesLabel}
          </h2>
          <p className="text-base text-slate-700 text-pretty leading-relaxed">
            {inst.lecciones[lc]}
          </p>
        </section>
      )}
    </article>
  );
}
