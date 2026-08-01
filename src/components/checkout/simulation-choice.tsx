'use client';

/** De twee knoppen van het nagebootste betaalscherm. */

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SimulationChoice({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [bezig, setBezig] = useState<'gelukt' | 'mislukt' | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  async function kies(uitkomst: 'gelukt' | 'mislukt') {
    setBezig(uitkomst);
    setFout(null);

    try {
      const response = await fetch('/api/betaling/simuleren', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, uitkomst }),
      });

      if (!response.ok) throw new Error('mislukt');

      router.push(`/bestelling/${orderId}`);
    } catch {
      setBezig(null);
      setFout('Dat lukte niet. Probeer het nog een keer.');
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => kies('gelukt')}
          disabled={bezig !== null}
          className="rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover disabled:opacity-45"
        >
          {bezig === 'gelukt' ? 'Een moment…' : 'Betaling slaagt'}
        </button>
        <button
          type="button"
          onClick={() => kies('mislukt')}
          disabled={bezig !== null}
          className="rounded-xs border border-line bg-surface px-6 py-3 text-[0.9375rem] text-ink transition-colors duration-200 hover:border-line-strong disabled:opacity-45"
        >
          {bezig === 'mislukt' ? 'Een moment…' : 'Betaling mislukt'}
        </button>
      </div>

      {fout ? (
        <p aria-live="polite" className="mt-3 text-[0.875rem] text-error">
          {fout}
        </p>
      ) : null}
    </div>
  );
}
