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

      <SceneMedia
        src="/images/sfeer-atelier-01.jpg"
        alt="Kameelkleurige wollen jas met brede revers, van dichtbij gefotografeerd in het najaarslicht."
        width={1800}
        height={1200}
        priority
        sizes="(min-width: 1240px) 1176px, 100vw"
      />

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

          <h2>De wol</h2>
          <p>
            De stof komt van een spinnerij in het noorden van Portugal, een familiebedrijf dat al
            drie generaties weeft. De scheerwol is Europees, de kasjmier en alpaca die we bijmengen
            komen via dezelfde spinnerij binnen. In hetzelfde stadje zit het atelier dat de jassen
            naait; stof en naaiwerk liggen dus geen honderden kilometers uit elkaar.
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
