import Link from 'next/link';

/** Kop van een inhoudspagina: kruimelpad, titel en een korte inleiding. */

export function PageHeader({
  title,
  intro,
  breadcrumb,
}: {
  title: string;
  intro?: string;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <header className="mb-10 lg:mb-14">
      {breadcrumb && breadcrumb.length > 0 ? (
        <nav aria-label="Kruimelpad" className="mb-4 text-[0.8125rem] text-ink-soft">
          <Link href="/" className="link-underlined">
            Home
          </Link>
          {breadcrumb.map((item, index) => (
            <span key={item.href}>
              <span aria-hidden="true"> · </span>
              {index === breadcrumb.length - 1 ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href} className="link-underlined">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      ) : null}

      <h1 className="display-xl">{title}</h1>
      {intro ? (
        <p className="mt-5 max-w-2xl text-lead leading-relaxed text-ink-soft">{intro}</p>
      ) : null}
    </header>
  );
}

/** Waarschuwing bovenaan de juridische pagina's. */
export function LegalNotice() {
  return (
    <div className="mb-10 border border-line bg-surface p-5 lg:mb-14">
      <h2 className="label-caps mb-2 text-ink">Let op: nog juridisch na te kijken</h2>
      <p className="text-[0.875rem] leading-relaxed text-ink-soft">
        Dit is een concepttekst, geschreven naar Nederlands en Europees consumentenrecht, maar niet
        opgesteld door een jurist. Laat de tekst nakijken voordat je de winkel opent, en vul de
        gegevens in die nog ontbreken: KvK-nummer, btw-nummer, vestigingsadres en het adres voor
        retourzendingen.
      </p>
    </div>
  );
}
