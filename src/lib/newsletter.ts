import { sendEmail, hasGmailCredentials } from '@/lib/gmail';
import { internalRecipient } from '@/lib/mailer';

const DISCOUNT_CODE = process.env.NEWSLETTER_DISCOUNT_CODE ?? 'BIENVENIDA10';

function hasSheetsCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEETS_NEWSLETTER_ID
  );
}

function getPrivateKey(): string {
  return (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');
}

async function getSheetsAuth() {
  const { google } = await import('googleapis');
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: getPrivateKey(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

/**
 * Appends the email to the "Suscriptores" tab of the newsletter spreadsheet.
 * Best-effort: logs and continues on failure so a Sheets outage never blocks
 * the discount-code email from going out.
 */
async function appendSubscriber(email: string): Promise<void> {
  if (!hasSheetsCredentials()) {
    console.log('[Newsletter] No Sheets credentials — would store subscriber:', email);
    return;
  }

  try {
    const auth = await getSheetsAuth();
    const { google } = await import('googleapis');
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_NEWSLETTER_ID,
      range: 'Suscriptores!A:B',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[email, new Date().toISOString()]],
      },
    });
  } catch (err) {
    console.error('[Newsletter] Failed to append subscriber to Sheets:', err);
  }
}

function buildWelcomeEmailHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F3EF;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3EF;padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

  <tr>
    <td style="background:#246978;padding:32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">ABC Centre</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Logopedia · Psicología · Neuropsicología</p>
    </td>
  </tr>

  <tr>
    <td style="padding:36px 32px 28px;">
      <h2 style="color:#246978;margin:0 0 12px;font-size:20px;text-align:center;">¡Gracias por suscribirte!</h2>
      <p style="color:#6D6E71;margin:0 0 24px;font-size:14px;text-align:center;line-height:1.6;">
        Aquí tienes tu código de descuento del 10% para tu primera cita.
      </p>

      <div style="background:#F5F3EF;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="color:#246978;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 10px;">Tu código</p>
        <p style="color:#2C2C2C;font-size:26px;font-weight:700;letter-spacing:2px;margin:0;">${DISCOUNT_CODE}</p>
      </div>

      <p style="color:#6D6E71;font-size:13px;text-align:center;line-height:1.6;margin:0 0 24px;">
        Menciónalo al pedir tu primera cita por teléfono, WhatsApp o el formulario de la web.
      </p>

      <div style="text-align:center;">
        <a href="https://abccentre.es/contacto" style="display:inline-block;background:#CFD357;color:#2C2C2C;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">Pide tu cita</a>
      </div>
    </td>
  </tr>

  <tr>
    <td style="background:#F5F3EF;padding:16px 32px;text-align:center;border-top:1px solid #e8e4dc;">
      <p style="color:#6D6E71;font-size:11px;margin:0;">
        © ${new Date().getFullYear()} ABC Centre · Carrer de Malgrat, 47, 08016 Barcelona<br>
        Recibes este correo porque te suscribiste en abccentre.es. Si quieres dejar de recibir nuestros correos, responde a este email indicándolo.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export interface NewsletterResult {
  success: boolean;
}

/**
 * Aviso interno con cada alta. Es la red de seguridad para cuando la hoja de
 * cálculo no está configurada: sin esto, la persona recibiría su código de
 * descuento y su dirección no quedaría registrada en ninguna parte.
 */
async function notifyInternal(email: string): Promise<void> {
  // La ruta ya valida el formato, pero escapamos igualmente antes de meterlo en HTML
  const seguro = email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const fecha = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

  await sendEmail({
    to: internalRecipient(),
    subject: `Nueva suscripción a la newsletter: ${email}`,
    replyTo: email,
    html: `<!DOCTYPE html><html lang="es"><body style="margin:0;padding:24px;background:#F5F3EF;font-family:Arial,sans-serif;">
<div style="max-width:520px;background:#fff;border-radius:12px;padding:28px;border-left:4px solid #CFD357;">
  <h2 style="color:#246978;margin:0 0 4px;font-size:18px;">Nueva suscripción a la newsletter</h2>
  <p style="color:#6D6E71;font-size:13px;margin:0 0 20px;">${fecha}</p>
  <p style="color:#2C2C2C;font-size:15px;font-weight:600;margin:0 0 16px;">${seguro}</p>
  <p style="color:#6D6E71;font-size:13px;margin:0;">
    Se le ha enviado el código <strong>${DISCOUNT_CODE}</strong>.
    Apunta esta dirección en la lista de suscriptores.
  </p>
</div></body></html>`,
  });
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterResult> {
  await appendSubscriber(email);

  await sendEmail({
    to: email,
    subject: 'Tu 10% de descuento — ABC Centre',
    html: buildWelcomeEmailHtml(),
  });

  // Mientras no haya hoja de cálculo, el aviso interno es el único registro
  if (!hasSheetsCredentials()) {
    await notifyInternal(email);
  }

  if (!hasSheetsCredentials() && !hasGmailCredentials()) {
    console.log('[Newsletter] Ni Sheets ni correo configurados — suscriptor solo en logs:', email);
  }

  return { success: true };
}
