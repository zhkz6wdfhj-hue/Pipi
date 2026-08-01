'use client';

/**
 * De winkelmand als zijlade. Dezelfde inhoud staat ook op /winkelmand als
 * volwaardige pagina; deze lade is er voor het snelle kijkje tussendoor.
 */

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { useCart } from '@/context/cart-context';
import { amountUntilFreeShipping } from '@/data/shipping';
import { formatPrice } from '@/lib/format';

export function CartDrawer() {
  const { drawerOpen, closeDrawer, items, totals, removeItem, setQuantity } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!drawerOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeDrawer();
        return;
      }

      // De focus blijft binnen de lade zolang die open is.
      if (event.key !== 'Tab' || !panel.current) return;

      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus();
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  const teGaan = amountUntilFreeShipping(totals.subtotal - totals.discount);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Winkelmand sluiten"
        onClick={closeDrawer}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/15"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="winkelmandlade-titel"
        className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-surface shadow-float"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="winkelmandlade-titel" className="display-sm">
            Winkelmand
          </h2>
          <button
            ref={closeButton}
            type="button"
            onClick={closeDrawer}
            className="-mr-2 flex h-10 w-10 items-center justify-center text-ink"
          >
            <span className="sr-only">Winkelmand sluiten</span>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-ink-soft">Je winkelmand is nog leeg.</p>
            <Link
              href="/collectie"
              onClick={closeDrawer}
              className="rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
            >
              Bekijk de collectie
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={closeDrawer}
                    className="block w-20 shrink-0 overflow-hidden bg-bg"
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      width={1200}
                      height={1500}
                      sizes="80px"
                      className="ratio-portrait h-full w-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="link-quiet block truncate text-[0.9375rem] text-ink"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-[0.8125rem] text-ink-soft">
                          {item.colorLabel} · maat {item.size}
                        </p>
                      </div>
                      <p className="shrink-0 text-[0.9375rem] text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QuantityStepper
                        value={item.quantity}
                        label={`${item.name}, maat ${item.size}`}
                        onChange={(quantity) => setQuantity(item.id, quantity)}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="link-underlined text-[0.8125rem] text-ink-soft"
                      >
                        Verwijderen
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-5 py-5">
              {teGaan > 0 ? (
                <p className="mb-4 border border-line bg-bg px-3.5 py-2.5 text-[0.8125rem] text-ink-soft">
                  Nog {formatPrice(teGaan)} tot gratis verzending.
                </p>
              ) : (
                <p className="mb-4 border border-line bg-bg px-3.5 py-2.5 text-[0.8125rem] text-ink-soft">
                  Je bestelling wordt gratis verzonden.
                </p>
              )}

              <dl className="mb-4 space-y-1.5 text-[0.9375rem]">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotaal</dt>
                  <dd className="text-ink">{formatPrice(totals.subtotal)}</dd>
                </div>
                {totals.discount > 0 ? (
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Korting ({totals.discountCode})</dt>
                    <dd className="text-accent-ink">– {formatPrice(totals.discount)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Verzending</dt>
                  <dd className="text-ink">
                    {totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)}
                  </dd>
                </div>
              </dl>

              <div className="mb-4 flex justify-between border-t border-line pt-3 text-[1rem]">
                <span>Totaal</span>
                <span>{formatPrice(totals.total)}</span>
              </div>

              <Link
                href="/afrekenen"
                onClick={closeDrawer}
                className="block w-full rounded-xs bg-button px-6 py-3.5 text-center text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
              >
                Afrekenen
              </Link>
              <Link
                href="/winkelmand"
                onClick={closeDrawer}
                className="mt-3 block text-center text-[0.875rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-accent"
              >
                Naar de winkelmand
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
