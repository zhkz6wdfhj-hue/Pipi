'use client';

/**
 * De winkelmand als volwaardige pagina. Dezelfde gegevens als in de zijlade,
 * met wat meer ruimte: kortingscode, verzendkosten per land en het bedrag dat
 * nog te gaan is tot gratis verzending.
 */

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { useCart } from '@/context/cart-context';
import { findDiscount } from '@/data/discounts';
import { amountUntilFreeShipping, FREE_SHIPPING_THRESHOLD } from '@/data/shipping';
import { countries } from '@/data/site';
import type { CountryCode } from '@/data/site';
import { formatPrice } from '@/lib/format';

export function CartView() {
  const {
    items,
    totals,
    hydrated,
    removeItem,
    setQuantity,
    applyDiscount,
    discountCode,
    country,
    setCountry,
  } = useCart();

  const [code, setCode] = useState('');
  const [codeFout, setCodeFout] = useState<string | null>(null);

  if (!hydrated) {
    return <p className="py-16 text-ink-soft">Je winkelmand wordt geladen.</p>;
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center lg:py-24">
        <h2 className="display-md mb-3">Je winkelmand is leeg</h2>
        <p className="mx-auto mb-7 max-w-md leading-relaxed text-ink-soft">
          Zodra je een jas of blazer toevoegt, verschijnt hij hier. De inhoud blijft bewaard, ook
          als je de pagina sluit en later terugkomt.
        </p>
        <Link
          href="/collectie"
          className="inline-block rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
        >
          Bekijk de collectie
        </Link>
      </div>
    );
  }

  function pasCodeToe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const ingevoerd = code.trim();
    if (ingevoerd.length === 0) {
      setCodeFout('Vul een kortingscode in.');
      return;
    }

    const korting = findDiscount(ingevoerd);
    if (!korting) {
      setCodeFout('Deze kortingscode kennen we niet. Let op hoofdletters en spaties.');
      return;
    }

    setCodeFout(null);
    applyDiscount(korting.code);
    setCode('');
  }

  const teGaan = amountUntilFreeShipping(totals.subtotal - totals.discount);
  const voortgang = Math.min(
    100,
    Math.round(((totals.subtotal - totals.discount) / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
      {/* Artikelen */}
      <section aria-labelledby="artikelen-titel">
        <h2 id="artikelen-titel" className="sr-only">
          Artikelen in je winkelmand
        </h2>

        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-6 sm:gap-6">
              <Link href={`/product/${item.slug}`} className="block w-24 shrink-0 bg-bg sm:w-32">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  width={1200}
                  height={1500}
                  sizes="(min-width: 640px) 128px, 96px"
                  className="ratio-portrait h-full w-full object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="display-sm">
                      <Link href={`/product/${item.slug}`} className="link-quiet">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-[0.875rem] text-ink-soft">
                      {item.colorLabel} · maat {item.size}
                    </p>
                    <p className="mt-1 text-[0.875rem] text-ink-soft">
                      {formatPrice(item.price)} per stuk
                    </p>
                  </div>
                  <p className="shrink-0 text-[0.9375rem]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <QuantityStepper
                    value={item.quantity}
                    label={`${item.name}, maat ${item.size}`}
                    onChange={(quantity) => setQuantity(item.id, quantity)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="link-underlined text-[0.875rem] text-ink-soft"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6">
          <Link href="/collectie" className="link-underlined text-[0.9375rem] text-ink-soft">
            Verder kijken in de collectie
          </Link>
        </p>
      </section>

      {/* Overzicht */}
      <section aria-labelledby="overzicht-titel" className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-line bg-surface p-6">
          <h2 id="overzicht-titel" className="display-sm mb-5">
            Overzicht
          </h2>

          {/* Gratis verzending */}
          <div className="mb-6">
            <p className="mb-2 text-[0.875rem] text-ink-soft" aria-live="polite">
              {teGaan > 0
                ? `Nog ${formatPrice(teGaan)} tot gratis verzending.`
                : 'Je bestelling wordt gratis verzonden.'}
            </p>
            <div
              role="progressbar"
              aria-valuenow={voortgang}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Voortgang tot gratis verzending"
              className="h-px w-full bg-line"
            >
              <div className="h-px bg-accent transition-[width] duration-200" style={{ width: `${voortgang}%` }} />
            </div>
          </div>

          {/* Kortingscode */}
          <form onSubmit={pasCodeToe} className="mb-6 border-b border-line pb-6" noValidate>
            <label htmlFor="kortingscode" className="mb-1.5 block text-[0.875rem] text-ink">
              Kortingscode
            </label>
            <div className="flex gap-2">
              <input
                id="kortingscode"
                name="kortingscode"
                type="text"
                autoComplete="off"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  if (codeFout) setCodeFout(null);
                }}
                aria-invalid={codeFout ? true : undefined}
                aria-describedby={codeFout ? 'kortingscode-fout' : undefined}
                placeholder="Bijvoorbeeld MELIN10"
                className={`w-full rounded-xs border bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-soft/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  codeFout ? 'border-error' : 'border-line hover:border-line-strong'
                }`}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xs border border-line bg-surface px-4 py-2.5 text-[0.875rem] text-ink transition-colors duration-200 hover:border-line-strong"
              >
                Toepassen
              </button>
            </div>

            {codeFout ? (
              <p id="kortingscode-fout" aria-live="polite" className="mt-1.5 text-[0.8125rem] text-error">
                {codeFout}
              </p>
            ) : null}

            {discountCode && totals.discount > 0 ? (
              <p className="mt-2.5 flex items-center justify-between gap-3 text-[0.875rem] text-ink-soft">
                <span>
                  Code <span className="text-ink">{discountCode}</span> toegepast:{' '}
                  {totals.discountLabel?.toLowerCase()}.
                </span>
                <button
                  type="button"
                  onClick={() => applyDiscount(null)}
                  className="link-underlined shrink-0"
                >
                  Weghalen
                </button>
              </p>
            ) : null}
          </form>

          {/* Land */}
          <div className="mb-6">
            <label htmlFor="bezorgland" className="mb-1.5 block text-[0.875rem] text-ink">
              Bezorgland
            </label>
            <select
              id="bezorgland"
              name="bezorgland"
              value={country}
              onChange={(event) => setCountry(event.target.value as CountryCode)}
              className="w-full rounded-xs border border-line bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink hover:border-line-strong focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {countries.map((land) => (
                <option key={land.code} value={land.code}>
                  {land.label}
                </option>
              ))}
            </select>
          </div>

          <dl className="space-y-2 text-[0.9375rem]">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotaal</dt>
              <dd>{formatPrice(totals.subtotal)}</dd>
            </div>
            {totals.discount > 0 ? (
              <div className="flex justify-between">
                <dt className="text-ink-soft">Korting</dt>
                <dd className="text-accent-ink">– {formatPrice(totals.discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-ink-soft">Verzendkosten</dt>
              <dd>{totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[1rem]">Totaal</span>
            <span className="text-[1.0625rem]">{formatPrice(totals.total)}</span>
          </div>
          <p className="mt-1 text-[0.8125rem] text-ink-soft">Inclusief btw.</p>

          <Link
            href="/afrekenen"
            className="mt-6 block w-full rounded-xs bg-button px-6 py-3.5 text-center text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
          >
            Afrekenen
          </Link>

          <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-soft">
            Betalen kan met iDEAL, Bancontact of creditcard. Je gegevens gaan versleuteld naar de
            betaalprovider.
          </p>
        </div>
      </section>
    </div>
  );
}
