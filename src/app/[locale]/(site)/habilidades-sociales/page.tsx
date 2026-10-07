import { getTranslations } from 'next-intl/server';
import ServiceLanding from '@/components/ServiceLanding';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'habilidades_sociales' });
  return { title: t('meta_title'), description: t('meta_desc') };
}

export default function HabilidadesSocialesPage() {
  return (
    <ServiceLanding
      namespace="habilidades_sociales"
      service="habilidades-sociales"
      tags={['Niños y jóvenes', 'Grupos terapéuticos']}
    />
  );
}
