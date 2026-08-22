import { describe, expect, it } from 'vitest';
import {
  GOOGLE_NEWS_QUERIES,
  buildGoogleNewsUrl,
  parseGoogleNewsFeed,
  selectCandidatesRoundRobin,
} from '../scrapers/google-news';
import {
  isOfficialMideplanUrl,
  parseMideplanListing,
  scrapeMideplan,
} from '../scrapers/mideplan';

const RSS = `<?xml version="1.0"?>
<rss><channel>
  <item>
    <title><![CDATA[MIDEPLAN publica avance de transformación digital - MIDEPLAN]]></title>
    <link>https://news.google.com/rss/articles/oficial</link>
    <pubDate>Fri, 21 Aug 2026 12:00:00 GMT</pubDate>
    <source url="https://www.mideplan.go.cr">MIDEPLAN</source>
  </item>
  <item>
    <title>Comentario externo sobre MIDEPLAN</title>
    <link>https://news.google.com/rss/articles/externo</link>
    <source>Medio externo</source>
  </item>
</channel></rss>`;

describe('Google News RSS', () => {
  it('parsea títulos, enlaces y fuente sin conservar marcado HTML', () => {
    const items = parseGoogleNewsFeed(RSS);

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      titulo: 'MIDEPLAN publica avance de transformación digital - MIDEPLAN',
      url: 'https://news.google.com/rss/articles/oficial',
      fuente: 'MIDEPLAN',
    });
  });

  it('vigila las nueve instituciones catalogadas y un frente transversal', () => {
    const ids = new Set(GOOGLE_NEWS_QUERIES.map((item) => item.institucion));

    expect(ids).toEqual(new Set([
      'poder-judicial',
      'ccss',
      'hacienda',
      'mep',
      'micitt',
      'ucr',
      'cenat',
      'inamu',
      'ins',
      'sector-publico',
    ]));
    expect(GOOGLE_NEWS_QUERIES.every((item) => item.query.includes('when:90d'))).toBe(true);
  });

  it('construye el feed localizado para Costa Rica', () => {
    const url = new URL(buildGoogleNewsUrl('inteligencia artificial'));

    expect(url.hostname).toBe('news.google.com');
    expect(url.searchParams.get('gl')).toBe('CR');
    expect(url.searchParams.get('ceid')).toBe('CR:es-419');
  });

  it('reparte el límite global antes de repetir una institución', () => {
    const selected = selectCandidatesRoundRobin([
      { institucion: 'ccss', id: 'ccss-1' },
      { institucion: 'ccss', id: 'ccss-2' },
      { institucion: 'ccss', id: 'ccss-3' },
      { institucion: 'inamu', id: 'inamu-1' },
      { institucion: 'sector-publico', id: 'sector-1' },
    ], 3);

    expect(selected.map(({ id }) => id)).toEqual([
      'ccss-1',
      'inamu-1',
      'sector-1',
    ]);
  });
});

describe('MIDEPLAN', () => {
  it('solo reconoce el dominio oficial y sus subdominios', () => {
    expect(isOfficialMideplanUrl('https://www.mideplan.go.cr/noticias/avance')).toBe(true);
    expect(isOfficialMideplanUrl('https://datos.mideplan.go.cr/recurso')).toBe(true);
    expect(isOfficialMideplanUrl('https://mideplan.go.cr.example/noticia')).toBe(false);
    expect(isOfficialMideplanUrl('not-a-url')).toBe(false);
  });

  it('parsea tarjetas del listado oficial', () => {
    const html = `
      <div class="item-noticias views-row">
        <h2>Avance de transformación digital</h2>
        <a href="/noticias/avance">Leer</a>
      </div>
      <footer></footer>`;

    expect(parseMideplanListing(html)).toEqual([{
      titulo: 'Avance de transformación digital',
      url: 'https://www.mideplan.go.cr/noticias/avance',
    }]);
  });

  it('activa el respaldo y descarta toda URL final no oficial', async () => {
    const report = await scrapeMideplan({
      fetchHtml: async (url) => {
        if (url.includes('news.google.com')) return RSS;
        throw new Error('fetch bloqueado -> 403');
      },
      resolveNewsUrl: async (url) => (
        url.endsWith('/oficial')
          ? 'https://www.mideplan.go.cr/noticias/avance-transformacion-digital'
          : 'https://medio.example/opinion'
      ),
    });

    expect(report.candidates).toEqual([{
      titulo: 'MIDEPLAN publica avance de transformación digital - MIDEPLAN',
      url: 'https://www.mideplan.go.cr/noticias/avance-transformacion-digital',
    }]);
    expect(report.matched).toBe(1);
    expect(report.notes.join(' ')).toMatch(/respaldo de descubrimiento/);
    expect(report.notes.join(' ')).toMatch(/páginas oficiales de MIDEPLAN/);
  });
});
