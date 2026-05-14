import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap'
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap'
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://indizicosmici.it';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Indizi Cosmici — Crea il tuo Spirito Guida',
  description: 'Un piccolo segno da portare con te o da dedicare a chi ami. Gratis, simbolico, in pochi secondi.',
  openGraph: {
    title: 'Indizi Cosmici',
    description: 'Crea il tuo Spirito Guida — un piccolo segno da portare con te o da dedicare a chi ami.',
    url: SITE,
    siteName: 'Indizi Cosmici',
    locale: 'it_IT',
    type: 'website'
  },
  twitter: { card: 'summary_large_image' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="it" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        {children}
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
