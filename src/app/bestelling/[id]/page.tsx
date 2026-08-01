import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { site } from '@/data/site';
import { formatDateShort, formatPrice } from '@/lib/format';
import { paymentMethodLabel } from '@/lib/mollie';
import { getOrder } from '@/lib/orders';
import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = pageMetadata({
  title: 'Bedankt voor je bestelling',
  description: 'Je bestelling is ontvangen. Hier vind je het ordernummer en de verwachte levering.',
  path: '/bestelling',
  noindex: true,
});

export default async function BestellingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const gelukt = order.status === 'betaald';

  return (
    <div className="container-page py-12 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {gelukt ? (
          <>
            <p className="label-caps mb-4 text-accent-ink">Bestelling ontvangen</p>
            <h1 className="display-xl mb-5">Bedankt, {order.customer.firstName}</h1>
            <p className="max-w-2xl text-lead leading-relaxed text-ink-soft">
              We hebben je betaling binnen en zijn je pakket aan het klaarmaken. Er is een
              bevestiging onderweg naar{' '}
              <span className="text-ink">{order.customer.email}</span>. Zit die er over tien minuten
              nog niet bij, kijk dan even in je ongewenste post.
            </p>
          </>
        ) : (
          <>
            <p className="label-caps mb-4 text-error">Betaling niet afgerond</p>
            <h1 className="display-xl mb-5">De betaling is niet gelukt</h1>
            <p className="max-w-2xl text-lead leading-relaxed text-ink-soft">
              Je bestelling staat wel klaar onder nummer {order.number}, maar er is nog niet
              betaald. Je kunt het opnieuw proberen; is er iets onduidelijk, mail dan naar{' '}
              <a href={`mailto:${site.email}`} className="link-underlined text-accent-ink">
                {site.email}
              </a>
              .
            </p>
            <p className="mt-6">
              <Link
                href="/collectie"
                className="inline-block rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
              >
                Terug naar de collectie
              </Link>
            </p>
          </>
        )}

        {/* Kerngegevens */}
        <dl className="mt-10 grid gap-6 border-y border-line py-6 sm:grid-cols-3">
          <div>
            <dt className="label-caps mb-1.5 text-ink-soft">Ordernummer</dt>
            <dd className="text-[1.0625rem]">{order.number}</dd>
          </div>
          <div>
            <dt className="label-caps mb-1.5 text-ink-soft">Besteld op</dt>
            <dd className="text-[1.0625rem]">{formatDateShort(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="label-caps mb-1.5 text-ink-soft">
              {gelukt ? 'Verwachte bezorging' : 'Status'}
            </dt>
            <dd className="text-[1.0625rem]">
              {gelukt
                ? `${formatDateShort(order.deliveryFrom)} – ${formatDateShort(order.deliveryTo)}`
                : 'Wacht op betaling'}
            </dd>
          </div>
        </dl>

        {/* Samenvatting */}
        <section aria-labelledby="samenvatting-titel" className="mt-12">
          <h2 id="samenvatting-titel" className="display-md mb-6">
            Wat je hebt besteld
          </h2>

          <ul className="divide-y divide-line border-y border-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <Link href={`/product/${item.slug}`} className="block w-20 shrink-0 bg-bg">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    width={1200}
                    height={1500}
                    sizes="80px"
                    className="ratio-portrait h-full w-full object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="display-sm">
                      <Link href={`/product/${item.slug}`} className="link-quiet">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-[0.875rem] text-ink-soft">
                      {item.colorLabel} · maat {item.size} · {item.quantity} stuks
                    </p>
                  </div>
                  <p className="shrink-0 text-[0.9375rem]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <dl className="space-y-2 text-[0.9375rem]">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotaal</dt>
                <dd>{formatPrice(order.totals.subtotal)}</dd>
              </div>
              {order.totals.discount > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Korting ({order.totals.discountCode})</dt>
                  <dd className="text-accent-ink">– {formatPrice(order.totals.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Verzending</dt>
                <dd>
                  {order.totals.shipping === 0 ? 'Gratis' : formatPrice(order.totals.shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-[1rem]">
                <dt>Totaal</dt>
                <dd>{formatPrice(order.totals.total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Waarvan btw (21%)</dt>
                <dd className="text-ink-soft">
                  {formatPrice(Math.round(order.totals.total - order.totals.total / 1.21))}
                </dd>
              </div>
            </dl>

            <div className="text-[0.9375rem] leading-relaxed text-ink-soft">
              <h3 className="label-caps mb-2 text-ink">Bezorgadres</h3>
              <p>
                {order.customer.firstName} {order.customer.lastName}
                <br />
                {order.customer.street} {order.customer.houseNumber}
                {order.customer.addition ? ` ${order.customer.addition}` : ''}
                <br />
                {order.customer.postalCode} {order.customer.city}
                <br />
                {order.customer.country === 'BE' ? 'België' : 'Nederland'}
              </p>
              <h3 className="label-caps mt-5 mb-2 text-ink">Betaalwijze</h3>
              <p>{paymentMethodLabel(order.paymentMethod)}</p>
            </div>
          </div>
        </section>

        {/* Wat er nu gebeurt */}
        {gelukt ? (
          <section aria-labelledby="vervolg-titel" className="section-t">
            <h2 id="vervolg-titel" className="display-md mb-6">
              Wat er nu gebeurt
            </h2>

            <ol className="space-y-6 border-t border-line pt-6">
              <Stap
                nummer={1}
                titel="We pakken je bestelling in"
                tekst="Meestal dezelfde dag nog, in elk geval op de eerstvolgende werkdag. De jas gaat in een stofzak en daarna in een doos."
              />
              <Stap
                nummer={2}
                titel="Je krijgt het volgnummer"
                tekst={`Zodra het pakket bij de vervoerder ligt, sturen we je een mail met de link waarmee je het kunt volgen.`}
              />
              <Stap
                nummer={3}
                titel="Bezorging"
                tekst={`Verwacht tussen ${formatDateShort(order.deliveryFrom)} en ${formatDateShort(order.deliveryTo)}. Het pakket past niet door de brievenbus, dus er moet iemand thuis zijn.`}
              />
              <Stap
                nummer={4}
                titel="Past het niet?"
                tekst={`Je hebt ${site.returnDays} dagen bedenktijd. In het pakket zit een retourformulier; op de pagina over retourneren staat precies hoe het werkt.`}
              />
            </ol>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-line pt-6 text-[0.9375rem]">
              <Link href="/service/retourneren" className="link-underlined">
                Retourneren en ruilen
              </Link>
              <Link href="/service/onderhoud" className="link-underlined">
                Onderhoud van wol
              </Link>
              <Link href="/contact" className="link-underlined">
                Een vraag stellen
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function Stap({ nummer, titel, tekst }: { nummer: number; titel: string; tekst: string }) {
  return (
    <li className="grid grid-cols-[2rem_1fr] gap-4">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-[0.75rem] text-accent-ink"
      >
        {nummer}
      </span>
      <div>
        <h3 className="mb-1 text-[1rem] text-ink">{titel}</h3>
        <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{tekst}</p>
      </div>
    </li>
  );
}
