import type { BookingRequest } from '@/lib/google-calendar';
import type { Service, SpecialistId, AppointmentType } from '@/config/specialists';
import {
  SPECIALISTS,
  SERVICE_TEAM,
  APPOINTMENT_TYPES,
  getBookableAppointmentTypes,
} from '@/config/specialists';
import { isValidEmail } from '@/lib/validation';

const VALID_SERVICES = new Set<Service>(Object.keys(SERVICE_TEAM) as Service[]);
const VALID_APPOINTMENT_TYPES = new Set<AppointmentType>(
  Object.keys(APPOINTMENT_TYPES) as AppointmentType[]
);

export type ParsedBooking =
  | { ok: true;  booking: BookingRequest }
  | { ok: false; error: string; status: number };

/**
 * Valida el cuerpo del formulario de citas y lo convierte en un `BookingRequest`.
 *
 * Vive aparte porque hay dos puertas de entrada a la misma reserva: la cita sin
 * pago (`/api/appointment`) y la que pasa por Stripe (`/api/checkout`). Las dos
 * tienen que aceptar y rechazar exactamente lo mismo, o se podría colar por la
 * pasarela algo que el formulario normal no admite.
 */
export function parseBookingRequest(body: unknown): ParsedBooking {
  const data = (body ?? {}) as Record<string, unknown>;
  const { patientName, email, phone, service, appointmentType, selectedSlot } = data;

  if (!patientName || !email || !phone || !service || !appointmentType || !selectedSlot) {
    return { ok: false, error: 'Faltan campos obligatorios', status: 400 };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: 'Email no válido', status: 400 };
  }

  if (!VALID_SERVICES.has(service as Service)) {
    return { ok: false, error: 'Servicio no válido', status: 400 };
  }

  if (!VALID_APPOINTMENT_TYPES.has(appointmentType as AppointmentType)) {
    return { ok: false, error: 'Tipo de cita no válido', status: 400 };
  }

  // El tipo de cita tiene que ser uno de los que ese servicio reserva online:
  // los que solo publican precio (valoraciones de TEA) no se agendan por web.
  if (!getBookableAppointmentTypes(service as Service).includes(appointmentType as AppointmentType)) {
    return {
      ok: false,
      error: 'Ese tipo de cita no se puede reservar online para este servicio',
      status: 400,
    };
  }

  const slot = selectedSlot as Record<string, unknown>;
  if (!slot.start || !slot.end) {
    return { ok: false, error: 'Franja horaria no válida', status: 400 };
  }

  const specialistId = slot.specialistId as string | undefined;
  if (!specialistId || !(specialistId in SPECIALISTS)) {
    return { ok: false, error: 'El horario elegido ya no está disponible', status: 400 };
  }

  return {
    ok: true,
    booking: {
      service:         service as Service,
      appointmentType: appointmentType as AppointmentType,
      patientName:     String(patientName).trim(),
      patientAge:      (data.patientAge as string | number | undefined) ?? undefined,
      guardianName:    String(data.guardianName ?? '').trim() || undefined,
      email:           String(email).trim().toLowerCase(),
      phone:           String(phone).trim(),
      message:         String(data.message ?? '').trim() || undefined,
      selectedSlot: {
        ...(slot as unknown as BookingRequest['selectedSlot']),
        specialistId: specialistId as SpecialistId,
      },
    },
  };
}
