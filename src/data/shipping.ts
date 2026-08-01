/**
 * Verzendkosten en de drempel voor gratis verzending.
 * Bedragen in centen. Pas ze hier aan, dan volgen de winkelmand, het afrekenen
 * en de bevestigingsmail vanzelf.
 */

import type { CountryCode } from './site';

export const FREE_SHIPPING_THRESHOLD = 15000; // € 150,00

export const SHIPPING_RATES: Record<CountryCode, number> = {
  NL: 495, // € 4,95
  BE: 795, // € 7,95
};

export function shippingCost(country: CountryCode, subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_RATES[country] ?? SHIPPING_RATES.NL;
}

/** Wat er nog te gaan is tot gratis verzending. 0 betekent: gehaald. */
export function amountUntilFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}
