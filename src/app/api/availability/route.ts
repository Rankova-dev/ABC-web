import { NextRequest, NextResponse } from 'next/server';
import { getAllAvailableSlots } from '@/lib/google-calendar';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { SERVICE_TEAM, APPOINTMENT_TYPES } from '@/config/specialists';
import type { Service, AppointmentType } from '@/config/specialists';

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, retryAfterSeconds } = rateLimit(`availability:${ip}`, 60, 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  const dateStr = req.nextUrl.searchParams.get('date');

  if (!dateStr) {
    return NextResponse.json({ error: 'Se requiere el parámetro date' }, { status: 400 });
  }

  const from = new Date(`${dateStr}T00:00:00`);
  if (isNaN(from.getTime())) {
    return NextResponse.json({ error: 'Formato de fecha inválido' }, { status: 400 });
  }

  // Servicio elegido: solo se consultan los calendarios de quien lo atiende.
  // Si no llega (o no se reconoce), se consultan todos, como hasta ahora.
  const serviceParam = req.nextUrl.searchParams.get('service');
  const service =
    serviceParam && serviceParam in SERVICE_TEAM
      ? (serviceParam as Service)
      : undefined;

  // Tipo de cita: acota el área (psicología online) y qué huecos valen
  // (franja online, horario de mañana).
  const typeParam = req.nextUrl.searchParams.get('type');
  const appointmentType =
    typeParam && typeParam in APPOINTMENT_TYPES
      ? (typeParam as AppointmentType)
      : undefined;

  const allSlots = await getAllAvailableSlots(from, service, appointmentType);

  // Filter to the requested day (calendars are queried per-day already, this is a sanity check)
  const daySlots = allSlots.filter((slot) => {
    const slotDate = new Date(slot.start);
    return (
      slotDate.getFullYear() === from.getFullYear() &&
      slotDate.getMonth()    === from.getMonth()    &&
      slotDate.getDate()     === from.getDate()
    );
  });

  return NextResponse.json({ slots: daySlots });
}
