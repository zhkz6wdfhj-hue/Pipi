import { NextResponse } from 'next/server';

import { sendContactMessage } from '@/lib/email/send';
import { validateEmail, validateMessage, validateName } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ error: 'We konden je bericht niet lezen.' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subject = String(body.subject ?? 'Bericht via de website').trim().slice(0, 120);
  const message = String(body.message ?? '').trim();

  const problemen = [
    validateName(name, 'je naam'),
    validateEmail(email),
    validateMessage(message),
  ].filter(Boolean);

  if (problemen.length > 0) {
    return NextResponse.json({ error: problemen[0] }, { status: 400 });
  }

  try {
    await sendContactMessage({ name, email, subject, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contactbericht kon niet verstuurd worden:', error);
    return NextResponse.json({ error: 'Versturen mislukt.' }, { status: 500 });
  }
}
