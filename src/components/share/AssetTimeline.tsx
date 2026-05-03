import { proyectos } from '@/data/proyectos';
import { instituciones } from '@/data/instituciones';
import { AssetFrame, type AssetSize } from './AssetFrame';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

const colorByInst: Record<string, { dot: string; text: string }> = {
  'poder-judicial': { dot: '#4f46e5', text: '#4338ca' },
  ccss: { dot: '#059669', text: '#047857' },
  hacienda: { dot: '#d97706', text: '#b45309' },
  mep: { dot: '#e11d48', text: '#be123c' },
  micitt: { dot: '#0284c7', text: '#0369a1' },
  cenat: { dot: '#7c3aed', text: '#6d28d9' },
};

export function AssetTimeline({
  locale,
  t,
  size,
}: {
  locale: Locale;
  t: Dictionary;
  size: AssetSize;
}) {
  const datados = proyectos.filter((p) => p.desde);
  const minYear = Math.min(...datados.map((p) => Number(p.desde)));
  const maxYear = Math.max(...datados.map((p) => Number(p.desde)));
  const range = maxYear - minYear || 1;
  const allYears = Array.from({ length: range + 1 }, (_, i) => minYear + i);

  const porInstitucion = instituciones
    .map((inst) => ({
      inst,
      proyectos: datados.filter((p) => p.institucionId === inst.id).sort((a, b) => Number(a.desde) - Number(b.desde)),
    }))
    .filter((row) => row.proyectos.length > 0);

  return (
    <AssetFrame size={size} locale={locale} variant="light">
      <div className="flex-1 flex flex-col p-16">
        <p
          className="font-semibold uppercase tracking-widest text-institucional-700"
          style={{ fontSize: 22 }}
        >
          {t.timeline.kicker}
        </p>
        <h1
          className="mt-4 font-bold text-slate-900 leading-tight"
          style={{ fontSize: 48, maxWidth: 940 }}
        >
          {t.comparte.assets.timelineTitulo}
        </h1>

        <div className="mt-12 flex-1 flex flex-col">
          {/* eje X */}
          <div className="grid items-end" style={{ gridTemplateColumns: '180px 1fr', gap: 24, height: 56 }}>
            <div />
            <div className="relative h-full">
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
              {allYears.map((y) => {
                const x = ((y - minYear) / range) * 100;
                return (
                  <div
                    key={y}
                    className="absolute top-0 -translate-x-1/2 font-semibold tabular-nums text-slate-500"
                    style={{ left: `${x}%`, fontSize: 18 }}
                  >
                    <div className="pb-1 text-center">{y}</div>
                    <div className="w-px h-3 bg-slate-300 mx-auto" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* filas */}
          <div className="mt-8 space-y-5">
            {porInstitucion.map(({ inst, proyectos: ps }) => {
              const color = colorByInst[inst.id];
              return (
                <div
                  key={inst.id}
                  className="grid items-center"
                  style={{ gridTemplateColumns: '180px 1fr', gap: 24 }}
                >
                  <div
                    className="font-semibold uppercase tracking-wide"
                    style={{ fontSize: 18, color: color.text }}
                  >
                    {inst.nombreCorto[locale]}
                  </div>
                  <div className="relative" style={{ height: 32 }}>
                    <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
                    {ps.map((p) => {
                      const x = ((Number(p.desde) - minYear) / range) * 100;
                      return (
                        <div
                          key={p.id}
                          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${x}%` }}
                        >
                          <span
                            className="block rounded-full"
                            style={{
                              width: 18,
                              height: 18,
                              background: color.dot,
                              boxShadow: '0 0 0 5px white',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-12 text-slate-600" style={{ fontSize: 20, maxWidth: 880 }}>
          {locale === 'es'
            ? `${datados.length} proyectos verificados en producción o piloto. Adopción concentrada en los últimos tres años, con el Poder Judicial liderando desde 2018.`
            : `${datados.length} verified projects in production or pilot. Adoption concentrated in the last three years, led by the Judicial Branch since 2018.`}
        </p>
      </div>
    </AssetFrame>
  );
}
