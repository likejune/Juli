import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { sanitizeText } from '@/lib/security';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

const BASE: Record<string, Record<string, string>> = { ru, en, zh };

/** Returns base dictionaries merged with DB overrides, plus the raw overrides. */
export async function GET() {
  const overrides = await prisma.translation.findMany();
  return ok({ base: BASE, overrides });
}

/** Upsert one override: { locale, key, value }. Empty value removes the override. */
export async function PUT(req: NextRequest) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  const locale = sanitizeText(body?.locale, 5);
  const key = sanitizeText(body?.key, 120);
  const value = typeof body?.value === 'string' ? body.value.slice(0, 5000) : '';
  if (!['ru', 'en', 'zh'].includes(locale) || !key) return fail('locale and key required');

  if (!value) {
    await prisma.translation.deleteMany({ where: { locale, key } });
    return ok({ removed: true });
  }
  const row = await prisma.translation.upsert({
    where: { locale_key: { locale, key } },
    update: { value },
    create: { locale, key, value },
  });
  return ok(row);
}
