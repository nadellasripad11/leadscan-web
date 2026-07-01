/**
 * Validate and normalize domain input
 */
export function validateDomain(input: string): { valid: boolean; domain?: string; error?: string } {
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Domain is required" };
  }

  let domain = input.trim().toLowerCase();

  // Remove common prefixes
  domain = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];

  // Reject empty after cleanup
  if (!domain || domain.length === 0) {
    return { valid: false, error: "Invalid domain format" };
  }

  // Reject obviously invalid domains
  if (domain.includes(" ")) {
    return { valid: false, error: "Domain cannot contain spaces" };
  }

  // Reject if it's just an IP without a TLD
  if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
    return { valid: false, error: "IP addresses not supported. Please use a domain name." };
  }

  // Reject blacklisted domains
  const blacklist = ["localhost", "127.0.0.1", "example.com", "test.com", "invalid"];
  if (blacklist.includes(domain)) {
    return { valid: false, error: `Domain '${domain}' is not allowed` };
  }

  // Basic domain format check (needs at least one dot)
  if (!domain.includes(".")) {
    return { valid: false, error: "Please enter a valid domain (e.g., example.com)" };
  }

  // Check length
  if (domain.length > 255) {
    return { valid: false, error: "Domain is too long" };
  }

  return { valid: true, domain };
}

/**
 * Rate limit checker using simple in-memory storage
 * In production, use Redis or a proper rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const current = rateLimitMap.get(identifier);

  if (!current || current.resetAt < now) {
    // New window or first request
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.count++;
  return { allowed: true, remaining: maxRequests - current.count };
}
