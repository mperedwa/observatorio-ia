import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EncabezadoSeccionExpediente } from '@/components/ExpedienteEditorial';
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
        { filename: 'kpi-hero-1080.png', label: t.comparte.assets.kpiHeroTitulo, size: 'square' },
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

  const resolveLabel = (label: string) => applyCounters(label, COUNTERS);

  return (
    <article className="bg-white">
      <header className="border-b border-editorial-rule bg-editorial-paper">
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-10 sm:pb-16">
          <Breadcrumb
            locale={lc}
            items={[
              { label: t.breadcrumb.inicio, href: `/${lc}/` },
              { label: t.comparte.kicker },
            ]}
          />
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.12em] text-institucional-700">{t.comparte.kicker}</p>
          <h1 className="mt-3 max-w-4xl font-editorial text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-editorial-ink text-balance sm:text-6xl">
            {t.comparte.titulo}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-editorial-muted text-pretty">{t.comparte.sub}</p>
          <p className="mt-5 max-w-3xl border-l-2 border-editorial-accent pl-4 text-sm leading-relaxed text-editorial-muted">{t.comparte.instrucciones}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6">
      {sections.map((section, sectionIndex) => (
        <section key={section.id} className="border-b border-editorial-rule py-12 sm:py-16">
          <EncabezadoSeccionExpediente index={String(sectionIndex + 1).padStart(2, '0')} title={section.titulo} />
          <div
            className={`mt-8 grid gap-x-7 gap-y-10 sm:ml-[4.5rem] ${
              section.items[0]?.size === 'story'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-4xl'
                : section.items[0]?.size === 'horizontal'
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {section.items.map((item) => (
              <article
                key={item.filename}
                className="flex min-w-0 flex-col"
              >
                <div className={`border border-editorial-rule bg-editorial-paper ${aspectClass[item.size]}`}>
                  <Image
                    src={`/comparte-assets/${lc}/${item.filename}`}
                    alt={resolveLabel(item.label)}
                    width={item.size === 'horizontal' ? 1200 : 1080}
                    height={item.size === 'square' ? 1080 : item.size === 'horizontal' ? 630 : 1920}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col border-b border-editorial-rule py-4">
                  <p className="font-editorial text-lg font-semibold leading-snug text-editorial-ink">
                    {resolveLabel(item.label)}
                  </p>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.06em] text-slate-500">{sizeLabel[item.size]}</p>
                  <a
                    href={`/comparte-assets/${lc}/${item.filename}`}
                    download={item.filename}
                    className="mt-4 self-start border-b border-institucional-700 pb-0.5 text-xs font-semibold text-institucional-700 hover:text-institucional-900"
                  >
                    ↓ {t.comparte.descargar}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="py-12 sm:py-16">
        <p className="text-sm text-slate-600 italic text-pretty max-w-3xl">{t.comparte.notaUso}</p>
        <p className="mt-3 text-sm">
          <Link href={`/${lc}/quien-mantiene`} className="text-institucional-700 hover:underline">
            {t.acerca.verMas}
          </Link>
        </p>
      </section>
      </div>
    </article>
  );
}
