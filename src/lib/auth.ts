/**
 * Allowed email domains for University of Manchester.
 * Only these domains can sign up and sign in.
 */

const ALLOWED_EMAIL_DOMAINS = [
  '@student.manchester.ac.uk',
  '@manchester.ac.uk',
] as const;

export function isAllowedEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.some((domain) => normalized.endsWith(domain));
}

export const ALLOWED_EMAIL_MESSAGE =
  'Only University of Manchester emails are allowed.';
