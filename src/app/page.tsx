import { defaultLocale } from '@/i18n/config';

export default function Root() {
  const target = `/${defaultLocale}/`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(target)})`,
        }}
      />
      <p style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        Redirecting to <a href={target}>{target}</a>
      </p>
    </>
  );
}
