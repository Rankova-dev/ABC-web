import Stripe from 'stripe';
import { APPOINTMENT_TYPES, getAppointmentTypeText } from '@/config/specialists';
import { parseBookingRequest } from '@/lib/booking-request';
import type { BookingRequest } from '@/lib/google-calendar';

/**
 * Stripe para las citas que se cobran por adelantado (sesiones online).
 *
 * La web no tiene base de datos, así que la reserva **viaja dentro de la sesión
 * de Stripe**: se guarda entera en `metadata` al abrir el Checkout y el webhook
 * la recupera de ahí para crear el evento de calendario. Por eso todo lo que
 * hace falta para reservar tiene que caber en pares clave/valor de texto
 * (máx. 50 claves y 500 caracteres por valor).
 */

/** Minutos que se le reservan al paciente para pagar. 30 es el mínimo de Stripe. */
export const CHECKOUT_EXPIRY_MINUTES = 30;

const MAX_METADATA_VALUE = 480;

let client: Stripe | null = null;

export function hasStripeCredentials(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Falta STRIPE_SECRET_KEY');
  }
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

/** Recorta un valor al límite de Stripe para que la sesión no falle por largo */
function clip(value: string): string {
  return value.length > MAX_METADATA_VALUE ? value.slice(0, MAX_METADATA_VALUE) : value;
}

// ─── La reserva, ida y vuelta por la metadata de Stripe ──────────────────────

export function bookingToMetadata(
  booking: BookingRequest,
  extra: { slotSummary?: string } = {}
): Record<string, string> {
  const slot = booking.selectedSlot;
  const metadata: Record<string, string> = {
    patientName:     clip(booking.patientName),
    email:           booking.email,
    phone:           clip(booking.phone),
    service:         booking.service,
    appointmentType: booking.appointmentType,
    slotStart:       slot.start,
    slotEnd:         slot.end,
    specialistId:    slot.specialistId,
  };

  if (booking.patientAge   != null) metadata.patientAge   = clip(String(booking.patientAge));
  if (booking.guardianName)         metadata.guardianName = clip(booking.guardianName);
  if (booking.message)              metadata.message      = clip(booking.message);
  if (slot.eventId)                 metadata.slotEventId  = slot.eventId;
  if (slot.online)                  metadata.slotOnline   = 'true';
  // Título original del hueco, para poder devolverlo a su sitio si el pago caduca
  if (extra.slotSummary)            metadata.slotSummary  = clip(extra.slotSummary);

  return metadata;
}

/**
 * Rehace la reserva a partir de la metadata de la sesión pagada.
 *
 * Pasa por el mismo validador que el formulario: la firma del webhook ya
 * garantiza que viene de Stripe, pero la reserva puede haber quedado obsoleta
 * (un tipo de cita retirado del catálogo, por ejemplo) y no interesa crear un
 * evento a partir de datos que hoy ya no se aceptarían.
 */
export function metadataToBooking(
  metadata: Stripe.Metadata | null | undefined
): BookingRequest | null {
  if (!metadata) return null;

  const parsed = parseBookingRequest({
    patientName:     metadata.patientName,
    patientAge:      metadata.patientAge,
    guardianName:    metadata.guardianName,
    email:           metadata.email,
    phone:           metadata.phone,
    message:         metadata.message,
    service:         metadata.service,
    appointmentType: metadata.appointmentType,
    selectedSlot: {
      start:        metadata.slotStart,
      end:          metadata.slotEnd,
      available:    true,
      eventId:      metadata.slotEventId,
      online:       metadata.slotOnline === 'true',
      specialistId: metadata.specialistId,
    },
  });

  if (!parsed.ok) {
    console.error('[Stripe] Metadata de sesión no válida:', parsed.error);
    return null;
  }
  return parsed.booking;
}

// ─── Checkout ────────────────────────────────────────────────────────────────

interface CheckoutParams {
  booking:     BookingRequest;
  locale:      string;
  /** Título que tenía el hueco antes de ponerlo en espera */
  slotSummary?: string;
}

/**
 * Abre una sesión de Checkout por el importe íntegro de la cita.
 *
 * Sin impuestos (los servicios del centro están exentos de IVA) y sin factura
 * de Stripe: las facturas las emiten el centro y su gestoría, así que el recibo
 * de Stripe es solo un justificante de pago.
 */
export async function createCheckoutSession({
  booking,
  locale,
  slotSummary,
}: CheckoutParams): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  const cfg = APPOINTMENT_TYPES[booking.appointmentType];
  const text = getAppointmentTypeText(booking.appointmentType, locale);
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  const metadata = bookingToMetadata(booking, { slotSummary });

  return stripe.checkout.sessions.create({
    mode:           'payment',
    customer_email: booking.email,
    // Stripe no tiene catalán en el Checkout: en /ca también se ve en castellano
    locale:         'es',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency:    'eur',
          unit_amount: Math.round(cfg.price * 100),
          product_data: {
            name:        text.label,
            description: text.includes ?? undefined,
          },
        },
      },
    ],
    expires_at:  Math.floor(Date.now() / 1000) + CHECKOUT_EXPIRY_MINUTES * 60,
    success_url: `${baseUrl}/${locale}/cita/pago-ok?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${baseUrl}/${locale}/cita/pago-cancelado`,
    metadata,
    payment_intent_data: {
      // Lo que ve dirección en el panel al buscar un cobro o hacer una devolución
      description: `${text.label} — ${booking.patientName} (${booking.selectedSlot.start.slice(0, 16).replace('T', ' ')})`,
      metadata,
    },
  });
}
