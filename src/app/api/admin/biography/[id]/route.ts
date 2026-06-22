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
  if (body.title !== undefined) data.title = sanitizeText(body.title, 300);
  if (body.content !== undefined) data.content = sanitizeText(body.content, 20_000);
  if (body.meta !== undefined) data.meta = sanitizeText(body.meta, 100);
  if (body.sortOrder !== undefined) data.sortOrder = Math.round(Number(body.sortOrder)) || 0;
  const entry = await prisma.biographyEntry.update({ where: { id: params.id }, data }).catch(() => null);
  if (!entry) return fail('Not found', 404);
  return ok(entry);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  await prisma.biographyEntry.delete({ where: { id: params.id } }).catch(() => null);
  return ok();
}
