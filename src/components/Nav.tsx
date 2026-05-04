import Image from 'next/image';
import Link from 'next/link';
import { LanguageToggle } from './LanguageToggle';
import { MobileMenu } from './MobileMenu';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function Nav({ locale, t }: { locale: Locale; t: Dictionary }) {
  const base = `/${locale}/`;
  const items = [
    { href: `${base}#instituciones`, label: t.nav.instituciones },
    { href: `${base}#legislacion`, label: t.nav.legislacion },
    { href: `${base}#indicadores`, label: t.nav.indicadores },
    { href: `${base}analisis`, label: t.nav.analisis },
    { href: `${base}#recursos`, label: t.nav.recursos },
  ];
  const menuLabel = locale === 'es' ? 'Abrir menú' : 'Open menu';
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href={base} className="flex items-center gap-3 flex-shrink-0">
          <Image src="/logo.svg" alt="" width={40} height={21} className="h-8 w-auto" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg text-institucional-900">{t.siteName}</span>
            <span className="text-xs text-slate-500 -mt-0.5">{t.siteCountry}</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-700">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="hover:text-institucional-700 transition-colors">
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle current={locale} />
          <MobileMenu items={items} ariaLabel={menuLabel} />
        </div>
      </div>
    </header>
  );
}
