import { ilia2025, dgi2025, ourdata2025 } from '@/data/indicadores';
import { ChartILIATabs } from './ChartILIATabs';
import { IndicadorOecd } from './IndicadorOecd';
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
  const ItemHeading = headingLevel === 'h1' ? 'h2' : 'h3';
  const chile = ilia2025.find((p) => p.pais.es === 'Chile')?.ilia ?? 0;
  const cr = ilia2025.find((p) => p.destacado)?.ilia ?? 0;
  const brecha = (chile - cr).toFixed(2);

  return (
    <section
      id="indicadores"
      className={`max-w-7xl mx-auto px-6 ${headingLevel === 'h1' ? 'pb-20 pt-10' : 'py-20'}`}
    >
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          {t.indicadores.kicker}
        </p>
        <Heading className="mt-2 font-editorial text-4xl font-semibold leading-tight tracking-[-0.02em] text-editorial-ink text-balance sm:text-6xl">
          {t.indicadores.titulo}
        </Heading>
        <p className="mt-3 text-slate-600 max-w-2xl">{t.indicadores.sub}</p>
      </header>

      <div className="space-y-8">
        <div className="border border-slate-200 rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <ItemHeading className="text-lg font-semibold text-slate-900">
              {t.indicadores.cardTitulo}
            </ItemHeading>
            <span className="text-xs text-slate-500">{t.indicadores.fuente}</span>
          </div>
          <ChartILIATabs locale={locale} t={t} />
          <p className="mt-6 text-sm text-slate-600">
            {t.indicadores.brechaPre}{' '}
            <span className="font-semibold text-slate-900">
              {brecha} {t.indicadores.brechaPuntos}
            </span>
            . {t.indicadores.brechaPost}
          </p>
        </div>

        <IndicadorOecd
          data={dgi2025}
          locale={locale}
          copy={t.indicadorDgi}
          headingLevel={headingLevel === 'h1' ? 'h2' : 'h3'}
        />
        <IndicadorOecd
          data={ourdata2025}
          locale={locale}
          copy={t.indicadorOurdata}
          headingLevel={headingLevel === 'h1' ? 'h2' : 'h3'}
        />
      </div>
    </section>
  );
}
