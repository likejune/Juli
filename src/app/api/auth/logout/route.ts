import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';
import { checkOrigin, forbidden } from '@/lib/security';

export async function POST(req: NextRequest) {
  if (!checkOrigin(req)) return forbidden();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
