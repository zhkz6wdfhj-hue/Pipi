import Link from 'next/link';

import { LegalNotice, PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Herroepingsrecht',
  description:
    'Kleding die op maat wordt gemaakt valt buiten het wettelijke herroepingsrecht. Wat dat betekent, wanneer je wél kunt annuleren, en wat Melin_clo in de plaats daarvan belooft.',
  path: '/juridisch/herroepingsrecht',
});

export default function HerroepingsrechtPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Herroepingsrecht"
        breadcrumb={[{ label: 'Herroepingsrecht', href: '/juridisch/herroepingsrecht' }]}
      />

      <LegalNotice />

      <div className="prose-melin">
        <p>
          Laatst bijgewerkt op 2 augustus 2026. Deze pagina legt uit waarom er bij ons geen
          bedenktijd van veertien dagen geldt, en wat we in plaats daarvan doen.
        </p>

        <h2>Waarom de bedenktijd hier niet geldt</h2>
        <p>
          Wie online koopt, heeft normaal gesproken veertien dagen bedenktijd. Op die regel staan in
          de wet een paar uitzonderingen, en één daarvan gaat over goederen die volgens de
          specificaties van de consument zijn vervaardigd of die duidelijk voor een specifieke
          persoon bestemd zijn. Dat is precies wat wij maken: elke jas en elke blazer wordt gesneden
          en genaaid naar de maten die jij ons doorgeeft.
        </p>
        <p>
          Deze uitzondering staat in artikel 6:230p van het Burgerlijk Wetboek, dat de Europese
          richtlijn consumentenrechten uitvoert. Het is dus geen huisregel van ons maar de wet, en
          hij geldt vanaf het moment dat we op basis van jouw maten met de productie beginnen.
        </p>
        <p>
          Praktisch gezien is het ook logisch: een jas die op jouw schouders, jouw armlengte en jouw
          gewenste zoomhoogte is gemaakt, past zelden iemand anders. We kunnen hem niet opnieuw
          verkopen.
        </p>

        <h2>Wat je wél kunt: annuleren vóór de productie</h2>
        <p>
          Tussen je bestelling en het moment dat het atelier de stof insnijdt, zit meestal ruim een
          week. In die periode kun je je bestelling zonder opgave van redenen annuleren en krijg je
          het volledige bedrag terug, inclusief eventuele verzendkosten.
        </p>
        <p>
          Stuur daarvoor een bericht naar <a href={`mailto:${site.email}`}>{site.email}</a> met je
          ordernummer. We laten je weten of de productie al begonnen is; zo niet, dan storten we het
          bedrag binnen veertien dagen terug op dezelfde rekening waarmee je hebt betaald.
        </p>
        <p>
          Zijn we al begonnen, dan is annuleren niet meer mogelijk. We laten altijd weten wanneer dat
          moment eraan komt, zodat je weet waar je aan toe bent.
        </p>

        <h2>Wat wij daarvoor in de plaats doen</h2>
        <p>
          De wet verplicht ons tot niets extra&apos;s. Toch vinden we dat je bij een jas van deze
          prijs niet met een slecht zittend kledingstuk mag blijven zitten. Daarom beloven wij:
        </p>
        <ul>
          <li>
            <strong>Kosteloos aanpassen tot hij past.</strong> Mouwen, taille, zoom, schouder — wat
            er nodig is. Zo vaak als nodig, en ook de verzending heen en terug is voor ons.
          </li>
          <li>
            <strong>Melden binnen {site.alterationDays} dagen na ontvangst.</strong> Trek hem eerst
            een paar keer aan; wol zakt de eerste weken nog wat uit.
          </li>
          <li>
            <strong>Bij een fout van ons: gewoon je geld terug.</strong> Klopt de kleur niet met wat
            je hebt besteld, zit er een gebrek in de stof of de naad, of is de jas beschadigd
            aangekomen, dan repareren we hem, maken we hem opnieuw of betalen we terug — wat jou het
            beste uitkomt.
          </li>
        </ul>
        <p>
          Hoe dat in de praktijk gaat, staat op{' '}
          <Link href="/service/passen-en-aanpassen">passen en aanpassen</Link>.
        </p>

        <h2>Je wettelijke garantie blijft gelden</h2>
        <p>
          Het vervallen van de bedenktijd verandert niets aan je recht op een deugdelijk product. Een
          jas moet doen wat je er redelijkerwijs van mag verwachten, ook op langere termijn. Gaat er
          iets stuk dat niet aan normaal gebruik ligt, dan lossen wij dat op.
        </p>

        <h2>Als we het oneens worden</h2>
        <p>
          Ben je het niet eens met ons standpunt dat een bestelling onder de maatwerkuitzondering
          valt, laat het dan weten via <a href={`mailto:${site.email}`}>{site.email}</a>. We
          reageren binnen veertien dagen. Komen we er samen niet uit, dan kun je je klacht
          voorleggen aan het Europees platform voor onlinegeschillenbeslechting via{' '}
          <a href="https://ec.europa.eu/consumers/odr" rel="noopener noreferrer" target="_blank">
            ec.europa.eu/consumers/odr
          </a>{' '}
          of aan de bevoegde Nederlandse rechter.
        </p>

        <h2>Het modelformulier</h2>
        <p>
          Omdat het herroepingsrecht bij maatwerk niet van toepassing is, is het wettelijke
          modelformulier voor herroeping hier niet aan de orde. Wil je annuleren vóór de productie,
          of een aanpassing melden, dan volstaat een mail met je ordernummer en wat er aan de hand
          is. Daar hebben we geen formulier voor nodig.
        </p>

        <p>
          <Link href="/service/passen-en-aanpassen">Passen en aanpassen</Link> ·{' '}
          <Link href="/service/op-maat">Hoe het op maat maken gaat</Link> ·{' '}
          <Link href="/juridisch/voorwaarden">Algemene voorwaarden</Link>
        </p>
      </div>
    </div>
  );
}
