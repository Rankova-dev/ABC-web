import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ScrollAnimator from '@/components/ScrollAnimator';
import ScrollProgress from '@/components/ScrollProgress';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = {
    canonical: `https://abccentre.es/${locale}`,
    languages: {
      'es': 'https://abccentre.es/es',
      'ca': 'https://abccentre.es/ca',
    },
  };
  return { alternates };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Lo común a toda la web: idioma, mensajes y animaciones de scroll.
 *
 * La cabecera, el pie y los botones flotantes viven en el layout de cada grupo
 * de rutas: `(site)` es la web de siempre y `(landing)` son las landings de
 * campaña, que van con su propia cabecera mínima y sin el menú general.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'es' | 'ca')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ScrollProgress />
      {children}
      <ScrollAnimator />
    </NextIntlClientProvider>
  );
}
