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
          kortingscode. Bij de huidige prijzen wordt die drempel altijd gehaald, dus in de praktijk
          betaal je niets voor verzending.
        </p>
        <p>
          Buiten Nederland en België verzenden we op dit moment niet. Woon je net over de grens en
          wil je toch iets bestellen, mail dan even; soms is er een oplossing.
        </p>

        <h2>Hoe lang het duurt</h2>
        <p>
          Reken op {site.delivery.weeksMin} tot {site.delivery.weeksMax} weken van bestelling tot
          bezorging. Alles wordt na je bestelling gemaakt, dus die tijd zit hem niet in het
          versturen maar in het maken: eerst nemen we je maten op, daarna gaat de jas naar het
          atelier.
        </p>
        <p>
          Binnen {site.delivery.contactWithinDays} werkdagen na je bestelling nemen we contact op om
          de maten door te nemen. Hoe eerder we die hebben, hoe eerder je jas in productie kan. Op de
          bedankpagina en in je bevestigingsmail staat de verwachte bezorgperiode; zodra het pakket
          bij de vervoerder ligt, krijg je een mail met het volgnummer.
        </p>
        <p>
          Heb je hem nodig voor een bepaalde datum — een bruiloft, een reis — laat het dan weten bij
          je bestelling. Soms kan het sneller.
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
          alleen verpakking: je kunt hem gebruiken om de jas in de zomer stofvrij op te hangen.
        </p>

        <p>
          <Link href="/service/passen-en-aanpassen">Passen en aanpassen</Link> ·{' '}
          <Link href="/contact">Een vraag stellen</Link>
        </p>
      </div>
    </div>
  );
}
