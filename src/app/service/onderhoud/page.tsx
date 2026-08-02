import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Onderhoud van wol',
  description:
    'Borstelen, luchten, pluisjes verwijderen en wanneer je een wollen jas echt naar de stomerij moet brengen.',
  path: '/service/onderhoud',
});

export default function OnderhoudPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Onderhoud van wol"
        intro="Wol vraagt minder dan de meeste mensen denken. Met borstelen en luchten kom je een heel seizoen door."
        breadcrumb={[
          { label: 'Klantenservice', href: '/klantenservice' },
          { label: 'Onderhoud van wol', href: '/service/onderhoud' },
        ]}
      />

      <div className="prose-melin">
        <h2 className="!mt-0">Na het dragen</h2>
        <p>
          Hang de jas een half uur ergens waar lucht bij kan voordat je hem in de kast doet. Wol
          neemt vocht op en geeft het weer af; in die tijd trekken kreuk en geur er grotendeels
          vanzelf uit. Gebruik een brede hanger, zodat de schouders hun vorm houden — een dunne
          draadhanger duwt na een paar maanden bobbels in de stof.
        </p>

        <h2>Borstelen</h2>
        <p>
          Een zachte kledingborstel is het beste gereedschap dat je voor een wollen jas kunt kopen.
          Borstel één keer per week met korte halen van boven naar beneden. Dat haalt stof uit de
          vezel, houdt het weefsel open en gaat pluisvorming tegen. Bij de donkere kleuren zie je
          het verschil meteen.
        </p>

        <h2>Nat geworden</h2>
        <p>
          Regen is geen probleem. Hang de jas op een hanger op kamertemperatuur te drogen, uit de
          buurt van de verwarming en zeker niet op de radiator: te snel drogen laat wol krimpen en
          hard worden. Schud hem uit als hij nog nat is, dan zakt het water eruit in plaats van erin.
        </p>

        <h2>Pluisjes en propjes</h2>
        <p>
          Op plekken waar wrijving zit — onder de armen, bij de tas op de heup — kunnen kleine
          bolletjes ontstaan. Dat is normaal en zegt niets over de kwaliteit. Haal ze weg met een
          wolkam of een pluizenscheerder, in één richting en zonder te drukken. Trek ze niet los met
          je vingers; dan trek je hele vezels uit het weefsel.
        </p>

        <h2>Vlekken</h2>
        <p>
          Dep een verse vlek meteen met een licht vochtige doek, van buiten naar binnen. Niet wrijven
          en geen zeep gebruiken: die laat een kring achter die lastiger weg te krijgen is dan de
          vlek zelf. Lukt het niet, laat het dan aan de stomerij over en wacht niet te lang.
        </p>

        <h2>Stomen</h2>
        <p>
          Eén keer per seizoen naar de stomerij is genoeg, en vaak zelfs dat niet. Wollen jassen
          worden sneller sleets van te veel reinigen dan van dragen. Was ze niet in de machine, ook
          niet op het wolprogramma: de voering en de tussenvoering kunnen dat niet hebben.
        </p>

        <h2>Opbergen in de zomer</h2>
        <p>
          Laat de jas eerst stomen of goed uitborstelen — motten komen op zweet en huidschilfers af,
          niet op de wol zelf. Berg hem daarna op in de katoenen stofzak die bij je bestelling zat,
          niet in plastic; wol moet kunnen ademen. Leg er eventueel cederhout bij in plaats van
          mottenballen.
        </p>

        <p>
          <Link href="/service/op-maat">Op maat gemaakt</Link> ·{' '}
          <Link href="/contact">Een vraag stellen</Link>
        </p>
      </div>
    </div>
  );
}
