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
import { capaMarker } from './catalogoStyles';

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
      <div
        id="catalogo-capas"
        className="mt-10 grid border-y border-editorial-rule lg:grid-cols-3"
        aria-label={t.catalogo.kicker}
      >
        {CAPAS_CATALOGO.map((capa, index) => {
          const activa = vista === capa;
          return (
            <button
              key={capa}
              type="button"
              onClick={() => setVista(capa)}
              aria-pressed={activa}
              aria-controls="catalogo-resultados"
              className={`border-b border-editorial-rule px-5 py-4 text-left transition-colors duration-150 sm:py-6 lg:border-b-0 ${
                index < CAPAS_CATALOGO.length - 1 ? 'lg:border-r' : ''
              } ${
                activa
                  ? 'border-l-4 border-l-editorial-ink bg-editorial-paper/70 lg:border-l-0 lg:border-t-4 lg:border-t-editorial-ink'
                  : 'border-l-4 border-l-transparent bg-white hover:bg-slate-50 lg:border-l-0 lg:border-t-4 lg:border-t-transparent'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
                  <span className={`h-3 w-1 ${capaMarker[capa]}`} aria-hidden />
                  {t.catalogo.capas[capa].corto}
                </span>
                <span className="font-editorial text-4xl font-semibold tabular-nums text-editorial-ink">
                  {conteos[capa]}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-editorial-ink">
                {t.catalogo.capas[capa].titulo}
              </h2>
              <p className="mt-2 hidden text-sm leading-relaxed text-editorial-muted sm:block">
                {t.catalogo.capas[capa].descripcion}
              </p>
              <p className="mt-3 hidden text-xs leading-relaxed text-slate-500 sm:block">
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

      <section
        id="catalogo-resultados"
        className="mt-10"
        aria-labelledby="catalogo-resultados-titulo"
      >
        <div className="border-y border-editorial-rule py-5">
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
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                  placeholder={t.catalogo.buscarPlaceholder}
                  className="w-full rounded-editorial border border-slate-400 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-institucional-700"
                />
              </span>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t.catalogo.institucionFiltroLabel}
              <select
                value={institucionId}
                onChange={(event) => setInstitucionId(event.target.value)}
                className="mt-2 w-full rounded-editorial border border-slate-400 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-institucional-700"
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
            <h2 id="catalogo-resultados-titulo" className="mt-1 font-editorial text-3xl font-semibold text-editorial-ink" aria-live="polite">
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
          <div className="border-t border-editorial-rule">
            {iniciativas.map((proyecto, index) => (
              <ProyectoCard
                key={proyecto.id}
                proyecto={proyecto}
                locale={locale}
                t={t}
                variant="register"
                registryIndex={index + 1}
                showInstitution
              />
            ))}
          </div>
        ) : (
          <div className="border-y border-dashed border-slate-400 bg-slate-50 px-6 py-12 text-center">
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
