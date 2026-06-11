'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const SERVICES = [
  { key: 'logopedia',          href: '/logopedia' },
  { key: 'psicologia',         href: '/psicologia' },
  { key: 'neuropsicologia',    href: '/neuropsicologia' },
  { key: 'psicopedagogia',     href: '/psicopedagogia' },
  { key: 'tea',                href: '/tea' },
  { key: 'rehabilitacion_voz', href: '/rehabilitacion-voz' },
  { key: 'terapia_familiar',   href: '/terapia-familiar' },
  { key: 'habilidades_sociales', href: '/habilidades-sociales' },
] as const;

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const altLocale = locale === 'es' ? 'ca' : 'es';

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 btn-primary">
        Saltar al contenido
      </a>

      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-card' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" aria-label="ABC Centre — Inicio">
            <Image
              src="/logos/logo-horizontal.png"
              alt="ABC Centre"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">

            {/* Services dropdown */}
            <div className="relative" onMouseLeave={() => setServicesOpen(false)}>
              <button
                className="flex items-center gap-1 font-outfit font-semibold text-sm text-ink hover:text-teal transition-colors"
                onMouseEnter={() => setServicesOpen(true)}
                onClick={() => setServicesOpen(!servicesOpen)}
                aria-expanded={servicesOpen}
              >
                {t('services')}
                <svg className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64">
                <div className="bg-white rounded-2xl shadow-card-hover p-3 grid grid-cols-1 gap-1">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.key}
                      href={s.href}
                      className="block px-3 py-2 text-sm font-outfit text-ink hover:bg-cream hover:text-teal rounded-xl transition-colors"
                    >
                      {t(`services_menu.${s.key}`)}
                    </Link>
                  ))}
                  <div className="border-t border-cream mt-1 pt-1">
                    <Link
                      href="/servicios"
                      className="block px-3 py-2 text-sm font-outfit font-semibold text-teal hover:bg-teal/5 rounded-xl transition-colors"
                    >
                      Ver todos los servicios →
                    </Link>
                  </div>
                </div>
                </div>
              )}
            </div>

            <Link href="/equipo" className="font-outfit font-semibold text-sm text-ink hover:text-teal transition-colors">
              {t('team')}
            </Link>

            <Link href="/blog" className="font-outfit font-semibold text-sm text-ink hover:text-teal transition-colors">
              {t('blog')}
            </Link>

            <Link href="/galeria" className="font-outfit font-semibold text-sm text-ink hover:text-teal transition-colors">
              {t('gallery')}
            </Link>

            <Link href="/contacto" className="font-outfit font-semibold text-sm text-ink hover:text-teal transition-colors">
              {t('contact')}
            </Link>

            {/* Locale toggle */}
            <Link
              href={pathname}
              locale={altLocale}
              className="font-outfit text-xs font-semibold text-gray border border-gray/30 px-3 py-1 rounded-full hover:border-teal hover:text-teal transition-colors"
            >
              {t('locale_toggle')}
            </Link>

            <Link href="/contacto" className="btn-primary text-sm">
              {t('cta')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-cream transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-cream px-4 py-6 space-y-4">
            <p className="text-xs font-semibold text-gray uppercase tracking-widest mb-2">{t('services')}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {SERVICES.map((s) => (
                <Link
                  key={s.key}
                  href={s.href}
                  className="block px-3 py-2 text-sm font-outfit text-ink bg-cream hover:bg-teal/10 hover:text-teal rounded-xl transition-colors"
                >
                  {t(`services_menu.${s.key}`)}
                </Link>
              ))}
            </div>
            <Link href="/equipo" className="block py-2 font-outfit font-semibold text-ink hover:text-teal">
              {t('team')}
            </Link>
            <Link href="/blog" className="block py-2 font-outfit font-semibold text-ink hover:text-teal">
              {t('blog')}
            </Link>
            <Link href="/galeria" className="block py-2 font-outfit font-semibold text-ink hover:text-teal">
              {t('gallery')}
            </Link>
            <Link href="/contacto" className="block py-2 font-outfit font-semibold text-ink hover:text-teal">
              {t('contact')}
            </Link>
            <Link href={pathname} locale={altLocale} className="block py-2 font-outfit text-sm text-gray hover:text-teal">
              {t('locale_toggle')}
            </Link>
            <Link href="/contacto" className="btn-primary w-full justify-center mt-4">
              {t('cta')}
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
