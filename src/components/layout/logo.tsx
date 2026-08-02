import Link from 'next/link';

/**
 * Het wordmerk: MÈLIN in kapitalen, met ruime letterafstand, in de display-letter.
 * Zo staat het ook op het profiel — geen hoofdletter-M met kleine rest, maar
 * vijf even zware letters met lucht ertussen.
 *
 * De letterafstand is bewust groot (0.26em) en wordt aan de rechterkant
 * gecompenseerd, anders lijkt het merk uit het midden te staan.
 */

const MAAT = {
  klein: 'text-[0.9375rem]',
  normaal: 'text-[1.0625rem]',
  groot: 'text-[1.375rem]',
} as const;

export function Logo({
  className,
  as = 'link',
  size = 'normaal',
}: {
  className?: string;
  as?: 'link' | 'tekst';
  size?: keyof typeof MAAT;
}) {
  const content = (
    <span
      className={`font-display font-medium ${MAAT[size]} leading-none tracking-[0.26em] uppercase`}
      style={{ marginRight: '-0.26em' }}
    >
      Mèlin
    </span>
  );

  if (as === 'tekst') {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link
      href="/"
      className={['inline-block text-ink', className].filter(Boolean).join(' ')}
      aria-label="Mèlin, naar de homepage"
    >
      {content}
    </Link>
  );
}
