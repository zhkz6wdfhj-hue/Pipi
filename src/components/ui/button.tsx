import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Knoppen. De primaire knop is donkerbruin met witte tekst en blijft klein van
 * oppervlak; de secundaire knop is wit met een haarlijn. Grote donkere vlakken
 * horen niet bij deze winkel.
 */

type Variant = 'primair' | 'secundair' | 'stil';
type Size = 'normaal' | 'klein' | 'breed';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xs font-sans transition-[opacity,background-color,border-color] duration-200 ease-[cubic-bezier(0.2,0,0.2,1)] disabled:cursor-not-allowed disabled:opacity-45';

const variants: Record<Variant, string> = {
  primair: 'bg-button text-white hover:bg-button-hover',
  secundair: 'bg-surface text-ink border border-line hover:border-line-strong',
  stil: 'bg-transparent text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent',
};

const sizes: Record<Size, string> = {
  normaal: 'px-6 py-3 text-[0.9375rem] leading-none',
  klein: 'px-4 py-2.5 text-[0.8125rem] leading-none',
  breed: 'w-full px-6 py-3.5 text-[0.9375rem] leading-none',
};

function classesFor(variant: Variant, size: Size, className?: string): string {
  return [base, variants[variant], variant === 'stil' ? '' : sizes[size], className]
    .filter(Boolean)
    .join(' ');
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = 'primair',
  size = 'normaal',
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classesFor(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primair',
  size = 'normaal',
  className,
  href,
  children,
  ...props
}: CommonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <Link href={href} className={classesFor(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
