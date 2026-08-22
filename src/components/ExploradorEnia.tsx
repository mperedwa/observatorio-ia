'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ESTADOS_CRUCE_ENIA,
  resultadosEnia,
  type EstadoCruceEnia,
  type IntervencionEnia,
  type ResultadoEnia,
} from '@/data/eniaAcciones';
import { proyectos } from '@/data/proyectos';
import type { Locale } from '@/i18n/config';
import {
  MarcaDocumental,
  type TonoDocumental,
} from '@/components/ExpedienteEditorial';
import {
  eniaTranslations,
  type VistaEnia,
} from '@/app/[locale]/enia/translations';

interface RegistroEnia {
  resultado: ResultadoEnia;
  intervencion: IntervencionEnia;
}

const VISTAS: VistaEnia[] = ['soluciones', 'catalogo', 'completo'];

const crossTone: Record<EstadoCruceEnia, TonoDocumental> = {
  'mapeado-exacto': 'confirmado',
  'coincidencia-parcial': 'parcial',
  'posible-duplicado': 'referencial',
  'nuevo-con-evidencia': 'atencion',
  'enia-solamente': 'atencion',
  'no-es-sistema-ia': 'neutral',
  'no-determinado': 'pendiente',
};

const executionTone: Record<IntervencionEnia['estadoEjecucion'], TonoDocumental> = {
  'no-verificado': 'pendiente',
  'parcialmente-verificado': 'atencion',
  verificado: 'confirmado',
  contradicho: 'contradicho',
};

function formatearFecha(fecha: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-CR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${fecha}T00:00:00Z`));
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function coincideBusqueda(texto: string, consulta: string): boolean {
  const terminos = consulta.split(/\s+/).filter(Boolean);
  return terminos.every((termino) => {
    if (termino.length > 3) return texto.includes(termino);
    const terminoSeguro = termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${terminoSeguro}([^a-z0-9]|$)`).test(
      texto,
    );
  });
}

export function ExploradorEnia({ locale }: { locale: Locale }) {
  const t = eniaTranslations[locale];
  const [vista, setVista] = useState<VistaEnia>('soluciones');
  const [busqueda, setBusqueda] = useState('');
  const [eje, setEje] = useState('todos');
  const [estado, setEstado] = useState<'todos' | EstadoCruceEnia>('todos');
  const [mostrarDuplicados, setMostrarDuplicados] = useState(false);

  const registros = useMemo<RegistroEnia[]>(
    () =>
      resultadosEnia.flatMap((resultado) =>
        resultado.intervenciones.map((intervencion) => ({
          resultado,
          intervencion,
        })),
      ),
    [],
  );

  const porId = useMemo(
    () => new Map(registros.map((registro) => [registro.intervencion.id, registro])),
    [registros],
  );
  const proyectosPorId = useMemo(
    () => new Map(proyectos.map((proyecto) => [proyecto.id, proyecto])),
    [],
  );
  const ejes = useMemo(
    () =>
      [...new Map(
        resultadosEnia.map((resultado) => [
          resultado.eje.numero,
          resultado.eje.nombre[locale],
        ]),
      ).entries()].sort(([a], [b]) => a - b),
    [locale],
  );

  const visibles = useMemo(() => {
    const termino = normalizar(busqueda.trim());

    return registros.filter(({ resultado, intervencion }) => {
      const esDuplicado =
        intervencion.cruceCatalogo.estado === 'posible-duplicado';
      if (esDuplicado && !mostrarDuplicados) return false;

      const canonica = intervencion.cruceCatalogo.intervencionCanonicaId
        ? porId.get(intervencion.cruceCatalogo.intervencionCanonicaId)
            ?.intervencion
        : intervencion;
      const estadoCanonico = canonica?.cruceCatalogo.estado;

      if (
        vista === 'soluciones' &&
        intervencion.tipoIntervencion !== 'solucion-ia-declarada'
      ) {
        return false;
      }
      if (
        vista === 'catalogo' &&
        estadoCanonico !== 'mapeado-exacto' &&
        estadoCanonico !== 'coincidencia-parcial'
      ) {
        return false;
      }
      if (eje !== 'todos' && resultado.eje.numero !== Number(eje)) return false;
      if (estado !== 'todos' && intervencion.cruceCatalogo.estado !== estado) {
        return false;
      }

      if (!termino) return true;
      const texto = normalizar(
        [
          intervencion.id,
          resultado.codigo,
          resultado.eje.nombre.es,
          resultado.eje.nombre.en,
          resultado.lineaAccion.nombre.es,
          resultado.lineaAccion.nombre.en,
          resultado.resultadoEsperado.es,
          resultado.resultadoEsperado.en,
          intervencion.intervencionEstrategicaFuenteEs,
          intervencion.objetivoFuenteEs,
          intervencion.responsableOficial,
          intervencion.aliadosOficiales ?? '',
        ].join(' '),
      );
      return coincideBusqueda(texto, termino);
    });
  }, [busqueda, eje, estado, mostrarDuplicados, porId, registros, vista]);

  function limpiarFiltros() {
    setBusqueda('');
    setEje('todos');
    setEstado('todos');
    setMostrarDuplicados(false);
  }

  return (
    <section aria-labelledby="enia-explorador-titulo" className="mt-20">
      <header className="grid gap-2 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-5">
        <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
          01
        </span>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-institucional-700">
            {t.explorer.kicker}
          </p>
          <h2
            id="enia-explorador-titulo"
            className="mt-2 font-editorial text-3xl font-semibold leading-tight tracking-[-0.015em] text-editorial-ink sm:text-4xl"
          >
            {t.explorer.title}
          </h2>
          <p className="mt-3 leading-relaxed text-editorial-muted">{t.explorer.intro}</p>
        </div>
      </header>

      <div className="mt-9 border-y border-editorial-rule py-6">
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t.explorer.viewsLabel}
          </legend>
          <div className="mt-3 grid border-y border-editorial-rule md:grid-cols-3 md:divide-x md:divide-editorial-rule">
            {VISTAS.map((item) => {
              const activa = vista === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={activa}
                  onClick={() => setVista(item)}
                  className={`min-h-20 border-b border-editorial-rule px-4 py-4 text-left transition-colors last:border-b-0 md:border-b-0 md:px-5 ${
                    activa
                      ? 'bg-editorial-paper shadow-[inset_4px_0_0_0_#1d4ed8] md:shadow-[inset_0_-3px_0_0_#1d4ed8]'
                      : 'bg-white hover:bg-editorial-paper/55'
                  }`}
                >
                  <span
                    className={`block text-sm font-semibold ${
                      activa ? 'text-institucional-800' : 'text-slate-800'
                    }`}
                  >
                    {t.explorer.views[item].label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    {t.explorer.views[item].description}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="block lg:col-span-2">
            <span className="text-xs font-semibold text-slate-700">
              {t.explorer.searchLabel}
            </span>
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder={t.explorer.searchPlaceholder}
              className="mt-1.5 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-institucional-600 focus:ring-2 focus:ring-institucional-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">
              {t.explorer.axisLabel}
            </span>
            <select
              value={eje}
              onChange={(event) => setEje(event.target.value)}
              className="mt-1.5 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-institucional-600 focus:ring-2 focus:ring-institucional-100"
            >
              <option value="todos">{t.explorer.allAxes}</option>
              {ejes.map(([numero, nombre]) => (
                <option key={numero} value={numero}>
                  {numero}. {nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">
              {t.explorer.statusLabel}
            </span>
            <select
              value={estado}
              onChange={(event) =>
                setEstado(event.target.value as 'todos' | EstadoCruceEnia)
              }
              className="mt-1.5 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-institucional-600 focus:ring-2 focus:ring-institucional-100"
            >
              <option value="todos">{t.explorer.allStatuses}</option>
              {ESTADOS_CRUCE_ENIA.map((item) => (
                <option key={item} value={item}>
                  {t.crossLabels[item]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={mostrarDuplicados}
              onChange={(event) => setMostrarDuplicados(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-institucional-700 focus:ring-institucional-600"
            />
            {t.explorer.showDuplicates}
          </label>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold tabular-nums text-slate-900">
              {visibles.length}{' '}
              {visibles.length === 1
                ? t.explorer.resultSingular
                : t.explorer.results}
            </span>
            {(busqueda || eje !== 'todos' || estado !== 'todos' || mostrarDuplicados) && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="font-medium text-institucional-700 hover:underline"
              >
                {t.explorer.clear}
              </button>
            )}
          </div>
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="border-b border-slate-300 py-16 text-center text-slate-500">
          <p>{t.explorer.noResults}</p>
          <button
            type="button"
            onClick={limpiarFiltros}
            className="mt-3 text-sm font-semibold text-institucional-700 hover:underline"
          >
            {t.explorer.clear}
          </button>
        </div>
      ) : (
        <div className="border-t border-editorial-rule">
          {visibles.map(({ resultado, intervencion }, index) => (
            <IntervencionRow
              key={intervencion.id}
              locale={locale}
              resultado={resultado}
              intervencion={intervencion}
              projectMap={proyectosPorId}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function IntervencionRow({
  locale,
  resultado,
  intervencion,
  projectMap,
  index,
}: {
  locale: Locale;
  resultado: ResultadoEnia;
  intervencion: IntervencionEnia;
  projectMap: Map<string, (typeof proyectos)[number]>;
  index: number;
}) {
  const t = eniaTranslations[locale];
  const cross = intervencion.cruceCatalogo;
  const evidencias = intervencion.evidenciasExternas ?? [];

  return (
    <details
      id={intervencion.id}
      open={index === 0}
      className="group scroll-mt-24 border-b border-editorial-rule"
    >
      <summary className="cursor-pointer list-none px-1 py-6 marker:hidden hover:bg-editorial-paper/55 focus-visible:outline-offset-[-3px] sm:px-3 sm:py-7 [&::-webkit-details-marker]:hidden">
        <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_1rem] gap-x-3 sm:grid-cols-[3.25rem_minmax(0,1fr)_1.5rem] sm:gap-x-5">
          <span aria-hidden className="pt-1 font-mono text-xs tabular-nums text-slate-500">
            {String(index + 1).padStart(3, '0')}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] uppercase tracking-[0.08em] text-slate-500">
              <span className="font-semibold text-institucional-700">
                {t.explorer.axis} {resultado.eje.numero}
              </span>
              <span aria-hidden>/</span>
              <span className="font-mono normal-case tracking-normal">{intervencion.id}</span>
              <span aria-hidden>/</span>
              <span>
                {t.explorer.planPage} {intervencion.paginaPlan}
              </span>
            </div>

            <h3
              id={`${intervencion.id}-titulo`}
              lang="es"
              className="mt-2 max-w-4xl font-editorial text-xl font-semibold leading-snug text-editorial-ink sm:text-2xl"
            >
              {intervencion.intervencionEstrategicaFuenteEs}
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_15rem]">
              <MarcaDocumental
                label={t.crossLabels[cross.estado]}
                tone={crossTone[cross.estado]}
              />
              <MarcaDocumental
                label={t.executionLabels[intervencion.estadoEjecucion]}
                tone={executionTone[intervencion.estadoEjecucion]}
              />
              <p className="text-xs leading-snug text-slate-500 sm:col-span-2 lg:col-span-1 lg:text-right">
                <span className="font-semibold text-slate-600">{t.explorer.responsible}:</span>{' '}
                {intervencion.responsableOficial}
              </p>
            </div>
          </div>

          <span
            aria-hidden
            className="pt-1 text-slate-500 transition-transform group-open:rotate-180"
          >
            ↓
          </span>
        </div>
        <span className="sr-only group-open:hidden">{t.explorer.expandRecord}</span>
        <span className="sr-only hidden group-open:inline">{t.explorer.collapseRecord}</span>
      </summary>

      <div className="grid border-t border-editorial-rule bg-editorial-paper/35 lg:grid-cols-3 lg:divide-x lg:divide-editorial-rule">
        <section className="min-w-0 px-5 py-6 sm:px-7">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-institucional-700">
            01 / {t.explorer.officialSource}
          </p>
          <h4 className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            {t.explorer.planObjective}
          </h4>
          <p lang="es" className="mt-2 text-sm leading-relaxed text-slate-700">
            {intervencion.objetivoFuenteEs}
          </p>

          <h4 className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            {t.explorer.expectedResult}
          </h4>
          <p lang="es" className="mt-2 text-sm leading-relaxed text-slate-700">
            {resultado.resultadoEsperado.es}
          </p>

          <dl className="mt-5 grid gap-4 border-t border-editorial-rule pt-4 text-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {intervencion.aliadosOficiales && (
              <div>
                <dt className="text-xs font-semibold text-slate-500">
                  {t.explorer.allies}
                </dt>
                <dd className="mt-1 text-slate-800">{intervencion.aliadosOficiales}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold text-slate-500">
                {t.explorer.type}
              </dt>
              <dd className="mt-1 text-slate-800">
                {t.typeLabels[intervencion.tipoIntervencion]}
              </dd>
            </div>
          </dl>

          <details className="group/indicators mt-5 border-t border-editorial-rule pt-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-institucional-700 marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="text-slate-500 transition-transform group-open/indicators:rotate-90">▸</span>
                {t.explorer.indicators} ({intervencion.indicadores.length})
              </span>
            </summary>

            <div className="mt-4 space-y-4 md:hidden" lang="es">
              {intervencion.indicadores.map((indicador, indicadorIndex) => (
                <dl
                  key={`${intervencion.id}-mobile-${indicadorIndex}`}
                  className="border-t border-editorial-rule pt-3 text-sm"
                >
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">{t.explorer.indicators}</dt>
                    <dd className="mt-1 text-slate-800">{indicador.descripcionFuenteEs ?? t.explorer.noValue}</dd>
                  </div>
                  <div className="mt-3">
                    <dt className="text-xs font-semibold text-slate-500">{t.explorer.baseline}</dt>
                    <dd className="mt-1 text-slate-600">{indicador.lineaBaseFuente ?? t.explorer.noValue}</dd>
                  </div>
                  <div className="mt-3">
                    <dt className="text-xs font-semibold text-slate-500">{t.explorer.target}</dt>
                    <dd className="mt-1 text-slate-600">{indicador.metaPeriodoFuente ?? t.explorer.noValue}</dd>
                  </div>
                </dl>
              ))}
            </div>

            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="border-y border-editorial-rule text-xs text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">{t.explorer.indicators}</th>
                    <th className="px-3 py-2 font-semibold">{t.explorer.baseline}</th>
                    <th className="px-3 py-2 font-semibold">{t.explorer.target}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-editorial-rule" lang="es">
                  {intervencion.indicadores.map((indicador, indicadorIndex) => (
                    <tr key={`${intervencion.id}-${index}-${indicadorIndex}`}>
                      <td className="min-w-72 px-3 py-3 align-top text-slate-800">
                        {indicador.descripcionFuenteEs ?? t.explorer.noValue}
                      </td>
                      <td className="min-w-36 px-3 py-3 align-top text-slate-600">
                        {indicador.lineaBaseFuente ?? t.explorer.noValue}
                      </td>
                      <td className="min-w-56 px-3 py-3 align-top text-slate-600">
                        {indicador.metaPeriodoFuente ?? t.explorer.noValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        <section className="min-w-0 border-t border-editorial-rule px-5 py-6 sm:px-7 lg:border-t-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-editorial-accent">
            02 / {t.explorer.editorialLayer}
          </p>
          <div className="mt-4">
            <MarcaDocumental label={t.crossLabels[cross.estado]} tone={crossTone[cross.estado]} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            {cross.fundamento[locale]}
          </p>

          {cross.intervencionCanonicaId && (
            <p className="mt-5 border-t border-editorial-rule pt-4 text-sm text-slate-700">
              {t.explorer.canonicalReference}:{' '}
              <a
                href={`#${cross.intervencionCanonicaId}`}
                className="font-mono text-xs font-semibold text-institucional-700 underline underline-offset-2"
              >
                {cross.intervencionCanonicaId}
              </a>
            </p>
          )}

          {cross.proyectoIds.length > 0 && (
            <div className="mt-5 border-t border-editorial-rule pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                {t.explorer.relatedCatalog}
              </h4>
              <ul className="mt-2 space-y-2">
                {cross.proyectoIds.map((proyectoId) => {
                  const proyecto = projectMap.get(proyectoId);
                  return (
                    <li key={proyectoId}>
                      <Link
                        href={`/${locale}/proyectos/${proyectoId}`}
                        className="text-sm font-semibold text-institucional-700 underline-offset-2 hover:underline"
                      >
                        {proyecto?.titulo[locale] ?? proyectoId}{' '}
                        <span aria-hidden>→</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {intervencion.notasEditoriales && (
            <div className="mt-5 border-l-2 border-editorial-accent pl-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-editorial-accent">
                {t.explorer.editorialNote}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                {intervencion.notasEditoriales[locale]}
              </p>
            </div>
          )}
        </section>

        <section className="min-w-0 border-t border-editorial-rule px-5 py-6 sm:px-7 lg:border-t-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-600">
            03 / {t.explorer.externalLayer}
          </p>
          <div className="mt-4">
            <MarcaDocumental
              label={t.executionLabels[intervencion.estadoEjecucion]}
              tone={executionTone[intervencion.estadoEjecucion]}
            />
          </div>

          {evidencias.length > 0 ? (
            <ol className="mt-5 space-y-5">
              {evidencias.map((fuente, evidenceIndex) => (
                <li key={fuente.id} className="border-t border-editorial-rule pt-4 text-sm">
                  <span className="font-mono text-[0.68rem] tabular-nums text-slate-500">
                    {String(evidenceIndex + 1).padStart(2, '0')}
                  </span>
                  <a
                    href={fuente.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block font-semibold leading-snug text-institucional-700 underline-offset-2 hover:underline"
                  >
                    {fuente.titulo[locale]} <span aria-hidden>↗</span>
                  </a>
                  <p className="mt-1 text-xs text-slate-500">{fuente.publicador}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    <span className="font-semibold">{t.explorer.supports}:</span>{' '}
                    {fuente.respalda.map((dimension) => t.supportLabels[dimension]).join(' · ')}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {t.explorer.sourceConsulted}:{' '}
                    <time dateTime={fuente.fechaConsulta}>
                      {formatearFecha(fuente.fechaConsulta, locale)}
                    </time>
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-5 border-t border-editorial-rule pt-4 text-sm leading-relaxed text-slate-600">
              {t.explorer.noExternalEvidence}
            </p>
          )}

          <p className="mt-5 border-t border-editorial-rule pt-4 text-xs text-slate-500">
            {t.explorer.lastReview}:{' '}
            <time dateTime={intervencion.fechaUltimaRevision}>
              {formatearFecha(intervencion.fechaUltimaRevision, locale)}
            </time>
          </p>
        </section>
      </div>
    </details>
  );
}
