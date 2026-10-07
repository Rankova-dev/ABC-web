import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import BookingForm from '@/components/BookingForm';
import type { BookingArea } from '@/components/BookingForm';
import GoogleReviews from '@/components/GoogleReviews';
import LandingBookButton from '@/components/landing/LandingBookButton';
import { getGoogleReviews } from '@/lib/google-reviews';
import {
  APPOINTMENT_TYPES,
  SPECIALISTS,
  getAppointmentTypeText,
} from '@/config/specialists';
import { LANDING_AREAS, TEAM_PHOTOS } from '@/config/landing-psicologia';
import type { LandingArea } from '@/config/landing-psicologia';

type Props = { params: Promise<{ locale: string }> };

const PATHS = { es: '/es/psicologia-adultos', ca: '/ca/psicologia-adults' } as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing_psicologia' });
  const path = locale === 'ca' ? PATHS.ca : PATHS.es;
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
    alternates: {
      canonical: `https://abccentre.es${path}`,
      languages: {
        es: `https://abccentre.es${PATHS.es}`,
        ca: `https://abccentre.es${PATHS.ca}`,
      },
    },
    openGraph: {
      title: t('meta_title'),
      description: t('meta_desc'),
      url: `https://abccentre.es${path}`,
      images: ['/images/equipo-abc.jpg'],
      locale: locale === 'ca' ? 'ca_ES' : 'es_ES',
      type: 'website',
    },
  };
}

function Check() {
  return (
    <span className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg className="w-3 h-3 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Check />
          <span className="text-sm font-light text-gray leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function LandingPsicologiaPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing_psicologia' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const reviews = await getGoogleReviews(locale);

  const arr = (key: string) => t.raw(key) as string[];
  const faq = t.raw('faq') as { q: string; a: string }[];
  const process = t.raw('process') as { title: string; body: string }[];

  const bookingAreas: BookingArea[] = LANDING_AREAS.map((a) => ({
    key:     a.key,
    label:   t(`areas.${a.key}.title`),
    desc:    t(`areas.${a.key}.desc`),
    icon:    a.icon,
    service: a.service,
    types:   a.types,
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: t('h1'),
    description: t('meta_desc'),
    url: `https://abccentre.es${locale === 'ca' ? PATHS.ca : PATHS.es}`,
    about: { '@type': 'MedicalBusiness', name: 'ABC Centre' },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  /** Equipo de la sección + botón de reserva del área */
  function AreaTeam({ area }: { area: LandingArea }) {
    return (
      <div className="mt-12 animate-on-scroll">
        <h3 className="text-sm font-semibold text-gray uppercase tracking-wider mb-4">{t('team_title')}</h3>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          {area.team.map((id) => {
            const member = SPECIALISTS[id];
            const photo = TEAM_PHOTOS[id];
            return (
              <div key={id} className="flex items-center gap-3">
                {photo ? (
                  <Image
                    src={photo}
                    alt={member.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover object-top"
                  />
                ) : (
                  <span className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center font-semibold text-teal">
                    {member.initials}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-ink">{member.name}</p>
                  <p className="text-xs font-light text-gray">{member.role.split('·')[0].trim()}</p>
                </div>
              </div>
            );
          })}
        </div>
        <LandingBookButton area={area.key} className="btn-primary mt-8">
          {t('book')} · {t(`areas.${area.key}.title`)}
        </LandingBookButton>
      </div>
    );
  }

  const areaByKey = Object.fromEntries(LANDING_AREAS.map((a) => [a.key, a])) as Record<
    LandingArea['key'],
    LandingArea
  >;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="top" className="bg-cream pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="tag mb-4 inline-block">{t('hero_tag')}</span>
            <h1 className="text-display font-outfit font-semibold text-ink leading-tight mb-5">{t('h1')}</h1>
            <p className="text-lg font-outfit font-light text-gray leading-relaxed mb-8">{t('subtitle')}</p>
            <div className="flex flex-wrap gap-4 mb-8">
              <a href="#reserva" className="btn-primary">
                {t('hero_cta')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#tarifas" className="btn-secondary">{t('hero_prices')}</a>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {arr('trust').map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card">
            <Image
              src="/images/equipo-abc.jpg"
              alt="Equipo de ABC Centre"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── ÁREAS ────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center animate-on-scroll">{t('areas_title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {LANDING_AREAS.map((a, i) => (
              <a
                key={a.key}
                href={`#${a.key}`}
                className="animate-on-scroll card group border-t-4 border-lime hover:-translate-y-1 transition-transform"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <h3 className="font-outfit font-semibold text-ink group-hover:text-teal transition-colors mb-2">
                  {t(`areas.${a.key}.title`)}
                </h3>
                <p className="text-sm font-light text-gray leading-relaxed">{t(`areas.${a.key}.desc`)}</p>
                <span className="text-teal text-xs font-semibold mt-4 block">{t('see_more')} →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PSICOLOGÍA DE ADULTOS ────────────────────────────── */}
      <section id="adultos" className="py-20 bg-cream scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('adults_title')}</h2>
          <div className="grid lg:grid-cols-2 gap-12 mt-6">
            <div className="animate-on-scroll">
              <p className="text-base font-light text-gray leading-relaxed mb-8">{t('adults_intro')}</p>
              <h3 className="font-outfit font-semibold text-ink mb-4">{t('adults_items_title')}</h3>
              <List items={arr('adults_items')} />
            </div>
            <div className="animate-on-scroll">
              <h3 className="font-outfit font-semibold text-ink mb-4">{t('process_title')}</h3>
              <ol className="space-y-4">
                {process.map((step, i) => (
                  <li key={step.title} className="card flex gap-4 items-start">
                    <span className="w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-outfit font-semibold text-ink">{step.title}</p>
                      <p className="text-sm font-light text-gray">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <AreaTeam area={areaByKey.adultos} />
        </div>
      </section>

      {/* ── PSICOLOGÍA ONLINE ────────────────────────────────── */}
      <section id="online" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('online_title')}</h2>
          <div className="grid lg:grid-cols-2 gap-12 mt-6 items-start">
            <p className="text-base font-light text-gray leading-relaxed animate-on-scroll">{t('online_intro')}</p>
            <div className="bg-teal/5 rounded-2xl p-6 animate-on-scroll">
              <List items={arr('online_points')} />
            </div>
          </div>
          <AreaTeam area={areaByKey.online} />
        </div>
      </section>

      {/* ── TERAPIA FAMILIAR Y DE PAREJA ─────────────────────── */}
      <section id="familia" className="py-20 bg-cream scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('family_title')}</h2>
          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            <article className="card animate-on-scroll">
              <h3 className="font-outfit font-semibold text-xl text-ink mb-3">{t('family_therapy_title')}</h3>
              <p className="text-sm font-light text-gray leading-relaxed mb-4">{t('family_therapy_intro')}</p>
              <p className="text-sm font-light text-gray leading-relaxed mb-4">{t('family_therapy_when_intro')}</p>
              <List items={arr('family_therapy_when')} />
              <p className="text-sm font-light text-gray leading-relaxed mt-5 bg-cream rounded-xl px-4 py-3">
                {t('family_therapy_note')}
              </p>
              <h4 className="font-outfit font-semibold text-ink mt-6 mb-3">{t('family_benefits_title')}</h4>
              <ol className="space-y-2">
                {arr('family_benefits').map((b, i) => (
                  <li key={b} className="flex gap-3 text-sm font-light text-gray">
                    <span className="font-semibold text-teal">{i + 1}.</span>
                    {b}
                  </li>
                ))}
              </ol>
            </article>
            <article className="card animate-on-scroll">
              <h3 className="font-outfit font-semibold text-xl text-ink mb-3">{t('couple_title')}</h3>
              <p className="text-sm font-light text-gray leading-relaxed mb-4">{t('couple_intro')}</p>
              <p className="text-sm font-light text-gray leading-relaxed mb-4">{t('couple_when_intro')}</p>
              <List items={arr('couple_when')} />
              <p className="text-sm font-light text-gray leading-relaxed mt-5 bg-cream rounded-xl px-4 py-3">
                {t('couple_note')}
              </p>
            </article>
          </div>
          <AreaTeam area={areaByKey.familia} />
        </div>
      </section>

      {/* ── ASESORAMIENTO A PADRES ───────────────────────────── */}
      <section id="padres" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('parents_title')}</h2>
          <div className="grid lg:grid-cols-2 gap-12 mt-6">
            <div className="animate-on-scroll space-y-4">
              <p className="text-base font-light text-gray leading-relaxed">{t('parents_intro')}</p>
              <p className="text-base font-light text-gray leading-relaxed">{t('parents_intro2')}</p>
            </div>
            <div className="animate-on-scroll">
              <h3 className="font-outfit font-semibold text-ink mb-4">{t('parents_help_title')}</h3>
              <List items={arr('parents_help')} />
            </div>
          </div>
          <AreaTeam area={areaByKey.padres} />
        </div>
      </section>

      {/* ── TARIFAS ──────────────────────────────────────────── */}
      <section id="tarifas" className="py-20 bg-teal/5 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="section-title animate-on-scroll">{t('pricing_title')}</h2>
            <p className="text-sm font-light text-gray leading-relaxed animate-on-scroll">
              {t('pricing_body')}{' '}
              <Link href="/condiciones-de-contratacion" className="text-teal underline underline-offset-2">
                {t('pricing_conditions')}
              </Link>
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {LANDING_AREAS.map((a) => (
              <div key={a.key} className="card animate-on-scroll">
                <h3 className="font-outfit font-semibold text-lg text-ink mb-4">{t(`areas.${a.key}.title`)}</h3>
                <ul className="divide-y divide-gray/10">
                  {a.types.map((type) => {
                    const cfg = APPOINTMENT_TYPES[type];
                    const text = getAppointmentTypeText(type, locale);
                    return (
                      <li key={type} className="py-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink">
                            {text.label}
                            {cfg.onlineOnly && (
                              <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wider bg-lime/30 text-ink rounded-full px-2 py-0.5">
                                {t('pricing_online_badge')}
                              </span>
                            )}
                          </p>
                          <p className="text-xs font-light text-gray">{text.detail}</p>
                        </div>
                        <span className="font-outfit font-semibold text-xl text-teal whitespace-nowrap">{cfg.price} €</span>
                        <LandingBookButton
                          area={a.key}
                          type={type}
                          className="text-xs font-semibold text-white bg-teal hover:bg-teal-dark rounded-lg px-3 py-2 transition-colors whitespace-nowrap"
                        >
                          {t('book')}
                        </LandingBookButton>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEÑAS ──────────────────────────────────────────── */}
      {reviews && <GoogleReviews data={reviews} />}

      {/* ── RESERVA ──────────────────────────────────────────── */}
      <section id="reserva" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-on-scroll">
            <h2 className="section-title">{t('booking_title')}</h2>
            <p className="section-subtitle mx-auto">{t('booking_body')}</p>
          </div>
          <div className="card">
            <BookingForm areas={bookingAreas} optionalPayment />
          </div>
          <div className="mt-6 flex flex-wrap gap-6 justify-center">
            <a href="tel:+34932434835" className="text-sm font-semibold text-teal hover:underline">93 243 48 35</a>
            <a href="https://wa.me/34634545308" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-teal hover:underline">
              WhatsApp
            </a>
            <a href="mailto:info@abccentre.es" className="text-sm font-semibold text-teal hover:underline">info@abccentre.es</a>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{tCommon('faq_title')}</h2>
          <div className="space-y-4 mt-8">
            {faq.map((item) => (
              <details key={item.q} className="animate-on-scroll bg-white rounded-2xl px-6 py-5 shadow-card group">
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

      {/* ── CTA fija en móvil ────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray/10 px-4 py-3 flex gap-3">
        <a href="tel:+34932434835" className="btn-secondary flex-1 justify-center py-2.5 text-sm">
          {t('header_call')}
        </a>
        <a href="#reserva" className="btn-primary flex-1 justify-center py-2.5 text-sm">
          {t('hero_cta')}
        </a>
      </div>
    </>
  );
}
