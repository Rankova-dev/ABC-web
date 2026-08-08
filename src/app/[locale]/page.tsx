import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  MessageCircle, Brain, Activity, BookOpen, Sparkles,
  Users, GraduationCap, Heart, Calendar, MapPin,
} from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: 'ABC Centre — Logopedia, Psicología y Neuropsicología en Barcelona',
    description: t('hero_subtitle'),
  };
}

const SERVICES: { key: string; href: '/logopedia' | '/psicologia' | '/neuropsicologia' | '/psicopedagogia' | '/tea' | '/orientacion-familiar' | '/cursos-formacion' | '/salut'; icon: ReactNode; color: string }[] = [
  { key: 'logopedia',            href: '/logopedia',            icon: <MessageCircle className="w-6 h-6" />, color: 'border-teal' },
  { key: 'psicologia',           href: '/psicologia',           icon: <Brain className="w-6 h-6" />,         color: 'border-teal' },
  { key: 'neuropsicologia',      href: '/neuropsicologia',      icon: <Activity className="w-6 h-6" />,      color: 'border-lime' },
  { key: 'psicopedagogia',       href: '/psicopedagogia',       icon: <BookOpen className="w-6 h-6" />,      color: 'border-teal' },
  { key: 'tea',                  href: '/tea',                  icon: <Sparkles className="w-6 h-6" />,      color: 'border-lime' },
  { key: 'orientacion_familiar', href: '/orientacion-familiar', icon: <Users className="w-6 h-6" />,         color: 'border-teal' },
  { key: 'cursos_formacion',     href: '/cursos-formacion',     icon: <GraduationCap className="w-6 h-6" />, color: 'border-lime' },
  { key: 'salut',                href: '/salut',                icon: <Heart className="w-6 h-6" />,          color: 'border-teal' },
];

const TEAM = [
  { name: 'Celia Cruz',   role: 'Codirectora · Logopeda',                             initials: 'CC', photo: '/images/equipo/celia-cruz.webp' },
  { name: 'Laia Álvarez', role: 'Codirectora · Psicóloga General Sanitaria · Neuropsicóloga', initials: 'LA', photo: '/images/equipo/laia-alvarez.webp' },
  { name: 'Silvia Marcó', role: 'Psicóloga · Neuropsicóloga',                          initials: 'SM', photo: '/images/equipo/silvia-marco.webp' },
  { name: 'Carla López',  role: 'Psicopedagoga',                                       initials: 'CL', photo: '/images/equipo/carla-lopez.webp' },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'ABC Centre de Logopèdia, Psicologia, Psicopedagogia i Neuropsicologia',
  description: 'Centro multidisciplinar de logopedia, psicología, neuropsicología y psicopedagogia en Nou Barris, Barcelona. Desde 1999.',
  url: 'https://abccentre.es',
  telephone: ['+34932434835', '+34634545308'],
  email: 'info@abccentre.es',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Carrer de Malgrat, 47',
    addressLocality: 'Barcelona',
    postalCode: '08016',
    addressCountry: 'ES',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 41.4469, longitude: 2.1764 },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '20:00',
  }],
  medicalSpecialty: ['Logopedia', 'Psicología', 'Neuropsicología', 'Psicopedagogia'],
  foundingDate: '1999',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 12 },
  sameAs: ['https://www.instagram.com/abc_logopsico/'],
};

export default function HomePage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-cream pt-20">
        {/* Background accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-teal/5" />
          <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-lime/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-teal bg-teal/10 px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />
              {t('hero_badge')}
            </span>

            <h1 className="text-display font-outfit font-semibold text-ink leading-tight mb-6">
              {t('hero_h1')}
            </h1>

            <p className="text-lg font-outfit font-light text-gray leading-relaxed mb-8 max-w-lg">
              {t('hero_subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href={{ pathname: '/servicios', hash: 'adultos' }} className="btn-primary text-base px-8 py-4">
                {t('hero_cta_primary')}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href={{ pathname: '/servicios', hash: 'ninos' }} className="btn-secondary text-base px-8 py-4">
                {t('hero_cta_secondary')}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { num: '26', label: t('hero_stat_years') },
                { num: '12', label: t('hero_stat_specialists') },
                { num: '8',  label: t('hero_stat_disciplines') },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-outfit font-semibold text-teal leading-none">{s.num}</p>
                  <p className="text-xs font-light text-gray mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-card-hover">
              <Image
                src="/images/centro-1.jpg"
                alt="ABC Centre — Centro de logopedia y psicología en Nou Barris, Barcelona"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal/20 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-4 shadow-card">
              <p className="text-xs font-semibold text-gray uppercase tracking-wider mb-1">Centro en</p>
              <p className="text-sm font-semibold text-ink">Nou Barris · Barcelona</p>
              <p className="text-xs text-gray">Metro L1 · L4 · L5</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE SPLIT ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <p className="section-label">{t('audience_title')}</p>
            <h2 className="section-title">{t('audience_subtitle')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Children */}
            <div className="animate-on-scroll bg-cream rounded-3xl p-8 border-t-4 border-teal">
              <div className="w-12 h-12 bg-teal/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-outfit font-semibold text-ink mb-4">{t('audience_children_title')}</h3>
              <ul className="space-y-2 mb-6">
                {(t.raw('audience_children_services') as string[]).map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm font-light text-gray">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <Link href="/servicios" className="btn-ghost px-0 text-teal">
                {t('audience_children_cta')} →
              </Link>
            </div>

            {/* Adults */}
            <div className="animate-on-scroll bg-teal rounded-3xl p-8 border-t-4 border-lime" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-xl font-outfit font-semibold text-white mb-4">{t('audience_adults_title')}</h3>
              <ul className="space-y-2 mb-6">
                {(t.raw('audience_adults_services') as string[]).map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm font-light text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <Link href="/servicios" className="inline-flex items-center gap-1 text-sm font-semibold text-lime hover:underline">
                {t('audience_adults_cta')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ──────────────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <p className="section-label">{t('services_title')}</p>
            <h2 className="section-title">{t('services_subtitle')}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICES.map((service, i) => (
              <Link
                key={service.key}
                href={service.href}
                className={`animate-on-scroll card group flex flex-col gap-3 border-t-4 ${service.color} hover:-translate-y-1`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-teal">{service.icon}</span>
                <span className="font-outfit font-semibold text-sm text-ink group-hover:text-teal transition-colors">
                  {tNav(`services_menu.${service.key}`)}
                </span>
                <span className="text-teal text-xs font-semibold mt-auto">Ver servicio →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ABC ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <p className="section-label">{t('why_title')}</p>
              <h2 className="section-title">Más de dos décadas<br />al lado de las familias</h2>
              <div className="space-y-6 mt-8">
                {[
                  { title: t('why_years_title'),    body: t('why_years_body'),    icon: <Calendar className="w-5 h-5" /> },
                  { title: t('why_team_title'),     body: t('why_team_body'),     icon: <Users className="w-5 h-5" /> },
                  { title: t('why_personal_title'), body: t('why_personal_body'), icon: <Heart className="w-5 h-5" /> },
                  { title: t('why_location_title'), body: t('why_location_body'), icon: <MapPin className="w-5 h-5" /> },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-teal flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <h3 className="font-outfit font-semibold text-ink mb-1">{item.title}</h3>
                      <p className="text-sm font-light text-gray leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-on-scroll grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <Image
                  src="/images/centro-2.jpg"
                  alt="Sala de espera de ABC Centre"
                  fill className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mt-8">
                <Image
                  src="/images/centro-3.jpg"
                  alt="Sala de terapia de ABC Centre"
                  fill className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM PREVIEW ───────────────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <p className="section-label">{t('team_title')}</p>
            <h2 className="section-title">{t('team_subtitle')}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="animate-on-scroll card text-center"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {member.photo ? (
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 relative overflow-hidden">
                    <Image src={member.photo} alt={member.name} fill className="object-cover" sizes="64px" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
                    <span className="font-outfit font-semibold text-lg text-teal">{member.initials}</span>
                  </div>
                )}
                <h3 className="font-outfit font-semibold text-sm text-ink mb-1">{member.name}</h3>
                <p className="text-xs font-light text-gray leading-snug">{member.role}</p>
              </div>
            ))}
          </div>

          <div className="text-center animate-on-scroll">
            <Link href="/equipo" className="btn-secondary">
              {t('team_cta')} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOOKING CTA ────────────────────────────────────────── */}
      <section className="py-20 bg-teal">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-h2 font-outfit font-semibold text-white mb-4 animate-on-scroll">
            {t('booking_title')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 my-12">
            {[
              { num: '01', title: t('booking_step1_title'), body: t('booking_step1_body') },
              { num: '02', title: t('booking_step2_title'), body: t('booking_step2_body') },
              { num: '03', title: t('booking_step3_title'), body: t('booking_step3_body') },
            ].map((step) => (
              <div key={step.num} className="animate-on-scroll text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-outfit font-semibold text-lime text-sm">{step.num}</span>
                </div>
                <h3 className="font-outfit font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm font-light text-white/70">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center animate-on-scroll">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-8 py-4 bg-lime text-ink font-outfit font-semibold text-base rounded-xl hover:bg-lime-dark transition-all duration-200 hover:shadow-card hover:-translate-y-0.5"
            >
              {t('booking_cta')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="https://wa.me/34634545308"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-outfit font-semibold text-base rounded-xl hover:bg-white/20 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ─────────────────────────────────────────── */}
      <section className="py-16 bg-lime">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-ink/50 bg-white/40 px-4 py-2 rounded-full mb-5">
            Newsletter
          </span>
          <h2 className="text-h2 font-outfit font-semibold text-ink mb-3 animate-on-scroll">
            {t('newsletter_title')}
          </h2>
          <p className="text-sm font-light text-ink/70 mb-8 animate-on-scroll">
            {t('newsletter_body')}
          </p>
          <form
            action="mailto:info@abccentre.es"
            method="get"
            encType="text/plain"
            className="flex flex-col sm:flex-row gap-3 justify-center animate-on-scroll"
          >
            <input
              type="email"
              name="email"
              required
              placeholder={t('newsletter_placeholder')}
              className="flex-1 max-w-sm px-4 py-3 rounded-xl border border-ink/10 bg-white font-outfit text-sm text-ink placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-teal text-white font-outfit font-semibold text-sm rounded-xl hover:bg-teal/90 transition-colors whitespace-nowrap"
            >
              {t('newsletter_cta')}
            </button>
          </form>
          <p className="text-xs font-light text-ink/50 mt-4 animate-on-scroll">
            {t('newsletter_disclaimer')}
          </p>
        </div>
      </section>

      {/* ── MAP / LOCATION ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <p className="section-label">{t('map_title')}</p>
              <h2 className="section-title">{t('map_subtitle')}</h2>
              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <p className="font-outfit font-semibold text-ink text-sm">Carrer de Malgrat, 47</p>
                    <p className="text-sm font-light text-gray">08016 Barcelona · Nou Barris</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <div>
                    <a href="tel:+34932434835" className="block text-sm font-semibold text-ink hover:text-teal transition-colors">93 243 48 35</a>
                    <a href="tel:+34634545308" className="block text-sm font-light text-gray hover:text-teal transition-colors">634 545 308</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-ink">Lunes–Viernes, 9h–20h</p>
                    <p className="text-xs font-light text-gray">Con cita previa</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <p className="text-sm font-light text-gray">Metro L1 (Trinitat Nova) · L4 (Via Júlia) · L5 (Virrei Amat)</p>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/contacto" className="btn-primary">
                  Pide tu primera cita →
                </Link>
              </div>
            </div>

            <div className="animate-on-scroll rounded-3xl overflow-hidden h-80 lg:h-96 shadow-card">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=2.1742%2C41.4459%2C2.1794%2C41.4479&layer=mapnik&marker=41.4469%2C2.1768"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Mapa ABC Centre — Carrer de Malgrat 47, Nou Barris, Barcelona"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
