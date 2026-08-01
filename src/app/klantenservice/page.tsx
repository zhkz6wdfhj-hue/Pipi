import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Klantenservice',
  description:
    'Alles over verzending, retourneren, betaalmethoden, het onderhoud van wol en de maattabel van Melin_clo.',
  path: '/klantenservice',
});

const onderwerpen = [
  {
    href: '/service/verzending',
    titel: 'Verzending en levering',
    tekst: 'Kosten, levertijden en wat er gebeurt als je niet thuis bent.',
  },
  {
    href: '/service/retourneren',
    titel: 'Retourneren en ruilen',
    tekst: 'Veertien dagen bedenktijd, en hoe je een retour aanmeldt.',
  },
  {
    href: '/service/betaalmethoden',
    titel: 'Betaalmethoden',
    tekst: 'iDEAL, Bancontact en creditcard, en wanneer je geld wordt afgeschreven.',
  },
  {
    href: '/service/maattabel',
    titel: 'Maattabel',
    tekst: 'Alle maten in centimeters, en hoe je jezelf het beste opmeet.',
  },
  {
    href: '/service/onderhoud',
    titel: 'Onderhoud van wol',
    tekst: 'Borstelen, luchten, pluisjes weghalen en wanneer je naar de stomerij moet.',
  },
];

export default function KlantenservicePage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Klantenservice"
        intro="Korte antwoorden op de vragen die het vaakst binnenkomen. Staat je vraag er niet bij, mail dan gerust."
        breadcrumb={[{ label: 'Klantenservice', href: '/klantenservice' }]}
      />

      <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
        {onderwerpen.map((onderwerp) => (
          <li key={onderwerp.href} className="bg-surface">
            <Link href={onderwerp.href} className="group block h-full p-6 lg:p-8">
              <h2 className="display-sm mb-2 group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">
                {onderwerp.titel}
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{onderwerp.tekst}</p>
            </Link>
          </li>
        ))}
        <li className="bg-surface">
          <div className="h-full p-6 lg:p-8">
            <h2 className="display-sm mb-2">Iets anders</h2>
            <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-soft">
              Mail naar{' '}
              <a href={`mailto:${site.email}`} className="link-underlined text-accent-ink">
                {site.email}
              </a>{' '}
              of stuur een bericht op Instagram.
            </p>
            <Link href="/contact" className="link-underlined text-[0.9375rem]">
              Naar het contactformulier
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
}
