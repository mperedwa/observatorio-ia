import { proyectos, type Estado } from '@/data/proyectos';
import { instituciones } from '@/data/instituciones';
import { AssetFrame, type AssetSize } from './AssetFrame';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

const estadoColor: Record<Estado, { bg: string; text: string; border: string }> = {
  operativo: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  piloto: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  planificado: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
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
      <div className="flex-1 flex flex-col p-16">
        <p
          className="font-semibold uppercase tracking-widest text-institucional-700"
          style={{ fontSize: 22 }}
        >
          {t.panorama.kicker}
        </p>
        <h1
          className="mt-4 font-bold text-slate-900 leading-tight"
          style={{ fontSize: 48, maxWidth: 940 }}
        >
          {t.comparte.assets.mapaTitulo}
        </h1>

        <div className="mt-12 grid grid-cols-2 gap-5 flex-1">
          {grupos.map(({ inst, proyectos: ps }) => (
            <article
              key={inst.id}
              className="bg-white border-2 border-slate-200 rounded-xl p-5 flex flex-col"
            >
              <header className="flex items-baseline justify-between mb-4">
                <span className="font-bold text-slate-900" style={{ fontSize: 22 }}>
                  {inst.nombreCorto[locale]}
                </span>
                <span className="text-slate-500 tabular-nums" style={{ fontSize: 16 }}>
                  {ps.length} {ps.length === 1 ? t.panorama.proyectoLabel : t.instituciones.proyectosLabel}
                </span>
              </header>
              <div className="grid grid-cols-2 gap-2 flex-1 content-start">
                {ps.map((p) => {
                  const c = estadoColor[p.estado];
                  return (
                    <div
                      key={p.id}
                      className="rounded-lg border-2 p-2.5"
                      style={{
                        background: c.bg,
                        borderColor: c.border,
                        color: c.text,
                        fontSize: 13,
                        lineHeight: 1.25,
                        fontWeight: 600,
                      }}
                    >
                      {p.titulo[locale]}
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-6 text-slate-600" style={{ fontSize: 16 }}>
          <span className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded"
              style={{ background: estadoColor.operativo.bg, border: `2px solid ${estadoColor.operativo.border}` }}
            />
            {t.estado.operativo}
          </span>
          <span className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded"
              style={{ background: estadoColor.piloto.bg, border: `2px solid ${estadoColor.piloto.border}` }}
            />
            {t.estado.piloto}
          </span>
          <span className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded"
              style={{ background: estadoColor.planificado.bg, border: `2px solid ${estadoColor.planificado.border}` }}
            />
            {t.estado.planificado}
          </span>
        </div>
      </div>
    </AssetFrame>
  );
}
