import type { Metadata } from 'next';
import Link from 'next/link';

import { CollectionFilterBar } from '@/components/product/collection-filters';
import { ProductCard } from '@/components/product/product-card';
import { getAllProducts } from '@/data/products';
import {
  applyFilters,
  buildFilterUrl,
  describeFilters,
  parseFilters,
  type RawSearchParams,
} from '@/lib/collection-filters';
import { breadcrumbSchema, jsonLdScript, pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const omschrijving = describeFilters(filters);

  const titel = filters.categorie
    ? filters.categorie === 'jassen'
      ? 'Lange wollen jassen'
      : 'Wollen blazers'
    : 'De collectie';

  return pageMetadata({
    title: titel,
    description: omschrijving
      ? `${omschrijving} van Mèlin. Op maat gemaakt, in kameel, ecru, houtskool, taupe en donkergroen.`
      : 'Vijf lange wollen jassen en drie blazers, na je bestelling op maat gemaakt. Kameel, ecru, houtskool, taupe en donkergroen.',
    path: filters.categorie ? `/collectie?categorie=${filters.categorie}` : '/collectie',
  });
}

export default async function CollectiePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filters = parseFilters(await searchParams);
  const producten = applyFilters(getAllProducts(), filters);

  const titel = filters.categorie
    ? filters.categorie === 'jassen'
      ? 'Lange jassen'
      : 'Blazers'
    : 'De collectie';

  return (
    <div className="container-page py-10 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: titel, path: '/collectie' },
          ])
        )}
      />

      <header className="mb-8 lg:mb-12">
        <nav aria-label="Kruimelpad" className="mb-4 text-[0.8125rem] text-ink-soft">
          <Link href="/" className="link-underlined">
            Home
          </Link>
          <span aria-hidden="true"> · </span>
          <span aria-current="page">{titel}</span>
        </nav>

        <h1 className="display-xl">{titel}</h1>
        <p className="mt-4 max-w-2xl text-lead leading-relaxed text-ink-soft">
          Acht modellen, meer niet. De kleuren zijn op elkaar afgestemd, zodat een jas en een blazer
          uit deze collectie ook samen te dragen zijn. Alles wordt na je bestelling op maat gemaakt;
          je kiest hier dus een model en een kleur, de maat nemen we daarna samen op.
        </p>
      </header>

      <CollectionFilterBar filters={filters} resultCount={producten.length} />

      {producten.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="display-md mb-3">Niets gevonden met deze filters</h2>
          <p className="mx-auto mb-6 max-w-md text-ink-soft">
            Deze combinatie levert niets op — die kleur maken we in deze categorie op dit moment
            niet.
          </p>
          <Link
            href={buildFilterUrl(filters, { leegmaken: true })}
            className="inline-block rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
          >
            Bekijk de hele collectie
          </Link>
        </div>
      ) : (
        <>
        <h2 className="sr-only">Alle modellen in deze selectie</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:mt-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {producten.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              priority={index < 3}
              sizes="(min-width: 1240px) 380px, (min-width: 1024px) 30vw, 47vw"
            />
          ))}
        </div>
        </>
      )}
    </div>
  );
}
