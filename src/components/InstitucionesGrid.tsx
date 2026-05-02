import Link from 'next/link';
import { instituciones } from '@/data/instituciones';
import { proyectos } from '@/data/proyectos';
import { ProyectoCard } from './ProyectoCard';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function InstitucionesGrid({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section id="instituciones" className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          {t.instituciones.kicker}
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
          {t.instituciones.titulo}
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl">{t.instituciones.sub}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {instituciones.map((inst) => {
          const proyectosInst = proyectos.filter((p) => p.institucionId === inst.id);
          return (
            <article
              key={inst.id}
              className="border border-slate-200 rounded-lg p-6 bg-white hover:border-institucional-700 transition-colors flex flex-col"
            >
              <Link
                href={`/${locale}/instituciones/${inst.id}`}
                className="flex items-start justify-between gap-4 mb-4 group"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {t.instituciones.tipoLabel[inst.tipo]}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900 group-hover:text-institucional-700 transition-colors">
                    {inst.nombreCorto[locale]}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-institucional-900 tabular-nums">
                    {inst.proyectosActivos}
                  </div>
                  <div className="text-xs text-slate-500">{t.instituciones.proyectosLabel}</div>
                </div>
              </Link>
              <p className="text-sm text-slate-600 mb-5 text-pretty">{inst.resumen[locale]}</p>
              <ul className="space-y-1.5 mb-4">
                {proyectosInst.map((p) => (
                  <li key={p.id}>
                    <ProyectoCard proyecto={p} locale={locale} t={t} variant="compact" />
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/instituciones/${inst.id}`}
                className="mt-auto text-xs text-institucional-700 hover:underline self-start"
              >
                {t.instituciones.verDetalle} →
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
