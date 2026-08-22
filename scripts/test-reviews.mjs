/**
 * ABC Centre — test de la Places API (carrusel de reseñas)
 *
 * Uso:
 *   node scripts/test-reviews.mjs                    → usa GOOGLE_PLACE_ID de .env.local
 *   node scripts/test-reviews.mjs "ABC Centre Barcelona"
 *        → busca el negocio por nombre y te devuelve su Place ID
 *
 * Requiere GOOGLE_PLACES_API_KEY en .env.local.
 */

import { loadEnv } from './env-loader.mjs';
loadEnv();

const line = '═'.repeat(60);
console.log(line);
console.log('  ABC Centre — Diagnóstico de Google Places API');
console.log(line, '\n');

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
if (!apiKey) {
  console.error('❌ Falta GOOGLE_PLACES_API_KEY en .env.local');
  console.error('   Google Cloud Console → APIs y servicios → Credenciales → Crear API key');
  process.exit(1);
}
console.log(`API key: ${apiKey.slice(0, 8)}…${apiKey.slice(-4)}\n`);

const query = process.argv[2];

// ─── Modo búsqueda: encontrar el Place ID ─────────────────────────────────────

if (query) {
  console.log(`Buscando: "${query}"…\n`);

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount',
    },
    body: JSON.stringify({ textQuery: query, languageCode: 'es' }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(`❌ Error ${res.status}:`, data.error?.message ?? JSON.stringify(data));
    diagnose(res.status, data);
    process.exit(1);
  }

  if (!data.places?.length) {
    console.log('Sin resultados. Prueba con el nombre + calle + ciudad.');
    process.exit(0);
  }

  data.places.forEach((p, i) => {
    console.log(`${i + 1}. ${p.displayName?.text ?? '(sin nombre)'}`);
    console.log(`   ${p.formattedAddress ?? ''}`);
    console.log(`   ⭐ ${p.rating ?? '—'} (${p.userRatingCount ?? 0} reseñas)`);
    console.log(`   GOOGLE_PLACE_ID=${p.id}\n`);
  });

  console.log('Copia la línea GOOGLE_PLACE_ID=… del negocio correcto a .env.local');
  process.exit(0);
}

// ─── Modo detalle: leer las reseñas del Place ID configurado ──────────────────

const placeId = process.env.GOOGLE_PLACE_ID;
if (!placeId) {
  console.error('❌ Falta GOOGLE_PLACE_ID en .env.local');
  console.error('   Búscalo con: node scripts/test-reviews.mjs "ABC Centre Barcelona"');
  process.exit(1);
}

console.log(`Place ID: ${placeId}\n`);

const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=es`, {
  headers: {
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'displayName,rating,userRatingCount,googleMapsUri,reviews',
  },
});

const data = await res.json();

if (!res.ok) {
  console.error(`❌ Error ${res.status}:`, data.error?.message ?? JSON.stringify(data));
  diagnose(res.status, data);
  process.exit(1);
}

console.log(`Negocio:  ${data.displayName?.text ?? '(sin nombre)'}`);
console.log(`Nota:     ⭐ ${data.rating ?? '—'} (${data.userRatingCount ?? 0} reseñas totales)`);
console.log(`Maps:     ${data.googleMapsUri ?? '—'}\n`);

const withText = (data.reviews ?? []).filter((r) => r.text?.text);

if (!withText.length) {
  console.log('⚠️  La API no devuelve reseñas con texto para este sitio.');
  console.log('   El carrusel no se renderizará (el código no inventa datos).');
  console.log('   La Places API devuelve como máximo 5 reseñas.');
  process.exit(0);
}

console.log(`✅ ${withText.length} reseña(s) con texto — el carrusel se mostrará:\n`);
withText.forEach((r, i) => {
  const txt = r.text.text.replace(/\s+/g, ' ');
  console.log(`${i + 1}. ${r.authorAttribution?.displayName ?? 'Usuario de Google'} — ⭐ ${r.rating ?? '?'} — ${r.relativePublishTimeDescription ?? ''}`);
  console.log(`   "${txt.slice(0, 140)}${txt.length > 140 ? '…' : ''}"\n`);
});

// ─── Diagnóstico de errores frecuentes ────────────────────────────────────────

function diagnose(status, data) {
  const msg = data.error?.message ?? '';
  console.error('');
  if (status === 403 && /not been used|disabled/i.test(msg)) {
    console.error('→ La Places API (New) no está habilitada en el proyecto.');
    console.error('  Google Cloud Console → APIs y servicios → Biblioteca →');
    console.error('  buscar "Places API (New)" → Habilitar.');
  } else if (status === 403 && /referer|restriction|blocked/i.test(msg)) {
    console.error('→ La API key tiene restricciones que bloquean esta llamada.');
    console.error('  Credenciales → tu key → Restricciones de aplicación: "Ninguna"');
    console.error('  (o restricción por IP del servidor). NO uses restricción por');
    console.error('  referer HTTP: las llamadas salen del servidor, no del navegador.');
  } else if (status === 400 && /API key not valid/i.test(msg)) {
    console.error('→ La API key no es válida. Cópiala de nuevo desde Credenciales.');
  } else if (status === 404) {
    console.error('→ Place ID no encontrado. Búscalo con:');
    console.error('  node scripts/test-reviews.mjs "ABC Centre Barcelona"');
  } else if (/billing/i.test(msg)) {
    console.error('→ El proyecto no tiene facturación activada.');
    console.error('  Google Cloud Console → Facturación → Vincular cuenta de facturación.');
  }
}
