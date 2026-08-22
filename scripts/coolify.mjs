/**
 * ABC Centre — utilidad para la API de Coolify
 *
 * El token se lee, por este orden, de:
 *   1. La variable de entorno COOLIFY_API_TOKEN
 *   2. El fichero web/.coolify.local  (ignorado por git)
 *
 * Nunca se imprime el token ni el valor de ningún secreto.
 *
 * Comandos de LECTURA (no cambian nada):
 *   node scripts/coolify.mjs version           Comprueba conexión y token
 *   node scripts/coolify.mjs apps              Lista las aplicaciones y sus UUID
 *   node scripts/coolify.mjs envs <uuid>       Lista las variables (valores ocultos)
 *   node scripts/coolify.mjs plan <uuid>       Qué cambiaría 'sync', sin aplicarlo
 *
 * Comandos de ESCRITURA (exigen --apply / --confirm explícito):
 *   node scripts/coolify.mjs sync <uuid> --apply      Sube las variables de correo
 *   node scripts/coolify.mjs deploy <uuid> --confirm  Lanza un despliegue
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './env-loader.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv();

const BASE = (process.env.COOLIFY_URL ?? 'http://46.62.133.25:8000').replace(/\/$/, '');

/** Variables que este proyecto necesita en producción para el correo. */
const MAIL_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'MAIL_FROM',
  'MAIL_INTERNAL_RECIPIENT',
];

/** Variables obsoletas que conviene borrar a mano en el panel. */
const STALE_KEYS = ['GMAIL_SENDER_EMAIL', 'GMAIL_INTERNAL_RECIPIENT'];

// ─── Token ────────────────────────────────────────────────────────────────────

function getToken() {
  if (process.env.COOLIFY_API_TOKEN) return process.env.COOLIFY_API_TOKEN.trim();

  const file = resolve(__dirname, '../.coolify.local');
  if (existsSync(file)) {
    const raw = readFileSync(file, 'utf-8').trim();
    // Admite tanto "token-pelado" como "COOLIFY_API_TOKEN=token"
    const match = raw.match(/^COOLIFY_API_TOKEN=(.+)$/m);
    return (match ? match[1] : raw).trim();
  }

  console.error('❌ No hay token.');
  console.error('   Crea web/.coolify.local con el token dentro (está en .gitignore),');
  console.error('   o exporta COOLIFY_API_TOKEN en el entorno.');
  process.exit(1);
}

const TOKEN = getToken();

function mask(value) {
  const v = String(value ?? '');
  if (!v) return '(vacío)';
  if (v.length <= 6) return '*'.repeat(v.length);
  return v.slice(0, 2) + '*'.repeat(Math.min(v.length - 4, 20)) + v.slice(-2);
}

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const detail = typeof data === 'string' ? data.slice(0, 300) : JSON.stringify(data)?.slice(0, 300);
    throw new Error(`${method} ${path} → ${res.status}: ${detail}`);
  }
  return data;
}

// ─── Comandos ─────────────────────────────────────────────────────────────────

const [cmd, arg] = process.argv.slice(2);
const flags = process.argv.slice(2).filter((a) => a.startsWith('--'));
const has = (f) => flags.includes(f);

const line = '─'.repeat(58);

switch (cmd) {
  case 'version': {
    const v = await api('/version');
    console.log('✅ Conectado a', BASE);
    console.log('   Versión de Coolify:', typeof v === 'string' ? v : JSON.stringify(v));
    break;
  }

  case 'apps': {
    const apps = await api('/applications');
    const list = Array.isArray(apps) ? apps : apps?.data ?? [];
    if (!list.length) { console.log('No hay aplicaciones visibles con este token.'); break; }
    console.log(line);
    for (const a of list) {
      console.log(`${a.name ?? '(sin nombre)'}`);
      console.log(`  uuid   : ${a.uuid}`);
      console.log(`  estado : ${a.status ?? '?'}`);
      if (a.fqdn) console.log(`  dominio: ${a.fqdn}`);
      console.log(`  repo   : ${a.git_repository ?? '?'} (${a.git_branch ?? '?'})`);
      console.log('');
    }
    break;
  }

  case 'envs': {
    if (!arg || arg.startsWith('--')) { console.error('Falta el uuid. Sácalo con: coolify.mjs apps'); process.exit(1); }
    const envs = await api(`/applications/${arg}/envs`);
    const list = Array.isArray(envs) ? envs : envs?.data ?? [];

    // La API no devuelve 'value' salvo que el token tenga read:sensitive.
    const porClave = new Map();
    for (const e of list) {
      const reg = porClave.get(e.key) ?? { prod: false, preview: false, runtime: false, buildtime: false };
      if (e.is_preview) reg.preview = true; else reg.prod = true;
      reg.runtime ||= Boolean(e.is_runtime);
      reg.buildtime ||= Boolean(e.is_buildtime);
      porClave.set(e.key, reg);
    }

    console.log(`${porClave.size} variables (${list.length} entradas contando preview).`);
    console.log('Los valores no se muestran: el token no tiene permiso read:sensitive.');
    console.log(line);
    for (const [key, r] of [...porClave].sort((a, b) => a[0].localeCompare(b[0]))) {
      const ambitos = [r.prod && 'prod', r.preview && 'preview'].filter(Boolean).join('+');
      const cuando  = [r.runtime && 'runtime', r.buildtime && 'build'].filter(Boolean).join('+') || '—';
      const marca   = STALE_KEYS.includes(key) ? '  ⚠️ obsoleta' : '';
      console.log(`  ${key.padEnd(32)} ${ambitos.padEnd(13)} ${cuando}${marca}`);
    }
    const faltan = MAIL_KEYS.filter((k) => !porClave.has(k));
    if (faltan.length) console.log(`
Faltan para el correo: ${faltan.join(', ')}`);
    break;
  }

  case 'plan':
  case 'sync': {
    if (!arg || arg.startsWith('--')) { console.error('Falta el uuid.'); process.exit(1); }

    const envs = await api(`/applications/${arg}/envs`);
    const list = Array.isArray(envs) ? envs : envs?.data ?? [];
    // Sin read:sensitive no se puede comparar el valor remoto: solo si la clave existe.
    const existe = new Set(list.filter((e) => !e.is_preview).map((e) => e.key));

    const acciones = [];
    for (const key of MAIL_KEYS) {
      const local = process.env[key];
      if (!local) { acciones.push({ key, tipo: 'FALTA_EN_LOCAL' }); continue; }
      acciones.push({ key, tipo: existe.has(key) ? 'SOBRESCRIBIR' : 'CREAR', value: local });
    }

    console.log('Plan de sincronización de variables de correo:');
    console.log(line);
    for (const a of acciones) {
      const detalle = a.tipo === 'FALTA_EN_LOCAL' ? '' : ` → ${mask(a.value)}`;
      console.log(`  ${a.tipo.padEnd(16)} ${a.key}${detalle}`);
    }
    for (const key of STALE_KEYS) {
      if (existe.has(key)) console.log(`  ${'BORRAR A MANO'.padEnd(16)} ${key}  (obsoleta)`);
    }
    console.log(line);

    const cambios = acciones.filter((a) => a.tipo === 'CREAR' || a.tipo === 'SOBRESCRIBIR');

    if (cmd === 'plan') {
      console.log(`${cambios.length} cambio(s). Para aplicarlos: coolify.mjs sync ${arg} --apply`);
      break;
    }

    if (!has('--apply')) {
      console.log(`${cambios.length} cambio(s) pendientes. Añade --apply para escribirlos.`);
      break;
    }

    for (const a of cambios) {
      const payload = {
        key: a.key,
        value: a.value,
        is_preview: false,
        is_runtime: true,
        is_buildtime: false,
        is_literal: true,
      };
      try {
        if (a.tipo === 'CREAR') await api(`/applications/${arg}/envs`, { method: 'POST', body: payload });
        else await api(`/applications/${arg}/envs`, { method: 'PATCH', body: payload });
        console.log(`  ✅ ${a.tipo === 'CREAR' ? 'creada' : 'sobrescrita'}: ${a.key}`);
      } catch (err) {
        console.error(`  ❌ ${a.key}: ${err.message}`);
      }
    }
    console.log('\nListo. Las variables no surten efecto hasta el siguiente despliegue.');
    break;
  }

  case 'deploy': {
    if (!arg || arg.startsWith('--')) { console.error('Falta el uuid.'); process.exit(1); }
    if (!has('--confirm')) {
      console.error('⚠️  Esto despliega a producción (abccentre.es, con pacientes reales).');
      console.error('    Añade --confirm si es lo que quieres.');
      process.exit(1);
    }
    const r = await api(`/deploy?uuid=${encodeURIComponent(arg)}`);
    console.log('🚀 Despliegue lanzado:', JSON.stringify(r));
    console.log('   Sigue el progreso en el panel de Coolify.');
    break;
  }

  default:
    console.log(readFileSync(new URL(import.meta.url)).toString().split('*/')[0].replace(/^\/\*\*?/, ''));
}
