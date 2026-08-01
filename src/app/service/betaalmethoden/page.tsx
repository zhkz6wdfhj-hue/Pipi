import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Betaalmethoden',
  description:
    'Betalen met iDEAL, Bancontact of creditcard. Wanneer het geld wordt afgeschreven en wat er gebeurt als een betaling mislukt.',
  path: '/service/betaalmethoden',
});

export default function BetaalmethodenPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Betaalmethoden"
        breadcrumb={[
          { label: 'Klantenservice', href: '/klantenservice' },
          { label: 'Betaalmethoden', href: '/service/betaalmethoden' },
        ]}
      />

      <div className="prose-melin">
        <h2 className="!mt-0">Waarmee je kunt betalen</h2>
        <ul>
          <li>
            <strong>iDEAL</strong> — je betaalt via je eigen bank, met de app of met een
            bankpas-lezer. Dit is de snelste manier; de betaling is meteen rond.
          </li>
          <li>
            <strong>Bancontact</strong> — voor Belgische rekeningen, met dezelfde snelheid als
            iDEAL.
          </li>
          <li>
            <strong>Creditcard</strong> — Visa, Mastercard en American Express. De afschrijving kan
            een dag later op je afschrift verschijnen.
          </li>
        </ul>

        <h2>Veilig betalen</h2>
        <p>
          Het betalen gebeurt in een beveiligd scherm van onze betaalprovider. Wij zien je
          rekeningnummer, pincode of kaartgegevens nooit; wij krijgen alleen te horen of de betaling
          gelukt is. De verbinding met deze site loopt over https, dus alles wat je invult gaat
          versleuteld.
        </p>

        <h2>Wanneer wordt er afgeschreven</h2>
        <p>
          Direct bij het afrekenen. Je bestelling is pas definitief als de betaling geslaagd is;
          daarna reserveren we de jas voor jou en krijg je een bevestigingsmail met het ordernummer.
        </p>

        <h2>Als de betaling misgaat</h2>
        <p>
          Sluit je het betaalscherm, of gaat er iets mis met je bank, dan blijft je bestelling
          openstaan zonder dat er geld is afgeschreven. Je kunt gewoon opnieuw beginnen. Zie je toch
          een afschrijving zonder bevestigingsmail? Mail dan naar{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a> met het bedrag en het tijdstip, dan
          zoeken we het uit.
        </p>

        <h2>Prijzen en btw</h2>
        <p>
          Alle prijzen op deze site zijn inclusief 21% btw. Op je bestelbevestiging staat het
          btw-bedrag apart vermeld. Bestel je zakelijk en heb je een factuur op naam nodig, laat het
          dan weten bij de opmerking tijdens het afrekenen.
        </p>

        <h2>Achteraf betalen</h2>
        <p>
          Dat bieden we bewust niet aan. Het maakt bestellen makkelijker dan goed voor je is, en het
          kost ons extra kosten die uiteindelijk in de prijs terechtkomen.
        </p>

        <p>
          <Link href="/juridisch/voorwaarden">Algemene voorwaarden</Link> ·{' '}
          <Link href="/service/verzending">Verzending en levering</Link>
        </p>
      </div>
    </div>
  );
}
