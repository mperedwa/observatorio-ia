import { proyectos } from '@/data/proyectos';
import { instituciones } from '@/data/instituciones';
import { AssetFrame, type AssetSize } from './AssetFrame';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { CAPAS_CATALOGO, resumirInstitucionCatalogo, type CapaCatalogo } from '@/data/presentacion-catalogo';
import { applyCounters } from '@/i18n/applyCounters';
import { COUNTERS } from '@/data/counters';

const capaColor: Record<CapaCatalogo, { bg: string; text: string; border: string }> = {
  verificado: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  seguimiento: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  ecosistema: { bg: '#e0f2fe', text: '#075985', border: '#7dd3fc' },
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
          className="mt-4 font-bold text-slate-900 leading-tight"
          style={{ fontSize: 44, maxWidth: 940 }}
        >
          {applyCounters(t.comparte.assets.mapaTitulo, COUNTERS)}
        </h1>

        <div className="mt-10 grid grid-cols-2 gap-4 flex-1 content-start">
          {grupos.map(({ inst, proyectos: ps }) => {
            const resumen = resumirInstitucionCatalogo(ps);
            return (
              <article
                key={inst.id}
                className="bg-white border-2 border-slate-200 rounded-xl p-5"
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
                      className="rounded-lg border-2 px-3 py-2"
                      style={{
                        background: capaColor[capa].bg,
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
              <span
                className="w-4 h-4 rounded"
                style={{ background: capaColor[capa].bg, border: `2px solid ${capaColor[capa].border}` }}
              />
              {t.catalogo.capas[capa].corto}
            </span>
          ))}
        </div>
      </div>
    </AssetFrame>
  );
}
