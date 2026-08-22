'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface MobileMenuItem {
  href: string;
  label: string;
}

export function MobileMenu({
  items,
  openLabel,
  closeLabel,
  navigationLabel,
}: {
  items: MobileMenuItem[];
  openLabel: string;
  closeLabel: string;
  navigationLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      setOpen(false);
      window.requestAnimationFrame(() => buttonRef.current?.focus());
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-editorial text-slate-700 transition-colors hover:bg-white"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          id="mobile-menu-panel"
          className="absolute left-0 right-0 top-16 z-40 border-b border-editorial-rule bg-editorial-paper shadow-sm"
        >
          <nav aria-label={navigationLabel} className="mx-auto flex max-w-7xl flex-col px-6 py-2">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`border-b border-editorial-rule py-3 text-base transition-colors last:border-0 ${
                    active
                      ? 'font-semibold text-editorial-ink'
                      : 'text-slate-700 hover:text-institucional-700'
                  }`}
                >
                  {item.label}
                  {active && <span aria-hidden className="ml-2 text-editorial-accent">●</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
