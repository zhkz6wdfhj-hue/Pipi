/**
 * Versturen van e-mail.
 *
 * Zonder RESEND_API_KEY wordt de mail niet verstuurd maar in de terminal
 * getoond. Zo kun je de hele bestelstroom testen zonder een mailaccount te
 * koppelen. Zodra je de sleutel invult, gaat dezelfde mail echt de deur uit.
 *
 * Resend is gekozen omdat je er met één sleutel en een geverifieerd domein
 * klaar mee bent. Wil je liever je eigen SMTP-server, vervang dan alleen de
 * inhoud van `deliver` hieronder.
 */

import { internalOrderEmail, orderConfirmationEmail } from './templates';
import type { Order } from '../orders';
import { site } from '@/data/site';

interface Message {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function deliver(message: Message): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info(
      [
        '',
        '─── E-mail (niet verstuurd: RESEND_API_KEY ontbreekt) ───',
        `Aan:      ${message.to}`,
        `Van:      ${site.emailFrom}`,
        `Onderwerp: ${message.subject}`,
        '',
        message.text,
        '────────────────────────────────────────────────────────',
        '',
      ].join('\n')
    );
    return { sent: false };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: site.emailFrom,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(`E-mail kon niet verstuurd worden (${response.status}): ${detail}`);
      return { sent: false, error: detail };
    }

    return { sent: true };
  } catch (error) {
    console.error('E-mail kon niet verstuurd worden:', error);
    return { sent: false, error: String(error) };
  }
}

/**
 * Stuurt de bevestiging naar de klant en het besteloverzicht naar de winkel.
 * Een mislukte mail mag een geslaagde bestelling nooit tegenhouden, dus fouten
 * worden gelogd en niet doorgegeven.
 */
export async function sendOrderEmails(order: Order): Promise<void> {
  const confirmation = orderConfirmationEmail(order);
  const internal = internalOrderEmail(order);

  await Promise.all([
    deliver({ to: order.customer.email, ...confirmation }),
    deliver({ to: site.emailInternal, ...internal }),
  ]);
}

/** Bevestigingsmail voor de dubbele opt-in van de nieuwsbrief. */
export async function sendNewsletterConfirmation(email: string, token: string): Promise<void> {
  const url = `${site.url}/nieuwsbrief/bevestigen?token=${encodeURIComponent(token)}&adres=${encodeURIComponent(email)}`;

  await deliver({
    to: email,
    subject: `Bevestig je aanmelding voor de nieuwsbrief van ${site.name}`,
    html: `<!doctype html><html lang="nl"><body style="background:#FAF8F4;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1F1B18;">
      <p style="font-size:15px;line-height:1.6;">Je hebt je aangemeld voor de nieuwsbrief van ${site.name}. Bevestig je aanmelding met de link hieronder; daarna ontvang je een paar keer per jaar bericht als er een nieuwe oplage klaar is.</p>
      <p style="font-size:15px;line-height:1.6;"><a href="${url}" style="color:#6B5B47;">Ja, meld mij aan</a></p>
      <p style="font-size:13px;line-height:1.6;color:#5B534B;">Heb je je niet aangemeld? Dan hoef je niets te doen; zonder bevestiging gebeurt er niets met je adres.</p>
    </body></html>`,
    text: `Bevestig je aanmelding voor de nieuwsbrief van ${site.name}: ${url}\n\nHeb je je niet aangemeld? Dan hoef je niets te doen.`,
  });
}

/** Bericht uit het contactformulier, doorgestuurd naar de winkel. */
export async function sendContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  await deliver({
    to: site.email,
    subject: `Contactformulier: ${input.subject}`,
    html: `<!doctype html><html lang="nl"><body style="background:#FAF8F4;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1F1B18;">
      <p style="font-size:15px;line-height:1.6;"><strong>${input.name}</strong> (${input.email}) schreef:</p>
      <p style="font-size:15px;line-height:1.6;white-space:pre-wrap;">${input.message.replace(/[<>]/g, '')}</p>
    </body></html>`,
    text: `${input.name} (${input.email}):\n\n${input.message}`,
  });
}
