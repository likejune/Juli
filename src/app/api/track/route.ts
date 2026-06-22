import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseDevice, parseOS, parseBrowser, classifyReferrer, countryFromHeaders } from '@/lib/analytics';
import { sanitizeText, ipHash } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

const VISITOR_COOKIE = 'jb_visitor';
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|monitor|preview|facebookexternalhit|whatsapp|telegram/i;

export async function POST(req: NextRequest) {
  // ignore crawlers and link-preview bots
  if (BOT_RE.test(req.headers.get('user-agent') ?? '')) {
    return NextResponse.json({ ok: true });
  }
  if (!rateLimit(`track:${ipHash(req)}`, 120, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = sanitizeText(body?.path, 300) || '/';
  if (path.startsWith('/admin')) return NextResponse.json({ ok: true }); // never track admin
  const kind = body?.kind === 'artwork' || body?.kind === 'post' ? body.kind : 'page';
  const entityId = kind !== 'page' ? sanitizeText(body?.entityId, 64) : null;

  const ua = req.headers.get('user-agent') ?? '';
  const visitorCookie = req.cookies.get(VISITOR_COOKIE)?.value ?? '';

  // find or create the visitor
  let visitor = visitorCookie
    ? await prisma.visitor.findUnique({ where: { id: visitorCookie } })
    : null;

  if (!visitor) {
    const ref = classifyReferrer(sanitizeText(body?.referrer, 500), sanitizeText(body?.utmSource, 80) || null);
    visitor = await prisma.visitor.create({
      data: {
        country: countryFromHeaders(req.headers),
        device: parseDevice(ua),
        os: parseOS(ua),
        browser: parseBrowser(ua),
        referrerType: ref.type,
        referrerSource: ref.source,
        userAgent: ua.slice(0, 300),
      },
    });
  } else {
    await prisma.visitor.update({ where: { id: visitor.id }, data: { lastSeenAt: new Date() } });
  }

  const view = await prisma.pageView.create({
    data: { visitorId: visitor.id, path, kind, entityId },
  });

  // bump per-entity counters used by the "popular" widgets
  if (kind === 'artwork' && entityId) {
    await prisma.artwork.update({ where: { id: entityId }, data: { views: { increment: 1 } } }).catch(() => {});
  }
  if (kind === 'post' && entityId) {
    await prisma.blogPost.update({ where: { id: entityId }, data: { views: { increment: 1 } } }).catch(() => {});
  }

  const res = NextResponse.json({ ok: true, viewId: view.id });
  res.cookies.set(VISITOR_COOKIE, visitor.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
