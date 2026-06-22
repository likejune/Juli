import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getDict, getLocale, t, localized } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import GalleryGrid, { type GalleryItem } from '@/components/GalleryGrid';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('gallery', getLocale());
}

export default async function GalleryPage() {
  const locale = getLocale();
  const [dict, artworks, categories] = await Promise.all([
    getDict(locale),
    prisma.artwork.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      include: { category: true },
    }),
    prisma.artworkCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  const items: GalleryItem[] = artworks.map((a) => ({
    id: a.id,
    imageUrl: a.imageUrl,
    title: localized(a, 'title', locale),
    description: localized(a, 'description', locale),
    technique: localized(a, 'technique', locale),
    year: a.year,
    dimensions: a.widthCm && a.heightCm ? `${a.widthCm} × ${a.heightCm} ${t(dict, 'gallery.cm')}` : '',
    categorySlug: a.category?.slug ?? '',
    categoryName: a.category ? localized(a.category, 'name', locale) : '',
  }));

  const filterCategories = categories.map((c) => ({
    slug: c.slug,
    name: localized(c, 'name', locale),
  }));

  return (
    <div className="max-w-[1700px] mx-auto px-6 lg:px-10 py-16">
      <div className="text-center mb-14">
        <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-3">{t(dict, 'gallery.kicker')}</p>
        <h1 className="font-serif text-5xl lg:text-6xl">{t(dict, 'gallery.title')}</h1>
        <p className="text-ink-soft mt-5 max-w-xl mx-auto">{t(dict, 'gallery.lead')}</p>
      </div>
      <GalleryGrid
        items={items}
        categories={filterCategories}
        labels={{
          all: t(dict, 'gallery.all'),
          year: t(dict, 'gallery.year'),
          technique: t(dict, 'gallery.technique'),
          dimensions: t(dict, 'gallery.dimensions'),
          category: t(dict, 'gallery.category'),
          close: t(dict, 'gallery.close'),
          prev: t(dict, 'gallery.prev'),
          next: t(dict, 'gallery.next'),
          empty: t(dict, 'gallery.empty'),
        }}
      />
    </div>
  );
}
