import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { sanitizeText } from '@/lib/security';

export async function GET() {
  const rows = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
  return ok(Object.fromEntries(rows.map((r) => [r.key, r.value])));
}

/** Bulk upsert: { "quote_ru": "...", "contact_email": "..." } */
export async function PUT(req: NextRequest) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  if (!body || typeof body !== 'object') return fail('Invalid JSON');

  const entries = Object.entries(body).slice(0, 100);
  for (const [rawKey, rawValue] of entries) {
    const key = sanitizeText(rawKey, 100);
    const value = typeof rawValue === 'string' ? rawValue.slice(0, 10_000) : String(rawValue);
    if (!key) continue;
    await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  return ok();
}
