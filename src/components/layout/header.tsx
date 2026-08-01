'use client';

/**
 * De koptekst: navigatie, zoeken en de winkelmand met een zichtbare teller.
 * De balk blijft licht — geen donker vlak — en scheidt zich van de pagina met
 * één haarlijn.
 */

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Logo } from './logo';
import { useCart } from '@/context/cart-context';

const navigation = [
  { href: '/collectie', label: 'Collectie' },
  { href: '/collectie?categorie=jassen', label: 'Jassen' },
  { href: '/collectie?categorie=blazers', label: 'Blazers' },
  { href: '/over', label: 'Over Melin' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { itemCount, hydrated, openDrawer } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);

  // Bij het wisselen van pagina sluiten we alles wat openstaat.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function isActive(href: string): boolean {
    const [path, search] = href.split('?');
    if (path !== pathname) return false;
    if (!search) return !searchParams.get('categorie');
    return searchParams.get('categorie') === new URLSearchParams(search).get('categorie');
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (term.length === 0) return;
    router.push(`/zoeken?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-[2px]">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          {/* Menuknop op mobiel */}
          <button
            type="button"
            className="-ml-2 flex h-10 w-10 items-center justify-center text-ink md:hidden"
            aria-expanded={menuOpen}
            aria-controls="hoofdmenu-mobiel"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? 'Menu sluiten' : 'Menu openen'}</span>
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-current transition-transform duration-200 ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute top-1.5 left-0 h-px w-5 bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-current transition-transform duration-200 ${menuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
            </span>
          </button>

          <Logo className="md:order-first" />

          <nav aria-label="Hoofdmenu" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`text-[0.9375rem] underline-offset-4 transition-[text-decoration-color,color] duration-200 ${
                      isActive(item.href)
                        ? 'text-accent-ink underline decoration-accent'
                        : 'text-ink underline decoration-transparent hover:decoration-accent'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-10 items-center gap-2 px-2 text-[0.9375rem] text-ink"
              aria-expanded={searchOpen}
              aria-controls="zoekbalk"
              onClick={() => setSearchOpen((open) => !open)}
            >
              <SearchIcon />
              <span className="sr-only">{searchOpen ? 'Zoeken sluiten' : 'Zoeken'}</span>
            </button>

            <button
              type="button"
              onClick={openDrawer}
              className="flex h-10 items-center gap-2 px-2 text-[0.9375rem] text-ink"
            >
              <BagIcon />
              <span className="sr-only">Winkelmand openen, </span>
              <span aria-hidden={!hydrated}>
                {hydrated ? itemCount : 0}
                <span className="sr-only"> artikelen</span>
              </span>
            </button>
          </div>
        </div>

        {/* Zoekbalk */}
        <div id="zoekbalk" hidden={!searchOpen} className="border-t border-line py-4">
          <form role="search" onSubmit={submitSearch} action="/zoeken" method="get">
            <label htmlFor="zoekveld" className="label-caps mb-2 block text-ink-soft">
              Zoeken in de collectie
            </label>
            <div className="flex gap-2">
              <input
                ref={searchInput}
                id="zoekveld"
                name="q"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Bijvoorbeeld: kameel, blazer, ecru"
                className="w-full rounded-xs border border-line bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-soft/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xs bg-button px-5 py-2.5 text-[0.875rem] text-white transition-colors duration-200 hover:bg-button-hover"
              >
                Zoek
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Menu op mobiel */}
      <div
        id="hoofdmenu-mobiel"
        hidden={!menuOpen}
        className="border-t border-line bg-bg md:hidden"
      >
        <nav aria-label="Hoofdmenu, mobiel" className="container-page py-2">
          <ul className="divide-y divide-line">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`block py-3.5 text-[1.0625rem] ${isActive(item.href) ? 'text-accent-ink' : 'text-ink'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/klantenservice" className="block py-3.5 text-[1.0625rem] text-ink">
                Klantenservice
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3.75 5.5h10.5l-.85 9.25a1 1 0 0 1-1 .9H5.6a1 1 0 0 1-1-.9L3.75 5.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 7V5a2.5 2.5 0 0 1 5 0v2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
