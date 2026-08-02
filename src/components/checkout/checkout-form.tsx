'use client';

/**
 * Afrekenen in drie stappen op één pagina: contact, bezorging, betaling.
 *
 * Elke stap wordt gecontroleerd voordat je verder kunt. De controle gebeurt per
 * veld zodra je het verlaat, zodat je niet pas aan het eind alle fouten tegelijk
 * te zien krijgt. Dezelfde controles draaien nog eens op de server.
 */

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { CheckboxField, SelectField, TextAreaField, TextField } from '@/components/ui/field';
import { useCart } from '@/context/cart-context';
import { countries, type CountryCode } from '@/data/site';
import { formatPrice } from '@/lib/format';
import {
  normalisePostalCode,
  validateCity,
  validateContactStep,
  validateDeliveryStep,
  validateEmail,
  validateHouseNumber,
  validateName,
  validatePhone,
  validatePostalCode,
  validateStreet,
  type FieldErrors,
} from '@/lib/validation';

type Stap = 1 | 2 | 3;

const STAPPEN: { nummer: Stap; titel: string }[] = [
  { nummer: 1, titel: 'Contact' },
  { nummer: 2, titel: 'Bezorging' },
  { nummer: 3, titel: 'Betaling' },
];

const BETAALMETHODEN = [
  { waarde: 'ideal', label: 'iDEAL', uitleg: 'Betalen via je eigen bank.' },
  { waarde: 'bancontact', label: 'Bancontact', uitleg: 'Voor rekeningen in België.' },
  { waarde: 'creditcard', label: 'Creditcard', uitleg: 'Visa, Mastercard of American Express.' },
];

interface Waarden {
  email: string;
  newsletter: boolean;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  addition: string;
  postalCode: string;
  city: string;
  country: CountryCode;
  phone: string;
  notes: string;
}

const leeg: Waarden = {
  email: '',
  newsletter: false,
  firstName: '',
  lastName: '',
  street: '',
  houseNumber: '',
  addition: '',
  postalCode: '',
  city: '',
  country: 'NL',
  phone: '',
  notes: '',
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, totals, hydrated, country, setCountry, discountCode, clear } = useCart();

  const [stap, setStap] = useState<Stap>(1);
  const [waarden, setWaarden] = useState<Waarden>(leeg);
  const [fouten, setFouten] = useState<FieldErrors>({});
  const [methode, setMethode] = useState('ideal');
  const [bezig, setBezig] = useState(false);
  const [serverFout, setServerFout] = useState<string | null>(null);
  const stapTitel = useRef<HTMLHeadingElement>(null);

  // Land van de mand en van het formulier gelijk houden, zodat de verzendkosten
  // kloppen zodra iemand België kiest.
  useEffect(() => {
    setWaarden((huidig) => ({ ...huidig, country }));
  }, [country]);

  useEffect(() => {
    if (stap > 1) stapTitel.current?.focus();
  }, [stap]);

  if (!hydrated) {
    return <p className="py-16 text-ink-soft">Een moment, we halen je winkelmand op.</p>;
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center lg:py-24">
        <h2 className="display-md mb-3">Er valt nog niets af te rekenen</h2>
        <p className="mx-auto mb-7 max-w-md leading-relaxed text-ink-soft">
          Je winkelmand is leeg. Kies eerst een jas of blazer; daarna staat alles hier klaar.
        </p>
        <Link
          href="/collectie"
          className="inline-block rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
        >
          Bekijk de collectie
        </Link>
      </div>
    );
  }

  function zet<K extends keyof Waarden>(veld: K, waarde: Waarden[K]) {
    setWaarden((huidig) => ({ ...huidig, [veld]: waarde }));
    setFouten((huidig) => {
      if (!huidig[veld]) return huidig;
      const volgende = { ...huidig };
      delete volgende[veld as string];
      return volgende;
    });
  }

  function controleerVeld(veld: string, melding: string | null) {
    setFouten((huidig) => {
      const volgende = { ...huidig };
      if (melding) volgende[veld] = melding;
      else delete volgende[veld];
      return volgende;
    });
  }

  function naarStap2() {
    const problemen = validateContactStep(waarden);
    setFouten(problemen);
    if (Object.keys(problemen).length === 0) setStap(2);
  }

  function naarStap3() {
    const problemen = validateDeliveryStep(waarden);
    setFouten(problemen);
    if (Object.keys(problemen).length === 0) {
      setWaarden((huidig) => ({
        ...huidig,
        postalCode: normalisePostalCode(huidig.postalCode, huidig.country),
      }));
      setStap(3);
    }
  }

  async function bestellen() {
    setBezig(true);
    setServerFout(null);

    try {
      const response = await fetch('/api/afrekenen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            slug: item.slug,
            color: item.color,
            quantity: item.quantity,
          })),
          discountCode,
          method: methode,
          customer: waarden,
        }),
      });

      const resultaat = (await response.json()) as {
        redirectUrl?: string;
        error?: string;
        problems?: string[];
      };

      if (!response.ok || !resultaat.redirectUrl) {
        setServerFout(
          resultaat.problems?.join(' ') ??
            resultaat.error ??
            'Het bestellen lukte niet. Probeer het zo nog eens of mail ons.'
        );
        setBezig(false);
        return;
      }

      // De mand is verwerkt; hij mag leeg voordat we naar de betaling gaan.
      clear();
      router.push(resultaat.redirectUrl);
    } catch {
      setServerFout('We konden geen verbinding maken. Controleer je internet en probeer opnieuw.');
      setBezig(false);
    }
  }

  const postcodeHint =
    waarden.country === 'BE' ? 'Vier cijfers, bijvoorbeeld 2000' : 'Bijvoorbeeld 1012 AB';

  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <div>
        {/* Voortgang */}
        <ol className="mb-10 flex items-center gap-3 border-b border-line pb-5" aria-label="Voortgang">
          {STAPPEN.map((item, index) => {
            const gedaan = stap > item.nummer;
            const actief = stap === item.nummer;

            return (
              <li key={item.nummer} className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[0.75rem] ${
                      actief
                        ? 'border-accent bg-accent-soft text-ink'
                        : gedaan
                          ? 'border-accent bg-surface text-accent-ink'
                          : 'border-line bg-surface text-ink-soft'
                    }`}
                  >
                    {gedaan ? '✓' : item.nummer}
                  </span>
                  <span
                    className={`text-[0.875rem] ${actief ? 'text-ink' : 'text-ink-soft'}`}
                    aria-current={actief ? 'step' : undefined}
                  >
                    <span className="sr-only">Stap {item.nummer}: </span>
                    {item.titel}
                    {gedaan ? <span className="sr-only"> (afgerond)</span> : null}
                  </span>
                </span>
                {index < STAPPEN.length - 1 ? (
                  <span aria-hidden="true" className="h-px w-4 bg-line sm:w-8" />
                ) : null}
              </li>
            );
          })}
        </ol>

        {/* Stap 1 — contact */}
        {stap === 1 ? (
          <section aria-labelledby="stap-1-titel">
            <h2 id="stap-1-titel" ref={stapTitel} tabIndex={-1} className="display-md mb-2">
              Contact
            </h2>
            <p className="mb-7 text-[0.9375rem] leading-relaxed text-ink-soft">
              Hier sturen we je bestelbevestiging naartoe, en hierlangs nemen we contact op om je
              maten door te nemen. Verder gebruiken we het alleen als er iets met je bestelling aan
              de hand is.
            </p>

            <div className="max-w-md space-y-5">
              <TextField
                label="E-mailadres"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={waarden.email}
                onChange={(event) => zet('email', event.target.value)}
                onBlur={(event) => controleerVeld('email', validateEmail(event.target.value))}
                error={fouten.email}
              />

              <CheckboxField
                name="newsletter"
                checked={waarden.newsletter}
                onChange={(event) => zet('newsletter', event.target.checked)}
                label="Houd me op de hoogte van nieuwe modellen. Je krijgt eerst een mail om je aanmelding te bevestigen."
              />
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={naarStap2}
                className="rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
              >
                Verder naar bezorging
              </button>
            </div>
          </section>
        ) : null}

        {/* Stap 2 — bezorging */}
        {stap === 2 ? (
          <section aria-labelledby="stap-2-titel">
            <h2 id="stap-2-titel" ref={stapTitel} tabIndex={-1} className="display-md mb-2">
              Bezorging
            </h2>
            <p className="mb-7 text-[0.9375rem] leading-relaxed text-ink-soft">
              We bezorgen in Nederland en België. Je jas wordt eerst op maat gemaakt, dus reken op
              vier tot zes weken. Het pakket past niet door de brievenbus; zorg dat er iemand thuis
              is of geef een buuradres op bij de opmerking.
            </p>

            <div className="max-w-xl space-y-5">
              <SelectField
                label="Land"
                name="country"
                value={waarden.country}
                onChange={(event) => {
                  const nieuw = event.target.value as CountryCode;
                  zet('country', nieuw);
                  setCountry(nieuw);
                  // Postcode opnieuw beoordelen: de regels verschillen per land.
                  if (waarden.postalCode) {
                    controleerVeld('postalCode', validatePostalCode(waarden.postalCode, nieuw));
                  }
                }}
              >
                {countries.map((land) => (
                  <option key={land.code} value={land.code}>
                    {land.label}
                  </option>
                ))}
              </SelectField>

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Voornaam"
                  name="firstName"
                  autoComplete="given-name"
                  value={waarden.firstName}
                  onChange={(event) => zet('firstName', event.target.value)}
                  onBlur={(event) =>
                    controleerVeld('firstName', validateName(event.target.value, 'je voornaam'))
                  }
                  error={fouten.firstName}
                />
                <TextField
                  label="Achternaam"
                  name="lastName"
                  autoComplete="family-name"
                  value={waarden.lastName}
                  onChange={(event) => zet('lastName', event.target.value)}
                  onBlur={(event) =>
                    controleerVeld('lastName', validateName(event.target.value, 'je achternaam'))
                  }
                  error={fouten.lastName}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-[2fr_1fr_1fr]">
                <TextField
                  label="Straat"
                  name="street"
                  autoComplete="address-line1"
                  value={waarden.street}
                  onChange={(event) => zet('street', event.target.value)}
                  onBlur={(event) => controleerVeld('street', validateStreet(event.target.value))}
                  error={fouten.street}
                />
                <TextField
                  label="Huisnummer"
                  name="houseNumber"
                  inputMode="numeric"
                  value={waarden.houseNumber}
                  onChange={(event) => zet('houseNumber', event.target.value)}
                  onBlur={(event) =>
                    controleerVeld('houseNumber', validateHouseNumber(event.target.value))
                  }
                  error={fouten.houseNumber}
                />
                <TextField
                  label="Toevoeging"
                  name="addition"
                  optional
                  value={waarden.addition}
                  onChange={(event) => zet('addition', event.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-[1fr_1.4fr]">
                <TextField
                  label="Postcode"
                  name="postalCode"
                  autoComplete="postal-code"
                  hint={postcodeHint}
                  value={waarden.postalCode}
                  onChange={(event) => zet('postalCode', event.target.value)}
                  onBlur={(event) =>
                    controleerVeld(
                      'postalCode',
                      validatePostalCode(event.target.value, waarden.country)
                    )
                  }
                  error={fouten.postalCode}
                />
                <TextField
                  label="Woonplaats"
                  name="city"
                  autoComplete="address-level2"
                  value={waarden.city}
                  onChange={(event) => zet('city', event.target.value)}
                  onBlur={(event) => controleerVeld('city', validateCity(event.target.value))}
                  error={fouten.city}
                />
              </div>

              <TextField
                label="Telefoonnummer"
                name="phone"
                type="tel"
                optional
                autoComplete="tel"
                hint="Alleen als de bezorger je moet kunnen bereiken."
                value={waarden.phone}
                onChange={(event) => zet('phone', event.target.value)}
                onBlur={(event) => controleerVeld('phone', validatePhone(event.target.value))}
                error={fouten.phone}
              />

              <TextAreaField
                label="Opmerking bij de bezorging"
                name="notes"
                optional
                rows={3}
                value={waarden.notes}
                onChange={(event) => zet('notes', event.target.value)}
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={naarStap3}
                className="rounded-xs bg-button px-6 py-3 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover"
              >
                Verder naar betaling
              </button>
              <button type="button" onClick={() => setStap(1)} className="link-underlined text-[0.9375rem]">
                Terug naar contact
              </button>
            </div>
          </section>
        ) : null}

        {/* Stap 3 — betaling */}
        {stap === 3 ? (
          <section aria-labelledby="stap-3-titel">
            <h2 id="stap-3-titel" ref={stapTitel} tabIndex={-1} className="display-md mb-2">
              Betaling
            </h2>
            <p className="mb-7 text-[0.9375rem] leading-relaxed text-ink-soft">
              Je betaalt in een beveiligd scherm van onze betaalprovider. Wij zien je
              rekeningnummer of kaartgegevens niet.
            </p>

            {/* Samenvatting van de vorige stappen */}
            <div className="mb-8 border border-line bg-surface">
              <SamenvattingRegel label="E-mail" waarde={waarden.email} onWijzig={() => setStap(1)} />
              <SamenvattingRegel
                label="Bezorgen naar"
                waarde={`${waarden.firstName} ${waarden.lastName}, ${waarden.street} ${waarden.houseNumber}${
                  waarden.addition ? ` ${waarden.addition}` : ''
                }, ${normalisePostalCode(waarden.postalCode, waarden.country)} ${waarden.city}, ${
                  waarden.country === 'BE' ? 'België' : 'Nederland'
                }`}
                onWijzig={() => setStap(2)}
                laatste
              />
            </div>

            <fieldset className="max-w-md">
              <legend className="label-caps mb-3 text-ink">Betaalmethode</legend>
              <div className="space-y-2.5">
                {BETAALMETHODEN.map((optie) => (
                  <label
                    key={optie.waarde}
                    className={`flex cursor-pointer items-start gap-3 rounded-xs border p-4 transition-colors duration-200 ${
                      methode === optie.waarde
                        ? 'border-accent bg-accent-soft'
                        : 'border-line bg-surface hover:border-line-strong'
                    }`}
                  >
                    <input
                      type="radio"
                      name="betaalmethode"
                      value={optie.waarde}
                      checked={methode === optie.waarde}
                      onChange={() => setMethode(optie.waarde)}
                      className="mt-1 h-4 w-4 accent-[#6B5B47]"
                    />
                    <span>
                      <span className="block text-[0.9375rem] text-ink">{optie.label}</span>
                      <span className="block text-[0.8125rem] text-ink-soft">{optie.uitleg}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-6 max-w-md text-[0.8125rem] leading-relaxed text-ink-soft">
              Door te bestellen ga je akkoord met de{' '}
              <Link href="/juridisch/voorwaarden" className="link-underlined text-accent-ink">
                algemene voorwaarden
              </Link>{' '}
              en de{' '}
              <Link href="/juridisch/privacy" className="link-underlined text-accent-ink">
                privacyverklaring
              </Link>
              . Omdat alles op maat wordt gemaakt, geldt het herroepingsrecht van veertien dagen
              hier niet; daar staat tegenover dat we kosteloos aanpassen tot het past.
            </p>

            {serverFout ? (
              <p
                aria-live="assertive"
                className="mt-6 max-w-md border border-error/40 bg-surface px-4 py-3 text-[0.875rem] text-error"
              >
                {serverFout}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={bestellen}
                disabled={bezig}
                className="rounded-xs bg-button px-6 py-3.5 text-[0.9375rem] text-white transition-colors duration-200 hover:bg-button-hover disabled:opacity-45"
              >
                {bezig ? 'Een moment…' : `Betalen — ${formatPrice(totals.total)}`}
              </button>
              <button type="button" onClick={() => setStap(2)} className="link-underlined text-[0.9375rem]">
                Terug naar bezorging
              </button>
            </div>
          </section>
        ) : null}
      </div>

      {/* Overzicht van de bestelling */}
      <aside aria-labelledby="bestelling-titel" className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-line bg-surface p-6">
          <h2 id="bestelling-titel" className="display-sm mb-5">
            Je bestelling
          </h2>

          <ul className="mb-5 divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 py-4">
                <div className="w-14 shrink-0 bg-bg">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    width={1200}
                    height={1500}
                    sizes="56px"
                    className="ratio-portrait h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.875rem] text-ink">{item.name}</p>
                  <p className="text-[0.8125rem] text-ink-soft">
                    {item.colorLabel} · {item.quantity}×
                  </p>
                </div>
                <p className="shrink-0 text-[0.875rem]">{formatPrice(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <dl className="space-y-2 text-[0.9375rem]">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotaal</dt>
              <dd>{formatPrice(totals.subtotal)}</dd>
            </div>
            {totals.discount > 0 ? (
              <div className="flex justify-between">
                <dt className="text-ink-soft">Korting ({totals.discountCode})</dt>
                <dd className="text-accent-ink">– {formatPrice(totals.discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-ink-soft">
                Verzending {waarden.country === 'BE' ? 'naar België' : 'binnen Nederland'}
              </dt>
              <dd>{totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span>Totaal</span>
            <span className="text-[1.0625rem]">{formatPrice(totals.total)}</span>
          </div>
          <p className="mt-1 text-[0.8125rem] text-ink-soft">Inclusief btw.</p>

          <p className="mt-5 text-[0.8125rem]">
            <Link href="/winkelmand" className="link-underlined text-ink-soft">
              Winkelmand aanpassen
            </Link>
          </p>
        </div>
      </aside>
    </div>
  );
}

function SamenvattingRegel({
  label,
  waarde,
  onWijzig,
  laatste = false,
}: {
  label: string;
  waarde: string;
  onWijzig: () => void;
  laatste?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 px-4 py-3.5 ${laatste ? '' : 'border-b border-line'}`}
    >
      <div className="min-w-0">
        <span className="label-caps block text-ink-soft">{label}</span>
        <span className="mt-1 block text-[0.875rem] text-ink">{waarde}</span>
      </div>
      <button type="button" onClick={onWijzig} className="link-underlined shrink-0 text-[0.8125rem]">
        Wijzigen
      </button>
    </div>
  );
}
