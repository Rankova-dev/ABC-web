import { getTranslations } from 'next-intl/server';
import ServiceLanding from '@/components/ServiceLanding';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'salut' });
  return { title: t('meta_title'), description: t('meta_desc') };
}

export default function SalutPage() {
  return (
    <ServiceLanding
      namespace="salut"
      service="salut"
      tags={['Adultos', 'Prevención', 'Bienestar', 'Salud mental']}
    />
  );
}
