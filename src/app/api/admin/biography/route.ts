import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { sanitizeText } from '@/lib/security';

const SECTIONS = ['bio', 'path', 'philosophy', 'quote', 'exhibition', 'achievement', 'publication'];
const LOCALES = ['ru', 'en', 'zh'];

export async function GET(req: NextRequest) {
  const locale = sanitizeText(req.nextUrl.searchParams.get('locale'), 5);
  const where = LOCALES.includes(locale) ? { locale } : {};
  const entries = await prisma.biographyEntry.findMany({
    where,
    orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }],
  });
  return ok(entries);
}

export async function POST(req: NextRequest) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  if (!body || !SECTIONS.includes(body.section) || !LOCALES.includes(body.locale)) {
    return fail('Valid section and locale required');
  }
  const entry = await prisma.biographyEntry.create({
    data: {
      section: body.section,
      locale: body.locale,
      title: sanitizeText(body.title, 300),
      content: sanitizeText(body.content, 20_000),
      meta: sanitizeText(body.meta, 100),
      sortOrder: Math.round(Number(body.sortOrder)) || 0,
    },
  });
  return ok(entry, 201);
}
