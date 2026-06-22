import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sanitizeText, ipHash, checkOrigin, badRequest, forbidden } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

/** Public endpoint: submit a comment (goes to moderation queue). */
export async function POST(req: NextRequest) {
  if (!checkOrigin(req)) return forbidden();
  const hash = ipHash(req);
  if (!rateLimit(`comments:${hash}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many comments, please wait' }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }

  const postId = sanitizeText(body?.postId, 64);
  const authorName = sanitizeText(body?.authorName, 60);
  const content = sanitizeText(body?.content, 1500);
  if (!postId || authorName.length < 2 || content.length < 3) {
    return badRequest('Invalid comment');
  }

  const post = await prisma.blogPost.findUnique({ where: { id: postId }, select: { id: true } });
  if (!post) return badRequest('Unknown post');

  await prisma.comment.create({
    data: { postId, authorName, content, status: 'pending', ipHash: hash },
  });
  return NextResponse.json({ ok: true, moderation: true }, { status: 201 });
}
