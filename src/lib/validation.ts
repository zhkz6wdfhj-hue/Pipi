/**
 * Validatie van de formuliervelden. Elke foutmelding is Nederlands, concreet en
 * noemt een voorbeeld, zodat de klant meteen weet wat er verwacht wordt.
 *
 * Dezelfde functies draaien in de browser (direct bij het verlaten van een veld)
 * en op de server (bij het aanmaken van de bestelling). Zo kan er nooit een
 * bestelling binnenkomen die de browsercontrole omzeilt.
 */

import type { CountryCode } from '@/data/site';

export type FieldErrors = Record<string, string>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const POSTCODE_NL = /^[1-9][0-9]{3}\s?[a-z]{2}$/i;
const POSTCODE_BE = /^[1-9][0-9]{3}$/;
const HOUSE_NUMBER = /^[0-9]+[a-z0-9\s-]{0,10}$/i;
const PHONE = /^[+0][0-9\s()-]{7,18}$/;

export function required(value: string, veld: string): string | null {
  return value.trim().length === 0 ? `Vul ${veld} in.` : null;
}

export function validateName(value: string, veld: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return `Vul ${veld} in.`;
  if (trimmed.length < 2) return `${capitalise(veld)} moet uit minimaal twee letters bestaan.`;
  return null;
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Vul je e-mailadres in.';
  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl';
  }
  return null;
}

export function validatePhone(value: string, verplicht = false): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return verplicht ? 'Vul je telefoonnummer in.' : null;
  }
  if (!PHONE.test(trimmed)) {
    return 'Vul een geldig telefoonnummer in, bijvoorbeeld 06 12 34 56 78';
  }
  return null;
}

export function validatePostalCode(value: string, country: CountryCode): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Vul je postcode in.';

  if (country === 'BE') {
    if (!POSTCODE_BE.test(trimmed)) {
      return 'Vul een geldige Belgische postcode in, bijvoorbeeld 2000';
    }
    return null;
  }

  if (!POSTCODE_NL.test(trimmed)) {
    return 'Vul een geldige postcode in, bijvoorbeeld 1012 AB';
  }
  return null;
}

export function validateStreet(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Vul je straatnaam in.';
  if (trimmed.length < 2) return 'Vul een volledige straatnaam in.';
  return null;
}

export function validateHouseNumber(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Vul je huisnummer in.';
  if (!HOUSE_NUMBER.test(trimmed)) {
    return 'Vul een geldig huisnummer in, bijvoorbeeld 12 of 12 B';
  }
  return null;
}

export function validateCity(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Vul je woonplaats in.';
  if (trimmed.length < 2) return 'Vul een volledige woonplaats in, bijvoorbeeld Amsterdam';
  return null;
}

export function validateMessage(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Schrijf je vraag of opmerking.';
  if (trimmed.length < 10) return 'Schrijf iets uitgebreider, zodat we je goed kunnen helpen.';
  if (trimmed.length > 3000) return 'Het bericht mag maximaal 3.000 tekens bevatten.';
  return null;
}

/** Zet "1012ab" om naar "1012 AB". Belgische postcodes blijven zoals ze zijn. */
export function normalisePostalCode(value: string, country: CountryCode): string {
  const trimmed = value.trim().toUpperCase().replace(/\s+/g, '');
  if (country === 'NL' && /^[1-9][0-9]{3}[A-Z]{2}$/.test(trimmed)) {
    return `${trimmed.slice(0, 4)} ${trimmed.slice(4)}`;
  }
  return trimmed;
}

export interface CheckoutFormValues {
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

/** Velden van stap 1 (contact). */
export function validateContactStep(values: Pick<CheckoutFormValues, 'email'>): FieldErrors {
  const errors: FieldErrors = {};
  const email = validateEmail(values.email);
  if (email) errors.email = email;
  return errors;
}

/** Velden van stap 2 (bezorging). */
export function validateDeliveryStep(
  values: Omit<CheckoutFormValues, 'email' | 'newsletter'>
): FieldErrors {
  const errors: FieldErrors = {};

  const firstName = validateName(values.firstName, 'je voornaam');
  if (firstName) errors.firstName = firstName;

  const lastName = validateName(values.lastName, 'je achternaam');
  if (lastName) errors.lastName = lastName;

  const street = validateStreet(values.street);
  if (street) errors.street = street;

  const houseNumber = validateHouseNumber(values.houseNumber);
  if (houseNumber) errors.houseNumber = houseNumber;

  const postalCode = validatePostalCode(values.postalCode, values.country);
  if (postalCode) errors.postalCode = postalCode;

  const city = validateCity(values.city);
  if (city) errors.city = city;

  const phone = validatePhone(values.phone);
  if (phone) errors.phone = phone;

  return errors;
}

export function validateCheckout(values: CheckoutFormValues): FieldErrors {
  return { ...validateContactStep(values), ...validateDeliveryStep(values) };
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
