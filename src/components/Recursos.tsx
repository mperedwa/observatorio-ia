const recursos = [
  {
    titulo: 'Estrategia Nacional de IA (ENIA) 2024-2027',
    fuente: 'MICITT',
    url: 'https://www.micitt.go.cr/el-sector-informa/micitt-presento-estrategia-nacional-de-inteligencia-artificial-enia',
    tipo: 'Política pública',
  },
  {
    titulo: 'Lineamientos Básicos para el uso de IA Generativa en el Poder Judicial',
    fuente: 'Poder Judicial',
    url: 'https://pj.poder-judicial.go.cr/',
    tipo: 'Marco institucional',
  },
  {
    titulo: 'Reglamento de Protección de Datos del Poder Judicial',
    fuente: 'Poder Judicial',
    url: 'https://cij.poder-judicial.go.cr/images/ProteccionDatos/REGLAMENTO_PROTECCIN_DE_DATOS-PODER_JUDICIAL.pdf',
    tipo: 'Reglamento',
  },
  {
    titulo: 'Índice Latinoamericano de IA (ILIA)',
    fuente: 'CEPAL',
    url: 'https://www.indicelatam.cl/',
    tipo: 'Indicador regional',
  },
  {
    titulo: 'Government AI Readiness Index (GTMI)',
    fuente: 'Banco Mundial',
    url: 'https://www.worldbank.org/en/programs/govtech/gtmi',
    tipo: 'Indicador internacional',
  },
];

export function Recursos() {
  return (
    <section id="recursos" className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
            04 / Recursos
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Documentos y fuentes oficiales
          </h2>
        </header>
        <ul className="divide-y divide-slate-200 bg-white border border-slate-200 rounded-lg">
          {recursos.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{r.tipo}</p>
                    <p className="mt-1 font-medium text-slate-900">{r.titulo}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{r.fuente}</p>
                  </div>
                  <span className="text-institucional-700 text-sm whitespace-nowrap">↗ Abrir</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
