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
 *   1. Places API (New), con GOOGLE_PLACE_ID y una de estas dos credenciales:
 *      · GOOGLE_PLACES_API_KEY, o
 *      · la service account que ya se usa para Calendar (no hace falta key).
 *      En ambos casos el proyecto de GCP necesita la Places API (New)
 *      habilitada y una cuenta de facturación.
 *
 *   2. Reseñas manuales de `@/config/reviews` — gratis y sin dependencias.
 *
 * Devuelve null (nunca datos inventados) si no hay ninguna de las dos, de modo
 * que el carrusel simplemente no se renderiza.
 */
export async function getGoogleReviews(locale = 'es'): Promise<GoogleReviewsData | null> {
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (placeId) {
    const fromApi = await fetchFromPlacesApi(placeId, locale);
    // Si la API falla, seguimos con las manuales antes que dejar el hueco vacío
    if (fromApi) return fromApi;
  }

  return buildFromManualReviews(locale);
}

// ─── Places API (New) ─────────────────────────────────────────────────────────

/**
 * Cabecera de autenticación: API key si la hay y, si no, un token de la service
 * account de Calendar. Así el carrusel no obliga a crear ni guardar una key.
 */
async function placesAuthHeader(): Promise<Record<string, string> | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (apiKey) return { 'X-Goog-Api-Key': apiKey };

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) return null;

  try {
    const { google } = await import('googleapis');
    const auth = new google.auth.JWT({
      email,
      key,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const { token } = await auth.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : null;
  } catch (err) {
    console.warn('[GoogleReviews] no se pudo firmar el token de la service account:', err);
    return null;
  }
}

async function fetchFromPlacesApi(
  placeId: string,
  locale: string
): Promise<GoogleReviewsData | null> {
  try {
    const authHeader = await placesAuthHeader();
    if (!authHeader) return null;

    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=${locale}`,
      {
        headers: {
          ...authHeader,
          'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
        },
        next: { revalidate: 60 * 60 * 24 },
      }
    );

    if (!res.ok) {
      // El motivo importa: normalmente es "Places API (New) no habilitada" o
      // falta de facturación en el proyecto. Queda en el log del contenedor.
      console.warn(
        `[GoogleReviews] Places API respondió ${res.status}:`,
        (await res.text()).slice(0, 300)
      );
      return null;
    }

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
