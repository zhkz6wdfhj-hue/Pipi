/**
 * =============================================================================
 * Melin_clo — productcatalogus
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

export type ColorSlug = 'kameel' | 'ecru' | 'houtskool' | 'taupe' | 'donkergroen';

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
  kameel: { slug: 'kameel', label: 'Kameel', swatch: '#B99770', swatchBorder: '#A8865F' },
  ecru: { slug: 'ecru', label: 'Ecru', swatch: '#EDE3D2', swatchBorder: '#D6C9B2' },
  houtskool: { slug: 'houtskool', label: 'Houtskool', swatch: '#45464A', swatchBorder: '#35363A' },
  taupe: { slug: 'taupe', label: 'Taupe', swatch: '#9A8E7E', swatchBorder: '#877B6C' },
  donkergroen: {
    slug: 'donkergroen',
    label: 'Donkergroen',
    swatch: '#3E4B3F',
    swatchBorder: '#2F3A30',
  },
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
  colors: ColorSlug[];
  variants: ProductVariant[];
  images: ProductImage[];
  specs: ProductSpecs;
  featured: boolean;
  /** Datum waarop het product in de collectie kwam; bepaalt de sortering "Nieuw". */
  releasedAt: string;
}

export const products: Product[] = [
  {
    slug: 'duinjas',
    name: 'Duinjas',
    category: 'jassen',
    price: 40000,
    tagline: 'Rechte jas van geborstelde wol, net onder de knie.',
    description:
      'Een rechte jas van geborstelde wol die net onder de knie valt. De schouder ligt iets ruimer, zodat er een trui onder past zonder dat de jas breed oogt. Verdekte knoopsluiting, twee steekzakken op heuphoogte en een split achter voor de looplijn. Draag hem open over een broek, of gesloten met de kraag omhoog als het waait.',
    colors: ['kameel', 'ecru'],
    variants: [
      { color: 'kameel', sku: 'MEL-DUI-KAM' },
      { color: 'ecru', sku: 'MEL-DUI-ECR' },
    ],
    images: [
      {
        src: '/images/jas-duinjas-kameel-01.jpg',
        alt: 'Kameelkleurige lange wollen jas, recht model, gefotografeerd van voren op een warm witte achtergrond.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-duinjas-kameel-02.jpg',
        alt: 'Dezelfde kameelkleurige jas van opzij, waarbij de lengte tot net onder de knie te zien is.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-duinjas-kameel-03.jpg',
        alt: 'Detailopname van de verdekte knoopsluiting en de kraag van de kameelkleurige jas.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-duinjas-kameel-04.jpg',
        alt: 'De kameelkleurige jas open gedragen over een donkere broek, gezien vanaf de heup.',
        width: 1200,
        height: 1500,
      },
    ],
    specs: {
      composition: '80% scheerwol, 20% gerecycled polyamide',
      lining: 'Volledig gevoerd met cupro',
      closure: 'Verdekte knoopsluiting, vijf knopen',
      lengthCm: 118,
      madeIn: 'Genaaid in Portugal',
      care: 'Alleen chemisch reinigen; borstel de wol na het dragen uit met een zachte kledingborstel.',
    },
    featured: true,
    releasedAt: '2025-09-12',
  },
  {
    slug: 'havenjas',
    name: 'Havenjas',
    category: 'jassen',
    price: 40000,
    tagline: 'Dubbelrij jas tot halverwege de kuit, in dicht geweven wol.',
    description:
      'De langste jas uit de collectie, met een dubbele rij knopen en een brede revers die je hoog kunt dichtslaan. De wol is dicht geweven en houdt wind tegen; de voering van cupro laat de jas soepel over een colbert glijden. Valt tot halverwege de kuit. Een jas voor koude ochtenden en late treinen.',
    colors: ['houtskool', 'taupe'],
    variants: [
      { color: 'houtskool', sku: 'MEL-HAV-HOU' },
      { color: 'taupe', sku: 'MEL-HAV-TAU' },
    ],
    images: [
      {
        src: '/images/jas-havenjas-houtskool-01.jpg',
        alt: 'Lange wollen jas in houtskoolgrijs met dubbele rij knopen, van voren gefotografeerd.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-havenjas-houtskool-02.jpg',
        alt: 'De houtskoolgrijze jas gesloten gedragen, met de brede revers hoog dichtgeslagen.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-havenjas-houtskool-03.jpg',
        alt: 'Detail van de dubbele knopenrij en het weefsel van de houtskoolgrijze wol.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-havenjas-houtskool-04.jpg',
        alt: 'De houtskoolgrijze jas van achteren, waarbij de lengte tot halverwege de kuit zichtbaar is.',
        width: 1200,
        height: 1500,
      },
    ],
    specs: {
      composition: '90% scheerwol, 10% kasjmier',
      lining: 'Volledig gevoerd met cupro',
      closure: 'Dubbele rij knopen, zes knopen waarvan vier sluitend',
      lengthCm: 122,
      madeIn: 'Genaaid in Portugal',
      care: 'Alleen chemisch reinigen; hang de jas na een regenbui op een brede hanger te drogen.',
    },
    featured: true,
    releasedAt: '2025-09-12',
  },
  {
    slug: 'kadejas',
    name: 'Kadejas',
    category: 'jassen',
    price: 40000,
    tagline: 'Wikkeljas met ceintuur, in een zachte en luchtige wolmix.',
    description:
      'Een wikkeljas zonder knopen: je sluit hem met de ceintuur, of laat hem los hangen. De wolmix is zachter en iets luchtiger dan de rest van de collectie, waardoor de jas mooi meebeweegt. De taille kun je hoog of laag leggen. Werkt over een jurk net zo goed als over een spijkerbroek en trui.',
    colors: ['ecru', 'kameel'],
    variants: [
      { color: 'ecru', sku: 'MEL-KAD-ECR' },
      { color: 'kameel', sku: 'MEL-KAD-KAM' },
    ],
    images: [
      {
        src: '/images/jas-kadejas-ecru-01.jpg',
        alt: 'Ecru wikkeljas van wol met ceintuur, gesloten gedragen en van voren gefotografeerd.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-kadejas-ecru-02.jpg',
        alt: 'De ecru wikkeljas los hangend, waarbij de val van de stof te zien is.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-kadejas-ecru-03.jpg',
        alt: 'Detail van de geknoopte ceintuur op de taille van de ecru wikkeljas.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-kadejas-ecru-04.jpg',
        alt: 'De ecru wikkeljas van opzij, gedragen over een lange jurk.',
        width: 1200,
        height: 1500,
      },
    ],
    specs: {
      composition: '70% scheerwol, 25% alpaca, 5% polyamide',
      lining: 'Half gevoerd met cupro in rug en mouwen',
      closure: 'Ceintuur van dezelfde stof, geen knopen',
      lengthCm: 115,
      madeIn: 'Genaaid in Portugal',
      care: 'Alleen chemisch reinigen; strijk de ceintuur zo nodig met een doek ertussen.',
    },
    featured: true,
    releasedAt: '2025-10-03',
  },
  {
    slug: 'veldjas',
    name: 'Veldjas',
    category: 'jassen',
    price: 40000,
    tagline: 'Rechte jas in melangewol, met kleppen op de zakken.',
    description:
      'Rechte jas met een klein, strak revers en verzonken knopen, zodat de voorkant rustig blijft. De wol heeft een lichte melange waardoor het groen in de zon warmer oogt dan binnen. Twee ruime zakken met klep, één binnenzak. De lengte valt tot over de knie en houdt je benen uit de wind tijdens lange wandelingen.',
    colors: ['donkergroen', 'houtskool'],
    variants: [
      { color: 'donkergroen', sku: 'MEL-VEL-DGR' },
      { color: 'houtskool', sku: 'MEL-VEL-HOU' },
    ],
    images: [
      {
        src: '/images/jas-veldjas-donkergroen-01.jpg',
        alt: 'Donkergroene lange wollen jas met kleppen op de zakken, van voren gefotografeerd.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-veldjas-donkergroen-02.jpg',
        alt: 'De donkergroene jas open gedragen, waarbij de voering en de binnenzak zichtbaar zijn.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-veldjas-donkergroen-03.jpg',
        alt: 'Detail van de melangewol en een verzonken knoop van de donkergroene jas.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-veldjas-donkergroen-04.jpg',
        alt: 'De donkergroene jas buiten gedragen, van opzij, met de handen in de zakken.',
        width: 1200,
        height: 1500,
      },
    ],
    specs: {
      composition: '85% scheerwol, 15% mohair',
      lining: 'Volledig gevoerd met cupro, één binnenzak',
      closure: 'Enkele rij verzonken knopen, vier knopen',
      lengthCm: 120,
      madeIn: 'Genaaid in Portugal',
      care: 'Alleen chemisch reinigen; laat de jas na een natte dag eerst drogen voordat je hem opbergt.',
    },
    featured: false,
    releasedAt: '2025-10-03',
  },
  {
    slug: 'lijnjas',
    name: 'Lijnjas',
    category: 'jassen',
    price: 40000,
    tagline: 'De smalste jas uit de collectie, in dunnere wol.',
    description:
      'Het smalste model dat we maken: rechte lijn van schouder tot zoom, zonder ceintuur of extra volume. Door de dunnere wolkwaliteit draag je hem al vanaf begin oktober, ook binnen over een blouse. Enkele rij knopen, smalle revers, zakken in de naad. Draag je er graag een dikke trui onder, zeg het dan bij het opnemen van de maten; dan houden we extra ruimte aan.',
    colors: ['taupe', 'houtskool'],
    variants: [
      { color: 'taupe', sku: 'MEL-LIJ-TAU' },
      { color: 'houtskool', sku: 'MEL-LIJ-HOU' },
    ],
    images: [
      {
        src: '/images/jas-lijnjas-taupe-01.jpg',
        alt: 'Taupekleurige smalle wollen jas, recht model, van voren gefotografeerd.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-lijnjas-taupe-02.jpg',
        alt: 'De taupekleurige jas van opzij, waarbij de rechte lijn van schouder tot zoom te zien is.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-lijnjas-taupe-03.jpg',
        alt: 'Detail van de smalle revers en de eerste knoop van de taupekleurige jas.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/jas-lijnjas-taupe-04.jpg',
        alt: 'De taupekleurige jas binnen gedragen over een lichte blouse.',
        width: 1200,
        height: 1500,
      },
    ],
    specs: {
      composition: '75% scheerwol, 25% viscose',
      lining: 'Half gevoerd met cupro in de rug',
      closure: 'Enkele rij knopen, drie knopen',
      lengthCm: 112,
      madeIn: 'Genaaid in Portugal',
      care: 'Alleen chemisch reinigen; hang de jas los in de kast zodat de schouders hun vorm houden.',
    },
    featured: false,
    releasedAt: '2025-11-07',
  },
  {
    slug: 'grachtblazer',
    name: 'Grachtblazer',
    category: 'blazers',
    price: 40000,
    tagline: 'Enkelrij blazer met twee knopen, in glad afgewerkte wol.',
    description:
      'Een enkelrij blazer met twee knopen en een licht getailleerde zijnaad. De wol is glad afgewerkt, dus de blazer blijft strak zitten zonder te kreuken. Schoudervulling is dun gehouden, waardoor de lijn zacht blijft. Draag hem op kantoor over een hemd, of ’s avonds met een T-shirt en de mouwen één slag opgerold.',
    colors: ['houtskool', 'taupe'],
    variants: [
      { color: 'houtskool', sku: 'MEL-GRA-HOU' },
      { color: 'taupe', sku: 'MEL-GRA-TAU' },
    ],
    images: [
      {
        src: '/images/blazer-grachtblazer-houtskool-01.jpg',
        alt: 'Houtskoolgrijze wollen blazer met twee knopen, van voren gefotografeerd.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/blazer-grachtblazer-houtskool-02.jpg',
        alt: 'De houtskoolgrijze blazer open gedragen over een wit hemd.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/blazer-grachtblazer-houtskool-03.jpg',
        alt: 'Detail van de revers en de borstzak van de houtskoolgrijze blazer.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/blazer-grachtblazer-houtskool-04.jpg',
        alt: 'De houtskoolgrijze blazer van achteren, met zicht op de split in het rugpand.',
        width: 1200,
        height: 1500,
      },
    ],
    specs: {
      composition: '95% scheerwol, 5% elastaan',
      lining: 'Volledig gevoerd met viscose',
      closure: 'Enkele rij knopen, twee knopen',
      lengthCm: 74,
      madeIn: 'Genaaid in Portugal',
      care: 'Alleen chemisch reinigen; stoom de blazer kort als er een vouw in zit.',
    },
    featured: false,
    releasedAt: '2025-09-26',
  },
  {
    slug: 'atelierblazer',
    name: 'Atelierblazer',
    category: 'blazers',
    price: 40000,
    tagline: 'Ongevoerde blazer in losjes geweven wol, ook voor het voorjaar.',
    description:
      'Ongevoerde blazer met open naden aan de binnenkant, zodat hij licht blijft en ook in het voorjaar te dragen is. De wol is losser geweven en voelt bijna als linnen. Eén knoop, ronde zoom, geen schoudervulling. Omdat er geen voering in zit valt hij dichter om het lichaam, dus we houden bij het opmeten iets meer ruimte aan dan bij de andere modellen.',
    colors: ['ecru', 'kameel'],
    variants: [
      { color: 'ecru', sku: 'MEL-ATE-ECR' },
      { color: 'kameel', sku: 'MEL-ATE-KAM' },
    ],
    images: [
      {
        src: '/images/blazer-atelierblazer-ecru-01.jpg',
        alt: 'Ecru ongevoerde wollen blazer met één knoop, van voren gefotografeerd.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/blazer-atelierblazer-ecru-02.jpg',
        alt: 'De ecru blazer open gedragen, waarbij de afgewerkte binnennaden zichtbaar zijn.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/blazer-atelierblazer-ecru-03.jpg',
        alt: 'Detail van het losse weefsel en de ronde zoom van de ecru blazer.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/blazer-atelierblazer-ecru-04.jpg',
        alt: 'De ecru blazer van opzij, met de mouwen één slag opgerold.',
        width: 1200,
        height: 1500,
      },
    ],
    specs: {
      composition: '100% scheerwol',
      lining: 'Ongevoerd, met afgewerkte binnennaden',
      closure: 'Eén knoop',
      lengthCm: 71,
      madeIn: 'Genaaid in Portugal',
      care: 'Alleen chemisch reinigen; hang de blazer luchtig op, hij kreukt sneller dan een gevoerd model.',
    },
    featured: false,
    releasedAt: '2025-11-07',
  },
  {
    slug: 'zondagblazer',
    name: 'Zondagblazer',
    category: 'blazers',
    price: 40000,
    tagline: 'Ruime blazer in zwaardere wol, te dragen over een trui.',
    description:
      'Ruime blazer met laag gezette schouder en langere mouw, bedoeld om over een trui te dragen. De wol is zwaarder dan bij de andere blazers, waardoor hij netjes valt in plaats van bol te staan. Eén knoop op heuphoogte, diepe zakken. In deze lengte vervangt hij op zachte dagen een jas.',
    colors: ['kameel', 'donkergroen'],
    variants: [
      { color: 'kameel', sku: 'MEL-ZON-KAM' },
      { color: 'donkergroen', sku: 'MEL-ZON-DGR' },
    ],
    images: [
      {
        src: '/images/blazer-zondagblazer-kameel-01.jpg',
        alt: 'Kameelkleurige ruime wollen blazer met één knoop, van voren gefotografeerd.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/blazer-zondagblazer-kameel-02.jpg',
        alt: 'De kameelkleurige blazer gedragen over een dikke trui, van voren.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/blazer-zondagblazer-kameel-03.jpg',
        alt: 'Detail van de laag gezette schouder en de langere mouw van de kameelkleurige blazer.',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/blazer-zondagblazer-kameel-04.jpg',
        alt: 'De kameelkleurige blazer van opzij, met een hand in de diepe zijzak.',
        width: 1200,
        height: 1500,
      },
    ],
    specs: {
      composition: '80% scheerwol, 20% alpaca',
      lining: 'Half gevoerd met cupro in de rug',
      closure: 'Eén knoop op heuphoogte',
      lengthCm: 78,
      madeIn: 'Genaaid in Portugal',
      care: 'Alleen chemisch reinigen; borstel de wol na het dragen uit zodat pluis van de trui verdwijnt.',
    },
    featured: true,
    releasedAt: '2025-10-24',
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
