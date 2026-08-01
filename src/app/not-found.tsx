import Link from 'next/link';

import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Pagina niet gevonden',
  description: 'Deze pagina bestaat niet of bestaat niet meer. Ga terug naar de collectie.',
  path: '/404',
  noindex: true,
});

export default function NotFound() {
  return (
    <div className="container-page py-24 lg:py-32">
      <div className="mx-auto max-w-lg text-center">
        <p className="label-caps mb-5 text-ink-soft">404</p>
        <h1 className="display-lg mb-4">Deze pagina bestaat niet</h1>
        <p className="mb-8 leading-relaxed text-ink-soft">
          Waarschijnlijk klopt er iets niet aan het adres, of is een model uit de collectie gehaald
          omdat het uitverkocht is. In de collectie staat wat er nu wel is.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/collectie"
            className="rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
          >
            Naar de collectie
          </Link>
          <Link href="/contact" className="link-underlined text-[0.9375rem]">
            Iets vragen
          </Link>
        </div>
      </div>
    </div>
  );
}
