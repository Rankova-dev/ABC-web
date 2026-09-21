/**
 * ABC Centre — test de la pasarela de pago (modo prueba)
 *
 * Uso:  node scripts/test-stripe.mjs
 *
 * Comprueba que las claves de Stripe funcionan y abre una sesión de Checkout
 * real de una sesión de psicología online, con los mismos datos que enviaría
 * el formulario. Devuelve la URL para pagar con una tarjeta de prueba.
 *
 * No toca Google Calendar: aquí no se bloquea ningún hueco ni se crea cita.
 */

import { loadEnv } from './env-loader.mjs';
loadEnv();

const line = '═'.repeat(60);
console.log(line);
console.log('  ABC Centre — Diagnóstico de Stripe');
console.log(line, '\n');

const secret = process.env.STRIPE_SECRET_KEY;
const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

console.log('Credenciales:');
console.log(`  STRIPE_SECRET_KEY                   ${secret ? '✅ ' + secret.slice(0, 12) + '…' : '⬜ vacía'}`);
console.log(`  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  ${publishable ? '✅ ' + publishable.slice(0, 12) + '…' : '⬜ vacía'}`);
console.log(`  STRIPE_WEBHOOK_SECRET               ${webhookSecret ? '✅ configurado' : '⬜ vacía'}`);
console.log('');

if (!secret) {
  console.error('❌ Falta STRIPE_SECRET_KEY en .env.local.');
  console.error('   Panel de Stripe con "Modo de prueba" activado →');
  console.error('   Desarrolladores → Claves de API → copiar la clave secreta (sk_test_…).\n');
  process.exit(1);
}

if (secret.startsWith('sk_live_')) {
  console.error('⛔ Esa es una clave REAL (sk_live_). Este script cobra de verdad con ella.');
  console.error('   Usa la de prueba (sk_test_) para los ensayos.\n');
  process.exit(1);
}

if (!webhookSecret) {
  console.log('⚠️  Sin STRIPE_WEBHOOK_SECRET el pago se cobra pero la cita no se crea:');
  console.log('   el webhook es quien la crea. En local, en otra terminal:');
  console.log('   stripe listen --forward-to localhost:3000/api/stripe/webhook\n');
}

const Stripe = (await import('stripe')).default;
const stripe = new Stripe(secret);

// ── 1. ¿Responde la cuenta? ──────────────────────────────────────────────────
try {
  const account = await stripe.accounts.retrieve();
  console.log('Cuenta:');
  console.log(`  ${account.business_profile?.name ?? account.id}`);
  console.log(`  País: ${account.country ?? '—'} · Moneda: ${(account.default_currency ?? '—').toUpperCase()}`);
  console.log(`  Cobros activados: ${account.charges_enabled ? '✅ sí' : '⚠️  no (cuenta sin activar)'}`);
  console.log(`  Ingresos al banco: ${account.payouts_enabled ? '✅ sí' : '⚠️  no'}`);
  console.log('');
} catch (err) {
  console.error('❌ Stripe rechazó la clave:', err.message, '\n');
  process.exit(1);
}

// ── 2. Una sesión de Checkout como la del formulario ─────────────────────────
// Mismos datos que manda BookingForm para una cita de psicología online.
const start = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
start.setHours(17, 0, 0, 0);

const metadata = {
  patientName:     'Paciente de prueba',
  email:           'prueba@abccentre.es',
  phone:           '600000000',
  service:         'psicologia',
  appointmentType: 'psicologia-online',
  slotStart:       start.toISOString(),
  slotEnd:         new Date(start.getTime() + 50 * 60 * 1000).toISOString(),
  specialistId:    'elia_huertas',
  slotOnline:      'true',
};

try {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: metadata.email,
    locale: 'es',
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: 6000,
        product_data: { name: '1ª sesión de psicología online' },
      },
    }],
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    success_url: 'http://localhost:3000/es/cita/pago-ok?session_id={CHECKOUT_SESSION_ID}',
    cancel_url:  'http://localhost:3000/es/cita/pago-cancelado',
    metadata,
  });

  console.log('✅ Sesión de Checkout creada\n');
  console.log(`  Importe:  ${(session.amount_total / 100).toFixed(2)} €`);
  console.log(`  Caduca:   ${new Date(session.expires_at * 1000).toLocaleString('es-ES')}`);
  console.log(`  Sesión:   ${session.id}\n`);
  console.log('Abre esta URL y paga con la tarjeta de prueba 4242 4242 4242 4242');
  console.log('(cualquier fecha futura y cualquier CVC):\n');
  console.log(`  ${session.url}\n`);
  console.log(line);
  console.log('  Para que la cita llegue al calendario hacen falta, a la vez:');
  console.log('    npm run dev');
  console.log('    stripe listen --forward-to localhost:3000/api/stripe/webhook');
  console.log(line, '\n');
} catch (err) {
  console.error('❌ No se pudo crear la sesión de Checkout:', err.message, '\n');
  process.exit(1);
}
