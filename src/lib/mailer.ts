/**
 * Transactional email transport.
 *
 * Picks the first configured backend, in order:
 *
 *   1. Resend HTTP API — RESEND_API_KEY
 *              Recomendado en producción: viaja por HTTPS (443), así que no le
 *              afecta el bloqueo de puertos SMTP salientes (25/465/587) que
 *              Hetzner aplica por defecto a los servidores nuevos.
 *
 *   2. SMTP  — SMTP_HOST + SMTP_USER + SMTP_PASS
 *              Works with any mailbox provider (IONOS, Brevo, Resend SMTP…).
 *              This is the path to use for abccentre.es, whose mail is hosted
 *              at IONOS (mx00/mx01.ionos.es), not Google Workspace.
 *
 *   3. Gmail API — GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY +
 *              GMAIL_SENDER_EMAIL. Requires domain-wide delegation, which in
 *              turn requires Google Workspace on the sending domain.
 *
 *   4. Console log — nothing configured: the message is logged, never sent.
 *              Callers keep working (a booking is still created in Calendar).
 *
 * Never throws: a mail failure must not break a booking or a subscription.
 */

export type MailBackend = 'resend' | 'smtp' | 'gmail-api' | 'none';

export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

const FROM_NAME = 'ABC Centre';
const DEFAULT_SENDER = 'noreply@abccentre.es';

export function senderAddress(): string {
  return process.env.MAIL_FROM ?? process.env.SMTP_USER ?? process.env.GMAIL_SENDER_EMAIL ?? DEFAULT_SENDER;
}

/**
 * Buzón interno que recibe el aviso de cada cita nueva, y al que se dirigen las
 * respuestas de las pacientes (Reply-To). Tiene que ser un buzón REAL que
 * alguien lea; puede ser de cualquier dominio, incluido un Gmail.
 *
 * Por defecto info@abccentre.es: es la dirección que el centro publica en su
 * web, en el aviso legal y en la política de privacidad, así que existe.
 * (citas@abccentre.es era una invención nuestra, sin confirmar que exista.)
 */
export function internalRecipient(): string {
  return (
    process.env.MAIL_INTERNAL_RECIPIENT ??
    process.env.GMAIL_INTERNAL_RECIPIENT ??
    'info@abccentre.es'
  );
}

export function mailBackend(): MailBackend {
  if (process.env.RESEND_API_KEY) return 'resend';
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return 'smtp';
  if (
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GMAIL_SENDER_EMAIL
  ) {
    return 'gmail-api';
  }
  return 'none';
}

/** True when some backend can actually deliver mail. */
export function canSendEmail(): boolean {
  return mailBackend() !== 'none';
}

// ─── Resend HTTP API ──────────────────────────────────────────────────────────

async function sendViaResend(email: OutgoingEmail): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${senderAddress()}>`,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}

// ─── SMTP ─────────────────────────────────────────────────────────────────────

async function sendViaSmtp(email: OutgoingEmail): Promise<void> {
  const nodemailer = (await import('nodemailer')).default;
  const port = Number(process.env.SMTP_PORT ?? 587);

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 upgrades via STARTTLS
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  await transport.sendMail({
    from: { name: FROM_NAME, address: senderAddress() },
    to: email.to,
    subject: email.subject,
    html: email.html,
    replyTo: email.replyTo,
  });
}

// ─── Gmail API (service account + domain-wide delegation) ─────────────────────

function buildRawMessage(email: OutgoingEmail, from: string): string {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(email.subject, 'utf-8').toString('base64')}?=`;
  const encodedBody = Buffer.from(email.html, 'utf-8').toString('base64');

  const headers = [
    `From: ${FROM_NAME} <${from}>`,
    `To: ${email.to}`,
    `Subject: ${encodedSubject}`,
    ...(email.replyTo ? [`Reply-To: ${email.replyTo}`] : []),
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    encodedBody,
  ];

  return Buffer.from(headers.join('\r\n'), 'utf-8').toString('base64url');
}

async function sendViaGmailApi(email: OutgoingEmail): Promise<void> {
  const { google } = await import('googleapis');
  const from = senderAddress();

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
    // Impersonate the sender so the mail comes from the domain
    subject: process.env.GMAIL_SENDER_EMAIL,
  });

  const gmail = google.gmail({ version: 'v1', auth });
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: buildRawMessage(email, from) },
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Delivers an email through whichever backend is configured.
 * Returns true when it was actually handed to a mail server.
 */
/** Esperas entre reintentos, en ms. Tres intentos en total. */
const RETRY_DELAYS_MS = [1_500, 4_000];

/**
 * Un fallo 4xx de SMTP (o un corte de red) es temporal: el servidor pide que se
 * reintente más tarde. IONOS devuelve 451 durante los primeros minutos de vida
 * de un buzón nuevo, y también bajo carga. Un 5xx es definitivo (buzón
 * inexistente, rechazo permanente) y reintentarlo solo añade latencia.
 */
function isTransient(err: unknown): boolean {
  const code = (err as { responseCode?: number })?.responseCode;
  if (typeof code === 'number') return code >= 400 && code < 500;

  const msg = err instanceof Error ? err.message : String(err);
  return /\b4\d\d\b|timeout|ETIMEDOUT|ECONNRESET|ECONNREFUSED|EAI_AGAIN|socket/i.test(msg);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function deliverEmail(email: OutgoingEmail): Promise<boolean> {
  const backend = mailBackend();

  if (backend === 'none') {
    console.log('[Mailer] No backend configured — would send to', email.to, '—', email.subject);
    return false;
  }

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      if (backend === 'resend') {
        await sendViaResend(email);
      } else if (backend === 'smtp') {
        await sendViaSmtp(email);
      } else {
        await sendViaGmailApi(email);
      }
      const suffix = attempt > 0 ? ` (intento ${attempt + 1})` : '';
      console.log(`[Mailer] Sent via ${backend} to ${email.to}${suffix}`);
      return true;
    } catch (err) {
      const last = attempt === RETRY_DELAYS_MS.length;

      if (last || !isTransient(err)) {
        console.error(`[Mailer] Delivery failed via ${backend} to ${email.to}:`, err);
        return false;
      }

      const wait = RETRY_DELAYS_MS[attempt];
      console.warn(
        `[Mailer] Transient failure via ${backend} to ${email.to}, retrying in ${wait}ms:`,
        err instanceof Error ? err.message : err
      );
      await sleep(wait);
    }
  }

  return false;
}
