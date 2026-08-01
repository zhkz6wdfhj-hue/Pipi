'use client';

/**
 * Kleur kiezen, maat kiezen, in de winkelmand.
 *
 * Uitverkochte maten blijven zichtbaar maar zijn uitgeschakeld: zo zie je in
 * één oogopslag wat er nog is, in plaats van je af te vragen waarom een maat
 * ineens verdwenen is.
 */

import { useState } from 'react';

import { useCart } from '@/context/cart-context';
import { COLORS, getStock, SIZES, type ColorSlug, type Product, type Size } from '@/data/products';
import { formatPrice } from '@/lib/format';

export function ProductBuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();

  const [kleur, setKleur] = useState<ColorSlug>(product.colors[0]);
  const [maat, setMaat] = useState<Size | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  const voorraad = maat ? getStock(product, kleur, maat) : 0;
  const allesUit = product.sizes.every((size) => getStock(product, kleur, size) === 0);

  function kiesKleur(nieuweKleur: ColorSlug) {
    setKleur(nieuweKleur);
    setFout(null);
    // Maat leegmaken als hij in de nieuwe kleur niet leverbaar is.
    if (maat && getStock(product, nieuweKleur, maat) === 0) setMaat(null);
  }

  function inWinkelmand() {
    if (!maat) {
      setFout('Kies eerst een maat.');
      return;
    }
    if (voorraad === 0) {
      setFout('Deze maat is uitverkocht.');
      return;
    }
    setFout(null);
    addItem(product, kleur, maat);
  }

  return (
    <div>
      <p className="text-lead text-ink">{formatPrice(product.price)}</p>
      <p className="mt-1 text-[0.8125rem] text-ink-soft">Inclusief btw. Verzendkosten bij het afrekenen.</p>

      {/* Kleur */}
      <div className="mt-8">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <span className="label-caps text-ink" id="kleur-label">
            Kleur
          </span>
          <span className="text-[0.875rem] text-ink-soft">{COLORS[kleur].label}</span>
        </div>
        <div role="radiogroup" aria-labelledby="kleur-label" className="flex flex-wrap gap-2.5">
          {product.colors.map((optie) => (
            <button
              key={optie}
              type="button"
              role="radio"
              aria-checked={kleur === optie}
              onClick={() => kiesKleur(optie)}
              className={`inline-flex items-center gap-2 rounded-xs border px-3 py-2 text-[0.875rem] transition-colors duration-200 ${
                kleur === optie
                  ? 'border-accent bg-accent-soft text-ink'
                  : 'border-line bg-surface text-ink-soft hover:border-line-strong'
              }`}
            >
              <span
                aria-hidden="true"
                className="block h-3 w-3 rounded-full border"
                style={{
                  backgroundColor: COLORS[optie].swatch,
                  borderColor: COLORS[optie].swatchBorder,
                }}
              />
              {COLORS[optie].label}
            </button>
          ))}
        </div>
      </div>

      {/* Maat */}
      <div className="mt-8">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <span className="label-caps text-ink" id="maat-label">
            Maat
          </span>
          <a href="#maattabel" className="link-underlined text-[0.875rem] text-ink-soft">
            Maattabel
          </a>
        </div>

        <div role="radiogroup" aria-labelledby="maat-label" className="grid grid-cols-5 gap-2">
          {SIZES.map((optie) => {
            const beschikbaar = getStock(product, kleur, optie) > 0;
            const gekozen = maat === optie;

            return (
              <button
                key={optie}
                type="button"
                role="radio"
                aria-checked={gekozen}
                disabled={!beschikbaar}
                onClick={() => {
                  setMaat(optie);
                  setFout(null);
                }}
                className={`relative rounded-xs border py-2.5 text-[0.875rem] transition-colors duration-200 ${
                  gekozen
                    ? 'border-accent bg-accent-soft text-ink'
                    : beschikbaar
                      ? 'border-line bg-surface text-ink hover:border-line-strong'
                      : 'cursor-not-allowed border-line bg-surface text-ink-soft/50'
                }`}
              >
                {optie}
                {!beschikbaar ? <span className="sr-only"> (uitverkocht)</span> : null}
                {!beschikbaar ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  >
                    <span className="block h-px w-8 rotate-[-24deg] bg-line-strong" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {allesUit ? (
          <p className="mt-3 text-[0.875rem] text-ink-soft">
            In deze kleur is alles uitverkocht. Kies een andere kleur of{' '}
            <a href="/contact" className="link-underlined text-accent-ink">
              laat weten
            </a>{' '}
            welke maat je zoekt.
          </p>
        ) : maat && voorraad > 0 && voorraad <= 2 ? (
          <p className="mt-3 text-[0.875rem] text-ink-soft">
            Nog {voorraad} op voorraad in maat {maat}.
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={inWinkelmand}
          disabled={allesUit}
          className="w-full max-w-[20rem] rounded-xs bg-button px-6 py-3.5 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-45"
        >
          {allesUit ? 'Uitverkocht' : 'In winkelmand'}
        </button>

        {fout ? (
          <p aria-live="polite" className="mt-2.5 text-[0.875rem] text-error">
            {fout}
          </p>
        ) : null}

        <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-soft">
          Gratis verzending vanaf € 150. Veertien dagen bedenktijd.
        </p>
      </div>
    </div>
  );
}
