import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { isValidEmail } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed, retryAfterSeconds } = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Inténtalo de nuevo en unos minutos.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const { patientName, email, phone, service } = body;

    if (!patientName || !email || !phone || !service) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 });
    }

    // TODO: When Google Calendar credentials are available:
    // 1. Import createBooking from '@/lib/google-calendar'
    // 2. Create the calendar event
    // 3. Send confirmation email via Resend

    console.log('[Contact Form Submission]', {
      patientName,
      email,
      phone,
      service,
      timestamp: new Date().toISOString(),
    });

    // For now, log the submission and return success
    // In production, integrate with Google Calendar and email sender
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API Error]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
