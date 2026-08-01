import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Verzending en levering',
  description:
    'Verzendkosten € 4,95 binnen Nederland en € 7,95 naar België, gratis vanaf € 150. Levertijd, volgen en wat er gebeurt als je niet thuis bent.',
  path: '/service/verzending',
});

export default function VerzendingPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Verzending en levering"
        breadcrumb={[
          { label: 'Klantenservice', href: '/klantenservice' },
          { label: 'Verzending en levering', href: '/service/verzending' },
        ]}
      />

      <div className="prose-melin">
        <h2 className="!mt-0">Wat het kost</h2>
        <table>
          <caption className="sr-only">Verzendkosten per land</caption>
          <thead>
            <tr>
              <th scope="col">Bestemming</th>
              <th scope="col">Kosten</th>
              <th scope="col">Gratis vanaf</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nederland</td>
              <td>€ 4,95</td>
              <td>€ 150</td>
            </tr>
            <tr>
              <td>België</td>
              <td>€ 7,95</td>
              <td>€ 150</td>
            </tr>
          </tbody>
        </table>
        <p>
          De drempel voor gratis verzending geldt voor het bedrag ná aftrek van een eventuele
          kortingscode. In je winkelmand zie je precies hoeveel er nog te gaan is.
        </p>
        <p>
          Buiten Nederland en België verzenden we op dit moment niet. Woon je net over de grens en
          wil je toch iets bestellen, mail dan even; soms is er een oplossing.
        </p>

        <h2>Hoe lang het duurt</h2>
        <p>
          Bestel je op een werkdag vóór 15.00 uur, dan gaat je pakket dezelfde dag nog weg. Daarna
          duurt het naar Nederland {site.delivery.nlDaysMin} tot {site.delivery.nlDaysMax} werkdagen
          en naar België {site.delivery.beDaysMin} tot {site.delivery.beDaysMax} werkdagen. In de
          weken rond de feestdagen kan het een dag langer duren.
        </p>
        <p>
          Op de bedankpagina en in je bevestigingsmail staat een verwachte bezorgperiode. Zodra het
          pakket bij de vervoerder ligt, krijg je een tweede mail met het volgnummer.
        </p>

        <h2>Niet thuis</h2>
        <p>
          Een jas past niet door de brievenbus. Ben je niet thuis, dan probeert de bezorger het bij
          de buren of neemt hij het pakket mee naar een afhaalpunt in de buurt; dat staat op het
          kaartje in je brievenbus en in de mail van de vervoerder. Een pakket blijft daar meestal
          een week liggen.
        </p>
        <p>
          Wil je liever meteen naar een afhaalpunt of naar je werk? Zet het adres dan in het
          bezorgadres, of laat het weten bij de opmerking tijdens het afrekenen.
        </p>

        <h2>Verpakking</h2>
        <p>
          Elke jas gaat in een katoenen stofzak en daarna in een kartonnen doos. De stofzak is niet
          alleen verpakking: je kunt hem gebruiken om de jas in de zomer stofvrij op te hangen. In de
          doos zit ook het retourformulier.
        </p>

        <p>
          <Link href="/service/retourneren">Retourneren en ruilen</Link> ·{' '}
          <Link href="/contact">Een vraag stellen</Link>
        </p>
      </div>
    </div>
  );
}
