/**
 * Helpers for working with custom domains.
 *
 * Verification strategy: for local development we simulate DNS verification
 * by requiring the user to add a TXT record with a token. In production this
 * would call a real DNS provider API. The unverified domain is stored and a
 * verification token is returned for the user to add as a TXT record.
 */

export function normalizeDomain(input: string): string {
  return (input || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '');
}

export function isValidDomain(input: string): boolean {
  const domain = normalizeDomain(input);
  // Allow subdomains and root domains, e.g. www.example.com, example.com, sub.example.dev
  const pattern = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
  return pattern.test(domain);
}

export function generateVerificationToken(): string {
  const rand = () => Math.random().toString(36).slice(2, 10);
  return `paip-${rand()}${rand()}`;
}

/**
 * Simulate checking DNS verification. In a real deployment this would query
 * the TXT record for the domain. We accept a token match to allow local tests.
 */
export function verifyDomainToken(domain: string, providedToken: string, expectedToken: string): boolean {
  if (!expectedToken) return false;
  // In production, look up the TXT record for _paip-challenge.<domain> and
  // compare it to expectedToken. For local/mock we compare directly.
  return providedToken.trim() === expectedToken.trim();
}
