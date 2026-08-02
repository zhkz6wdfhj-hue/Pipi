/**
 * Filters en sortering van de collectiepagina.
 *
 * De filterstatus staat volledig in de URL, bijvoorbeeld:
 *   /collectie?categorie=jassen&kleur=kameel,ecru&sorteer=prijs-op
 *
 * Daardoor is een gefilterde pagina deelbaar, werkt de terugknop van de browser
 * zoals verwacht, en kan de pagina op de server gerenderd worden zonder dat er
 * JavaScript aan te pas komt.
 */

import { COLORS, type Category, type ColorSlug, type Product } from '@/data/products';

export type SortKey = 'nieuw' | 'prijs-op' | 'prijs-af';

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'nieuw', label: 'Nieuwste eerst' },
  { key: 'prijs-op', label: 'Prijs oplopend' },
  { key: 'prijs-af', label: 'Prijs aflopend' },
];

export interface CollectionFilters {
  categorie: Category | null;
  kleuren: ColorSlug[];
  sorteer: SortKey;
}

/** Zoekparameters zoals Next die aanlevert. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function parseList(value: string | string[] | undefined): string[] {
  const raw = first(value);
  if (!raw) return [];
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseFilters(searchParams: RawSearchParams): CollectionFilters {
  const categorie = first(searchParams.categorie);
  const sorteer = first(searchParams.sorteer);

  return {
    categorie: categorie === 'jassen' || categorie === 'blazers' ? categorie : null,
    kleuren: parseList(searchParams.kleur).filter(
      (value): value is ColorSlug => value in COLORS
    ),
    sorteer: SORT_OPTIONS.some((option) => option.key === sorteer) ? (sorteer as SortKey) : 'nieuw',
  };
}

/** Bouwt een URL met dezelfde filters, maar met één ding gewijzigd. */
export function buildFilterUrl(
  filters: CollectionFilters,
  change: Partial<{
    categorie: Category | null;
    kleur: ColorSlug;
    sorteer: SortKey;
    leegmaken: true;
  }>
): string {
  if (change.leegmaken) return '/collectie';

  const params = new URLSearchParams();

  const categorie = change.categorie !== undefined ? change.categorie : filters.categorie;
  if (categorie) params.set('categorie', categorie);

  let kleuren = [...filters.kleuren];
  if (change.kleur) {
    kleuren = kleuren.includes(change.kleur)
      ? kleuren.filter((kleur) => kleur !== change.kleur)
      : [...kleuren, change.kleur];
  }
  if (kleuren.length > 0) params.set('kleur', kleuren.join(','));

  const sorteer = change.sorteer ?? filters.sorteer;
  if (sorteer !== 'nieuw') params.set('sorteer', sorteer);

  const query = params.toString();
  return query ? `/collectie?${query}` : '/collectie';
}

export function applyFilters(products: Product[], filters: CollectionFilters): Product[] {
  const gefilterd = products.filter((product) => {
    if (filters.categorie && product.category !== filters.categorie) return false;

    if (filters.kleuren.length > 0) {
      const match = product.colors.some((color) => filters.kleuren.includes(color));
      if (!match) return false;
    }

    return true;
  });

  return sortProducts(gefilterd, filters.sorteer);
}

export function sortProducts(products: Product[], sorteer: SortKey): Product[] {
  const gesorteerd = [...products];

  switch (sorteer) {
    case 'prijs-op':
      return gesorteerd.sort((a, b) => a.price - b.price);
    case 'prijs-af':
      return gesorteerd.sort((a, b) => b.price - a.price);
    case 'nieuw':
    default:
      return gesorteerd.sort(
        (a, b) => new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime()
      );
  }
}

/** Aantal actieve filters, voor de knop op mobiel. */
export function activeFilterCount(filters: CollectionFilters): number {
  return (filters.categorie ? 1 : 0) + filters.kleuren.length;
}

/** Leesbare omschrijving van de selectie, voor de titel en de metadata. */
export function describeFilters(filters: CollectionFilters): string {
  const delen: string[] = [];
  if (filters.categorie) delen.push(filters.categorie === 'jassen' ? 'Lange jassen' : 'Blazers');
  if (filters.kleuren.length > 0) {
    delen.push(filters.kleuren.map((kleur) => COLORS[kleur].label.toLowerCase()).join(', '));
  }
  return delen.join(' · ');
}
