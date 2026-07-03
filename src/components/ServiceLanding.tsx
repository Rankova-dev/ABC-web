import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import BookingForm from './BookingForm';
import type { Service } from '@/lib/google-calendar';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

interface Props {
  namespace: string;
  service: Service;
  tags?: string[];
  teamMembers?: TeamMember[];
  schema?: Record<string, unknown>;
}

const ALL_TEAM: Record<string, { role: string; initials: string }> = {
  'Celia Cruz':      { role: 'Codirectora · Logopeda',                          initials: 'CC' },
  'Laia Álvarez':    { role: 'Codirectora · Psicóloga Gral. Sanitaria · Neuropsicóloga', initials: 'LA' },
  'Maria Andrés':    { role: 'Psicóloga',                                        initials: 'MA' },
  'Laia Lahoz':      { role: 'Logopeda',                                         initials: 'LL' },
  'Vanessa de Pedro':{ role: 'Logopeda',                                         initials: 'VP' },
  'Mª del Mar Aránega':{ role: 'Psicóloga',                                     initials: 'MM' },
  'Margot Moreno':   { role: 'Psicóloga',                                        initials: 'MR' },
  'Noelia Torres':   { role: 'Logopeda',                                         initials: 'NT' },
  'Silvia Marcó':    { role: 'Psicóloga · Neuropsicóloga',                       initials: 'SM' },
  'Eulàlia Marquez': { role: 'Psicóloga Gral. Sanitaria',                        initials: 'EM' },
  'Carla López':     { role: 'Psicopedagoga',                                    initials: 'CL' },
};

export default function ServiceLanding({ namespace, service, tags = [], schema }: Props) {
  const t = useTranslations(namespace as never);
  const tCommon = useTranslations('common');

  const memberNames: string[] = t.raw('team_members') as string[];
  const childrenItems: string[] = t.raw('children_items') as string[];
  const adultsItems: string[] = t.raw('adults_items') as string[];
  const faqItems: { q: string; a: string }[] = t.raw('faq') as { q: string; a: string }[];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-cream pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/servicios" className="inline-flex items-center gap-1 text-sm font-light text-gray hover:text-teal transition-colors mb-6">
            ← {tCommon('see_all_services')}
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          <h1 className="text-display font-outfit font-semibold text-ink leading-tight mb-4">
            {t('h1')}
          </h1>
          <p className="text-lg font-outfit font-light text-gray leading-relaxed max-w-2xl mb-8">
            {t('subtitle')}
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#booking" className="btn-primary">
              {tCommon('book_cta')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="https://wa.me/34634545308"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── WHAT IS IT ───────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('what_title')}</h2>
          <p className="text-base font-outfit font-light text-gray leading-relaxed max-w-2xl animate-on-scroll">
            {t('what_body')}
          </p>
        </div>
      </section>

      {/* ── FOR WHOM ─────────────────────────────────────────── */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Children section */}
            <div className="animate-on-scroll">
              <h2 className="font-outfit font-semibold text-xl text-ink mb-4">{t('children_title')}</h2>
              <ul className="space-y-3">
                {childrenItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal block" />
                    </span>
                    <span className="text-sm font-light text-gray">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Adults section */}
            <div className="animate-on-scroll">
              <h2 className="font-outfit font-semibold text-xl text-ink mb-4">{t('adults_title')}</h2>
              <ul className="space-y-3">
                {adultsItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-lime/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-dark block" />
                    </span>
                    <span className="text-sm font-light text-gray">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── APPROACH ─────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('approach_title')}</h2>
          <p className="text-base font-outfit font-light text-gray leading-relaxed max-w-2xl animate-on-scroll">
            {t('approach_body')}
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-16 bg-teal/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{tCommon('how_it_works')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              { num: '01', label: tCommon('step1') },
              { num: '02', label: tCommon('step2') },
              { num: '03', label: tCommon('step3') },
              { num: '04', label: tCommon('step4') },
            ].map((step, i) => (
              <div
                key={step.num}
                className="animate-on-scroll text-center card"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-semibold text-teal">{step.num}</span>
                </div>
                <p className="text-sm font-outfit font-semibold text-ink">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{tCommon('our_team')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {memberNames.map((name, i) => {
              const info = ALL_TEAM[name];
              return (
                <div
                  key={name}
                  className="animate-on-scroll card text-center"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-3">
                    <span className="font-outfit font-semibold text-sm text-teal">{info?.initials ?? name.slice(0, 2)}</span>
                  </div>
                  <p className="text-sm font-semibold text-ink mb-1">{name}</p>
                  <p className="text-xs font-light text-gray leading-snug">{info?.role}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 animate-on-scroll">
            <Link href="/equipo" className="btn-ghost px-0">
              {tCommon('see_all_services')} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{tCommon('faq_title')}</h2>
          <div className="space-y-4 mt-8">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="animate-on-scroll bg-white rounded-2xl px-6 py-5 shadow-card group"
              >
                <summary className="font-outfit font-semibold text-ink cursor-pointer list-none flex justify-between items-center gap-4">
                  {item.q}
                  <svg className="w-5 h-5 text-teal flex-shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-sm font-light text-gray leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING FORM ─────────────────────────────────────── */}
      <section id="booking" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-on-scroll">
            <h2 className="section-title">{tCommon('book_section_title')}</h2>
            <p className="section-subtitle mx-auto">{tCommon('book_section_body')}</p>
          </div>

          <div className="card animate-on-scroll">
            <BookingForm defaultService={service} />
          </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-center animate-on-scroll">
            <a href="tel:+34932434835" className="flex items-center gap-2 text-sm font-semibold text-teal hover:underline">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              93 243 48 35
            </a>
            <a href="mailto:info@abccentre.es" className="flex items-center gap-2 text-sm font-semibold text-teal hover:underline">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              info@abccentre.es
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
