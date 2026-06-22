import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ipHash, checkOrigin, badRequest, forbidden, unauthorized } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  if (!checkOrigin(req)) return forbidden();
  if (!rateLimit(`chpass:${ipHash(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const session = await getSession();
  if (!session) return unauthorized();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }

  const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword.slice(0, 200) : '';
  const newPassword = typeof body?.newPassword === 'string' ? body.newPassword.slice(0, 200) : '';

  if (newPassword.length < 10) {
    return NextResponse.json({ error: 'weak_password' }, { status: 400 });
  }
  if (newPassword === currentPassword) {
    return NextResponse.json({ error: 'same_password' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return unauthorized();

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'wrong_current' }, { status: 400 });

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 12), mustChangePassword: false },
  });
  return NextResponse.json({ ok: true });
}
