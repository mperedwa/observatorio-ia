import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function Acerca({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section id="acerca" className="max-w-7xl mx-auto px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-institucional-700">
          {t.acerca.kicker}
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">{t.acerca.titulo}</h2>
        <div className="mt-6 space-y-4 text-slate-700 text-pretty">
          <p>{t.acerca.p1}</p>
          <p>{t.acerca.p2}</p>
          <p>{t.acerca.p3}</p>
        </div>
        <div className="mt-8 inline-block border-l-4 border-institucional-700 pl-4 py-1">
          <p className="text-sm text-slate-600">{t.acerca.ctaPregunta}</p>
          <a
            href="mailto:info@observatorioia.org"
            className="mt-1 inline-block text-institucional-700 font-medium hover:underline"
          >
            info@observatorioia.org →
          </a>
        </div>
        <p className="mt-8 text-sm">
          <Link
            href={`/${locale}/quien-mantiene`}
            className="text-institucional-700 hover:underline"
          >
            {t.acerca.verMas}
          </Link>
        </p>
      </div>
    </section>
  );
}
