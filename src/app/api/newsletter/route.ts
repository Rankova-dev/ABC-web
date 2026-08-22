import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { isValidEmail } from '@/lib/validation';
import { subscribeToNewsletter } from '@/lib/newsletter';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed, retryAfterSeconds } = rateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Inténtalo de nuevo en unos minutos.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 });
    }

    const result = await subscribeToNewsletter(email);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[Newsletter API Error]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
