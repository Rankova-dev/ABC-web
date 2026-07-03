import { NextRequest, NextResponse } from 'next/server';
import { createBooking } from '@/lib/google-calendar';
import { sendPatientConfirmation, sendInternalNotification } from '@/lib/gmail';
import type { BookingRequest } from '@/lib/google-calendar';
import type { Service, SpecialistId, AppointmentType } from '@/config/specialists';
import { SPECIALISTS, SERVICE_TEAM, APPOINTMENT_TYPES } from '@/config/specialists';

const VALID_SERVICES = new Set<Service>(Object.keys(SERVICE_TEAM) as Service[]);
const VALID_APPOINTMENT_TYPES = new Set<AppointmentType>(Object.keys(APPOINTMENT_TYPES) as AppointmentType[]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, email, phone, service, appointmentType, selectedSlot } = body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!patientName || !email || !phone || !service || !appointmentType || !selectedSlot) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    if (!VALID_SERVICES.has(service as Service)) {
      return NextResponse.json({ error: 'Servicio no válido' }, { status: 400 });
    }

    if (!VALID_APPOINTMENT_TYPES.has(appointmentType as AppointmentType)) {
      return NextResponse.json({ error: 'Tipo de cita no válido' }, { status: 400 });
    }

    if (!selectedSlot.start || !selectedSlot.end) {
      return NextResponse.json({ error: 'Franja horaria no válida' }, { status: 400 });
    }

    const specialistId = selectedSlot.specialistId as string | undefined;
    if (!specialistId || !(specialistId in SPECIALISTS)) {
      return NextResponse.json({ error: 'El horario elegido ya no está disponible' }, { status: 400 });
    }

    // ── Build typed request ───────────────────────────────────────────────────
    const bookingRequest: BookingRequest = {
      service:         service as Service,
      appointmentType: appointmentType as AppointmentType,
      patientName:     String(patientName).trim(),
      patientAge:      body.patientAge ?? undefined,
      guardianName:    body.guardianName?.trim() || undefined,
      email:           String(email).trim().toLowerCase(),
      phone:           String(phone).trim(),
      message:         body.message?.trim() || undefined,
      selectedSlot:    { ...selectedSlot, specialistId: specialistId as SpecialistId },
    };

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
      specialist: SPECIALISTS[specialistId as SpecialistId].name,
    });
  } catch (err) {
    console.error('[Appointment API Error]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
