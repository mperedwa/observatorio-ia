import { proyectos, type Proyecto } from '@/data/proyectos';
import { instituciones } from '@/data/instituciones';
import { AssetFrame, type AssetSize } from './AssetFrame';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { esAdopcionVerificada } from '@/data/modelo-evidencia';
import { obtenerAnioReferencia } from '@/data/presentacion-catalogo';

const timelineColor = { dot: '#1d4ed8', text: '#334155' };

export function AssetTimeline({
  locale,
  t,
  size,
}: {
  locale: Locale;
  t: Dictionary;
  size: AssetSize;
}) {
  const datados: Array<{ proyecto: Proyecto; year: number }> = proyectos.flatMap((proyecto) => {
    if (!esAdopcionVerificada(proyecto)) return [];
    const year = obtenerAnioReferencia(proyecto);
    return year === null ? [] : [{ proyecto, year }];
  });
  const minYear = Math.min(...datados.map((item) => item.year));
  const maxYear = Math.max(...datados.map((item) => item.year));
  const range = maxYear - minYear || 1;
  const allYears = Array.from({ length: range + 1 }, (_, i) => minYear + i);

  const porInstitucion = instituciones
    .map((inst) => ({
      inst,
      proyectos: datados
        .filter((item) => item.proyecto.institucionId === inst.id)
        .sort((a, b) => a.year - b.year),
    }))
    .filter((row) => row.proyectos.length > 0);

  return (
    <AssetFrame size={size} locale={locale} variant="light">
      <div className="flex flex-1 flex-col justify-center p-16 pb-24">
        <p
          className="font-semibold uppercase tracking-widest text-institucional-700"
          style={{ fontSize: 22 }}
        >
          {t.timeline.kicker}
        </p>
        <h1
          className="mt-4 font-editorial font-semibold leading-[1.02] text-editorial-ink"
          style={{ fontSize: 48, maxWidth: 940 }}
        >
          {t.comparte.assets.timelineTitulo}
        </h1>

        <div className="mt-12 flex flex-col">
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
              const color = timelineColor;
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
                    {ps.map(({ proyecto, year }) => {
                      const x = ((year - minYear) / range) * 100;
                      return (
                        <div
                          key={proyecto.id}
                          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${x}%` }}
                        >
                          <span
                            className="block"
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
            ? `${datados.length} sistemas o componentes de IA con ejecución verificada en piloto u operación.`
            : `${datados.length} AI systems or components with verified pilot or operational execution.`}
        </p>
      </div>
    </AssetFrame>
  );
}
