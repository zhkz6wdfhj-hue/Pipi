'use client';

/**
 * Nieuwsbriefinschrijving met dubbele opt-in: na dit formulier krijgt de
 * bezoeker eerst een mail met een bevestigingslink. Pas na die bevestiging
 * staat het adres echt op de lijst. Dat is niet alleen netjes, het is ook wat
 * de AVG van je verwacht.
 */

import { useState } from 'react';

import { validateEmail } from '@/lib/validation';

type Status = 'rust' | 'bezig' | 'gelukt' | 'fout';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('rust');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const problem = validateEmail(email);
    if (problem) {
      setError(problem);
      setStatus('fout');
      return;
    }

    setError(null);
    setStatus('bezig');

    try {
      const response = await fetch('/api/nieuwsbrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('mislukt');

      setStatus('gelukt');
      setEmail('');
    } catch {
      setStatus('fout');
      setError('Aanmelden lukte even niet. Probeer het zo nog eens.');
    }
  }

  if (status === 'gelukt') {
    return (
      <div aria-live="polite">
        <p className="text-[0.9375rem] text-ink">Bijna klaar.</p>
        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-soft">
          We hebben je een mail gestuurd met een bevestigingslink. Klik erop en je staat op de lijst.
          Zit de mail er niet bij, kijk dan even in je ongewenste post.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="nieuwsbrief-email" className="mb-1.5 block text-[0.875rem] text-ink">
        E-mailadres
      </label>
      <div className="flex gap-2">
        <input
          id="nieuwsbrief-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'nieuwsbrief-fout' : 'nieuwsbrief-uitleg'}
          placeholder="naam@voorbeeld.nl"
          className={`w-full rounded-xs border bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-soft/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            error ? 'border-error' : 'border-line hover:border-line-strong'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'bezig'}
          className="shrink-0 rounded-xs bg-button px-5 py-2.5 text-[0.875rem] text-white transition-colors duration-200 hover:bg-button-hover disabled:opacity-45"
        >
          {status === 'bezig' ? 'Bezig' : 'Aanmelden'}
        </button>
      </div>

      {error ? (
        <p id="nieuwsbrief-fout" aria-live="polite" className="mt-1.5 text-[0.8125rem] text-error">
          {error}
        </p>
      ) : null}

      <p id="nieuwsbrief-uitleg" className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-soft">
        Je ontvangt eerst een mail met een bevestigingslink; pas daarna staat je adres op de lijst.
        Een paar berichten per jaar, als er een nieuwe oplage klaar is. Afmelden kan met één klik
        onderaan elke mail.
      </p>
    </form>
  );
}
