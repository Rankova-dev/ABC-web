'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * Cabecera mínima de la landing: logo, anclas a las secciones, idioma y
 * botón de reserva. Sin el menú general, para que la visita no se disperse.
 */
export default function LandingHeader() {
  const t = useTranslations('landing_psicologia');
  const locale = useLocale();
  const altLocale = locale === 'es' ? 'ca' : 'es';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const anchors = [
    { href: '#adultos', label: t('areas.adultos.title') },
    { href: '#online',  label: t('areas.online.title') },
    { href: '#familia', label: t('areas.familia.title') },
    { href: '#padres',  label: t('areas.padres.title') },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-card' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20 gap-4">
        <a href="#top" aria-label="ABC Centre" className="flex-shrink-0">
          <Image
            src="/logos/logo-horizontal.png"
            alt="ABC Centre"
            width={140}
            height={44}
            priority
            className="h-9 lg:h-11 w-auto"
          />
        </a>

        <ul className="hidden lg:flex items-center gap-6">
          {anchors.map((a) => (
            <li key={a.href}>
              <a href={a.href} className="text-sm font-outfit text-ink hover:text-teal transition-colors">
                {a.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/psicologia-adultos"
            locale={altLocale}
            className="text-xs font-semibold uppercase text-gray hover:text-teal transition-colors"
            aria-label={altLocale === 'ca' ? 'Català' : 'Castellano'}
          >
            {altLocale}
          </Link>
          <a
            href="tel:+34932434835"
            className="hidden sm:inline-flex text-sm font-semibold text-teal hover:underline"
          >
            93 243 48 35
          </a>
          <a href="#reserva" className="btn-primary px-4 py-2 text-sm">
            {t('header_book')}
          </a>
        </div>
      </nav>
    </header>
  );
}
