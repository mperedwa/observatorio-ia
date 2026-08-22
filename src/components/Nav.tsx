import Image from 'next/image';
import Link from 'next/link';
import { DesktopNav } from './DesktopNav';
import { LanguageToggle } from './LanguageToggle';
import { MobileMenu } from './MobileMenu';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function Nav({ locale, t }: { locale: Locale; t: Dictionary }) {
  const base = `/${locale}/`;
  const items = [
    { href: `${base}proyectos`, label: t.nav.proyectos },
    { href: `${base}marco-pais`, label: t.nav.marcoPais },
    { href: `${base}enia`, label: t.nav.enia },
    { href: `${base}instituciones`, label: t.nav.instituciones },
    { href: `${base}legislacion`, label: t.nav.legislacion },
    { href: `${base}indicadores`, label: t.nav.indicadores },
    { href: `${base}analisis`, label: t.nav.analisis },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-editorial-rule bg-editorial-paper/95 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <Link href={base} className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <Image src="/logo.svg" alt="" width={40} height={21} priority className="h-8 w-auto" />
          <div className="flex flex-col leading-tight">
            <span className="font-editorial text-xl font-semibold text-editorial-ink">{t.siteName}</span>
            <span className="text-xs text-slate-500 -mt-0.5">{t.siteCountry}</span>
          </div>
        </Link>
        <DesktopNav items={items} ariaLabel={t.nav.navegacionPrincipal} />
        <div className="flex items-center gap-2">
          <LanguageToggle current={locale} />
          <MobileMenu
            items={items}
            openLabel={t.nav.abrirMenu}
            closeLabel={t.nav.cerrarMenu}
            navigationLabel={t.nav.navegacionPrincipal}
          />
        </div>
      </div>
    </header>
  );
}
