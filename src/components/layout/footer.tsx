import Link from 'next/link';

import { Logo } from './logo';
import { NewsletterForm } from './newsletter-form';
import { site } from '@/data/site';

/** De voettekst blijft licht, net als de rest van de site. */

const kolommen = [
  {
    titel: 'Collectie',
    links: [
      { href: '/collectie', label: 'Alles' },
      { href: '/collectie?categorie=jassen', label: 'Lange jassen' },
      { href: '/collectie?categorie=blazers', label: 'Blazers' },
      { href: '/over', label: 'Over Mèlin' },
    ],
  },
  {
    titel: 'Klantenservice',
    links: [
      { href: '/service/verzending', label: 'Verzending en levering' },
      { href: '/service/passen-en-aanpassen', label: 'Passen en aanpassen' },
      { href: '/service/betaalmethoden', label: 'Betaalmethoden' },
      { href: '/service/op-maat', label: 'Op maat gemaakt' },
      { href: '/service/onderhoud', label: 'Onderhoud van wol' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    titel: 'Juridisch',
    links: [
      { href: '/juridisch/voorwaarden', label: 'Algemene voorwaarden' },
      { href: '/juridisch/privacy', label: 'Privacyverklaring' },
      { href: '/juridisch/cookies', label: 'Cookiebeleid' },
      { href: '/juridisch/herroepingsrecht', label: 'Herroepingsrecht' },
    ],
  },
];

export function Footer() {
  const jaar = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-bg">
      <div className="container-page py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
          <div>
            <Logo as="tekst" size="groot" />
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
              Lange wollen jassen en blazers, na je bestelling op maat gemaakt. Begonnen op
              Instagram, nu ook hier.
            </p>

            <div className="mt-8 max-w-sm">
              <h2 className="label-caps mb-3 text-ink">Nieuwsbrief</h2>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {kolommen.map((kolom) => (
              <nav key={kolom.titel} aria-label={kolom.titel}>
                <h2 className="label-caps mb-4 text-ink">{kolom.titel}</h2>
                <ul className="space-y-2.5">
                  {kolom.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="link-quiet text-[0.9375rem] text-ink-soft">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-8 lg:mt-16">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-[0.8125rem] leading-relaxed text-ink-soft">
              <p>
                <span className="text-ink">{site.name}</span> · {site.returnAddress.city},{' '}
                {site.returnAddress.country}
              </p>
              <p>
                KvK {site.kvk} · Btw {site.btw}
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="link-underlined">
                  {site.email}
                </a>
              </p>
            </div>

            <div className="text-[0.8125rem] text-ink-soft">
              <a
                href={site.instagram.url}
                rel="noopener noreferrer"
                target="_blank"
                className="link-underlined"
              >
                Instagram {site.instagram.handle}
              </a>
              <p className="mt-1.5">
                © {jaar} {site.name}. Alle rechten voorbehouden.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
