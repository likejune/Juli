import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { sanitizeText } from '@/lib/security';

export async function GET() {
  const categories = await prisma.artworkCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { artworks: true } } },
  });
  return ok(categories);
}

export async function POST(req: NextRequest) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  const nameRu = sanitizeText(body?.nameRu, 100);
  if (!nameRu) return fail('nameRu required');
  const slug = sanitizeText(body?.slug, 100) || `cat-${Date.now()}`;
  const category = await prisma.artworkCategory.create({
    data: {
      slug,
      nameRu,
      nameEn: sanitizeText(body?.nameEn, 100) || nameRu,
      nameZh: sanitizeText(body?.nameZh, 100) || nameRu,
      sortOrder: Math.round(Number(body?.sortOrder)) || 0,
    },
  });
  return ok(category, 201);
}
