import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import {
  EncabezadoSeccionExpediente,
  EstadoDocumental,
  ExpedienteMeta,
} from '@/components/ExpedienteEditorial';
import { ProyectoCard } from '@/components/ProyectoCard';
import { capaMarker } from '@/components/catalogoStyles';
import { instituciones } from '@/data/instituciones';
import {
  DIMENSIONES_EVIDENCIA,
  resolverFaseImplementacion,
  type EstadoEvaluacion,
} from '@/data/modelo-evidencia';
import {
  formatearFechaCatalogo,
  obtenerCapaCatalogo,
  obtenerCronologiaProyecto,
  type TipoHitoExpediente,
} from '@/data/presentacion-catalogo';
import { proyectos } from '@/data/proyectos';
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

function ListaEditorial({
  items,
  empty,
  markerClass = 'bg-institucional-700',
}: {
  items?: string[];
  empty: string;
  markerClass?: string;
}) {
  if (!items || items.length === 0) {
    return (
      <p className="border-l-2 border-slate-300 pl-4 text-sm leading-relaxed text-slate-500">
        {empty}
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={`${index}-${item.slice(0, 24)}`}
          className="grid grid-cols-[0.5rem_minmax(0,1fr)] gap-3 text-sm leading-relaxed text-slate-700"
        >
          <span aria-hidden className={`mt-2 h-2 w-2 ${markerClass}`} />
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
  const fuentesPorId = new Map(
    fuentes.map((fuente, index) => [fuente.id, { fuente, index }]),
  );
  const cronologia = obtenerCronologiaProyecto(proyecto);
  const indiceProyecto = proyectos.findIndex((item) => item.id === proyecto.id) + 1;

  const etiquetasCronologia: Record<TipoHitoExpediente, string> = {
    'inicio-operacion': t.timeline.fechaLabel['inicio-operacion'],
    'inicio-piloto': t.timeline.fechaLabel['inicio-piloto'],
    anuncio: t.timeline.fechaLabel.anuncio,
    'primera-evidencia': t.timeline.fechaLabel['primera-evidencia'],
    'ultima-verificacion': t.proyectoDetalle.cronologiaEventos.ultimaVerificacion,
    'proxima-revision': t.proyectoDetalle.cronologiaEventos.proximaRevision,
  };

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
    <article className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <Breadcrumb
        locale={lc}
        items={[
          { label: t.breadcrumb.inicio, href: `/${lc}/` },
          { label: t.nav.proyectos, href: `/${lc}/proyectos` },
          { label: proyecto.titulo[lc] },
        ]}
      />

      <header className="mt-8 pb-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
              {t.proyectoDetalle.expedienteLabel} / {categoriaLabel[proyecto.categoria][lc]}
            </p>
            <h1 className="mt-3 max-w-5xl font-editorial text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
              {proyecto.titulo[lc]}
            </h1>
          </div>

          <div className="border-l-2 border-editorial-accent pl-4 lg:pb-1">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-slate-500">
              {t.proyectoDetalle.fichaEvidenciaLabel} v{proyecto.modeloVersion ?? 1}
            </p>
            <p className="mt-1 font-editorial text-3xl font-semibold text-editorial-ink tabular-nums">
              {String(indiceProyecto).padStart(2, '0')} /{' '}
              {String(proyectos.length).padStart(2, '0')}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ExpedienteMeta
            items={[
              {
                label: t.proyectoDetalle.institucionLabel,
                value: institucion ? (
                  <Link
                    href={`/${lc}/instituciones/${institucion.id}`}
                    className="text-institucional-700 underline-offset-4 hover:underline"
                  >
                    {institucion.nombreCorto[lc]}
                  </Link>
                ) : (
                  '—'
                ),
              },
              {
                label: t.panorama.leyendaLabel,
                value: (
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden className={`h-4 w-1 ${capaMarker[capa]}`} />
                    {t.catalogo.capas[capa].titulo}
                  </span>
                ),
              },
              {
                label: t.proyectoDetalle.tipoIniciativaLabel,
                value: t.catalogo.tipos[tipo],
              },
              {
                label: t.proyectoDetalle.faseLabel,
                value: t.catalogo.fases[fase],
              },
            ]}
          />
          <div className="-mt-px">
            <ExpedienteMeta
              items={[
                {
                  label: t.proyectoDetalle.estadoIALabel,
                  value: t.catalogo.estadosIA[estadoIA],
                },
                {
                  label: t.proyectoDetalle.evidenciaEjecucionLabel,
                  value: (
                    <EstadoDocumental
                      estado={proyecto.evaluacion?.ejecucion.estado ?? 'no-determinado'}
                      label={
                        t.catalogo.evaluacionEstados[
                          proyecto.evaluacion?.ejecucion.estado ?? 'no-determinado'
                        ]
                      }
                    />
                  ),
                },
                {
                  label: t.proyectoDetalle.primeraEvidenciaLabel,
                  value: proyecto.fechaPrimeraEvidencia ? (
                    <time dateTime={proyecto.fechaPrimeraEvidencia}>
                      {formatearFechaCatalogo(proyecto.fechaPrimeraEvidencia, lc)}
                    </time>
                  ) : (
                    '—'
                  ),
                },
                {
                  label: t.proyectoDetalle.ultimaVerificacionLabel,
                  value: proyecto.fechaUltimaVerificacion ? (
                    <time dateTime={proyecto.fechaUltimaVerificacion}>
                      {formatearFechaCatalogo(proyecto.fechaUltimaVerificacion, lc)}
                    </time>
                  ) : (
                    '—'
                  ),
                  detail: proyecto.fechaProximaRevision
                    ? `${t.proyectoDetalle.proximaRevisionLabel}: ${formatearFechaCatalogo(
                        proyecto.fechaProximaRevision,
                        lc,
                      )}`
                    : undefined,
                },
              ]}
            />
          </div>
        </div>
      </header>

      <section className="border-t border-editorial-rule py-10" aria-labelledby="alcance-proyecto">
        <EncabezadoSeccionExpediente
          id="alcance-proyecto"
          index="01"
          title={t.proyectoDetalle.alcanceTitulo}
        />
        <div className="mt-7 grid gap-8 sm:ml-[5.25rem] lg:grid-cols-2 lg:gap-0">
          <div className="lg:pr-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-institucional-700">
              {t.proyectoDetalle.queEsLabel}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-slate-700 text-pretty">
              {proyecto.descripcion[lc]}
            </p>
          </div>
          <div className="border-t border-editorial-rule pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-institucional-700">
              {t.proyectoDetalle.objetivoDeclaradoLabel}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-slate-700 text-pretty">
              {proyecto.objetivoDeclarado?.[lc] ?? proyecto.descripcion[lc]}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-editorial-rule py-10" aria-labelledby="cronologia-proyecto">
        <EncabezadoSeccionExpediente
          id="cronologia-proyecto"
          index="02"
          title={t.proyectoDetalle.cronologiaTitulo}
          description={t.proyectoDetalle.cronologiaSub}
        />
        <ol className="mt-7 border-t border-editorial-rule sm:ml-[5.25rem]">
          {cronologia.map((hito, index) => (
            <li
              key={`${hito.tipo}-${hito.fecha}`}
              className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-editorial-rule py-4 sm:grid-cols-[7rem_1rem_minmax(0,1fr)] sm:gap-5"
            >
              <time
                dateTime={hito.fecha}
                className="font-mono text-xs font-semibold tabular-nums text-editorial-ink"
              >
                {formatearFechaCatalogo(hito.fecha, lc)}
              </time>
              <span
                aria-hidden
                className={`mt-1 hidden h-3 w-1 sm:block ${
                  index === cronologia.length - 1
                    ? 'bg-editorial-accent'
                    : 'bg-institucional-700'
                }`}
              />
              <span className="text-sm leading-relaxed text-slate-700">
                {etiquetasCronologia[hito.tipo]}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-editorial-rule py-10" aria-labelledby="evidencia-proyecto">
        <EncabezadoSeccionExpediente
          id="evidencia-proyecto"
          index="03"
          title={t.proyectoDetalle.hallazgosTitulo}
          description={t.proyectoDetalle.evidenciaSub}
        />

        <div className="mt-7 sm:ml-[5.25rem]">
          <div className="grid border-y border-editorial-rule lg:grid-cols-2">
            <section className="py-7 lg:pr-10">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                {t.proyectoDetalle.confirmadoLabel}
              </h3>
              <div className="mt-4">
                <ListaEditorial
                  items={proyecto.datosConocidos?.map((item) => item[lc])}
                  empty={t.proyectoDetalle.sinDatosConfirmados}
                  markerClass="bg-emerald-600"
                />
              </div>
            </section>
            <section className="border-t border-editorial-rule py-7 lg:border-l lg:border-t-0 lg:pl-10">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                {t.proyectoDetalle.noDeterminadoLabel}
              </h3>
              <div className="mt-4">
                <ListaEditorial
                  items={proyecto.datosNoDeterminados?.map((item) => item[lc])}
                  empty={t.proyectoDetalle.sinNoDeterminados}
                  markerClass="border border-slate-400 bg-white"
                />
              </div>
            </section>
          </div>

          <section className="mt-10" aria-labelledby="resultados-proyecto">
            <h3
              id="resultados-proyecto"
              className="font-editorial text-2xl font-semibold text-editorial-ink"
            >
              {t.proyectoDetalle.resultadosDocumentadosLabel}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              {t.proyectoDetalle.resultadosSub}
            </p>

            {(proyecto.resultadosVerificados ?? []).length > 0 ? (
              <ol className="mt-5 border-t border-editorial-rule">
                {proyecto.resultadosVerificados!.map((resultado, index) => (
                  <li
                    key={resultado.id}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-editorial-rule py-5"
                  >
                    <span aria-hidden className="font-mono text-xs text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-sm leading-relaxed text-slate-800">
                        {resultado.texto[lc]}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {resultado.fecha && (
                          <time dateTime={resultado.fecha}>
                            {formatearFechaCatalogo(resultado.fecha, lc)}
                          </time>
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
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-5 border-l-2 border-slate-300 pl-4 text-sm leading-relaxed text-slate-600">
                {t.proyectoDetalle.sinResultadosDocumentados}
              </p>
            )}
          </section>

          <section className="mt-10" aria-labelledby="matriz-proyecto">
            <h3
              id="matriz-proyecto"
              className="font-editorial text-2xl font-semibold text-editorial-ink"
            >
              {t.proyectoDetalle.evidenciaTitulo}
            </h3>
            <div className="mt-5 border-t border-editorial-rule">
              {DIMENSIONES_EVIDENCIA.map((dimension) => {
                const evaluacion = proyecto.evaluacion?.[dimension] ?? {
                  estado: 'no-determinado' as EstadoEvaluacion,
                  fuenteIds: [],
                };
                return (
                  <div
                    key={dimension}
                    className="grid gap-3 border-b border-editorial-rule py-4 sm:grid-cols-[minmax(8rem,1fr)_minmax(10rem,1fr)_minmax(7rem,0.75fr)] sm:items-center sm:gap-6"
                  >
                    <h4 className="text-sm font-semibold text-editorial-ink">
                      {t.catalogo.dimensiones[dimension]}
                    </h4>
                    <EstadoDocumental
                      estado={evaluacion.estado}
                      label={t.catalogo.evaluacionEstados[evaluacion.estado]}
                    />
                    <div className="flex flex-wrap gap-3 text-xs">
                      {evaluacion.fuenteIds.length > 0 ? (
                        evaluacion.fuenteIds.map((fuenteId) => {
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
                        })
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="border-t border-editorial-rule py-10" aria-labelledby="fuentes-proyecto">
        <EncabezadoSeccionExpediente
          id="fuentes-proyecto"
          index="04"
          title={t.proyectoDetalle.fuentesTitulo}
          description={t.proyectoDetalle.fuentesSub}
        />
        <ol className="mt-7 border-t border-editorial-rule sm:ml-[5.25rem]">
          {fuentes.map((fuente, index) => (
            <li
              key={fuente.id}
              id={`fuente-${fuente.id}`}
              className="scroll-mt-24 border-b border-editorial-rule py-6"
            >
              <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5">
                <span className="font-mono text-xs font-semibold tabular-nums text-slate-500">
                  [{index + 1}]
                </span>
                <div className="min-w-0">
                  <a
                    href={fuente.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-editorial text-xl font-semibold leading-snug text-institucional-700 underline-offset-4 hover:underline sm:text-2xl"
                  >
                    {fuente.titulo[lc]} <span aria-hidden>↗</span>
                  </a>
                  <dl className="mt-4 grid gap-x-8 gap-y-3 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <dt className="font-semibold uppercase tracking-[0.08em] text-slate-500">
                        {t.proyectoDetalle.publicadorLabel}
                      </dt>
                      <dd className="mt-1">{fuente.publicador}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold uppercase tracking-[0.08em] text-slate-500">
                        {t.proyectoDetalle.tipoFuenteLabel}
                      </dt>
                      <dd className="mt-1">{t.catalogo.tiposFuente[fuente.tipoFuente]}</dd>
                    </div>
                    {fuente.fechaPublicacion && (
                      <div>
                        <dt className="font-semibold uppercase tracking-[0.08em] text-slate-500">
                          {t.proyectoDetalle.fechaPublicacionLabel}
                        </dt>
                        <dd className="mt-1">
                          <time dateTime={fuente.fechaPublicacion}>
                            {formatearFechaCatalogo(fuente.fechaPublicacion, lc)}
                          </time>
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-semibold uppercase tracking-[0.08em] text-slate-500">
                        {t.proyectoDetalle.fechaConsultaLabel}
                      </dt>
                      <dd className="mt-1">
                        <time dateTime={fuente.fechaConsulta}>
                          {formatearFechaCatalogo(fuente.fechaConsulta, lc)}
                        </time>
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs leading-relaxed text-slate-600">
                    <span className="font-semibold text-slate-500">
                      {t.proyectoDetalle.respaldaLabel}:{' '}
                    </span>
                    {fuente.respalda
                      .map((respaldo) => t.catalogo.respaldosFuente[respaldo])
                      .join(' · ')}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-editorial-rule py-10" aria-labelledby="preguntas-proyecto">
        <EncabezadoSeccionExpediente
          id="preguntas-proyecto"
          index="05"
          title={t.proyectoDetalle.preguntasAbiertasLabel}
        />
        <div
          className={`mt-7 grid gap-8 sm:ml-[5.25rem] ${
            relaciones.length > 0 ? 'lg:grid-cols-2 lg:gap-0' : ''
          }`}
        >
          <div className={relaciones.length > 0 ? 'lg:pr-10' : 'max-w-4xl'}>
            <ListaEditorial
              items={proyecto.preguntasAbiertas?.map((item) => item[lc])}
              empty={t.proyectoDetalle.sinPreguntasAbiertas}
              markerClass="bg-editorial-accent"
            />
          </div>

          {relaciones.length > 0 && (
            <div className="border-t border-editorial-rule pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                {t.proyectoDetalle.relacionesTitulo}
              </h3>
              <ul className="mt-4 space-y-5">
                {relaciones.map(({ relacion, iniciativa }) => (
                  <li key={`${relacion.tipo}-${iniciativa!.id}`}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t.catalogo.relaciones[relacion.tipo]}
                    </p>
                    <Link
                      href={`/${lc}/proyectos/${iniciativa!.id}`}
                      className="mt-1 block text-sm font-semibold text-institucional-700 underline-offset-4 hover:underline"
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
        </div>
      </section>

      {proyecto.contexto && (
        <section className="border-t border-editorial-rule py-10" aria-labelledby="contexto-proyecto">
          <EncabezadoSeccionExpediente
            id="contexto-proyecto"
            index="06"
            title={t.proyectoDetalle.contextoLabel}
          />
          <p className="mt-7 max-w-4xl text-lg leading-relaxed text-editorial-muted text-pretty sm:ml-[5.25rem]">
            {proyecto.contexto[lc]}
          </p>
        </section>
      )}

      {relacionados.length > 0 && (
        <section className="border-t border-editorial-rule py-10" aria-labelledby="relacionados-proyecto">
          <EncabezadoSeccionExpediente
            id="relacionados-proyecto"
            index="07"
            title={t.proyectoDetalle.relacionadosLabel}
          />
          <div className="mt-7 border-t border-editorial-rule sm:ml-[5.25rem]">
            {relacionados.map((relacionado, index) => (
              <ProyectoCard
                key={relacionado.id}
                proyecto={relacionado}
                locale={lc}
                t={t}
                variant="register"
                registryIndex={index + 1}
              />
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-editorial-rule pt-8 text-sm font-semibold">
        <Link
          href={`/${lc}/proyectos`}
          className="text-institucional-700 underline-offset-4 hover:underline"
        >
          ← {t.nav.proyectos}
        </Link>
        {institucion && (
          <Link
            href={`/${lc}/instituciones/${institucion.id}`}
            className="text-institucional-700 underline-offset-4 hover:underline"
          >
            {t.proyectoDetalle.volverLabel} {institucion.nombreCorto[lc]}
          </Link>
        )}
      </div>
    </article>
  );
}
