import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getDict, getLocale, t, localized, dateFormat } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import Reveal from '@/components/Reveal';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('blog', getLocale());
}

export default async function BlogPage() {
  const locale = getLocale();
  const [dict, posts] = await Promise.all([
    getDict(locale),
    prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      include: {
        _count: { select: { likes: true, comments: { where: { status: 'approved' } } } },
      },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="text-center mb-16">
        <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-3">{t(dict, 'blog.kicker')}</p>
        <h1 className="font-serif text-5xl lg:text-6xl">{t(dict, 'blog.title')}</h1>
        <p className="text-ink-soft mt-5 max-w-xl mx-auto">{t(dict, 'blog.lead')}</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-ink-soft py-20">{t(dict, 'blog.empty')}</p>
      ) : (
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 110}>
              <article>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="overflow-hidden aspect-[4/3] bg-paper-warm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageUrl}
                      alt={localized(post, 'title', locale)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                  </div>
                  <div className="pt-6">
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest2 text-ink-soft mb-3">
                      <span className="text-gold-deep">{localized(post, 'category', locale)}</span>
                      <span className="w-4 h-px bg-line inline-block" />
                      <time>{dateFormat(post.publishedAt, locale)}</time>
                    </div>
                    <h2 className="font-serif text-2xl leading-snug group-hover:text-gold-deep transition-colors">
                      {localized(post, 'title', locale)}
                    </h2>
                    <p className="text-sm text-ink-soft mt-3 leading-relaxed line-clamp-3">
                      {localized(post, 'excerpt', locale)}
                    </p>
                    <div className="flex items-center gap-5 mt-5 text-xs text-ink-soft">
                      <span className="inline-flex items-center gap-1.5">
                        <HeartIcon /> {post._count.likes}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CommentIcon /> {post._count.comments}
                      </span>
                      <span className="ml-auto text-[11px] uppercase tracking-widest2 text-gold-deep">
                        {t(dict, 'blog.readMore')} →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s-7.5-4.6-9.8-9.2C.7 8.6 2.7 5 6.2 5c2.2 0 3.7 1.2 4.6 2.6.2.4.9.4 1.1 0C12.9 6.2 14.4 5 16.6 5c3.5 0 5.6 3.6 4.1 6.8C18.5 16.4 12 21 12 21z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M21 12a8 8 0 01-8 8H4l1.6-3.2A8 8 0 1121 12z" />
    </svg>
  );
}
