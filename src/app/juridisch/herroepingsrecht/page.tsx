import Link from 'next/link';

import { LegalNotice, PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Herroepingsrecht',
  description:
    'Veertien dagen bedenktijd bij Melin_clo: hoe het werkt, wat je terugkrijgt en het modelformulier voor herroeping.',
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
          Laatst bijgewerkt op 1 augustus 2026. Omdat je online bestelt en de jas dus niet vooraf kunt
          passen, heb je wettelijk bedenktijd. Hieronder staat precies hoe dat werkt, gevolgd door het
          modelformulier.
        </p>

        <h2>Je bedenktijd</h2>
        <p>
          Je hebt {site.returnDays} dagen om deze overeenkomst zonder opgave van redenen te
          herroepen. De termijn begint op de dag nadat jij — of iemand die jij hebt aangewezen, en
          die niet de vervoerder is — het product hebt ontvangen. Bestaat je bestelling uit meerdere
          zendingen, dan begint de termijn op de dag dat je de laatste zending ontvangt.
        </p>

        <h2>Hoe je herroept</h2>
        <p>
          Laat ons binnen de bedenktijd ondubbelzinnig weten dat je de overeenkomst wilt herroepen.
          Een e-mail naar <a href={`mailto:${site.email}`}>{site.email}</a> is genoeg; je mag ook het
          modelformulier hieronder gebruiken, maar dat is niet verplicht. Je hoeft geen reden te
          geven.
        </p>
        <p>
          Om de termijn te halen, volstaat het dat je je bericht verstuurt vóór de bedenktijd
          verstreken is. Wij bevestigen de ontvangst per e-mail.
        </p>

        <h2>Terugsturen</h2>
        <p>
          Stuur het product uiterlijk veertien dagen na je herroepingsmelding terug naar:
        </p>
        <p>
          {site.returnAddress.company}
          <br />
          {site.returnAddress.street}
          <br />
          {site.returnAddress.postalCode} {site.returnAddress.city}
          <br />
          {site.returnAddress.country}
        </p>
        <p>
          De rechtstreekse kosten van het terugzenden zijn voor jou. Wij schatten die op ongeveer € 7
          binnen Nederland en € 12 vanuit België, afhankelijk van de vervoerder die je kiest. Bewaar
          je verzendbewijs tot de terugbetaling rond is.
        </p>

        <h2>Wat je terugkrijgt</h2>
        <p>
          Wij betalen alle betalingen terug die wij van je hebben ontvangen, inclusief de
          verzendkosten van de levering. Heb je gekozen voor een duurdere verzendmethode dan onze
          standaardlevering, dan vergoeden wij alleen de standaardkosten. Stuur je maar een deel van
          je bestelling terug, dan blijven de verzendkosten van de levering voor jouw rekening.
        </p>
        <p>
          Wij betalen binnen veertien dagen nadat je de herroeping hebt gemeld, met hetzelfde
          betaalmiddel als waarmee je hebt betaald, tenzij je uitdrukkelijk anders afspreekt. Je
          betaalt daarvoor niets extra. Wij mogen wachten met terugbetalen tot wij het product terug
          hebben ontvangen, of tot je hebt aangetoond dat je het hebt teruggestuurd — wat het eerst
          gebeurt.
        </p>

        <h2>Omgang met het product tijdens de bedenktijd</h2>
        <p>
          Je mag het product uitpakken, bekijken en passen zoals je in een winkel zou doen: aantrekken
          voor de spiegel, de mouwlengte controleren, de pasvorm beoordelen. Ga je verder — draag je de
          jas buiten, haal je de labels eraf of raakt hij beschadigd — dan ben je aansprakelijk voor de
          waardevermindering en mogen wij die verrekenen met het bedrag dat je terugkrijgt.
        </p>

        <h2>Uitzonderingen</h2>
        <p>
          Voor onze producten gelden geen uitzonderingen op het herroepingsrecht: alle jassen en
          blazers in deze collectie zijn standaardmaten en niet op maat gemaakt. Zou je ooit iets op
          maat laten aanpassen, dan spreken we vooraf af wat dat voor je bedenktijd betekent.
        </p>

        <h2>Modelformulier voor herroeping</h2>
        <p>
          Je gebruikt dit formulier alleen als je de overeenkomst wilt herroepen. Invullen en sturen
          naar <a href={`mailto:${site.email}`}>{site.email}</a>, of op papier meesturen met je
          retour.
        </p>

        <div className="my-8 border border-line bg-surface p-6 lg:p-8">
          <p className="mb-6 text-[0.875rem] leading-relaxed text-ink-soft">
            <span className="label-caps mb-3 block text-ink">Modelformulier voor herroeping</span>
            Aan {site.name}, {site.returnAddress.street}, {site.returnAddress.postalCode}{' '}
            {site.returnAddress.city}, {site.returnAddress.country} — {site.email}
          </p>

          <ul className="!list-none space-y-4 !pl-0 text-[0.9375rem] leading-relaxed text-ink-soft">
            <li className="!pl-0">
              Ik/Wij (*) deel/delen (*) u hierbij mede dat ik/wij (*) onze overeenkomst betreffende
              de verkoop van de volgende goederen herroep/herroepen (*):
              <span className="mt-2 block border-b border-line pb-6" />
            </li>
            <li className="!pl-0">
              Besteld op (*) / ontvangen op (*):
              <span className="mt-2 block border-b border-line pb-6" />
            </li>
            <li className="!pl-0">
              Ordernummer:
              <span className="mt-2 block border-b border-line pb-6" />
            </li>
            <li className="!pl-0">
              Naam consument(en):
              <span className="mt-2 block border-b border-line pb-6" />
            </li>
            <li className="!pl-0">
              Adres consument(en):
              <span className="mt-2 block border-b border-line pb-6" />
            </li>
            <li className="!pl-0">
              Handtekening consument(en) — alleen als dit formulier op papier wordt ingediend:
              <span className="mt-2 block border-b border-line pb-10" />
            </li>
            <li className="!pl-0">
              Datum:
              <span className="mt-2 block border-b border-line pb-6" />
            </li>
          </ul>

          <p className="mt-6 text-[0.8125rem] text-ink-soft">(*) Doorhalen wat niet van toepassing is.</p>
        </div>

        <p>
          <Link href="/service/retourneren">Praktische uitleg over retourneren</Link> ·{' '}
          <Link href="/juridisch/voorwaarden">Algemene voorwaarden</Link>
        </p>
      </div>
    </div>
  );
}
