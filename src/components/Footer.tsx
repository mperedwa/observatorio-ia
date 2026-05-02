import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-600 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="sm:col-span-1">
          <p className="font-semibold text-slate-900">{t.footer.titulo}</p>
          <p className="mt-1">{t.footer.tagline}</p>
        </div>
        <div className="sm:col-span-1">
          <Link
            href={`/${locale}/quien-mantiene`}
            className="text-institucional-700 hover:underline font-medium"
          >
            {t.footer.quienMantiene} →
          </Link>
        </div>
        <div className="text-xs text-slate-500 sm:text-right">
          <p>{t.footer.ultimaActualizacion}</p>
          <p className="mt-1">{t.footer.fuentes}</p>
        </div>
      </div>
    </footer>
  );
}
