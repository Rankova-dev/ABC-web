import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'equipo' });
  return { title: t('meta_title'), description: t('meta_desc') };
}

const DIRECTORS = [
  {
    name: 'Celia Cruz',
    role: 'Codirectora · Logopeda',
    specialty: 'Logopedia infantil y adultos, TEA, voz',
    initials: 'CC',
    color: 'bg-teal',
  },
  {
    name: 'Laia Álvarez',
    role: 'Codirectora · Psicóloga Gral. Sanitaria · Neuropsicóloga',
    specialty: 'Psicología clínica, neuropsicología, TEA',
    initials: 'LA',
    color: 'bg-teal',
  },
];

const TEAM = [
  { name: 'Maria Andrés',       role: 'Psicóloga',                              specialty: 'Psicología infantil, terapia familiar',       initials: 'MA' },
  { name: 'Laia Lahoz',         role: 'Logopeda',                               specialty: 'Logopedia infantil, TEA, estimulación temprana', initials: 'LL' },
  { name: 'Vanessa de Pedro',   role: 'Logopeda',                               specialty: 'Logopedia infantil y adultos',                  initials: 'VP' },
  { name: 'Mª del Mar Aránega', role: 'Psicóloga',                              specialty: 'Psicología infantil, juvenil y adultos',        initials: 'MM' },
  { name: 'Margot Moreno',      role: 'Psicóloga',                              specialty: 'Terapia de adultos y pareja',                   initials: 'MR' },
  { name: 'Noelia Torres',      role: 'Logopeda',                               specialty: 'Logopedia infantil, voz',                      initials: 'NT' },
  { name: 'Silvia Marcó',       role: 'Psicóloga · Neuropsicóloga',             specialty: 'Neuropsicología infantil y adultos',            initials: 'SM' },
  { name: 'Eulàlia Marquez',    role: 'Psicóloga Gral. Sanitaria',              specialty: 'Psicología adultos',                           initials: 'EM' },
  { name: 'Sara Reyes',         role: 'Psicóloga · Neuropsicóloga',             specialty: 'Neuropsicología, evaluación cognitiva',        initials: 'SR' },
  { name: 'Carla López',        role: 'Psicopedagoga',                          specialty: 'Dificultades aprendizaje, dislexia, TDAH',     initials: 'CL' },
];

const DISCIPLINES = [
  { name: 'Logopedia',       count: 4, color: 'bg-teal/10 text-teal border-teal/20' },
  { name: 'Psicología',      count: 6, color: 'bg-lime/20 text-ink border-lime/30' },
  { name: 'Neuropsicología', count: 3, color: 'bg-teal/10 text-teal border-teal/20' },
  { name: 'Psicopedagogia',  count: 1, color: 'bg-lime/20 text-ink border-lime/30' },
];

export default function EquipoPage() {
  const t = useTranslations('equipo');

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label">ABC Centre</p>
          <h1 className="text-display font-outfit font-semibold text-ink mb-4">{t('h1')}</h1>
          <p className="text-lg font-outfit font-light text-gray max-w-2xl mx-auto mb-6">{t('subtitle')}</p>

          {/* Disciplines summary */}
          <div className="flex flex-wrap justify-center gap-3">
            {DISCIPLINES.map((d) => (
              <span key={d.name} className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${d.color}`}>
                {d.name} · {d.count}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base font-outfit font-light text-gray leading-relaxed animate-on-scroll">{t('intro')}</p>
        </div>
      </section>

      {/* Directors */}
      <section className="py-12 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('directors_title')}</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {DIRECTORS.map((member, i) => (
              <div
                key={member.name}
                className="animate-on-scroll card flex gap-5 items-start border-t-4 border-teal"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl ${member.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="font-outfit font-semibold text-xl text-white">{member.initials}</span>
                </div>
                <div>
                  <h3 className="font-outfit font-semibold text-ink text-lg mb-0.5">{member.name}</h3>
                  <p className="text-sm font-semibold text-teal mb-2">{member.role}</p>
                  <p className="text-sm font-light text-gray">{member.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('team_title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="animate-on-scroll card flex gap-4 items-start"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-outfit font-semibold text-sm text-teal">{member.initials}</span>
                </div>
                <div>
                  <h3 className="font-outfit font-semibold text-ink text-sm mb-0.5">{member.name}</h3>
                  <p className="text-xs font-semibold text-teal mb-1">{member.role}</p>
                  <p className="text-xs font-light text-gray leading-snug">{member.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-teal text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-h2 font-outfit font-semibold text-white mb-4 animate-on-scroll">
            {t('join_title')}
          </h2>
          <p className="text-white/70 font-light mb-8 animate-on-scroll">
            {t('join_body')}
          </p>
          <a
            href="mailto:info@abccentre.es?subject=Candidatura%20espontanea"
            className="inline-flex items-center gap-2 px-8 py-4 bg-lime text-ink font-outfit font-semibold rounded-xl hover:bg-lime-dark transition-all animate-on-scroll"
          >
            {t('join_cta')}
          </a>
        </div>
      </section>
    </>
  );
}
