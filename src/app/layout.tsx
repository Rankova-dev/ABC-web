import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://abccentre.es'),
  title: {
    template: '%s | ABC Centre Barcelona',
    default: 'ABC Centre — Logopedia, Psicología y Neuropsicología en Barcelona',
  },
  description:
    'Centro multidisciplinar de logopedia, psicología, neuropsicología y psicopedagogia en Barcelona. Atención para niños, jóvenes y adultos desde 1999.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'ABC Centre',
    images: [{ url: '/logos/logo-horizontal-white.jpg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logos/ABC-sin-servicios-transparente.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
