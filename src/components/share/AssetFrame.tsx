import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';

export interface AssetSize {
  width: number;
  height: number;
}

export const SIZES = {
  square: { width: 1080, height: 1080 },
  horizontal: { width: 1200, height: 630 },
  story: { width: 1080, height: 1920 },
} as const;

export type SizeKey = keyof typeof SIZES;

/**
 * AssetFrame: contenedor de tamaño exacto para captura PNG.
 * Renderiza con dimensiones fijas en pixeles (no responsive).
 * Branding "observatorioia.org" embebido abajo a la derecha.
 */
export function AssetFrame({
  size,
  locale,
  variant = 'light',
  children,
}: {
  size: AssetSize;
  locale: Locale;
  variant?: 'light' | 'dark' | 'gradient';
  children: ReactNode;
}) {
  const bg =
    variant === 'dark'
      ? 'bg-slate-900 text-white'
      : variant === 'gradient'
        ? 'bg-editorial-paper text-editorial-ink'
        : 'bg-white text-slate-900';
  return (
    <div
      className={`relative overflow-hidden ${bg}`}
      style={{
        width: size.width,
        height: size.height,
        fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
      }}
    >
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-3 ${variant === 'dark' ? 'bg-institucional-600' : 'bg-editorial-ink'}`}
      />
      <div className="absolute inset-0 flex flex-col">{children}</div>
      <footer
        className={`absolute inset-x-0 bottom-0 flex items-baseline justify-between border-t px-8 py-5 ${
          variant === 'dark' ? 'border-slate-700 text-slate-300' : 'border-editorial-rule text-slate-500'
        }`}
        style={{ fontSize: 16 }}
      >
        <span className="font-semibold tracking-[0.02em]">observatorioia.org</span>
        <span>{locale === 'es' ? 'Agosto 2026' : 'August 2026'}</span>
      </footer>
    </div>
  );
}
