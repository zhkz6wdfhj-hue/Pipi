import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { ProductCard } from '@/components/product/product-card';
import { searchProducts } from '@/data/products';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;

  return pageMetadata({
    title: q ? `Zoeken naar “${q}”` : 'Zoeken',
    description: 'Zoek in de collectie van Mèlin op naam, kleur, stof of categorie.',
    path: '/zoeken',
    noindex: true,
  });
}

export default async function ZoekenPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = (q ?? '').trim();
  const resultaten = term.length >= 2 ? searchProducts(term) : [];

  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title={term ? `Zoeken naar “${term}”` : 'Zoeken'}
        intro={
          term.length >= 2
            ? resultaten.length === 1
              ? 'Eén model komt overeen.'
              : `${resultaten.length} modellen komen overeen.`
            : 'Zoek op naam, kleur, stof of categorie. Bijvoorbeeld: kameel, blazer, kasjmier.'
        }
        breadcrumb={[{ label: 'Zoeken', href: '/zoeken' }]}
      />

      {/* Zoekformulier, werkt ook zonder JavaScript. */}
      <form role="search" action="/zoeken" method="get" className="mb-12 max-w-lg">
        <label htmlFor="zoekpagina-veld" className="mb-1.5 block text-[0.875rem] text-ink">
          Zoekterm
        </label>
        <div className="flex gap-2">
          <input
            id="zoekpagina-veld"
            name="q"
            type="search"
            defaultValue={term}
            placeholder="Bijvoorbeeld: kameel, blazer, ecru"
            className="w-full rounded-xs border border-line bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-soft/60 hover:border-line-strong focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xs bg-button px-5 py-2.5 text-[0.875rem] text-white transition-colors duration-200 hover:bg-button-hover"
          >
            Zoek
          </button>
        </div>
      </form>

      {term.length >= 2 && resultaten.length === 0 ? (
        <div className="border-t border-line py-12">
          <h2 className="display-md mb-3">Niets gevonden</h2>
          <p className="mb-6 max-w-lg leading-relaxed text-ink-soft">
            Op “{term}” vinden we geen model. De collectie is klein: vijf lange jassen en drie
            blazers, in kameel, ecru, houtskool, taupe en donkergroen. Blader er gerust doorheen.
          </p>
          <Link
            href="/collectie"
            className="inline-block rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
          >
            Bekijk de collectie
          </Link>
        </div>
      ) : null}

      {resultaten.length > 0 ? (
        <>
        <h2 className="sr-only">Gevonden modellen</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 border-t border-line pt-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
          {resultaten.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              priority={index < 3}
              sizes="(min-width: 1240px) 380px, (min-width: 1024px) 30vw, 47vw"
            />
          ))}
        </div>
        </>
      ) : null}
    </div>
  );
}
