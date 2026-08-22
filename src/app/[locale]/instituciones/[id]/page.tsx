import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import {
  EncabezadoSeccionExpediente,
  ExpedienteMeta,
} from '@/components/ExpedienteEditorial';
import { ProyectoCard } from '@/components/ProyectoCard';
import { instituciones } from '@/data/instituciones';
import { proyectos } from '@/data/proyectos';
import {
  formatearFechaCatalogo,
  obtenerUltimaVerificacion,
  ordenarProyectosExpediente,
  resumirInstitucionCatalogo,
} from '@/data/presentacion-catalogo';
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
      url: `https://www.observatorioia.org/${locale}/instituciones/${id}/`,
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
  const proyectosOrdenados = ordenarProyectosExpediente(proyectosInst, lc);
  const resumenCatalogo = resumirInstitucionCatalogo(proyectosInst);
  const ultimaVerificacion = obtenerUltimaVerificacion(proyectosInst);
  const indiceInstitucion = instituciones.findIndex((item) => item.id === inst.id) + 1;

  return (
    <article className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <Breadcrumb
        locale={lc}
        items={[
          { label: t.breadcrumb.inicio, href: `/${lc}/` },
          { label: t.nav.instituciones, href: `/${lc}/instituciones` },
          { label: inst.nombreCorto[lc] },
        ]}
      />

      <header className="mt-8 pb-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
              {t.institucionDetalle.expedienteLabel}
            </p>
            <h1 className="mt-3 max-w-4xl font-editorial text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
              {inst.nombre[lc]}
            </h1>
          </div>
          <div className="border-l-2 border-editorial-accent pl-4 lg:pb-1">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-slate-500">
              {t.instituciones.registroLabel}
            </p>
            <p className="mt-1 font-editorial text-3xl font-semibold text-editorial-ink tabular-nums">
              {String(indiceInstitucion).padStart(2, '0')} /{' '}
              {String(instituciones.length).padStart(2, '0')}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ExpedienteMeta
            items={[
              {
                label: t.institucionDetalle.tipoLabel,
                value: t.instituciones.tipoLabel[inst.tipo],
              },
              {
                label: t.institucionDetalle.proyectosLabel,
                value: resumenCatalogo.total,
                detail: t.instituciones.conteoDerivadoLabel,
              },
              {
                label: t.institucionDetalle.ultimaVerificacionLabel,
                value: ultimaVerificacion ? (
                  <time dateTime={ultimaVerificacion}>
                    {formatearFechaCatalogo(ultimaVerificacion, lc)}
                  </time>
                ) : (
                  '—'
                ),
              },
              {
                label: t.institucionDetalle.fuenteInstitucionalLabel,
                value: (
                  <a
                    href={inst.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-institucional-700 underline-offset-4 hover:underline"
                  >
                    {t.institucionDetalle.sitioOficialLabel} <span aria-hidden>↗</span>
                  </a>
                ),
              },
            ]}
          />
        </div>

        <dl className="grid border-b border-editorial-rule sm:grid-cols-3">
          <div className="border-b border-editorial-rule py-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0">
            <dt className="flex items-center gap-2 text-xs text-slate-500">
              <span aria-hidden className="h-4 w-1 bg-emerald-600" />
              {t.institucionDetalle.verificadosLabel}
            </dt>
            <dd className="mt-1 font-editorial text-3xl font-semibold text-editorial-ink tabular-nums">
              {resumenCatalogo.verificado}
            </dd>
          </div>
          <div className="border-b border-editorial-rule py-4 sm:border-b-0 sm:border-r sm:px-5">
            <dt className="flex items-center gap-2 text-xs text-slate-500">
              <span aria-hidden className="h-4 w-1 bg-amber-500" />
              {t.institucionDetalle.seguimientoLabel}
            </dt>
            <dd className="mt-1 font-editorial text-3xl font-semibold text-editorial-ink tabular-nums">
              {resumenCatalogo.seguimiento}
            </dd>
          </div>
          <div className="py-4 sm:px-5 sm:last:pr-0">
            <dt className="flex items-center gap-2 text-xs text-slate-500">
              <span aria-hidden className="h-4 w-1 bg-sky-600" />
              {t.institucionDetalle.ecosistemaLabel}
            </dt>
            <dd className="mt-1 font-editorial text-3xl font-semibold text-editorial-ink tabular-nums">
              {resumenCatalogo.ecosistema}
            </dd>
          </div>
        </dl>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-500">
          {t.institucionDetalle.conteoNota}
        </p>
      </header>

      <section className="border-t border-editorial-rule py-10" aria-labelledby="resumen-institucion">
        <EncabezadoSeccionExpediente
          id="resumen-institucion"
          index="01"
          title={t.institucionDetalle.resumenLabel}
        />
        <p className="mt-6 max-w-4xl text-lg leading-relaxed text-editorial-muted text-pretty sm:ml-[5.25rem]">
          {(inst.descripcion ?? inst.resumen)[lc]}
        </p>
      </section>

      <section className="border-t border-editorial-rule py-10" aria-labelledby="registro-institucion">
        <EncabezadoSeccionExpediente
          id="registro-institucion"
          index="02"
          title={`${t.institucionDetalle.proyectosLabel} (${resumenCatalogo.total})`}
          description={t.institucionDetalle.registroSub}
        />
        <div className="mt-7 border-t border-editorial-rule sm:ml-[5.25rem]">
          {proyectosOrdenados.map((proyecto, index) => (
            <ProyectoCard
              key={proyecto.id}
              proyecto={proyecto}
              locale={lc}
              t={t}
              variant="register"
              registryIndex={index + 1}
            />
          ))}
        </div>
      </section>

      {inst.lecciones && (
        <section className="border-t border-editorial-rule py-10" aria-labelledby="lectura-institucion">
          <EncabezadoSeccionExpediente
            id="lectura-institucion"
            index="03"
            title={t.institucionDetalle.leccionesLabel}
          />
          <div className="mt-7 border-l-2 border-editorial-accent pl-5 sm:ml-[5.25rem] sm:pl-7">
            <p className="max-w-4xl font-editorial text-xl leading-relaxed text-editorial-ink text-pretty sm:text-2xl">
              {inst.lecciones[lc]}
            </p>
          </div>
        </section>
      )}

      <div className="border-t border-editorial-rule pt-8 text-sm font-semibold">
        <Link
          href={`/${lc}/instituciones`}
          className="text-institucional-700 underline-offset-4 hover:underline"
        >
          ← {t.nav.instituciones}
        </Link>
      </div>
    </article>
  );
}
