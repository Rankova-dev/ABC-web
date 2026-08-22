/**
 * Reseñas gestionadas a mano — alternativa gratuita a la Places API.
 *
 * Se usan SOLO si GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID no están configuradas.
 * En cuanto pongas esas dos variables, la API manda y este fichero se ignora,
 * sin tocar nada más.
 *
 * ⚠️ Copia aquí reseñas REALES de la ficha de Google del centro, palabra por
 * palabra. Nunca inventes ni retoques el texto: son testimonios de pacientes.
 * Buena práctica: nombre de pila + inicial ("Marta G.") en vez del nombre
 * completo, aunque en Google aparezca entero.
 *
 * La fecha se guarda en ISO (YYYY-MM-DD) y el "hace X meses" se calcula solo,
 * así no envejece mal en la web.
 */

export interface ManualReview {
  /** Nombre tal y como quieras mostrarlo. Ej: "Marta G." */
  authorName: string;
  /** 1–5 */
  rating: number;
  /** Texto literal de la reseña */
  text: string;
  /** Fecha de la reseña, YYYY-MM-DD */
  date: string;
}

/** Nota media y nº de reseñas que se muestran en la cabecera del carrusel. */
export const MANUAL_SUMMARY = {
  /** Nota media que aparece en la ficha de Google */
  rating: 0,
  /** Nº total de reseñas de la ficha (no solo las copiadas aquí) */
  reviewCount: 0,
  /** Enlace a la ficha de Google Maps del centro */
  mapsUri: '',
};

/**
 * Rellena este array con las reseñas reales.
 *
 * Mientras esté vacío, el carrusel no se renderiza en ninguna página —
 * es el mismo comportamiento que sin API key. Nunca se muestran datos falsos.
 *
 * Plantilla:
 *
 *   {
 *     authorName: 'Marta G.',
 *     rating: 5,
 *     text: 'Texto literal de la reseña, copiado de Google.',
 *     date: '2026-04-18',
 *   },
 */
export const MANUAL_REVIEWS: ManualReview[] = [];
