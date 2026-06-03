import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('meta_title'), description: t('meta_desc') };
}

export default function BlogPage() {
  const t = useTranslations('blog');

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label">ABC Centre</p>
          <h1 className="text-display font-outfit font-semibold text-ink mb-4">{t('h1')}</h1>
          <p className="text-lg font-outfit font-light text-gray max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-24 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h2 className="text-h2 font-outfit font-semibold text-ink mb-4">{t('coming_soon_title')}</h2>
          <p className="text-base font-outfit font-light text-gray leading-relaxed">{t('coming_soon_body')}</p>
        </div>
      </section>
    </>
  );
}
