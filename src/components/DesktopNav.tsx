'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MobileMenuItem } from './MobileMenu';

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav({
  items,
  ariaLabel,
}: {
  items: MobileMenuItem[];
  ariaLabel: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={ariaLabel}
      className="hidden items-stretch self-stretch text-sm xl:flex"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center border-b-2 px-3 transition-colors duration-150 ${
              active
                ? 'border-editorial-accent font-semibold text-editorial-ink'
                : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-institucional-700'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
