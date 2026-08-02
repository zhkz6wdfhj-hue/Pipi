'use client';

/**
 * Kleur kiezen en in de winkelmand.
 *
 * Er is geen maatkeuze: elk kledingstuk wordt na de bestelling op maat gemaakt.
 * We nemen daarna zelf contact op om de maten door te nemen. Dat staat hier ook
 * met zoveel woorden, zodat niemand zich afvraagt waar de maten zijn gebleven.
 */

import { useState } from 'react';

import { useCart } from '@/context/cart-context';
import { COLORS, type ColorSlug, type Product } from '@/data/products';
import { site } from '@/data/site';
import { formatPrice } from '@/lib/format';

export function ProductBuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [kleur, setKleur] = useState<ColorSlug>(product.colors[0]);

  return (
    <div>
      <p className="text-lead text-ink">{formatPrice(product.price)}</p>
      <p className="mt-1 text-[0.8125rem] text-ink-soft">
        Inclusief btw en het maken op maat. Verzendkosten bij het afrekenen.
      </p>

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
              onClick={() => setKleur(optie)}
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

      {/* Maatwerk */}
      <div className="mt-8 border border-line bg-surface p-5">
        <h2 className="label-caps mb-2 text-ink">Op jouw maat</h2>
        <p className="text-[0.875rem] leading-relaxed text-ink-soft">
          Je kiest hier geen confectiemaat. Binnen {site.delivery.contactWithinDays} werkdagen na je
          bestelling nemen we contact op om je maten door te nemen — dat kan per mail, of we spreken
          af. Daarna gaat de jas in productie.
        </p>
        <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-soft">
          Reken op {site.delivery.weeksMin} tot {site.delivery.weeksMax} weken van bestelling tot
          bezorging.
        </p>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => addItem(product, kleur)}
          className="w-full max-w-[20rem] rounded-xs bg-button px-6 py-3.5 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
        >
          In winkelmand
        </button>

        <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-soft">
          Zit hij niet zoals hij hoort? Dan passen we hem kosteloos aan tot hij past.
        </p>
      </div>
    </div>
  );
}
