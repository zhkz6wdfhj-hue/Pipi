/**
 * Rekenwerk van de winkelmand. Bewust vrij van React, zodat zowel de client
 * (de mand in de browser) als de server (het afrekenen en de bevestigingsmail)
 * met exact dezelfde bedragen werkt.
 *
 * Alle bedragen zijn hele centen.
 */

import { discountAmount, findDiscount } from '@/data/discounts';
import { getProductBySlug, type ColorSlug } from '@/data/products';
import { shippingCost } from '@/data/shipping';
import type { CountryCode } from '@/data/site';

export interface CartItem {
  /** Unieke sleutel binnen de mand: slug-kleur. Maten spelen geen rol; alles
      wordt na de bestelling op maat gemaakt. */
  id: string;
  slug: string;
  name: string;
  color: ColorSlug;
  colorLabel: string;
  /** Stukprijs in centen op het moment van toevoegen. */
  price: number;
  quantity: number;
  image: string;
  imageAlt: string;
  sku: string;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  discountCode: string | null;
  discountLabel: string | null;
  shipping: number;
  total: number;
  itemCount: number;
}

export function cartItemId(slug: string, color: ColorSlug): string {
  return `${slug}-${color}`;
}

export function countItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function subtotalOf(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function calculateTotals(
  items: CartItem[],
  options: { country?: CountryCode; discountCode?: string | null } = {}
): CartTotals {
  const { country = 'NL', discountCode = null } = options;

  const subtotal = subtotalOf(items);
  const discount = discountCode ? findDiscount(discountCode) : undefined;
  const discountValue = discount ? discountAmount(discount, subtotal) : 0;
  const shipping = items.length === 0 ? 0 : shippingCost(country, subtotal - discountValue);

  return {
    subtotal,
    discount: discountValue,
    discountCode: discount && discountValue > 0 ? discount.code : null,
    discountLabel: discount && discountValue > 0 ? discount.label : null,
    shipping,
    total: Math.max(0, subtotal - discountValue) + shipping,
    itemCount: countItems(items),
  };
}

/**
 * Controleert een mand tegen de actuele catalogus. Wordt gebruikt bij het
 * afrekenen, zodat er nooit iets besteld kan worden dat niet meer bestaat of
 * waarvan de prijs inmiddels veranderd is.
 *
 * Voorraad speelt geen rol: elk kledingstuk wordt na de bestelling gemaakt.
 */
export function validateCart(items: CartItem[]): {
  valid: boolean;
  items: CartItem[];
  problems: string[];
} {
  const problems: string[] = [];
  const validated: CartItem[] = [];

  for (const item of items) {
    const product = getProductBySlug(item.slug);
    if (!product) {
      problems.push(`${item.name} is niet meer beschikbaar en is uit je winkelmand gehaald.`);
      continue;
    }

    if (!product.colors.includes(item.color)) {
      problems.push(
        `${product.name} maken we niet meer in ${item.colorLabel.toLowerCase()}; kies een andere kleur.`
      );
      continue;
    }

    validated.push({ ...item, price: product.price, name: product.name });
  }

  return { valid: problems.length === 0, items: validated, problems };
}
