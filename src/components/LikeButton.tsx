'use client';

import { useEffect, useState } from 'react';

export default function LikeButton({
  postId,
  initialCount,
  label,
}: {
  postId: string;
  initialCount: number;
  label: string;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/likes?postId=${encodeURIComponent(postId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setCount(data.count);
          setLiked(data.liked);
        }
      })
      .catch(() => {});
  }, [postId]);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
        setLiked(data.liked);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`group inline-flex items-center gap-3 border px-7 py-3.5 transition-colors duration-300 ${
        liked ? 'border-gold bg-gold/10 text-gold-deep' : 'border-line text-ink-soft hover:border-gold hover:text-gold-deep'
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        className="transition-transform group-active:scale-125"
      >
        <path d="M12 21s-7.5-4.6-9.8-9.2C.7 8.6 2.7 5 6.2 5c2.2 0 3.7 1.2 4.6 2.6.2.4.9.4 1.1 0C12.9 6.2 14.4 5 16.6 5c3.5 0 5.6 3.6 4.1 6.8C18.5 16.4 12 21 12 21z" />
      </svg>
      <span className="text-[11px] uppercase tracking-widest2">{label}</span>
      <span className="font-serif text-lg">{count}</span>
    </button>
  );
}
