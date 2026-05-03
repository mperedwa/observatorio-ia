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
        ? 'bg-gradient-to-br from-institucional-50 via-white to-slate-50 text-slate-900'
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
      <div className="absolute inset-0 flex flex-col">{children}</div>
      <footer
        className={`absolute bottom-6 right-6 flex items-baseline gap-3 ${
          variant === 'dark' ? 'text-slate-300' : 'text-slate-500'
        }`}
        style={{ fontSize: 16 }}
      >
        <span className="font-semibold tracking-tight">observatorioia.org</span>
        <span className="opacity-60">·</span>
        <span>{locale === 'es' ? 'Mayo 2026' : 'May 2026'}</span>
      </footer>
    </div>
  );
}
