import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { sanitizeText, isValidUrl } from '@/lib/security';

type Ctx = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  if (!body) return fail('Invalid JSON');
  const data: any = {};
  if (body.platform !== undefined) data.platform = sanitizeText(body.platform, 30);
  if (body.label !== undefined) data.label = sanitizeText(body.label, 60);
  if (body.url !== undefined) {
    const url = sanitizeText(body.url, 500);
    if (!isValidUrl(url)) return fail('Invalid URL');
    data.url = url;
  }
  if (body.active !== undefined) data.active = Boolean(body.active);
  if (body.sortOrder !== undefined) data.sortOrder = Math.round(Number(body.sortOrder)) || 0;
  const link = await prisma.socialLink.update({ where: { id: params.id }, data }).catch(() => null);
  if (!link) return fail('Not found', 404);
  return ok(link);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  await prisma.socialLink.delete({ where: { id: params.id } }).catch(() => null);
  return ok();
}
