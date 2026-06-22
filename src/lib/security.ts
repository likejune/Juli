import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/** Strips HTML tags and control characters; trims and limits length. */
export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

/** Privacy-friendly IP fingerprint (never stores the raw IP). */
export function ipHash(req: NextRequest): string {
  const ip =
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'local';
  const salt = process.env.SESSION_SECRET ?? 'salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 24);
}

/**
 * CSRF protection for mutating API routes: the Origin/Referer header
 * must match the request host (cookies are additionally SameSite=Strict).
 */
export function checkOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin') ?? req.headers.get('referer');
  if (!origin) return true; // non-browser clients without cookies
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export function forbidden(message = 'Forbidden'): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function badRequest(message = 'Bad request'): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
