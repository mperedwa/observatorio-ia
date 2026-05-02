export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
};

export const localeFullNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export type Bilingual = { es: string; en: string };

export function pick(value: Bilingual, locale: Locale): string {
  return value[locale];
}
