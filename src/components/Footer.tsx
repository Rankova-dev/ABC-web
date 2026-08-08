import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const SERVICES = [
  { key: 'logopedia',            href: '/logopedia' as const },
  { key: 'psicologia',           href: '/psicologia' as const },
  { key: 'neuropsicologia',      href: '/neuropsicologia' as const },
  { key: 'psicopedagogia',       href: '/psicopedagogia' as const },
  { key: 'tea',                  href: '/tea' as const },
  { key: 'orientacion_familiar', href: '/orientacion-familiar' as const },
  { key: 'cursos_formacion',     href: '/cursos-formacion' as const },
  { key: 'salut',                href: '/salut' as const },
] as const;

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/logos/logo-horizontal.png"
              alt="ABC Centre"
              width={140}
              height={42}
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm font-light text-white/70 leading-relaxed mb-6">
              {t('tagline')}
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/abc_logopsico/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram ABC Centre"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/34634545308"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp ABC Centre"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase text-white/50 mb-4">
              {t('services_title')}
            </h3>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.key}>
                  <Link
                    href={s.href}
                    className="text-sm font-light text-white/70 hover:text-white transition-colors"
                  >
                    {tNav(`services_menu.${s.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase text-white/50 mb-4">
              {t('contact_title')}
            </h3>
            <address className="not-italic space-y-3">
              <p className="text-sm font-light text-white/70 whitespace-pre-line">{t('address')}</p>
              <a href="tel:+34932434835" className="block text-sm font-light text-white/70 hover:text-white transition-colors">
                93 243 48 35
              </a>
              <a href="tel:+34634545308" className="block text-sm font-light text-white/70 hover:text-white transition-colors">
                634 545 308
              </a>
              <a href="mailto:info@abccentre.es" className="block text-sm font-light text-white/70 hover:text-white transition-colors">
                info@abccentre.es
              </a>
              <div className="pt-1">
                <p className="text-sm font-light text-white/70">{t('hours')}</p>
                <p className="text-xs text-white/40">{t('hours_note')}</p>
              </div>
              <p className="text-xs text-white/40">{t('metro')}</p>
            </address>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase text-white/50 mb-4">
              {t('legal_title')}
            </h3>
            <ul className="space-y-2">
              <li><Link href="/politica-de-privacidad" className="text-sm font-light text-white/70 hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href="/aviso-legal" className="text-sm font-light text-white/70 hover:text-white transition-colors">{t('legal_notice')}</Link></li>
              <li><Link href="/politica-de-cookies" className="text-sm font-light text-white/70 hover:text-white transition-colors">{t('cookies')}</Link></li>
            </ul>
            <div className="mt-8">
              <a
                href="https://wa.me/34634545308"
                className="inline-flex items-center gap-2 text-sm font-semibold text-lime hover:text-lime-dark transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center">
          <p className="text-xs text-white/40">
            {t('copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
