'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Reveal from './Reveal';
import { trackEntity } from './AnalyticsTracker';

export type GalleryItem = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  technique: string;
  year: number;
  dimensions: string;
  categorySlug: string;
  categoryName: string;
};

type Labels = {
  all: string;
  year: string;
  technique: string;
  dimensions: string;
  category: string;
  close: string;
  prev: string;
  next: string;
  empty: string;
};

export default function GalleryGrid({
  items,
  categories,
  labels,
}: {
  items: GalleryItem[];
  categories: { slug: string; name: string }[];
  labels: Labels;
}) {
  const [filter, setFilter] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter ? items.filter((i) => i.categorySlug === filter) : items),
    [items, filter]
  );

  const open = useCallback(
    (index: number) => {
      setOpenIndex(index);
      trackEntity('artwork', visible[index].id);
    },
    [visible]
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((prev) => {
        if (prev === null) return prev;
        const next = (prev + dir + visible.length) % visible.length;
        trackEntity('artwork', visible[next].id);
        return next;
      });
    },
    [visible]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [openIndex, step]);

  const current = openIndex !== null ? visible[openIndex] : null;

  return (
    <>
      {/* ---------- category filter ---------- */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <FilterChip active={filter === ''} onClick={() => setFilter('')}>
          {labels.all}
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.slug} active={filter === c.slug} onClick={() => setFilter(c.slug)}>
            {c.name}
          </FilterChip>
        ))}
      </div>

      {/* ---------- masonry grid ---------- */}
      {visible.length === 0 ? (
        <p className="text-center text-ink-soft py-20">{labels.empty}</p>
      ) : (
        <div className="masonry">
          {visible.map((item, i) => (
            <div key={item.id} className="masonry-item">
              <Reveal delay={(i % 4) * 80}>
                <button onClick={() => open(i)} className="group block w-full text-left">
                  <div className="overflow-hidden bg-paper-warm relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-auto group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500 flex items-end">
                      <span className="text-paper text-[10px] uppercase tracking-widest2 m-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {item.categoryName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mt-3 mb-1">
                    <h3 className="font-serif text-lg leading-snug">{item.title}</h3>
                    <span className="text-xs text-ink-soft shrink-0 ml-3">{item.year}</span>
                  </div>
                  <p className="text-xs text-ink-soft">{item.technique}{item.dimensions ? ` · ${item.dimensions}` : ''}</p>
                </button>
              </Reveal>
            </div>
          ))}
        </div>
      )}

      {/* ---------- modal viewer ---------- */}
      {current && (
        <div className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
          <button
            onClick={() => setOpenIndex(null)}
            aria-label={labels.close}
            className="absolute top-5 right-6 z-10 text-paper/70 hover:text-paper text-[11px] uppercase tracking-widest2 flex items-center gap-2"
          >
            {labels.close} <span className="text-xl leading-none">×</span>
          </button>

          <button onClick={() => step(-1)} aria-label={labels.prev} className="absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 z-10 text-paper/60 hover:text-paper text-4xl font-serif p-3">
            ←
          </button>
          <button onClick={() => step(1)} aria-label={labels.next} className="absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 z-10 text-paper/60 hover:text-paper text-4xl font-serif p-3">
            →
          </button>

          <div className="h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 px-6 lg:px-24 py-16 overflow-y-auto">
            <div className="flex-1 flex items-center justify-center min-h-0 max-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.imageUrl}
                alt={current.title}
                className="max-h-[62vh] lg:max-h-[82vh] max-w-full w-auto h-auto shadow-2xl"
              />
            </div>
            <div className="lg:w-[340px] shrink-0 text-paper">
              <p className="text-[10px] uppercase tracking-widest2 text-gold mb-3">{current.categoryName}</p>
              <h2 className="font-serif text-3xl mb-5">{current.title}</h2>
              <p className="text-sm text-paper/70 leading-relaxed mb-7">{current.description}</p>
              <dl className="space-y-2.5 text-sm border-t border-paper/15 pt-5">
                <Row k={labels.year} v={String(current.year)} />
                <Row k={labels.technique} v={current.technique} />
                {current.dimensions && <Row k={labels.dimensions} v={current.dimensions} />}
              </dl>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 text-[11px] uppercase tracking-widest2 border transition-colors duration-300 ${
        active ? 'border-ink bg-ink text-paper' : 'border-line text-ink-soft hover:border-ink/50 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-paper/50 uppercase tracking-widest2 text-[10px] pt-0.5">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
