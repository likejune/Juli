import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { guardMutation, readJson, ok, fail } from '@/lib/admin-api';
import { sanitizeText } from '@/lib/security';

const PAGES = ['home', 'gallery', 'about', 'blog', 'contacts'];
const LOCALES = ['ru', 'en', 'zh'];

export async function GET() {
  return ok(await prisma.seoSetting.findMany({ orderBy: [{ page: 'asc' }, { locale: 'asc' }] }));
}

/** Upsert SEO fields for one page+locale. */
export async function PUT(req: NextRequest) {
  const guard = guardMutation(req);
  if (guard) return guard;
  const body = await readJson(req);
  const page = sanitizeText(body?.page, 20);
  const locale = sanitizeText(body?.locale, 5);
  if (!PAGES.includes(page) || !LOCALES.includes(locale)) return fail('Valid page and locale required');

  const fields = {
    metaTitle: sanitizeText(body?.metaTitle, 200),
    metaDescription: sanitizeText(body?.metaDescription, 500),
    ogTitle: sanitizeText(body?.ogTitle, 200),
    ogDescription: sanitizeText(body?.ogDescription, 500),
    ogImage: sanitizeText(body?.ogImage, 600),
    keywords: sanitizeText(body?.keywords, 500),
  };
  const row = await prisma.seoSetting.upsert({
    where: { page_locale: { page, locale } },
    update: fields,
    create: { page, locale, ...fields },
  });
  return ok(row);
}
