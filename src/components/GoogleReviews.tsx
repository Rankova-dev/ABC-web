'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { GoogleReviewsData } from '@/lib/google-reviews';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-lime-dark' : 'text-gray/20'}`}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.77l-5.2 2.75.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function GoogleReviews({ data }: { data: GoogleReviewsData }) {
  const t = useTranslations('reviews');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = data.reviews.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, count]);

  if (count === 0) return null;

  const review = data.reviews[index];

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-on-scroll">
          <p className="section-label">{t('title')}</p>
          <h2 className="section-title">{t('subtitle')}</h2>

          <a
            href={data.mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm font-outfit font-semibold text-ink hover:text-teal transition-colors"
          >
            <span className="font-outfit font-semibold text-teal">{data.rating.toFixed(1)}</span>
            <Stars rating={data.rating} />
            <span className="text-gray font-light">{t('based_on', { count: data.reviewCount })}</span>
          </a>
        </div>

        <div
          className="relative animate-on-scroll"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="card px-6 py-8 sm:px-10 sm:py-10 min-h-[220px] flex flex-col justify-between">
            <div>
              <Stars rating={review.rating} />
              <p className="mt-4 text-base font-outfit font-light text-ink leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div className="relative w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {review.authorPhotoUrl ? (
                  <Image src={review.authorPhotoUrl} alt="" fill sizes="40px" className="object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="font-outfit font-semibold text-sm text-teal">
                    {review.authorName.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{review.authorName}</p>
                <p className="text-xs font-light text-gray">{review.relativeTime}</p>
              </div>
            </div>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Anterior"
                onClick={() => setIndex((i) => (i - 1 + count) % count)}
                className="hidden sm:flex absolute top-1/2 -left-5 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card items-center justify-center hover:bg-teal hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                onClick={() => setIndex((i) => (i + 1) % count)}
                className="hidden sm:flex absolute top-1/2 -right-5 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card items-center justify-center hover:bg-teal hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="flex justify-center gap-2 mt-6">
                {data.reviews.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Reseña ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-teal' : 'w-1.5 bg-gray/30'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-8 animate-on-scroll">
          <a
            href={data.mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            {t('see_all')} →
          </a>
        </div>
      </div>
    </section>
  );
}
