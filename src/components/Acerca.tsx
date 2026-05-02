export function Acerca() {
  return (
    <section id="acerca" className="max-w-7xl mx-auto px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          05 / Acerca de
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
          Una iniciativa independiente para mapear la adopción de IA en el Estado
        </h2>
        <div className="mt-6 space-y-4 text-slate-700 text-pretty">
          <p>
            El Observatorio IA Costa Rica nace para llenar un vacío: no existe una fuente pública,
            actualizada y verificable sobre dónde, cómo y con qué resultados se está adoptando
            inteligencia artificial en el sector público costarricense.
          </p>
          <p>
            Este sitio recopila proyectos en operación, expedientes de ley en trámite e indicadores
            comparados con la región. Toda la información proviene de fuentes oficiales y se cita
            con enlace al documento original.
          </p>
          <p>
            La meta es construir una herramienta útil para tomadores de decisión, prensa,
            academia, sector privado y ciudadanía interesada en cómo se usa la IA con fondos
            públicos.
          </p>
        </div>
        <div className="mt-8 inline-block border-l-4 border-institucional-700 pl-4 py-1">
          <p className="text-sm text-slate-600">
            ¿Conoce un proyecto de IA en una institución pública que no aparece aquí?
          </p>
          <a
            href="mailto:hola@observatorioia.org"
            className="mt-1 inline-block text-institucional-700 font-medium hover:underline"
          >
            hola@observatorioia.org →
          </a>
        </div>
      </div>
    </section>
  );
}
