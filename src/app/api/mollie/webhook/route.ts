import { NextResponse } from 'next/server';

import { finalisePayment } from '@/lib/checkout';
import { getPayment, isMollieConfigured, toOrderStatus } from '@/lib/mollie';
import { getOrder, getOrderByPaymentId } from '@/lib/orders';

/**
 * Webhook van Mollie.
 *
 * Mollie stuurt hier alleen een betaal-id naartoe, nooit de uitkomst zelf. We
 * halen de status daarom altijd zelf op — zo kan niemand een betaling faken
 * door dit adres aan te roepen.
 *
 * Mollie kan een webhook op localhost niet bereiken; tijdens het ontwikkelen
 * wordt de status daarom opgehaald zodra de klant terugkeert van het
 * betaalscherm. Zie README.md, hoofdstuk "Betalingen live zetten".
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isMollieConfigured()) {
    return NextResponse.json({ ok: true, note: 'Mollie is niet ingesteld.' });
  }

  let paymentId: string | null = null;

  try {
    const form = await request.formData();
    paymentId = String(form.get('id') ?? '') || null;
  } catch {
    paymentId = null;
  }

  if (!paymentId) {
    return NextResponse.json({ error: 'Geen betaal-id ontvangen.' }, { status: 400 });
  }

  try {
    const betaling = await getPayment(paymentId);
    const order =
      (await getOrderByPaymentId(paymentId)) ??
      (betaling.orderId ? await getOrder(betaling.orderId) : null);

    if (!order) {
      // Mollie blijft het anders opnieuw proberen; 200 sluit de zaak netjes af.
      return NextResponse.json({ ok: true, note: 'Bestelling onbekend.' });
    }

    await finalisePayment(order, toOrderStatus(betaling.status), betaling.method ?? undefined);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook van Mollie kon niet verwerkt worden:', error);
    return NextResponse.json({ error: 'Verwerken mislukt.' }, { status: 500 });
  }
}
