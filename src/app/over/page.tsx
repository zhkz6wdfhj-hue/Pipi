import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { SceneMedia } from '@/components/ui/media';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Over ons',
  description:
    'Hoe Melin_clo begon op Instagram, waar de wol vandaan komt en waarom we alles pas na de bestelling maken.',
  path: '/over',
});

export default function OverPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Over Melin_clo"
        intro="Een klein merk uit Amsterdam dat lange wollen jassen en blazers maakt. Weinig modellen, alles op maat gemaakt, en een voorkeur voor stof die je jarenlang blijft dragen."
        breadcrumb={[{ label: 'Over Melin_clo', href: '/over' }]}
      />

      <figure>
        <SceneMedia
          src="/images/sfeer-atelier-01.jpg"
          alt="Het atelier aan de gracht: paspoppen met wollen jassen, een rek met modellen, een werktafel vol patronen en een naaimachine, met uitzicht op Amsterdamse grachtenpanden."
          width={1800}
          height={1200}
          priority
          sizes="(min-width: 1240px) 1176px, 100vw"
        />
        <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-ink-soft">
          Het atelier aan de gracht. Links de paspoppen met de modellen van dit seizoen, in het
          midden de werktafel met de patronen, rechts het licht waar we op passen.
        </figcaption>
      </figure>

      <div className="section-t grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <h2 className="display-lg lg:sticky lg:top-28">Hoe het begon</h2>
        </div>

        <div className="prose-melin">
          <p>
            In het najaar van 2022 liet ik één jas maken omdat ik hem nergens kon vinden: lang,
            recht, van dikke wol, zonder capuchon en zonder logo. Een foto op Instagram leverde
            binnen een dag veertien berichten op met de vraag waar hij vandaan kwam. Toen ik uitlegde
            dat er maar één was, vroegen elf mensen of er meer konden komen.
          </p>
          <p>
            Zo is Melin_clo begonnen: met een berichtenmap in plaats van een winkel. Bestellingen
            gingen per direct message, betalingen per tikkie, en de maten hield ik bij in een
            schrift. Dat werkte prima tot een stuk of dertig jassen per seizoen. Daarna niet meer —
            vandaar deze site.
          </p>

          <h2>Het atelier</h2>
          <p>
            We werken vanuit een atelier aan een Amsterdamse gracht, op een verdieping met hoge
            ramen. Dat is geen bedrijfspand met een showroom, maar een werkruimte: aan de muur
            hangen de schetsen, op de tafel liggen de patronen en de rollen stof, en aan het rek
            hangt van elk model één exemplaar om te passen.
          </p>
          <p>
            Het noorderlicht is de reden dat we hier zitten. Wol verandert van kleur onder kunstlicht
            — een houtskoolgrijs kan zomaar blauw worden, kameel kan geel worden. Bij daglicht zie je
            wat je koopt, en dat scheelt teleurstellingen bij het uitpakken.
          </p>
          <p>
            Kom je uit de buurt, dan kun je hier langskomen om de maten te laten opnemen en de
            stoffen in het echt te zien. Woon je verder weg, dan doen we het per mail of telefoon;
            dat werkt in de praktijk net zo goed.
          </p>

          <h2>De wol</h2>
          <p>
            We kopen onze stof in bij Europese wevers en werken met scheerwol, aangevuld met kasjmier,
            alpaca of mohair — welke mengeling het wordt, verschilt per model en staat bij elk
            product vermeld. Rollen komen per stuk binnen en gaan hier op tafel; er ligt geen
            magazijn vol.
          </p>
          <p>
            Waarom wol en niet iets goedkopers? Omdat wol warm blijft als hij vochtig wordt, omdat
            hij nauwelijks gaat ruiken en omdat een goed geweven wollen jas na tien winters nog
            steeds hangt zoals hij hoort. Een polyester jas is na twee seizoenen pluizig. Dat is het
            hele verhaal.
          </p>

          <h2>Op maat, en niets vooruit</h2>
          <p>
            We maken niets vooruit. Elke jas wordt pas gesneden als er iemand is die hem gaat
            dragen, naar diens maten. Dat kost tijd — reken op vier tot zes weken — en het scheelt
            een magazijn vol kleding dat in maart met korting weg moet. Er blijft niets over, en we
            hoeven niets te vernietigen.
          </p>
          <p>
            Alle modellen kosten hetzelfde: € 400. Dat is de prijs van de stof, het patroon en het
            naaiwerk, plus de tijd om de maten op te nemen. Er zit geen tussenhandel op en geen
            budget voor advertenties. Wat je betaalt gaat naar de jas.
          </p>

          <h2>Instagram blijft</h2>
          <p>
            Deze site vervangt het bestellen via de berichtenmap, niet het contact. Op{' '}
            <a href={site.instagram.url} rel="noopener noreferrer" target="_blank">
              {site.instagram.handle}
            </a>{' '}
            staan de foto&apos;s van hoe de jassen er in het echt uitzien, gedragen door mensen met
            verschillende lengtes en bouw. Twijfel je over een model, stuur dan gerust een bericht;
            dat leest nog steeds dezelfde persoon.
          </p>
        </div>
      </div>

      <div className="section-t border-t border-line pt-12 lg:pt-16">
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/collectie"
            className="rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
          >
            Bekijk de collectie
          </Link>
          <Link href="/contact" className="link-underlined text-[0.9375rem]">
            Een vraag stellen
          </Link>
        </div>
      </div>
    </div>
  );
}
