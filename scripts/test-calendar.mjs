/**
 * ABC Centre — Google Calendar connection test
 * Usage: node scripts/test-calendar.mjs
 *
 * Verifica:
 *   1. Autenticación del service account
 *   2. Calendarios compartidos y sus IDs
 *   3. Qué variables GOOGLE_CALENDAR_* están configuradas
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env.local ──────────────────────────────────────────────────────────

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx);
      let val = trimmed.slice(eqIdx + 1);
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  } catch (e) {
    console.error('No se pudo leer .env.local:', e.message);
  }
}

loadEnv();

// ─── Specialist list (mirrors specialists.ts) ─────────────────────────────────

const SPECIALIST_KEYS = [
  { id: 'celia_cruz',       name: 'Celia Cruz',        env: 'GOOGLE_CALENDAR_CELIA_CRUZ' },
  { id: 'laia_alvarez',     name: 'Laia Álvarez',       env: 'GOOGLE_CALENDAR_LAIA_ALVAREZ' },
  { id: 'maria_andres',     name: 'María Andrés',       env: 'GOOGLE_CALENDAR_MARIA_ANDRES' },
  { id: 'laia_lahoz',       name: 'Laia Lahoz',         env: 'GOOGLE_CALENDAR_LAIA_LAHOZ' },
  { id: 'vanessa_pedro',    name: 'Vanessa de Pedro',   env: 'GOOGLE_CALENDAR_VANESSA_PEDRO' },
  { id: 'mar_aranega',      name: 'Maria del Mar Aránega', env: 'GOOGLE_CALENDAR_MAR_ARANEGA' },
  { id: 'margot_moreno',    name: 'Margot Moreno',      env: 'GOOGLE_CALENDAR_MARGOT_MORENO' },
  { id: 'noelia_torres',    name: 'Noelia Torres',      env: 'GOOGLE_CALENDAR_NOELIA_TORRES' },
  { id: 'silvia_marco',     name: 'Silvia Marcó',       env: 'GOOGLE_CALENDAR_SILVIA_MARCO' },
  { id: 'eulalia_marquez',  name: 'Eulàlia Márquez',    env: 'GOOGLE_CALENDAR_EULALIA_MARQUEZ' },
  { id: 'elia_huertas',     name: 'Èlia Huertas',       env: 'GOOGLE_CALENDAR_ELIA_HUERTAS' },
  { id: 'raisa_pocino',     name: 'Raisa Pocino',       env: 'GOOGLE_CALENDAR_RAISA_POCINO' },
  { id: 'carla_lopez',      name: 'Carla López',        env: 'GOOGLE_CALENDAR_CARLA_LOPEZ' },
];

const email   = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const rawKey  = process.env.GOOGLE_PRIVATE_KEY ?? '';
const privateKey = rawKey.replace(/\\n/g, '\n');

if (!email || !privateKey) {
  console.error('❌ GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_PRIVATE_KEY no configurados en .env.local');
  process.exit(1);
}

console.log('═══════════════════════════════════════════════');
console.log('  ABC Centre — Google Calendar Diagnostic');
console.log('═══════════════════════════════════════════════');
console.log(`Service account: ${email}\n`);

const { google } = await import('googleapis');

const auth = new google.auth.JWT({
  email,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});
const calendar = google.calendar({ version: 'v3', auth });

// ── Test 1: Auth ──────────────────────────────────────────────────────────────
process.stdout.write('▸ Autenticación... ');
try {
  await auth.getAccessToken();
  console.log('✅ OK\n');
} catch (err) {
  console.error(`❌ ERROR: ${err.message}`);
  process.exit(1);
}

// ── Test 2: Shared calendars ──────────────────────────────────────────────────
console.log('▸ Calendarios compartidos con el service account:');
let sharedCalendars = [];
try {
  const res = await calendar.calendarList.list({ maxResults: 50 });
  sharedCalendars = res.data.items ?? [];

  if (sharedCalendars.length === 0) {
    console.log('  ⚠️  Ninguno todavía.\n');
  } else {
    for (const cal of sharedCalendars) {
      console.log(`  📅 ${cal.summary}`);
      console.log(`     ID: ${cal.id}`);
      console.log(`     Acceso: ${cal.accessRole}`);
    }
    console.log('');
  }
} catch (err) {
  console.error(`  ❌ ${err.message}\n`);
}

// ── Test 3: .env.local status ─────────────────────────────────────────────────
console.log('▸ Estado de variables GOOGLE_CALENDAR_* en .env.local:\n');

const configured   = [];
const pending      = [];

for (const sp of SPECIALIST_KEYS) {
  const val = process.env[sp.env];
  if (val) {
    configured.push({ ...sp, calendarId: val });
  } else {
    pending.push(sp);
  }
}

if (configured.length > 0) {
  console.log(`  Configurados (${configured.length}/${SPECIALIST_KEYS.length}):`);
  for (const sp of configured) {
    const found = sharedCalendars.find(c => c.id === sp.calendarId);
    const shared = found ? '✅ compartido' : '⚠️  no aparece en calendarios compartidos';
    console.log(`  ✅ ${sp.name.padEnd(22)} ${sp.calendarId}  [${shared}]`);
  }
  console.log('');
}

if (pending.length > 0) {
  console.log(`  Pendientes (${pending.length}/${SPECIALIST_KEYS.length}):`);
  for (const sp of pending) {
    console.log(`  ○  ${sp.name.padEnd(22)} ${sp.env}=<pendiente>`);
  }
  console.log('');
}

// ── Test 4: Quick freebusy check on configured calendars ─────────────────────
if (configured.length > 0) {
  console.log('▸ Verificando acceso freebusy en calendarios configurados...\n');
  const today = new Date().toISOString().split('T')[0];
  const timeMin = `${today}T00:00:00+02:00`;
  const timeMax = `${today}T23:59:00+02:00`;

  for (const sp of configured) {
    process.stdout.write(`  ${sp.name}: `);
    try {
      const res = await calendar.freebusy.query({
        requestBody: {
          timeMin,
          timeMax,
          timeZone: 'Europe/Madrid',
          items: [{ id: sp.calendarId }],
        },
      });
      const busy = res.data.calendars?.[sp.calendarId]?.busy ?? [];
      console.log(`✅  (${busy.length} evento(s) hoy)`);
    } catch (err) {
      console.log(`❌  ${err.message}`);
    }
  }
  console.log('');
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════');
console.log(`  Resumen: ${configured.length}/${SPECIALIST_KEYS.length} especialistas configuradas`);
if (pending.length > 0) {
  console.log('');
  console.log('  Para activar el resto:');
  console.log(`  1. La especialista abre Google Calendar`);
  console.log(`  2. ⚙ Configuración y uso compartido`);
  console.log(`  3. "+ Añadir personas" → ${email}`);
  console.log(`  4. Permiso: "Realizar cambios en eventos"`);
  console.log(`  5. Copiar "ID del calendario" y añadirlo a .env.local`);
  console.log(`  6. Volver a ejecutar: node scripts/test-calendar.mjs`);
}
console.log('═══════════════════════════════════════════════\n');
