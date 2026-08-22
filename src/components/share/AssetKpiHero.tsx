import { kpisHero } from '@/data/indicadores';
import { AssetFrame, type AssetSize } from './AssetFrame';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { applyCounters } from '@/i18n/applyCounters';
import { COUNTERS } from '@/data/counters';

export function AssetKpiHero({
  locale,
  t,
  size,
}: {
  locale: Locale;
  t: Dictionary;
  size: AssetSize;
}) {
  const resumen = [
    {
      valor: String(COUNTERS.adopcionVerificada),
      label: t.catalogo.capas.verificado.titulo,
      detalle: t.catalogo.capas.verificado.descripcion,
    },
    {
      valor: String(COUNTERS.seguimiento),
      label: t.catalogo.capas.seguimiento.titulo,
      detalle: t.catalogo.capas.seguimiento.descripcion,
    },
    {
      valor: String(COUNTERS.ecosistema),
      label: t.catalogo.capas.ecosistema.titulo,
      detalle: t.catalogo.capas.ecosistema.descripcion,
    },
    {
      valor: String(COUNTERS.iniciativasDocumentadas),
      label: kpisHero[0].label[locale],
      detalle: kpisHero[0].detalle[locale],
    },
  ];

  return (
    <AssetFrame size={size} locale={locale} variant="gradient">
      <div className="flex flex-1 flex-col justify-center p-14 pb-24 pt-16">
        <div>
          <p
            className="font-semibold uppercase tracking-widest text-institucional-700"
            style={{ fontSize: 21 }}
          >
            {t.hero.kicker}
          </p>
          <h1
            className="mt-4 font-editorial font-semibold leading-[1.02] text-editorial-ink"
            style={{ fontSize: 54, maxWidth: 960 }}
          >
            {applyCounters(t.comparte.assets.kpiHeroTitulo, COUNTERS)}
          </h1>
          <p className="mt-5 text-slate-600" style={{ fontSize: 22, maxWidth: 920 }}>
            {locale === 'es'
              ? 'El catálogo separa lo comprobado de lo anunciado y del ecosistema.'
              : 'The catalog separates verified adoption from announcements and the ecosystem.'}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 border-y border-editorial-rule">
          {resumen.map((k, index) => (
            <div
              key={k.label}
              className={`px-5 py-6 ${index % 2 === 0 ? 'border-r border-editorial-rule pl-0' : ''} ${index < 2 ? 'border-b border-editorial-rule' : ''}`}
            >
              <div
                className="font-editorial font-semibold leading-none tabular-nums text-institucional-900"
                style={{ fontSize: 68 }}
              >
                {k.valor}
              </div>
              <div
                className="mt-3 font-medium text-slate-900"
                style={{ fontSize: 19, lineHeight: 1.2 }}
              >
                {k.label}
              </div>
              <div className="mt-1 text-slate-500" style={{ fontSize: 15, lineHeight: 1.3 }}>
                {k.detalle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AssetFrame>
  );
}
