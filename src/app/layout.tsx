import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Observatorio IA Costa Rica',
  description:
    'Mapeo público y abierto de los proyectos, leyes e indicadores de inteligencia artificial en el sector público costarricense.',
  metadataBase: new URL('https://observatorioia.org'),
  openGraph: {
    title: 'Observatorio IA Costa Rica',
    description: 'Proyectos, legislación e indicadores de IA en el gobierno de Costa Rica.',
    url: 'https://observatorioia.org',
    siteName: 'Observatorio IA Costa Rica',
    locale: 'es_CR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-900`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
