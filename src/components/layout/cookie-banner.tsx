'use client';

/**
 * Cookiemelding.
 *
 * De winkel laadt uit zichzelf niets van derden: geen trackers, geen
 * ingesloten video's, geen lettertypen van een andere server. Alleen de
 * winkelmand en je cookiekeuze worden lokaal bewaard, en daarvoor is geen
 * toestemming nodig.
 *
 * Wil je later statistieken bijhouden, zet dan dat script in `laadStatistieken`
 * hieronder. Het draait dan uitsluitend nadat iemand op "Accepteren" heeft
 * geklikt. Weigeren is één klik en heeft hetzelfde gewicht als accepteren.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'melin-clo-cookiekeuze';

export type CookieKeuze = 'alles' | 'noodzakelijk';

export function getCookieKeuze(): CookieKeuze | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === 'alles' || value === 'noodzakelijk' ? value : null;
}

function laadStatistieken() {
  // Hier komt je statistiekenscript, bijvoorbeeld Plausible of Vercel Analytics.
  // Laat het leeg als je niets wilt meten — dat mag ook.
}

export function CookieBanner() {
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    const keuze = getCookieKeuze();
    if (keuze === null) {
      setZichtbaar(true);
    } else if (keuze === 'alles') {
      laadStatistieken();
    }
  }, []);

  function kies(keuze: CookieKeuze) {
    try {
      window.localStorage.setItem(STORAGE_KEY, keuze);
    } catch {
      // Opslag geblokkeerd: dan vragen we het de volgende keer opnieuw.
    }
    if (keuze === 'alles') laadStatistieken();
    setZichtbaar(false);
  }

  if (!zichtbaar) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookiemelding-titel"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface shadow-float"
    >
      <div className="container-page py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <h2 id="cookiemelding-titel" className="mb-1.5 text-[0.9375rem] text-ink">
              Cookies
            </h2>
            <p className="text-[0.875rem] leading-relaxed text-ink-soft">
              We gebruiken alleen wat nodig is om de winkel te laten werken: je winkelmand en deze
              keuze. Wil je ons daarnaast toestaan om anoniem te meten hoe de site gebruikt wordt,
              dan mag dat — maar het hoeft niet.{' '}
              <Link href="/juridisch/cookies" className="link-underlined text-accent-ink">
                Lees het cookiebeleid
              </Link>
              .
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => kies('noodzakelijk')}
              className="rounded-xs border border-line bg-surface px-5 py-2.5 text-[0.875rem] text-ink transition-colors duration-200 hover:border-line-strong"
            >
              Alleen noodzakelijk
            </button>
            <button
              type="button"
              onClick={() => kies('alles')}
              className="rounded-xs bg-button px-5 py-2.5 text-[0.875rem] text-white transition-colors duration-200 hover:bg-button-hover"
            >
              Accepteren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
