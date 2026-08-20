import type { MetadataRoute } from 'next';
import { articulosOrdenados } from '@/data/articulos';
import { instituciones } from '@/data/instituciones';
import { proyectos } from '@/data/proyectos';
import { locales } from '@/i18n/config';

const SITE_URL = 'https://www.observatorioia.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', 'analisis', 'comparte', 'historial', 'marco-pais', 'privacidad', 'proyectos', 'quien-mantiene'];
  const paths = [
    ...staticPaths,
    ...proyectos.map((item) => `proyectos/${item.id}`),
    ...instituciones.map((item) => `instituciones/${item.id}`),
    ...articulosOrdenados.map((item) => `analisis/${item.slug}`),
  ];

  return locales.flatMap((locale) =>
    paths.map((path) => {
      const suffix = path ? `${path}/` : '';
      return {
        url: `${SITE_URL}/${locale}/${suffix}`,
        changeFrequency: path.startsWith('proyectos/') || path.startsWith('instituciones/') ? 'monthly' : 'weekly',
        priority: path === '' ? 1 : path === 'proyectos' ? 0.9 : path === 'analisis' || path === 'marco-pais' ? 0.8 : 0.6,
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
}
