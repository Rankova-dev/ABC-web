/**
 * Imprime el reparto de especialidades y el equipo de cada servicio tal y como
 * lo ven la web y el calendario de citas. Sirve para contrastarlo con el
 * listado que envía dirección.
 *
 *   npx tsx scripts/check-specialties.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env.local antes de cargar la config: specialists.ts lee process.env al
// evaluarse, así que el import tiene que ser dinámico y posterior.
try {
  const envPath = resolve(__dirname, '../.env.local');
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1).replace(/^["']|["']$/g, '');
  }
} catch {
  console.warn('(sin .env.local: los calendarios saldrán como no configurados)\n');
}

const {
  SPECIALISTS,
  SPECIALTY_LABELS,
  SERVICE_TEAM,
  SERVICE_LABELS,
  getTeamForSpecialty,
} = await import('../src/config/specialists.ts');

console.log('\n=== Especialidades → profesionales ===\n');
for (const key of Object.keys(SPECIALTY_LABELS)) {
  const team = getTeamForSpecialty(key);
  console.log(`${SPECIALTY_LABELS[key].es} (${team.length})`);
  for (const m of team) console.log(`   · ${m.name}`);
  console.log('');
}

console.log('=== Servicios de la web → equipo mostrado y calendarios ===\n');
for (const service of Object.keys(SERVICE_TEAM)) {
  const ids = SERVICE_TEAM[service];
  console.log(`${SERVICE_LABELS[service]} (${ids.length})`);
  for (const id of ids) {
    const s = SPECIALISTS[id];
    console.log(`   · ${s.name.padEnd(24)} ${s.calendarId ? '✓ calendario' : '✗ SIN CALENDARIO'}`);
  }
  console.log('');
}

const sinCalendario = Object.values(SPECIALISTS).filter(
  (s) => s.specialties.length > 0 && !s.calendarId
);
if (sinCalendario.length) {
  console.log('⚠️  Atienden pero no tienen Google Calendar configurado:');
  for (const s of sinCalendario) console.log(`   · ${s.name}`);
  console.log('');
}

const sinArea = Object.values(SPECIALISTS).filter((s) => s.specialties.length === 0);
if (sinArea.length) {
  console.log('⚠️  Sin especialidades asignadas (no reciben citas por la web):');
  for (const s of sinArea) console.log(`   · ${s.name}`);
  console.log('');
}
