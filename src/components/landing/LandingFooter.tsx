import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { BUSINESS } from '@/config/business';

/** Pie mínimo de la landing: contacto, enlaces legales y salida a la web */
export default function LandingFooter() {
  const t = useTranslations('landing_psicologia');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/70 pt-12 pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-3">
        <div>
          <Image
            src="/logos/logo-simple.png"
            alt="ABC Centre"
            width={120}
            height={48}
            className="h-10 w-auto mb-4 brightness-0 invert"
          />
          <p className="text-sm font-light leading-relaxed">{t('footer_tagline')}</p>
        </div>

        <div className="text-sm font-light space-y-2">
          <a href={BUSINESS.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-white">
            {BUSINESS.streetAddress}, {BUSINESS.postalCode} {BUSINESS.city}
          </a>
          <a href="tel:+34932434835" className="block hover:text-white">93 243 48 35</a>
          <a href="https://wa.me/34634545308" target="_blank" rel="noopener noreferrer" className="block hover:text-white">
            WhatsApp 634 54 53 08
          </a>
          <a href="mailto:info@abccentre.es" className="block hover:text-white">info@abccentre.es</a>
        </div>

        <div className="text-sm font-light space-y-2">
          <Link href="/" className="block font-semibold text-lime hover:underline">
            {t('footer_main_site')} →
          </Link>
          <Link href="/condiciones-de-contratacion" className="block hover:text-white">{t('footer_conditions')}</Link>
          <Link href="/aviso-legal" className="block hover:text-white">{t('footer_legal')}</Link>
          <Link href="/politica-de-privacidad" className="block hover:text-white">{t('footer_privacy')}</Link>
          <Link href="/politica-de-cookies" className="block hover:text-white">{t('footer_cookies')}</Link>
        </div>
      </div>
      <p className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-xs text-white/40">
        © {year} ABC Centre
      </p>
    </footer>
  );
}
