import { MANUAL_REVIEWS, MANUAL_SUMMARY, type ManualReview } from '@/config/reviews';

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface GoogleReviewsData {
  rating: number;
  reviewCount: number;
  mapsUri: string;
  reviews: GoogleReview[];
}

interface PlacesApiReview {
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; photoUri?: string };
}

interface PlacesApiResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesApiReview[];
}

/**
 * Devuelve las reseñas para el carrusel, en dos modos:
 *
 *   1. Places API (New) — si hay GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID.
 *      Automático, pero exige una cuenta de facturación con tarjeta en GCP.
 *
 *   2. Reseñas manuales de `@/config/reviews` — gratis y sin dependencias.
 *
 * Devuelve null (nunca datos inventados) si no hay ninguna de las dos, de modo
 * que el carrusel simplemente no se renderiza.
 */
export async function getGoogleReviews(locale = 'es'): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (apiKey && placeId) {
    const fromApi = await fetchFromPlacesApi(apiKey, placeId, locale);
    // Si la API falla, seguimos con las manuales antes que dejar el hueco vacío
    if (fromApi) return fromApi;
  }

  return buildFromManualReviews(locale);
}

// ─── Places API (New) ─────────────────────────────────────────────────────────

async function fetchFromPlacesApi(
  apiKey: string,
  placeId: string,
  locale: string
): Promise<GoogleReviewsData | null> {
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=${locale}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
        },
        next: { revalidate: 60 * 60 * 24 },
      }
    );

    if (!res.ok) return null;

    const data: PlacesApiResponse = await res.json();
    if (!data.reviews?.length) return null;

    const reviews = data.reviews
      .filter((r) => r.text?.text)
      .map((r) => ({
        authorName: r.authorAttribution?.displayName ?? 'Usuario de Google',
        authorPhotoUrl: r.authorAttribution?.photoUri,
        rating: r.rating ?? 5,
        text: r.text!.text!,
        relativeTime: r.relativePublishTimeDescription ?? '',
      }));

    if (!reviews.length) return null;

    return {
      rating: data.rating ?? 0,
      reviewCount: data.userRatingCount ?? 0,
      mapsUri: data.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      reviews,
    };
  } catch {
    return null;
  }
}

// ─── Reseñas manuales ─────────────────────────────────────────────────────────

function buildFromManualReviews(locale: string): GoogleReviewsData | null {
  if (!MANUAL_REVIEWS.length) return null;

  return {
    rating: MANUAL_SUMMARY.rating || averageRating(MANUAL_REVIEWS),
    reviewCount: MANUAL_SUMMARY.reviewCount || MANUAL_REVIEWS.length,
    mapsUri: MANUAL_SUMMARY.mapsUri || 'https://www.google.com/maps',
    reviews: MANUAL_REVIEWS.map((r) => ({
      authorName: r.authorName,
      rating: r.rating,
      text: r.text,
      relativeTime: relativeTimeFrom(r.date, locale),
    })),
  };
}

function averageRating(reviews: ManualReview[]): number {
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

/**
 * "hace 5 meses" / "fa 5 mesos" a partir de una fecha ISO, para que las reseñas
 * copiadas a mano no se queden con un texto de antigüedad congelado.
 */
function relativeTimeFrom(isoDate: string, locale: string): string {
  const then = new Date(isoDate);
  if (Number.isNaN(then.getTime())) return '';

  const days = Math.floor((Date.now() - then.getTime()) / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (days < 7) return rtf.format(-days, 'day');
  if (days < 31) return rtf.format(-Math.floor(days / 7), 'week');
  if (days < 365) return rtf.format(-Math.floor(days / 30), 'month');
  return rtf.format(-Math.floor(days / 365), 'year');
}
