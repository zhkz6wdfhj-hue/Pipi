/**
 * Serverkant van het afrekenen: de mand opnieuw opbouwen uit de catalogus, de
 * bestelling bewaren en de betaling afronden.
 *
 * Belangrijk: prijzen komen NOOIT uit de browser. De klant stuurt alleen welk
 * product, welke kleur, welke maat en hoeveel; alle bedragen rekenen we hier
 * opnieuw uit. Zo kan er niet met de prijs geknoeid worden.
 */

import { calculateTotals, cartItemId, validateCart, type CartItem } from './cart';
import { addWorkingDays } from './format';
import { sendOrderEmails } from './email/send';
import { updateOrder, type Order, type OrderStatus } from './orders';
import { COLORS, getProductBySlug, SIZES, type ColorSlug, type Size } from '@/data/products';
import { site, type CountryCode } from '@/data/site';

export interface IncomingLine {
  slug: string;
  color: string;
  size: string;
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
    const size = String(raw?.size ?? '') as Size;
    const quantity = Number(raw?.quantity ?? 0);

    if (!product || !(color in COLORS) || !(SIZES as readonly string[]).includes(size)) {
      problems.push('Er zat een artikel in je winkelmand dat we niet herkennen.');
      continue;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      problems.push(`Het aantal van ${product.name} klopt niet.`);
      continue;
    }

    const variant = product.variants.find((v) => v.color === color && v.size === size);
    if (!variant) {
      problems.push(`${product.name} bestaat niet in deze combinatie van kleur en maat.`);
      continue;
    }

    const image = product.images[0];
    items.push({
      id: cartItemId(product.slug, color, size),
      slug: product.slug,
      name: product.name,
      color,
      colorLabel: COLORS[color].label,
      size,
      price: product.price,
      quantity,
      image: image.src,
      imageAlt: image.alt,
      sku: variant.sku,
    });
  }

  // Nog één keer langs de voorraad, zodat uitverkochte maten niet doorglippen.
  const gecontroleerd = validateCart(items);
  return { items: gecontroleerd.items, problems: [...problems, ...gecontroleerd.problems] };
}

export function totalsFor(items: CartItem[], country: CountryCode, discountCode: string | null) {
  return calculateTotals(items, { country, discountCode });
}

/** Verwachte bezorgperiode, gerekend in werkdagen vanaf vandaag. */
export function expectedDelivery(country: CountryCode): { from: string; to: string } {
  const vandaag = new Date();
  const min = country === 'BE' ? site.delivery.beDaysMin : site.delivery.nlDaysMin;
  const max = country === 'BE' ? site.delivery.beDaysMax : site.delivery.nlDaysMax;

  return {
    from: addWorkingDays(vandaag, site.delivery.handlingDays + min).toISOString(),
    to: addWorkingDays(vandaag, site.delivery.handlingDays + max).toISOString(),
  };
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
