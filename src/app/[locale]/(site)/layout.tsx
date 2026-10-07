import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import LoadingScreen from '@/components/LoadingScreen';

/** La web general: menú completo, pie y botones flotantes de contacto */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main id="main-content" className="pb-16 lg:pb-0">{children}</main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
