import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const t = getDictionary(locale as Locale);
  const titulo = `${t.quienMantiene.titulo} — ${t.siteName}`;
  return {
    title: titulo,
    description: t.quienMantiene.metaDescripcion,
    openGraph: {
      title: titulo,
      description: t.quienMantiene.metaDescripcion,
      url: `https://observatorioia.org/${locale}/quien-mantiene/`,
      siteName: t.siteName,
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: `/${locale}/quien-mantiene/`,
      languages: {
        es: '/es/quien-mantiene/',
        en: '/en/quien-mantiene/',
        'x-default': '/es/quien-mantiene/',
      },
    },
  };
}

export default async function QuienMantienePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);
  const q = t.quienMantiene;

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <Breadcrumb
        locale={lc}
        items={[
          { label: t.breadcrumb.inicio, href: `/${lc}/` },
          { label: q.kicker },
        ]}
      />

      <header className="mt-6 mb-12 border-b border-slate-200 pb-8">
        <p className="text-xs uppercase tracking-wider text-institucional-700">{q.kicker}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 text-balance leading-tight">
          {q.titulo}
        </h1>
      </header>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{q.autoria.titulo}</h2>
        <p className="text-base text-slate-700 text-pretty leading-relaxed">{q.autoria.cuerpo}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{q.metodologia.titulo}</h2>
        <p className="text-base text-slate-700 text-pretty leading-relaxed mb-3">
          {q.metodologia.cuerpo}
        </p>
        <ul className="space-y-2 text-base text-slate-700">
          {q.metodologia.bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="text-institucional-700 mt-1">▸</span>
              <span className="text-pretty leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10 bg-institucional-50 border border-institucional-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{q.contacto.titulo}</h2>
        <p className="text-base text-slate-700 text-pretty leading-relaxed mb-3">
          {q.contacto.cuerpo}
        </p>
        <a
          href="mailto:info@observatorioia.org"
          className="inline-block text-sm font-medium text-institucional-700 hover:underline"
        >
          ↗ {q.contacto.emailLabel} (info@observatorioia.org)
        </a>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">
          {q.disclaimer.titulo}
        </h2>
        <p className="text-sm text-slate-600 text-pretty leading-relaxed italic">
          {q.disclaimer.cuerpo}
        </p>
      </section>
    </article>
  );
}
