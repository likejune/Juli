import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { normalizePost } from '@/lib/normalize';

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
    include: {
      _count: { select: { comments: true, likes: true } },
    },
  });
  return ok(posts);
}

export async function POST(req: NextRequest) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  if (!body) return fail('Invalid JSON');

  const data = normalizePost(body);
  if (!data.titleRu || !data.imageUrl) return fail('titleRu and imageUrl are required');
  if (!data.slug) {
    data.slug = String(data.titleRu)
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s-]/gi, '')
      .replace(/\s+/g, '-')
      .slice(0, 60) || `post-${Date.now()}`;
  }
  const exists = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (exists) data.slug = `${data.slug}-${Date.now().toString(36)}`;
  data.titleEn = data.titleEn || data.titleRu;
  data.titleZh = data.titleZh || data.titleRu;

  const post = await prisma.blogPost.create({ data });
  return ok(post, 201);
}
