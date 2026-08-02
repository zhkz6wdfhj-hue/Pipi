import { NextResponse } from 'next/server';

import { expectedDelivery, rebuildCart, totalsFor } from '@/lib/checkout';
import { createPayment } from '@/lib/mollie';
import { createOrder, generateOrderId, updateOrder } from '@/lib/orders';
import { normalisePostalCode, validateCheckout } from '@/lib/validation';
import { site, type CountryCode } from '@/data/site';

/**
 * Maakt een bestelling aan en start de betaling.
 *
 * Antwoord: { redirectUrl } — daar stuurt de browser de klant naartoe. Dat is
 * het betaalscherm van Mollie, of de simulatiepagina als er nog geen sleutel
 * is ingesteld.
 */

export const runtime = 'nodejs';

interface Body {
  items?: unknown;
  discountCode?: string | null;
  method?: string;
  customer?: Record<string, unknown>;
}

export async function POST(request: Request) {
  let body: Body;

  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'We konden je bestelling niet lezen.' }, { status: 400 });
  }

  // 1. Winkelmand opnieuw opbouwen uit de catalogus.
  const { items, problems } = rebuildCart(body.items);

  if (items.length === 0) {
    return NextResponse.json(
      {
        error: 'Er staat niets meer in je winkelmand dat we kunnen leveren.',
        problems,
      },
      { status: 400 }
    );
  }

  if (problems.length > 0) {
    return NextResponse.json({ error: problems[0], problems }, { status: 409 });
  }

  // 2. Klantgegevens controleren, met dezelfde regels als in de browser.
  const raw = body.customer ?? {};
  const country: CountryCode = raw.country === 'BE' ? 'BE' : 'NL';

  const customer = {
    email: String(raw.email ?? '').trim(),
    firstName: String(raw.firstName ?? '').trim(),
    lastName: String(raw.lastName ?? '').trim(),
    street: String(raw.street ?? '').trim(),
    houseNumber: String(raw.houseNumber ?? '').trim(),
    addition: String(raw.addition ?? '').trim(),
    postalCode: normalisePostalCode(String(raw.postalCode ?? ''), country),
    city: String(raw.city ?? '').trim(),
    country,
    phone: String(raw.phone ?? '').trim(),
    notes: String(raw.notes ?? '')
      .trim()
      .slice(0, 500),
    newsletter: raw.newsletter === true,
  };

  const fouten = validateCheckout({ ...customer, newsletter: customer.newsletter });
  if (Object.keys(fouten).length > 0) {
    return NextResponse.json(
      { error: Object.values(fouten)[0], problems: Object.values(fouten) },
      { status: 400 }
    );
  }

  // 3. Bedragen op de server uitrekenen.
  const discountCode = typeof body.discountCode === 'string' ? body.discountCode : null;
  const totals = totalsFor(items, country, discountCode);
  const bezorging = expectedDelivery();

  // 4. Bestelling bewaren.
  const id = generateOrderId();
  const methode = ['ideal', 'bancontact', 'creditcard'].includes(String(body.method))
    ? String(body.method)
    : 'ideal';

  const order = await createOrder({
    id,
    items,
    totals,
    customer,
    paymentId: null,
    paymentMethod: methode,
    deliveryFrom: bezorging.from,
    deliveryTo: bezorging.to,
    confirmationSentAt: null,
  });

  // 5. Betaling starten.
  const origin = new URL(request.url).origin;

  try {
    const betaling = await createPayment({
      orderId: order.id,
      orderNumber: order.number,
      amount: totals.total,
      description: `${site.name} bestelling ${order.number}`,
      redirectUrl: `${origin}/afrekenen/afronden?bestelling=${order.id}`,
      webhookUrl: `${origin}/api/mollie/webhook`,
      method: methode,
      email: customer.email,
    });

    // De betaal-id bewaren, zodat de webhook de bestelling straks terugvindt.
    await updateOrder(order.id, { paymentId: betaling.paymentId });

    return NextResponse.json({ redirectUrl: betaling.checkoutUrl, orderId: order.id });
  } catch (error) {
    console.error('De betaling kon niet gestart worden:', error);
    return NextResponse.json(
      {
        error:
          'De betaling kon niet gestart worden. Probeer het opnieuw of mail ons; je bestelling staat klaar.',
      },
      { status: 502 }
    );
  }
}
