import { createHmac } from 'node:crypto';

/**
 * Ondertekent een e-mailadres voor de bevestigingslink van de nieuwsbrief.
 * Zonder de juiste handtekening kan niemand een aanmelding voor een ander
 * adres bevestigen.
 *
 * Zet NEWSLETTER_SECRET in je omgevingsvariabelen; zie .env.example.
 */
export function signEmail(email: string): string {
  const secret = process.env.NEWSLETTER_SECRET ?? 'melin-clo-ontwikkelsleutel';
  return createHmac('sha256', secret).update(email.toLowerCase()).digest('hex').slice(0, 32);
}
