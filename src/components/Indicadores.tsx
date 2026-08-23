import { ilia2025, dgi2025, ourdata2025 } from '@/data/indicadores';
import { ChartILIATabs } from './ChartILIATabs';
import { IndicadorOecd } from './IndicadorOecd';
import { EncabezadoSeccionExpediente } from './ExpedienteEditorial';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function Indicadores({
  locale,
  t,
  headingLevel = 'h2',
}: {
  locale: Locale;
  t: Dictionary;
  headingLevel?: 'h1' | 'h2';
}) {
  const Heading = headingLevel;
  const chile = ilia2025.find((p) => p.pais.es === 'Chile')?.ilia ?? 0;
  const cr = ilia2025.find((p) => p.destacado)?.ilia ?? 0;
  const brecha = (chile - cr).toFixed(2);

  return (
    <section
      id="indicadores"
      className={`max-w-7xl mx-auto px-6 ${headingLevel === 'h1' ? 'pb-24 pt-10' : 'py-20'}`}
    >
      <header className="border-b border-editorial-rule pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">
          {t.indicadores.kicker}
        </p>
        <Heading className="mt-3 max-w-4xl font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
          {t.indicadores.titulo}
        </Heading>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-editorial-muted text-pretty">
          {t.indicadores.sub}
        </p>
      </header>

      <div>
        <section className="border-b border-editorial-rule py-12 sm:py-16">
          <EncabezadoSeccionExpediente index="01" title={t.indicadores.cardTitulo} />
          <p className="mt-3 pl-0 text-xs text-slate-500 sm:pl-[4.5rem]">
            {t.indicadores.fuente}
          </p>
          <div className="mt-8 sm:pl-[4.5rem]">
            <ChartILIATabs locale={locale} t={t} />
            <p className="mt-7 max-w-3xl text-sm leading-relaxed text-editorial-muted">
              {t.indicadores.brechaPre}{' '}
              <span className="font-semibold text-editorial-ink">
                {brecha} {t.indicadores.brechaPuntos}
              </span>
              .
            </p>
            <aside className="mt-4 max-w-3xl border-l-2 border-editorial-accent pl-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-editorial-accent">
                {t.indicadores.lecturaObservatorioLabel}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                {t.indicadores.brechaPost}
              </p>
            </aside>
          </div>
        </section>

        <IndicadorOecd
          index="02"
          data={dgi2025}
          locale={locale}
          copy={t.indicadorDgi}
        />
        <IndicadorOecd
          index="03"
          data={ourdata2025}
          locale={locale}
          copy={t.indicadorOurdata}
        />
      </div>
    </section>
  );
}
