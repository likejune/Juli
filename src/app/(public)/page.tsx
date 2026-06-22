import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getDict, getLocale, t, localized, dateFormat } from '@/lib/i18n';
import { getSettings } from '@/lib/settings';
import { pageMetadata } from '@/lib/seo';
import Reveal from '@/components/Reveal';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('home', getLocale());
}

export default async function HomePage() {
  const locale = getLocale();
  const [dict, settings, featured, news] = await Promise.all([
    getDict(locale),
    getSettings(['quote_ru', 'quote_en', 'quote_zh']),
    prisma.artwork.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      take: 3,
    }),
    prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
  ]);

  const quote = settings[`quote_${locale}`] ?? settings.quote_ru ?? '';

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-28 lg:pt-32 lg:pb-40 text-center">
          <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-7 animate-fade-up">
            {t(dict, 'home.kicker')}
          </p>
          <h1
            className="font-serif uppercase leading-[0.95] tracking-[0.06em] text-[clamp(3rem,9vw,7.5rem)] animate-fade-up"
            style={{ animationDelay: '120ms' }}
          >
            Julia
            <br />
            Bunyakova
          </h1>
          <p
            className="font-serif italic text-xl lg:text-2xl text-ink-soft max-w-2xl mx-auto mt-9 leading-relaxed animate-fade-up"
            style={{ animationDelay: '260ms' }}
          >
            {quote}
          </p>
          <div className="mt-12 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-3 border border-ink px-9 py-4 text-[11px] uppercase tracking-widest2 hover:bg-ink hover:text-paper transition-colors duration-300"
            >
              {t(dict, 'home.viewGallery')}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        <div className="hairline max-w-5xl mx-auto" />
      </section>

      {/* ---------------- featured works ---------------- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <Reveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-3">{t(dict, 'gallery.kicker')}</p>
              <h2 className="font-serif text-4xl lg:text-5xl">{t(dict, 'home.featured')}</h2>
            </div>
            <Link href="/gallery" className="hidden sm:block text-[11px] uppercase tracking-widest2 text-ink-soft hover:text-ink transition-colors">
              {t(dict, 'home.viewGallery')} →
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((a, i) => (
            <Reveal key={a.id} delay={i * 120}>
              <Link href="/gallery" className="group block">
                <div className="overflow-hidden bg-paper-warm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.imageUrl}
                    alt={localized(a, 'title', locale)}
                    loading="lazy"
                    className="w-full h-auto group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <h3 className="font-serif text-xl">{localized(a, 'title', locale)}</h3>
                  <span className="text-xs text-ink-soft">{a.year}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- latest news from the blog ---------------- */}
      <section className="bg-paper-warm border-y border-line">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-3">{t(dict, 'blog.kicker')}</p>
              <h2 className="font-serif text-4xl lg:text-5xl">{t(dict, 'home.latestNews')}</h2>
              <p className="text-ink-soft mt-4">{t(dict, 'home.newsLead')}</p>
            </div>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-3">
            {news.map((post, i) => (
              <Reveal key={post.id} delay={i * 120}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="overflow-hidden aspect-[4/3] bg-line/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageUrl}
                      alt={localized(post, 'title', locale)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                  </div>
                  <div className="pt-5">
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest2 text-ink-soft mb-3">
                      <span className="text-gold-deep">{localized(post, 'category', locale)}</span>
                      <span className="w-4 h-px bg-line inline-block" />
                      <time>{dateFormat(post.publishedAt, locale)}</time>
                    </div>
                    <h3 className="font-serif text-2xl leading-snug group-hover:text-gold-deep transition-colors">
                      {localized(post, 'title', locale)}
                    </h3>
                    <p className="text-sm text-ink-soft mt-3 leading-relaxed line-clamp-3">
                      {localized(post, 'excerpt', locale)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="text-center mt-14">
              <Link
                href="/blog"
                className="inline-block border border-ink/30 px-8 py-3.5 text-[11px] uppercase tracking-widest2 text-ink-soft hover:border-ink hover:text-ink transition-colors"
              >
                {t(dict, 'home.allPosts')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
