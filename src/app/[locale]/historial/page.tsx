import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import {
  EncabezadoSeccionExpediente,
  ExpedienteMeta,
  MarcaDocumental,
  type TonoDocumental,
} from '@/components/ExpedienteEditorial';
import { changelog } from '@/data/changelog';
import {
  calcularEstadoAgenda,
  cadenciasMonitoreo,
  frentesMonitoreo,
  monitoreo,
  obtenerFrenteMonitoreo,
  revisionesMonitoreo,
  resumenMonitoreo,
  type EstadoAgenda,
  type ResultadoRevision,
} from '@/data/monitoreo';
import { getDictionary } from '@/i18n/dictionaries';
import { type Locale, locales } from '@/i18n/config';
import { historialTranslations } from './translations';

export async function generateStaticParams() {
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
  const t = getDictionary(lc);
  const title = `${t.changelog.historialPagina.titulo} — ${t.siteName} ${t.siteCountry}`;
  const description = t.changelog.historialPagina.metaDescripcion;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lc}/historial/`,
      languages: {
        es: '/es/historial/',
        en: '/en/historial/',
        'x-default': '/es/historial/',
      },
    },
  };
}

const agendaTone: Record<EstadoAgenda, TonoDocumental> = {
  'al-dia': 'confirmado',
  'vence-hoy': 'atencion',
  vencida: 'contradicho',
};

const resultadoTone: Record<ResultadoRevision, TonoDocumental> = {
  'cambio-detectado': 'atencion',
  'cambio-publicado': 'parcial',
  'sin-cambios': 'neutral',
};

function formatearFecha(fecha: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${fecha}T00:00:00Z`));
}

export default async function HistorialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);
  const tx = historialTranslations[lc];

  return (
    <div className="bg-white">
      <header className="border-b border-editorial-rule bg-editorial-paper">
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-10 sm:pb-16">
          <Breadcrumb
            locale={lc}
            items={[
              { label: t.breadcrumb.inicio, href: `/${lc}/` },
              { label: tx.titulo },
            ]}
          />
          <div className="mt-8 max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
              {tx.kicker}
            </p>
            <h1 className="mt-3 font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink sm:text-6xl">
              {tx.titulo}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-editorial-muted text-pretty">
              {tx.intro}
            </p>
            <p className="mt-5 text-sm text-slate-500">
              {tx.corte}{' '}
              <time dateTime={monitoreo.fechaCorte} className="font-semibold text-slate-700">
                {formatearFecha(monitoreo.fechaCorte, lc)}
              </time>
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <ExpedienteMeta
          items={[
            { label: tx.resumen.frentes, value: resumenMonitoreo.frentes },
            { label: tx.resumen.revisiones, value: resumenMonitoreo.revisiones },
            { label: tx.resumen.sinCambios, value: resumenMonitoreo.revisionesSinCambios },
            { label: tx.resumen.vencidas, value: resumenMonitoreo.vencidas },
          ]}
        />

        <section className="mt-20" aria-labelledby="politica-monitoreo">
          <EncabezadoSeccionExpediente
            index="01"
            id="politica-monitoreo"
            title={tx.politicaTitulo}
          />
          <div className="mt-7 grid gap-5 sm:grid-cols-[3.25rem_minmax(0,1fr)]">
            <span aria-hidden />
            <div className="max-w-4xl border-l-2 border-institucional-700 pl-5">
              <p className="leading-relaxed text-slate-700">
                {monitoreo.politica.descripcion[lc]}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {monitoreo.politica.automatizacion[lc]}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20" aria-labelledby="agenda-monitoreo">
          <EncabezadoSeccionExpediente
            index="02"
            id="agenda-monitoreo"
            title={tx.agendaTitulo}
            description={tx.agendaSub}
          />

          <div className="mt-9 hidden border-y border-editorial-rule lg:block">
            <table className="min-w-full divide-y divide-editorial-rule text-sm">
              <thead className="bg-editorial-paper/55 text-left text-[0.68rem] uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">{tx.agendaCols.frente}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{tx.agendaCols.alcance}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{tx.agendaCols.cadencia}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{tx.agendaCols.ultima}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{tx.agendaCols.proxima}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{tx.agendaCols.estado}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-rule bg-white">
                {frentesMonitoreo.map((frente) => {
                  const estado = calcularEstadoAgenda(frente);
                  const cadencia = cadenciasMonitoreo.get(frente.cadenciaId);
                  return (
                    <tr key={frente.id}>
                      <td className="max-w-[330px] px-4 py-4 align-top">
                        <a
                          href={frente.fuenteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-institucional-800 underline-offset-2 hover:underline"
                        >
                          {frente.nombre[lc]} ↗
                        </a>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                          {frente.descripcion[lc]}
                        </p>
                      </td>
                      <td className="px-4 py-4 align-top tabular-nums text-slate-700">
                        {frente.alcance.cantidad} {frente.alcance.unidad[lc]}
                      </td>
                      <td className="max-w-[180px] px-4 py-4 align-top text-slate-700">
                        {cadencia?.nombre[lc] ?? frente.cadenciaId}
                        {frente.notaCadencia && (
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {frente.notaCadencia[lc]}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 align-top tabular-nums text-slate-600">
                        <time dateTime={frente.fechaUltimaRevision}>
                          {formatearFecha(frente.fechaUltimaRevision, lc)}
                        </time>
                      </td>
                      <td className="px-4 py-4 align-top tabular-nums font-medium text-slate-800">
                        <time dateTime={frente.fechaProximaRevision}>
                          {formatearFecha(frente.fechaProximaRevision, lc)}
                        </time>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <MarcaDocumental label={tx.estados[estado]} tone={agendaTone[estado]} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-9 border-t border-editorial-rule lg:hidden">
            {frentesMonitoreo.map((frente, index) => {
              const estado = calcularEstadoAgenda(frente);
              const cadencia = cadenciasMonitoreo.get(frente.cadenciaId);
              return (
                <article
                  key={frente.id}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-editorial-rule py-7 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-x-5"
                >
                  <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <a
                      href={frente.fuenteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-editorial text-2xl font-semibold leading-tight text-institucional-900 underline-offset-3 hover:underline"
                    >
                      {frente.nombre[lc]} <span aria-hidden>↗</span>
                    </a>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {frente.descripcion[lc]}
                    </p>
                    <div className="mt-4">
                      <MarcaDocumental label={tx.estados[estado]} tone={agendaTone[estado]} />
                    </div>
                    <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-editorial-rule pt-4 text-sm">
                      <MobileMeta
                        label={tx.agendaCols.alcance}
                        value={`${frente.alcance.cantidad} ${frente.alcance.unidad[lc]}`}
                      />
                      <MobileMeta
                        label={tx.agendaCols.cadencia}
                        value={cadencia?.nombre[lc] ?? frente.cadenciaId}
                        detail={frente.notaCadencia?.[lc]}
                      />
                      <MobileMeta
                        label={tx.agendaCols.ultima}
                        value={formatearFecha(frente.fechaUltimaRevision, lc)}
                        dateTime={frente.fechaUltimaRevision}
                      />
                      <MobileMeta
                        label={tx.agendaCols.proxima}
                        value={formatearFecha(frente.fechaProximaRevision, lc)}
                        dateTime={frente.fechaProximaRevision}
                      />
                    </dl>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-20" aria-labelledby="bitacora-revisiones">
          <EncabezadoSeccionExpediente
            index="03"
            id="bitacora-revisiones"
            title={tx.bitacoraTitulo}
            description={tx.bitacoraSub}
          />

          <div className="mt-9 border-t border-editorial-rule">
            {revisionesMonitoreo.map((revision, index) => {
              const frente = obtenerFrenteMonitoreo(revision.frenteId);
              return (
                <article
                  key={revision.id}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-editorial-rule py-7 sm:grid-cols-[3.25rem_9rem_minmax(0,1fr)] sm:gap-x-5 sm:py-8"
                >
                  <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <time dateTime={revision.fecha} className="text-sm tabular-nums text-slate-500">
                      {formatearFecha(revision.fecha, lc)}
                    </time>
                    <div className="mt-2">
                      <MarcaDocumental
                        label={tx.resultados[revision.resultado]}
                        tone={resultadoTone[revision.resultado]}
                      />
                    </div>
                  </div>
                  <div className="col-start-2 mt-4 min-w-0 sm:col-start-3 sm:mt-0">
                    <h3 className="font-editorial text-xl font-semibold leading-tight text-editorial-ink sm:text-2xl">
                      {frente?.nombre[lc] ?? revision.frenteId}
                    </h3>
                    <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-700 text-pretty">
                      {revision.resumen[lc]}
                    </p>

                    {revision.transiciones.length > 0 && (
                      <div className="mt-5 border-l-2 border-editorial-accent pl-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-editorial-accent">
                          {tx.transiciones}
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
                          {revision.transiciones.map((transicion) => (
                            <li key={`${transicion.objetoTipo}-${transicion.objetoId}-${transicion.campo}`}>
                              <code className="break-all text-xs text-slate-700">{transicion.objetoId}</code>
                              {' · '}{transicion.campo}:{' '}
                              <span>{transicion.antes ?? tx.sinValorAnterior}</span>
                              {' → '}
                              <span className="font-medium text-slate-800">{transicion.despues ?? '—'}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <a
                      href={revision.fuenteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-block text-sm font-semibold text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
                    >
                      {tx.fuente} ↗
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          <a
            href="/api/monitoreo.json"
            className="mt-5 inline-block text-sm font-semibold text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
          >
            {tx.api} →
          </a>
        </section>

        <section className="mt-20" aria-labelledby="cambios-publicados">
          <EncabezadoSeccionExpediente
            index="04"
            id="cambios-publicados"
            title={tx.cambiosTitulo}
            description={tx.cambiosSub}
          />

          <div className="mt-9 hidden border-y border-editorial-rule md:block">
            <table className="min-w-full divide-y divide-editorial-rule text-sm">
              <thead className="bg-editorial-paper/55 text-left text-[0.68rem] uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th scope="col" className="w-[110px] px-4 py-3 font-semibold">{t.changelog.tableCols.fecha}</th>
                  <th scope="col" className="w-[130px] px-4 py-3 font-semibold">{t.changelog.tableCols.tipo}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{t.changelog.tableCols.actualizacion}</th>
                  <th scope="col" className="w-[220px] px-4 py-3 font-semibold">{t.changelog.tableCols.fuente}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-rule bg-white">
                {changelog.map((entry) => (
                  <tr key={`${entry.fecha}-${entry.tipo}-${entry.commit_sha ?? 'sin-commit'}-${entry.actualizacion.es.slice(0, 48)}`}>
                    <td className="whitespace-nowrap px-4 py-4 align-top tabular-nums text-slate-600">
                      <time dateTime={entry.fecha}>{formatearFecha(entry.fecha, lc)}</time>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <MarcaDocumental label={t.changelog.tipos[entry.tipo]} />
                    </td>
                    <td className="px-4 py-4 align-top leading-relaxed text-slate-700 text-pretty">
                      {entry.actualizacion[lc]}
                    </td>
                    <td className="px-4 py-4 align-top text-slate-600 text-pretty">
                      <FuenteCambio entry={entry} locale={lc} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-9 border-t border-editorial-rule md:hidden">
            {changelog.map((entry, index) => (
              <article
                key={`${entry.fecha}-${entry.tipo}-${entry.commit_sha ?? 'sin-commit'}-${entry.actualizacion.es.slice(0, 48)}`}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-editorial-rule py-6"
              >
                <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <time dateTime={entry.fecha} className="text-xs tabular-nums text-slate-500">
                      {formatearFecha(entry.fecha, lc)}
                    </time>
                    <MarcaDocumental label={t.changelog.tipos[entry.tipo]} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 text-pretty">
                    {entry.actualizacion[lc]}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    <FuenteCambio entry={entry} locale={lc} />
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 text-xs text-slate-500">
            {tx.totalCambios}: <span className="tabular-nums">{changelog.length}</span>
          </p>
        </section>
      </div>
    </div>
  );
}

function MobileMeta({
  label,
  value,
  detail,
  dateTime,
}: {
  label: string;
  value: string;
  detail?: string;
  dateTime?: string;
}) {
  return (
    <div>
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-slate-700">
        {dateTime ? <time dateTime={dateTime}>{value}</time> : value}
      </dd>
      {detail && <dd className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</dd>}
    </div>
  );
}

function FuenteCambio({
  entry,
  locale,
}: {
  entry: (typeof changelog)[number];
  locale: Locale;
}) {
  if (!entry.fuente_url) return entry.fuente[locale];

  return (
    <a
      href={entry.fuente_url}
      target="_blank"
      rel="noopener noreferrer"
      title={entry.fuente[locale]}
      className="font-semibold text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
    >
      {entry.fuente[locale]} ↗
    </a>
  );
}
