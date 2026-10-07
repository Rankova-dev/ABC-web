import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'ca'] as const,
  defaultLocale: 'es',
  pathnames: {
    '/': '/',
    '/servicios': {
      es: '/servicios',
      ca: '/serveis',
    },
    // Landing de campaña de psicología (layout propio, fuera del menú)
    '/psicologia-adultos': {
      es: '/psicologia-adultos',
      ca: '/psicologia-adults',
    },
    '/servicios-adultos': {
      es: '/servicios-adultos',
      ca: '/serveis-adults',
    },
    '/logopedia': '/logopedia',
    '/psicologia': '/psicologia',
    '/neuropsicologia': '/neuropsicologia',
    '/psicopedagogia': '/psicopedagogia',
    '/tea': '/tea',
    '/rehabilitacion-voz': {
      es: '/rehabilitacion-voz',
      ca: '/rehabilitacio-veu',
    },
    '/terapia-familiar': '/terapia-familiar',
    '/habilidades-sociales': {
      es: '/habilidades-sociales',
      ca: '/habilitats-socials',
    },
    '/orientacion-familiar': {
      es: '/orientacion-familiar',
      ca: '/orientacio-familiar',
    },
    '/cursos-formacion': {
      es: '/cursos-formacion',
      ca: '/cursos-formacio',
    },
    '/salut': '/salut',
    '/equipo': {
      es: '/equipo',
      ca: '/equip',
    },
    '/tarifas': {
      es: '/tarifas',
      ca: '/tarifes',
    },
    '/contacto': {
      es: '/contacto',
      ca: '/contacte',
    },
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/galeria': {
      es: '/galeria',
      ca: '/galeria',
    },
    '/politica-de-privacidad': {
      es: '/politica-de-privacidad',
      ca: '/politica-de-privacitat',
    },
    '/aviso-legal': {
      es: '/aviso-legal',
      ca: '/avis-legal',
    },
    '/politica-de-cookies': '/politica-de-cookies',
    '/condiciones-de-contratacion': {
      es: '/condiciones-de-contratacion',
      ca: '/condicions-de-contractacio',
    },
    // Vuelta de Stripe. Mismo slug en los dos idiomas: la URL la construye
    // lib/stripe.ts como ${baseUrl}/${locale}/cita/... y así no hay que
    // traducirla en dos sitios.
    '/cita/pago-ok': '/cita/pago-ok',
    '/cita/pago-cancelado': '/cita/pago-cancelado',
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
