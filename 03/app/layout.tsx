import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'YataClimate | Havanı Keşfet',
  description: 'Şehirlerin güncel hava durumunu ve kısa süreli tahminlerini estetik bir deneyimle keşfedin.',
  openGraph: {
    title: 'YataClimate | Havanı Keşfet',
    description: 'Bugünün havası, tek bakışta.',
    type: 'website',
    locale: 'tr_TR',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'YataClimate sosyal paylaşım görseli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YataClimate | Havanı Keşfet',
    description: 'Bugünün havası, tek bakışta.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${jakarta.variable}`}>{children}</body>
    </html>
  );
}
