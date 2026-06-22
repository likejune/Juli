import type { Metadata } from 'next';
import { prisma } from './db';
import type { Locale } from './i18n';

/** Builds Next.js metadata for a public page from the SEO settings stored in the database. */
export async function pageMetadata(page: string, locale: Locale): Promise<Metadata> {
  const seo = await prisma.seoSetting.findUnique({ where: { page_locale: { page, locale } } }).catch(() => null);
  if (!seo) return {};
  return {
    title: seo.metaTitle || undefined,
    description: seo.metaDescription || undefined,
    keywords: seo.keywords || undefined,
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || undefined,
      description: seo.ogDescription || seo.metaDescription || undefined,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
      type: 'website',
    },
  };
}
