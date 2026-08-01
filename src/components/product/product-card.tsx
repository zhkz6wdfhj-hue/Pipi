import Link from 'next/link';

import { ProductMedia } from '@/components/ui/media';
import { COLORS, isSoldOut, type Product } from '@/data/products';
import { formatPrice } from '@/lib/format';

/**
 * Eén product in het raster. De foto doet het werk; de tekst blijft klein en
 * rustig eronder.
 */

export function ProductCard({
  product,
  priority = false,
  sizes = '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 47vw',
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const image = product.images[0];
  const uitverkocht = isSoldOut(product);

  return (
    <article>
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative">
          <ProductMedia
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority={priority}
            sizes={sizes}
            imageClassName="transition-opacity duration-200 ease-[cubic-bezier(0.2,0,0.2,1)] group-hover:opacity-90"
          />
          {uitverkocht ? (
            <p className="label-caps absolute top-3 left-3 border border-line bg-surface px-2.5 py-1 text-ink-soft">
              Uitverkocht
            </p>
          ) : null}
        </div>

        <div className="mt-3.5">
          <h3 className="display-sm text-ink group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">
            {product.name}
          </h3>
          <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-soft">{product.tagline}</p>
          <p className="mt-2 text-[0.9375rem] text-ink">{formatPrice(product.price)}</p>
        </div>
      </Link>

      <p className="mt-2 flex items-center gap-1.5">
        <span className="sr-only">Beschikbare kleuren: {product.colors.map((color) => COLORS[color].label).join(', ')}.</span>
        {product.colors.map((color) => (
          <span
            key={color}
            aria-hidden="true"
            className="block h-2.5 w-2.5 rounded-full border"
            style={{
              backgroundColor: COLORS[color].swatch,
              borderColor: COLORS[color].swatchBorder,
            }}
          />
        ))}
      </p>
    </article>
  );
}
