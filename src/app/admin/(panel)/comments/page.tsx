'use client';

import { useEffect, useState } from 'react';
import { api, PageHead, Toast, Empty } from '@/components/admin/ui';

const TABS = [
  { key: 'pending', label: 'На модерации' },
  { key: 'approved', label: 'Одобренные' },
  { key: 'rejected', label: 'Отклонённые' },
  { key: 'all', label: 'Все' },
];

export default function CommentsAdmin() {
  const [tab, setTab] = useState('pending');
  const [comments, setComments] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState('');

  const load = (t = tab) => {
    setLoaded(false);
    return api(`/api/admin/comments${t === 'all' ? '' : `?status=${t}`}`).then((c) => { setComments(c); setLoaded(true); });
  };
  useEffect(() => { load().catch(() => setLoaded(true)); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [tab]);
  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2000); };

  const setStatus = async (id: string, status: string) => {
    await api(`/api/admin/comments/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    notify(status === 'approved' ? 'Одобрено' : 'Отклонено');
    load();
  };
  const remove = async (id: string) => {
    if (!confirm('Удалить комментарий навсегда?')) return;
    await api(`/api/admin/comments/${id}`, { method: 'DELETE' });
    notify('Удалено');
    load();
  };

  return (
    <div>
      <PageHead title="Комментарии" subtitle="Модерация комментариев читателей">
        <div className="inline-flex rounded-lg border border-night-line overflow-hidden">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-xs transition-colors ${tab === t.key ? 'bg-gold text-night font-semibold' : 'text-mist hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </PageHead>

      {!loaded ? <Empty text="Загрузка…" /> : comments.length === 0 ? <Empty text="Комментариев нет" /> : (
        <div className="space-y-4 max-w-3xl">
          {comments.map((c) => (
            <div key={c.id} className="adm-card p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center font-serif">{c.authorName[0]?.toUpperCase()}</span>
                  <div>
                    <p className="text-sm text-white">{c.authorName}</p>
                    <p className="text-xs text-mist">{new Date(c.createdAt).toLocaleString('ru-RU')} · «{c.post.titleRu}»</p>
                  </div>
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                  c.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400' : c.status === 'pending' ? 'bg-gold/15 text-gold' : 'bg-red-500/15 text-red-400'
                }`}>{c.status}</span>
              </div>
              <p className="text-sm text-gray-300 mt-3.5 whitespace-pre-line">{c.content}</p>
              <div className="flex gap-2.5 mt-4">
                {c.status !== 'approved' && <button className="adm-btn !py-1.5 !px-4 text-xs" onClick={() => setStatus(c.id, 'approved')}>✓ Одобрить</button>}
                {c.status !== 'rejected' && <button className="adm-btn-ghost !py-1.5 !px-4 text-xs" onClick={() => setStatus(c.id, 'rejected')}>Отклонить</button>}
                <button className="adm-btn-ghost !py-1.5 !px-4 text-xs hover:!text-red-400" onClick={() => remove(c.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Toast message={toast} />
    </div>
  );
}
