import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { normalizeArtwork } from '@/lib/normalize';

type Ctx = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  if (!body) return fail('Invalid JSON');
  const artwork = await prisma.artwork
    .update({ where: { id: params.id }, data: normalizeArtwork(body) })
    .catch(() => null);
  if (!artwork) return fail('Not found', 404);
  return ok(artwork);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  await prisma.artwork.delete({ where: { id: params.id } }).catch(() => null);
  return ok();
}
