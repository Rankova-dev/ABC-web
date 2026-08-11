/**
 * Sends transactional emails via Gmail API using a service account
 * with domain-wide delegation.
 *
 * Setup required in Google Workspace Admin:
 *   1. Enable domain-wide delegation on the service account
 *   2. Grant the scope: https://www.googleapis.com/auth/gmail.send
 *   3. The impersonated address (GMAIL_SENDER_EMAIL) must exist in the domain
 *
 * Falls back to console.log when credentials are not configured.
 */

import type { BookingRequest } from '@/lib/google-calendar';
import { SPECIALISTS, SERVICE_LABELS, APPOINTMENT_TYPES } from '@/config/specialists';

const TZ = 'Europe/Madrid';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

function hasGmailCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GMAIL_SENDER_EMAIL
  );
}

async function getGmailAuth() {
  const { google } = await import('googleapis');
  const key = (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key,
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
    // Impersonate the sender so the email appears to come from the domain
    subject: process.env.GMAIL_SENDER_EMAIL,
  });
}

// ─── MIME builder ─────────────────────────────────────────────────────────────

function buildRawMessage(opts: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): string {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(opts.subject, 'utf-8').toString('base64')}?=`;
  const encodedBody = Buffer.from(opts.html, 'utf-8').toString('base64');

  const mime = [
    `From: ABC Centre <${opts.from}>`,
    `To: ${opts.to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    encodedBody,
  ].join('\r\n');

  return Buffer.from(mime, 'utf-8').toString('base64url');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Sends a booking confirmation email to the patient.
 */
export async function sendPatientConfirmation(request: BookingRequest): Promise<void> {
  const specialist = SPECIALISTS[request.selectedSlot.specialistId];
  const from = process.env.GMAIL_SENDER_EMAIL ?? 'noreply@abccentre.es';

  if (!hasGmailCredentials()) {
    console.log('[Gmail] No credentials — would send confirmation to:', request.email);
    console.log('[Gmail] Slot:', request.selectedSlot.start);
    return;
  }

  const html = buildPatientEmailHtml(request, specialist.name);

  try {
    const auth = await getGmailAuth();
    const { google } = await import('googleapis');
    const gmail = google.gmail({ version: 'v1', auth });

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: buildRawMessage({
          from,
          to: request.email,
          subject: 'Tu cita en ABC Centre está confirmada',
          html,
        }),
      },
    });

    console.log('[Gmail] Confirmation sent to:', request.email);
  } catch (err) {
    // Non-fatal: booking was already created in Calendar; log and continue
    console.error('[Gmail] Failed to send confirmation email:', err);
  }
}

/**
 * Sends an internal notification to the reception / specialist team.
 */
export async function sendInternalNotification(request: BookingRequest): Promise<void> {
  const specialist = SPECIALISTS[request.selectedSlot.specialistId];
  const from = process.env.GMAIL_SENDER_EMAIL ?? 'noreply@abccentre.es';
  const internalRecipient = process.env.GMAIL_INTERNAL_RECIPIENT ?? 'citas@abccentre.es';

  if (!hasGmailCredentials()) {
    console.log('[Gmail] No credentials — would send internal notification for:', request.patientName);
    return;
  }

  const html = buildInternalEmailHtml(request, specialist.name);

  try {
    const auth = await getGmailAuth();
    const { google } = await import('googleapis');
    const gmail = google.gmail({ version: 'v1', auth });

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: buildRawMessage({
          from,
          to: internalRecipient,
          subject: `Nueva cita: ${request.patientName} — ${specialist.name}`,
          html,
        }),
      },
    });
  } catch (err) {
    console.error('[Gmail] Failed to send internal notification:', err);
  }
}

// ─── Email templates ──────────────────────────────────────────────────────────

function formatSlotDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('es-ES', {
    timeZone: TZ,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatSlotTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('es-ES', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildPatientEmailHtml(request: BookingRequest, specialistName: string): string {
  const date = formatSlotDate(request.selectedSlot.start);
  const time = formatSlotTime(request.selectedSlot.start);
  const appointmentTypeLabel = APPOINTMENT_TYPES[request.appointmentType]?.label ?? request.appointmentType;

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F3EF;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3EF;padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

  <!-- Header -->
  <tr>
    <td style="background:#246978;padding:32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">ABC Centre</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Logopedia · Psicología · Neuropsicología</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:36px 32px 28px;">

      <div style="width:48px;height:48px;background:#CFD357;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
        <span style="color:#2C2C2C;font-size:22px;line-height:48px;display:block;text-align:center;">✓</span>
      </div>

      <h2 style="color:#246978;margin:0 0 8px;font-size:20px;text-align:center;">¡Tu cita está confirmada!</h2>
      <p style="color:#6D6E71;margin:0 0 28px;font-size:14px;text-align:center;line-height:1.6;">
        Hemos recibido tu solicitud. Te esperamos en el centro.
      </p>

      <!-- Booking details -->
      <div style="background:#F5F3EF;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <p style="color:#246978;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 14px;">Detalles de tu cita</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#6D6E71;font-size:14px;padding:5px 0;">Paciente</td>
            <td style="color:#2C2C2C;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(request.patientName)}</td>
          </tr>
          <tr>
            <td style="color:#6D6E71;font-size:14px;padding:5px 0;">Tipo de cita</td>
            <td style="color:#2C2C2C;font-size:14px;font-weight:600;text-align:right;">${appointmentTypeLabel}</td>
          </tr>
          <tr>
            <td style="color:#6D6E71;font-size:14px;padding:5px 0;">Especialista</td>
            <td style="color:#2C2C2C;font-size:14px;font-weight:600;text-align:right;">${specialistName}</td>
          </tr>
          <tr>
            <td style="color:#6D6E71;font-size:14px;padding:5px 0;">Fecha</td>
            <td style="color:#2C2C2C;font-size:14px;font-weight:600;text-align:right;">${date}</td>
          </tr>
          <tr>
            <td style="color:#6D6E71;font-size:14px;padding:5px 0;">Hora</td>
            <td style="color:#2C2C2C;font-size:14px;font-weight:600;text-align:right;">${time}</td>
          </tr>
        </table>
      </div>

      <!-- Location -->
      <div style="border-top:1px solid #e8e4dc;padding-top:24px;margin-bottom:8px;">
        <p style="color:#246978;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 10px;">Dónde encontrarnos</p>
        <p style="color:#2C2C2C;font-size:14px;margin:0 0 4px;">Carrer de Malgrat, 47 · 08016 Barcelona</p>
        <p style="color:#6D6E71;font-size:13px;margin:0 0 4px;">Metro: L1 (Trinitat Nova) · L4 (Via Júlia) · L5 (Virrei Amat)</p>
        <p style="color:#6D6E71;font-size:13px;margin:0;">Tel: <a href="tel:+34932434835" style="color:#246978;">93 243 48 35</a></p>
      </div>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#F5F3EF;padding:16px 32px;text-align:center;border-top:1px solid #e8e4dc;">
      <p style="color:#6D6E71;font-size:11px;margin:0;">
        © ${new Date().getFullYear()} ABC Centre · Carrer de Malgrat, 47, 08016 Barcelona<br>
        Si no has realizado esta reserva, por favor contáctanos.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildInternalEmailHtml(request: BookingRequest, specialistName: string): string {
  const date = formatSlotDate(request.selectedSlot.start);
  const time = formatSlotTime(request.selectedSlot.start);
  const appointmentTypeLabel = APPOINTMENT_TYPES[request.appointmentType]?.label ?? request.appointmentType;
  const serviceLabel = SERVICE_LABELS[request.service] ?? request.service;

  const rows = [
    ['Tipo de cita', appointmentTypeLabel],
    ['Servicio', serviceLabel],
    ['Especialista', specialistName],
    ['Fecha', date],
    ['Hora', time],
    ['Paciente', request.patientName],
    request.patientAge ? ['Edad', String(request.patientAge)] : null,
    request.guardianName ? ['Familiar/Tutor', request.guardianName] : null,
    ['Email', request.email],
    ['Teléfono', request.phone],
    request.message ? ['Motivo', request.message] : null,
  ].filter(Boolean) as [string, string][];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="color:#6D6E71;font-size:14px;padding:5px 12px 5px 0;">${escapeHtml(label)}</td>
         <td style="color:#2C2C2C;font-size:14px;font-weight:600;">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;background:#F5F3EF;font-family:Arial,sans-serif;">
<div style="max-width:520px;background:#fff;border-radius:12px;padding:28px;border-left:4px solid #246978;">
  <h2 style="color:#246978;margin:0 0 4px;font-size:18px;">Nueva cita recibida</h2>
  <p style="color:#6D6E71;font-size:13px;margin:0 0 20px;">
    Creada el ${new Date().toLocaleString('es-ES', { timeZone: TZ })}
  </p>
  <table cellpadding="0" cellspacing="0">${tableRows}</table>
</div>
</body>
</html>`;
}
