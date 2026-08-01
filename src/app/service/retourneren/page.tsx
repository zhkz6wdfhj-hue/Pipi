import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Retourneren en ruilen',
  description:
    'Veertien dagen bedenktijd. Zo meld je een retour aan, zo stuur je hem terug, en zo werkt ruilen voor een andere maat.',
  path: '/service/retourneren',
});

export default function RetournerenPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Retourneren en ruilen"
        breadcrumb={[
          { label: 'Klantenservice', href: '/klantenservice' },
          { label: 'Retourneren en ruilen', href: '/service/retourneren' },
        ]}
      />

      <div className="prose-melin">
        <h2 className="!mt-0">Je bedenktijd</h2>
        <p>
          Je hebt {site.returnDays} dagen bedenktijd, gerekend vanaf de dag dat je het pakket
          ontvangt. Binnen die termijn meld je dat je de bestelling wilt terugsturen; daarna heb je
          nog eens veertien dagen om het pakket daadwerkelijk op de post te doen.
        </p>
        <p>
          Passen mag natuurlijk. Draag de jas alleen niet buiten en laat de labels eraan zitten,
          zodat we hem opnieuw kunnen verkopen. Is een kledingstuk gedragen, gewassen of beschadigd,
          dan mogen we een deel van het bedrag inhouden voor de waardevermindering.
        </p>

        <h2>In drie stappen</h2>
        <ol>
          <li>
            <strong>Meld je retour aan.</strong> Mail naar{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a> met je ordernummer en wat je
            terugstuurt. Je mag ook het{' '}
            <Link href="/juridisch/herroepingsrecht">modelformulier voor herroeping</Link>{' '}
            gebruiken, maar dat hoeft niet.
          </li>
          <li>
            <strong>Pak het weer in.</strong> Gebruik de doos waarin je bestelling kwam, of een
            andere stevige doos. Stop het retourformulier erbij, of schrijf je ordernummer op een
            briefje.
          </li>
          <li>
            <strong>Stuur het op.</strong> Naar het adres hieronder. Bewaar het verzendbewijs tot je
            je geld terug hebt.
          </li>
        </ol>

        <h3>Retouradres</h3>
        <p>
          {site.returnAddress.company}
          <br />
          {site.returnAddress.street}
          <br />
          {site.returnAddress.postalCode} {site.returnAddress.city}
          <br />
          {site.returnAddress.country}
        </p>

        <h2>Wat het kost</h2>
        <p>
          De kosten van het terugsturen zijn voor jou. Een pakket van deze afmeting kost binnen
          Nederland ongeveer € 7 en vanuit België ongeveer € 12, afhankelijk van de vervoerder die je
          kiest.
        </p>
        <p>
          De verzendkosten die je bij je bestelling hebt betaald, krijg je wel terug — tenzij je maar
          een deel van je bestelling terugstuurt en de rest houdt.
        </p>

        <h2>Je geld terug</h2>
        <p>
          Zodra we je retour binnen hebben en gecontroleerd, storten we het bedrag terug op dezelfde
          rekening waarmee je hebt betaald. Dat gebeurt binnen veertien dagen na je aanmelding, en
          meestal binnen drie werkdagen na ontvangst van het pakket. Je krijgt er een mail over.
        </p>

        <h2>Ruilen voor een andere maat</h2>
        <p>
          Ruilen doen we als een retour plus een nieuwe bestelling. Dat klinkt omslachtig, maar het
          gaat sneller: je nieuwe maat wordt meteen verstuurd in plaats van pas als je oude pakket
          binnen is. Meld je retour aan en bestel de maat die je wél wilt. Is de maat die je zoekt
          uitverkocht, mail dan even — soms komt er nog iets terug.
        </p>

        <h2>Iets kapot of verkeerd geleverd</h2>
        <p>
          Zit er een fout in de naad, klopt de kleur niet met wat je hebt besteld, of is er iets
          beschadigd geraakt onderweg? Stuur een mail met een foto. Dan lossen we het op zonder dat
          het je iets kost. Je wettelijke garantie staat hier los van: een jas moet doen wat je er
          redelijkerwijs van mag verwachten.
        </p>

        <p>
          <Link href="/juridisch/herroepingsrecht">Herroepingsrecht en modelformulier</Link> ·{' '}
          <Link href="/contact">Retour aanmelden</Link>
        </p>
      </div>
    </div>
  );
}
