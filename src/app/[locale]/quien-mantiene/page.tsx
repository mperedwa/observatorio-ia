import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';
import { CAPAS_CATALOGO } from '@/data/presentacion-catalogo';
import { DIMENSIONES_EVIDENCIA } from '@/data/modelo-evidencia';
import {
  EncabezadoSeccionExpediente,
  MarcaDocumental,
} from '@/components/ExpedienteEditorial';
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
        className="text-institucional-700 underline decoration-institucional-200 underline-offset-2 hover:decoration-institucional-700"
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
    <article className="bg-white">
      <header className="border-b border-editorial-rule bg-editorial-paper">
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-10 sm:pb-16">
          <Breadcrumb
            locale={lc}
            items={[
              { label: t.breadcrumb.inicio, href: `/${lc}/` },
              { label: q.kicker },
            ]}
          />
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">{q.kicker}</p>
          <h1 className="mt-3 max-w-4xl font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
            {q.titulo}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        <section className="py-12 sm:py-16">
          <EncabezadoSeccionExpediente index="01" title={q.autoria.titulo} />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-editorial-muted text-pretty sm:ml-[4.5rem]">
            {linkifyAutoria(q.autoria.cuerpo)}
          </p>
        </section>

        <section className="border-t border-editorial-rule py-12 sm:py-16">
          <EncabezadoSeccionExpediente index="02" title={q.metodologia.titulo} description={q.metodologia.cuerpo} />
          <ol className="mt-8 border-y border-editorial-rule sm:ml-[4.5rem]">
            {q.metodologia.bullets.map((b, i) => (
              <li key={i} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-editorial-rule py-4 text-sm leading-relaxed text-slate-700 last:border-b-0">
                <span className="font-mono text-xs tabular-nums text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-pretty">{b}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-editorial-rule py-12 sm:py-16">
          <EncabezadoSeccionExpediente index="03" title={t.catalogo.metodologiaTitulo} description={t.catalogo.metodologiaCuerpo} />
          <div className="mt-9 border-y border-editorial-rule sm:ml-[4.5rem] md:grid md:grid-cols-3 md:divide-x md:divide-editorial-rule">
            {CAPAS_CATALOGO.map((capa) => (
              <article key={capa} className="border-b border-editorial-rule py-5 last:border-b-0 md:border-b-0 md:px-5 md:first:pl-0">
                <MarcaDocumental
                  label={t.catalogo.capas[capa].corto}
                  tone={capa === 'verificado' ? 'confirmado' : capa === 'seguimiento' ? 'atencion' : 'parcial'}
                />
                <h3 className="mt-4 font-editorial text-xl font-semibold text-editorial-ink">
                  {t.catalogo.capas[capa].titulo}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {t.catalogo.capas[capa].criterio}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-8 border-t border-editorial-rule pt-5 sm:ml-[4.5rem]">
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
              {t.proyectoDetalle.evidenciaTitulo}
            </h3>
            <ol className="mt-3 grid border-y border-editorial-rule sm:grid-cols-2 lg:grid-cols-3">
              {DIMENSIONES_EVIDENCIA.map((dimension, index) => (
                <li key={dimension} className="flex gap-3 border-b border-editorial-rule px-3 py-3 text-xs text-slate-700 sm:[&:nth-child(odd)]:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0">
                  <span className="font-mono tabular-nums text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                  {t.catalogo.dimensiones[dimension]}
                </li>
              ))}
            </ol>
            <Link href={`/${lc}/proyectos`} className="mt-5 inline-flex border-b border-institucional-700 pb-0.5 text-sm font-semibold text-institucional-700 hover:text-institucional-900">
              {t.hero.ctaCatalogo} →
            </Link>
          </div>
        </section>

        <section className="border-t border-editorial-rule py-12 sm:py-16">
          <EncabezadoSeccionExpediente index="04" title={q.contacto.titulo} />
          <div className="mt-6 max-w-3xl border-l-2 border-editorial-accent pl-4 sm:ml-[4.5rem]">
            <p className="text-base leading-relaxed text-slate-700 text-pretty">{q.contacto.cuerpo}</p>
            <a href="mailto:info@observatorioia.org" className="mt-4 inline-block border-b border-institucional-700 pb-0.5 text-sm font-semibold text-institucional-700 hover:text-institucional-900">
              {q.contacto.emailLabel} · info@observatorioia.org ↗
            </a>
          </div>
        </section>

        <section className="border-t border-editorial-rule py-10">
          <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-slate-500">{q.disclaimer.titulo}</h2>
          <p className="mt-3 max-w-3xl text-sm italic leading-relaxed text-editorial-muted text-pretty">{q.disclaimer.cuerpo}</p>
        </section>
      </div>
    </article>
  );
}
