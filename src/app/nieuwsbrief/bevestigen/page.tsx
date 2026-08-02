import Link from 'next/link';

import { signEmail } from '@/lib/newsletter';
import { pageMetadata } from '@/lib/seo';

/**
 * Tweede stap van de dubbele opt-in. De link uit de mail komt hier binnen; als
 * de handtekening klopt, is de aanmelding bevestigd.
 */

export const dynamic = 'force-dynamic';

export const metadata = pageMetadata({
  title: 'Aanmelding bevestigen',
  description: 'Bevestig je aanmelding voor de nieuwsbrief van Melin_clo.',
  path: '/nieuwsbrief/bevestigen',
  noindex: true,
});

export default async function BevestigenPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; adres?: string }>;
}) {
  const { token, adres } = await searchParams;
  const geldig = Boolean(adres && token && signEmail(adres) === token);

  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-lg">
        {geldig ? (
          <>
            <h1 className="display-lg mb-4">Je staat op de lijst</h1>
            <p className="leading-relaxed text-ink-soft">
              We hebben je aanmelding bevestigd voor <span className="text-ink">{adres}</span>. Je
              krijgt een paar keer per jaar bericht, als er een nieuw model bij komt. Onderaan elke
              mail staat een link om je weer af te melden.
            </p>
          </>
        ) : (
          <>
            <h1 className="display-lg mb-4">Deze link werkt niet</h1>
            <p className="leading-relaxed text-ink-soft">
              De bevestigingslink is onvolledig of verlopen. Meld je opnieuw aan onderaan de pagina;
              dan sturen we een nieuwe mail.
            </p>
          </>
        )}

        <p className="mt-8">
          <Link
            href="/collectie"
            className="inline-block rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
          >
            Bekijk de collectie
          </Link>
        </p>
      </div>
    </div>
  );
}
