/**
 * ABC Centre — Especialistas y calendarios
 *
 * Cada especialista tiene su propio Google Calendar.
 * Configura los IDs en .env.local con el formato:
 *   GOOGLE_CALENDAR_<CLAVE>=<email o ID del calendario de Google>
 *
 * El service account debe tener acceso a cada calendario:
 *   abc-calendar@seismic-sweep-497513-g9.iam.gserviceaccount.com
 *   Permiso: "Realizar cambios en eventos"
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface SpecialistConfig {
  name:       string;
  role:       string;
  initials:   string;
  /** Google Calendar ID (email de la cuenta o c_xxx@group.calendar.google.com) */
  calendarId: string;
  /** Email que aparece como asistente en el evento creado */
  email:      string;
}

// ─── Servicios disponibles ────────────────────────────────────────────────────

export type Service =
  | 'logopedia'
  | 'psicologia'
  | 'neuropsicologia'
  | 'psicopedagogia'
  | 'tea'
  | 'rehabilitacion-voz'
  | 'terapia-familiar'
  | 'habilidades-sociales';

// ─── Catálogo de especialistas ────────────────────────────────────────────────

export const SPECIALISTS = {
  celia_cruz: {
    name: 'Celia Cruz',
    role: 'Codirectora · Logopeda',
    initials: 'CC',
    calendarId: process.env.GOOGLE_CALENDAR_CELIA_CRUZ ?? '',
    email: process.env.NOTIFY_CELIA_CRUZ ?? 'citas@abccentre.es',
  },
  laia_alvarez: {
    name: 'Laia Álvarez',
    role: 'Codirectora · Psicóloga · Neuropsicóloga',
    initials: 'LA',
    calendarId: process.env.GOOGLE_CALENDAR_LAIA_ALVAREZ ?? '',
    email: process.env.NOTIFY_LAIA_ALVAREZ ?? 'citas@abccentre.es',
  },
  maria_andres: {
    name: 'Maria Andrés',
    role: 'Psicóloga',
    initials: 'MA',
    calendarId: process.env.GOOGLE_CALENDAR_MARIA_ANDRES ?? '',
    email: process.env.NOTIFY_MARIA_ANDRES ?? 'citas@abccentre.es',
  },
  laia_lahoz: {
    name: 'Laia Lahoz',
    role: 'Logopeda',
    initials: 'LL',
    calendarId: process.env.GOOGLE_CALENDAR_LAIA_LAHOZ ?? '',
    email: process.env.NOTIFY_LAIA_LAHOZ ?? 'citas@abccentre.es',
  },
  vanessa_pedro: {
    name: 'Vanessa de Pedro',
    role: 'Logopeda',
    initials: 'VP',
    calendarId: process.env.GOOGLE_CALENDAR_VANESSA_PEDRO ?? '',
    email: process.env.NOTIFY_VANESSA_PEDRO ?? 'citas@abccentre.es',
  },
  mar_aranega: {
    name: 'Mª del Mar Aránega',
    role: 'Psicóloga',
    initials: 'MM',
    calendarId: process.env.GOOGLE_CALENDAR_MAR_ARANEGA ?? '',
    email: process.env.NOTIFY_MAR_ARANEGA ?? 'citas@abccentre.es',
  },
  margot_moreno: {
    name: 'Margot Moreno',
    role: 'Psicóloga',
    initials: 'MR',
    calendarId: process.env.GOOGLE_CALENDAR_MARGOT_MORENO ?? '',
    email: process.env.NOTIFY_MARGOT_MORENO ?? 'citas@abccentre.es',
  },
  noelia_torres: {
    name: 'Noelia Torres',
    role: 'Logopeda',
    initials: 'NT',
    calendarId: process.env.GOOGLE_CALENDAR_NOELIA_TORRES ?? '',
    email: process.env.NOTIFY_NOELIA_TORRES ?? 'citas@abccentre.es',
  },
  silvia_marco: {
    name: 'Silvia Marcó',
    role: 'Psicóloga · Neuropsicóloga',
    initials: 'SM',
    calendarId: process.env.GOOGLE_CALENDAR_SILVIA_MARCO ?? '',
    email: process.env.NOTIFY_SILVIA_MARCO ?? 'citas@abccentre.es',
  },
  eulalia_marquez: {
    name: 'Eulàlia Marquez',
    role: 'Psicóloga Gral. Sanitaria',
    initials: 'EM',
    calendarId: process.env.GOOGLE_CALENDAR_EULALIA_MARQUEZ ?? '',
    email: process.env.NOTIFY_EULALIA_MARQUEZ ?? 'citas@abccentre.es',
  },
  sara_reyes: {
    name: 'Sara Reyes',
    role: 'Psicóloga · Neuropsicóloga',
    initials: 'SR',
    calendarId: process.env.GOOGLE_CALENDAR_SARA_REYES ?? '',
    email: process.env.NOTIFY_SARA_REYES ?? 'citas@abccentre.es',
  },
  carla_lopez: {
    name: 'Carla López',
    role: 'Psicopedagoga',
    initials: 'CL',
    calendarId: process.env.GOOGLE_CALENDAR_CARLA_LOPEZ ?? '',
    email: process.env.NOTIFY_CARLA_LOPEZ ?? 'citas@abccentre.es',
  },
} as const satisfies Record<string, SpecialistConfig>;

export type SpecialistId = keyof typeof SPECIALISTS;

// ─── Mapeo servicio → equipo ──────────────────────────────────────────────────

export const SERVICE_TEAM: Record<Service, readonly SpecialistId[]> = {
  logopedia:             ['laia_lahoz',   'vanessa_pedro',  'noelia_torres'],
  psicologia:            ['laia_alvarez', 'mar_aranega',    'margot_moreno', 'eulalia_marquez'],
  neuropsicologia:       ['laia_alvarez', 'silvia_marco', 'sara_reyes'],
  psicopedagogia:        ['carla_lopez'],
  tea:                   ['laia_alvarez', 'laia_lahoz',     'vanessa_pedro'],
  'rehabilitacion-voz':  ['laia_lahoz',   'noelia_torres'],
  'terapia-familiar':    ['mar_aranega',  'margot_moreno'],
  'habilidades-sociales':['silvia_marco', 'sara_reyes'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Devuelve las especialistas de un servicio con su config completa */
export function getTeamForService(
  service: Service
): Array<{ id: SpecialistId } & SpecialistConfig> {
  return (SERVICE_TEAM[service] as readonly SpecialistId[]).map(
    (id: SpecialistId) => ({ id, ...SPECIALISTS[id] })
  );
}

/**
 * Devuelve el calendarId efectivo para una especialista.
 * Fallback: GOOGLE_CALENDAR_ID_GENERAL o cadena vacía.
 */
export function resolveCalendarId(specialistId: SpecialistId): string {
  const specific = SPECIALISTS[specialistId].calendarId;
  if (specific) return specific;
  return process.env.GOOGLE_CALENDAR_ID_GENERAL ?? '';
}

/** Devuelve la primera especialista de un servicio (lead) */
export function getLeadSpecialistId(service: Service): SpecialistId {
  return SERVICE_TEAM[service][0];
}

// ─── Retrocompatibilidad (legacy imports) ────────────────────────────────────

/** @deprecated Usar SPECIALISTS, SERVICE_TEAM y getTeamForService directamente */
export const SERVICE_SPECIALISTS: Record<
  Service,
  { displayName: string; email: string; calendarId: string }
> = Object.fromEntries(
  (Object.keys(SERVICE_TEAM) as Service[]).map((svc: Service) => {
    const leadId: SpecialistId = SERVICE_TEAM[svc][0];
    const lead = SPECIALISTS[leadId];
    return [
      svc,
      {
        displayName: lead.role.split('·')[0].trim(),
        email:       lead.email,
        calendarId:  resolveCalendarId(leadId),
      },
    ];
  })
) as Record<Service, { displayName: string; email: string; calendarId: string }>;
