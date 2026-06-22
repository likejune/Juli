import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';
import { sanitizeText, isValidEmail, ipHash, checkOrigin, badRequest, forbidden } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  if (!checkOrigin(req)) return forbidden();

  // brute-force protection: 5 attempts per minute per IP
  if (!rateLimit(`login:${ipHash(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }

  const email = sanitizeText(body?.email, 254).toLowerCase();
  const password = typeof body?.password === 'string' ? body.password.slice(0, 200) : '';
  if (!isValidEmail(email) || !password) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // constant-shape response: always run bcrypt to avoid user-enumeration timing
  const hash = user?.passwordHash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv';
  const ok = await bcrypt.compare(password, hash);

  if (!user || !ok) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const token = await createSessionToken({ userId: user.id, email: user.email, role: user.role });

  const res = NextResponse.json({ ok: true, mustChangePassword: user.mustChangePassword });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
