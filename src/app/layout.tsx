import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { AnalyticsManager } from '@/components/AnalyticsManager';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
  return (
    <html className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-slate-900">{children}</body>
      <AnalyticsManager measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      <Analytics />
    </html>
  );
}
