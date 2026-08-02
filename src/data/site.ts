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
    'Lange wollen jassen en blazers, na je bestelling op maat gemaakt. Melin_clo maakt niets vooruit: warme wol, rustige kleuren en een pasvorm die van jou alleen is.',

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

  /**
   * Levertijd. Alles wordt na de bestelling op maat gemaakt, dus dit is de tijd
   * van bestelling tot bezorging — inclusief het opnemen van de maten en het
   * naaien. Wordt overal op de site en in de e-mails uit deze twee getallen
   * opgebouwd.
   */
  delivery: {
    weeksMin: 4,
    weeksMax: 6,
    /** Binnen hoeveel werkdagen je contact opneemt om de maten door te nemen. */
    contactWithinDays: 2,
  },

  /**
   * Maatwerk valt buiten het wettelijke herroepingsrecht; er is dus geen
   * bedenktijd van veertien dagen. In plaats daarvan beloven we de jas
   * kosteloos aan te passen tot hij past. Dit is het aantal dagen na ontvangst
   * waarbinnen de klant dat moet melden — pas het gerust aan.
   */
  alterationDays: 30,
} as const;

/** "Melin_clo" met een net leesteken voor in lopende tekst. */
export const brandFull = site.name;

export const countries = [
  { code: 'NL', label: 'Nederland' },
  { code: 'BE', label: 'België' },
] as const;

export type CountryCode = (typeof countries)[number]['code'];
