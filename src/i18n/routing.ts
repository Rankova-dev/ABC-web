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
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
