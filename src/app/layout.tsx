import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { DocumentLanguage } from '@/components/DocumentLanguage';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.observatorioia.org'),
  title: 'Observatorio IA Costa Rica',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const vercelAnalyticsEnabled =
    process.env.VERCEL === '1' ||
    process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED === 'true';

  return (
    <html
      lang="es"
      className={`${inter.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-white text-slate-900">
        <DocumentLanguage />
        {children}
        {vercelAnalyticsEnabled && <Analytics />}
      </body>
    </html>
  );
}
