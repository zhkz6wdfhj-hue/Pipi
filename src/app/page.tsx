import Link from 'next/link';

import { ProductCard } from '@/components/product/product-card';
import { ButtonLink } from '@/components/ui/button';
import { SceneMedia } from '@/components/ui/media';
import { getFeaturedProducts } from '@/data/products';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: `${site.name} — lange wollen jassen en blazers`,
  description:
    'Lange wollen jassen en blazers, na je bestelling op maat gemaakt. Warme wol, rustige kleuren en een pasvorm die van jou alleen is. Levering binnen vier tot zes weken in Nederland en België.',
  path: '/',
});

const beloftes = [
  {
    titel: 'Op maat',
    tekst:
      'Je kiest een model en een kleur; de maat nemen we daarna samen op. Vier tot zes weken later ligt er een jas die op jouw schouders is gebouwd.',
    href: '/service/op-maat',
    link: 'Hoe dat gaat',
  },
  {
    titel: 'Passend',
    tekst:
      'Zit hij niet zoals hij hoort, dan passen we hem kosteloos aan tot hij past. Ook de verzending heen en terug is dan voor ons.',
    href: '/service/passen-en-aanpassen',
    link: 'Passen en aanpassen',
  },
  {
    titel: 'Contact',
    tekst:
      'Twijfel je over de maat of wil je weten hoe een stof aanvoelt? Mail of stuur een bericht op Instagram. Meestal antwoorden we dezelfde dag.',
    href: '/contact',
    link: 'Neem contact op',
  },
];

export default function HomePage() {
  const uitgelicht = getFeaturedProducts(4);

  return (
    <>
      {/* Sfeerbeeld met één zin en één knop */}
      <section className="container-page pt-6 lg:pt-10">
        <SceneMedia
          src="/images/sfeer-atelier-01.jpg"
          alt="Het atelier aan de gracht: paspoppen met wollen jassen, een rek met modellen, een werktafel vol patronen en een naaimachine, met uitzicht op Amsterdamse grachtenpanden."
          width={1800}
          height={1200}
          priority
          sizes="(min-width: 1240px) 1176px, 100vw"
        />

        <div className="mt-8 flex flex-col gap-6 lg:mt-10 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="display-xl max-w-2xl text-balance">
            Wollen jassen die hier op jouw maat worden gemaakt, en daarna jaren meegaan.
          </h1>
          <ButtonLink href="/collectie" className="self-start lg:self-auto">
            Bekijk de collectie
          </ButtonLink>
        </div>
      </section>

      {/* Uitgelichte producten */}
      <section className="section-t container-page" aria-labelledby="uitgelicht-titel">
        <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-4">
          <h2 id="uitgelicht-titel" className="display-md">
            Uitgelicht
          </h2>
          <Link href="/collectie" className="link-underlined shrink-0 text-[0.9375rem] text-ink-soft">
            Alles bekijken
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {uitgelicht.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              sizes="(min-width: 1024px) 280px, 47vw"
            />
          ))}
        </div>
      </section>

      {/* Over het merk, kort */}
      <section className="section-t container-page" aria-labelledby="over-titel">
        <div className="grid gap-10 border-t border-line pt-12 lg:grid-cols-2 lg:gap-16 lg:pt-16">
          <div className="max-w-xl">
            <h2 id="over-titel" className="display-lg mb-5">
              Klein gehouden, met opzet
            </h2>
            <p className="text-lead leading-relaxed text-ink-soft">
              Mèlin begon in 2022 met één jas en een telefoon vol foto&apos;s. Inmiddels
              werken we vanuit een atelier aan de gracht: daar liggen de patronen, daar hangen de
              modellen, en daar passen we. We maken niets vooruit — elke jas wordt pas gesneden als
              er iemand is die hem gaat dragen, naar diens maten.
            </p>
            <Link href="/over" className="link-underlined mt-6 inline-block text-[0.9375rem]">
              Lees het hele verhaal
            </Link>
          </div>

          <SceneMedia
            src="/images/sfeer-collectie-01.jpg"
            alt="Een lange wollen jas in poederkleur, gedragen op straat langs een modern gebouw."
            width={1800}
            height={1200}
            sizes="(min-width: 1024px) 570px, 100vw"
          />
        </div>
      </section>

      {/* Drie beloftes */}
      <section className="section container-page" aria-labelledby="beloftes-titel">
        <h2 id="beloftes-titel" className="sr-only">
          Op maat, passend en contact
        </h2>
        <div className="grid gap-8 border-t border-line pt-12 sm:grid-cols-3 sm:gap-10 lg:pt-16">
          {beloftes.map((belofte) => (
            <div key={belofte.titel}>
              <h3 className="label-caps mb-3 text-ink">{belofte.titel}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{belofte.tekst}</p>
              <Link href={belofte.href} className="link-underlined mt-3 inline-block text-[0.875rem]">
                {belofte.link}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
