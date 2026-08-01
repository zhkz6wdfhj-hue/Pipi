import Link from 'next/link';

import { CATEGORIES, SIZES, usedColors } from '@/data/products';
import {
  activeFilterCount,
  buildFilterUrl,
  SORT_OPTIONS,
  type CollectionFilters,
} from '@/lib/collection-filters';

/**
 * De filters zijn gewone links. Dat betekent: geen JavaScript nodig, de
 * terugknop werkt, en elke selectie heeft een eigen adres dat je kunt delen.
 */

function Chip({
  href,
  active,
  children,
  swatch,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  swatch?: { fill: string; border: string };
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-xs border px-3 py-1.5 text-[0.8125rem] transition-colors duration-200 ${
        active
          ? 'border-accent bg-accent-soft text-ink'
          : 'border-line bg-surface text-ink-soft hover:border-line-strong'
      }`}
    >
      {swatch ? (
        <span
          aria-hidden="true"
          className="block h-2.5 w-2.5 rounded-full border"
          style={{ backgroundColor: swatch.fill, borderColor: swatch.border }}
        />
      ) : null}
      {children}
      {active ? <span className="sr-only"> (actief, klik om te verwijderen)</span> : null}
    </Link>
  );
}

function FilterGroups({ filters }: { filters: CollectionFilters }) {
  const kleuren = usedColors();

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="label-caps mb-3 text-ink">Categorie</legend>
        <div className="flex flex-wrap gap-2">
          <Chip href={buildFilterUrl(filters, { categorie: null })} active={filters.categorie === null}>
            Alles
          </Chip>
          {CATEGORIES.map((categorie) => (
            <Chip
              key={categorie.slug}
              href={buildFilterUrl(filters, {
                categorie: filters.categorie === categorie.slug ? null : categorie.slug,
              })}
              active={filters.categorie === categorie.slug}
            >
              {categorie.label}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-caps mb-3 text-ink">Kleur</legend>
        <div className="flex flex-wrap gap-2">
          {kleuren.map((kleur) => (
            <Chip
              key={kleur.slug}
              href={buildFilterUrl(filters, { kleur: kleur.slug })}
              active={filters.kleuren.includes(kleur.slug)}
              swatch={{ fill: kleur.swatch, border: kleur.swatchBorder }}
            >
              {kleur.label}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-caps mb-3 text-ink">Maat</legend>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((maat) => (
            <Chip
              key={maat}
              href={buildFilterUrl(filters, { maat })}
              active={filters.maten.includes(maat)}
            >
              {maat}
            </Chip>
          ))}
        </div>
        <p className="mt-2.5 text-[0.8125rem] text-ink-soft">
          We tonen alleen modellen waarvan de gekozen maat nog op voorraad is.
        </p>
      </fieldset>
    </div>
  );
}

export function CollectionFilterBar({
  filters,
  resultCount,
}: {
  filters: CollectionFilters;
  resultCount: number;
}) {
  const actief = activeFilterCount(filters);

  return (
    <div className="border-b border-line pb-6">
      {/* Mobiel: uitklapbaar, zodat het raster meteen in beeld staat. */}
      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-[0.9375rem] text-ink [&::-webkit-details-marker]:hidden">
          <span>
            Filters
            {actief > 0 ? <span className="text-accent-ink"> ({actief})</span> : null}
          </span>
          <span
            aria-hidden="true"
            className="relative h-3 w-3 text-accent-ink transition-transform duration-200 group-open:rotate-45"
          >
            <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
            <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current" />
          </span>
        </summary>
        <div className="pt-4 pb-2">
          <FilterGroups filters={filters} />
        </div>
      </details>

      <div className="hidden lg:block">
        <FilterGroups filters={filters} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <p className="text-[0.875rem] text-ink-soft" aria-live="polite">
          {resultCount === 1 ? '1 model' : `${resultCount} modellen`}
          {actief > 0 ? (
            <>
              {' · '}
              <Link
                href={buildFilterUrl(filters, { leegmaken: true })}
                scroll={false}
                className="link-underlined text-accent-ink"
              >
                Filters wissen
              </Link>
            </>
          ) : null}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="label-caps text-ink-soft">Sorteer</span>
          {SORT_OPTIONS.map((optie) => (
            <Chip
              key={optie.key}
              href={buildFilterUrl(filters, { sorteer: optie.key })}
              active={filters.sorteer === optie.key}
            >
              {optie.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
