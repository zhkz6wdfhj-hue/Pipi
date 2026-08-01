/**
 * Kortingscodes.
 *
 * Voeg een code toe door een regel aan `discounts` toe te voegen. De code wordt
 * hoofdletterongevoelig vergeleken. Zet `active: false` om een code tijdelijk
 * uit te zetten zonder hem te verwijderen.
 *
 * - type 'percentage': `value` is het percentage, bijvoorbeeld 10 voor 10%.
 * - type 'bedrag': `value` is een bedrag in centen, bijvoorbeeld 2500 voor € 25,00.
 */

export interface Discount {
  code: string;
  type: 'percentage' | 'bedrag';
  value: number;
  /** Minimale bestelwaarde in centen voordat de code geldig is. */
  minimumSubtotal: number;
  /** Korte uitleg die de klant te zien krijgt zodra de code werkt. */
  label: string;
  active: boolean;
}

export const discounts: Discount[] = [
  {
    code: 'MELIN10',
    type: 'percentage',
    value: 10,
    minimumSubtotal: 0,
    label: '10% korting op je bestelling',
    active: true,
  },
];

export function findDiscount(code: string): Discount | undefined {
  const normalised = code.trim().toUpperCase();
  return discounts.find((discount) => discount.active && discount.code === normalised);
}

/** Kortingsbedrag in centen, nooit meer dan het subtotaal. */
export function discountAmount(discount: Discount, subtotal: number): number {
  if (subtotal < discount.minimumSubtotal) return 0;
  const amount =
    discount.type === 'percentage' ? Math.round((subtotal * discount.value) / 100) : discount.value;
  return Math.min(amount, subtotal);
}
