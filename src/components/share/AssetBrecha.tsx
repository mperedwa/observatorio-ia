import { brechas } from '@/data/brechas';
import { AssetFrame, type AssetSize } from './AssetFrame';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function AssetBrecha({
  locale,
  t,
  size,
  brechaId,
}: {
  locale: Locale;
  t: Dictionary;
  size: AssetSize;
  brechaId: string;
}) {
  const b = brechas.find((x) => x.id === brechaId);
  if (!b) {
    return (
      <AssetFrame size={size} locale={locale}>
        <div className="p-16 text-red-600">Brecha no encontrada: {brechaId}</div>
      </AssetFrame>
    );
  }

  const idx = brechas.findIndex((x) => x.id === brechaId) + 1;

  return (
    <AssetFrame size={size} locale={locale} variant="light">
      <div className="flex-1 flex flex-col p-16">
        <div>
          <p
            className="font-semibold uppercase tracking-widest text-institucional-700"
            style={{ fontSize: 22 }}
          >
            {locale === 'es' ? `Brecha ${idx} de 7` : `Gap ${idx} of 7`}
          </p>
          <h1
            className="mt-4 font-bold text-slate-900 leading-tight"
            style={{ fontSize: 56, maxWidth: 940 }}
          >
            {b.capacidad[locale]}
          </h1>
          <p
            className="mt-3 font-semibold text-institucional-700"
            style={{ fontSize: 22 }}
          >
            {locale === 'es' ? 'Referencia' : 'Reference'}: {b.paisReferencia[locale]}
          </p>
        </div>

        <div className="mt-12 flex-1 flex flex-col gap-8">
          <div>
            <p className="text-slate-700" style={{ fontSize: 24, lineHeight: 1.4 }}>
              {b.evidenciaReferencia[locale]}
            </p>
          </div>

          <div className="border-l-8 border-amber-400 pl-6 py-2 bg-amber-50 rounded-r-lg">
            <p
              className="font-semibold uppercase tracking-wide text-amber-800 mb-2"
              style={{ fontSize: 16 }}
            >
              {t.analisis.estadoCRLabel}
            </p>
            <p className="text-slate-800" style={{ fontSize: 22, lineHeight: 1.4 }}>
              {b.estadoCR[locale]}
            </p>
          </div>
        </div>

        <p className="mt-10 text-slate-500" style={{ fontSize: 16 }}>
          observatorioia.org/{locale}/analisis
        </p>
      </div>
    </AssetFrame>
  );
}
