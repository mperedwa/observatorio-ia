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
  eniaTranslations,
  type VistaEnia,
} from '@/app/[locale]/enia/translations';

interface RegistroEnia {
  resultado: ResultadoEnia;
  intervencion: IntervencionEnia;
}

const VISTAS: VistaEnia[] = ['soluciones', 'catalogo', 'completo'];

const statusClass: Record<EstadoCruceEnia, string> = {
  'mapeado-exacto': 'border-emerald-300 text-emerald-800 bg-emerald-50',
  'coincidencia-parcial': 'border-sky-300 text-sky-800 bg-sky-50',
  'posible-duplicado': 'border-violet-300 text-violet-800 bg-violet-50',
  'nuevo-con-evidencia': 'border-amber-300 text-amber-900 bg-amber-50',
  'enia-solamente': 'border-orange-300 text-orange-900 bg-orange-50',
  'no-es-sistema-ia': 'border-slate-300 text-slate-700 bg-slate-50',
  'no-determinado': 'border-slate-300 text-slate-700 bg-white',
};

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
    <section aria-labelledby="enia-explorador-titulo" className="mt-16">
      <header className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          {t.explorer.kicker}
        </p>
        <h2
          id="enia-explorador-titulo"
          className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl"
        >
          {t.explorer.title}
        </h2>
        <p className="mt-3 leading-relaxed text-slate-600">{t.explorer.intro}</p>
      </header>

      <div className="mt-9 border-y border-slate-300 py-6">
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t.explorer.viewsLabel}
          </legend>
          <div className="mt-3 grid gap-px overflow-hidden rounded-lg border border-slate-300 bg-slate-300 md:grid-cols-3">
            {VISTAS.map((item) => {
              const activa = vista === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={activa}
                  onClick={() => setVista(item)}
                  className={`min-h-24 bg-white px-5 py-4 text-left transition-colors ${
                    activa
                      ? 'shadow-[inset_0_-3px_0_0_#1d4ed8]'
                      : 'hover:bg-slate-50'
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
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-institucional-600 focus:ring-2 focus:ring-institucional-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">
              {t.explorer.axisLabel}
            </span>
            <select
              value={eje}
              onChange={(event) => setEje(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-institucional-600 focus:ring-2 focus:ring-institucional-100"
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
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-institucional-600 focus:ring-2 focus:ring-institucional-100"
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
        <div className="divide-y divide-slate-300 border-b border-slate-300">
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

  return (
    <article
      id={intervencion.id}
      className="scroll-mt-24 py-9 first:pt-8"
      aria-labelledby={`${intervencion.id}-titulo`}
    >
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-institucional-700">
              {t.explorer.axis} {resultado.eje.numero}
            </span>
            <span className="text-slate-400">/</span>
            <span className="font-mono text-slate-500">{intervencion.id}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500">
              {t.explorer.planPage} {intervencion.paginaPlan}
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t.explorer.officialWording}
          </p>
          <h3
            id={`${intervencion.id}-titulo`}
            lang="es"
            className="mt-2 max-w-4xl text-xl font-bold leading-snug text-slate-900 sm:text-2xl"
          >
            {intervencion.intervencionEstrategicaFuenteEs}
          </h3>
          <p lang="es" className="mt-3 max-w-4xl leading-relaxed text-slate-700">
            {intervencion.objetivoFuenteEs}
          </p>
        </div>

        <aside className="border-l-2 border-slate-200 pl-5 text-sm">
          <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass[cross.estado]}`}
            >
              {t.crossLabels[cross.estado]}
            </span>
            <span className="inline-flex rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
              {t.executionLabels[intervencion.estadoEjecucion]}
            </span>
          </div>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-xs font-semibold text-slate-500">
                {t.explorer.responsible}
              </dt>
              <dd className="mt-1 text-slate-800">{intervencion.responsableOficial}</dd>
            </div>
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
        </aside>
      </div>

      <div className="mt-7 grid gap-6 border-t border-slate-200 pt-6 md:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t.explorer.expectedResult}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {resultado.resultadoEsperado[locale]}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t.explorer.crosswalk}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {cross.fundamento[locale]}
          </p>
        </div>
      </div>

      {cross.intervencionCanonicaId && (
        <p className="mt-5 text-sm text-violet-800">
          {t.explorer.canonicalReference}:{' '}
          <a
            href={`#${cross.intervencionCanonicaId}`}
            className="font-semibold underline decoration-violet-300 underline-offset-2"
          >
            {cross.intervencionCanonicaId}
          </a>
        </p>
      )}

      {cross.proyectoIds.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t.explorer.relatedCatalog}
          </h4>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
            {cross.proyectoIds.map((proyectoId) => {
              const proyecto = projectMap.get(proyectoId);
              return (
                <Link
                  key={proyectoId}
                  href={`/${locale}/proyectos/${proyectoId}`}
                  className="text-sm font-semibold text-institucional-700 hover:underline"
                >
                  {proyecto?.titulo[locale] ?? proyectoId}{' '}
                  <span aria-hidden>→</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {(intervencion.evidenciasExternas ?? []).length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t.explorer.evidence}
          </h4>
          <ul className="mt-2 space-y-2">
            {intervencion.evidenciasExternas!.map((fuente) => (
              <li key={fuente.id} className="text-sm leading-relaxed text-slate-700">
                <a
                  href={fuente.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-institucional-700 hover:underline"
                >
                  {fuente.titulo[locale]}
                </a>{' '}
                <span className="text-slate-500">— {fuente.publicador}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {intervencion.notasEditoriales && (
        <div className="mt-6 border-l-2 border-amber-400 pl-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            {t.explorer.editorialNote}
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            {intervencion.notasEditoriales[locale]}
          </p>
        </div>
      )}

      <details className="group mt-6 border-t border-slate-200 pt-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-institucional-700 marker:hidden">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="text-slate-400 transition-transform group-open:rotate-90"
            >
              ▸
            </span>
            {t.explorer.indicators} ({intervencion.indicadores.length})
          </span>
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-y border-slate-200 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">{t.explorer.indicators}</th>
                <th className="px-3 py-2 font-semibold">{t.explorer.baseline}</th>
                <th className="px-3 py-2 font-semibold">{t.explorer.target}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200" lang="es">
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
    </article>
  );
}
