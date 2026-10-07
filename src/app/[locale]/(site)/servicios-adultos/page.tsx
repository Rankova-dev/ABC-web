import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import GoogleReviews from '@/components/GoogleReviews';
import { getGoogleReviews } from '@/lib/google-reviews';

type Props = { params: Promise<{ locale: string }> };

type AdultService = { key: string; href: string; desc: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'servicios_adultos' });
  return { title: t('meta_title'), description: t('meta_desc') };
}

export default async function ServiciosAdultosPage({ params }: Props) {
  const { locale } = await params;
  const reviews = await getGoogleReviews(locale);
  return <ServiciosAdultosContent reviews={reviews} />;
}

function ServiciosAdultosContent({ reviews }: { reviews: Awaited<ReturnType<typeof getGoogleReviews>> }) {
  const t = useTranslations('servicios_adultos');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const services = t.raw('services') as AdultService[];
  const faqItems = t.raw('faq') as { q: string; a: string }[];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: t('h1'),
    description: t('meta_desc'),
    url: 'https://abccentre.es/servicios-adultos',
    about: { '@type': 'MedicalBusiness', name: 'ABC Centre' },
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-cream pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/servicios" className="inline-flex items-center gap-1 text-sm font-light text-gray hover:text-teal transition-colors mb-6">
            ← {tCommon('see_all_services')}
          </Link>

          <span className="tag mb-4 inline-block">{tCommon('adults_tag')}</span>

          <h1 className="text-display font-outfit font-semibold text-ink leading-tight mb-4">
            {t('h1')}
          </h1>
          <p className="text-lg font-outfit font-light text-gray leading-relaxed max-w-2xl mb-8">
            {t('subtitle')}
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#contacto-adultos" className="btn-primary">
              {tCommon('book_cta')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="https://wa.me/34634545308" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('intro_title')}</h2>
          <p className="text-base font-outfit font-light text-gray leading-relaxed max-w-2xl animate-on-scroll">
            {t('intro_body')}
          </p>
        </div>
      </section>

      {/* ── SERVICES GRID ────────────────────────────────────── */}
      <section className="py-16 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8 animate-on-scroll">{t('services_title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <Link
                key={s.key}
                href={s.href as never}
                className="animate-on-scroll card group border-l-4 border-lime hover:-translate-y-1"
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

      {/* ── WHY ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8 animate-on-scroll">{t('why_title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t('why_years_title'), body: t('why_years_body') },
              { title: t('why_team_title'), body: t('why_team_body') },
              { title: t('why_personal_title'), body: t('why_personal_body') },
              { title: t('why_online_title'), body: t('why_online_body') },
            ].map((item, i) => (
              <div key={item.title} className="animate-on-scroll card" style={{ animationDelay: `${i * 80}ms` }}>
                <h3 className="font-outfit font-semibold text-ink mb-2">{item.title}</h3>
                <p className="text-sm font-light text-gray leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────── */}
      {reviews && <GoogleReviews data={reviews} />}

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{tCommon('faq_title')}</h2>
          <div className="space-y-4 mt-8">
            {faqItems.map((item, i) => (
              <details key={i} className="animate-on-scroll bg-cream rounded-2xl px-6 py-5 group">
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

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section id="contacto-adultos" className="py-16 bg-teal text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-h2 font-outfit font-semibold text-white mb-4 animate-on-scroll">
            {t('cta_title')}
          </h2>
          <p className="text-white/70 font-light mb-8 animate-on-scroll">
            {t('cta_body')}
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-lime text-ink font-outfit font-semibold rounded-xl hover:bg-lime-dark transition-all animate-on-scroll"
          >
            {tCommon('book_cta')} →
          </Link>
        </div>
      </section>
    </>
  );
}
