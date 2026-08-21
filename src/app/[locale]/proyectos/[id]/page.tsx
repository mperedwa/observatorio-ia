import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProyectoCard } from '@/components/ProyectoCard';
import { capaChip, evaluacionChip } from '@/components/catalogoStyles';
import { proyectos } from '@/data/proyectos';
import { instituciones } from '@/data/instituciones';
import {
  DIMENSIONES_EVIDENCIA,
  resolverFaseImplementacion,
  type EstadoEvaluacion,
} from '@/data/modelo-evidencia';
import {
  formatearFechaCatalogo,
  obtenerCapaCatalogo,
} from '@/data/presentacion-catalogo';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    proyectos.map((proyecto) => ({ locale, id: proyecto.id })),
  );
}

const categoriaLabel: Record<string, { es: string; en: string }> = {
  judicial: { es: 'Judicial', en: 'Judicial' },
  salud: { es: 'Salud', en: 'Health' },
  educacion: { es: 'Educación', en: 'Education' },
  fiscal: { es: 'Fiscal', en: 'Fiscal' },
  infraestructura: { es: 'Infraestructura', en: 'Infrastructure' },
  agricultura: { es: 'Agricultura', en: 'Agriculture' },
  social: { es: 'Servicios sociales', en: 'Social services' },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const proyecto = proyectos.find((item) => item.id === id);
  if (!proyecto || !locales.includes(locale as Locale)) return {};
  const t = getDictionary(locale as Locale);
  const institucion = instituciones.find((item) => item.id === proyecto.institucionId);
  const titulo = `${proyecto.titulo[locale as Locale]} — ${t.siteName}`;
  const descripcion = proyecto.descripcion[locale as Locale];
  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      url: `https://www.observatorioia.org/${locale}/proyectos/${id}/`,
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
    other: institucion
      ? { 'article:section': institucion.nombreCorto[locale as Locale] }
      : {},
  };
}

function ListaEditorial({ items, empty }: { items?: string[]; empty: string }) {
  if (!items || items.length === 0) {
    return <p className="text-sm leading-relaxed text-slate-500">{empty}</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={`${index}-${item.slice(0, 24)}`} className="flex gap-3 text-sm leading-relaxed text-slate-700">
          <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-institucional-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const proyecto = proyectos.find((item) => item.id === id);
  if (!proyecto) notFound();

  const lc = locale as Locale;
  const t = getDictionary(lc);
  const institucion = instituciones.find((item) => item.id === proyecto.institucionId);
  const capa = obtenerCapaCatalogo(proyecto);
  const fase = resolverFaseImplementacion(proyecto);
  const tipo = proyecto.tipoIniciativa ?? 'por-determinar';
  const estadoIA = proyecto.estadoIA ?? 'no-determinada';
  const fuentes = proyecto.fuentes ?? [];
  const fuentesPorId = new Map(fuentes.map((fuente, index) => [fuente.id, { fuente, index }]));

  const relaciones = (proyecto.relaciones ?? [])
    .map((relacion) => ({
      relacion,
      iniciativa: proyectos.find((item) => item.id === relacion.iniciativaId),
    }))
    .filter((item) => item.iniciativa !== undefined);

  const relacionadosIds = new Set(relaciones.map((item) => item.iniciativa!.id));
  const relacionados = [
    ...relaciones.map((item) => item.iniciativa!),
    ...proyectos.filter(
      (item) =>
        item.id !== proyecto.id &&
        !relacionadosIds.has(item.id) &&
        (item.categoria === proyecto.categoria || item.institucionId === proyecto.institucionId),
    ),
  ].slice(0, 3);

  return (
    <article className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <Breadcrumb
        locale={lc}
        items={[
          { label: t.breadcrumb.inicio, href: `/${lc}/` },
          { label: t.nav.proyectos, href: `/${lc}/proyectos` },
          { label: proyecto.titulo[lc] },
        ]}
      />

      <header className="mt-7 border-b border-slate-200 pb-9">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${capaChip[capa]}`}>
            {t.catalogo.capas[capa].titulo}
          </span>
          <span className="rounded-full border border-institucional-200 bg-institucional-50 px-2.5 py-1 text-xs text-institucional-800">
            {t.catalogo.tipos[tipo]}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
            {t.catalogo.fases[fase]}
          </span>
          <span className="text-xs text-slate-500">
            {t.proyectoDetalle.fichaEvidenciaLabel} v{proyecto.modeloVersion ?? 1}
          </span>
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-institucional-700">
          {categoriaLabel[proyecto.categoria][lc]}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 text-balance sm:text-5xl">
          {proyecto.titulo[lc]}
        </h1>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {t.proyectoDetalle.institucionLabel}
            </div>
            {institucion ? (
              <Link
                href={`/${lc}/instituciones/${institucion.id}`}
                className="mt-1 block text-sm font-semibold text-institucional-700 hover:underline"
              >
                {institucion.nombreCorto[lc]}
              </Link>
            ) : (
              <span className="mt-1 block text-sm text-slate-700">—</span>
            )}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {t.proyectoDetalle.evidenciaEjecucionLabel}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800">
              {t.catalogo.evaluacionEstados[
                proyecto.evaluacion?.ejecucion.estado ?? 'no-determinado'
              ]}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {t.proyectoDetalle.estadoIALabel}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800">
              {t.catalogo.estadosIA[estadoIA]}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {t.proyectoDetalle.ultimaVerificacionLabel}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800">
              {proyecto.fechaUltimaVerificacion
                ? formatearFechaCatalogo(proyecto.fechaUltimaVerificacion, lc)
                : '—'}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
          {proyecto.fechaPrimeraEvidencia && (
            <span>
              {t.proyectoDetalle.primeraEvidenciaLabel}:{' '}
              {formatearFechaCatalogo(proyecto.fechaPrimeraEvidencia, lc)}
            </span>
          )}
          {proyecto.fechaProximaRevision && (
            <span>
              {t.proyectoDetalle.proximaRevisionLabel}:{' '}
              {formatearFechaCatalogo(proyecto.fechaProximaRevision, lc)}
            </span>
          )}
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-institucional-700">
            {t.proyectoDetalle.queEsLabel}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-700 text-pretty">
            {proyecto.descripcion[lc]}
          </p>
        </section>
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-institucional-700">
            {t.proyectoDetalle.objetivoDeclaradoLabel}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 text-pretty">
            {proyecto.objetivoDeclarado?.[lc] ?? proyecto.descripcion[lc]}
          </p>
        </section>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            {t.proyectoDetalle.confirmadoLabel}
          </h2>
          <div className="mt-4">
            <ListaEditorial
              items={proyecto.datosConocidos?.map((item) => item[lc])}
              empty={t.proyectoDetalle.sinDatosConfirmados}
            />
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {t.proyectoDetalle.noDeterminadoLabel}
          </h2>
          <div className="mt-4">
            <ListaEditorial
              items={proyecto.datosNoDeterminados?.map((item) => item[lc])}
              empty={t.proyectoDetalle.sinNoDeterminados}
            />
          </div>
        </section>
      </div>

      {(proyecto.resultadosVerificados ?? []).length > 0 && (
        <section className="mt-10 rounded-xl border border-institucional-200 bg-institucional-50 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-institucional-800">
            {t.proyectoDetalle.resultadosDocumentadosLabel}
          </h2>
          <ul className="mt-4 space-y-4">
            {proyecto.resultadosVerificados!.map((resultado) => (
              <li key={resultado.id} className="text-sm leading-relaxed text-slate-800">
                <p>{resultado.texto[lc]}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {resultado.fecha && (
                    <span>{formatearFechaCatalogo(resultado.fecha, lc)}</span>
                  )}
                  {resultado.fuenteIds.map((fuenteId) => {
                    const source = fuentesPorId.get(fuenteId);
                    if (!source) return null;
                    return (
                      <a
                        key={fuenteId}
                        href={`#fuente-${fuenteId}`}
                        className="font-semibold text-institucional-700 hover:underline"
                      >
                        [{source.index + 1}]
                      </a>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12 border-t border-slate-200 pt-10">
        <h2 className="text-2xl font-bold text-slate-900">
          {t.proyectoDetalle.evidenciaTitulo}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {t.proyectoDetalle.evidenciaSub}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DIMENSIONES_EVIDENCIA.map((dimension) => {
            const evaluacion = proyecto.evaluacion?.[dimension] ?? {
              estado: 'no-determinado' as EstadoEvaluacion,
              fuenteIds: [],
            };
            return (
              <div key={dimension} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {t.catalogo.dimensiones[dimension]}
                  </h3>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${evaluacionChip[evaluacion.estado]}`}>
                    {t.catalogo.evaluacionEstados[evaluacion.estado]}
                  </span>
                </div>
                {evaluacion.fuenteIds.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {evaluacion.fuenteIds.map((fuenteId) => {
                      const source = fuentesPorId.get(fuenteId);
                      if (!source) return null;
                      return (
                        <a
                          key={fuenteId}
                          href={`#fuente-${fuenteId}`}
                          className="font-semibold text-institucional-700 hover:underline"
                        >
                          [{source.index + 1}]
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12 border-t border-slate-200 pt-10">
        <h2 className="text-2xl font-bold text-slate-900">
          {t.proyectoDetalle.fuentesTitulo}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {t.proyectoDetalle.fuentesSub}
        </p>
        <ol className="mt-6 space-y-4">
          {fuentes.map((fuente, index) => (
            <li
              key={fuente.id}
              id={`fuente-${fuente.id}`}
              className="scroll-mt-24 rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-institucional-700 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <a
                    href={fuente.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold leading-snug text-institucional-700 hover:underline"
                  >
                    {fuente.titulo[lc]} ↗
                  </a>
                  <dl className="mt-3 grid gap-x-6 gap-y-2 text-xs text-slate-600 sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-slate-500">{t.proyectoDetalle.publicadorLabel}</dt>
                      <dd className="mt-0.5">{fuente.publicador}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-500">{t.proyectoDetalle.tipoFuenteLabel}</dt>
                      <dd className="mt-0.5">{t.catalogo.tiposFuente[fuente.tipoFuente]}</dd>
                    </div>
                    {fuente.fechaPublicacion && (
                      <div>
                        <dt className="font-semibold text-slate-500">{t.proyectoDetalle.fechaPublicacionLabel}</dt>
                        <dd className="mt-0.5">{formatearFechaCatalogo(fuente.fechaPublicacion, lc)}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-semibold text-slate-500">{t.proyectoDetalle.fechaConsultaLabel}</dt>
                      <dd className="mt-0.5">{formatearFechaCatalogo(fuente.fechaConsulta, lc)}</dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-[11px] font-semibold text-slate-500">
                      {t.proyectoDetalle.respaldaLabel}:
                    </span>
                    {fuente.respalda.map((respaldo) => (
                      <span key={respaldo} className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-600">
                        {t.catalogo.respaldosFuente[respaldo]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            {t.proyectoDetalle.preguntasAbiertasLabel}
          </h2>
          <div className="mt-4">
            <ListaEditorial
              items={proyecto.preguntasAbiertas?.map((item) => item[lc])}
              empty={t.proyectoDetalle.sinPreguntasAbiertas}
            />
          </div>
        </div>

        {relaciones.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              {t.proyectoDetalle.relacionesTitulo}
            </h2>
            <ul className="mt-4 space-y-4">
              {relaciones.map(({ relacion, iniciativa }) => (
                <li key={`${relacion.tipo}-${iniciativa!.id}`}>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t.catalogo.relaciones[relacion.tipo]}
                  </div>
                  <Link
                    href={`/${lc}/proyectos/${iniciativa!.id}`}
                    className="mt-1 block text-sm font-semibold text-institucional-700 hover:underline"
                  >
                    {iniciativa!.titulo[lc]}
                  </Link>
                  {relacion.nota && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {relacion.nota[lc]}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {proyecto.contexto && (
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-institucional-700">
            {t.proyectoDetalle.contextoLabel}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-700 text-pretty">
            {proyecto.contexto[lc]}
          </p>
        </section>
      )}

      {relacionados.length > 0 && (
        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-institucional-700">
            {t.proyectoDetalle.relacionadosLabel}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {relacionados.map((relacionado) => (
              <ProyectoCard
                key={relacionado.id}
                proyecto={relacionado}
                locale={lc}
                t={t}
                variant="full"
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-8 text-sm font-semibold">
        <Link href={`/${lc}/proyectos`} className="text-institucional-700 hover:underline">
          ← {t.nav.proyectos}
        </Link>
        {institucion && (
          <Link
            href={`/${lc}/instituciones/${institucion.id}`}
            className="text-institucional-700 hover:underline"
          >
            {t.proyectoDetalle.volverLabel} {institucion.nombreCorto[lc]}
          </Link>
        )}
      </div>
    </article>
  );
}
