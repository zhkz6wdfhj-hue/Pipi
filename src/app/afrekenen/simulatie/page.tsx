import { notFound } from 'next/navigation';

import { SimulationChoice } from '@/components/checkout/simulation-choice';
import { isMollieConfigured } from '@/lib/mollie';
import { getOrder } from '@/lib/orders';
import { formatPrice } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

/**
 * Nabootsing van het betaalscherm, voor als er nog geen Mollie-sleutel is
 * ingesteld. Zo kun je de hele bestelstroom doorlopen — inclusief de
 * bevestigingsmail en de bedankpagina — zonder een betaalaccount.
 *
 * Zodra MOLLIE_API_KEY gevuld is, komt de klant hier niet meer langs.
 */

export const dynamic = 'force-dynamic';

export const metadata = pageMetadata({
  title: 'Betaling (testmodus)',
  description: 'Nabootsing van het betaalscherm zolang er nog geen betaalprovider gekoppeld is.',
  path: '/afrekenen/simulatie',
  noindex: true,
});

export default async function SimulatiePage({
  searchParams,
}: {
  searchParams: Promise<{ bestelling?: string }>;
}) {
  const { bestelling } = await searchParams;
  if (!bestelling) notFound();

  const order = await getOrder(bestelling);
  if (!order) notFound();

  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-lg border border-line bg-surface p-8">
        <p className="label-caps mb-4 text-accent-ink">Testmodus</p>
        <h1 className="display-lg mb-4">Betaalscherm (nabootsing)</h1>

        <p className="mb-6 leading-relaxed text-ink-soft">
          Er is nog geen betaalprovider gekoppeld, dus dit scherm doet alsof. Kies hieronder hoe de
          betaling zou aflopen; de rest van de bestelling gaat daarna gewoon door, inclusief de
          bevestigingsmail.
        </p>

        <dl className="mb-8 border-y border-line py-4 text-[0.9375rem]">
          <div className="flex justify-between py-1">
            <dt className="text-ink-soft">Bestelling</dt>
            <dd>{order.number}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="text-ink-soft">Bedrag</dt>
            <dd>{formatPrice(order.totals.total)}</dd>
          </div>
        </dl>

        <SimulationChoice orderId={order.id} />

        {isMollieConfigured() ? null : (
          <p className="mt-6 text-[0.8125rem] leading-relaxed text-ink-soft">
            Vul <code className="text-ink">MOLLIE_API_KEY</code> in je <code className="text-ink">.env.local</code>{' '}
            om met het echte testscherm van Mollie te werken. In README.md staat hoe je dat doet.
          </p>
        )}
      </div>
    </div>
  );
}
