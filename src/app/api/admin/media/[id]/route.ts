import { NextRequest } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/db';
import { guardMutation, ok, fail } from '@/lib/admin-api';

type Ctx = { params: { id: string } };

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const file = await prisma.uploadedFile.findUnique({ where: { id: params.id } });
  if (!file) return fail('Not found', 404);

  if (file.url.startsWith('/uploads/') && !process.env.VERCEL) {
    const safe = path.normalize(file.url).replace(/^([/\\.])+/, '');
    await unlink(path.join(process.cwd(), 'public', safe)).catch(() => {});
  }
  await prisma.uploadedFile.delete({ where: { id: params.id } });
  return ok();
}
