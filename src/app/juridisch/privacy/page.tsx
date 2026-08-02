import Link from 'next/link';

import { LegalNotice, PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacyverklaring',
  description:
    'Welke gegevens Mèlin bewaart, waarom, hoe lang, met wie ze gedeeld worden en welke rechten je hebt.',
  path: '/juridisch/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Privacyverklaring"
        breadcrumb={[{ label: 'Privacyverklaring', href: '/juridisch/privacy' }]}
      />

      <LegalNotice />

      <div className="prose-melin">
        <p>
          Laatst bijgewerkt op 1 augustus 2026. Deze verklaring legt uit welke persoonsgegevens wij
          verwerken als je onze site bezoekt of iets bestelt, en wat je rechten zijn.
        </p>

        <h2>Wie is verantwoordelijk</h2>
        <p>
          {site.name}, gevestigd te {site.returnAddress.city}, KvK {site.kvk}, is de
          verwerkingsverantwoordelijke. Vragen over privacy kun je stellen via{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>. Wij hebben geen functionaris voor
          gegevensbescherming; daartoe zijn wij als klein bedrijf niet verplicht.
        </p>

        <h2>Welke gegevens wij verwerken</h2>
        <h3>Als je iets bestelt</h3>
        <ul>
          <li>Voor- en achternaam</li>
          <li>Bezorgadres: straat, huisnummer, postcode, woonplaats en land</li>
          <li>E-mailadres</li>
          <li>Telefoonnummer, als je dat invult</li>
          <li>Wat je hebt besteld, het bedrag en het ordernummer</li>
          <li>Betaalstatus en de gebruikte betaalmethode</li>
        </ul>
        <p>
          Wij ontvangen géén rekeningnummers, pincodes of creditcardgegevens. Die verwerkt onze
          betaalprovider; wij horen alleen of een betaling geslaagd is.
        </p>

        <h3>Als je contact opneemt</h3>
        <ul>
          <li>Je naam en e-mailadres</li>
          <li>De inhoud van je bericht</li>
        </ul>

        <h3>Als je je aanmeldt voor de nieuwsbrief</h3>
        <ul>
          <li>Je e-mailadres, en het moment waarop je je aanmelding hebt bevestigd</li>
        </ul>

        <h3>Als je de site bezoekt</h3>
        <p>
          De site laadt niets van derden: geen lettertypen van een externe server, geen ingesloten
          video&apos;s, geen advertentienetwerken. In de opslag van je browser bewaren wij alleen je
          winkelmand en je cookiekeuze. Voor statistieken vragen we eerst toestemming; weiger je die,
          dan wordt er niets gemeten. Zie het{' '}
          <Link href="/juridisch/cookies">cookiebeleid</Link>.
        </p>

        <h2>Waarom wij die gegevens verwerken</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Doel</th>
              <th scope="col">Grondslag</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Je bestelling uitvoeren, bezorgen en bevestigen</td>
              <td>Uitvoering van de overeenkomst</td>
            </tr>
            <tr>
              <td>Je vraag beantwoorden</td>
              <td>Gerechtvaardigd belang: klanten helpen</td>
            </tr>
            <tr>
              <td>Nieuwsbrief versturen</td>
              <td>Toestemming, met bevestiging per e-mail</td>
            </tr>
            <tr>
              <td>Facturen bewaren voor de Belastingdienst</td>
              <td>Wettelijke verplichting</td>
            </tr>
            <tr>
              <td>Anonieme statistieken over sitegebruik</td>
              <td>Toestemming via de cookiemelding</td>
            </tr>
          </tbody>
        </table>

        <h2>Hoe lang wij ze bewaren</h2>
        <ul>
          <li>
            <strong>Bestelgegevens en facturen:</strong> zeven jaar. Dat is de bewaartermijn die de
            Belastingdienst voorschrijft.
          </li>
          <li>
            <strong>Berichten via het contactformulier:</strong> twee jaar na het laatste contact,
            zodat we bij een vervolgvraag weten waar het over ging.
          </li>
          <li>
            <strong>Nieuwsbriefadressen:</strong> tot je je afmeldt. Daarna verwijderen we je adres
            binnen een maand.
          </li>
          <li>
            <strong>Je cookiekeuze:</strong> twaalf maanden, daarna vragen we het opnieuw.
          </li>
          <li>
            <strong>De winkelmand in je browser:</strong> die staat op jouw apparaat en kun je zelf
            wissen. Wij komen er niet bij.
          </li>
        </ul>

        <h2>Met wie wij ze delen</h2>
        <p>
          Alleen met partijen die nodig zijn om je bestelling uit te voeren, en alleen met de
          gegevens die zij daarvoor nodig hebben. Met elk van hen hebben wij een
          verwerkersovereenkomst.
        </p>
        <ul>
          <li>
            <strong>De betaalprovider</strong> — om je betaling af te handelen.
          </li>
          <li>
            <strong>De vervoerder</strong> — je naam, adres en, als je die hebt opgegeven, je
            telefoonnummer voor de bezorging.
          </li>
          <li>
            <strong>De e-maildienst</strong> — om de bevestigingsmail en de nieuwsbrief te
            versturen.
          </li>
          <li>
            <strong>Onze hostingpartij</strong> — die de site en de bestelgegevens opslaat.
          </li>
          <li>
            <strong>Onze boekhouder</strong> — voor de administratie en de belastingaangifte.
          </li>
        </ul>
        <p>
          Wij verkopen je gegevens niet en gebruiken ze niet voor advertenties. Verwerking buiten de
          Europese Economische Ruimte proberen we te vermijden; gebeurt het toch, dan gaat dat op
          basis van de modelcontractbepalingen van de Europese Commissie.
        </p>

        <h2>Beveiliging</h2>
        <p>
          Het verkeer met deze site loopt versleuteld over https. Toegang tot bestelgegevens is
          beperkt tot de mensen die ze nodig hebben, en accounts zijn beveiligd met sterke
          wachtwoorden en tweestapsverificatie. Vermoed je dat er iets niet klopt met de beveiliging?
          Laat het ons weten via <a href={`mailto:${site.email}`}>{site.email}</a>; we reageren
          binnen twee werkdagen.
        </p>

        <h2>Je rechten</h2>
        <p>Je hebt het recht om:</p>
        <ul>
          <li>in te zien welke gegevens wij van je hebben;</li>
          <li>onjuiste gegevens te laten corrigeren;</li>
          <li>je gegevens te laten verwijderen, voor zover wij ze niet wettelijk moeten bewaren;</li>
          <li>de verwerking te laten beperken of daartegen bezwaar te maken;</li>
          <li>je gegevens in een leesbaar bestand mee te krijgen (dataportabiliteit);</li>
          <li>een gegeven toestemming op elk moment weer in te trekken.</li>
        </ul>
        <p>
          Stuur je verzoek naar <a href={`mailto:${site.email}`}>{site.email}</a>. Wij reageren
          binnen vier weken. Om te voorkomen dat we gegevens aan de verkeerde persoon geven, kunnen
          we je vragen om je verzoek te sturen vanaf het e-mailadres dat bij je bestelling hoort.
        </p>
        <p>
          Ben je het niet eens met hoe wij met je gegevens omgaan, dan kun je een klacht indienen bij
          de Autoriteit Persoonsgegevens via{' '}
          <a href="https://autoriteitpersoonsgegevens.nl" rel="noopener noreferrer" target="_blank">
            autoriteitpersoonsgegevens.nl
          </a>
          . We vinden het fijn als je het eerst bij ons probeert.
        </p>

        <h2>Wijzigingen</h2>
        <p>
          Verandert er iets aan hoe wij met gegevens omgaan, dan passen wij deze verklaring aan. De
          datum bovenaan geeft aan wanneer dat voor het laatst is gebeurd.
        </p>
      </div>
    </div>
  );
}
