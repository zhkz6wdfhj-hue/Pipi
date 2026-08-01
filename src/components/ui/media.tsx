import Image from 'next/image';

/**
 * Foto's staan in een vaste verhouding met een warm-witte achtergrond eromheen.
 * Zo vormen losse foto's uit verschillende bronnen toch één geheel: de
 * uitsnede is altijd gelijk, de foto wordt nooit uitgerekt.
 *
 * Product: 4:5. Sfeer: 3:2.
 */

interface MediaProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Alleen voor de eerste foto boven de vouw; verder blijft alles lazy. */
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  /** Positie van de uitsnede, standaard het midden. */
  position?: string;
}

function Frame({
  ratio,
  src,
  alt,
  width,
  height,
  priority,
  sizes,
  className,
  imageClassName,
  position,
}: MediaProps & { ratio: string }) {
  return (
    <div className={['relative overflow-hidden bg-bg', ratio, className].filter(Boolean).join(' ')}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        data-fade=""
        className={['h-full w-full object-cover', imageClassName].filter(Boolean).join(' ')}
        style={{ objectPosition: position ?? 'center' }}
      />
    </div>
  );
}

/** 4:5 — alle productfoto's. */
export function ProductMedia(props: MediaProps) {
  return <Frame ratio="ratio-portrait" {...props} />;
}

/** 3:2 — sfeerbeelden op de homepage en de overpagina. */
export function SceneMedia(props: MediaProps) {
  return <Frame ratio="ratio-landscape" {...props} />;
}
