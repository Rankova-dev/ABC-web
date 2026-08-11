// Deliberately simple format check — good enough to reject junk input and,
// critically, to reject whitespace/CRLF so the value is safe to place in an
// email header (`To:`, `From:`) without enabling header injection.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_RE.test(value) && value.length <= 254;
}
