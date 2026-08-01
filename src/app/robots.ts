import type { MetadataRoute } from 'next';

import { site } from '@/data/site';

/** Komt automatisch op /robots.txt te staan. */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Pagina's met persoonlijke of tijdelijke inhoud horen niet in Google.
        disallow: ['/winkelmand', '/afrekenen', '/bestelling/', '/zoeken', '/nieuwsbrief/', '/api/'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
