import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getStripe, hasStripeCredentials } from '@/lib/stripe';
import { SPECIALISTS, getAppointmentTypeText } from '@/config/specialists';
import type { AppointmentType, SpecialistId } from '@/config/specialists';

type Props = {
  params:       Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

// Depende del session_id que trae Stripe en la URL: no se puede prerrenderizar.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isCA = locale === 'ca';
  return {
    title:       isCA ? 'Pagament completat — ABC Centre' : 'Pago completado — ABC Centre',
    description: isCA ? 'La teva cita ja està confirmada.' : 'Tu cita ya está confirmada.',
    robots:      { index: false, follow: false },
  };
}

interface Booking {
  label:      string;
  specialist: string;
  date:       string;
  time:       string;
  amount:     string;
}

/**
 * Lee la cita pagada de la propia sesión de Stripe.
 *
 * Es solo para poder enseñarle al paciente lo que acaba de reservar: quien crea
 * la cita de verdad es el webhook, no esta página (alguien puede cerrar el
 * navegador antes de volver, y la cita tiene que existir igual).
 */
async function loadBooking(sessionId: string, locale: string): Promise<Booking | null> {
  if (!hasStripeCredentials()) return null;

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const md = session.metadata;
    if (!md?.slotStart || !md.appointmentType) return null;

    const fmt = (opts: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale === 'ca' ? 'ca-ES' : 'es-ES', {
        timeZone: 'Europe/Madrid',
        ...opts,
      }).format(new Date(md.slotStart));

    return {
      label:      getAppointmentTypeText(md.appointmentType as AppointmentType, locale).label,
      specialist: SPECIALISTS[md.specialistId as SpecialistId]?.name ?? '',
      date:       fmt({ weekday: 'long', day: 'numeric', month: 'long' }),
      time:       fmt({ hour: '2-digit', minute: '2-digit' }),
      amount:     ((session.amount_total ?? 0) / 100).toFixed(2).replace('.', ',').replace(',00', ''),
    };
  } catch (err) {
    console.error('[pago-ok] No se pudo leer la sesión de Stripe:', err);
    return null;
  }
}

export default async function PagoOkPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { session_id: sessionId } = await searchParams;
  const isCA = locale === 'ca';

  const booking = sessionId ? await loadBooking(sessionId, locale) : null;

  return (
    <section className="bg-cream pt-28 pb-20 min-h-[70vh]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">

        <div className="w-16 h-16 bg-teal rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-display font-outfit font-semibold text-ink mb-3">
          {isCA ? 'Pagament rebut' : 'Pago recibido'}
        </h1>
        <p className="text-sm font-light text-gray leading-relaxed mb-8">
          {isCA
            ? 'La teva cita ja està confirmada. T\'hem enviat el comprovant i els detalls per correu.'
            : 'Tu cita ya está confirmada. Te hemos enviado el justificante y los detalles por correo.'}
        </p>

        {booking && (
          <div className="bg-white rounded-2xl px-6 py-5 text-left space-y-2.5 mb-8">
            <p className="text-sm font-semibold text-ink">{booking.label}</p>
            {booking.specialist && (
              <p className="text-sm font-light text-gray">{booking.specialist}</p>
            )}
            <div className="border-t border-gray/10 pt-2.5 space-y-1">
              <p className="text-sm text-ink capitalize">{booking.date} · {booking.time}</p>
              <p className="text-sm text-teal font-semibold">
                {isCA ? 'Pagat' : 'Pagado'}: {booking.amount} €
              </p>
            </div>
          </div>
        )}

        <div className="bg-white/60 rounded-2xl px-6 py-5 text-left mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal mb-2">
            {isCA ? 'Si no pots venir' : 'Si no puedes venir'}
          </p>
          <p className="text-sm font-light text-gray leading-relaxed">
            {isCA
              ? 'Avisant-nos amb més de 24 hores d\'antelació et tornem l\'import íntegre. Amb menys de 24 hores no es torna, però te\'l guardem com a crèdit per a una altra sessió.'
              : 'Avisándonos con más de 24 horas de antelación te devolvemos el importe íntegro. Con menos de 24 horas no se devuelve, pero te lo guardamos como crédito para otra sesión.'}
          </p>
          <p className="text-sm font-light text-gray mt-2">
            {isCA ? 'Truca\'ns al ' : 'Llámanos al '}
            <a href="tel:+34932434835" className="text-teal font-semibold">93 243 48 35</a>
          </p>
        </div>

        <Link href="/" className="btn-primary inline-flex">
          {isCA ? 'Tornar a l\'inici' : 'Volver al inicio'}
        </Link>
      </div>
    </section>
  );
}
