/**
 * Revisa los huecos de primera cita que hay abiertos en cada calendario y avisa
 * de los que la web NO va a detectar (títulos que no empiezan por "primera
 * cita", "primera consulta" o "primera visita").
 *
 *   node scripts/check-slots.mjs [días]     (por defecto, 21 días)
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const __dirname = dirname(fileURLToPath(import.meta.url));

for (const line of readFileSync(resolve(__dirname, '../.env.local'), 'utf-8').split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  process.env[t.slice(0, eq)] = t.slice(eq + 1).replace(/^["']|["']$/g, '');
}

const { SPECIALISTS, ONLINE_SLOT_KEYWORD } = await import('../src/config/specialists.ts');

// Mismos criterios que src/lib/google-calendar.ts
const SLOT_KEYWORDS = ['primera consulta', 'primera cita', 'primera visita'];
const isSlot = (title) => SLOT_KEYWORDS.some((kw) => (title ?? '').toLowerCase().startsWith(kw));
const isOnline = (title) => new RegExp(`\\b${ONLINE_SLOT_KEYWORD}\\b`, 'i').test(title ?? '');

const days = Number(process.argv[2] ?? 21);
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const calendar = google.calendar({ version: 'v3', auth });

const now = new Date();
const until = new Date(now.getTime() + days * 24 * 3600 * 1000);
const sospechosos = [];

console.log(`\nHuecos de primera cita en los próximos ${days} días\n`);

for (const [id, sp] of Object.entries(SPECIALISTS)) {
  if (!sp.calendarId) continue;
  let items = [];
  try {
    const res = await calendar.events.list({
      calendarId:   sp.calendarId,
      timeMin:      now.toISOString(),
      timeMax:      until.toISOString(),
      singleEvents: true,
      orderBy:      'startTime',
      maxResults:   250,
    });
    items = res.data.items ?? [];
  } catch (err) {
    console.log(`${sp.name.padEnd(24)} ERROR: ${err.message}`);
    continue;
  }

  const slots  = items.filter((ev) => isSlot(ev.summary));
  const online = slots.filter((ev) => isOnline(ev.summary));

  // Títulos que hablan de primeras visitas pero no encajan con los criterios
  const casi = items.filter(
    (ev) => !isSlot(ev.summary) && /primera|1a |1ª/i.test(ev.summary ?? '')
  );
  for (const ev of casi) sospechosos.push([sp.name, ev.summary, ev.start?.dateTime ?? ev.start?.date]);

  const detalle = slots.length
    ? `${String(slots.length).padStart(3)} huecos` + (online.length ? ` (${online.length} online)` : ' (ninguno online)')
    : '  sin huecos abiertos';
  console.log(`${sp.name.padEnd(24)} ${detalle}`);
}

if (sospechosos.length) {
  console.log('\n⚠️  Eventos que parecen huecos pero la web NO detecta:');
  for (const [name, title, start] of sospechosos) {
    console.log(`   · ${name}: "${title}"  (${String(start).slice(0, 16).replace('T', ' ')})`);
  }
  console.log('   El título debe empezar por "Primera cita", "Primera consulta" o "Primera visita".');
}
console.log('');
