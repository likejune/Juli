import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function AdminDashboard() {
  const since30 = new Date(Date.now() - 30 * 86_400_000);
  const today = new Date(new Date().toDateString());

  const [
    visitors30, views30, visitorsToday, viewsToday,
    artworks, posts, pendingComments, likes, recentComments,
  ] = await Promise.all([
    prisma.visitor.count({ where: { lastSeenAt: { gte: since30 } } }),
    prisma.pageView.count({ where: { createdAt: { gte: since30 } } }),
    prisma.visitor.count({ where: { lastSeenAt: { gte: today } } }),
    prisma.pageView.count({ where: { createdAt: { gte: today } } }),
    prisma.artwork.count(),
    prisma.blogPost.count(),
    prisma.comment.count({ where: { status: 'pending' } }),
    prisma.like.count(),
    prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { post: { select: { titleRu: true, slug: true } } },
    }),
  ]);

  const stats = [
    { label: 'Посетители (30 дн)', value: visitors30, hint: `${visitorsToday} сегодня` },
    { label: 'Просмотры (30 дн)', value: views30, hint: `${viewsToday} сегодня` },
    { label: 'Картины', value: artworks, href: '/admin/gallery' },
    { label: 'Статьи', value: posts, href: '/admin/blog' },
    { label: 'Лайки', value: likes },
    { label: 'На модерации', value: pendingComments, href: '/admin/comments', accent: pendingComments > 0 },
  ];

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white">Дашборд</h1>
          <p className="text-sm text-mist mt-1.5">Обзор сайта и активности посетителей</p>
        </div>
        <Link href="/admin/analytics" className="adm-btn-ghost">Полная аналитика →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {stats.map((s) => {
          const card = (
            <div className="adm-card p-5 h-full hover:border-gold/40 transition-colors">
              <p className="text-[11px] uppercase tracking-widest2 text-mist">{s.label}</p>
              <p className={`font-serif text-3xl mt-2 ${s.accent ? 'text-gold' : 'text-white'}`}>{s.value}</p>
              {s.hint && <p className="text-xs text-mist/70 mt-1">{s.hint}</p>}
            </div>
          );
          return s.href ? <Link key={s.label} href={s.href}>{card}</Link> : <div key={s.label}>{card}</div>;
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="adm-card p-6">
          <h2 className="text-sm uppercase tracking-widest2 text-mist mb-5">Последние комментарии</h2>
          {recentComments.length === 0 ? (
            <p className="text-mist text-sm">Комментариев пока нет.</p>
          ) : (
            <ul className="space-y-4">
              {recentComments.map((c) => (
                <li key={c.id} className="border-b border-night-line pb-3.5 last:border-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-sm text-white">{c.authorName}</span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        c.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400'
                        : c.status === 'pending' ? 'bg-gold/15 text-gold'
                        : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-mist line-clamp-2">{c.content}</p>
                  <p className="text-xs text-mist/60 mt-1">к статье «{c.post.titleRu}»</p>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/comments" className="inline-block mt-4 text-xs text-gold hover:underline">Модерация →</Link>
        </section>

        <section className="adm-card p-6">
          <h2 className="text-sm uppercase tracking-widest2 text-mist mb-5">Быстрые действия</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/admin/gallery', label: '+ Добавить картину' },
              { href: '/admin/blog', label: '+ Написать статью' },
              { href: '/admin/media', label: '⧉ Загрузить изображения' },
              { href: '/admin/settings', label: '✎ Цитата на главной' },
              { href: '/admin/biography', label: '❦ Редактировать биографию' },
              { href: '/admin/seo', label: '⌕ SEO-настройки' },
            ].map((a) => (
              <Link key={a.href + a.label} href={a.href} className="adm-card !bg-night-soft p-4 text-sm text-gray-300 hover:border-gold/40 hover:text-white transition-colors">
                {a.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
