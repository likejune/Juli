'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, BarElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { api, PageHead, StatCard, Empty } from '@/components/admin/ui';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend, Filler);

const GOLD = '#b08d57';
const PALETTE = ['#b08d57', '#5b8db8', '#7aa874', '#c47f7f', '#8d7ab8', '#b8a55b', '#5bb8ab', '#b85b8d'];
const RANGES = [
  { days: 7, granularity: 'day', label: '7 дней' },
  { days: 30, granularity: 'day', label: '30 дней' },
  { days: 90, granularity: 'day', label: '90 дней' },
  { days: 365, granularity: 'month', label: 'Год' },
];

const gridOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#9aa4b2', boxWidth: 12 } } },
  scales: {
    x: { ticks: { color: '#9aa4b2', maxTicksLimit: 12 }, grid: { color: '#262d38' } },
    y: { ticks: { color: '#9aa4b2', precision: 0 }, grid: { color: '#262d38' } },
  },
} as any;

function fmtDuration(s: number) {
  return s >= 60 ? `${Math.floor(s / 60)} мин ${s % 60} с` : `${s} с`;
}

export default function AnalyticsPage() {
  const [range, setRange] = useState(RANGES[1]);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(null);
    api(`/api/admin/analytics?days=${range.days}&granularity=${range.granularity}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [range]);

  if (error) return <Empty text={`Ошибка: ${error}`} />;

  return (
    <div>
      <PageHead title="Аналитика" subtitle="Посетители, источники, устройства и география">
        <div className="inline-flex rounded-lg border border-night-line overflow-hidden">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setRange(r)}
              className={`px-4 py-2 text-xs transition-colors ${range.days === r.days ? 'bg-gold text-night font-semibold' : 'text-mist hover:text-white'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </PageHead>

      {!data ? (
        <Empty text="Загрузка…" />
      ) : (
        <>
          {/* stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatCard label="Посетители" value={data.totals.visitors} hint={`всего: ${data.totals.allTimeVisitors}`} />
            <StatCard label="Просмотры" value={data.totals.pageViews} hint={`всего: ${data.totals.allTimePageViews}`} />
            <StatCard label="Время на сайте" value={fmtDuration(data.totals.avgDuration)} hint="в среднем" />
            <StatCard label="Страниц за визит" value={data.totals.pagesPerVisit} />
            <StatCard label="Показатель отказов" value={`${data.totals.bounceRate}%`} />
            <StatCard label="Лайки" value={data.totals.likes} accent />
          </div>

          {/* visits over time */}
          <section className="adm-card p-6 mb-6">
            <h2 className="text-sm uppercase tracking-widest2 text-mist mb-4">
              Посещения {range.granularity === 'month' ? 'по месяцам' : 'по дням'}
            </h2>
            <div className="h-72">
              <Line
                data={{
                  labels: data.series.map((s: any) => s.date),
                  datasets: [
                    {
                      label: 'Просмотры',
                      data: data.series.map((s: any) => s.views),
                      borderColor: GOLD, backgroundColor: 'rgba(176,141,87,0.15)',
                      fill: true, tension: 0.35, pointRadius: 2,
                    },
                    {
                      label: 'Посетители',
                      data: data.series.map((s: any) => s.visitors),
                      borderColor: '#5b8db8', backgroundColor: 'transparent',
                      tension: 0.35, pointRadius: 2,
                    },
                  ],
                }}
                options={gridOpts}
              />
            </div>
          </section>

          {/* sources + devices */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            <DoughnutCard title="Источники трафика" items={data.referrerTypes} nameMap={{ direct: 'Прямые', search: 'Поиск', social: 'Соцсети', external: 'Сайты', campaign: 'Кампании' }} />
            <DoughnutCard title="Устройства" items={data.devices} nameMap={{ desktop: 'Десктоп', mobile: 'Мобильные', tablet: 'Планшеты' }} />
            <BarCard title="Браузеры" items={data.browsers} />
            <BarCard title="Операционные системы" items={data.os} />
          </div>

          {/* geography */}
          <section className="adm-card p-6 mb-6">
            <h2 className="text-sm uppercase tracking-widest2 text-mist mb-4">География посетителей</h2>
            <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">
              <WorldMap countries={data.countries} />
              <div>
                <h3 className="text-xs uppercase tracking-widest2 text-mist mb-3">Топ стран</h3>
                {data.countries.length === 0 ? (
                  <p className="text-sm text-mist">Пока нет данных.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.countries.slice(0, 12).map((c: any) => (
                      <li key={c.name} className="flex items-center gap-3 text-sm">
                        <span className="w-12 text-mist">{c.name}</span>
                        <div className="flex-1 h-2 bg-night-soft rounded-full overflow-hidden">
                          <div className="h-full bg-gold" style={{ width: `${(c.value / data.countries[0].value) * 100}%` }} />
                        </div>
                        <span className="w-10 text-right text-white">{c.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* popular content */}
          <div className="grid lg:grid-cols-3 gap-6">
            <ListCard title="Популярные страницы" rows={data.topPages.map((p: any) => ({ label: p.name, value: p.value }))} />
            <MediaListCard title="Популярные картины" rows={data.topArtworks} />
            <MediaListCard title="Популярные статьи" rows={data.topPosts} />
          </div>

          {data.referrerSources.length > 0 && (
            <section className="adm-card p-6 mt-6">
              <h2 className="text-sm uppercase tracking-widest2 text-mist mb-4">Источники переходов</h2>
              <ListCard plain rows={data.referrerSources.map((s: any) => ({ label: s.name, value: s.value }))} />
            </section>
          )}
        </>
      )}
    </div>
  );
}

function DoughnutCard({ title, items, nameMap = {} }: { title: string; items: any[]; nameMap?: Record<string, string> }) {
  return (
    <section className="adm-card p-6">
      <h2 className="text-sm uppercase tracking-widest2 text-mist mb-4">{title}</h2>
      {items.length === 0 ? <p className="text-sm text-mist">Нет данных.</p> : (
        <div className="h-52">
          <Doughnut
            data={{
              labels: items.map((i) => nameMap[i.name] ?? i.name),
              datasets: [{ data: items.map((i) => i.value), backgroundColor: PALETTE, borderColor: '#1a2029', borderWidth: 2 }],
            }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#9aa4b2', boxWidth: 12 } } } }}
          />
        </div>
      )}
    </section>
  );
}

function BarCard({ title, items }: { title: string; items: any[] }) {
  return (
    <section className="adm-card p-6">
      <h2 className="text-sm uppercase tracking-widest2 text-mist mb-4">{title}</h2>
      {items.length === 0 ? <p className="text-sm text-mist">Нет данных.</p> : (
        <div className="h-52">
          <Bar
            data={{
              labels: items.map((i) => i.name),
              datasets: [{ data: items.map((i) => i.value), backgroundColor: GOLD, borderRadius: 4 }],
            }}
            options={{ ...gridOpts, indexAxis: 'y' as const, plugins: { legend: { display: false } } }}
          />
        </div>
      )}
    </section>
  );
}

function ListCard({ title, rows, plain }: { title?: string; rows: { label: string; value: number }[]; plain?: boolean }) {
  const body = rows.length === 0 ? <p className="text-sm text-mist">Нет данных.</p> : (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="flex justify-between gap-4 text-sm border-b border-night-line pb-2 last:border-0">
          <span className="text-gray-300 truncate">{r.label}</span>
          <span className="text-gold shrink-0">{r.value}</span>
        </li>
      ))}
    </ul>
  );
  if (plain) return body;
  return (
    <section className="adm-card p-6">
      <h2 className="text-sm uppercase tracking-widest2 text-mist mb-4">{title}</h2>
      {body}
    </section>
  );
}

function MediaListCard({ title, rows }: { title: string; rows: any[] }) {
  return (
    <section className="adm-card p-6">
      <h2 className="text-sm uppercase tracking-widest2 text-mist mb-4">{title}</h2>
      {rows.length === 0 ? <p className="text-sm text-mist">Нет данных.</p> : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.imageUrl} alt="" className="w-11 h-11 object-cover rounded-lg border border-night-line" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-200 truncate">{r.title}</p>
                <p className="text-xs text-mist">{r.periodViews} за период · {r.totalViews} всего</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Inline SVG world choropleth — colors countries by visitor count (ISO-2 ids). */
function WorldMap({ countries }: { countries: { name: string; value: number }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');
  const [tip, setTip] = useState('');

  useEffect(() => {
    fetch('/world-map.svg').then((r) => r.text()).then(setSvg).catch(() => {});
  }, []);

  const paint = useCallback(() => {
    const root = ref.current?.querySelector('svg');
    if (!root) return;
    root.setAttribute('width', '100%');
    root.removeAttribute('height');
    const max = countries[0]?.value ?? 0;
    const byCode = new Map(countries.map((c) => [c.name.toLowerCase(), c.value]));
    root.querySelectorAll<SVGPathElement>('path[id]').forEach((p) => {
      const v = byCode.get(p.id) ?? 0;
      const intensity = max > 0 ? v / max : 0;
      p.style.fill = v > 0 ? `rgba(176,141,87,${0.25 + intensity * 0.75})` : '#222933';
      p.style.stroke = '#0e1116';
      p.style.strokeWidth = '0.4';
      p.style.cursor = v > 0 ? 'pointer' : 'default';
      p.onmouseenter = () => setTip(`${p.getAttribute('name') ?? p.id.toUpperCase()}: ${v}`);
      p.onmouseleave = () => setTip('');
    });
  }, [countries]);

  useEffect(() => {
    if (svg) requestAnimationFrame(paint);
  }, [svg, paint]);

  return (
    <div className="relative">
      {tip && (
        <div className="absolute top-2 left-2 bg-night-soft border border-night-line rounded-lg px-3 py-1.5 text-xs text-white z-10">
          {tip}
        </div>
      )}
      {svg ? (
        <div ref={ref} dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <p className="text-sm text-mist py-16 text-center">Загрузка карты…</p>
      )}
    </div>
  );
}
