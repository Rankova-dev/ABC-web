import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services_page' });
  return {
    title: t('h1') + ' | ABC Centre Barcelona',
    description: t('subtitle'),
  };
}

const CHILDREN_SERVICES = [
  { key: 'logopedia',          href: '/logopedia' as const,          desc: 'Habla, lenguaje, voz y deglución' },
  { key: 'psicologia',         href: '/psicologia' as const,         desc: 'Apoyo emocional y conductual' },
  { key: 'psicopedagogia',     href: '/psicopedagogia' as const,     desc: 'Dificultades de aprendizaje' },
  { key: 'tea',                href: '/tea' as const,                 desc: 'Intervención en autismo' },
  { key: 'habilidades_sociales', href: '/habilidades-sociales' as const, desc: 'Grupos terapéuticos' },
];

const ADULTS_SERVICES = [
  { key: 'psicologia',         href: '/psicologia' as const,         desc: 'Ansiedad, depresión, relaciones' },
  { key: 'neuropsicologia',    href: '/neuropsicologia' as const,     desc: 'Evaluación y rehabilitación cognitiva' },
  { key: 'terapia_familiar',   href: '/terapia-familiar' as const,   desc: 'Familia y pareja' },
  { key: 'rehabilitacion_voz', href: '/rehabilitacion-voz' as const, desc: 'Disfonías y trastornos vocales' },
  { key: 'logopedia',          href: '/logopedia' as const,          desc: 'Afasia, voz, fluencia' },
  { key: 'salut',              href: '/salut' as const,              desc: 'Prevención y bienestar' },
];

export default function ServiciosPage() {
  const t = useTranslations('services_page');
  const tNav = useTranslations('nav');

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-display font-outfit font-semibold text-ink mb-4">{t('h1')}</h1>
          <p className="text-lg font-outfit font-light text-gray max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Children services */}
      <section id="ninos" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8 animate-on-scroll">{t('children_section')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHILDREN_SERVICES.map((s, i) => (
              <Link
                key={`${s.key}-${i}`}
                href={s.href}
                className="animate-on-scroll card group border-l-4 border-teal hover:-translate-y-1"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <h3 className="font-outfit font-semibold text-ink group-hover:text-teal transition-colors mb-1">
                  {tNav(`services_menu.${s.key}`)}
                </h3>
                <p className="text-sm font-light text-gray">{s.desc}</p>
                <span className="text-teal text-xs font-semibold mt-4 block">Ver servicio →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Adults services — teaser linking to the dedicated adults landing */}
      <section id="adultos" className="py-16 bg-cream scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-4 animate-on-scroll">{t('adults_section')}</h2>
          <p className="text-base font-outfit font-light text-gray max-w-2xl mb-8 animate-on-scroll">
            Psicología, logopedia, neuropsicología, terapia familiar y rehabilitación de voz para adultos, en un espacio pensado para ti.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {ADULTS_SERVICES.map((s) => (
              <span key={s.key} className="tag">{tNav(`services_menu.${s.key}`)}</span>
            ))}
          </div>
          <Link href="/servicios-adultos" className="btn-primary animate-on-scroll">
            Ver servicios para adultos →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-h2 font-outfit font-semibold text-white mb-4 animate-on-scroll">
            ¿No sabes qué servicio necesitas?
          </h2>
          <p className="text-white/70 font-light mb-8 animate-on-scroll">
            Cuéntanos tu situación y te orientamos sin compromiso.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-lime text-ink font-outfit font-semibold rounded-xl hover:bg-lime-dark transition-all animate-on-scroll"
          >
            Consultar gratis →
          </Link>
        </div>
      </section>
    </>
  );
}
