import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { sanitizeText } from '@/lib/security';

type Ctx = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  if (!body) return fail('Invalid JSON');
  const data: any = {};
  for (const key of ['slug', 'nameRu', 'nameEn', 'nameZh'] as const) {
    if (body[key] !== undefined) data[key] = sanitizeText(body[key], 100);
  }
  if (body.sortOrder !== undefined) data.sortOrder = Math.round(Number(body.sortOrder)) || 0;
  const category = await prisma.artworkCategory
    .update({ where: { id: params.id }, data })
    .catch(() => null);
  if (!category) return fail('Not found', 404);
  return ok(category);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  await prisma.artworkCategory.delete({ where: { id: params.id } }).catch(() => null);
  return ok();
}
