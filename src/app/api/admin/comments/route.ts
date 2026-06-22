import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok } from '@/lib/admin-api';
import { sanitizeText } from '@/lib/security';

export async function GET(req: NextRequest) {
  const status = sanitizeText(req.nextUrl.searchParams.get('status'), 20);
  const where = ['pending', 'approved', 'rejected'].includes(status) ? { status } : {};
  const comments = await prisma.comment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 300,
    include: { post: { select: { titleRu: true, slug: true } } },
  });
  return ok(comments);
}
