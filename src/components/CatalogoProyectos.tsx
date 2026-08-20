'use client';

import { useMemo, useState } from 'react';
import { instituciones } from '@/data/instituciones';
import { proyectos } from '@/data/proyectos';
import { COUNTERS } from '@/data/counters';
import {
  CAPAS_CATALOGO,
  normalizarBusqueda,
  obtenerCapaCatalogo,
  type CapaCatalogo,
} from '@/data/presentacion-catalogo';
import { esVisibleEnCatalogo } from '@/data/modelo-evidencia';
import { applyCounters } from '@/i18n/applyCounters';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { ProyectoCard } from './ProyectoCard';
import { capaCard, capaChip } from './catalogoStyles';

type VistaCatalogo = CapaCatalogo | 'todas';

const conteos: Record<CapaCatalogo, number> = {
  verificado: COUNTERS.adopcionVerificada,
  seguimiento: COUNTERS.seguimiento,
  ecosistema: COUNTERS.ecosistema,
};

export function CatalogoProyectos({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [vista, setVista] = useState<VistaCatalogo>('verificado');
  const [busqueda, setBusqueda] = useState('');
  const [institucionId, setInstitucionId] = useState('todas');

  const iniciativas = useMemo(() => {
    const termino = normalizarBusqueda(busqueda);
    return proyectos
      .filter(esVisibleEnCatalogo)
      .filter((proyecto) => vista === 'todas' || obtenerCapaCatalogo(proyecto) === vista)
      .filter(
        (proyecto) =>
          institucionId === 'todas' || proyecto.institucionId === institucionId,
      )
      .filter((proyecto) => {
        if (!termino) return true;
        const institucion = instituciones.find((item) => item.id === proyecto.institucionId);
        const texto = normalizarBusqueda(
          [
            proyecto.titulo[locale],
            proyecto.descripcion[locale],
            institucion?.nombre[locale] ?? '',
            institucion?.nombreCorto[locale] ?? '',
          ].join(' '),
        );
        return texto.includes(termino);
      })
      .sort((a, b) => a.titulo[locale].localeCompare(b.titulo[locale], locale));
  }, [busqueda, institucionId, locale, vista]);

  const filtrosActivos = busqueda !== '' || institucionId !== 'todas';
  const resultadosTexto = `${iniciativas.length} ${t.catalogo.resultadosLabel}`;

  function limpiarFiltros() {
    setBusqueda('');
    setInstitucionId('todas');
  }

  return (
    <>
      <div className="mt-10 grid gap-4 lg:grid-cols-3" aria-label={t.catalogo.kicker}>
        {CAPAS_CATALOGO.map((capa) => {
          const activa = vista === capa;
          return (
            <button
              key={capa}
              type="button"
              onClick={() => setVista(capa)}
              aria-pressed={activa}
              className={`rounded-xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-500 focus-visible:ring-offset-2 ${
                activa
                  ? `${capaCard[capa]} shadow-sm ring-2 ring-institucional-700 ring-offset-2`
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${capaChip[capa]}`}>
                  {t.catalogo.capas[capa].corto}
                </span>
                <span className="text-3xl font-bold tabular-nums text-slate-900">
                  {conteos[capa]}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {t.catalogo.capas[capa].titulo}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t.catalogo.capas[capa].descripcion}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {t.catalogo.capas[capa].criterio}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {applyCounters(t.catalogo.totalDocumentadas, COUNTERS)}
        </p>
        <button
          type="button"
          onClick={() => setVista(vista === 'todas' ? 'verificado' : 'todas')}
          className="text-sm font-semibold text-institucional-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-500"
        >
          {vista === 'todas'
            ? t.catalogo.capas.verificado.titulo
            : applyCounters(t.catalogo.verTodas, COUNTERS)}
        </button>
      </div>

      <section className="mt-10" aria-labelledby="catalogo-resultados">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              {t.catalogo.buscarLabel}
              <span className="relative mt-2 block">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                  placeholder={t.catalogo.buscarPlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-institucional-500 focus:ring-2 focus:ring-institucional-100"
                />
              </span>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t.catalogo.institucionFiltroLabel}
              <select
                value={institucionId}
                onChange={(event) => setInstitucionId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-institucional-500 focus:ring-2 focus:ring-institucional-100"
              >
                <option value="todas">{t.catalogo.todasInstituciones}</option>
                {instituciones.map((institucion) => (
                  <option key={institucion.id} value={institucion.id}>
                    {institucion.nombreCorto[locale]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mb-5 mt-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-institucional-700">
              {vista === 'todas' ? t.catalogo.kicker : t.catalogo.capas[vista].titulo}
            </p>
            <h2 id="catalogo-resultados" className="mt-1 text-2xl font-bold text-slate-900" aria-live="polite">
              {resultadosTexto}
            </h2>
          </div>
          {filtrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="text-sm font-medium text-institucional-700 hover:underline"
            >
              {t.catalogo.limpiarFiltros}
            </button>
          )}
        </div>

        {iniciativas.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {iniciativas.map((proyecto) => (
              <ProyectoCard
                key={proyecto.id}
                proyecto={proyecto}
                locale={locale}
                t={t}
                variant="full"
                showInstitution
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-sm text-slate-600">{t.catalogo.sinResultados}</p>
            <button
              type="button"
              onClick={limpiarFiltros}
              className="mt-4 text-sm font-semibold text-institucional-700 hover:underline"
            >
              {t.catalogo.limpiarFiltros}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
