import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductBuyBox } from '@/components/product/product-buy-box';
import { ProductCard } from '@/components/product/product-card';
import { ProductGallery } from '@/components/product/product-gallery';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { getAllProducts, getProductBySlug, getRelatedProducts } from '@/data/products';
import { layeringOptions, measurements } from '@/data/measurements';
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
    description: `${product.tagline} ${product.specs.composition}. Op maat gemaakt, standaardlengte ${product.specs.lengthCm} cm.`,
    path: `/product/${product.slug}`,
    image: { url: product.images[0].src, alt: product.images[0].alt },
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

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
                    value={`${product.specs.lengthCm} cm van schoudernaad tot zoom, op jouw lengte aangepast`}
                  />
                  <Spec label="Gemaakt in" value={product.specs.madeIn} />
                  <Spec label="Onderhoud" value={product.specs.care} />
                </dl>
              </AccordionItem>

              <AccordionItem title="Op maat gemaakt">
                <div id="maatwerk" className="scroll-mt-24">
                  <p className="mb-4">
                    Je kiest hier geen confectiemaat. Binnen {site.delivery.contactWithinDays}{' '}
                    werkdagen na je bestelling nemen we contact op en lopen we deze maten samen door:
                  </p>
                  <ul className="mb-4 list-disc space-y-1 pl-5">
                    {measurements.map((maat) => (
                      <li key={maat.label}>
                        <span className="text-ink">{maat.label}</span> — {maat.how}
                      </li>
                    ))}
                  </ul>
                  <p className="mb-4">
                    We vragen ook wat je eronder wilt dragen ({layeringOptions.join(', ').toLowerCase()}),
                    want dat bepaalt hoeveel ruimte we aanhouden.
                  </p>
                  <p>
                    <Link href="/service/op-maat" className="link-underlined text-accent-ink">
                      Uitleg over het opmeten
                    </Link>
                  </p>
                </div>
              </AccordionItem>

              <AccordionItem title="Levering en verzending">
                <p>
                  Reken op {site.delivery.weeksMin} tot {site.delivery.weeksMax} weken van bestelling
                  tot bezorging: het opnemen van de maten, het naaien en het versturen bij elkaar.
                  Zodra je jas klaar is en bij de vervoerder ligt, sturen we je het volgnummer.
                </p>
                <p className="mt-3">
                  Binnen Nederland € 4,95, naar België € 7,95 — bij deze prijs valt dat weg, want
                  vanaf € 150 verzenden we gratis.
                </p>
                <p className="mt-3">
                  <Link href="/service/verzending" className="link-underlined text-accent-ink">
                    Alles over verzending
                  </Link>
                </p>
              </AccordionItem>

              <AccordionItem title="Passen en aanpassen">
                <p>
                  Zit je jas niet zoals hij hoort, dan passen we hem kosteloos aan — mouwen inkorten,
                  de taille bijnemen, de zoom verleggen. Ook de verzending heen en terug is dan voor
                  ons. Meld het binnen {site.alterationDays} dagen nadat je hem hebt ontvangen.
                </p>
                <p className="mt-3">
                  Omdat dit kledingstuk naar jouw maten wordt gemaakt, geldt het wettelijke
                  herroepingsrecht van veertien dagen hier niet. Wat daarvoor in de plaats komt,
                  staat op de pagina hieronder.
                </p>
                <p className="mt-3">
                  <Link href="/service/passen-en-aanpassen" className="link-underlined text-accent-ink">
                    Passen en aanpassen
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
