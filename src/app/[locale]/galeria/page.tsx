'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

const PHOTOS = [
  { src: '/images/centro-1.jpg', alt: 'ABC Centre — sala de terapia' },
  { src: '/images/centro-2.jpg', alt: 'ABC Centre — recepción' },
  { src: '/images/centro-3.jpg', alt: 'ABC Centre — sala infantil' },
];

export default function GaleriaPage() {
  const t = useTranslations('galeria');
  const [selected, setSelected] = useState<number | null>(null);

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

      {/* Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PHOTOS.map((photo, i) => (
              <button
                key={photo.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl group focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
                onClick={() => setSelected(i)}
                aria-label={photo.alt}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-300 rounded-2xl" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            onClick={() => setSelected(null)}
            aria-label="Cerrar"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {selected > 0 && (
            <button
              className="absolute left-4 text-white/80 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelected(selected - 1); }}
              aria-label="Anterior"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div
            className="relative max-w-4xl w-full max-h-[80vh] aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={PHOTOS[selected].src}
              alt={PHOTOS[selected].alt}
              fill
              className="object-contain rounded-xl"
              sizes="100vw"
              priority
            />
          </div>

          {selected < PHOTOS.length - 1 && (
            <button
              className="absolute right-4 text-white/80 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelected(selected + 1); }}
              aria-label="Siguiente"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
