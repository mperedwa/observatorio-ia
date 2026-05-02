import { instituciones } from '@/data/instituciones';
import { proyectos } from '@/data/proyectos';

const tipoLabel: Record<string, string> = {
  ministerio: 'Ministerio',
  judicial: 'Poder Judicial',
  autonoma: 'Institución autónoma',
  asamblea: 'Asamblea Legislativa',
  universidad: 'Universidad',
  camara: 'Cámara',
};

export function InstitucionesGrid() {
  return (
    <section id="instituciones" className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          01 / Instituciones
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
          Quién está adoptando IA en el Estado
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Cinco instituciones públicas tienen al menos un proyecto de IA en operación o piloto activo.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {instituciones.map((inst) => {
          const proyectosInst = proyectos.filter((p) => p.institucionId === inst.id);
          return (
            <article
              key={inst.id}
              className="border border-slate-200 rounded-lg p-6 bg-white hover:border-institucional-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{tipoLabel[inst.tipo]}</p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">{inst.nombreCorto}</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-institucional-900 tabular-nums">{inst.proyectosActivos}</div>
                  <div className="text-xs text-slate-500">proyectos</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-5 text-pretty">{inst.resumen}</p>
              <ul className="space-y-1.5">
                {proyectosInst.map((p) => (
                  <li key={p.id} className="text-xs text-slate-700 flex gap-2">
                    <span
                      className={`mt-1 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        p.estado === 'operativo'
                          ? 'bg-emerald-500'
                          : p.estado === 'piloto'
                            ? 'bg-amber-500'
                            : 'bg-slate-300'
                      }`}
                      aria-hidden
                    />
                    <span className="leading-snug">{p.titulo}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
