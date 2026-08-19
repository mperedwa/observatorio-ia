import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const copy = {
  es: {
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
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{text.title}</h1>
      <p className="mt-5 text-lg text-slate-600">{text.intro}</p>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">{text.necessaryTitle}</h2>
        <p className="mt-2 leading-relaxed text-slate-700">{text.necessary}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">{text.optionalTitle}</h2>
        <p className="mt-2 leading-relaxed text-slate-700">{text.optional}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">{text.choiceTitle}</h2>
        <p className="mt-2 leading-relaxed text-slate-700">{text.choice}</p>
      </section>
      <p className="mt-8 text-sm text-slate-600">{text.contact}</p>
      <Link href={`/${lc}/`} className="mt-8 inline-block font-medium text-institucional-700 hover:underline">← {text.back}</Link>
    </article>
  );
}
