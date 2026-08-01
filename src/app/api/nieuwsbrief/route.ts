import { NextResponse } from 'next/server';

import { sendNewsletterConfirmation } from '@/lib/email/send';
import { signEmail } from '@/lib/newsletter';
import { validateEmail } from '@/lib/validation';

/**
 * Aanmelding voor de nieuwsbrief, met dubbele opt-in.
 *
 * Hier wordt nog niets opgeslagen: we sturen een mail met een ondertekende
 * link. Pas als iemand daarop klikt, is de aanmelding bevestigd. Koppel je
 * later een echte lijst (bijvoorbeeld Mailchimp of Buttondown), zet dan de
 * aanmelding in /nieuwsbrief/bevestigen op "bevestigd" bij die dienst.
 */

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = String(body?.email ?? '').trim();

  const probleem = validateEmail(email);
  if (probleem) {
    return NextResponse.json({ error: probleem }, { status: 400 });
  }

  try {
    await sendNewsletterConfirmation(email, signEmail(email));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Bevestigingsmail voor de nieuwsbrief mislukte:', error);
    return NextResponse.json({ error: 'Versturen mislukt.' }, { status: 500 });
  }
}
