/**
 * ABC Centre — ficha del negocio en Google
 *
 * Datos sacados de la ficha real de Google Business Profile (14/09/2026):
 *   https://www.google.com/maps/place/ABC+Centro+de+Logopedia+Psicopedagogía+y+Psicología+Infantil/
 *
 * Se centralizan aquí para que el mapa, el pie de página y los datos
 * estructurados (schema.org) apunten todos al mismo sitio: si Google ve la
 * misma dirección y el mismo enlace en toda la web, el posicionamiento local
 * mejora. No editar a ojo: copiar siempre de la ficha de Google.
 */
export const BUSINESS = {
  /** Nombre exacto de la ficha de Google */
  name: 'ABC Centre de Logopèdia, Psicologia, Psicopedagogia, Neuropsicologia',
  streetAddress: 'Carrer de Malgrat, 47',
  postalCode: '08016',
  city: 'Barcelona',
  region: 'Nou Barris',
  country: 'ES',

  /** Coordenadas de la ficha (no las del portal de al lado) */
  lat: 41.4297408,
  lng: 2.1798185,

  /**
   * Enlace canónico a la ficha, por CID. Es el que conviene enlazar desde la
   * web: lleva a la ficha del centro, no a una búsqueda.
   */
  googleMapsUrl: 'https://maps.google.com/?cid=1689918801661744401',

  /** El mismo destino en versión iframe (no necesita API key) */
  googleMapsEmbedUrl: 'https://maps.google.com/maps?cid=1689918801661744401&output=embed',

  /** Place ID para la Places API (carrusel de reseñas) */
  placeId: 'ChIJ_c-wszq9pBIREVVNUDLMcxc',
} as const;
