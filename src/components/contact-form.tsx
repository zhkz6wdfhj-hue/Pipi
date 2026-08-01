'use client';

/** Contactformulier. Validatie per veld, in het Nederlands. */

import { useState } from 'react';

import { SelectField, TextAreaField, TextField } from '@/components/ui/field';
import { validateEmail, validateMessage, validateName, type FieldErrors } from '@/lib/validation';

const ONDERWERPEN = [
  'Vraag over een maat',
  'Vraag over een bestelling',
  'Retour of ruilen',
  'Iets anders',
];

export function ContactForm() {
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [onderwerp, setOnderwerp] = useState(ONDERWERPEN[0]);
  const [bericht, setBericht] = useState('');
  const [fouten, setFouten] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'rust' | 'bezig' | 'gelukt' | 'fout'>('rust');

  function controleer(veld: string, melding: string | null) {
    setFouten((huidig) => {
      const volgende = { ...huidig };
      if (melding) volgende[veld] = melding;
      else delete volgende[veld];
      return volgende;
    });
  }

  async function verstuur(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const problemen: FieldErrors = {};
    const naamFout = validateName(naam, 'je naam');
    if (naamFout) problemen.name = naamFout;
    const emailFout = validateEmail(email);
    if (emailFout) problemen.email = emailFout;
    const berichtFout = validateMessage(bericht);
    if (berichtFout) problemen.message = berichtFout;

    setFouten(problemen);
    if (Object.keys(problemen).length > 0) return;

    setStatus('bezig');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: naam, email, subject: onderwerp, message: bericht }),
      });

      if (!response.ok) throw new Error('mislukt');

      setStatus('gelukt');
      setNaam('');
      setEmail('');
      setBericht('');
    } catch {
      setStatus('fout');
    }
  }

  if (status === 'gelukt') {
    return (
      <div aria-live="polite" className="border border-line bg-surface p-6">
        <h2 className="display-sm mb-2">Je bericht is verstuurd</h2>
        <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
          We lezen het zo snel mogelijk en antwoorden meestal dezelfde dag, op werkdagen. Krijg je
          binnen twee werkdagen niets terug, kijk dan even in je ongewenste post.
        </p>
        <button
          type="button"
          onClick={() => setStatus('rust')}
          className="link-underlined mt-4 text-[0.9375rem]"
        >
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={verstuur} noValidate className="space-y-5">
      <TextField
        label="Je naam"
        name="name"
        autoComplete="name"
        value={naam}
        onChange={(event) => {
          setNaam(event.target.value);
          controleer('name', null);
        }}
        onBlur={(event) => controleer('name', validateName(event.target.value, 'je naam'))}
        error={fouten.name}
      />

      <TextField
        label="E-mailadres"
        name="contactEmail"
        type="email"
        autoComplete="email"
        hint="Hier sturen we het antwoord naartoe."
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          controleer('email', null);
        }}
        onBlur={(event) => controleer('email', validateEmail(event.target.value))}
        error={fouten.email}
      />

      <SelectField
        label="Onderwerp"
        name="subject"
        value={onderwerp}
        onChange={(event) => setOnderwerp(event.target.value)}
      >
        {ONDERWERPEN.map((optie) => (
          <option key={optie} value={optie}>
            {optie}
          </option>
        ))}
      </SelectField>

      <TextAreaField
        label="Je bericht"
        name="message"
        rows={6}
        hint="Gaat het over een bestelling? Zet het ordernummer erbij, dan zoeken we het meteen op."
        value={bericht}
        onChange={(event) => {
          setBericht(event.target.value);
          controleer('message', null);
        }}
        onBlur={(event) => controleer('message', validateMessage(event.target.value))}
        error={fouten.message}
      />

      {status === 'fout' ? (
        <p aria-live="assertive" className="border border-error/40 bg-surface px-4 py-3 text-[0.875rem] text-error">
          Het versturen lukte niet. Probeer het zo nog eens, of stuur ons rechtstreeks een mail.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'bezig'}
        className="rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover disabled:opacity-45"
      >
        {status === 'bezig' ? 'Bezig met versturen…' : 'Bericht versturen'}
      </button>

      <p className="text-[0.8125rem] leading-relaxed text-ink-soft">
        We gebruiken je gegevens alleen om je vraag te beantwoorden. Hoe lang we ze bewaren staat in
        de privacyverklaring.
      </p>
    </form>
  );
}
