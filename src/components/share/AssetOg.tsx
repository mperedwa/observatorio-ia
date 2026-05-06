import { AssetFrame, type AssetSize } from './AssetFrame';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { COUNTERS } from '@/data/counters';

export type OgVariant = 'home' | 'analisis' | 'brechas';

export function AssetOg({
  locale,
  t,
  size,
  variant,
}: {
  locale: Locale;
  t: Dictionary;
  size: AssetSize;
  variant: OgVariant;
}) {
  const content =
    variant === 'home'
      ? {
          kicker: t.hero.kicker,
          title:
            locale === 'es'
              ? `${COUNTERS.proyectos} proyectos de IA activos en el sector público costarricense`
              : `${COUNTERS.proyectos} active AI projects in Costa Rica\u2019s public sector`,
          sub:
            locale === 'es'
              ? 'Mapa público abierto de instituciones, proyectos, leyes e indicadores.'
              : 'Open public map of institutions, projects, laws and indicators.',
        }
      : variant === 'analisis'
        ? {
            kicker: t.analisis.kicker,
            title: t.analisis.titulo,
            sub: t.analisis.sub,
          }
        : {
            kicker: locale === 'es' ? 'Brechas estructurales' : 'Structural gaps',
            title:
              locale === 'es'
                ? '7 capacidades que Costa Rica aún no tiene operativas'
                : '7 capabilities Costa Rica has not yet built',
            sub:
              locale === 'es'
                ? 'Comparativa con Estonia (1.3M hab.) y Singapur (5.6M hab.). Cada brecha cita evidencia verificable.'
                : 'Compared with Estonia (1.3M people) and Singapore (5.6M people). Each gap cites verifiable evidence.',
          };

  return (
    <AssetFrame size={size} locale={locale} variant="gradient">
      <div className="flex-1 flex flex-col justify-center p-16">
        <p
          className="font-semibold uppercase tracking-widest text-institucional-700"
          style={{ fontSize: 18 }}
        >
          {content.kicker}
        </p>
        <h1
          className="mt-3 font-bold text-slate-900 leading-tight"
          style={{ fontSize: 56, maxWidth: 1000 }}
        >
          {content.title}
        </h1>
        <p
          className="mt-5 text-slate-600"
          style={{ fontSize: 22, maxWidth: 1000, lineHeight: 1.4 }}
        >
          {content.sub}
        </p>
      </div>
    </AssetFrame>
  );
}
