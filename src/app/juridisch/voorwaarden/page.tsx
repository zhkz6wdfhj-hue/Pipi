import Link from 'next/link';

import { LegalNotice, PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Algemene voorwaarden',
  description:
    'De algemene voorwaarden van Melin_clo: bestellen, betalen, leveren, herroepingsrecht, garantie en klachten.',
  path: '/juridisch/voorwaarden',
});

export default function VoorwaardenPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Algemene voorwaarden"
        breadcrumb={[{ label: 'Algemene voorwaarden', href: '/juridisch/voorwaarden' }]}
      />

      <LegalNotice />

      <div className="prose-melin">
        <p>
          Laatst bijgewerkt op 1 augustus 2026. Deze voorwaarden gelden voor elke bestelling die je
          plaatst op {site.url.replace(/^https?:\/\//, '')}.
        </p>

        <h2>Artikel 1 — Wie wij zijn</h2>
        <p>
          {site.name}, gevestigd te {site.returnAddress.city}, ingeschreven bij de Kamer van
          Koophandel onder nummer {site.kvk}, btw-identificatienummer {site.btw}. Je bereikt ons via{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>. In deze voorwaarden noemen we onszelf
          &quot;wij&quot; en jou &quot;je&quot; of &quot;de klant&quot;.
        </p>

        <h2>Artikel 2 — Waar deze voorwaarden over gaan</h2>
        <p>
          Deze voorwaarden zijn van toepassing op elk aanbod op deze website en op elke overeenkomst
          die op afstand tussen ons tot stand komt. Voordat je bestelt, kun je deze tekst lezen,
          opslaan en afdrukken; hij wordt ook meegestuurd bij je bestelbevestiging.
        </p>
        <p>
          Wijken wij ooit van deze voorwaarden af, dan spreken we dat schriftelijk af. Is één bepaling
          nietig of vernietigbaar, dan blijven de overige bepalingen gewoon gelden.
        </p>

        <h2>Artikel 3 — Het aanbod</h2>
        <p>
          De omschrijvingen en foto&apos;s op deze site zijn zo nauwkeurig mogelijk. Kleuren kunnen op
          een scherm afwijken van de werkelijkheid; dat is geen gebrek. Kennelijke vergissingen of
          fouten in het aanbod binden ons niet. Een aanbod geldt zolang de voorraad strekt.
        </p>

        <h2>Artikel 4 — De overeenkomst</h2>
        <p>
          De overeenkomst komt tot stand op het moment dat je de bestelling afrondt en wij de
          betaling hebben ontvangen. Je krijgt daarna zo snel mogelijk een bevestiging per e-mail met
          je ordernummer, een overzicht van wat je hebt besteld en het bedrag.
        </p>
        <p>
          Wij mogen — binnen wettelijke kaders — nagaan of je aan je betalingsverplichtingen kunt
          voldoen. Hebben wij goede gronden om een bestelling niet uit te voeren, dan mogen wij die
          weigeren of er voorwaarden aan verbinden. Wij laten dat dan gemotiveerd weten.
        </p>

        <h2>Artikel 5 — Prijzen</h2>
        <p>
          Alle prijzen zijn in euro&apos;s en inclusief 21% btw. Verzendkosten worden apart vermeld en
          zie je vóór je bestelling definitief is. Prijzen kunnen wijzigen, maar niet meer nadat je
          bestelling tot stand is gekomen — behalve als een prijswijziging het gevolg is van een
          wettelijke regeling, zoals een btw-tarief.
        </p>

        <h2>Artikel 6 — Betaling</h2>
        <p>
          Betaling gebeurt direct bij het afrekenen, via iDEAL, Bancontact of creditcard. De
          betalingen worden afgehandeld door onze betaalprovider; wij ontvangen geen
          rekeningnummers, pincodes of kaartgegevens.
        </p>
        <p>
          Klopt er iets niet aan de betaalgegevens die je hebt opgegeven, dan meld je dat zo snel
          mogelijk aan ons.
        </p>

        <h2>Artikel 7 — Levering</h2>
        <p>
          Wij leveren op het adres dat je bij de bestelling hebt opgegeven, in Nederland en België.
          We doen ons best om een bestelling die op een werkdag vóór 15.00 uur binnenkomt dezelfde
          dag te versturen.
        </p>
        <p>
          De uiterste levertermijn is dertig dagen na het sluiten van de overeenkomst, tenzij we
          samen iets anders afspreken. Lukt het ons niet binnen die termijn te leveren, dan laten we
          dat op tijd weten en mag je de overeenkomst kosteloos ontbinden. Wij betalen het bedrag dan
          binnen veertien dagen terug.
        </p>
        <p>
          Het risico van beschadiging of verlies ligt bij ons tot het moment dat jij — of iemand die
          jij hebt aangewezen — het pakket in ontvangst neemt.
        </p>

        <h2>Artikel 8 — Herroepingsrecht</h2>
        <p>
          Je hebt {site.returnDays} dagen bedenktijd, gerekend vanaf de dag nadat je de bestelling
          hebt ontvangen. Binnen die termijn mag je de overeenkomst zonder opgave van redenen
          ontbinden. Hoe dat werkt, wat je terugkrijgt en welk formulier je kunt gebruiken, staat op
          de pagina over het{' '}
          <Link href="/juridisch/herroepingsrecht">herroepingsrecht</Link>.
        </p>
        <p>
          Tijdens de bedenktijd ga je zorgvuldig om met het product en de verpakking. Je mag het
          uitpakken en passen zoals je in een winkel zou doen. Ga je verder dan dat, dan mogen wij de
          waardevermindering in rekening brengen.
        </p>

        <h2>Artikel 9 — Conformiteit en garantie</h2>
        <p>
          Wij staan ervoor in dat wat je ontvangt voldoet aan de overeenkomst, aan de omschrijving op
          de site en aan de eisen van bruikbaarheid en deugdelijkheid die je er redelijkerwijs van mag
          verwachten. Dat is je wettelijke garantie; die geldt naast en boven op eventuele extra
          toezeggingen die wij doen.
        </p>
        <p>
          Slijtage door normaal gebruik, schade door verkeerd onderhoud (bijvoorbeeld wol in de
          wasmachine) en schade door ongelukken vallen hier niet onder. Onze adviezen voor onderhoud
          staan op de pagina over{' '}
          <Link href="/service/onderhoud">het onderhoud van wol</Link>.
        </p>

        <h2>Artikel 10 — Klachten</h2>
        <p>
          Klachten over de uitvoering van de overeenkomst dien je binnen bekwame tijd nadat je het
          gebrek hebt ontdekt bij ons in, volledig en duidelijk omschreven, via{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>. Wij reageren binnen veertien dagen. Heeft
          een klacht meer tijd nodig, dan laten we dat binnen die veertien dagen weten, met een
          indicatie wanneer je een uitgebreider antwoord kunt verwachten.
        </p>
        <p>
          Komen we er samen niet uit, dan kun je je klacht voorleggen aan het Europees platform voor
          onlinegeschillenbeslechting via{' '}
          <a href="https://ec.europa.eu/consumers/odr" rel="noopener noreferrer" target="_blank">
            ec.europa.eu/consumers/odr
          </a>
          . Je kunt het geschil ook voorleggen aan de bevoegde Nederlandse rechter.
        </p>

        <h2>Artikel 11 — Persoonsgegevens</h2>
        <p>
          Wij gaan zorgvuldig om met je gegevens en gebruiken ze alleen waarvoor je ze hebt
          achtergelaten. Wat we bewaren, hoe lang en met wie we het delen, staat in de{' '}
          <Link href="/juridisch/privacy">privacyverklaring</Link>.
        </p>

        <h2>Artikel 12 — Toepasselijk recht</h2>
        <p>
          Op deze voorwaarden en op elke overeenkomst tussen ons is Nederlands recht van toepassing.
          Dwingende bepalingen van consumentenrecht uit het land waar je woont, blijven onverkort
          gelden.
        </p>

        <h2>Artikel 13 — Wijzigingen</h2>
        <p>
          Wij mogen deze voorwaarden aanpassen. Voor een bestelling gelden altijd de voorwaarden
          zoals ze luidden op het moment dat je de bestelling plaatste. De datum bovenaan deze pagina
          laat zien wanneer de tekst voor het laatst is gewijzigd.
        </p>
      </div>
    </div>
  );
}
