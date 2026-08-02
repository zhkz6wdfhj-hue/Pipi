/**
 * Serverkant van het afrekenen: de mand opnieuw opbouwen uit de catalogus, de
 * bestelling bewaren en de betaling afronden.
 *
 * Belangrijk: prijzen komen NOOIT uit de browser. De klant stuurt alleen welk
 * product, welke kleur en hoeveel; alle bedragen rekenen we hier opnieuw uit.
 * Zo kan er niet met de prijs geknoeid worden.
 */

import { calculateTotals, cartItemId, validateCart, type CartItem } from './cart';

import { sendOrderEmails } from './email/send';
import { updateOrder, type Order, type OrderStatus } from './orders';
import { COLORS, getProductBySlug, type ColorSlug } from '@/data/products';
import { site, type CountryCode } from '@/data/site';

export interface IncomingLine {
  slug: string;
  color: string;
  quantity: number;
}

/** Bouwt de winkelmand opnieuw op vanuit de catalogus. */
export function rebuildCart(lines: unknown): { items: CartItem[]; problems: string[] } {
  if (!Array.isArray(lines) || lines.length === 0) {
    return { items: [], problems: ['Je winkelmand is leeg.'] };
  }

  const items: CartItem[] = [];
  const problems: string[] = [];

  for (const raw of lines as IncomingLine[]) {
    const product = getProductBySlug(String(raw?.slug ?? ''));
    const color = String(raw?.color ?? '') as ColorSlug;
    const quantity = Number(raw?.quantity ?? 0);

    if (!product || !(color in COLORS)) {
      problems.push('Er zat een artikel in je winkelmand dat we niet herkennen.');
      continue;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      problems.push(`Het aantal van ${product.name} klopt niet.`);
      continue;
    }

    const variant = product.variants.find((v) => v.color === color);
    if (!variant) {
      problems.push(`${product.name} maken we niet in deze kleur.`);
      continue;
    }

    const image = product.images[0];
    items.push({
      id: cartItemId(product.slug, color),
      slug: product.slug,
      name: product.name,
      color,
      colorLabel: COLORS[color].label,
      price: product.price,
      quantity,
      image: image.src,
      imageAlt: image.alt,
      sku: variant.sku,
    });
  }

  const gecontroleerd = validateCart(items);
  return { items: gecontroleerd.items, problems: [...problems, ...gecontroleerd.problems] };
}

export function totalsFor(items: CartItem[], country: CountryCode, discountCode: string | null) {
  return calculateTotals(items, { country, discountCode });
}

/**
 * Verwachte bezorgperiode. Alles wordt op maat gemaakt, dus we rekenen in weken
 * vanaf de besteldatum — niet in werkdagen vanaf de verzending.
 */
export function expectedDelivery(): { from: string; to: string } {
  const vanaf = new Date();
  vanaf.setDate(vanaf.getDate() + site.delivery.weeksMin * 7);

  const tot = new Date();
  tot.setDate(tot.getDate() + site.delivery.weeksMax * 7);

  return { from: vanaf.toISOString(), to: tot.toISOString() };
}

/**
 * Rondt een betaling af: status bijwerken en — als er echt betaald is — de
 * bevestigingsmail en het interne besteloverzicht versturen. De mail gaat er
 * hoogstens één keer uit, ook als de webhook en de terugkeerpagina elkaar
 * kruisen.
 */
export async function finalisePayment(
  order: Order,
  status: OrderStatus,
  paymentMethod?: string
): Promise<Order> {
  const alVerstuurd = Boolean(order.confirmationSentAt);
  const moetMailen = status === 'betaald' && !alVerstuurd;

  const bijgewerkt = await updateOrder(order.id, {
    status,
    paymentMethod: paymentMethod ?? order.paymentMethod,
    confirmationSentAt: moetMailen ? new Date().toISOString() : order.confirmationSentAt,
  });

  const resultaat = bijgewerkt ?? order;

  if (moetMailen) {
    try {
      await sendOrderEmails(resultaat);
    } catch (error) {
      console.error('De bevestigingsmail kon niet verstuurd worden:', error);
    }
  }

  return resultaat;
}
