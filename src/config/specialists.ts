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
  | 'asesoramiento-padres'
  | 'terapia-familiar-pareja';

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
  'terapia-familiar-pareja':    { es: 'Terapia familiar y de pareja', ca: 'Teràpia familiar i de parella' },
};

// ─── Tipos ───────────────────────────────────────────────────────────────────

/**
 * Tramo semanal reservado a visitas online, en hora de Madrid.
 * Ej.: martes de 15 a 20 → { weekday: 2, fromHour: 15, toHour: 20 }
 *
 * Es una alternativa a escribir "online" en el título del hueco: sirve cuando
 * la franja es siempre la misma y no apetece ir titulando eventos.
 */
export interface OnlineWindow {
  /** Día de la semana: 0 domingo, 1 lunes, 2 martes… */
  weekday:  number;
  /** Hora de inicio, incluida (24h) */
  fromHour: number;
  /** Hora de fin, excluida (24h) */
  toHour:   number;
}

export interface SpecialistConfig {
  name:     string;
  role:     string;
  initials: string;
  /** Áreas en las que atiende. Vacío = no entra en el reparto de citas online. */
  specialties: readonly Specialty[];
  /**
   * Tramos de su calendario reservados a visitas online. Los huecos que caen
   * dentro solo se ofrecen para citas online; los de fuera valen para todo lo
   * que ella atienda, online incluido.
   */
  onlineWindows?: readonly OnlineWindow[];
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
      // Landing de psicología (dirección, 07/10/2026): terapia familiar y de
      // pareja solo la lleva ella.
      'terapia-familiar-pareja',
    ],
    // Martes de 15 a 20 solo atiende online; el resto de sus huecos valen para
    // cualquier cosa que ofrezca (dirección, 14/09/2026).
    onlineWindows: [{ weekday: 2, fromHour: 15, toHour: 20 }],
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

  // Orientación familiar = asesoramiento a padres. El documento de la landing
  // de psicología (dirección, 07/10/2026) añade como profesionales a Maria del
  // Mar Aránega y Raisa Pocino, pero sin agenda: las citas siguen yendo solo a
  // quien tiene la especialidad (ver SERVICE_BOOKING_TEAM).
  'orientacion-familiar': [...bySpecialty('asesoramiento-padres'), 'mar_aranega', 'raisa_pocino'],

  // Terapia familiar y de pareja: solo Èlia Huertas (dirección, 07/10/2026).
  'terapia-familiar':     bySpecialty('terapia-familiar-pareja'),

  // ── Asignación directa (pendiente de confirmar con dirección) ──────────────
  'habilidades-sociales': ['silvia_marco'],
  'cursos-formacion':     ['laia_alvarez', 'silvia_marco', 'carla_lopez'],
  salut:                  ['laia_alvarez', 'margot_moreno', 'noelia_torres'],
};

/**
 * Excepciones de quién recibe las citas pedidas por la web. Por defecto son
 * las mismas profesionales que aparecen en la página del servicio
 * (SERVICE_TEAM); aquí solo se anotan los servicios donde no coincide.
 *
 * TEA: dirección confirmó (15/09/2026) que en el calendario no hay nadie que
 * haga valoración de TEA, así que la única cita del área es la sesión
 * informativa y la atiende Laia Álvarez. El equipo que sale en /tea no cambia:
 * Sílvia Marcó, Èlia Huertas y Raisa Pocino siguen siendo las especialistas.
 */
const SERVICE_BOOKING_TEAM: Partial<Record<Service, readonly SpecialistId[]>> = {
  tea: ['laia_alvarez'],
  // Asesoramiento: agendas solo de Margot, Eulàlia y Èlia (dirección,
  // 07/10/2026), aunque en la página salgan también Mar y Raisa.
  'orientacion-familiar': bySpecialty('asesoramiento-padres'),
};

/** Profesionales cuyos calendarios se consultan al pedir cita de un servicio */
export function getBookingTeam(service: Service): readonly SpecialistId[] {
  return SERVICE_BOOKING_TEAM[service] ?? SERVICE_TEAM[service];
}

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
  | 'pack-tea-completa'
  | 'pack-tea-pruebas'
  | 'asesoramiento-padres'
  | 'bono-asesoramiento-padres'
  | 'terapia-familiar-pareja'
  | 'bono-terapia-familiar-pareja';

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
  /**
   * `false` = el precio se publica en /tarifas pero la cita no se puede
   * reservar por la web. Es el caso de las valoraciones de TEA: nadie abre
   * huecos para ellas, así que se acuerdan en la sesión informativa.
   */
  bookable?: boolean;
  /**
   * Quién atiende esta cita, sea del servicio que sea. Manda sobre el equipo
   * del servicio: es el caso de las sesiones informativas.
   */
  attendedBy?: readonly SpecialistId[];
}

/**
 * Precios facilitados por dirección el 14/09/2026. La duración de las sesiones
 * de psicología se ha igualado a la de las valoraciones (50 min) porque no se
 * indicó: cambiarla aquí si la sesión es de 60.
 */
export const APPOINTMENT_TYPES: Record<AppointmentType, AppointmentTypeConfig> = {
  // Dirección (29/09/2026): las sesiones informativas de todos los servicios
  // las atiende solo Laia Álvarez.
  'informativa-presencial': {
    label:      'Sesión informativa presencial',
    detail:     'Gratuita',
    duration:   20,
    price:      0,
    attendedBy: ['laia_alvarez'],
  },
  'informativa-telefonica': {
    label:      'Sesión informativa telefónica',
    detail:     'Gratuita',
    duration:   30,
    price:      0,
    attendedBy: ['laia_alvarez'],
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
  // Bono y terapia familiar/pareja: precios de la landing de psicología
  // (dirección, 07/10/2026). Duración igualada a las demás sesiones (50 min).
  'bono-asesoramiento-padres': {
    label:     'Bono de 4 sesiones · Asesoramiento a padres',
    detail:    '200 € · 4 sesiones (50 €/sesión)',
    duration:  50,
    price:     200,
    sessions:  4,
    specialty: 'asesoramiento-padres',
    includes:  '4 sesiones de asesoramiento a padres. Al reservar aquí se agenda la primera; el resto se acuerdan con la psicóloga.',
  },
  'terapia-familiar-pareja': {
    label:     'Sesión de terapia familiar o de pareja',
    detail:    '65 €',
    duration:  50,
    price:     65,
    specialty: 'terapia-familiar-pareja',
  },
  'bono-terapia-familiar-pareja': {
    label:     'Bono de 4 sesiones · Terapia familiar o de pareja',
    detail:    '240 € · 4 sesiones (60 €/sesión)',
    duration:  50,
    price:     240,
    sessions:  4,
    specialty: 'terapia-familiar-pareja',
    includes:  '4 sesiones de terapia familiar o de pareja. Al reservar aquí se agenda la primera; el resto se acuerdan con la psicóloga.',
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

  // Valoraciones de TEA (dirección, 15/09/2026): en el calendario no hay
  // huecos de valoración de TEA, así que solo se publica el precio y la cita
  // se pide desde la sesión informativa. Las sesiones de valoración son las
  // mismas que en los packs equivalentes: 5 en la completa y 3 en la de
  // pruebas específicas (como TDAH/dislexia), sin cuestionarios a escuela.
  'pack-tea-completa': {
    label:    'Pack valoración completa TEA',
    detail:   '450 € · Valoración completa con informe',
    duration: 50,
    price:    450,
    sessions: 7,
    bookable: false,
    includes:
      'Entrevista clínica inicial (anamnesis), 5 sesiones de valoración (valoración cognitiva y pruebas específicas de TEA), sesión de devolución de resultados e informe.',
  },
  'pack-tea-pruebas': {
    label:    'Pack valoración pruebas específicas TEA',
    detail:   '300 € · Pruebas específicas con informe',
    duration: 50,
    price:    300,
    sessions: 5,
    bookable: false,
    includes:
      'Entrevista clínica inicial (anamnesis), 3 sesiones de valoración (administración de pruebas específicas de TEA), sesión de devolución de resultados e informe.',
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
  'orientacion-familiar': [...INFORMATIVA, 'asesoramiento-padres', 'bono-asesoramiento-padres'],
  'terapia-familiar':     [...INFORMATIVA, 'terapia-familiar-pareja', 'bono-terapia-familiar-pareja'],
  // En el calendario no hay huecos de valoración de TEA: por la web solo se
  // reserva la sesión informativa. Los packs salen en /tarifas con su precio,
  // pero no son reservables (bookable: false).
  tea:             [...INFORMATIVA, 'pack-tea-completa', 'pack-tea-pruebas'],

  // Sin tarifa de primera sesión facilitada: solo sesión informativa gratuita.
  logopedia:              INFORMATIVA,
  'rehabilitacion-voz':   INFORMATIVA,
  'habilidades-sociales': INFORMATIVA,
  'cursos-formacion':     INFORMATIVA,
  salut:                  INFORMATIVA,
};

/** ¿Esta cita se puede reservar por la web, o solo se publica su precio? */
export function isBookableAppointmentType(type: AppointmentType): boolean {
  return APPOINTMENT_TYPES[type].bookable !== false;
}

/** Tipos de cita de un servicio que sí se pueden reservar desde el formulario */
export function getBookableAppointmentTypes(service: Service): AppointmentType[] {
  return SERVICE_APPOINTMENT_TYPES[service].filter(isBookableAppointmentType);
}

/**
 * ¿Hay que pagar por adelantado para confirmar esta cita?
 *
 * Dirección (17/09/2026): el pago es **obligatorio en las sesiones online** —
 * son las únicas que no pasan por el centro, así que no hay dónde cobrarlas— y
 * **opcional en el resto**, que se siguen pagando en consulta.
 *
 * Coincide con los tipos `onlineOnly`, pero se deja como función aparte porque
 * es una decisión comercial, no una propiedad del horario: el día que quieran
 * cobrar también los bonos presenciales, se cambia aquí y solo aquí.
 */
export function requiresPrepayment(type: AppointmentType): boolean {
  const cfg = APPOINTMENT_TYPES[type];
  return Boolean(cfg.onlineOnly) && cfg.price > 0;
}

/**
 * ¿Se puede pagar esta cita por la web? Toda cita de pago reservable admite
 * pasarela: obligatoria en las online (`requiresPrepayment`) y voluntaria en
 * el resto, que también se pueden pagar en el centro (dirección, 17/09/2026).
 * Hoy el pago voluntario solo se ofrece en la landing de psicología.
 */
export function allowsOnlinePayment(type: AppointmentType): boolean {
  return APPOINTMENT_TYPES[type].price > 0 && isBookableAppointmentType(type);
}

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
  'bono-asesoramiento-padres': {
    label:    'Bo de 4 sessions · Assessorament a pares',
    detail:   '200 € · 4 sessions (50 €/sessió)',
    includes:
      "4 sessions d'assessorament a pares. En reservar aquí s'agenda la primera; la resta s'acorden amb la psicòloga.",
  },
  'terapia-familiar-pareja': {
    label:  'Sessió de teràpia familiar o de parella',
    detail: '65 €',
  },
  'bono-terapia-familiar-pareja': {
    label:    'Bo de 4 sessions · Teràpia familiar o de parella',
    detail:   '240 € · 4 sessions (60 €/sessió)',
    includes:
      "4 sessions de teràpia familiar o de parella. En reservar aquí s'agenda la primera; la resta s'acorden amb la psicòloga.",
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
  'pack-tea-completa': {
    label:    'Pack valoració completa TEA',
    detail:   '450 € · Valoració completa amb informe',
    includes:
      'Entrevista clínica inicial (anamnesi), 5 sessions de valoració (valoració cognitiva i proves específiques de TEA), sessió de devolució de resultats i informe.',
  },
  'pack-tea-pruebas': {
    label:    'Pack valoració proves específiques TEA',
    detail:   '300 € · Proves específiques amb informe',
    includes:
      'Entrevista clínica inicial (anamnesi), 3 sessions de valoració (administració de proves específiques de TEA), sessió de devolució de resultats i informe.',
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
 * Especialistas que pueden atender esta cita: las que fije el tipo de cita
 * (`attendedBy`, p. ej. las informativas) o, si no, las del servicio y, si el
 * tipo de cita exige un área concreta (psicología online, por ejemplo), solo
 * las que además trabajan esa área.
 */
export function getSpecialistsForAppointment(
  service: Service,
  appointmentType?: AppointmentType
): readonly SpecialistId[] {
  const cfg = appointmentType ? APPOINTMENT_TYPES[appointmentType] : undefined;
  if (cfg?.attendedBy) return cfg.attendedBy;

  const team = getBookingTeam(service);
  const required = cfg?.specialty;
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
