import type { ReactNode } from 'react';

/**
 * Uitklapbare blokken, gebouwd op <details> en <summary>. Die zijn van zichzelf
 * al bedienbaar met het toetsenbord en werken ook zonder JavaScript.
 */

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="border-t border-line">{children}</div>;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.9375rem] text-ink marker:hidden [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span
          aria-hidden="true"
          className="relative h-3 w-3 shrink-0 text-accent-ink transition-transform duration-200 ease-[cubic-bezier(0.2,0,0.2,1)] group-open:rotate-45"
        >
          <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
          <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current" />
        </span>
      </summary>
      <div className="pb-5 text-[0.9375rem] leading-relaxed text-ink-soft">{children}</div>
    </details>
  );
}
