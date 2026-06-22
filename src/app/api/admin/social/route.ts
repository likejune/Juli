import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { sanitizeText, isValidUrl } from '@/lib/security';

const PLATFORMS = ['instagram', 'facebook', 'vk', 'youtube', 'tiktok', 'telegram', 'wechat', 'xiaohongshu', 'custom'];

export async function GET() {
  return ok(await prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } }));
}

export async function POST(req: NextRequest) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  const url = sanitizeText(body?.url, 500);
  const platform = PLATFORMS.includes(body?.platform) ? body.platform : 'custom';
  if (!isValidUrl(url)) return fail('Valid URL required');
  const link = await prisma.socialLink.create({
    data: {
      platform,
      label: sanitizeText(body?.label, 60) || platform,
      url,
      active: body?.active !== false,
      sortOrder: Math.round(Number(body?.sortOrder)) || 0,
    },
  });
  return ok(link, 201);
}
