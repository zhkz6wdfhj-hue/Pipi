import { ContactForm } from '@/components/contact-form';
import { PageHeader } from '@/components/layout/page-header';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Een vraag over een maat, een bestelling of een retour? Stuur een bericht, mail ons of stuur een bericht op Instagram.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <PageHeader
        title="Contact"
        intro="Twijfel je over een maat, wil je weten hoe een stof aanvoelt, of is er iets met je bestelling? Laat het weten. Op werkdagen antwoorden we meestal dezelfde dag."
        breadcrumb={[{ label: 'Contact', href: '/contact' }]}
      />

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="max-w-xl">
          <h2 className="display-md mb-6">Stuur een bericht</h2>
          <ContactForm />
        </div>

        <aside>
          <h2 className="display-md mb-6">Rechtstreeks</h2>

          <dl className="space-y-6 border-t border-line pt-6">
            <div>
              <dt className="label-caps mb-1.5 text-ink-soft">E-mail</dt>
              <dd>
                <a href={`mailto:${site.email}`} className="link-underlined text-[0.9375rem]">
                  {site.email}
                </a>
              </dd>
            </div>

            <div>
              <dt className="label-caps mb-1.5 text-ink-soft">Instagram</dt>
              <dd>
                <a
                  href={site.instagram.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="link-underlined text-[0.9375rem]"
                >
                  {site.instagram.handle}
                </a>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-soft">
                  Hier staan de meeste draagfoto&apos;s. Een bericht komt bij dezelfde persoon
                  binnen als een mail.
                </p>
              </dd>
            </div>

            <div>
              <dt className="label-caps mb-1.5 text-ink-soft">Retouradres</dt>
              <dd className="text-[0.9375rem] leading-relaxed text-ink-soft">
                {site.returnAddress.company}
                <br />
                {site.returnAddress.street}
                <br />
                {site.returnAddress.postalCode} {site.returnAddress.city}
                <br />
                {site.returnAddress.country}
                <p className="mt-1.5 text-[0.875rem]">
                  Stuur alleen iets terug nadat je een retour hebt aangemeld, dan kunnen we het
                  meteen koppelen aan je bestelling.
                </p>
              </dd>
            </div>

            <div>
              <dt className="label-caps mb-1.5 text-ink-soft">Bedrijfsgegevens</dt>
              <dd className="text-[0.9375rem] leading-relaxed text-ink-soft">
                {site.name}
                <br />
                KvK {site.kvk}
                <br />
                Btw {site.btw}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
