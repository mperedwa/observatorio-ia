import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { brechas } from '@/data/brechas';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, type Locale } from '@/i18n/config';
import { applyCounters } from '@/i18n/applyCounters';
import { COUNTERS } from '@/data/counters';

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
  const titulo = `${t.comparte.titulo} — ${t.siteName}`;
  return {
    title: titulo,
    description: t.comparte.sub,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `/${locale}/comparte/`,
      languages: {
        es: '/es/comparte/',
        en: '/en/comparte/',
        'x-default': '/es/comparte/',
      },
    },
  };
}

interface AssetEntry {
  filename: string;
  label: string;
  size: 'square' | 'horizontal' | 'story';
}

interface AssetSection {
  id: string;
  titulo: string;
  items: AssetEntry[];
}

export default async function ComartePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);

  const sections: AssetSection[] = [
    {
      id: 'hero',
      titulo: t.comparte.secciones.hero,
      items: [
        { filename: 'kpi-hero-1080.png', label: applyCounters(t.comparte.assets.kpiHeroTitulo, COUNTERS), size: 'square' },
      ],
    },
    {
      id: 'timeline',
      titulo: t.comparte.secciones.timeline,
      items: [
        { filename: 'timeline-1080.png', label: t.comparte.assets.timelineTitulo, size: 'square' },
      ],
    },
    {
      id: 'ilia',
      titulo: t.comparte.secciones.ilia,
      items: [
        { filename: 'ilia-1080.png', label: t.comparte.assets.iliaTitulo, size: 'square' },
      ],
    },
    {
      id: 'mapa',
      titulo: t.comparte.secciones.mapa,
      items: [
        { filename: 'mapa-1080.png', label: t.comparte.assets.mapaTitulo, size: 'square' },
      ],
    },
    {
      id: 'brechas',
      titulo: t.comparte.secciones.brechas,
      items: brechas.map((b, idx) => {
        const labels = [
          t.comparte.assets.brechaXroad,
          t.comparte.assets.brechaGobernanza,
          t.comparte.assets.brechaChatbot,
          t.comparte.assets.brechaAsistente,
          t.comparte.assets.brechaTesting,
          t.comparte.assets.brechaTalento,
          t.comparte.assets.brechaDatos,
        ];
        return {
          filename: `brecha-${b.id}-1080.png`,
          label: labels[idx] ?? b.capacidad[lc],
          size: 'square' as const,
        };
      }),
    },
    {
      id: 'og',
      titulo: t.comparte.secciones.og,
      items: [
        { filename: 'og-home-1200x630.png', label: t.comparte.assets.ogHome, size: 'horizontal' },
        { filename: 'og-analisis-1200x630.png', label: t.comparte.assets.ogAnalisis, size: 'horizontal' },
        { filename: 'og-brechas-1200x630.png', label: t.comparte.assets.ogBrechas, size: 'horizontal' },
      ],
    },
    {
      id: 'stories',
      titulo: t.comparte.secciones.stories,
      items: [
        { filename: 'story-timeline-1080x1920.png', label: t.comparte.assets.storyTimeline, size: 'story' },
        { filename: 'story-brecha-1080x1920.png', label: t.comparte.assets.storyBrecha, size: 'story' },
      ],
    },
  ];

  const sizeLabel = {
    square: t.comparte.cuadradoLabel,
    horizontal: t.comparte.horizontalLabel,
    story: t.comparte.storyLabel,
  };

  const aspectClass = {
    square: 'aspect-square',
    horizontal: 'aspect-[1200/630]',
    story: 'aspect-[1080/1920]',
  };

  return (
    <article className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
      <Breadcrumb
        locale={lc}
        items={[
          { label: t.breadcrumb.inicio, href: `/${lc}/` },
          { label: t.comparte.kicker },
        ]}
      />

      <header className="mt-6 mb-12 border-b border-slate-200 pb-8">
        <p className="text-xs uppercase tracking-wider text-institucional-700">{t.comparte.kicker}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 text-balance leading-tight">
          {t.comparte.titulo}
        </h1>
        <p className="mt-4 text-lg text-slate-600 text-pretty max-w-3xl">{t.comparte.sub}</p>
        <p className="mt-3 text-sm text-slate-500">{t.comparte.instrucciones}</p>
      </header>

      {sections.map((section) => (
        <section key={section.id} className="mb-14">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">{section.titulo}</h2>
          <div
            className={`grid gap-5 ${
              section.items[0]?.size === 'story'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-3xl'
                : section.items[0]?.size === 'horizontal'
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {section.items.map((item) => (
              <article
                key={item.filename}
                className="border border-slate-200 rounded-lg overflow-hidden bg-white flex flex-col"
              >
                <div className={`bg-slate-50 ${aspectClass[item.size]}`}>
                  <img
                    src={`/comparte-assets/${lc}/${item.filename}`}
                    alt={item.label}
                    width={1080}
                    height={item.size === 'square' ? 1080 : item.size === 'horizontal' ? 630 : 1920}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-sm font-semibold text-slate-900 mb-1">{item.label}</p>
                  <p className="text-xs text-slate-500 mb-3">{sizeLabel[item.size]}</p>
                  <a
                    href={`/comparte-assets/${lc}/${item.filename}`}
                    download={item.filename}
                    className="mt-auto inline-block text-sm text-institucional-700 hover:underline self-start"
                  >
                    ↓ {t.comparte.descargar}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-16 pt-8 border-t border-slate-200">
        <p className="text-sm text-slate-600 italic text-pretty max-w-3xl">{t.comparte.notaUso}</p>
        <p className="mt-3 text-sm">
          <Link href={`/${lc}/quien-mantiene`} className="text-institucional-700 hover:underline">
            {t.acerca.verMas}
          </Link>
        </p>
      </section>
    </article>
  );
}
