import { resolveCalendarId, SPECIALISTS, SERVICE_TEAM, getLeadSpecialistId, SERVICE_DURATION } from '@/config/specialists';
import type { Service, SpecialistId } from '@/config/specialists';

// Re-export types used by other files
export type { Service } from '@/config/specialists';

// ─── Shared types ────────────────────────────────────────────────────────────

export interface TimeSlot {
  start:    string;   // ISO 8601 with timezone offset
  end:      string;
  available: boolean;
  /** Google Calendar event ID of the "Primera consulta" availability slot.
   *  Sent back on booking so the route can delete it atomically. */
  eventId?: string;
}

export interface BookingRequest {
  service:       Service;
  specialistId:  SpecialistId;
  patientName:   string;
  patientAge?:   number | string;
  guardianName?: string;
  email:         string;
  phone:         string;
  message?:      string;
  selectedSlot:  TimeSlot;
}

export interface BookingResult {
  success: boolean;
  eventId?: string;
  error?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TZ = 'Europe/Madrid';

/**
 * Case-insensitive prefix that identifies an availability slot created by
 * the specialist in her own Google Calendar.
 *
 * Valid event titles (all matched):
 *   "Primera consulta"
 *   "Primera consulta disponible"
 *   "primera consulta 10h"
 *
 * Not matched (existing appointments, notes, etc.):
 *   "Seguimiento Cita 1"  "NUEVA CITA — …"  etc.
 */
const SLOT_KEYWORD = 'primera consulta';

// ─── Auth helpers ─────────────────────────────────────────────────────────────

function hasCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
}

function getPrivateKey(): string {
  const raw = process.env.GOOGLE_PRIVATE_KEY ?? '';
  return raw.replace(/\\n/g, '\n');
}

async function getCalendarAuth() {
  const { google } = await import('googleapis');
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: getPrivateKey(),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
}

// ─── Timezone helpers ─────────────────────────────────────────────────────────

function getMadridOffsetStr(date: Date): string {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: TZ,
    timeZoneName: 'longOffset',
  }).formatToParts(date);
  const tzName = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+1';
  const match = tzName.match(/GMT([+-]\d{1,2}:\d{2})/);
  if (!match) return '+01:00';
  const [sign, rest] = [match[1][0], match[1].slice(1)];
  const [h, m] = rest.split(':');
  return `${sign}${h.padStart(2, '0')}:${m ?? '00'}`;
}

function buildMadridISO(dateStr: string, hour: number, minute = 0): string {
  const ref = new Date(`${dateStr}T12:00:00Z`);
  const offset = getMadridOffsetStr(ref);
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `${dateStr}T${hh}:${mm}:00${offset}`;
}

function toMadridDateStr(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the slots the specialist has explicitly opened for first consultations.
 *
 * Reads events whose title starts with SLOT_KEYWORD ("primera consulta") from
 * the specialist's Google Calendar for the given day.
 *
 * Falls back to mock data when credentials or calendarId are not configured.
 */
export async function getAvailableSlots(
  specialistId: SpecialistId,
  dateFrom: Date,
  _dateTo: Date
): Promise<TimeSlot[]> {
  const calendarId = resolveCalendarId(specialistId);

  if (!hasCredentials() || !calendarId) {
    return getMockSlots(dateFrom);
  }

  const dateStr = toMadridDateStr(dateFrom);

  try {
    const auth = await getCalendarAuth();
    const { google } = await import('googleapis');
    const calendar = google.calendar({ version: 'v3', auth });

    const dayStart = buildMadridISO(dateStr, 0, 0);
    const dayEnd   = buildMadridISO(dateStr, 23, 59);

    const eventsRes = await calendar.events.list({
      calendarId,
      timeMin:      dayStart,
      timeMax:      dayEnd,
      timeZone:     TZ,
      q:            SLOT_KEYWORD,   // pre-filter by Google (case-insensitive)
      singleEvents: true,
      orderBy:      'startTime',
    });

    return (eventsRes.data.items ?? [])
      .filter(ev => ev.summary?.toLowerCase().startsWith(SLOT_KEYWORD))
      .map(ev => ({
        start:     ev.start?.dateTime ?? ev.start?.date ?? '',
        end:       ev.end?.dateTime   ?? ev.end?.date   ?? '',
        available: true,
        eventId:   ev.id ?? undefined,
      }));

  } catch (err) {
    console.error('[GoogleCalendar] getAvailableSlots error:', err);
    return [];
  }
}

/**
 * Creates a Google Calendar event for the confirmed booking and
 * removes the corresponding "Primera consulta" availability slot.
 */
export async function createBooking(request: BookingRequest): Promise<BookingResult> {
  const specialist = SPECIALISTS[request.specialistId];
  const calendarId = resolveCalendarId(request.specialistId);

  if (!hasCredentials() || !calendarId) {
    console.warn('[GoogleCalendar] No credentials/calendarId — booking logged to console only');
    console.log('[BookingRequest]', JSON.stringify(request, null, 2));
    return { success: true, eventId: 'mock-event-id' };
  }

  try {
    const auth = await getCalendarAuth();
    const { google } = await import('googleapis');
    const calendar = google.calendar({ version: 'v3', auth });

    // 1. Delete the availability event so no other patient can book the same slot
    if (request.selectedSlot.eventId) {
      try {
        await calendar.events.delete({
          calendarId,
          eventId: request.selectedSlot.eventId,
        });
      } catch (err) {
        // Non-fatal: slot may have already been removed (race condition / manual deletion)
        console.warn('[GoogleCalendar] Could not delete availability event:', err);
      }
    }

    // 2. Create the patient appointment event
    const durationMin = SERVICE_DURATION[request.service] ?? 45;
    const startDate = new Date(request.selectedSlot.start);
    const endDate = new Date(startDate.getTime() + durationMin * 60_000);
    const endParts = new Intl.DateTimeFormat('en', {
      timeZone: TZ,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(endDate);
    const ep = (type: string) => endParts.find(p => p.type === type)!.value;
    const endDateTime = buildMadridISO(
      `${ep('year')}-${ep('month')}-${ep('day')}`,
      parseInt(ep('hour')),
      parseInt(ep('minute')),
    );

    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary:     `Primera consulta — ${request.patientName}`,
        description: buildEventDescription(request, specialist.name, specialist.role),
        start: { dateTime: request.selectedSlot.start, timeZone: TZ },
        end:   { dateTime: endDateTime,                timeZone: TZ },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      },
    });

    return { success: true, eventId: event.data.id ?? undefined };

  } catch (err) {
    console.error('[GoogleCalendar] createBooking error:', err);
    return { success: false, error: 'No se pudo crear el evento en Google Calendar' };
  }
}

/** Returns the lead specialist ID for a service. */
export function getLeadSpecialist(service: Service): SpecialistId {
  return getLeadSpecialistId(service);
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function buildEventDescription(
  request: BookingRequest,
  specialistName: string,
  specialistRole: string
): string {
  const lines = [
    `NUEVA CITA — ${specialistName} (${specialistRole})`,
    '',
    `Paciente: ${request.patientName}${request.patientAge ? `, ${request.patientAge} años` : ''}`,
    request.guardianName ? `Familiar: ${request.guardianName}` : null,
    `Email: ${request.email}`,
    `Teléfono: ${request.phone}`,
    `Servicio: ${request.service}`,
    '',
    request.message ? `Motivo de consulta:\n${request.message}` : null,
    '',
    `Reserva creada: ${new Date().toLocaleString('es-ES', { timeZone: TZ })}`,
  ];
  return lines.filter(Boolean).join('\n');
}

/**
 * Mock slots for local development — simulates a specialist who has opened
 * a handful of first-consultation slots across the week.
 */
function getMockSlots(from: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);

  // Realistic hours a specialist might open for first consultations
  const CANDIDATE_HOURS = [9, 10, 11, 16, 17, 18, 19] as const;

  for (let day = 0; day < 7; day++) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      const dateStr = d.toISOString().split('T')[0];
      for (const hour of CANDIDATE_HOURS) {
        if (Math.random() > 0.55) {   // ~45 % of hours are open
          slots.push({
            start:     buildMadridISO(dateStr, hour, 0),
            end:       buildMadridISO(dateStr, hour, 50),
            available: true,
            eventId:   `mock-${dateStr}-${hour}`,
          });
        }
      }
    }
    d.setDate(d.getDate() + 1);
  }

  return slots;
}
