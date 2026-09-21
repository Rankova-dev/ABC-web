import { NextRequest, NextResponse } from 'next/server';
import { holdSlot, releaseSlot } from '@/lib/google-calendar';
import { requiresPrepayment } from '@/config/specialists';
import { parseBookingRequest } from '@/lib/booking-request';
import { createCheckoutSession, hasStripeCredentials } from '@/lib/stripe';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { routing } from '@/i18n/routing';

/**
 * Abre el pago de una cita que se cobra por adelantado.
 *
 * Aquí **no se reserva nada todavía**: se pone el hueco en espera y se manda al
 * paciente a Stripe. La cita la crea `/api/stripe/webhook` cuando el cobro se
 * confirma, que es el único momento en el que se sabe que hay dinero.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed, retryAfterSeconds } = rateLimit(`checkout:${ip}`, 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Inténtalo de nuevo en unos minutos.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }

    if (!hasStripeCredentials()) {
      console.error('[Checkout] Falta STRIPE_SECRET_KEY');
      return NextResponse.json(
        { error: 'El pago online no está disponible ahora mismo. Llámanos y lo vemos.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const parsed = parseBookingRequest(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    const booking = parsed.booking;

    // Por la pasarela solo pasan las citas de pago obligatorio. El pago
    // voluntario del resto de servicios está sin decidir con dirección.
    if (!requiresPrepayment(booking.appointmentType)) {
      return NextResponse.json(
        { error: 'Esta cita no se paga por adelantado' },
        { status: 400 }
      );
    }

    const locale = routing.locales.includes(body.locale)
      ? (body.locale as string)
      : routing.defaultLocale;

    // ── Reservar el hueco mientras dura el pago ───────────────────────────────
    const { eventId, specialistId } = booking.selectedSlot;
    let previousSummary: string | undefined;

    if (eventId) {
      const hold = await holdSlot(specialistId, eventId);
      if (!hold.held) {
        return NextResponse.json(
          { error: 'Ese horario acaba de ocuparse. Elige otro, por favor.' },
          { status: 409 }
        );
      }
      previousSummary = hold.previousSummary;
    }

    // ── Abrir el Checkout ─────────────────────────────────────────────────────
    try {
      const session = await createCheckoutSession({
        booking,
        locale,
        slotSummary: previousSummary,
      });

      if (!session.url) throw new Error('Stripe no devolvió URL de Checkout');

      return NextResponse.json({ url: session.url });
    } catch (err) {
      // Si no se ha llegado a abrir el pago, el hueco no puede quedarse pillado
      if (eventId && previousSummary) {
        await releaseSlot(specialistId, eventId, previousSummary);
      }
      throw err;
    }
  } catch (err) {
    console.error('[Checkout API Error]', err);
    return NextResponse.json({ error: 'No se pudo iniciar el pago' }, { status: 500 });
  }
}
