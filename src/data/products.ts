/**
 * =============================================================================
 * Mèlin — productcatalogus
 * =============================================================================
 *
 * Dit bestand is de enige bron van waarheid voor het assortiment. Er is geen
 * CMS en geen database nodig: je past hier iets aan, slaat op, en de site
 * verandert mee.
 *
 * -----------------------------------------------------------------------------
 * EEN PRODUCT TOEVOEGEN — in zes stappen
 * -----------------------------------------------------------------------------
 * 1. Kopieer een bestaand blok uit de lijst `products` hieronder en plak het
 *    onderaan, vóór de afsluitende `];`.
 * 2. Geef het een unieke `slug`. Dat is het adres van de pagina:
 *    slug 'duinjas' wordt /product/duinjas. Gebruik kleine letters en
 *    koppeltekens, geen spaties of accenten.
 * 3. Zet `price` in HELE CENTEN. € 400,00 schrijf je als 40000. Zo ontstaan er
 *    geen afrondingsfouten in de winkelmand.
 * 4. Zet de foto's in /public/images en verwijs ernaar in `images`. Elke foto
 *    heeft een `alt`-tekst nodig die beschrijft wat je ziet — die wordt
 *    voorgelezen door schermlezers en is dus geen bijzaak.
 * 5. Vul `variants` met één regel per kleur, met een eigen artikelnummer.
 * 6. Wil je het product op de homepage tonen, zet dan `featured: true`. De
 *    homepage laat de eerste vier uitgelichte producten zien.
 *
 * -----------------------------------------------------------------------------
 * ALLES WORDT OP MAAT GEMAAKT
 * -----------------------------------------------------------------------------
 * Er zijn geen confectiematen en geen voorraad: elk kledingstuk wordt na de
 * bestelling gemaakt naar de maten van de klant. De klant kiest dus alleen een
 * kleur. De maten neem je zelf op nadat de bestelling binnen is.
 *
 * Daarom staat er nergens "uitverkocht", en hoef je niets bij te houden na een
 * bestelling. De lengte in `specs.lengthCm` is de standaardlengte van het model;
 * die pas je per klant aan.
 *
 * -----------------------------------------------------------------------------
 * KLEUREN EN FOTO'S
 * -----------------------------------------------------------------------------
 * De eerste kleur in `colors` is de kleur die op de foto's te zien is. De andere
 * kleuren zijn stoffen waarin je hetzelfde model ook maakt; de productpagina
 * vermeldt bij die keuze dat de foto's een andere kleur tonen. Heb je foto's in
 * een tweede kleur, maak er dan gerust een apart product van.
 *
 * -----------------------------------------------------------------------------
 * EEN PRIJS WIJZIGEN
 * -----------------------------------------------------------------------------
 * Pas alleen `price` aan (in centen). Bestellingen die al geplaatst zijn
 * bewaren hun eigen prijs, dus lopende bestellingen veranderen niet mee.
 *
 * -----------------------------------------------------------------------------
 * LATER OVERSTAPPEN NAAR SANITY OF SHOPIFY
 * -----------------------------------------------------------------------------
 * De rest van de site praat nooit rechtstreeks met deze lijst, maar altijd via
 * de functies onderaan dit bestand (`getAllProducts`, `getProductBySlug`,
 * `getFeaturedProducts`, ...). Wil je later een CMS, dan vervang je alleen de
 * inhoud van die functies door een API-aanroep en laat je het `Product`-type
 * intact. Geen enkele pagina hoeft dan aangepast te worden.
 */

export type Category = 'jassen' | 'blazers';

export type ColorSlug = 'zwart' | 'houtskool' | 'lichtgrijs' | 'kameel' | 'ecru' | 'bruin';

export interface ColorDefinition {
  slug: ColorSlug;
  /** Naam zoals de klant hem leest. */
  label: string;
  /** Kleurstaal in de filters. Benadert de stof, is nooit de enige informatie. */
  swatch: string;
  /** Randkleur van de staal, zodat lichte kleuren zichtbaar blijven op wit. */
  swatchBorder: string;
}

export const COLORS: Record<ColorSlug, ColorDefinition> = {
  zwart: { slug: 'zwart', label: 'Zwart', swatch: '#1E1F23', swatchBorder: '#101115' },
  houtskool: { slug: 'houtskool', label: 'Houtskool', swatch: '#4B4C50', swatchBorder: '#35363A' },
  lichtgrijs: {
    slug: 'lichtgrijs',
    label: 'Lichtgrijs',
    swatch: '#A9AEB4',
    swatchBorder: '#8E939A',
  },
  kameel: { slug: 'kameel', label: 'Kameel', swatch: '#C2A177', swatchBorder: '#A8865F' },
  ecru: { slug: 'ecru', label: 'Ecru', swatch: '#EDE3D2', swatchBorder: '#D6C9B2' },
  bruin: { slug: 'bruin', label: 'Donkerbruin', swatch: '#4A3830', swatchBorder: '#382A24' },
};

export const CATEGORIES: { slug: Category; label: string; labelSingular: string }[] = [
  { slug: 'jassen', label: 'Jassen', labelSingular: 'Jas' },
  { slug: 'blazers', label: 'Blazers', labelSingular: 'Blazer' },
];

export interface ProductImage {
  /** Pad vanaf /public, dus beginnend met /images/. */
  src: string;
  /** Beschrijvende Nederlandse alt-tekst. Verplicht. */
  alt: string;
  width: number;
  height: number;
}

export interface ProductVariant {
  color: ColorSlug;
  /** Eigen artikelnummer, handig voor je administratie en de werkbon. */
  sku: string;
}

export interface ProductSpecs {
  /** Samenstelling van de buitenstof. */
  composition: string;
  /** Voering, of de mededeling dat het kledingstuk ongevoerd is. */
  lining: string;
  /** Type sluiting. */
  closure: string;
  /** Standaardlengte in centimeters, van schoudernaad tot zoom. Per klant aangepast. */
  lengthCm: number;
  /** Waar het kledingstuk gemaakt is. */
  madeIn: string;
  /** Wasvoorschrift in één zin. */
  care: string;
}

export interface Product {
  slug: string;
  name: string;
  category: Category;
  /** Prijs in centen. 40000 = € 400,00. */
  price: number;
  /** Eén zin voor de collectiepagina en de zoekresultaten. */
  tagline: string;
  /** Volledige omschrijving, 40 tot 70 woorden. */
  description: string;
  /** De eerste kleur is de kleur die op de foto's te zien is. */
  colors: ColorSlug[];
  variants: ProductVariant[];
  images: ProductImage[];
  specs: ProductSpecs;
  featured: boolean;
  /** Datum waarop het model in de collectie kwam; bepaalt de sortering "Nieuw". */
  releasedAt: string;
}

/** Alle foto's zijn even groot; dat scheelt herhaling hieronder. */
const FOTO = { width: 960, height: 1200 } as const;

export const products: Product[] = [
  {
    slug: 'havenjas',
    name: 'Havenjas',
    category: 'jassen',
    price: 40000,
    tagline: 'Dubbelrij jas in zwarte wol, tot over de enkel.',
    description:
      'Een dubbelrij jas die tot over de enkel valt. De schouder ligt breed en recht, de revers is groot genoeg om hoog dicht te slaan. Zwarte wol met een dichte weving, waardoor de lijn strak blijft en de jas niet gaat bollen. Draag hem open over een broek, of gesloten met een ceintuur uit je eigen kast.',
    colors: ['zwart', 'houtskool', 'bruin'],
    variants: [
      { color: 'zwart', sku: 'MEL-HAV-ZWA' },
      { color: 'houtskool', sku: 'MEL-HAV-HOU' },
      { color: 'bruin', sku: 'MEL-HAV-BRU' },
    ],
    images: [
      {
        src: '/images/jas-havenjas-zwart-01.jpg',
        alt: 'Zwarte lange wollen jas met dubbele rij knopen, van voren gefotografeerd tegen een lichte achtergrond.',
        ...FOTO,
      },
      {
        src: '/images/jas-havenjas-zwart-02.jpg',
        alt: 'Dezelfde zwarte jas gedragen bij een lichte muur, waarbij de lengte tot over de enkel te zien is.',
        ...FOTO,
      },
      {
        src: '/images/jas-havenjas-zwart-03.jpg',
        alt: 'Detail van de dubbele knopenrij en de brede revers van de zwarte jas.',
        ...FOTO,
      },
      {
        src: '/images/jas-havenjas-zwart-04.jpg',
        alt: 'De zwarte jas gesloten gedragen, met een tas over de schouder.',
        ...FOTO,
      },
    ],
    specs: {
      composition: '90% scheerwol, 10% kasjmier',
      lining: 'Volledig gevoerd met cupro',
      closure: 'Dubbele rij knopen, zes knopen waarvan vier sluitend',
      lengthCm: 132,
      madeIn: 'Gemaakt in ons atelier in Amsterdam',
      care: 'Alleen chemisch reinigen; hang de jas na een regenbui op een brede hanger te drogen.',
    },
    featured: true,
    releasedAt: '2025-11-07',
  },
  {
    slug: 'duinjas',
    name: 'Duinjas',
    category: 'jassen',
    price: 40000,
    tagline: 'Dubbelrij jas in grijze visgraatwol, tot halverwege de kuit.',
    description:
      'Grijze wol met een fijne visgraat, van dichtbij zichtbaar en van een meter afstand egaal. Dubbele rij knopen, brede revers en twee kleppen op heuphoogte. De jas valt tot halverwege de kuit en houdt zijn vorm doordat de stof stevig is. Een jas voor doordeweekse dagen, over een colbert of over een trui.',
    colors: ['houtskool', 'zwart', 'kameel'],
    variants: [
      { color: 'houtskool', sku: 'MEL-DUI-HOU' },
      { color: 'zwart', sku: 'MEL-DUI-ZWA' },
      { color: 'kameel', sku: 'MEL-DUI-KAM' },
    ],
    images: [
      {
        src: '/images/jas-duinjas-houtskool-01.jpg',
        alt: 'Houtskoolgrijze lange wollen jas met dubbele rij knopen, van voren gefotografeerd in een lichte kamer.',
        ...FOTO,
      },
      {
        src: '/images/jas-duinjas-houtskool-02.jpg',
        alt: 'Dezelfde grijze jas open gedragen, waarbij de lengte tot halverwege de kuit zichtbaar is.',
        ...FOTO,
      },
      {
        src: '/images/jas-duinjas-houtskool-03.jpg',
        alt: 'De grijze jas van opzij, met zicht op de brede revers en de zakken met klep.',
        ...FOTO,
      },
      {
        src: '/images/jas-duinjas-houtskool-04.jpg',
        alt: 'Detailopname van de visgraatstructuur en de knopen van de grijze jas.',
        ...FOTO,
      },
    ],
    specs: {
      composition: '80% scheerwol, 20% gerecycled polyamide',
      lining: 'Volledig gevoerd met cupro',
      closure: 'Dubbele rij knopen, zes knopen waarvan vier sluitend',
      lengthCm: 120,
      madeIn: 'Gemaakt in ons atelier in Amsterdam',
      care: 'Alleen chemisch reinigen; borstel de wol na het dragen uit met een zachte kledingborstel.',
    },
    featured: true,
    releasedAt: '2025-10-24',
  },
  {
    slug: 'kadejas',
    name: 'Kadejas',
    category: 'jassen',
    price: 40000,
    tagline: 'Kameelkleurige jas met hoge kraag en ceintuur.',
    description:
      'De kraag staat rechtop en sluit met drie knopen tot onder de kin, zodat je geen sjaal nodig hebt. Daaronder loopt de jas ruim door en wordt hij gesloten met een ceintuur van dezelfde stof. Zachte kameelkleurige wol met een lichte glans. Knoop de ceintuur los en de jas valt als een cape.',
    colors: ['kameel', 'ecru', 'bruin'],
    variants: [
      { color: 'kameel', sku: 'MEL-KAD-KAM' },
      { color: 'ecru', sku: 'MEL-KAD-ECR' },
      { color: 'bruin', sku: 'MEL-KAD-BRU' },
    ],
    images: [
      {
        src: '/images/jas-kadejas-kameel-01.jpg',
        alt: 'Kameelkleurige wollen jas met hoge opstaande kraag die met drie knopen sluit, en een geknoopte ceintuur.',
        ...FOTO,
      },
      {
        src: '/images/jas-kadejas-kameel-02.jpg',
        alt: 'De kameelkleurige jas van dichtbij, met zicht op de ruime mouw en de geknoopte ceintuur.',
        ...FOTO,
      },
      {
        src: '/images/jas-kadejas-kameel-03.jpg',
        alt: 'Detail van de opstaande kraag en de knopen van de kameelkleurige jas.',
        ...FOTO,
      },
    ],
    specs: {
      composition: '70% scheerwol, 25% alpaca, 5% polyamide',
      lining: 'Half gevoerd met cupro in rug en mouwen',
      closure: 'Opstaande kraag met drie knopen, gesloten met een ceintuur',
      lengthCm: 118,
      madeIn: 'Gemaakt in ons atelier in Amsterdam',
      care: 'Alleen chemisch reinigen; strijk de ceintuur zo nodig met een doek ertussen.',
    },
    featured: true,
    releasedAt: '2025-10-03',
  },
  {
    slug: 'lijnjas',
    name: 'Lijnjas',
    category: 'jassen',
    price: 40000,
    tagline: 'Het langste en smalste model, in lichtgrijze wol.',
    description:
      'Het langste model dat we maken: één rechte lijn van schouder tot enkel, zonder ceintuur en zonder extra volume. De lichtgrijze wol is dunner dan bij de andere jassen, waardoor hij soepel meeloopt in plaats van stijf te blijven staan. Smalle revers, verzonken knopen, zakken in de naad. Mooi over iets lichts eronder.',
    colors: ['lichtgrijs', 'houtskool', 'zwart'],
    variants: [
      { color: 'lichtgrijs', sku: 'MEL-LIJ-LGR' },
      { color: 'houtskool', sku: 'MEL-LIJ-HOU' },
      { color: 'zwart', sku: 'MEL-LIJ-ZWA' },
    ],
    images: [
      {
        src: '/images/jas-lijnjas-lichtgrijs-01.jpg',
        alt: 'Lichtgrijze lange wollen jas, recht model, gedragen op straat met een tas over de arm.',
        ...FOTO,
      },
      {
        src: '/images/jas-lijnjas-lichtgrijs-02.jpg',
        alt: 'Dezelfde lichtgrijze jas open gedragen, waarbij de lengte tot de enkel te zien is.',
        ...FOTO,
      },
      {
        src: '/images/jas-lijnjas-lichtgrijs-03.jpg',
        alt: 'De lichtgrijze jas van achteren, met zicht op de rechte lijn van schouder tot zoom.',
        ...FOTO,
      },
      {
        src: '/images/jas-lijnjas-lichtgrijs-04.jpg',
        alt: 'De lichtgrijze jas gedragen over een lichte broek en een grijze trui.',
        ...FOTO,
      },
    ],
    specs: {
      composition: '75% scheerwol, 25% viscose',
      lining: 'Half gevoerd met cupro in de rug',
      closure: 'Enkele rij verzonken knopen, vier knopen',
      lengthCm: 138,
      madeIn: 'Gemaakt in ons atelier in Amsterdam',
      care: 'Alleen chemisch reinigen; hang de jas los in de kast zodat de schouders hun vorm houden.',
    },
    featured: false,
    releasedAt: '2025-11-21',
  },
  {
    slug: 'veldjas',
    name: 'Veldjas',
    category: 'jassen',
    price: 40000,
    tagline: 'Rechte jas in donkerbruine wol, met kleppen op de zakken.',
    description:
      'Donkerbruine wol met een warme ondertoon die in de herfst goed samengaat met kaki en crème. Recht model met kleppen op de zakken en een klein, strak revers. De jas valt tot over de knie en heeft een split achter, zodat je er goed in kunt lopen. Draag hem open, met de mouwen los.',
    colors: ['bruin', 'houtskool', 'zwart'],
    variants: [
      { color: 'bruin', sku: 'MEL-VEL-BRU' },
      { color: 'houtskool', sku: 'MEL-VEL-HOU' },
      { color: 'zwart', sku: 'MEL-VEL-ZWA' },
    ],
    images: [
      {
        src: '/images/jas-veldjas-bruin-01.jpg',
        alt: 'Donkerbruine lange wollen jas gedragen op straat, met een tas over de schouder.',
        ...FOTO,
      },
      {
        src: '/images/jas-veldjas-bruin-02.jpg',
        alt: 'Dezelfde donkerbruine jas over een houten bank, tussen herfstbladeren.',
        ...FOTO,
      },
      {
        src: '/images/jas-veldjas-bruin-03.jpg',
        alt: 'De donkerbruine jas open gedragen over een spijkerbroek en een lichte trui.',
        ...FOTO,
      },
    ],
    specs: {
      composition: '85% scheerwol, 15% mohair',
      lining: 'Volledig gevoerd met cupro, één binnenzak',
      closure: 'Enkele rij verzonken knopen, vier knopen',
      lengthCm: 122,
      madeIn: 'Gemaakt in ons atelier in Amsterdam',
      care: 'Alleen chemisch reinigen; laat de jas na een natte dag eerst drogen voordat je hem opbergt.',
    },
    featured: false,
    releasedAt: '2025-09-26',
  },
  {
    slug: 'atelierblazer',
    name: 'Atelierblazer',
    category: 'blazers',
    price: 40000,
    tagline: 'Ongevoerde blazer in gebroken wit, ook voor het voorjaar.',
    description:
      'Ongevoerde blazer in gebroken wit, met open naden aan de binnenkant zodat hij licht blijft. De wol is losser geweven en voelt bijna als linnen. Eén knoop, zachte schouder, geen vulling. Omdat er geen voering in zit valt hij dicht om het lichaam; we houden bij het opmeten daarom iets meer ruimte aan.',
    colors: ['ecru', 'kameel', 'lichtgrijs'],
    variants: [
      { color: 'ecru', sku: 'MEL-ATE-ECR' },
      { color: 'kameel', sku: 'MEL-ATE-KAM' },
      { color: 'lichtgrijs', sku: 'MEL-ATE-LGR' },
    ],
    images: [
      {
        src: '/images/blazer-atelierblazer-ecru-01.jpg',
        alt: 'Gebroken witte wollen blazer met één knoop, gedragen over een spijkerbroek in de sneeuw.',
        ...FOTO,
      },
      {
        src: '/images/blazer-atelierblazer-ecru-02.jpg',
        alt: 'Dezelfde gebroken witte blazer met een grote wollen sjaal eroverheen, tegen een lichte achtergrond.',
        ...FOTO,
      },
    ],
    specs: {
      composition: '100% scheerwol',
      lining: 'Ongevoerd, met afgewerkte binnennaden',
      closure: 'Eén knoop',
      lengthCm: 72,
      madeIn: 'Gemaakt in ons atelier in Amsterdam',
      care: 'Alleen chemisch reinigen; hang de blazer luchtig op, hij kreukt sneller dan een gevoerd model.',
    },
    featured: true,
    releasedAt: '2025-11-21',
  },
  {
    slug: 'grachtblazer',
    name: 'Grachtblazer',
    category: 'blazers',
    price: 40000,
    tagline: 'Ruime dubbelrij blazer in glad afgewerkte grijze wol.',
    description:
      'Ruime blazer met een laag gezette schouder en een brede revers, in grijze wol die glad is afgewerkt. Dubbele rij knopen, waarvan je er meestal maar één sluit. De mouw is bewust wat langer, zodat hij tot over de pols valt. Draag hem over een hemd op kantoor, of los over een T-shirt.',
    colors: ['houtskool', 'zwart', 'lichtgrijs'],
    variants: [
      { color: 'houtskool', sku: 'MEL-GRA-HOU' },
      { color: 'zwart', sku: 'MEL-GRA-ZWA' },
      { color: 'lichtgrijs', sku: 'MEL-GRA-LGR' },
    ],
    images: [
      {
        src: '/images/blazer-grachtblazer-houtskool-01.jpg',
        alt: 'Grijze ruime wollen blazer met dubbele rij knopen, gedragen over een donkere broek.',
        ...FOTO,
      },
      {
        src: '/images/blazer-grachtblazer-houtskool-02.jpg',
        alt: 'Detail van de brede revers van de grijze blazer, gedragen over een lichtblauw hemd.',
        ...FOTO,
      },
    ],
    specs: {
      composition: '95% scheerwol, 5% elastaan',
      lining: 'Volledig gevoerd met viscose',
      closure: 'Dubbele rij knopen, vier knopen waarvan twee sluitend',
      lengthCm: 76,
      madeIn: 'Gemaakt in ons atelier in Amsterdam',
      care: 'Alleen chemisch reinigen; stoom de blazer kort als er een vouw in zit.',
    },
    featured: false,
    releasedAt: '2025-09-12',
  },
  {
    slug: 'zondagblazer',
    name: 'Zondagblazer',
    category: 'blazers',
    price: 40000,
    tagline: 'Lange zwarte blazer, ruim gesneden en zwaarder van stof.',
    description:
      'Lange zwarte blazer die net over de heup valt, ruim gesneden en met een schouder die iets afhangt. De wol is zwaarder dan bij de andere blazers, waardoor hij netjes valt in plaats van bol te staan. Twee knopen, diepe zakken. In deze lengte kun je hem op zachte dagen als jas dragen.',
    colors: ['zwart', 'houtskool', 'bruin'],
    variants: [
      { color: 'zwart', sku: 'MEL-ZON-ZWA' },
      { color: 'houtskool', sku: 'MEL-ZON-HOU' },
      { color: 'bruin', sku: 'MEL-ZON-BRU' },
    ],
    images: [
      {
        src: '/images/blazer-zondagblazer-zwart-01.jpg',
        alt: 'Lange zwarte wollen blazer, ruim gesneden, gedragen op straat.',
        ...FOTO,
      },
      {
        src: '/images/blazer-zondagblazer-zwart-02.jpg',
        alt: 'Dezelfde zwarte blazer buiten gedragen over een spijkerbroek, tussen herfstbladeren.',
        ...FOTO,
      },
    ],
    specs: {
      composition: '80% scheerwol, 20% alpaca',
      lining: 'Half gevoerd met cupro in de rug',
      closure: 'Enkele rij knopen, twee knopen',
      lengthCm: 80,
      madeIn: 'Gemaakt in ons atelier in Amsterdam',
      care: 'Alleen chemisch reinigen; borstel de wol na het dragen uit zodat pluis van de trui verdwijnt.',
    },
    featured: false,
    releasedAt: '2025-10-03',
  },
];

/* =============================================================================
   Toegang tot de catalogus
   Alle pagina's gebruiken uitsluitend de functies hieronder. Vervang de inhoud
   van deze functies als je later naar een CMS overstapt.
   ========================================================================== */

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((product) => product.featured).slice(0, limit);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((product) => product.category === category);
}

/** Drie andere producten, voor onderaan de productpagina. */
export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return products.slice(0, limit);

  const sameCategory = products.filter((p) => p.slug !== slug && p.category === current.category);
  const otherCategory = products.filter((p) => p.slug !== slug && p.category !== current.category);

  return [...sameCategory, ...otherCategory].slice(0, limit);
}

export function getVariant(product: Product, color: ColorSlug): ProductVariant | undefined {
  return product.variants.find((variant) => variant.color === color);
}

/** Kleuren die in de collectie voorkomen, in de volgorde van COLORS. */
export function usedColors(): ColorDefinition[] {
  const used = new Set<ColorSlug>();
  products.forEach((product) => product.colors.forEach((color) => used.add(color)));
  return (Object.keys(COLORS) as ColorSlug[])
    .filter((slug) => used.has(slug))
    .map((slug) => COLORS[slug]);
}

/** Eenvoudige zoekfunctie over naam, omschrijving, kleur en categorie. */
export function searchProducts(query: string): Product[] {
  const term = query.trim().toLowerCase();
  if (term.length < 2) return [];

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.tagline,
      product.description,
      product.category,
      ...product.colors.map((color) => COLORS[color].label),
      product.specs.composition,
    ]
      .join(' ')
      .toLowerCase();

    return term.split(/\s+/).every((word) => haystack.includes(word));
  });
}
