import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { createBooking, findBookingBySession, releaseSlot } from '@/lib/google-calendar';
import { sendPatientConfirmation, sendInternalNotification } from '@/lib/gmail';
import { getStripe, hasStripeCredentials, metadataToBooking } from '@/lib/stripe';
import type { SpecialistId } from '@/config/specialists';

// Stripe firma el cuerpo tal cual viaja: hay que leerlo en crudo, sin JSON.parse.
export const runtime = 'nodejs';

/**
 * Lo que Stripe le cuenta a la web.
 *
 * Es el único sitio donde se confirma una cita de pago obligatorio: hasta que
 * no llega el `checkout.session.completed` no hay cobro, y sin cobro no hay
 * cita. Devuelve 200 siempre que el evento se haya entendido, aunque no se
 * haga nada con él, porque un error hace que Stripe lo reintente.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!hasStripeCredentials() || !secret) {
    console.error('[Stripe webhook] Falta STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook no configurado' }, { status: 503 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Falta la firma' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = await getStripe().webhooks.constructEventAsync(rawBody, signature, secret);
  } catch (err) {
    // Firma inválida: o no viene de Stripe, o el secreto configurado no es el suyo
    console.error('[Stripe webhook] Firma no válida:', err);
    return NextResponse.json({ error: 'Firma no válida' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await onCheckoutCompleted(event.data.object);
        break;

      case 'checkout.session.expired':
        await onCheckoutExpired(event.data.object);
        break;

      case 'charge.refunded':
        // Las devoluciones las hace dirección desde el panel. Se deja constancia
        // en el log; borrar la cita del calendario sigue siendo cosa suya.
        console.log('[Stripe webhook] Reembolso emitido:', event.data.object.id);
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`[Stripe webhook] Error procesando ${event.type}:`, err);
    return NextResponse.json({ error: 'Error procesando el evento' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/** Pago confirmado → se crea la cita en el calendario y salen los correos */
async function onCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  if (session.payment_status !== 'paid') {
    console.warn('[Stripe webhook] Sesión completada sin pago:', session.id, session.payment_status);
    return;
  }

  const booking = metadataToBooking(session.metadata);
  if (!booking) {
    console.error('[Stripe webhook] Pago cobrado sin reserva recuperable:', session.id);
    return;
  }
  booking.prepaid = true;

  // Stripe reintenta hasta recibir un 200, así que el mismo pago puede llegar
  // varias veces: si la cita ya está creada, no se duplica ni se reenvían correos.
  const existing = await findBookingBySession(booking.selectedSlot.specialistId, session.id);
  if (existing) {
    console.log('[Stripe webhook] Sesión ya atendida, se ignora:', session.id);
    return;
  }

  const result = await createBooking(booking, { stripeSessionId: session.id });

  if (!result.success) {
    // Hay dinero cobrado y no hay cita: tiene que verlo una persona.
    console.error('[Stripe webhook] PAGO COBRADO SIN CITA CREADA:', session.id, result.error);
    throw new Error('No se pudo crear el evento de calendario tras el pago');
  }

  await Promise.allSettled([
    sendPatientConfirmation(booking),
    sendInternalNotification(booking),
  ]);
}

/** Pago no completado a tiempo → el hueco vuelve a ofrecerse */
async function onCheckoutExpired(session: Stripe.Checkout.Session): Promise<void> {
  const { slotEventId, specialistId, slotSummary } = session.metadata ?? {};
  if (!slotEventId || !specialistId || !slotSummary) return;

  await releaseSlot(specialistId as SpecialistId, slotEventId, slotSummary);
  console.log('[Stripe webhook] Hueco liberado tras caducar el pago:', slotEventId);
}
