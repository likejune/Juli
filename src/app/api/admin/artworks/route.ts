import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { isValidUrl } from '@/lib/security';
import { normalizeArtwork } from '@/lib/normalize';

export async function GET() {
  const artworks = await prisma.artwork.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { category: true },
  });
  return ok(artworks);
}

export async function POST(req: NextRequest) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  if (!body) return fail('Invalid JSON');

  const data = normalizeArtwork(body);
  const imageOk = data.imageUrl && (isValidUrl(String(data.imageUrl)) || String(data.imageUrl).startsWith('/uploads/'));
  if (!data.titleRu || !imageOk) {
    return fail('titleRu and a valid imageUrl are required');
  }
  if (!data.slug) data.slug = `work-${Date.now()}`;
  data.titleEn = data.titleEn || data.titleRu;
  data.titleZh = data.titleZh || data.titleRu;

  const artwork = await prisma.artwork.create({ data });
  return ok(artwork, 201);
}
