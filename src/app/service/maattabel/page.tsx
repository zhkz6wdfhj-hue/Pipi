import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { blazerSizeChart, coatSizeChart, type SizeRow } from '@/data/size-chart';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Maattabel',
  description:
    'Alle maten van de jassen en blazers van Melin_clo in centimeters, plus uitleg over hoe je jezelf opmeet.',
  path: '/service/maattabel',
});

function Tabel({ rijen, bijschrift }: { rijen: SizeRow[]; bijschrift: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] border-collapse text-[0.875rem]">
        <caption className="sr-only">{bijschrift}</caption>
        <thead>
          <tr>
            {['Maat', 'NL-maat', 'Borstwijdte', 'Schouderbreedte', 'Mouwlengte'].map((kop) => (
              <th
                key={kop}
                scope="col"
                className="label-caps border-b border-line px-3 py-2.5 text-left text-ink first:pl-0 last:pr-0"
              >
                {kop}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rijen.map((rij) => (
            <tr key={rij.size}>
              <th scope="row" className="border-b border-line py-2.5 pr-3 text-left font-normal text-ink">
                {rij.size}
              </th>
              <td className="border-b border-line px-3 py-2.5 text-ink-soft">{rij.nl}</td>
              <td className="border-b border-line px-3 py-2.5 text-ink-soft">{rij.chest} cm</td>
              <td className="border-b border-line px-3 py-2.5 text-ink-soft">{rij.shoulder} cm</td>
              <td className="border-b border-line py-2.5 pl-3 text-ink-soft">{rij.sleeve} cm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MaattabelPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Maattabel"
        intro="De maten hieronder zijn van het kledingstuk zelf, plat op tafel gemeten en waar dat logisch is verdubbeld. Het zijn dus geen lichaamsmaten."
        breadcrumb={[
          { label: 'Klantenservice', href: '/klantenservice' },
          { label: 'Maattabel', href: '/service/maattabel' },
        ]}
      />

      <div className="prose-melin max-w-none">
        <h2 className="!mt-0">Lange jassen</h2>
        <Tabel rijen={coatSizeChart} bijschrift="Maten van de lange jassen in centimeters" />

        <h2>Blazers</h2>
        <Tabel rijen={blazerSizeChart} bijschrift="Maten van de blazers in centimeters" />

        <div className="max-w-2xl">
          <h2>Jezelf opmeten</h2>
          <p>
            Pak een kledingstuk dat je fijn vindt zitten en leg het plat op tafel. Meet dan hetzelfde
            wat wij meten; dat vergelijkt makkelijker dan een meetlint om je lijf.
          </p>
          <ul>
            <li>
              <strong>Borstwijdte</strong> — meet van naad tot naad, net onder de armsgaten, en
              verdubbel dat getal.
            </li>
            <li>
              <strong>Schouderbreedte</strong> — van de ene schoudernaad naar de andere, over de rug.
            </li>
            <li>
              <strong>Mouwlengte</strong> — van de schoudernaad tot het uiteinde van de mouw.
            </li>
          </ul>

          <h2>Welke maat kies je</h2>
          <p>
            Onze jassen zijn ontworpen om over een trui te passen; er zit dus al ruimte in. Kom je
            precies tussen twee maten uit, dan kun je meestal de kleinste nemen. Draag je graag een
            dikke gebreide trui eronder, of vind je een ruimere lijn prettig, neem dan de grootste.
          </p>
          <p>
            Twee uitzonderingen: de <Link href="/product/lijnjas">Lijnjas</Link> valt smaller dan de
            rest — kies daar een maat groter als je er iets dikkers onder wilt. De{' '}
            <Link href="/product/atelierblazer">Atelierblazer</Link> is ongevoerd en valt daardoor
            dichter om het lichaam; ook daar is een maat groter vaak prettiger.
          </p>

          <h2>Twijfel je nog?</h2>
          <p>
            Stuur ons je lengte en de maat die je normaal draagt, dan denken we mee. Dat kan via het{' '}
            <Link href="/contact">contactformulier</Link> of met een bericht op Instagram. Liever
            eerst passen? Bestel dan één maat en gebruik je bedenktijd; retourneren mag altijd.
          </p>
        </div>
      </div>
    </div>
  );
}
