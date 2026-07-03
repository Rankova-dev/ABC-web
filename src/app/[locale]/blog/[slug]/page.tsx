import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { BLOG_POSTS, getBlogPost, estimateReadingMinutes, type BlogBlock } from '@/content/blog-posts';
import { SERVICE_LABELS } from '@/config/specialists';

type Props = { params: Promise<{ locale: string; slug: string }> };

const BASE_URL = 'https://abccentre.es';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const isCA = locale === 'ca';
  const post = getBlogPost(slug);
  if (!post) return {};

  const content = isCA ? post.ca : post.es;
  const url = `${BASE_URL}/${locale}/blog/${slug}`;

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        es: `${BASE_URL}/es/blog/${slug}`,
        ca: `${BASE_URL}/ca/blog/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: content.title,
      description: content.metaDescription,
      url,
      publishedTime: post.publishedDate,
      images: [{ url: `${BASE_URL}${post.coverImage}` }],
    },
  };
}

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={`${keyPrefix}-${i}`} className="font-semibold text-ink">{part}</strong>
      : <span key={`${keyPrefix}-${i}`}>{part}</span>
  );
}

function BlockRenderer({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <h2 key={i} className="text-xl font-outfit font-semibold text-ink mt-10 mb-4">
              {block.text}
            </h2>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-sm font-light text-gray leading-relaxed">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item, `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-sm font-light text-gray leading-relaxed mb-4">
            {renderInline(block.text, `${i}`)}
          </p>
        );
      })}
    </>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const isCA = locale === 'ca';
  const post = getBlogPost(slug);

  if (!post) notFound();

  const content = isCA ? post.ca : post.es;
  const readingMinutes = estimateReadingMinutes(post, isCA ? 'ca' : 'es');
  const dateLabel = new Date(post.publishedDate).toLocaleDateString(isCA ? 'ca-ES' : 'es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const serviceLabel = SERVICE_LABELS[post.relatedService];

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: content.title,
    description: content.metaDescription,
    image: `${BASE_URL}${post.coverImage}`,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    inLanguage: isCA ? 'ca' : 'es',
    author: { '@type': 'Organization', name: 'ABC Centre' },
    publisher: {
      '@type': 'Organization',
      name: 'ABC Centre',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logos/logo-horizontal.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${locale}/blog/${slug}` },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isCA ? 'Inici' : 'Inicio', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: content.title, item: `${BASE_URL}/${locale}/blog/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="bg-cream pt-28 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-sm font-light text-gray hover:text-teal transition-colors mb-6 inline-block">
            ← Blog
          </Link>
          <p className="section-label">{isCA ? 'Espai de benestar i salut' : 'Espacio de bienestar y salud'}</p>
          <h1 className="text-display font-outfit font-semibold text-ink mb-4">{content.title}</h1>
          <p className="text-lg font-outfit font-light text-gray max-w-2xl mb-4">{content.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-gray/70">
            <time dateTime={post.publishedDate}>{dateLabel}</time>
            <span>·</span>
            <span>{readingMinutes} min {isCA ? 'de lectura' : 'de lectura'}</span>
          </div>
        </div>
      </section>

      {/* Cover image */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-4">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={isCA ? post.coverAlt.ca : post.coverAlt.es}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-legal">
          <BlockRenderer blocks={content.body} />
        </div>
      </section>

      {/* Related service CTA */}
      <section className="py-12 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray/10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-teal uppercase tracking-wider mb-1">
                {isCA ? 'Et podem ajudar' : 'Podemos ayudarte'}
              </p>
              <p className="text-base font-outfit font-semibold text-ink">
                {isCA ? `Servei de ${serviceLabel}` : `Servicio de ${serviceLabel}`}
              </p>
            </div>
            <Link
              href={`/${post.relatedService}` as never}
              className="btn-primary px-6 py-3 text-sm whitespace-nowrap"
            >
              {isCA ? 'Veure el servei' : 'Ver el servicio'}
            </Link>
          </div>
        </div>
      </section>

      {/* Other posts */}
      {otherPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title mb-6">{isCA ? 'Més articles' : 'Más artículos'}</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {otherPosts.map((p) => {
                const pc = isCA ? p.ca : p.es;
                return (
                  <Link
                    key={p.slug}
                    href={{ pathname: '/blog/[slug]', params: { slug: p.slug } }}
                    className="card block hover:shadow-card transition-shadow"
                  >
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <h3 className="font-outfit font-semibold text-ink mb-1.5">{pc.title}</h3>
                    <p className="text-sm font-light text-gray leading-relaxed">{pc.excerpt}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
