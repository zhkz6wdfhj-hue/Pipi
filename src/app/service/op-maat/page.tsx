import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { SceneMedia } from '@/components/ui/media';
import { layeringOptions, measurements } from '@/data/measurements';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Op maat gemaakt',
  description:
    'Elke jas en blazer van Mèlin wordt na de bestelling op maat gemaakt. Hoe het opnemen van de maten gaat, welke maten we nodig hebben en hoe lang het duurt.',
  path: '/service/op-maat',
});

export default function OpMaatPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Op maat gemaakt"
        intro="We werken niet met confectiematen. Je bestelt eerst, daarna nemen we de maten op en gaat je jas in productie. Dat duurt langer dan iets van de plank, en daar krijg je een kledingstuk voor terug dat om jouw schouders is gebouwd."
        breadcrumb={[
          { label: 'Klantenservice', href: '/klantenservice' },
          { label: 'Op maat gemaakt', href: '/service/op-maat' },
        ]}
      />

      <SceneMedia
        src="/images/sfeer-atelier-01.jpg"
        alt="Het atelier aan de gracht, met de werktafel waarop de patronen liggen en het rek met modellen om te passen."
        width={1800}
        height={1200}
        priority
        sizes="(min-width: 1240px) 1176px, 100vw"
        className="mb-12 lg:mb-16"
      />

      <div className="prose-melin">
        <h2 className="!mt-0">Hoe het gaat</h2>
        <ol>
          <li>
            <strong>Je bestelt.</strong> Je kiest een model en een kleur, verder niets. Er is geen
            maat om aan te klikken.
          </li>
          <li>
            <strong>Wij nemen contact op.</strong> Binnen {site.delivery.contactWithinDays} werkdagen
            na je bestelling, per mail of telefoon. We lopen de maten samen door.
          </li>
          <li>
            <strong>Je meet jezelf op, of we doen het samen.</strong> Met een meetlint en iemand die
            helpt lukt het thuis prima; hieronder staat precies wat we nodig hebben. Woon je in de
            buurt van Amsterdam, dan kun je ook langskomen in het atelier — bij daglicht zie je
            meteen hoe een stof er echt uitziet.
          </li>
          <li>
            <strong>Het atelier gaat aan de slag.</strong> Reken op {site.delivery.weeksMin} tot{' '}
            {site.delivery.weeksMax} weken van bestelling tot bezorging.
          </li>
          <li>
            <strong>Past het niet meteen?</strong> Dan passen we hem kosteloos aan. Zie{' '}
            <Link href="/service/passen-en-aanpassen">passen en aanpassen</Link>.
          </li>
        </ol>

        <h2>Welke maten we nodig hebben</h2>
        <p>
          Zeven maten, allemaal in centimeters. Meet over je ondergoed of een dun hemd, niet over een
          trui — de ruimte die daarvoor nodig is rekenen we er zelf bij op.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem]">
            <caption className="sr-only">De maten die we opnemen en hoe je ze meet</caption>
            <thead>
              <tr>
                <th scope="col">Maat</th>
                <th scope="col">Hoe je hem opneemt</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((maat) => (
                <tr key={maat.label}>
                  <th scope="row" className="text-left font-normal text-ink">
                    {maat.label}
                  </th>
                  <td>{maat.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Wat je eronder draagt</h2>
        <p>
          Een jas die perfect zit over een blouse, zit te krap over een gebreide trui. We vragen je
          daarom wat je er meestal onder draagt:
        </p>
        <ul>
          {layeringOptions.map((optie) => (
            <li key={optie}>{optie}</li>
          ))}
        </ul>
        <p>
          Twijfel je, kies dan de dikste laag die je in gedachten hebt. Ruimte weghalen is makkelijker
          dan ruimte toevoegen.
        </p>

        <h2>Wat er niet verandert</h2>
        <p>
          De modellen liggen vast: de lijn, de sluiting, de zakken en de stof zijn zoals ze op de
          productpagina staan. Wat we aanpassen zijn de maten en de lengte. Wil je een model in een
          kleur die er niet bij staat, of een andere lengte dan gebruikelijk, vraag het dan even —
          soms kan het.
        </p>

        <h2>Twijfel je over een model?</h2>
        <p>
          Stuur ons je lengte en wat je normaal draagt, dan denken we mee vóórdat je bestelt. Dat kan
          via het <Link href="/contact">contactformulier</Link> of met een bericht op{' '}
          <a href={site.instagram.url} rel="noopener noreferrer" target="_blank">
            Instagram
          </a>
          .
        </p>
      </div>
    </div>
  );
}
