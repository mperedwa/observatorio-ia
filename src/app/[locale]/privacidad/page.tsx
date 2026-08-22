import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EncabezadoSeccionExpediente } from '@/components/ExpedienteEditorial';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const copy = {
  es: {
    kicker: 'Transparencia',
    title: 'Privacidad y analítica',
    intro: 'El Observatorio IA Costa Rica utiliza medición agregada para mejorar sus contenidos y su navegación.',
    necessaryTitle: 'Medición necesaria',
    necessary: 'Vercel Analytics recopila métricas agregadas de uso y rendimiento. El observatorio no utiliza esta medición para identificar personas.',
    optionalTitle: 'Google Analytics 4',
    optional: 'GA4 solo se carga si usted acepta la analítica. Medimos páginas consultadas, tiempo de interacción, país aproximado, dispositivo, fuente de tráfico y acciones sobre contenidos. No enviamos nombres, correos ni texto introducido por visitantes.',
    choiceTitle: 'Su elección',
    choice: 'La preferencia se guarda en su navegador. Puede borrarla eliminando los datos locales del sitio; el aviso volverá a mostrarse en su siguiente visita.',
    contact: 'Para consultas sobre privacidad: info@observatorioia.org.',
    back: 'Volver al inicio',
  },
  en: {
    kicker: 'Transparency',
    title: 'Privacy and analytics',
    intro: 'AI Observatory Costa Rica uses aggregate measurement to improve its content and navigation.',
    necessaryTitle: 'Necessary measurement',
    necessary: 'Vercel Analytics collects aggregate usage and performance metrics. The observatory does not use this measurement to identify individuals.',
    optionalTitle: 'Google Analytics 4',
    optional: 'GA4 only loads if you accept analytics. We measure viewed pages, engagement time, approximate country, device, traffic source, and content interactions. We do not send names, email addresses, or text entered by visitors.',
    choiceTitle: 'Your choice',
    choice: 'Your preference is stored in your browser. You can clear it by deleting this site’s local data; the notice will appear again on your next visit.',
    contact: 'For privacy questions: info@observatorioia.org.',
    back: 'Back to home',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const text = copy[locale as Locale];
  return {
    title: `${text.title} — Observatorio IA Costa Rica`,
    description: text.intro,
    alternates: {
      canonical: `/${locale}/privacidad/`,
      languages: { es: '/es/privacidad/', en: '/en/privacidad/', 'x-default': '/es/privacidad/' },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lc = locale as Locale;
  const text = copy[lc];
  const t = getDictionary(lc);
  const sections = [
    { title: text.necessaryTitle, body: text.necessary },
    { title: text.optionalTitle, body: text.optional },
    { title: text.choiceTitle, body: text.choice },
  ];
  return (
    <article className="bg-white">
      <header className="border-b border-editorial-rule bg-editorial-paper">
        <div className="mx-auto max-w-5xl px-6 pb-14 pt-10 sm:pb-16">
          <Breadcrumb
            locale={lc}
            items={[{ label: t.breadcrumb.inicio, href: `/${lc}/` }, { label: text.title }]}
          />
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">{text.kicker}</p>
          <h1 className="mt-3 max-w-4xl font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">{text.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-editorial-muted text-pretty">{text.intro}</p>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-4 sm:py-8">
        {sections.map((section, index) => (
          <section key={section.title} className="border-b border-editorial-rule py-10 sm:py-12">
            <EncabezadoSeccionExpediente index={String(index + 1).padStart(2, '0')} title={section.title} />
            <p className="mt-5 max-w-3xl leading-relaxed text-slate-700 text-pretty sm:ml-[4.5rem]">{section.body}</p>
          </section>
        ))}
        <div className="py-10">
          <p className="max-w-3xl border-l-2 border-editorial-accent pl-4 text-sm leading-relaxed text-editorial-muted">{text.contact}</p>
          <Link href={`/${lc}/`} className="mt-8 inline-block border-b border-institucional-700 pb-0.5 text-sm font-semibold text-institucional-700 hover:text-institucional-900">← {text.back}</Link>
        </div>
      </div>
    </article>
  );
}
