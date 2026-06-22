import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sanitizeText, ipHash, checkOrigin, badRequest, forbidden } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

const VISITOR_COOKIE = 'jb_visitor';

export async function GET(req: NextRequest) {
  const postId = sanitizeText(req.nextUrl.searchParams.get('postId'), 64);
  if (!postId) return badRequest('postId required');
  const visitorId = req.cookies.get(VISITOR_COOKIE)?.value ?? '';

  const [count, existing] = await Promise.all([
    prisma.like.count({ where: { postId } }),
    visitorId
      ? prisma.like.findUnique({ where: { postId_visitorId: { postId, visitorId } } })
      : Promise.resolve(null),
  ]);
  return NextResponse.json({ count, liked: Boolean(existing) });
}

/** Toggles a like. Anti-abuse: visitor cookie + unique constraint + per-IP rate limit. */
export async function POST(req: NextRequest) {
  if (!checkOrigin(req)) return forbidden();
  const hash = ipHash(req);
  if (!rateLimit(`likes:${hash}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }
  const postId = sanitizeText(body?.postId, 64);
  if (!postId) return badRequest('postId required');

  const post = await prisma.blogPost.findUnique({ where: { id: postId }, select: { id: true } });
  if (!post) return badRequest('Unknown post');

  const visitorId = req.cookies.get(VISITOR_COOKIE)?.value;
  if (!visitorId) {
    // a real browser will already have the analytics visitor cookie
    return forbidden('No visitor session');
  }

  const existing = await prisma.like.findUnique({
    where: { postId_visitorId: { postId, visitorId } },
  });

  let liked: boolean;
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    liked = false;
  } else {
    await prisma.like.create({ data: { postId, visitorId, ipHash: hash } });
    liked = true;
  }
  const count = await prisma.like.count({ where: { postId } });
  return NextResponse.json({ count, liked });
}
