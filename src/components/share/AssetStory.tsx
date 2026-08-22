import { AssetFrame, type AssetSize } from './AssetFrame';
import { COUNTERS } from '@/data/counters';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { comparativaRegional } from '@/data/indicadores';

export type StoryVariant = 'timeline' | 'brecha';

export function AssetStory({
  locale,
  t,
  size,
  variant,
}: {
  locale: Locale;
  t: Dictionary;
  size: AssetSize;
  variant: StoryVariant;
}) {
  const chile = comparativaRegional.find((p) => p.pais.es === 'Chile')?.ilia ?? 0;
  const costaRica = comparativaRegional.find((p) => p.destacado)?.ilia ?? 0;
  const roundedGap = Math.round(chile - costaRica);

  if (variant === 'brecha') {
    return (
      <AssetFrame size={size} locale={locale} variant="dark">
        <div className="flex-1 flex flex-col justify-center items-start px-16 py-24">
          <p
            className="font-semibold uppercase tracking-widest text-institucional-300"
            style={{ fontSize: 24 }}
          >
            {locale === 'es' ? 'ILIA 2025' : 'ILIA 2025'}
          </p>
          <h1
            aria-label={
              locale === 'es'
                ? `${roundedGap} puntos abajo de Chile`
                : `${roundedGap} points behind Chile`
            }
            className="mt-8 font-bold text-white leading-none tabular-nums"
            style={{ fontSize: 240 }}
          >
            -{roundedGap}
          </h1>
          <p className="mt-6 font-semibold text-slate-200" style={{ fontSize: 36 }}>
            {locale === 'es' ? 'puntos abajo de Chile' : 'points behind Chile'}
          </p>
          <p
            className="mt-12 text-slate-300"
            style={{ fontSize: 28, lineHeight: 1.4, maxWidth: 880 }}
          >
            {locale === 'es'
              ? 'Costa Rica obtuvo 53.83/100 en el Índice Latinoamericano de IA 2025. Chile lidera con 70.56.'
              : 'Costa Rica scored 53.83/100 in the 2025 Latin American AI Index. Chile leads with 70.56.'}
          </p>
        </div>
      </AssetFrame>
    );
  }

  // timeline story
  return (
    <AssetFrame size={size} locale={locale} variant="gradient">
      <div className="flex-1 flex flex-col justify-center px-16 py-24">
        <p
          className="font-semibold uppercase tracking-widest text-institucional-700"
          style={{ fontSize: 24 }}
        >
          {t.timeline.kicker}
        </p>
        <h1
          aria-label={
            locale === 'es'
              ? `${COUNTERS.adopcionVerificada} adopciones de IA verificadas`
              : `${COUNTERS.adopcionVerificada} verified AI adoptions`
          }
          className="mt-8 font-bold text-institucional-900 leading-none tabular-nums"
          style={{ fontSize: 280 }}
        >
          {COUNTERS.adopcionVerificada}
        </h1>
        <p className="mt-6 font-editorial font-semibold text-editorial-ink" style={{ fontSize: 48, lineHeight: 1.15 }}>
          {locale === 'es'
            ? 'adopciones de IA verificadas'
            : 'verified AI adoptions'}
        </p>
        <p
          className="mt-10 text-slate-600"
          style={{ fontSize: 28, lineHeight: 1.4, maxWidth: 880 }}
        >
          {locale === 'es'
            ? `${COUNTERS.iniciativasDocumentadas} iniciativas siguen visibles: ${COUNTERS.seguimiento} en seguimiento y ${COUNTERS.ecosistema} de ecosistema y capacidades.`
            : `${COUNTERS.iniciativasDocumentadas} initiatives remain visible: ${COUNTERS.seguimiento} under review and ${COUNTERS.ecosistema} in ecosystem and capabilities.`}
        </p>
      </div>
    </AssetFrame>
  );
}
