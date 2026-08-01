import Link from 'next/link';

/**
 * Het merk in de interface: "Melin" in de display-letter, met "clo" als klein
 * achtervoegsel. De volledige schrijfwijze Melin_clo staat in de footer, de
 * metadata en de juridische teksten.
 */

export function Logo({
  className,
  as = 'link',
  size = 'normaal',
}: {
  className?: string;
  as?: 'link' | 'tekst';
  size?: 'normaal' | 'groot';
}) {
  const content = (
    <span className="inline-flex items-baseline gap-[0.18em]">
      <span
        className={
          size === 'groot'
            ? 'font-display text-[1.75rem] leading-none tracking-[0.02em]'
            : 'font-display text-[1.375rem] leading-none tracking-[0.02em]'
        }
      >
        Melin
      </span>
      <span className="text-[0.6875rem] leading-none tracking-[0.12em] text-accent-ink">clo</span>
    </span>
  );

  if (as === 'tekst') {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link
      href="/"
      className={['inline-block text-ink', className].filter(Boolean).join(' ')}
      aria-label="Melin_clo, naar de homepage"
    >
      {content}
    </Link>
  );
}
