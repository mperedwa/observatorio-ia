import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <footer className="border-t border-editorial-rule bg-editorial-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-5">
          <p className="font-editorial text-2xl font-semibold text-editorial-ink">
            {t.footer.titulo}
          </p>
          <p className="mt-2 max-w-sm leading-relaxed">{t.footer.tagline}</p>
          <p className="mt-6 text-xs text-slate-500">{t.footer.ultimaActualizacion}</p>
        </div>

        <nav aria-label={t.footer.explorarLabel} className="lg:col-span-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {t.footer.explorarLabel}
          </p>
          <div className="flex flex-col items-start gap-2.5">
            <Link href={`/${locale}/proyectos`} className="text-editorial-ink hover:underline">
              {t.nav.proyectos}
            </Link>
            <Link href={`/${locale}/instituciones`} className="text-editorial-ink hover:underline">
              {t.nav.instituciones}
            </Link>
            <Link href={`/${locale}/legislacion`} className="text-editorial-ink hover:underline">
              {t.nav.legislacion}
            </Link>
            <Link href={`/${locale}/indicadores`} className="text-editorial-ink hover:underline">
              {t.nav.indicadores}
            </Link>
            <Link href={`/${locale}/recursos`} className="text-editorial-ink hover:underline">
              {t.footer.recursosLabel}
            </Link>
          </div>
        </nav>

        <nav aria-label={t.footer.transparenciaLabel} className="lg:col-span-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {t.footer.transparenciaLabel}
          </p>
          <div className="flex flex-col items-start gap-2.5">
            <Link
              href={`/${locale}/quien-mantiene`}
              className="text-editorial-ink hover:underline"
            >
              {t.footer.quienMantiene}
            </Link>
            <Link
              href={`/${locale}/historial`}
              className="text-editorial-ink hover:underline"
            >
              {t.footer.historialMonitoreo}
            </Link>
            <a
              href={locale === 'es' ? '/api/' : '/api/en/'}
              className="text-editorial-ink hover:underline"
            >
              {t.footer.apiPublica}
            </a>
            <Link
              href={`/${locale}/privacidad`}
              className="text-editorial-ink hover:underline"
            >
              {t.footer.privacidadLabel}
            </Link>
          </div>
        </nav>
      </div>

      <div className="border-t border-editorial-rule">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-7 text-xs text-slate-500 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <p className="max-w-3xl leading-relaxed">{t.footer.fuentes}</p>
          <p className="sm:text-right">
            {t.footer.atribucion}{' '}
            <a
              href="https://www.linkedin.com/in/mario-perez-edwards"
              target="_blank"
              rel="noopener noreferrer"
              className="text-editorial-ink hover:underline"
            >
              Mario Pérez Edwards
            </a>
            {' · '}
            <a
              href="https://www.unikprompt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-editorial-ink hover:underline"
            >
              UnikPrompt
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
