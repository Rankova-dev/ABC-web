import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';

/**
 * Landings de campaña: misma web y mismo dominio, pero con cabecera y pie
 * propios y sin el menú general ni los botones flotantes de la web.
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LandingHeader />
      <main id="main-content">{children}</main>
      <LandingFooter />
    </>
  );
}
