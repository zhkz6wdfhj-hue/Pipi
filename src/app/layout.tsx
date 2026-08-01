import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Suspense } from 'react';

import './globals.css';

import { CartAnnouncer } from '@/components/layout/announcer';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { CookieBanner } from '@/components/layout/cookie-banner';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { CartProvider } from '@/context/cart-context';
import { site } from '@/data/site';
import { jsonLdScript, organizationSchema, websiteSchema } from '@/lib/seo';

/**
 * Lettertypen worden door next/font tijdens het bouwen opgehaald en meegeleverd
 * vanaf je eigen domein. Er gaat dus geen enkel verzoek naar Google wanneer een
 * bezoeker de site opent — beter voor de snelheid én voor de privacy.
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-cormorant',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — lange wollen jassen en blazers`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: site.name,
    url: site.url,
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF8F4',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        {/* Zonder JavaScript komt de zachte overgang van de foto's nooit op gang.
            Deze regel zorgt dat ze dan meteen zichtbaar zijn. */}
        <noscript>
          <style>{`img[data-fade]{opacity:1 !important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationSchema())}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(websiteSchema())} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#hoofdinhoud"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-xs focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2.5 focus:text-[0.875rem] focus:text-ink"
        >
          Naar de inhoud
        </a>

        <CartProvider>
          <Suspense fallback={<div className="h-16 border-b border-line md:h-20" />}>
            <Header />
          </Suspense>

          <main id="hoofdinhoud" className="flex-1">
            {children}
          </main>

          <Footer />
          <CartDrawer />
          <CartAnnouncer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
