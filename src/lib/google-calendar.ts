import { resolveCalendarId, SPECIALISTS, SERVICE_LABELS, APPOINTMENT_TYPES } from '@/config/specialists';
import type { Service, SpecialistId, AppointmentType } from '@/config/specialists';

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
  /** Especialista dueña del calendario en el que se abrió este hueco. */
  specialistId?:   SpecialistId;
  specialistName?: string;
}

export interface BookingRequest {
  service:         Service;
  appointmentType: AppointmentType;
  patientName:     string;
  patientAge?:     number | string;
  guardianName?:   string;
  email:           string;
  phone:           string;
  message?:        string;
  selectedSlot:    TimeSlot & { specialistId: SpecialistId };
}

export interface BookingResult {
  success: boolean;
  eventId?: string;
  error?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TZ = 'Europe/Madrid';

/**
 * Case-insensitive prefixes that identify an availability slot created by
 * the specialist in her own Google Calendar.
 *
 * Valid event titles (all matched):
 *   "Primera consulta"  "Primera consulta disponible"  "primera consulta 10h"
 *   "Primera cita"      "primera cita"
 *
 * Not matched (existing appointments, notes, etc.):
 *   "Seguimiento Cita 1"  "NUEVA CITA — …"  etc.
 */
const SLOT_KEYWORDS = ['primera consulta', 'primera cita'] as const;

function isSlotEvent(title: string | null | undefined): boolean {
  const lower = (title ?? '').toLowerCase();
  return SLOT_KEYWORDS.some(kw => lower.startsWith(kw));
}

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
 * Reads events whose title starts with a SLOT_KEYWORD ("primera consulta" /
 * "primera cita") from a single Google Calendar for the given day.
 */
async function getSlotsFromCalendar(calendarId: string, dateStr: string): Promise<TimeSlot[]> {
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
    q:            'primera',      // pre-filter by Google (case-insensitive, catches all SLOT_KEYWORDS)
    singleEvents: true,
    orderBy:      'startTime',
  });

  return (eventsRes.data.items ?? [])
    .filter(ev => isSlotEvent(ev.summary))
    .map(ev => ({
      start:     ev.start?.dateTime ?? ev.start?.date ?? '',
      end:       ev.end?.dateTime   ?? ev.end?.date   ?? '',
      available: true,
      eventId:   ev.id ?? undefined,
    }));
}

/**
 * Returns the first-consultation slots opened across every specialist's
 * Google Calendar for the given day, merged and sorted by start time.
 *
 * Laia Álvarez handles the vast majority of first appointments, so her
 * calendar is always checked; any other specialist who has also opened
 * "primera cita" slots on her own calendar gets folded into the same list.
 * If nobody else has opened slots, the result is naturally just Laia's.
 *
 * Falls back to mock data (tagged as Laia's) when credentials are not configured.
 */
export async function getAllAvailableSlots(dateFrom: Date): Promise<TimeSlot[]> {
  if (!hasCredentials()) {
    return getMockSlots(dateFrom).map(slot => ({
      ...slot,
      specialistId:   'laia_alvarez',
      specialistName: SPECIALISTS.laia_alvarez.name,
    }));
  }

  const dateStr = toMadridDateStr(dateFrom);
  const ids = Object.keys(SPECIALISTS) as SpecialistId[];

  const perSpecialist = await Promise.all(
    ids.map(async (id): Promise<TimeSlot[]> => {
      const calendarId = resolveCalendarId(id);
      if (!calendarId) return [];
      try {
        const slots = await getSlotsFromCalendar(calendarId, dateStr);
        return slots.map(slot => ({
          ...slot,
          specialistId:   id,
          specialistName: SPECIALISTS[id].name,
        }));
      } catch (err) {
        console.error(`[GoogleCalendar] getAllAvailableSlots error for ${id}:`, err);
        return [];
      }
    })
  );

  return perSpecialist.flat().sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * Confirms a booking by turning the existing "Primera cita" availability
 * event (already created by the specialist, in her own calendar) into the
 * patient's appointment: adjusts its duration to match the chosen appointment
 * type and rewrites its title/description with the patient's data — in place,
 * same event, same calendar. Falls back to creating a new event only if the
 * original slot can no longer be found (e.g. race condition).
 */
export async function createBooking(request: BookingRequest): Promise<BookingResult> {
  const specialistId = request.selectedSlot.specialistId;
  const specialist = SPECIALISTS[specialistId];
  const calendarId = resolveCalendarId(specialistId);

  if (!hasCredentials() || !calendarId) {
    console.warn('[GoogleCalendar] No credentials/calendarId — booking logged to console only');
    console.log('[BookingRequest]', JSON.stringify(request, null, 2));
    return { success: true, eventId: 'mock-event-id' };
  }

  try {
    const auth = await getCalendarAuth();
    const { google } = await import('googleapis');
    const calendar = google.calendar({ version: 'v3', auth });

    const durationMin = APPOINTMENT_TYPES[request.appointmentType]?.duration ?? 30;
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

    const eventBody = {
      summary:     `${APPOINTMENT_TYPES[request.appointmentType]?.label ?? 'Primera consulta'} — ${request.patientName}`,
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
    };

    let eventId: string | undefined;

    // 1. Try to update the existing "Primera cita" slot in place
    if (request.selectedSlot.eventId) {
      try {
        const updated = await calendar.events.patch({
          calendarId,
          eventId: request.selectedSlot.eventId,
          requestBody: eventBody,
        });
        eventId = updated.data.id ?? undefined;
      } catch (err) {
        // Slot may have already been booked/removed (race condition) — fall back to creating a new event
        console.warn('[GoogleCalendar] Could not update availability event, creating new one instead:', err);
      }
    }

    // 2. Fallback: create a new event if there was no slot to update
    if (!eventId) {
      const created = await calendar.events.insert({ calendarId, requestBody: eventBody });
      eventId = created.data.id ?? undefined;
    }

    return { success: true, eventId };

  } catch (err) {
    console.error('[GoogleCalendar] createBooking error:', err);
    return { success: false, error: 'No se pudo crear el evento en Google Calendar' };
  }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function buildEventDescription(
  request: BookingRequest,
  specialistName: string,
  specialistRole: string
): string {
  const appointmentType = APPOINTMENT_TYPES[request.appointmentType];
  const lines = [
    `NUEVA CITA — ${specialistName} (${specialistRole})`,
    '',
    `Tipo de cita: ${appointmentType?.label ?? request.appointmentType} (${appointmentType?.detail ?? ''})`,
    `Servicio: ${SERVICE_LABELS[request.service] ?? request.service}`,
    '',
    `Paciente: ${request.patientName}${request.patientAge ? `, ${request.patientAge} años` : ''}`,
    request.guardianName ? `Familiar: ${request.guardianName}` : null,
    `Email: ${request.email}`,
    `Teléfono: ${request.phone}`,
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
