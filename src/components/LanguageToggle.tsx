import Link from 'next/link';
import { locales, localeNames, localeFullNames, type Locale } from '@/i18n/config';

export function LanguageToggle({ current }: { current: Locale }) {
  return (
    <div
      className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5 text-xs"
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => {
        const active = l === current;
        return (
          <Link
            key={l}
            href={`/${l}/`}
            hrefLang={l}
            aria-label={localeFullNames[l]}
            aria-current={active ? 'true' : undefined}
            className={
              active
                ? 'px-2.5 py-1 rounded-full bg-institucional-700 text-white font-semibold'
                : 'px-2.5 py-1 rounded-full text-slate-600 hover:text-institucional-700 transition-colors'
            }
          >
            {localeNames[l]}
          </Link>
        );
      })}
    </div>
  );
}
