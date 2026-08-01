import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductBuyBox } from '@/components/product/product-buy-box';
import { ProductCard } from '@/components/product/product-card';
import { ProductGallery } from '@/components/product/product-gallery';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { getAllProducts, getProductBySlug, getRelatedProducts } from '@/data/products';
import { blazerSizeChart, coatSizeChart } from '@/data/size-chart';
import { site } from '@/data/site';
import { breadcrumbSchema, jsonLdScript, pageMetadata, productSchema } from '@/lib/seo';

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return pageMetadata({
      title: 'Product niet gevonden',
      description: 'Dit model bestaat niet meer of het adres klopt niet.',
      path: `/product/${slug}`,
      noindex: true,
    });
  }

  return pageMetadata({
    title: product.name,
    description: `${product.tagline} ${product.specs.composition}. Maat XS tot XL, lengte ${product.specs.lengthCm} cm bij maat M.`,
    path: `/product/${product.slug}`,
    image: { url: product.images[0].src, alt: product.images[0].alt },
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const maattabel = product.category === 'jassen' ? coatSizeChart : blazerSizeChart;
  const gerelateerd = getRelatedProducts(product.slug, 3);
  const categorieLabel = product.category === 'jassen' ? 'Lange jassen' : 'Blazers';

  return (
    <div className="container-page py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(productSchema(product))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: categorieLabel, path: `/collectie?categorie=${product.category}` },
            { name: product.name, path: `/product/${product.slug}` },
          ])
        )}
      />

      <nav aria-label="Kruimelpad" className="mb-6 text-[0.8125rem] text-ink-soft lg:mb-8">
        <Link href="/" className="link-underlined">
          Home
        </Link>
        <span aria-hidden="true"> · </span>
        <Link href={`/collectie?categorie=${product.category}`} className="link-underlined">
          {categorieLabel}
        </Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div className="lg:pt-2">
          <h1 className="display-lg">{product.name}</h1>
          <p className="mt-4 max-w-prose leading-relaxed text-ink-soft">{product.description}</p>

          <ProductBuyBox product={product} />

          <div className="mt-12">
            <Accordion>
              <AccordionItem title="Specificaties" defaultOpen>
                <dl className="space-y-2.5">
                  <Spec label="Samenstelling" value={product.specs.composition} />
                  <Spec label="Voering" value={product.specs.lining} />
                  <Spec label="Sluiting" value={product.specs.closure} />
                  <Spec
                    label="Lengte"
                    value={`${product.specs.lengthCm} cm, gemeten bij maat M van schoudernaad tot zoom`}
                  />
                  <Spec label="Gemaakt in" value={product.specs.madeIn} />
                  <Spec label="Onderhoud" value={product.specs.care} />
                </dl>
              </AccordionItem>

              <AccordionItem title="Maattabel">
                <div id="maattabel" className="scroll-mt-24">
                  <p className="mb-4">
                    De maten hieronder zijn van het kledingstuk zelf, plat gemeten en waar het
                    logisch is verdubbeld. Twijfel je tussen twee maten, kies dan de grootste — deze
                    modellen worden vaak over een trui gedragen.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[26rem] border-collapse text-[0.875rem]">
                      <caption className="sr-only">
                        Maattabel voor de {product.name}, in centimeters
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col" className="label-caps border-b border-line py-2.5 pr-3 text-left text-ink">
                            Maat
                          </th>
                          <th scope="col" className="label-caps border-b border-line px-3 py-2.5 text-left text-ink">
                            NL
                          </th>
                          <th scope="col" className="label-caps border-b border-line px-3 py-2.5 text-left text-ink">
                            Borst
                          </th>
                          <th scope="col" className="label-caps border-b border-line px-3 py-2.5 text-left text-ink">
                            Schouder
                          </th>
                          <th scope="col" className="label-caps border-b border-line py-2.5 pl-3 text-left text-ink">
                            Mouw
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {maattabel.map((rij) => (
                          <tr key={rij.size}>
                            <th scope="row" className="border-b border-line py-2.5 pr-3 text-left font-normal text-ink">
                              {rij.size}
                            </th>
                            <td className="border-b border-line px-3 py-2.5">{rij.nl}</td>
                            <td className="border-b border-line px-3 py-2.5">{rij.chest} cm</td>
                            <td className="border-b border-line px-3 py-2.5">{rij.shoulder} cm</td>
                            <td className="border-b border-line py-2.5 pl-3">{rij.sleeve} cm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4">
                    <Link href="/service/maattabel" className="link-underlined text-accent-ink">
                      Uitleg over opmeten
                    </Link>
                  </p>
                </div>
              </AccordionItem>

              <AccordionItem title="Verzending">
                <p>
                  Binnen Nederland € 4,95, naar België € 7,95. Vanaf € 150 verzenden we gratis.
                  Bestel je op een werkdag vóór 15.00 uur, dan gaat je pakket dezelfde dag nog weg.
                  Nederland duurt daarna {site.delivery.nlDaysMin} tot {site.delivery.nlDaysMax}{' '}
                  werkdagen, België {site.delivery.beDaysMin} tot {site.delivery.beDaysMax}.
                </p>
                <p className="mt-3">
                  <Link href="/service/verzending" className="link-underlined text-accent-ink">
                    Alles over verzending
                  </Link>
                </p>
              </AccordionItem>

              <AccordionItem title="Retour en ruilen">
                <p>
                  Je hebt {site.returnDays} dagen bedenktijd, gerekend vanaf de dag dat je het
                  pakket ontvangt. Stuur je de jas terug, dan mag hij gepast zijn maar niet gedragen,
                  en moeten de labels er nog aan zitten. De retourkosten zijn voor jou; het
                  aankoopbedrag krijg je binnen veertien dagen terug.
                </p>
                <p className="mt-3">
                  <Link href="/service/retourneren" className="link-underlined text-accent-ink">
                    Zo stuur je iets terug
                  </Link>
                </p>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Drie andere producten */}
      <section className="section-t" aria-labelledby="ook-titel">
        <h2 id="ook-titel" className="display-md mb-8 border-b border-line pb-4">
          Ook uit deze collectie
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
          {gerelateerd.map((ander) => (
            <ProductCard
              key={ander.slug}
              product={ander}
              sizes="(min-width: 1024px) 380px, 47vw"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-3">
      <dt className="text-ink">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
