import { NextResponse } from 'next/server';

import { finalisePayment } from '@/lib/checkout';
import { isMollieConfigured } from '@/lib/mollie';
import { getOrder } from '@/lib/orders';

/**
 * Verwerkt de keuze uit het nagebootste betaalscherm. Werkt alleen zolang er
 * geen echte betaalprovider is ingesteld — anders zou je hiermee een bestelling
 * op betaald kunnen zetten zonder te betalen.
 */

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (isMollieConfigured()) {
    return NextResponse.json(
      { error: 'De simulatie is uitgeschakeld omdat er een betaalprovider is ingesteld.' },
      { status: 403 }
    );
  }

  const { orderId, uitkomst } = (await request.json()) as {
    orderId?: string;
    uitkomst?: string;
  };

  if (!orderId) {
    return NextResponse.json({ error: 'Geen bestelling opgegeven.' }, { status: 400 });
  }

  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: 'Deze bestelling bestaat niet.' }, { status: 404 });
  }

  const status = uitkomst === 'mislukt' ? 'mislukt' : 'betaald';
  await finalisePayment(order, status, 'simulatie');

  return NextResponse.json({ ok: true, status });
}
