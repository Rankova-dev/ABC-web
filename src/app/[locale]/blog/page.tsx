import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/content/blog-posts';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('meta_title'), description: t('meta_desc') };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const isCA = locale === 'ca';
  const t = await getTranslations({ locale, namespace: 'blog' });

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

      {/* Posts grid */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => {
              const content = isCA ? post.ca : post.es;
              const dateLabel = new Date(post.publishedDate).toLocaleDateString(isCA ? 'ca-ES' : 'es-ES', {
                day: 'numeric', month: 'long', year: 'numeric',
              });
              return (
                <Link
                  key={post.slug}
                  href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
                  className="card block hover:shadow-card transition-shadow"
                >
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={isCA ? post.coverAlt.ca : post.coverAlt.es}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <time dateTime={post.publishedDate} className="text-xs text-gray/60">{dateLabel}</time>
                  <h2 className="font-outfit font-semibold text-ink mt-1 mb-1.5 leading-snug">{content.title}</h2>
                  <p className="text-sm font-light text-gray leading-relaxed">{content.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal mt-3">
                    {isCA ? 'Llegir més' : 'Leer más'}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
