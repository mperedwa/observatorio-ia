import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';
import { CAPAS_CATALOGO } from '@/data/presentacion-catalogo';
import { DIMENSIONES_EVIDENCIA } from '@/data/modelo-evidencia';
import { capaChip } from '@/components/catalogoStyles';
import Link from 'next/link';

// Enlaza inline la firma de autoría en el cuerpo de "Autoría". Los dos términos
// son nombres propios idénticos en ES y EN, así que el mismo helper sirve para
// ambos idiomas: el nombre va al LinkedIn de Mario; "UnikPrompt" a unikprompt.com.
// Enlaces discretos, sin nada comercial ni de otros productos.
function linkifyAutoria(cuerpo: string): ReactNode[] {
  const re = /(Mario Pérez Edwards|UnikPrompt)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cuerpo)) !== null) {
    if (m.index > last) out.push(cuerpo.slice(last, m.index));
    const href =
      m[1] === 'UnikPrompt'
        ? 'https://www.unikprompt.com/'
        : 'https://www.linkedin.com/in/mario-perez-edwards';
    out.push(
      <a
        key={key++}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-institucional-700 hover:underline"
      >
        {m[1]}
      </a>,
    );
    last = m.index + m[1].length;
  }
  if (last < cuerpo.length) out.push(cuerpo.slice(last));
  return out;
}

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
      url: `https://www.observatorioia.org/${locale}/quien-mantiene/`,
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
    <article className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
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
        <p className="text-base text-slate-700 text-pretty leading-relaxed">{linkifyAutoria(q.autoria.cuerpo)}</p>
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

      <section className="mb-10 border-t border-slate-200 pt-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          {t.catalogo.metodologiaTitulo}
        </h2>
        <p className="text-base text-slate-700 text-pretty leading-relaxed">
          {t.catalogo.metodologiaCuerpo}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {CAPAS_CATALOGO.map((capa) => (
            <article key={capa} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${capaChip[capa]}`}>
                {t.catalogo.capas[capa].corto}
              </span>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {t.catalogo.capas[capa].titulo}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {t.catalogo.capas[capa].criterio}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-institucional-200 bg-institucional-50 p-5">
          <h3 className="text-sm font-semibold text-slate-900">
            {t.proyectoDetalle.evidenciaTitulo}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {DIMENSIONES_EVIDENCIA.map((dimension) => (
              <span key={dimension} className="rounded-full border border-institucional-200 bg-white px-3 py-1 text-xs text-institucional-800">
                {t.catalogo.dimensiones[dimension]}
              </span>
            ))}
          </div>
        </div>
        <Link
          href={`/${lc}/proyectos`}
          className="mt-5 inline-flex text-sm font-semibold text-institucional-700 hover:underline"
        >
          {t.hero.ctaCatalogo} →
        </Link>
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
