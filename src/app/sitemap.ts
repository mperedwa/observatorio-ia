import type { MetadataRoute } from 'next';
import { articulosOrdenados } from '@/data/articulos';
import { instituciones } from '@/data/instituciones';
import { proyectos } from '@/data/proyectos';
import { locales } from '@/i18n/config';

const SITE_URL = 'https://www.observatorioia.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    'analisis',
    'comparte',
    'enia',
    'historial',
    'indicadores',
    'instituciones',
    'legislacion',
    'marco-pais',
    'privacidad',
    'proyectos',
    'quien-mantiene',
    'recursos',
  ];
  const paths = [
    ...staticPaths,
    ...proyectos.map((item) => `proyectos/${item.id}`),
    ...instituciones.map((item) => `instituciones/${item.id}`),
    ...articulosOrdenados.map((item) => `analisis/${item.slug}`),
  ];

  const localizedPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    paths.map((path) => {
      const suffix = path ? `${path}/` : '';
      const isDetail = path.startsWith('proyectos/') || path.startsWith('instituciones/');
      const isPrimaryIndex = [
        'analisis',
        'indicadores',
        'instituciones',
        'legislacion',
        'marco-pais',
      ].includes(path);
      const priority = path === '' ? 1 : path === 'proyectos' ? 0.9 : isPrimaryIndex ? 0.8 : 0.6;

      return {
        url: `${SITE_URL}/${locale}/${suffix}`,
        changeFrequency: isDetail ? 'monthly' : 'weekly',
        priority,
        alternates: {
          languages: {
            es: `${SITE_URL}/es/${suffix}`,
            en: `${SITE_URL}/en/${suffix}`,
            'x-default': `${SITE_URL}/es/${suffix}`,
          },
        },
      };
    }),
  );

  const apiLanguages = {
    es: `${SITE_URL}/api/`,
    en: `${SITE_URL}/api/en/`,
    'x-default': `${SITE_URL}/api/`,
  };

  return [
    ...localizedPages,
    {
      url: apiLanguages.es,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: apiLanguages },
    },
    {
      url: apiLanguages.en,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: apiLanguages },
    },
  ];
}
