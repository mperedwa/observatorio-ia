import { ilia2025 } from '@/data/indicadores';

export function Indicadores() {
  const max = Math.max(...ilia2025.map((p) => p.ilia));
  return (
    <section id="indicadores" className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          03 / Indicadores
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
          Costa Rica en el contexto regional
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Posición en el Índice Latinoamericano de IA (ILIA), publicado anualmente por CEPAL. Datos 2025.
        </p>
      </header>

      <div className="border border-slate-200 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">ILIA 2025 / 100 puntos</h3>
          <span className="text-xs text-slate-500">Fuente: CEPAL</span>
        </div>
        <div className="space-y-4">
          {ilia2025.map((p) => (
            <div key={p.pais}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span
                  className={`text-sm ${p.destacado ? 'font-bold text-institucional-900' : 'text-slate-700'}`}
                >
                  {p.pais}
                </span>
                <span
                  className={`text-sm tabular-nums ${
                    p.destacado ? 'font-bold text-institucional-900' : 'text-slate-700'
                  }`}
                >
                  {p.ilia.toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    p.destacado ? 'bg-institucional-700' : 'bg-slate-400'
                  }`}
                  style={{ width: `${(p.ilia / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-600">
          La brecha de Costa Rica con Chile (líder regional) es de{' '}
          <span className="font-semibold text-slate-900">19.24 puntos</span>. Cerrar la brecha
          requiere implementación de la ENIA con metas medibles, presupuesto asignado y un marco
          regulatorio aprobado.
        </p>
      </div>
    </section>
  );
}
