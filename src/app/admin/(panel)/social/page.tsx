'use client';

import { useEffect, useState } from 'react';
import { api, PageHead, Field, Toast, Empty } from '@/components/admin/ui';

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'vk', label: 'ВКонтакте' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'wechat', label: 'WeChat (微信)' },
  { key: 'xiaohongshu', label: 'Xiaohongshu (小红书)' },
  { key: 'custom', label: 'Другая ссылка' },
];

export default function SocialAdmin() {
  const [links, setLinks] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState('');

  const load = () => api('/api/admin/social').then((l) => { setLinks(l); setLoaded(true); });
  useEffect(() => { load().catch(() => setLoaded(true)); }, []);
  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const save = async (form: any) => {
    if (form.id) await api(`/api/admin/social/${form.id}`, { method: 'PUT', body: JSON.stringify(form) });
    else await api('/api/admin/social', { method: 'POST', body: JSON.stringify(form) });
    setEditing(null);
    notify('Сохранено');
    load();
  };
  const toggle = async (l: any) => {
    await api(`/api/admin/social/${l.id}`, { method: 'PUT', body: JSON.stringify({ active: !l.active }) });
    load();
  };
  const remove = async (id: string) => {
    if (!confirm('Удалить ссылку?')) return;
    await api(`/api/admin/social/${id}`, { method: 'DELETE' });
    notify('Удалено');
    load();
  };

  return (
    <div>
      <PageHead title="Социальные сети" subtitle="Ссылки отображаются в подвале и на странице контактов">
        <button className="adm-btn" onClick={() => setEditing({ platform: 'instagram', label: '', url: '', active: true, sortOrder: links.length + 1 })}>
          + Добавить ссылку
        </button>
      </PageHead>

      {!loaded ? <Empty text="Загрузка…" /> : links.length === 0 ? <Empty text="Ссылок пока нет" /> : (
        <div className="space-y-3 max-w-2xl">
          {links.map((l) => (
            <div key={l.id} className="adm-card px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-white">
                  {PLATFORMS.find((p) => p.key === l.platform)?.label ?? l.platform}
                  {l.label && l.label !== l.platform && <span className="text-mist"> · {l.label}</span>}
                </p>
                <a href={l.url} target="_blank" rel="noreferrer" className="text-xs text-mist hover:text-gold truncate block">{l.url}</a>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => toggle(l)}
                  className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full transition-colors ${l.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-night-soft text-mist'}`}
                >
                  {l.active ? 'активна' : 'скрыта'}
                </button>
                <button className="text-xs text-gold hover:underline" onClick={() => setEditing(l)}>Изменить</button>
                <button className="text-xs text-mist hover:text-red-400" onClick={() => remove(l.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-night/85 flex items-center justify-center p-4">
          <LinkForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />
        </div>
      )}
      <Toast message={toast} />
    </div>
  );
}

function LinkForm({ initial, onCancel, onSave }: any) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try { await onSave(form); } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="adm-card w-full max-w-md p-7 space-y-5">
      <h2 className="font-serif text-2xl text-white">{form.id ? 'Изменить ссылку' : 'Новая ссылка'}</h2>
      <Field label="Платформа">
        <select className="adm-input" value={form.platform} onChange={(e) => set('platform', e.target.value)}>
          {PLATFORMS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
        </select>
      </Field>
      <Field label="Подпись (необязательно)">
        <input className="adm-input" value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="@juliabunyakova" />
      </Field>
      <Field label="URL *">
        <input type="url" className="adm-input" required value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="https://…" />
      </Field>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="adm-btn">{busy ? '…' : 'Сохранить'}</button>
        <button type="button" className="adm-btn-ghost" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  );
}
