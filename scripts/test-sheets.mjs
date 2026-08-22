/**
 * ABC Centre — test de la hoja de suscriptores de la newsletter
 *
 * Uso:  node scripts/test-sheets.mjs
 *
 * Verifica que la service account puede escribir en la Google Sheet y
 * añade una fila de prueba en la pestaña "Suscriptores".
 */

import { loadEnv } from './env-loader.mjs';
loadEnv();

const line = '═'.repeat(60);
console.log(line);
console.log('  ABC Centre — Diagnóstico de la hoja de newsletter');
console.log(line, '\n');

const sheetId = process.env.GOOGLE_SHEETS_NEWSLETTER_ID;
const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const rawKey = process.env.GOOGLE_PRIVATE_KEY ?? '';

if (!saEmail || !rawKey) {
  console.error('❌ Faltan GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_PRIVATE_KEY en .env.local');
  process.exit(1);
}
if (!sheetId) {
  console.error('❌ Falta GOOGLE_SHEETS_NEWSLETTER_ID en .env.local');
  console.error('   Es el trozo largo de la URL: docs.google.com/spreadsheets/d/<ID>/edit');
  process.exit(1);
}

console.log(`Service account: ${saEmail}`);
console.log(`Hoja:            ${sheetId}\n`);

const { google } = await import('googleapis');

const auth = new google.auth.JWT({
  email: saEmail,
  key: rawKey.replace(/\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// 1. ¿Podemos leer la hoja?
let meta;
try {
  const res = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  meta = res.data;
  console.log(`✅ Acceso de lectura OK — "${meta.properties?.title}"`);
} catch (err) {
  console.error('❌ No se puede acceder a la hoja:', err.message);
  console.error('');
  if (/403|permission/i.test(err.message)) {
    console.error('→ La hoja no está compartida con la service account.');
    console.error(`  Abre la hoja → Compartir → añade ${saEmail} como Editor.`);
  } else if (/API has not been used|disabled/i.test(err.message)) {
    console.error('→ La Google Sheets API no está habilitada en el proyecto.');
    console.error('  Cloud Console → APIs y servicios → Biblioteca → "Google Sheets API" → Habilitar.');
  } else if (/404|not found/i.test(err.message)) {
    console.error('→ El ID de la hoja no es correcto.');
  }
  process.exit(1);
}

// 2. ¿Existe la pestaña "Suscriptores"?
const tabs = (meta.sheets ?? []).map((s) => s.properties?.title);
console.log(`   Pestañas: ${tabs.join(', ')}`);

if (!tabs.includes('Suscriptores')) {
  console.error('\n❌ Falta la pestaña "Suscriptores" (con ese nombre exacto).');
  console.error('   Renómbrala en la parte inferior de la hoja.');
  process.exit(1);
}
console.log('✅ Pestaña "Suscriptores" encontrada\n');

// 3. ¿Podemos escribir?
try {
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Suscriptores!A:B',
    valueInputOption: 'RAW',
    requestBody: { values: [['prueba@test.local', new Date().toISOString()]] },
  });
  console.log('✅ Escritura OK — se ha añadido una fila de prueba');
  console.log('   Bórrala a mano cuando la veas (prueba@test.local).');
} catch (err) {
  console.error('❌ Lectura OK pero no se puede escribir:', err.message);
  console.error('   La service account necesita permiso de **Editor**, no de lector.');
  process.exit(1);
}
