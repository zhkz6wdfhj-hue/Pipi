import Link from 'next/link';

import { LegalNotice, PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Cookiebeleid',
  description:
    'Welke cookies en lokale opslag Melin_clo gebruikt, waarvoor ze dienen en hoe je je keuze weer intrekt.',
  path: '/juridisch/cookies',
});

export default function CookiesPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Cookiebeleid"
        breadcrumb={[{ label: 'Cookiebeleid', href: '/juridisch/cookies' }]}
      />

      <LegalNotice />

      <div className="prose-melin">
        <p>
          Laatst bijgewerkt op 1 augustus 2026. Deze pagina legt uit wat wij in je browser bewaren en
          waarom. Het is een korte lijst, want deze site laadt niets van derden.
        </p>

        <h2>Wat wij bewaren</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Naam</th>
              <th scope="col">Waarvoor</th>
              <th scope="col">Bewaartermijn</th>
              <th scope="col">Toestemming nodig</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>melin-clo-winkelmand-v1</td>
              <td>Onthoudt wat er in je winkelmand zit, zodat die niet leegloopt als je de pagina herlaadt.</td>
              <td>Tot je hem leegmaakt</td>
              <td>Nee, strikt noodzakelijk</td>
            </tr>
            <tr>
              <td>melin-clo-cookiekeuze</td>
              <td>Onthoudt of je statistieken hebt geaccepteerd of geweigerd, zodat we het niet elke keer opnieuw vragen.</td>
              <td>Twaalf maanden</td>
              <td>Nee, strikt noodzakelijk</td>
            </tr>
            <tr>
              <td>Statistieken</td>
              <td>Anoniem meten welke pagina&apos;s bezocht worden, zodat we de site kunnen verbeteren.</td>
              <td>Alleen als je accepteert</td>
              <td>Ja</td>
            </tr>
          </tbody>
        </table>

        <h2>Technisch gezien geen cookies</h2>
        <p>
          De eerste twee regels hierboven zijn geen cookies maar lokale opslag (localStorage). Het
          verschil voor jou: die gegevens worden niet met elk verzoek naar de server meegestuurd, ze
          blijven op je eigen apparaat. Juridisch vallen ze onder dezelfde regels, en daarom noemen
          we ze hier gewoon.
        </p>

        <h2>Wat wij niet doen</h2>
        <ul>
          <li>Geen advertentie- of trackingcookies.</li>
          <li>Geen sociale-mediaknoppen die meekijken.</li>
          <li>Geen lettertypen van een externe server; die staan op ons eigen domein.</li>
          <li>Geen profielen van je surfgedrag, ook niet als je statistieken accepteert.</li>
        </ul>

        <h2>Toestemming intrekken</h2>
        <p>
          Van gedachten veranderd? Wis dan de opslag van deze site in je browser; bij het volgende
          bezoek vragen we je keuze opnieuw. In de meeste browsers vind je dat onder
          Instellingen → Privacy → Cookies en sitegegevens. Weiger je statistieken, dan blijft de
          winkel gewoon werken; er wordt alleen niets gemeten.
        </p>

        <h2>Vragen</h2>
        <p>
          Mail naar <a href={`mailto:${site.email}`}>{site.email}</a>. Wat er verder met je gegevens
          gebeurt, staat in de <Link href="/juridisch/privacy">privacyverklaring</Link>.
        </p>
      </div>
    </div>
  );
}
