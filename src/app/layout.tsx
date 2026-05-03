import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://observatorioia.org'),
  title: 'Observatorio IA Costa Rica',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-slate-900">{children}</body>
      <Script
        defer
        data-domain="observatorioia.org"
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    </html>
  );
}
