import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sanitizeText, ipHash } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

/** Receives the time-on-page beacon when a visitor leaves the page. */
export async function POST(req: NextRequest) {
  if (!rateLimit(`duration:${ipHash(req)}`, 120, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const viewId = sanitizeText(body?.viewId, 64);
  const seconds = Math.min(Math.max(Number(body?.seconds) || 0, 0), 3600 * 4);
  if (!viewId) return NextResponse.json({ ok: false }, { status: 400 });

  await prisma.pageView
    .update({ where: { id: viewId }, data: { duration: seconds } })
    .catch(() => {});
  return NextResponse.json({ ok: true });
}
