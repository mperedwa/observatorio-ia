import { proyectos } from '@/data/proyectos';
import { instituciones } from '@/data/instituciones';
import { AssetFrame, type AssetSize } from './AssetFrame';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { CAPAS_CATALOGO, resumirInstitucionCatalogo, type CapaCatalogo } from '@/data/presentacion-catalogo';
import { applyCounters } from '@/i18n/applyCounters';
import { COUNTERS } from '@/data/counters';

const capaColor: Record<CapaCatalogo, { text: string; border: string }> = {
  verificado: { text: '#166534', border: '#16a34a' },
  seguimiento: { text: '#92400e', border: '#d97706' },
  ecosistema: { text: '#1e40af', border: '#2563eb' },
};

export function AssetMapa({
  locale,
  t,
  size,
}: {
  locale: Locale;
  t: Dictionary;
  size: AssetSize;
}) {
  const grupos = instituciones
    .map((inst) => ({
      inst,
      proyectos: proyectos.filter((p) => p.institucionId === inst.id),
    }))
    .filter((g) => g.proyectos.length > 0)
    .sort((a, b) => b.proyectos.length - a.proyectos.length);

  return (
    <AssetFrame size={size} locale={locale} variant="light">
      <div className="flex-1 flex flex-col p-14 pb-20">
        <p
          className="font-semibold uppercase tracking-widest text-institucional-700"
          style={{ fontSize: 22 }}
        >
          {t.panorama.kicker}
        </p>
        <h1
          className="mt-4 font-editorial font-semibold leading-[1.02] text-editorial-ink"
          style={{ fontSize: 44, maxWidth: 940 }}
        >
          {applyCounters(t.comparte.assets.mapaTitulo, COUNTERS)}
        </h1>

        <div className="mt-10 grid flex-1 grid-cols-2 content-start border-y border-editorial-rule">
          {grupos.map(({ inst, proyectos: ps }) => {
            const resumen = resumirInstitucionCatalogo(ps);
            return (
              <article
                key={inst.id}
                className="border-b border-editorial-rule p-5 odd:border-r odd:border-editorial-rule"
              >
                <header className="flex items-baseline justify-between gap-4">
                  <span className="font-bold text-slate-900" style={{ fontSize: 22 }}>
                    {inst.nombreCorto[locale]}
                  </span>
                  <span className="text-slate-500 tabular-nums" style={{ fontSize: 16 }}>
                    {resumen.total} {resumen.total === 1 ? t.panorama.proyectoLabel : t.instituciones.proyectosLabel}
                  </span>
                </header>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {CAPAS_CATALOGO.map((capa) => (
                    <div
                      key={capa}
                      className="border-l-4 px-3 py-1"
                      style={{
                        borderColor: capaColor[capa].border,
                        color: capaColor[capa].text,
                      }}
                    >
                      <div className="font-bold tabular-nums" style={{ fontSize: 24 }}>
                        {resumen[capa]}
                      </div>
                      <div className="font-semibold" style={{ fontSize: 12, lineHeight: 1.2 }}>
                        {t.catalogo.capas[capa].corto}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-6 text-slate-600" style={{ fontSize: 16 }}>
          {CAPAS_CATALOGO.map((capa) => (
            <span key={capa} className="flex items-center gap-2">
              <span className="h-4 w-1" style={{ background: capaColor[capa].border }} />
              {t.catalogo.capas[capa].corto}
            </span>
          ))}
        </div>
      </div>
    </AssetFrame>
  );
}
