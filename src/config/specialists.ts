/**
 * ABC Centre — Especialistas, especialidades y calendarios
 *
 * FUENTE ÚNICA DE VERDAD del equipo. De aquí salen:
 *   · el equipo que aparece en cada página de servicio (ServiceLanding)
 *   · los calendarios que se consultan al pedir cita (BookingForm + /api/availability)
 *   · el destinatario del aviso interno de cada cita
 *
 * Cada especialista tiene su propio Google Calendar.
 * Configura los IDs en .env.local con el formato:
 *   GOOGLE_CALENDAR_<CLAVE>=<email o ID del calendario de Google>
 *
 * El service account debe tener acceso a cada calendario:
 *   abc-calendar@seismic-sweep-497513-g9.iam.gserviceaccount.com
 *   Permiso: "Realizar cambios en eventos"
 */

/**
 * Buzón que recibe el aviso interno cuando no hay NOTIFY_<ESPECIALISTA>.
 * Puede ser de cualquier dominio (vale un Gmail): solo es un destinatario.
 * info@abccentre.es es la dirección que el centro publica en su web y en el
 * aviso legal, así que es la apuesta segura mientras no confirmen otra.
 */
const DEFAULT_NOTIFY_EMAIL =
  process.env.MAIL_INTERNAL_RECIPIENT ??
  process.env.GMAIL_INTERNAL_RECIPIENT ??
  'info@abccentre.es';

// ─── Especialidades ───────────────────────────────────────────────────────────

/**
 * Áreas en las que trabaja cada profesional, según el listado facilitado por
 * dirección (14/09/2026).
 *
 * ⚠️ Estas etiquetas son la base de todo: cambiar aquí quién tiene un área
 * cambia a la vez la web y los calendarios que se ofrecen al pedir cita.
 * No añadir a nadie "por si acaso".
 */
export type Specialty =
  | 'psicologia-infanto-juvenil'
  | 'psicologia-adultos'
  | 'psicologia-online'
  | 'tea'
  | 'logopedia-infanto-juvenil'
  | 'logopedia-adultos'
  | 'psicopedagogia'
  | 'neuropsicologia'
  | 'asesoramiento-padres';

/** Etiquetas legibles de cada especialidad (es / ca) */
export const SPECIALTY_LABELS: Record<Specialty, { es: string; ca: string }> = {
  'psicologia-infanto-juvenil': { es: 'Psicología infanto-juvenil',  ca: 'Psicologia infantojuvenil' },
  'psicologia-adultos':         { es: 'Psicología adultos',          ca: 'Psicologia adults' },
  'psicologia-online':          { es: 'Psicología online',           ca: 'Psicologia online' },
  tea:                          { es: 'Trastorno del Espectro Autista', ca: "Trastorn de l'Espectre Autista" },
  'logopedia-infanto-juvenil':  { es: 'Logopedia infanto-juvenil',   ca: 'Logopèdia infantojuvenil' },
  'logopedia-adultos':          { es: 'Logopedia adultos',           ca: 'Logopèdia adults' },
  psicopedagogia:               { es: 'Psicopedagogia',              ca: 'Psicopedagogia' },
  neuropsicologia:              { es: 'Neuropsicología',             ca: 'Neuropsicologia' },
  'asesoramiento-padres':       { es: 'Asesoramiento a padres',       ca: 'Assessorament a pares' },
};

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface SpecialistConfig {
  name:     string;
  role:     string;
  initials: string;
  /** Áreas en las que atiende. Vacío = no entra en el reparto de citas online. */
  specialties: readonly Specialty[];
  /** Google Calendar ID (email de la cuenta o c_xxx@group.calendar.google.com) */
  calendarId: string;
  /** Email que aparece como asistente en el evento creado */
  email: string;
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
  | 'habilidades-sociales'
  | 'orientacion-familiar'
  | 'cursos-formacion'
  | 'salut';

// ─── Catálogo de especialistas ────────────────────────────────────────────────

export const SPECIALISTS = {
  celia_cruz: {
    name: 'Celia Cruz',
    role: 'Codirectora · Logopeda',
    initials: 'CC',
    // Confirmado por dirección (14/09/2026): pasa consulta de logopedia en
    // ambas franjas, aunque no saliera en el listado inicial.
    specialties: ['logopedia-infanto-juvenil', 'logopedia-adultos'],
    calendarId: process.env.GOOGLE_CALENDAR_CELIA_CRUZ ?? '',
    email: process.env.NOTIFY_CELIA_CRUZ ?? DEFAULT_NOTIFY_EMAIL,
  },
  laia_alvarez: {
    name: 'Laia Álvarez',
    role: 'Codirectora · Psicóloga Gral. Sanitaria · Neuropsicóloga',
    initials: 'LA',
    specialties: ['neuropsicologia', 'psicopedagogia'],
    calendarId: process.env.GOOGLE_CALENDAR_LAIA_ALVAREZ ?? '',
    email: process.env.NOTIFY_LAIA_ALVAREZ ?? DEFAULT_NOTIFY_EMAIL,
  },
  maria_andres: {
    name: 'María Andrés',
    role: 'Psicóloga',
    initials: 'MA',
    specialties: ['psicologia-infanto-juvenil', 'psicologia-adultos'],
    calendarId: process.env.GOOGLE_CALENDAR_MARIA_ANDRES ?? '',
    email: process.env.NOTIFY_MARIA_ANDRES ?? DEFAULT_NOTIFY_EMAIL,
  },
  laia_lahoz: {
    name: 'Laia Lahoz',
    role: 'Logopeda',
    initials: 'LL',
    specialties: ['logopedia-infanto-juvenil'],
    calendarId: process.env.GOOGLE_CALENDAR_LAIA_LAHOZ ?? '',
    email: process.env.NOTIFY_LAIA_LAHOZ ?? DEFAULT_NOTIFY_EMAIL,
  },
  vanessa_pedro: {
    name: 'Vanessa de Pedro',
    role: 'Logopeda',
    initials: 'VP',
    specialties: ['logopedia-infanto-juvenil', 'logopedia-adultos'],
    calendarId: process.env.GOOGLE_CALENDAR_VANESSA_PEDRO ?? '',
    email: process.env.NOTIFY_VANESSA_PEDRO ?? DEFAULT_NOTIFY_EMAIL,
  },
  noelia_torres: {
    name: 'Noelia Torres',
    role: 'Logopeda',
    initials: 'NT',
    specialties: ['logopedia-infanto-juvenil', 'logopedia-adultos'],
    calendarId: process.env.GOOGLE_CALENDAR_NOELIA_TORRES ?? '',
    email: process.env.NOTIFY_NOELIA_TORRES ?? DEFAULT_NOTIFY_EMAIL,
  },
  mar_aranega: {
    name: 'Maria del Mar Aránega',
    role: 'Psicóloga Gral. Sanitaria',
    initials: 'MM',
    specialties: ['psicologia-infanto-juvenil'],
    calendarId: process.env.GOOGLE_CALENDAR_MAR_ARANEGA ?? '',
    email: process.env.NOTIFY_MAR_ARANEGA ?? DEFAULT_NOTIFY_EMAIL,
  },
  margot_moreno: {
    name: 'Margot Moreno',
    role: 'Psicóloga Gral. Sanitaria · Neuropsicóloga',
    initials: 'MR',
    specialties: [
      'psicologia-infanto-juvenil',
      'psicologia-adultos',
      'psicologia-online',
      'psicopedagogia',
      'neuropsicologia',
      'asesoramiento-padres',
    ],
    calendarId: process.env.GOOGLE_CALENDAR_MARGOT_MORENO ?? '',
    email: process.env.NOTIFY_MARGOT_MORENO ?? DEFAULT_NOTIFY_EMAIL,
  },
  silvia_marco: {
    name: 'Silvia Marcó',
    role: 'Psicóloga Gral. Sanitaria · Neuropsicóloga',
    initials: 'SM',
    specialties: ['tea', 'neuropsicologia'],
    calendarId: process.env.GOOGLE_CALENDAR_SILVIA_MARCO ?? '',
    email: process.env.NOTIFY_SILVIA_MARCO ?? DEFAULT_NOTIFY_EMAIL,
  },
  eulalia_marquez: {
    name: 'Eulàlia Márquez',
    role: 'Psicóloga Gral. Sanitaria',
    initials: 'EM',
    specialties: [
      'psicologia-infanto-juvenil',
      'psicologia-adultos',
      'psicologia-online',
      'psicopedagogia',
      'asesoramiento-padres',
    ],
    calendarId: process.env.GOOGLE_CALENDAR_EULALIA_MARQUEZ ?? '',
    email: process.env.NOTIFY_EULALIA_MARQUEZ ?? DEFAULT_NOTIFY_EMAIL,
  },
  elia_huertas: {
    name: 'Èlia Huertas',
    role: 'Psicóloga Gral. Sanitaria',
    initials: 'EH',
    specialties: [
      'psicologia-infanto-juvenil',
      'psicologia-adultos',
      'psicologia-online',
      'tea',
      'psicopedagogia',
      'asesoramiento-padres',
    ],
    calendarId: process.env.GOOGLE_CALENDAR_ELIA_HUERTAS ?? '',
    email: process.env.NOTIFY_ELIA_HUERTAS ?? DEFAULT_NOTIFY_EMAIL,
  },
  raisa_pocino: {
    name: 'Raisa Pocino',
    role: 'Psicóloga Gral. Sanitaria',
    initials: 'RP',
    specialties: ['psicologia-infanto-juvenil', 'tea', 'psicopedagogia'],
    calendarId: process.env.GOOGLE_CALENDAR_RAISA_POCINO ?? '',
    email: process.env.NOTIFY_RAISA_POCINO ?? DEFAULT_NOTIFY_EMAIL,
  },
  carla_lopez: {
    name: 'Carla López',
    role: 'Psicopedagoga',
    initials: 'CL',
    specialties: ['psicopedagogia'],
    calendarId: process.env.GOOGLE_CALENDAR_CARLA_LOPEZ ?? '',
    email: process.env.NOTIFY_CARLA_LOPEZ ?? DEFAULT_NOTIFY_EMAIL,
  },
} as const satisfies Record<string, SpecialistConfig>;

export type SpecialistId = keyof typeof SPECIALISTS;

const SPECIALIST_IDS = Object.keys(SPECIALISTS) as SpecialistId[];

/** Especialistas que trabajan alguna de estas áreas, en orden de catálogo */
function bySpecialty(...areas: Specialty[]): readonly SpecialistId[] {
  return SPECIALIST_IDS.filter((id) =>
    (SPECIALISTS[id].specialties as readonly Specialty[]).some((s) => areas.includes(s))
  );
}

// ─── Mapeo servicio → equipo ──────────────────────────────────────────────────

/**
 * Los servicios de la web son más amplios que las especialidades internas, así
 * que cada uno agrupa las áreas que le corresponden. Derivarlo de `specialties`
 * evita que la web y el calendario se desincronicen.
 *
 * Los marcados como "asignación directa" no tienen equivalente en el listado de
 * dirección y conservan el equipo que ya tenían.
 */
export const SERVICE_TEAM: Record<Service, readonly SpecialistId[]> = {
  logopedia:       bySpecialty('logopedia-infanto-juvenil', 'logopedia-adultos'),
  psicologia:      bySpecialty('psicologia-infanto-juvenil', 'psicologia-adultos', 'psicologia-online'),
  neuropsicologia: bySpecialty('neuropsicologia'),
  psicopedagogia:  bySpecialty('psicopedagogia'),
  tea:             bySpecialty('tea'),

  // Rehabilitación de voz es logopedia de adultos: la página se dirige a
  // "Adultos · Profesionales de la voz".
  'rehabilitacion-voz': bySpecialty('logopedia-adultos'),

  // Orientación familiar = asesoramiento a padres.
  'orientacion-familiar': bySpecialty('asesoramiento-padres'),

  // ── Asignación directa (pendiente de confirmar con dirección) ──────────────
  'terapia-familiar':     ['mar_aranega', 'margot_moreno'],
  'habilidades-sociales': ['silvia_marco'],
  'cursos-formacion':     ['laia_alvarez', 'silvia_marco', 'carla_lopez'],
  salut:                  ['laia_alvarez', 'margot_moreno', 'noelia_torres'],
};

/** Etiquetas legibles de cada servicio (usadas en emails y resúmenes) */
export const SERVICE_LABELS: Record<Service, string> = {
  logopedia:               'Logopedia',
  psicologia:              'Psicología',
  neuropsicologia:         'Neuropsicología',
  psicopedagogia:          'Psicopedagogia',
  tea:                     'TEA (Autismo)',
  'rehabilitacion-voz':    'Rehabilitación de la Voz',
  'terapia-familiar':      'Terapia Familiar',
  'habilidades-sociales':  'Habilidades Sociales',
  'orientacion-familiar':  'Orientación Familiar',
  'cursos-formacion':      'Cursos y Formación',
  salut:                   'Salut',
};

// ─── Tipos de cita ────────────────────────────────────────────────────────────

export type AppointmentType =
  | 'informativa-presencial'
  | 'informativa-telefonica'
  | 'psicologia-infanto-juvenil'
  | 'psicologia-adultos'
  | 'psicologia-online'
  | 'bono-psicologia-adultos'
  | 'bono-psicologia-adultos-online'
  | 'valoracion-infanto-juvenil'
  | 'valoracion-adultos'
  | 'pack-tdah-infanto-juvenil'
  | 'pack-tdah-adultos'
  | 'pack-dislexia-infanto-juvenil'
  | 'pack-completa-infanto-juvenil'
  | 'pack-completa-adultos'
  | 'asesoramiento-padres';

/**
 * Hora (24h) a partir de la cual un hueco ya no cuenta como "de mañana".
 * Las citas con `maxStartHour` solo se ofrecen antes de esta hora.
 */
export const MORNING_END_HOUR = 14;

/**
 * Palabra que marca un hueco como franja online en Google Calendar:
 * un evento titulado "Primera cita online" solo se ofrece para citas online,
 * y las citas online solo usan huecos marcados así.
 */
export const ONLINE_SLOT_KEYWORD = 'online';

export interface AppointmentTypeConfig {
  label:    string;
  /** Texto corto con precio/condiciones, ej. "Gratuita" o "52 € · Solo mañanas" */
  detail:   string;
  /** Duración del evento en el calendario (minutos) */
  duration: number;
  /** Precio en euros, 0 = gratuita */
  price:    number;
  /**
   * Área que debe atender la especialista para ofrecer esta cita. Sin valor,
   * vale cualquiera del servicio (p. ej. la valoración, que es neuropsicológica
   * o psicopedagógica según desde qué servicio se pida).
   */
  specialty?: Specialty;
  /** Solo huecos marcados como online (y esos huecos solo para estas citas). */
  onlineOnly?: boolean;
  /** Solo huecos que empiecen antes de esta hora (24h). */
  maxStartHour?: number;
  /** Qué incluye el bono o el pack (se muestra en la página de tarifas). */
  includes?: string;
  /** Nº de sesiones del bono/pack. La cita reserva solo la primera. */
  sessions?: number;
}

/**
 * Precios facilitados por dirección el 14/09/2026. La duración de las sesiones
 * de psicología se ha igualado a la de las valoraciones (50 min) porque no se
 * indicó: cambiarla aquí si la sesión es de 60.
 */
export const APPOINTMENT_TYPES: Record<AppointmentType, AppointmentTypeConfig> = {
  'informativa-presencial': {
    label:    'Sesión informativa presencial',
    detail:   'Gratuita',
    duration: 20,
    price:    0,
  },
  'informativa-telefonica': {
    label:    'Sesión informativa telefónica',
    detail:   'Gratuita',
    duration: 30,
    price:    0,
  },
  'psicologia-infanto-juvenil': {
    label:        '1ª sesión de psicología infanto-juvenil',
    detail:       '52 € · Solo horario de mañana',
    duration:     50,
    price:        52,
    specialty:    'psicologia-infanto-juvenil',
    maxStartHour: MORNING_END_HOUR,
  },
  'psicologia-adultos': {
    label:     '1ª sesión de psicología de adultos',
    detail:    '60 €',
    duration:  50,
    price:     60,
    specialty: 'psicologia-adultos',
  },
  'psicologia-online': {
    label:      '1ª sesión de psicología online',
    detail:     '60 € · Franja online',
    duration:   50,
    price:      60,
    specialty:  'psicologia-online',
    onlineOnly: true,
  },
  'bono-psicologia-adultos': {
    label:     'Bono de 4 sesiones · Psicología de adultos',
    detail:    '220 € · 4 sesiones (55 €/sesión)',
    duration:  50,
    price:     220,
    sessions:  4,
    specialty: 'psicologia-adultos',
    includes:  '4 sesiones de psicología de adultos. Al reservar aquí se agenda la primera; el resto se acuerdan con la psicóloga.',
  },
  'bono-psicologia-adultos-online': {
    label:      'Bono de 4 sesiones · Psicología de adultos online',
    detail:     '220 € · 4 sesiones (55 €/sesión)',
    duration:   50,
    price:      220,
    sessions:   4,
    specialty:  'psicologia-online',
    onlineOnly: true,
    includes:   '4 sesiones de psicología de adultos online. Al reservar aquí se agenda la primera; el resto se acuerdan con la psicóloga.',
  },
  'valoracion-infanto-juvenil': {
    label:    '1ª sesión de valoración neuropsicológica/psicopedagógica infanto-juvenil',
    detail:   '55 € · Solo padres',
    duration: 50,
    price:    55,
  },
  'valoracion-adultos': {
    label:    '1ª sesión de valoración neuropsicológica adultos',
    detail:   '60 €',
    duration: 50,
    price:    60,
  },
  'pack-tdah-infanto-juvenil': {
    label:    'Pack valoración neuropsicológica TDAH infanto-juvenil',
    detail:   '335 € · Valoración completa con informe',
    duration: 50,
    price:    335,
    sessions: 6,
    includes:
      'Entrevista clínica inicial con los padres (anamnesis), 3 sesiones de valoración (administración de pruebas), cuestionarios a padres y escuela, sesión de devolución de resultados e informe.',
  },
  'pack-tdah-adultos': {
    label:    'Pack valoración neuropsicológica TDAH adultos',
    detail:   '360 € · Valoración completa con informe',
    duration: 50,
    price:    360,
    sessions: 5,
    includes:
      'Entrevista clínica inicial (anamnesis), 3 sesiones de valoración (administración de pruebas), sesión de devolución de resultados e informe.',
  },
  'pack-dislexia-infanto-juvenil': {
    label:    'Pack valoración neuropsicológica dislexia infanto-juvenil',
    detail:   '335 € · Valoración completa con informe',
    duration: 50,
    price:    335,
    sessions: 6,
    includes:
      'Entrevista clínica inicial con los padres (anamnesis), 3 sesiones de valoración (administración de pruebas), cuestionarios a padres y escuela, sesión de devolución de resultados e informe.',
  },
  'pack-completa-infanto-juvenil': {
    label:    'Pack valoración neuropsicológica completa infanto-juvenil',
    detail:   '445 € · Dislexia, TDAH, discalculia…',
    duration: 50,
    price:    445,
    sessions: 8,
    includes:
      'Entrevista clínica inicial con los padres (anamnesis), 5 sesiones de valoración (administración de pruebas), cuestionarios a padres y escuela, sesión de devolución de resultados e informe.',
  },
  'asesoramiento-padres': {
    label:     'Sesión de asesoramiento a padres',
    detail:    '55 €',
    duration:  50,
    price:     55,
    specialty: 'asesoramiento-padres',
  },
  'pack-completa-adultos': {
    label:    'Pack valoración neuropsicológica completa adultos',
    detail:   '480 € · Dislexia, TDAH, discalculia, lenguaje…',
    duration: 50,
    price:    480,
    sessions: 7,
    includes:
      'Entrevista clínica inicial (anamnesis), 5 sesiones de valoración (administración de pruebas), sesión de devolución de resultados e informe.',
  },
};

const INFORMATIVA = ['informativa-presencial', 'informativa-telefonica'] as const;

/** Tipos de cita que se ofrecen en cada servicio, en el orden en que se muestran */
export const SERVICE_APPOINTMENT_TYPES: Record<Service, readonly AppointmentType[]> = {
  psicologia: [
    ...INFORMATIVA,
    'psicologia-infanto-juvenil',
    'psicologia-adultos',
    'psicologia-online',
    'bono-psicologia-adultos',
    'bono-psicologia-adultos-online',
  ],
  neuropsicologia: [
    ...INFORMATIVA,
    'valoracion-infanto-juvenil',
    'valoracion-adultos',
    'pack-tdah-infanto-juvenil',
    'pack-tdah-adultos',
    'pack-dislexia-infanto-juvenil',
    'pack-completa-infanto-juvenil',
    'pack-completa-adultos',
  ],
  psicopedagogia:  [...INFORMATIVA, 'valoracion-infanto-juvenil'],
  'orientacion-familiar': [...INFORMATIVA, 'asesoramiento-padres'],
  tea:             [...INFORMATIVA, 'valoracion-infanto-juvenil', 'valoracion-adultos'],

  // Sin tarifa de primera sesión facilitada: solo sesión informativa gratuita.
  logopedia:              INFORMATIVA,
  'rehabilitacion-voz':   INFORMATIVA,
  'terapia-familiar':     INFORMATIVA,
  'habilidades-sociales': INFORMATIVA,
  'cursos-formacion':     INFORMATIVA,
  salut:                  INFORMATIVA,
};

/** Versión catalana del catálogo: la web es bilingüe y los precios también */
const APPOINTMENT_TYPES_CA: Record<
  AppointmentType,
  { label: string; detail: string; includes?: string }
> = {
  'informativa-presencial': {
    label:  'Sessió informativa presencial',
    detail: 'Gratuïta',
  },
  'informativa-telefonica': {
    label:  'Sessió informativa telefònica',
    detail: 'Gratuïta',
  },
  'psicologia-infanto-juvenil': {
    label:  '1a sessió de psicologia infantojuvenil',
    detail: '52 € · Només horari de matí',
  },
  'psicologia-adultos': {
    label:  "1a sessió de psicologia d'adults",
    detail: '60 €',
  },
  'psicologia-online': {
    label:  '1a sessió de psicologia en línia',
    detail: '60 € · Franja en línia',
  },
  'bono-psicologia-adultos': {
    label:    "Bo de 4 sessions · Psicologia d'adults",
    detail:   '220 € · 4 sessions (55 €/sessió)',
    includes:
      "4 sessions de psicologia d'adults. En reservar aquí s'agenda la primera; la resta s'acorden amb la psicòloga.",
  },
  'bono-psicologia-adultos-online': {
    label:    "Bo de 4 sessions · Psicologia d'adults en línia",
    detail:   '220 € · 4 sessions (55 €/sessió)',
    includes:
      "4 sessions de psicologia d'adults en línia. En reservar aquí s'agenda la primera; la resta s'acorden amb la psicòloga.",
  },
  'asesoramiento-padres': {
    label:  'Sessió assessorament a pares',
    detail: '55 €',
  },
  'valoracion-infanto-juvenil': {
    label:  '1a sessió de valoració neuropsicològica/psicopedagògica infantojuvenil',
    detail: '55 € · Només pares',
  },
  'valoracion-adultos': {
    label:  "1a sessió de valoració neuropsicològica d'adults",
    detail: '60 €',
  },
  'pack-tdah-infanto-juvenil': {
    label:    'Pack valoració neuropsicològica TDAH infantojuvenil',
    detail:   '335 € · Valoració completa amb informe',
    includes:
      'Entrevista clínica inicial amb els pares (anamnesi), 3 sessions de valoració (administració de proves), qüestionaris a pares i escola, sessió de devolució de resultats i informe.',
  },
  'pack-tdah-adultos': {
    label:    'Pack valoració neuropsicològica TDAH adults',
    detail:   '360 € · Valoració completa amb informe',
    includes:
      'Entrevista clínica inicial (anamnesi), 3 sessions de valoració (administració de proves), sessió de devolució de resultats i informe.',
  },
  'pack-dislexia-infanto-juvenil': {
    label:    'Pack valoració neuropsicològica dislèxia infantojuvenil',
    detail:   '335 € · Valoració completa amb informe',
    includes:
      'Entrevista clínica inicial amb els pares (anamnesi), 3 sessions de valoració (administració de proves), qüestionaris a pares i escola, sessió de devolució de resultats i informe.',
  },
  'pack-completa-infanto-juvenil': {
    label:    'Pack valoració neuropsicològica completa infantojuvenil',
    detail:   '445 € · Dislèxia, TDAH, discalcúlia…',
    includes:
      'Entrevista clínica inicial amb els pares (anamnesi), 5 sessions de valoració (administració de proves), qüestionaris a pares i escola, sessió de devolució de resultats i informe.',
  },
  'pack-completa-adultos': {
    label:    'Pack valoració neuropsicològica completa adults',
    detail:   '480 € · Dislèxia, TDAH, discalcúlia, llenguatge…',
    includes:
      'Entrevista clínica inicial (anamnesi), 5 sessions de valoració (administració de proves), sessió de devolució de resultats i informe.',
  },
};

/** Nombre, precio y contenido de un tipo de cita en el idioma de la web */
export function getAppointmentTypeText(
  type: AppointmentType,
  locale: string
): { label: string; detail: string; includes?: string } {
  const cfg = APPOINTMENT_TYPES[type];
  const ca = locale === 'ca' ? APPOINTMENT_TYPES_CA[type] : undefined;
  return {
    label:    ca?.label    ?? cfg.label,
    detail:   ca?.detail   ?? cfg.detail,
    includes: ca?.includes ?? cfg.includes,
  };
}

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
 * Especialistas que pueden atender esta cita: las del servicio y, si el tipo
 * de cita exige un área concreta (psicología online, por ejemplo), solo las
 * que además trabajan esa área.
 */
export function getSpecialistsForAppointment(
  service: Service,
  appointmentType?: AppointmentType
): readonly SpecialistId[] {
  const team = SERVICE_TEAM[service];
  const required = appointmentType ? APPOINTMENT_TYPES[appointmentType]?.specialty : undefined;
  if (!required) return team;
  return team.filter((id) =>
    (SPECIALISTS[id].specialties as readonly Specialty[]).includes(required)
  );
}

/** Devuelve las especialistas de un área concreta con su config completa */
export function getTeamForSpecialty(
  specialty: Specialty
): Array<{ id: SpecialistId } & SpecialistConfig> {
  return bySpecialty(specialty).map((id) => ({ id, ...SPECIALISTS[id] }));
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
