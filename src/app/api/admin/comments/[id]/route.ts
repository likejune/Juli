import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';

type Ctx = { params: { id: string } };

/** Moderation: approve / reject a comment. */
export async function PUT(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  const status = body?.status;
  if (!['pending', 'approved', 'rejected'].includes(status)) return fail('Invalid status');
  const comment = await prisma.comment
    .update({ where: { id: params.id }, data: { status } })
    .catch(() => null);
  if (!comment) return fail('Not found', 404);
  return ok(comment);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  await prisma.comment.delete({ where: { id: params.id } }).catch(() => null);
  return ok();
}
