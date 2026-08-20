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
      <div className="flex-1 flex flex-col p-12 pb-20">
        <div>
          <p
            className="font-semibold uppercase tracking-widest text-institucional-700"
            style={{ fontSize: 21 }}
          >
            {t.hero.kicker}
          </p>
          <h1
            className="mt-4 font-bold text-slate-900 leading-tight"
            style={{ fontSize: 50, maxWidth: 960 }}
          >
            {applyCounters(t.comparte.assets.kpiHeroTitulo, COUNTERS)}
          </h1>
          <p className="mt-5 text-slate-600" style={{ fontSize: 22, maxWidth: 920 }}>
            {locale === 'es'
              ? 'El catálogo separa lo comprobado de lo anunciado y del ecosistema.'
              : 'The catalog separates verified adoption from announcements and the ecosystem.'}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7">
          {resumen.map((k) => (
            <div
              key={k.label}
              className="border-l-4 border-institucional-700 pl-5"
            >
              <div
                className="font-bold text-institucional-900 tabular-nums leading-none"
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
