import { notFound, redirect } from 'next/navigation';

import { finalisePayment } from '@/lib/checkout';
import { getPayment, isMollieConfigured, toOrderStatus } from '@/lib/mollie';
import { getOrder } from '@/lib/orders';

/**
 * Hier komt de klant terug uit het betaalscherm. We vragen de betaalprovider
 * hoe het is afgelopen, werken de bestelling bij en sturen door naar de
 * bedankpagina. Deze pagina toont zelf niets.
 */

export const dynamic = 'force-dynamic';

export default async function AfrondenPage({
  searchParams,
}: {
  searchParams: Promise<{ bestelling?: string }>;
}) {
  const { bestelling } = await searchParams;
  if (!bestelling) notFound();

  const order = await getOrder(bestelling);
  if (!order) notFound();

  if (order.status === 'betaald') {
    redirect(`/bestelling/${order.id}`);
  }

  if (isMollieConfigured() && order.paymentId) {
    try {
      const betaling = await getPayment(order.paymentId);
      await finalisePayment(order, toOrderStatus(betaling.status), betaling.method ?? undefined);
    } catch (error) {
      console.error('De betaalstatus kon niet opgehaald worden:', error);
    }
  }

  redirect(`/bestelling/${order.id}`);
}
