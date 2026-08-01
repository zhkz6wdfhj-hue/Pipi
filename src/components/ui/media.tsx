'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

/**
 * Foto's staan in een vaste verhouding met een warm-witte achtergrond eromheen.
 * Zo vormen losse foto's uit verschillende bronnen toch één geheel: de uitsnede
 * is altijd gelijk, de foto wordt nooit uitgerekt.
 *
 * Product: 4:5. Sfeer: 3:2.
 *
 * De foto verschijnt met een zachte overgang zodra hij geladen is. Dat wordt
 * hier bijgehouden in plaats van met een los script, zodat React en de server
 * het over dezelfde opmaak eens blijven. Foto's die al in de cache zitten
 * vangen we op met `complete` in de ref, want dan komt er geen load-gebeurtenis
 * meer. Zonder JavaScript blijft alles gewoon zichtbaar; zie de noscript-regel
 * in app/layout.tsx.
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
  const [geladen, setGeladen] = useState(false);

  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setGeladen(true);
  }, []);

  return (
    <div className={['relative overflow-hidden bg-bg', ratio, className].filter(Boolean).join(' ')}>
      <Image
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        // next/image zet zelf loading="lazy"; met `priority` wordt de foto juist
        // vooraf opgehaald. Allebei tegelijk opgeven maakt `priority` ongedaan.
        priority={priority}
        onLoad={() => setGeladen(true)}
        data-fade=""
        className={[
          'h-full w-full object-cover transition-opacity duration-500 ease-[cubic-bezier(0.2,0,0.2,1)]',
          geladen ? 'opacity-100' : 'opacity-0',
          imageClassName,
        ]
          .filter(Boolean)
          .join(' ')}
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
