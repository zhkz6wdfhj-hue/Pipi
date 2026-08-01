'use client';

/**
 * Fotogalerij met miniaturen. De grote foto houdt altijd de verhouding 4:5 aan;
 * de miniaturen zijn knoppen, dus de galerij is volledig met het toetsenbord te
 * bedienen. Pijltjestoetsen links en rechts bladeren door de foto's.
 */

import { useRef, useState } from 'react';

import { ProductMedia } from '@/components/ui/media';
import type { ProductImage } from '@/data/products';

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [actief, setActief] = useState(0);
  const knoppen = useRef<(HTMLButtonElement | null)[]>([]);

  const huidige = images[actief] ?? images[0];

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();

    const volgende =
      event.key === 'ArrowRight'
        ? (actief + 1) % images.length
        : (actief - 1 + images.length) % images.length;

    setActief(volgende);
    knoppen.current[volgende]?.focus();
  }

  return (
    <div>
      <ProductMedia
        src={huidige.src}
        alt={huidige.alt}
        width={huidige.width}
        height={huidige.height}
        priority
        sizes="(min-width: 1024px) 620px, 100vw"
      />

      {images.length > 1 ? (
        <div
          role="group"
          aria-label={`Foto's van de ${name}`}
          onKeyDown={onKeyDown}
          className="mt-3 grid grid-cols-4 gap-3"
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              ref={(element) => {
                knoppen.current[index] = element;
              }}
              type="button"
              onClick={() => setActief(index)}
              aria-current={index === actief ? 'true' : undefined}
              className={`block overflow-hidden border transition-colors duration-200 ${
                index === actief ? 'border-accent' : 'border-line hover:border-line-strong'
              }`}
            >
              <span className="sr-only">
                Foto {index + 1} van {images.length} tonen: {image.alt}
              </span>
              <ProductMedia
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 150px, 22vw"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
