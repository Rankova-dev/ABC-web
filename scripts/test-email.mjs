/**
 * ABC Centre — test de envío de correo
 *
 * Uso:  node scripts/test-email.mjs tu-direccion@ejemplo.com
 *
 * Detecta qué backend está configurado (Resend API, SMTP o Gmail API),
 * verifica credenciales y envía un correo real de prueba.
 */

import { loadEnv } from './env-loader.mjs';
loadEnv();

const to = process.argv[2];
if (!to) {
  console.error('Uso: node scripts/test-email.mjs destinatario@ejemplo.com');
  process.exit(1);
}

const line = '═'.repeat(60);
console.log(line);
console.log('  ABC Centre — Diagnóstico de envío de correo');
console.log(line, '\n');

const resendConfigured = Boolean(process.env.RESEND_API_KEY);
const smtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);
const gmailConfigured = Boolean(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
  process.env.GOOGLE_PRIVATE_KEY &&
  process.env.GMAIL_SENDER_EMAIL
);

console.log('Backends detectados (se usa el primero disponible):');
console.log(`  1. Resend API   ${resendConfigured ? '✅ configurado' : '⬜ sin configurar'}`);
console.log(`  2. SMTP         ${smtpConfigured ? '✅ configurado' : '⬜ sin configurar'}`);
console.log(`  3. Gmail API    ${gmailConfigured ? '✅ configurado' : '⬜ sin configurar'}`);
console.log('');

if (!resendConfigured && !smtpConfigured && !gmailConfigured) {
  console.error('❌ Ningún backend configurado en .env.local.');
  console.error('   Rellena RESEND_API_KEY, o bien SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS.');
  process.exit(1);
}

const from =
  process.env.MAIL_FROM ||
  process.env.SMTP_USER ||
  process.env.GMAIL_SENDER_EMAIL ||
  'noreply@abccentre.es';

const backendName = resendConfigured ? 'Resend API' : smtpConfigured ? 'SMTP' : 'Gmail API';
const subject = 'Prueba de envío — ABC Centre';

const html = `<!DOCTYPE html><html lang="es"><body style="font-family:Arial,sans-serif;background:#F5F3EF;padding:32px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border-left:4px solid #246978;">
    <h2 style="color:#246978;margin:0 0 8px;">Prueba de envío — ABC Centre</h2>
    <p style="color:#6D6E71;font-size:14px;line-height:1.6;margin:0;">
      Si estás leyendo esto, el envío de correo de la web funciona.<br>
      Backend: <strong>${backendName}</strong><br>
      Remitente: <strong>${from}</strong><br>
      Enviado: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}
    </p>
  </div>
</body></html>`;

// ─── 1. Resend (HTTP, puerto 443) ─────────────────────────────────────────────

if (resendConfigured) {
  console.log(`Enviando por la API HTTP de Resend como ${from}…`);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: `ABC Centre <${from}>`, to: [to], subject, html }),
  });

  const payload = await res.json().catch(() => ({}));
  const msg = payload.message ?? '';

  if (!res.ok) {
    console.error(`❌ Resend devolvió ${res.status}: ${msg || JSON.stringify(payload)}`);
    console.error('');
    if (/not verified/i.test(msg)) {
      console.error('→ El dominio abccentre.es aún no está verificado en Resend.');
      console.error('  Resend → Domains → copia los registros DNS y añádelos en IONOS.');
    } else if (res.status === 401 || res.status === 403) {
      console.error('→ RESEND_API_KEY no válida o sin permiso de envío.');
    } else if (/from/i.test(msg)) {
      console.error(`→ MAIL_FROM (${from}) debe pertenecer al dominio verificado en Resend.`);
    }
    process.exit(1);
  }

  console.log(`✅ Correo enviado a ${to}`);
  console.log('   ID:', payload.id);
}

// ─── 2. SMTP ──────────────────────────────────────────────────────────────────

else if (smtpConfigured) {
  const nodemailer = (await import('nodemailer')).default;
  const port = Number(process.env.SMTP_PORT ?? 587);

  console.log(`Conectando a ${process.env.SMTP_HOST}:${port} como ${process.env.SMTP_USER}…`);

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  try {
    await transport.verify();
    console.log('✅ Conexión y credenciales SMTP correctas\n');
  } catch (err) {
    console.error('❌ Fallo al conectar o autenticar con el servidor SMTP:');
    console.error('  ', err.message);
    console.error('');
    console.error('Comprueba: host correcto, puerto 587 (STARTTLS) o 465 (SSL),');
    console.error('usuario = dirección de correo completa, contraseña del buzón.');
    console.error('Si falla desde el VPS pero funciona en local, es el bloqueo de');
    console.error('puertos SMTP salientes de Hetzner → usa Resend (HTTP).');
    process.exit(1);
  }

  try {
    const info = await transport.sendMail({
      from: { name: 'ABC Centre', address: from },
      to,
      subject,
      html,
    });
    console.log(`✅ Correo enviado a ${to}`);
    console.log('   Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ El servidor aceptó la conexión pero rechazó el envío:');
    console.error('  ', err.message);
    console.error('');
    console.error('Causa habitual: MAIL_FROM/SMTP_USER no es un buzón real del dominio,');
    console.error('o el proveedor no permite enviar como esa dirección.');
    process.exit(1);
  }
}

// ─── 3. Gmail API ─────────────────────────────────────────────────────────────

else {
  const { google } = await import('googleapis');

  console.log(`Autenticando como ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
  console.log(`y suplantando a ${process.env.GMAIL_SENDER_EMAIL}…`);

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
    subject: process.env.GMAIL_SENDER_EMAIL,
  });

  const raw = Buffer.from(
    [
      `From: ABC Centre <${from}>`,
      `To: ${to}`,
      `Subject: =?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(html, 'utf-8').toString('base64'),
    ].join('\r\n'),
    'utf-8'
  ).toString('base64url');

  try {
    const gmail = google.gmail({ version: 'v1', auth });
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
    console.log(`✅ Correo enviado a ${to}`);
  } catch (err) {
    console.error('❌ Fallo al enviar por Gmail API:');
    console.error('  ', err.message);
    console.error('');
    console.error('Si ves "unauthorized_client" o "Precondition check failed":');
    console.error('el dominio no tiene Google Workspace con delegación de dominio.');
    console.error('Es el caso de abccentre.es (correo en IONOS) → usa Resend o SMTP.');
    process.exit(1);
  }
}

console.log('\nRevisa la bandeja de entrada y la carpeta de spam.');
