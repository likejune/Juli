'use client';

import { useState } from 'react';

type CommentView = { id: string; authorName: string; content: string; createdAt: string };
type Labels = { title: string; empty: string; name: string; text: string; submit: string; sent: string; error: string };

export default function Comments({
  postId,
  initial,
  labels,
}: {
  postId: string;
  initial: CommentView[];
  labels: Labels;
}) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, authorName: name, content: text }),
      });
      if (!res.ok) throw new Error();
      setState('sent');
      setName('');
      setText('');
    } catch {
      setState('error');
    }
  };

  return (
    <section>
      <h2 className="font-serif text-3xl mb-8 text-center">
        {labels.title} <span className="text-gold-deep">({initial.length})</span>
      </h2>

      {initial.length === 0 ? (
        <p className="text-center text-sm text-ink-soft mb-10">{labels.empty}</p>
      ) : (
        <ul className="space-y-7 mb-12">
          {initial.map((c) => (
            <li key={c.id} className="border-b border-line pb-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-medium">{c.authorName}</span>
                <time className="text-xs text-ink-soft">{c.createdAt}</time>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">{c.content}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="bg-paper-warm border border-line p-7 space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={labels.name}
          maxLength={60}
          required
          className="w-full bg-paper border border-line px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={labels.text}
          rows={4}
          maxLength={1500}
          required
          className="w-full bg-paper border border-line px-4 py-3 text-sm outline-none focus:border-gold transition-colors resize-y"
        />
        <div className="flex items-center gap-5">
          <button
            type="submit"
            disabled={state === 'sending'}
            className="border border-ink px-8 py-3 text-[11px] uppercase tracking-widest2 hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
          >
            {labels.submit}
          </button>
          {state === 'sent' && <p className="text-sm text-gold-deep">{labels.sent}</p>}
          {state === 'error' && <p className="text-sm text-red-600">{labels.error}</p>}
        </div>
      </form>
    </section>
  );
}
