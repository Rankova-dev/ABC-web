/**
 * ABC Centre — Landing de psicología de adultos (presencial y online)
 *
 * Contenido facilitado por dirección el 07/10/2026 ("contenido Landing
 * psicología"). La landing vive en /psicologia-adultos (ca: /psicologia-adults)
 * con cabecera y pie propios, fuera del menú general.
 *
 * Aquí solo va la estructura: qué áreas hay, qué citas se reservan en cada una
 * y quién aparece como profesional. Los textos están en messages/*.json bajo
 * `landing_psicologia`.
 *
 * ⚠️ El equipo que se MUESTRA y el que RECIBE citas no siempre coinciden: el
 * documento lista profesionales (p. ej. Maria del Mar Aránega en adultos) que
 * no tienen agenda abierta para esta landing. Las agendas salen siempre de
 * config/specialists.ts (especialidad del tipo de cita + equipo del servicio).
 */
import type { AppointmentType, Service, SpecialistId } from '@/config/specialists';

export type LandingAreaKey = 'adultos' | 'online' | 'familia' | 'padres';

export interface LandingArea {
  key:     LandingAreaKey;
  icon:    'adults' | 'online' | 'family' | 'parents';
  /** Servicio del que salen las agendas y con el que se registra la cita */
  service: Service;
  /** Sesión suelta y bono, en el orden en que se muestran */
  types:   readonly AppointmentType[];
  /** Profesionales que aparecen en la sección (documento de dirección) */
  team:    readonly SpecialistId[];
}

export const LANDING_AREAS: readonly LandingArea[] = [
  {
    key:     'adultos',
    icon:    'adults',
    service: 'psicologia',
    // Agendas: Margot, Eulàlia y Èlia (especialidad psicologia-adultos).
    // A Margot no se le ofrece aquí la valoración neuropsicológica.
    types:   ['psicologia-adultos', 'bono-psicologia-adultos'],
    team:    ['margot_moreno', 'eulalia_marquez', 'elia_huertas', 'mar_aranega'],
  },
  {
    key:     'online',
    icon:    'online',
    service: 'psicologia',
    // Èlia: martes por la tarde solo online (onlineWindows en specialists.ts)
    types:   ['psicologia-online', 'bono-psicologia-adultos-online'],
    team:    ['margot_moreno', 'eulalia_marquez', 'elia_huertas'],
  },
  {
    key:     'familia',
    icon:    'family',
    service: 'terapia-familiar',
    // Agenda: solo Èlia
    types:   ['terapia-familiar-pareja', 'bono-terapia-familiar-pareja'],
    team:    ['elia_huertas'],
  },
  {
    key:     'padres',
    icon:    'parents',
    service: 'orientacion-familiar',
    // Agendas: Margot, Eulàlia y Èlia (especialidad asesoramiento-padres)
    types:   ['asesoramiento-padres', 'bono-asesoramiento-padres'],
    team:    ['margot_moreno', 'eulalia_marquez', 'elia_huertas', 'mar_aranega', 'raisa_pocino'],
  },
];

/** Fotos del equipo (las mismas de /equipo) */
export const TEAM_PHOTOS: Partial<Record<SpecialistId, string>> = {
  margot_moreno:   '/images/equipo/margot-moreno.webp',
  eulalia_marquez: '/images/equipo/eulalia-marquez.webp',
  elia_huertas:    '/images/equipo/elia-huertas.webp',
  mar_aranega:     '/images/equipo/mar-aranega.webp',
  raisa_pocino:    '/images/equipo/raisa-pocino.webp',
};
