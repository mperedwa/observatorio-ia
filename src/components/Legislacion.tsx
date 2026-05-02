import { expedientes } from '@/data/legislacion';

const estadoStyle: Record<string, { label: string; cls: string }> = {
  'en-comision': { label: 'En comisión', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  'primer-debate': { label: 'Primer debate', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
  'segundo-debate': { label: 'Segundo debate', cls: 'bg-purple-50 text-purple-800 border-purple-200' },
  archivado: { label: 'Archivado', cls: 'bg-slate-100 text-slate-700 border-slate-300' },
  aprobada: { label: 'Aprobada', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
};

export function Legislacion() {
  return (
    <section id="legislacion" className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            02 / Legislación
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Tres expedientes de ley en trámite, ninguno aprobado
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Costa Rica aún no tiene un marco regulatorio formal de IA. Los tres proyectos de ley
            presentados desde 2023 siguen en comisión.
          </p>
        </header>
        <div className="space-y-4">
          {expedientes.map((e) => {
            const st = estadoStyle[e.estado];
            return (
              <article
                key={e.numero}
                className="bg-white border border-slate-200 rounded-lg p-6 grid sm:grid-cols-[140px_1fr] gap-4 sm:gap-6"
              >
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Expediente</div>
                  <div className="text-2xl font-bold text-institucional-900 tabular-nums">{e.numero}</div>
                  <div className="mt-3">
                    <span className={`inline-block text-xs px-2 py-1 rounded border ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{e.titulo}</h3>
                  <p className="mt-2 text-sm text-slate-600 text-pretty">{e.resumen}</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                    <span>
                      Comisión: <span className="text-slate-700">{e.comision}</span>
                    </span>
                    <span>
                      Presentado: <span className="text-slate-700">{e.presentado}</span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
