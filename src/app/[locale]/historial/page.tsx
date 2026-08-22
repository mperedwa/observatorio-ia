import Link from 'next/link';
import type { Metadata } from 'next';
import { changelog } from '@/data/changelog';
import type { ChangelogTipo } from '@/data/changelog';
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
  const t = getDictionary(locale as Locale);
  return {
    title: `${t.changelog.historialPagina.titulo} — ${t.siteName} ${t.siteCountry}`,
    description: t.changelog.historialPagina.metaDescripcion,
  };
}

const tipoCls: Record<ChangelogTipo, string> = {
  legislacion: 'bg-slate-100 text-slate-700 border-slate-300',
  institucion: 'bg-stone-100 text-stone-700 border-stone-300',
  indicador: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  proyecto: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  recurso: 'bg-gray-100 text-gray-700 border-gray-300',
};

const agendaCls: Record<EstadoAgenda, string> = {
  'al-dia': 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'vence-hoy': 'border-amber-200 bg-amber-50 text-amber-800',
  vencida: 'border-rose-200 bg-rose-50 text-rose-800',
};

const resultadoCls: Record<ResultadoRevision, string> = {
  'cambio-detectado': 'border-amber-200 bg-amber-50 text-amber-800',
  'cambio-publicado': 'border-sky-200 bg-sky-50 text-sky-800',
  'sin-cambios': 'border-slate-200 bg-white text-slate-700',
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
  const lc = locale as Locale;
  const t = getDictionary(lc);
  const tx = historialTranslations[lc];

  const resumenItems = [
    [resumenMonitoreo.frentes, tx.resumen.frentes],
    [resumenMonitoreo.revisiones, tx.resumen.revisiones],
    [resumenMonitoreo.revisionesSinCambios, tx.resumen.sinCambios],
    [resumenMonitoreo.vencidas, tx.resumen.vencidas],
  ] as const;

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <nav className="mb-6 text-sm">
          <Link
            href={`/${lc}`}
            className="text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
          >
            ← {t.changelog.historialPagina.volverHome}
          </Link>
        </nav>

        <header className="mb-10 max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            {tx.kicker}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-5xl">
            {tx.titulo}
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-slate-600">
            {tx.intro}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {tx.corte}{' '}
            <time dateTime={monitoreo.fechaCorte} className="font-medium text-slate-700">
              {formatearFecha(monitoreo.fechaCorte, lc)}
            </time>
          </p>
        </header>

        <dl className="grid border-y border-slate-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-200">
          {resumenItems.map(([valor, etiqueta]) => (
            <div key={etiqueta} className="py-5 first:pl-0 lg:px-6">
              <dd className="text-3xl font-semibold tabular-nums text-slate-900">{valor}</dd>
              <dt className="mt-1 text-sm text-slate-500">{etiqueta}</dt>
            </div>
          ))}
        </dl>

        <section className="mt-12 border-l-4 border-institucional-600 pl-5">
          <h2 className="text-xl font-semibold text-slate-900">{tx.politicaTitulo}</h2>
          <p className="mt-2 max-w-4xl text-pretty leading-relaxed text-slate-700">
            {monitoreo.politica.descripcion[lc]}
          </p>
          <p className="mt-2 max-w-4xl text-pretty text-sm leading-relaxed text-slate-600">
            {monitoreo.politica.automatizacion[lc]}
          </p>
        </section>

        <section className="mt-16" aria-labelledby="agenda-monitoreo">
          <header className="max-w-4xl">
            <h2 id="agenda-monitoreo" className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {tx.agendaTitulo}
            </h2>
            <p className="mt-3 text-pretty text-slate-600">{tx.agendaSub}</p>
          </header>

          <div className="mt-7 overflow-x-auto border-y border-slate-200">
            <table className="min-w-[920px] divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">{tx.agendaCols.frente}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{tx.agendaCols.alcance}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{tx.agendaCols.cadencia}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{tx.agendaCols.ultima}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{tx.agendaCols.proxima}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{tx.agendaCols.estado}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
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
                          className="font-semibold text-institucional-800 hover:underline"
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
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${agendaCls[estado]}`}>
                          {tx.estados[estado]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="bitacora-revisiones">
          <header className="max-w-4xl">
            <h2 id="bitacora-revisiones" className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {tx.bitacoraTitulo}
            </h2>
            <p className="mt-3 text-pretty text-slate-600">{tx.bitacoraSub}</p>
          </header>

          <div className="mt-7 border-y border-slate-200">
            {revisionesMonitoreo.map((revision) => {
              const frente = obtenerFrenteMonitoreo(revision.frenteId);
              return (
                <article
                  key={revision.id}
                  className="grid gap-4 border-b border-slate-200 py-6 last:border-b-0 md:grid-cols-[150px_minmax(0,1fr)]"
                >
                  <div>
                    <time dateTime={revision.fecha} className="text-sm tabular-nums text-slate-500">
                      {formatearFecha(revision.fecha, lc)}
                    </time>
                    <div className="mt-2">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${resultadoCls[revision.resultado]}`}>
                        {tx.resultados[revision.resultado]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {frente?.nombre[lc] ?? revision.frenteId}
                    </h3>
                    <p className="mt-2 max-w-4xl text-pretty leading-relaxed text-slate-700">
                      {revision.resumen[lc]}
                    </p>

                    {revision.transiciones.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {tx.transiciones}
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                          {revision.transiciones.map((transicion) => (
                            <li key={`${transicion.objetoTipo}-${transicion.objetoId}-${transicion.campo}`}>
                              <code className="text-xs text-slate-700">{transicion.objetoId}</code>
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
                      className="mt-4 inline-block text-sm font-medium text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
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
            className="mt-5 inline-block text-sm font-medium text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
          >
            {tx.api} →
          </a>
        </section>

        <section className="mt-20" aria-labelledby="cambios-publicados">
          <header className="max-w-4xl">
            <h2 id="cambios-publicados" className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {tx.cambiosTitulo}
            </h2>
            <p className="mt-3 text-pretty text-slate-600">{tx.cambiosSub}</p>
          </header>

          <div className="mt-7 overflow-x-auto border-y border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="w-[110px] px-4 py-3 font-medium">
                    {t.changelog.tableCols.fecha}
                  </th>
                  <th scope="col" className="w-[130px] px-4 py-3 font-medium">
                    {t.changelog.tableCols.tipo}
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    {t.changelog.tableCols.actualizacion}
                  </th>
                  <th scope="col" className="w-[220px] px-4 py-3 font-medium">
                    {t.changelog.tableCols.fuente}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {changelog.map((entry) => (
                  <tr
                    key={`${entry.fecha}-${entry.tipo}-${entry.commit_sha ?? 'sin-commit'}-${entry.actualizacion.es.slice(0, 48)}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 align-top tabular-nums text-slate-600">
                      <time dateTime={entry.fecha}>{entry.fecha}</time>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-top">
                      <span className={`inline-block rounded border px-2 py-0.5 text-xs ${tipoCls[entry.tipo]}`}>
                        {t.changelog.tipos[entry.tipo]}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-pretty text-slate-700">
                      {entry.actualizacion[lc]}
                    </td>
                    <td className="px-4 py-3 align-top text-pretty text-slate-600">
                      {entry.fuente_url ? (
                        <a
                          href={entry.fuente_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={entry.fuente[lc]}
                          className="text-institucional-700 underline underline-offset-2 hover:text-institucional-900"
                        >
                          {entry.fuente[lc]} ↗
                        </a>
                      ) : (
                        entry.fuente[lc]
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            {tx.totalCambios}:{' '}
            <span className="tabular-nums">{changelog.length}</span>
          </p>
        </section>
      </section>
    </main>
  );
}
