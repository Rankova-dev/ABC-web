import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import TeamCard from '@/components/TeamCard';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'equipo' });
  return { title: t('meta_title'), description: t('meta_desc') };
}

const DIRECTORS = [
  { key: 'celia_cruz',   name: 'Celia Cruz',    initials: 'CC', color: 'bg-teal', photo: '/images/equipo/celia-cruz.webp' },
  { key: 'laia_alvarez', name: 'Laia Álvarez',  initials: 'LA', color: 'bg-teal', photo: '/images/equipo/laia-alvarez.webp' },
];

const TEAM = [
  { key: 'laia_lahoz',      name: 'Laia Lahoz',           initials: 'LL', photo: '/images/equipo/laia-lahoz.webp' },
  { key: 'vanessa_de_pedro', name: 'Vanessa de Pedro',    initials: 'VP', photo: '/images/equipo/vanessa-de-pedro.webp' },
  { key: 'noelia_torres',   name: 'Noelia Torres',        initials: 'NT', photo: '/images/equipo/noelia-torres.webp' },
  { key: 'maria_andres',    name: 'María Andrés',         initials: 'MA', photo: '/images/equipo/maria-andres.webp' },
  { key: 'mar_aranega',     name: 'Maria del Mar Aránega', initials: 'MM', photo: '/images/equipo/mar-aranega.webp' },
  { key: 'margot_moreno',   name: 'Margot Moreno',        initials: 'MR', photo: '/images/equipo/margot-moreno.webp' },
  { key: 'silvia_marco',    name: 'Silvia Marcó',         initials: 'SM', photo: '/images/equipo/silvia-marco.webp' },
  { key: 'eulalia_marquez', name: 'Eulàlia Márquez',      initials: 'EM', photo: '/images/equipo/eulalia-marquez.webp' },
  { key: 'carla_lopez',     name: 'Carla López',          initials: 'CL', photo: '/images/equipo/carla-lopez.webp' },
  { key: 'raisa_pocino',    name: 'Raisa Pocino',         initials: 'RP', photo: '/images/equipo/raisa-pocino.webp' },
  { key: 'elia_huertas',    name: 'Elia Huertas',         initials: 'EH', photo: '/images/equipo/elia-huertas.webp' },
];

const DISCIPLINES = [
  { name: 'Logopedia',       count: 4,  color: 'bg-teal/10 text-teal border-teal/20' },
  { name: 'Psicología',      count: 7,  color: 'bg-lime/20 text-ink border-lime/30' },
  { name: 'Neuropsicología', count: 3,  color: 'bg-teal/10 text-teal border-teal/20' },
  { name: 'Psicopedagogia',  count: 1,  color: 'bg-lime/20 text-ink border-lime/30' },
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
              <div key={member.key} className="animate-on-scroll" style={{ animationDelay: `${i * 100}ms` }}>
                <TeamCard
                  name={member.name}
                  role={t(`members.${member.key}.role`)}
                  specialty={t(`members.${member.key}.specialty`)}
                  initials={member.initials}
                  bio={t.has(`members.${member.key}.bio`) ? t(`members.${member.key}.bio`) : undefined}
                  color={member.color}
                  photo={member.photo}
                  large
                />
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
              <div key={member.key} className="animate-on-scroll" style={{ animationDelay: `${i * 60}ms` }}>
                <TeamCard
                  name={member.name}
                  role={t(`members.${member.key}.role`)}
                  specialty={t(`members.${member.key}.specialty`)}
                  initials={member.initials}
                  bio={t.has(`members.${member.key}.bio`) ? t(`members.${member.key}.bio`) : undefined}
                  photo={member.photo}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section id="unete" className="py-16 bg-teal text-center">
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
