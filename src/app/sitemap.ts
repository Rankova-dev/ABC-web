import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/content/blog-posts';

const BASE = 'https://abccentre.es';

const ES_PATHS = [
  '',
  '/servicios',
  '/logopedia',
  '/psicologia',
  '/neuropsicologia',
  '/psicopedagogia',
  '/tea',
  '/rehabilitacion-voz',
  '/terapia-familiar',
  '/habilidades-sociales',
  '/equipo',
  '/contacto',
  '/blog',
  ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
];

const CA_PATHS = [
  '',
  '/serveis',
  '/logopedia',
  '/psicologia',
  '/neuropsicologia',
  '/psicopedagogia',
  '/tea',
  '/rehabilitacio-veu',
  '/terapia-familiar',
  '/habilitats-socials',
  '/equip',
  '/contacte',
  '/blog',
  ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
];

const BLOG_DATES = new Map(BLOG_POSTS.map((p) => [`/blog/${p.slug}`, new Date(p.publishedDate)]));

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  ES_PATHS.forEach((path, i) => {
    const isBlogPost = BLOG_DATES.has(path);
    entries.push({
      url: `${BASE}/es${path}`,
      lastModified: BLOG_DATES.get(path) ?? new Date(),
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority: path === '' ? 1 : isBlogPost ? 0.6 : 0.8,
      alternates: {
        languages: {
          es: `${BASE}/es${path}`,
          ca: `${BASE}/ca${CA_PATHS[i]}`,
        },
      },
    });
  });

  return entries;
}
