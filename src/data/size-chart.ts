/**
 * Maattabel. De maten zijn gemeten op het kledingstuk zelf, plat op tafel en
 * daarna verdubbeld waar dat logisch is. Pas de getallen aan als je met een
 * ander atelier gaat werken.
 */

import type { Size } from './products';

export interface SizeRow {
  size: Size;
  /** Confectiemaat zoals in Nederland gebruikelijk. */
  nl: string;
  /** Borstwijdte van het kledingstuk in cm, rondom gemeten. */
  chest: number;
  /** Schouderbreedte naad tot naad in cm. */
  shoulder: number;
  /** Mouwlengte van schoudernaad tot manchet in cm. */
  sleeve: number;
}

export const coatSizeChart: SizeRow[] = [
  { size: 'XS', nl: '34', chest: 96, shoulder: 39.5, sleeve: 60 },
  { size: 'S', nl: '36 – 38', chest: 102, shoulder: 41, sleeve: 61 },
  { size: 'M', nl: '38 – 40', chest: 108, shoulder: 42.5, sleeve: 62 },
  { size: 'L', nl: '40 – 42', chest: 114, shoulder: 44, sleeve: 63 },
  { size: 'XL', nl: '44', chest: 120, shoulder: 45.5, sleeve: 64 },
];

export const blazerSizeChart: SizeRow[] = [
  { size: 'XS', nl: '34', chest: 90, shoulder: 38, sleeve: 58 },
  { size: 'S', nl: '36 – 38', chest: 96, shoulder: 39.5, sleeve: 59 },
  { size: 'M', nl: '38 – 40', chest: 102, shoulder: 41, sleeve: 60 },
  { size: 'L', nl: '40 – 42', chest: 108, shoulder: 42.5, sleeve: 61 },
  { size: 'XL', nl: '44', chest: 114, shoulder: 44, sleeve: 62 },
];
