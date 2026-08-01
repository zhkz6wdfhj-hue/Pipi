/**
 * =============================================================================
 * Melin_clo — bedrijfsgegevens op één plek
 * =============================================================================
 *
 * Alles wat met de identiteit van de winkel te maken heeft staat hier. De
 * juridische pagina's, de footer, de bevestigingsmail en de JSON-LD lezen deze
 * waarden uit, dus je hoeft ze maar één keer in te vullen.
 *
 * VOOR LIVEGANG INVULLEN — de waarden hieronder die beginnen met "INVULLEN"
 * moeten vervangen worden door je echte gegevens. Zoek in dit bestand op
 * "INVULLEN" om ze allemaal te vinden. Zie ook LIVEGANG.md.
 */

export const site = {
  /** Volledige merknaam. Gebruik deze in de footer, metadata en juridische teksten. */
  name: 'Melin_clo',
  /** Stam van de naam; in de interface gevolgd door het kleine achtervoegsel "clo". */
  nameShort: 'Melin',
  nameSuffix: 'clo',

  /** Zonder afsluitende schuine streep. Wordt gebruikt voor canonieke URL's en de sitemap. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.melin-clo.nl',

  description:
    'Lange wollen jassen en blazers in kleine oplages. Melin_clo maakt weinig, maar goed: warme wol, rustige kleuren en een pasvorm die jaren meegaat.',

  /** INVULLEN — het e-mailadres waarop je klanten wilt ontvangen. */
  email: 'hallo@melin-clo.nl',
  /** INVULLEN — afzender van de bevestigingsmail (mag hetzelfde adres zijn). */
  emailFrom: 'Melin_clo <hallo@melin-clo.nl>',
  /** INVULLEN — intern adres waar het besteloverzicht naartoe gaat. */
  emailInternal: 'bestellingen@melin-clo.nl',

  instagram: {
    handle: '@melin_clo',
    url: 'https://www.instagram.com/melin_clo/',
  },

  /** INVULLEN — je KvK-nummer (8 cijfers). */
  kvk: 'INVULLEN-KVK-NUMMER',
  /** INVULLEN — je btw-identificatienummer, bijvoorbeeld NL001234567B01. */
  btw: 'INVULLEN-BTW-NUMMER',

  /** INVULLEN — het adres waar retourzendingen naartoe mogen. */
  returnAddress: {
    company: 'Melin_clo',
    street: 'INVULLEN-STRAAT EN HUISNUMMER',
    postalCode: 'INVULLEN-POSTCODE',
    city: 'Amsterdam',
    country: 'Nederland',
  },

  /** Verwerkingstijd en levertijd zoals ze op de site en in de mail staan. */
  delivery: {
    handlingDays: 1,
    nlDaysMin: 2,
    nlDaysMax: 3,
    beDaysMin: 3,
    beDaysMax: 4,
  },

  /** Bedenktijd volgens het Nederlandse herroepingsrecht. */
  returnDays: 14,
} as const;

/** "Melin_clo" met een net leesteken voor in lopende tekst. */
export const brandFull = site.name;

export const countries = [
  { code: 'NL', label: 'Nederland' },
  { code: 'BE', label: 'België' },
] as const;

export type CountryCode = (typeof countries)[number]['code'];
