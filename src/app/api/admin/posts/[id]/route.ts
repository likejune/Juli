import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { normalizePost } from '@/lib/normalize';

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    include: { _count: { select: { comments: true, likes: true } } },
  });
  if (!post) return fail('Not found', 404);
  return ok(post);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  if (!body) return fail('Invalid JSON');
  const post = await prisma.blogPost
    .update({ where: { id: params.id }, data: normalizePost(body) })
    .catch(() => null);
  if (!post) return fail('Not found', 404);
  return ok(post);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  await prisma.blogPost.delete({ where: { id: params.id } }).catch(() => null);
  return ok();
}
