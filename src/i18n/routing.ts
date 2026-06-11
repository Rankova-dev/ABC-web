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
    '/equipo': {
      es: '/equipo',
      ca: '/equip',
    },
    '/contacto': {
      es: '/contacto',
      ca: '/contacte',
    },
    '/blog': '/blog',
    '/galeria': {
      es: '/galeria',
      ca: '/galeria',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
