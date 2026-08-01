/**
 * Koppeling met Mollie (iDEAL, Bancontact, creditcard).
 *
 * De winkel werkt in drie standen:
 *
 * 1. GEEN SLEUTEL INGESTELD — de checkout draait in simulatiemodus. Je wordt na
 *    het afrekenen naar een pagina gestuurd die de betaling nabootst, zodat je
 *    de hele bestelstroom kunt doorlopen zonder account. Handig tijdens het
 *    bouwen; niet geschikt om echt geld mee te innen.
 * 2. TESTSLEUTEL (test_...) — echte Mollie-omgeving, geen echt geld. Je kiest in
 *    het Mollie-scherm zelf of de betaling slaagt of mislukt.
 * 3. LIVE SLEUTEL (live_...) — echte betalingen.
 *
 * Zie .env.example en README.md, hoofdstuk "Betalingen live zetten".
 */

import { toAmountString } from './format';

const MOLLIE_API = 'https://api.mollie.com/v2';

export function isMollieConfigured(): boolean {
  return Boolean(process.env.MOLLIE_API_KEY);
}

export function isTestMode(): boolean {
  return !process.env.MOLLIE_API_KEY?.startsWith('live_');
}

export interface CreatePaymentInput {
  orderId: string;
  orderNumber: string;
  amount: number;
  description: string;
  redirectUrl: string;
  webhookUrl?: string;
  /** Vooraf gekozen methode, bijvoorbeeld 'ideal'. Leeg = Mollie laat de klant kiezen. */
  method?: string;
  email?: string;
}

export interface CreatePaymentResult {
  paymentId: string;
  checkoutUrl: string;
  simulated: boolean;
}

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
  if (!isMollieConfigured()) {
    // Simulatiemodus: we sturen de klant naar onze eigen pagina.
    const url = new URL(input.redirectUrl);
    url.pathname = '/afrekenen/simulatie';
    url.searchParams.set('bestelling', input.orderId);
    return { paymentId: `simulatie_${input.orderId}`, checkoutUrl: url.toString(), simulated: true };
  }

  const body: Record<string, unknown> = {
    amount: { currency: 'EUR', value: toAmountString(input.amount) },
    description: input.description,
    redirectUrl: input.redirectUrl,
    metadata: { orderId: input.orderId, orderNumber: input.orderNumber },
  };

  // Mollie kan een webhook op localhost niet bereiken; die slaan we dan over.
  if (input.webhookUrl && !/localhost|127\.0\.0\.1/.test(input.webhookUrl)) {
    body.webhookUrl = input.webhookUrl;
  }
  if (input.method) body.method = input.method;
  if (input.email) body.billingEmail = input.email;

  const response = await fetch(`${MOLLIE_API}/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mollie gaf een fout terug (${response.status}): ${detail}`);
  }

  const payment = (await response.json()) as {
    id: string;
    _links: { checkout?: { href: string } };
  };

  if (!payment._links.checkout?.href) {
    throw new Error('Mollie gaf geen betaallink terug.');
  }

  return { paymentId: payment.id, checkoutUrl: payment._links.checkout.href, simulated: false };
}

export type MolliePaymentStatus =
  | 'open'
  | 'canceled'
  | 'pending'
  | 'authorized'
  | 'expired'
  | 'failed'
  | 'paid';

export async function getPayment(
  paymentId: string
): Promise<{ status: MolliePaymentStatus; method: string | null; orderId: string | null }> {
  const response = await fetch(`${MOLLIE_API}/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MOLLIE_API_KEY}` },
  });

  if (!response.ok) {
    throw new Error(`Mollie gaf een fout terug bij het ophalen (${response.status}).`);
  }

  const payment = (await response.json()) as {
    status: MolliePaymentStatus;
    method: string | null;
    metadata?: { orderId?: string };
  };

  return {
    status: payment.status,
    method: payment.method,
    orderId: payment.metadata?.orderId ?? null,
  };
}

/** Vertaalt een Mollie-status naar de status die wij bij een bestelling bewaren. */
export function toOrderStatus(status: MolliePaymentStatus): 'betaald' | 'geannuleerd' | 'mislukt' {
  if (status === 'paid' || status === 'authorized') return 'betaald';
  if (status === 'canceled') return 'geannuleerd';
  return 'mislukt';
}

/** Nette Nederlandse naam van de betaalmethode voor de bevestigingsmail. */
export function paymentMethodLabel(method: string | null): string {
  const labels: Record<string, string> = {
    ideal: 'iDEAL',
    bancontact: 'Bancontact',
    creditcard: 'Creditcard',
    paypal: 'PayPal',
    applepay: 'Apple Pay',
    banktransfer: 'Bankoverschrijving',
    simulatie: 'Simulatie (testmodus)',
  };
  return labels[method ?? ''] ?? 'Onbekend';
}
