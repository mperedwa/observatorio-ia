import { AssetFrame, type AssetSize } from './AssetFrame';
import { kpisHero } from '@/data/indicadores';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

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
          <p
            className="mt-8 font-bold text-white leading-none tabular-nums"
            style={{ fontSize: 240 }}
          >
            -17
          </p>
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
  const kpi = kpisHero[0];
  return (
    <AssetFrame size={size} locale={locale} variant="gradient">
      <div className="flex-1 flex flex-col justify-center px-16 py-24">
        <p
          className="font-semibold uppercase tracking-widest text-institucional-700"
          style={{ fontSize: 24 }}
        >
          {t.timeline.kicker}
        </p>
        <p
          className="mt-8 font-bold text-institucional-900 leading-none tabular-nums"
          style={{ fontSize: 280 }}
        >
          {kpi.valor}
        </p>
        <p className="mt-6 font-bold text-slate-900" style={{ fontSize: 44, lineHeight: 1.2 }}>
          {locale === 'es'
            ? 'proyectos de IA en el Estado costarricense'
            : 'AI projects in the Costa Rican State'}
        </p>
        <p
          className="mt-10 text-slate-600"
          style={{ fontSize: 28, lineHeight: 1.4, maxWidth: 880 }}
        >
          {locale === 'es'
            ? 'Desde 2018 (ChatbotPJ) hasta 2026 (AIDA). 8 años de adopción documentada en una sola línea de tiempo.'
            : 'From 2018 (ChatbotPJ) to 2026 (AIDA). 8 years of documented adoption in a single timeline.'}
        </p>
      </div>
    </AssetFrame>
  );
}
