/**
 * Metadata, canonieke URL's en JSON-LD.
 * Elke pagina roept `pageMetadata` aan met een eigen titel en omschrijving.
 */

import type { Metadata } from 'next';

import { toAmountString } from './format';
import { COLORS, type Product } from '@/data/products';
import { site } from '@/data/site';

export function absoluteUrl(path = '/'): string {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
  type?: 'website' | 'article';
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(input.path);
  const image = input.image ?? {
    url: absoluteUrl('/images/og-melin-clo.jpg'),
    alt: 'Melin_clo — lange wollen jassen en blazers, met een kameelkleurige en een houtskoolgrijze jas.',
  };

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: input.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: input.type ?? 'website',
      locale: 'nl_NL',
      siteName: site.name,
      title: input.title,
      description: input.description,
      url,
      images: [{ url: image.url, width: 1200, height: 630, alt: image.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image.url],
    },
  };
}

/* =============================================================================
   JSON-LD
   ========================================================================== */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    logo: absoluteUrl('/icon.svg'),
    sameAs: [site.instagram.url],
    vatID: site.btw,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.returnAddress.street,
      postalCode: site.returnAddress.postalCode,
      addressLocality: site.returnAddress.city,
      addressCountry: 'NL',
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: 'nl-NL',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site.url}/zoeken?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function productSchema(product: Product) {
  const inStock = product.variants.some((variant) => variant.stock > 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.variants[0]?.sku,
    url: absoluteUrl(`/product/${product.slug}`),
    image: product.images.map((image) => absoluteUrl(image.src)),
    brand: { '@type': 'Brand', name: site.name },
    material: product.specs.composition,
    color: product.colors.map((color) => COLORS[color].label).join(', '),
    category: product.category === 'jassen' ? 'Jassen' : 'Blazers',
    offers: {
      '@type': 'Offer',
      price: toAmountString(product.price),
      priceCurrency: 'EUR',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: absoluteUrl(`/product/${product.slug}`),
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: site.name },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '4.95', currency: 'EUR' },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: ['NL', 'BE'],
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: ['NL', 'BE'],
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: site.returnDays,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      },
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Component-vriendelijke uitvoer van een JSON-LD-blok. */
export function jsonLdScript(schema: object): { __html: string } {
  return { __html: JSON.stringify(schema) };
}
