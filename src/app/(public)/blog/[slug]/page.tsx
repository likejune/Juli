import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getDict, getLocale, t, localized, dateFormat } from '@/lib/i18n';
import LikeButton from '@/components/LikeButton';
import Comments from '@/components/Comments';
import PostViewTracker from '@/components/PostViewTracker';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = getLocale();
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  const title = localized(post, 'seoTitle', locale) || localized(post, 'title', locale);
  const description = localized(post, 'seoDesc', locale) || localized(post, 'excerpt', locale);
  return {
    title: `${title} — Julia Bunyakova`,
    description,
    openGraph: { title, description, images: [{ url: post.imageUrl }], type: 'article' },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const locale = getLocale();
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      comments: { where: { status: 'approved' }, orderBy: { createdAt: 'desc' } },
      _count: { select: { likes: true } },
    },
  });
  if (!post || post.status !== 'published') notFound();

  const dict = await getDict(locale);
  const paragraphs = localized(post, 'body', locale).split(/\n\n+/).filter(Boolean);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <PostViewTracker postId={post.id} />

      <Link href="/blog" className="text-[11px] uppercase tracking-widest2 text-ink-soft hover:text-ink transition-colors">
        ← {t(dict, 'blog.back')}
      </Link>

      <header className="mt-10 mb-10 text-center">
        <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest2 text-ink-soft mb-5">
          <span className="text-gold-deep">{localized(post, 'category', locale)}</span>
          <span className="w-4 h-px bg-line inline-block" />
          <time>{dateFormat(post.publishedAt, locale)}</time>
        </div>
        <h1 className="font-serif text-4xl lg:text-5xl leading-tight">{localized(post, 'title', locale)}</h1>
        <p className="font-serif italic text-lg text-ink-soft mt-6">{localized(post, 'excerpt', locale)}</p>
      </header>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.imageUrl} alt={localized(post, 'title', locale)} className="w-full h-auto mb-12" />

      <div className="prose-art">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="hairline my-12" />

      <div className="flex items-center justify-center mb-16">
        <LikeButton
          postId={post.id}
          initialCount={post._count.likes}
          label={t(dict, 'blog.likes')}
        />
      </div>

      <Comments
        postId={post.id}
        initial={post.comments.map((c) => ({
          id: c.id,
          authorName: c.authorName,
          content: c.content,
          createdAt: dateFormat(c.createdAt, locale),
        }))}
        labels={{
          title: t(dict, 'blog.comments'),
          empty: t(dict, 'blog.noComments'),
          name: t(dict, 'blog.commentName'),
          text: t(dict, 'blog.commentText'),
          submit: t(dict, 'blog.commentSubmit'),
          sent: t(dict, 'blog.commentSent'),
          error: t(dict, 'blog.commentError'),
        }}
      />
    </article>
  );
}
