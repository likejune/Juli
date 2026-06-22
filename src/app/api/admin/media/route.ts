import { NextRequest } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { guardMutation, ok, fail } from '@/lib/admin-api';
import { sanitizeText } from '@/lib/security';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_SIZE = 15 * 1024 * 1024; // 15 MB

export async function GET(req: NextRequest) {
  const q = sanitizeText(req.nextUrl.searchParams.get('q'), 100);
  const folder = sanitizeText(req.nextUrl.searchParams.get('folder'), 50);
  const files = await prisma.uploadedFile.findMany({
    where: {
      ...(q ? { filename: { contains: q } } : {}),
      ...(folder ? { folder } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });
  const folders = await prisma.uploadedFile.findMany({ select: { folder: true }, distinct: ['folder'] });
  return ok({ files, folders: folders.map((f) => f.folder) });
}

/** Multipart upload (supports multiple files). Stores in public/uploads/. */
export async function POST(req: NextRequest) {
  const guard = guardMutation(req);
  if (guard) return guard;

  if (process.env.VERCEL) {
    return fail(
      'File storage on Vercel is read-only. Use direct image URLs or connect Vercel Blob (see README).',
      501
    );
  }

  const form = await req.formData().catch(() => null);
  if (!form) return fail('multipart/form-data expected');
  const folder = sanitizeText(form.get('folder'), 50) || 'general';
  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  if (files.length === 0) return fail('No files');

  const dir = path.join(process.cwd(), 'public', 'uploads', folder.replace(/[^a-z0-9_-]/gi, ''));
  await mkdir(dir, { recursive: true });

  const saved = [];
  for (const file of files.slice(0, 20)) {
    if (!ALLOWED.includes(file.type) || file.size > MAX_SIZE) continue;
    const ext = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif' }[file.type]!;
    const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    const url = `/uploads/${path.basename(dir)}/${name}`;
    const row = await prisma.uploadedFile.create({
      data: { filename: sanitizeText(file.name, 200) || name, url, mimeType: file.type, size: file.size, folder },
    });
    saved.push(row);
  }
  if (saved.length === 0) return fail('No valid images (jpeg/png/webp/gif/avif, max 15 MB)');
  return ok(saved, 201);
}
