import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Passen en aanpassen',
  description:
    'Zit je jas niet zoals hij hoort? Mèlin past hem kosteloos aan tot hij past. Hoe dat werkt, en wat maatwerk betekent voor je bedenktijd.',
  path: '/service/passen-en-aanpassen',
});

export default function PassenPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Passen en aanpassen"
        intro="Een jas op maat hoort te zitten. Zit hij dat niet, dan passen we hem aan — zo vaak als nodig is, zonder dat het je iets kost."
        breadcrumb={[
          { label: 'Klantenservice', href: '/klantenservice' },
          { label: 'Passen en aanpassen', href: '/service/passen-en-aanpassen' },
        ]}
      />

      <div className="prose-melin">
        <h2 className="!mt-0">Onze belofte</h2>
        <p>
          Zit je jas niet goed, dan maken we het goed. Mouwen inkorten, de taille bijnemen, de zoom
          verleggen, de schouder aanpassen — wat er nodig is om hem te laten zitten zoals hij hoort.
          Dat kost je niets, ook de verzending heen en terug niet.
        </p>
        <p>
          Meld het binnen {site.alterationDays} dagen nadat je het pakket hebt ontvangen. Trek hem
          eerst een paar keer aan; wol zakt de eerste weken nog een beetje uit en valt daarna anders
          dan op dag één.
        </p>

        <h2>Zo meld je het</h2>
        <ol>
          <li>
            Mail naar <a href={`mailto:${site.email}`}>{site.email}</a> met je ordernummer en wat er
            niet goed zit. Een foto waarop je de jas draagt helpt enorm.
          </li>
          <li>
            We sturen je een verzendlabel. Je hoeft dus niets voor te schieten bij de vervoerder.
          </li>
          <li>
            Het atelier past hem aan. Reken op twee tot drie weken, afhankelijk van wat er moet
            gebeuren.
          </li>
          <li>Je krijgt hem terug, en we horen graag of het nu wel klopt.</li>
        </ol>

        <h2>Geld terug — hoe zit dat</h2>
        <p>
          Hier moeten we eerlijk zijn. Kleding die naar jouw maten wordt gemaakt, valt onder de
          wettelijke uitzondering op het herroepingsrecht. Er is dus <strong>geen bedenktijd van
          veertien dagen</strong> zoals bij kleding van de plank, en we kunnen een jas die voor jou
          gemaakt is niet terugnemen — hij past immers niemand anders.
        </p>
        <p>
          Daarom staat er iets anders tegenover: we blijven aanpassen tot hij past. Dat is geen
          wettelijke plicht maar een belofte van ons, en we vinden hem belangrijker dan een
          retourknop die bij maatwerk toch niet werkt.
        </p>
        <p>
          De volledige juridische uitleg staat op de pagina over het{' '}
          <Link href="/juridisch/herroepingsrecht">herroepingsrecht</Link>.
        </p>

        <h2>Als er iets mis is met de jas zelf</h2>
        <p>
          Zit er een fout in een naad, klopt de kleur niet met wat je hebt besteld, of is er iets
          beschadigd geraakt onderweg? Dat is iets anders dan een pasvormkwestie. Stuur een mail met
          een foto; dan repareren we het, maken we hem opnieuw of krijg je je geld terug — wat in
          jouw geval het beste past.
        </p>
        <p>
          Je wettelijke garantie blijft gewoon gelden: een jas moet doen wat je er redelijkerwijs van
          mag verwachten, en bij deze prijs en deze stof mag je veel verwachten.
        </p>

        <h2>Van gedachten veranderd vóór de productie</h2>
        <p>
          Zolang we nog niet met de stof zijn begonnen, kun je je bestelling annuleren en krijg je
          alles terug. Laat het zo snel mogelijk weten — meestal gaat een jas een paar dagen na het
          opnemen van de maten in productie.
        </p>

        <p>
          <Link href="/service/op-maat">Hoe het opnemen van de maten gaat</Link> ·{' '}
          <Link href="/contact">Iets melden</Link>
        </p>
      </div>
    </div>
  );
}
