import type { MetadataRoute } from 'next';

import { getAllProducts } from '@/data/products';
import { site } from '@/data/site';

/**
 * De sitemap komt automatisch op /sitemap.xml te staan. Voeg je een pagina toe,
 * zet hem dan ook in de lijst hieronder; producten worden vanzelf meegenomen.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const nu = new Date();

  const paginas: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/collectie', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/collectie?categorie=jassen', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/collectie?categorie=blazers', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/over', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/klantenservice', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/service/verzending', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/service/retourneren', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/service/betaalmethoden', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/service/maattabel', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/service/onderhoud', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/juridisch/voorwaarden', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/juridisch/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/juridisch/cookies', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/juridisch/herroepingsrecht', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return [
    ...paginas.map((pagina) => ({
      url: `${site.url}${pagina.path}`,
      lastModified: nu,
      changeFrequency: pagina.changeFrequency,
      priority: pagina.priority,
    })),
    ...getAllProducts().map((product) => ({
      url: `${site.url}/product/${product.slug}`,
      lastModified: new Date(product.releasedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
