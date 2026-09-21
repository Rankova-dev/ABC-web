import { NextRequest, NextResponse } from 'next/server';
import { createBooking } from '@/lib/google-calendar';
import { sendPatientConfirmation, sendInternalNotification } from '@/lib/gmail';
import { SPECIALISTS, requiresPrepayment } from '@/config/specialists';
import { parseBookingRequest } from '@/lib/booking-request';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed, retryAfterSeconds } = rateLimit(`appointment:${ip}`, 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Inténtalo de nuevo en unos minutos.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }

    const parsed = parseBookingRequest(await req.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    const bookingRequest = parsed.booking;

    // Las citas de pago obligatorio (sesiones online) no se confirman por aquí:
    // su reserva la crea el webhook de Stripe cuando el cobro ha salido bien.
    if (requiresPrepayment(bookingRequest.appointmentType)) {
      return NextResponse.json(
        { error: 'Esta cita se confirma al completar el pago' },
        { status: 400 }
      );
    }

    // ── Create calendar event ─────────────────────────────────────────────────
    const result = await createBooking(bookingRequest);

    if (!result.success) {
      console.error('[Appointment] Calendar creation failed:', result.error);
      return NextResponse.json(
        { error: 'No se pudo confirmar la cita. Por favor llámanos.' },
        { status: 500 }
      );
    }

    // ── Send emails (non-blocking) ────────────────────────────────────────────
    await Promise.allSettled([
      sendPatientConfirmation(bookingRequest),
      sendInternalNotification(bookingRequest),
    ]);

    return NextResponse.json({
      success: true,
      eventId: result.eventId,
      specialist: SPECIALISTS[bookingRequest.selectedSlot.specialistId].name,
    });
  } catch (err) {
    console.error('[Appointment API Error]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
