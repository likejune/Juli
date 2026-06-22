import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok } from '@/lib/admin-api';

function count<T>(rows: T[], key: (r: T) => string): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = key(r) || 'Unknown';
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

/**
 * Full analytics payload for the admin panel.
 * ?days=7|30|90|365  (default 30)
 * ?granularity=day|month — month is used for the yearly view
 */
export async function GET(req: NextRequest) {
  const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get('days')) || 30, 1), 730);
  const granularity = req.nextUrl.searchParams.get('granularity') === 'month' ? 'month' : 'day';
  const since = new Date(Date.now() - days * 86_400_000);

  const [views, visitors, totalVisitors, totalViews, pendingComments, likes] = await Promise.all([
    prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      select: { path: true, kind: true, entityId: true, duration: true, createdAt: true, visitorId: true },
    }),
    prisma.visitor.findMany({
      where: { lastSeenAt: { gte: since } },
      select: { id: true, country: true, device: true, os: true, browser: true, referrerType: true, referrerSource: true, firstSeenAt: true },
    }),
    prisma.visitor.count(),
    prisma.pageView.count(),
    prisma.comment.count({ where: { status: 'pending' } }),
    prisma.like.count(),
  ]);

  // ---- time series ----
  const bucket = (d: Date) =>
    granularity === 'month' ? d.toISOString().slice(0, 7) : d.toISOString().slice(0, 10);
  const seriesMap = new Map<string, { views: number; visitors: Set<string> }>();
  // pre-fill empty buckets so charts have a continuous axis
  const steps = granularity === 'month' ? Math.ceil(days / 30) : days;
  for (let i = steps - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * (granularity === 'month' ? 30 : 1) * 86_400_000);
    seriesMap.set(bucket(d), { views: 0, visitors: new Set() });
  }
  for (const v of views) {
    const k = bucket(v.createdAt);
    const cell = seriesMap.get(k) ?? { views: 0, visitors: new Set() };
    cell.views += 1;
    cell.visitors.add(v.visitorId);
    seriesMap.set(k, cell);
  }
  const series = [...seriesMap.entries()].map(([date, c]) => ({
    date,
    views: c.views,
    visitors: c.visitors.size,
  }));

  // ---- engagement ----
  const perVisitor = new Map<string, number>();
  for (const v of views) perVisitor.set(v.visitorId, (perVisitor.get(v.visitorId) ?? 0) + 1);
  const sessions = perVisitor.size || 1;
  const bounces = [...perVisitor.values()].filter((n) => n === 1).length;
  const durations = views.filter((v) => v.duration > 0).map((v) => v.duration);
  const avgDuration = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 0;

  // ---- popular content ----
  const pageCounts = count(views.filter((v) => v.kind === 'page'), (v) => v.path).slice(0, 10);

  const topEntities = async (kind: 'artwork' | 'post') => {
    const counts = count(views.filter((v) => v.kind === kind && v.entityId), (v) => v.entityId!).slice(0, 8);
    if (counts.length === 0) return [];
    const ids = counts.map((c) => c.name);
    const rows =
      kind === 'artwork'
        ? await prisma.artwork.findMany({ where: { id: { in: ids } }, select: { id: true, titleRu: true, imageUrl: true, views: true } })
        : await prisma.blogPost.findMany({ where: { id: { in: ids } }, select: { id: true, titleRu: true, imageUrl: true, views: true } });
    return counts
      .map((c) => {
        const row = rows.find((r) => r.id === c.name);
        return row ? { id: row.id, title: row.titleRu, imageUrl: row.imageUrl, periodViews: c.value, totalViews: row.views } : null;
      })
      .filter(Boolean);
  };

  const [topArtworks, topPosts] = await Promise.all([topEntities('artwork'), topEntities('post')]);

  return ok({
    totals: {
      visitors: visitors.length,
      pageViews: views.length,
      allTimeVisitors: totalVisitors,
      allTimePageViews: totalViews,
      pendingComments,
      likes,
      avgDuration,
      pagesPerVisit: Math.round((views.length / sessions) * 10) / 10,
      bounceRate: Math.round((bounces / sessions) * 100),
    },
    series,
    devices: count(visitors, (v) => v.device),
    os: count(visitors, (v) => v.os),
    browsers: count(visitors, (v) => v.browser),
    countries: count(visitors, (v) => v.country).slice(0, 30),
    referrerTypes: count(visitors, (v) => v.referrerType),
    referrerSources: count(visitors.filter((v) => v.referrerSource), (v) => v.referrerSource).slice(0, 10),
    topPages: pageCounts,
    topArtworks,
    topPosts,
  });
}
