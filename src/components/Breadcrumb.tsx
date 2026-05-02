import Link from 'next/link';
import type { Locale } from '@/i18n/config';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ locale, items }: { locale: Locale; items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-xs text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-institucional-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-slate-700 font-medium' : ''}>
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden className="text-slate-400">›</span>}
            </li>
          );
        })}
      </ol>
      <span className="sr-only" lang={locale}>
        {locale === 'es' ? 'Migas de pan' : 'Breadcrumb'}
      </span>
    </nav>
  );
}
