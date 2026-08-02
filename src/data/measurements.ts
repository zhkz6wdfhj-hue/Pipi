/**
 * De maten die we opnemen voordat een jas of blazer in productie gaat.
 *
 * Er zijn geen confectiematen: na een bestelling nemen we contact op en lopen we
 * deze lijst samen door. Pas de lijst gerust aan als je atelier andere maten
 * nodig heeft — de maattabelpagina en de productpagina volgen vanzelf.
 */

export interface Measurement {
  /** Naam zoals de klant hem leest. */
  label: string;
  /** Hoe je hem opneemt, in één zin. */
  how: string;
}

export const measurements: Measurement[] = [
  {
    label: 'Borstwijdte',
    how: 'Rondom, over het volste deel van de borst, met het meetlint vlak maar niet strak.',
  },
  {
    label: 'Taille',
    how: 'Rondom, op het smalste punt — meestal een duim boven de navel.',
  },
  {
    label: 'Heup',
    how: 'Rondom, over het breedste deel, met de voeten tegen elkaar.',
  },
  {
    label: 'Schouderbreedte',
    how: 'Over de rug, van de ene schoudertop naar de andere.',
  },
  {
    label: 'Mouwlengte',
    how: 'Van de schoudertop, over de licht gebogen elleboog, tot waar je de manchet wilt hebben.',
  },
  {
    label: 'Gewenste lengte',
    how: 'Van de schoudernaad recht naar beneden tot waar de zoom moet vallen — knie, kuit of daartussenin.',
  },
  {
    label: 'Lichaamslengte',
    how: 'Zonder schoenen, tegen een muur. Hiermee stemmen we de verhoudingen af.',
  },
];

/**
 * Wat de klant onder de jas wil dragen, bepaalt hoeveel ruimte we aanhouden.
 * Deze keuzes nemen we telefonisch of per mail door.
 */
export const layeringOptions = [
  'Over een blouse of hemd',
  'Over een fijne trui',
  'Over een dikke gebreide trui',
] as const;
