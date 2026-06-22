'use client';

import { useEffect, useState } from 'react';
import { api, PageHead, Field, LangTabs, Toast, Empty } from '@/components/admin/ui';

const EMPTY = {
  imageUrl: '', status: 'draft', publishedAt: new Date().toISOString().slice(0, 10),
  titleRu: '', titleEn: '', titleZh: '',
  excerptRu: '', excerptEn: '', excerptZh: '',
  bodyRu: '', bodyEn: '', bodyZh: '',
  categoryRu: '', categoryEn: '', categoryZh: '',
  seoTitleRu: '', seoTitleEn: '', seoTitleZh: '',
  seoDescRu: '', seoDescEn: '', seoDescZh: '',
};

export default function BlogAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [toast, setToast] = useState('');
  const [loaded, setLoaded] = useState(false);

  const load = () => api('/api/admin/posts').then((p) => { setPosts(p); setLoaded(true); });
  useEffect(() => { load().catch(() => setLoaded(true)); }, []);
  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const save = async (form: any) => {
    if (form.id) await api(`/api/admin/posts/${form.id}`, { method: 'PUT', body: JSON.stringify(form) });
    else await api('/api/admin/posts', { method: 'POST', body: JSON.stringify(form) });
    setEditing(null);
    notify('Сохранено');
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить статью вместе с комментариями и лайками?')) return;
    await api(`/api/admin/posts/${id}`, { method: 'DELETE' });
    notify('Удалено');
    load();
  };

  return (
    <div>
      <PageHead title="Блог" subtitle={`${posts.length} статей`}>
        <button className="adm-btn" onClick={() => setEditing({ ...EMPTY })}>+ Написать статью</button>
      </PageHead>

      {!loaded ? <Empty text="Загрузка…" /> : posts.length === 0 ? <Empty text="Статей пока нет" /> : (
        <div className="adm-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest2 text-mist border-b border-night-line">
                <th className="px-5 py-3.5 font-normal">Статья</th>
                <th className="px-3 py-3.5 font-normal hidden md:table-cell">Дата</th>
                <th className="px-3 py-3.5 font-normal hidden md:table-cell">Статус</th>
                <th className="px-3 py-3.5 font-normal hidden lg:table-cell">Просм. / ♥ / 💬</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-night-line last:border-0 hover:bg-night-soft/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl} alt="" className="w-12 h-9 object-cover rounded border border-night-line hidden sm:block" />
                      <div className="min-w-0">
                        <p className="text-white truncate max-w-[320px]">{p.titleRu}</p>
                        <p className="text-xs text-mist">{p.categoryRu}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-mist hidden md:table-cell">{new Date(p.publishedAt).toLocaleDateString('ru-RU')}</td>
                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${p.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gold/15 text-gold'}`}>
                      {p.status === 'published' ? 'опубликована' : 'черновик'}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-mist hidden lg:table-cell">{p.views} / {p._count.likes} / {p._count.comments}</td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button className="text-xs text-gold hover:underline mr-4" onClick={() => setEditing({ ...EMPTY, ...p, publishedAt: String(p.publishedAt).slice(0, 10) })}>Редактировать</button>
                    <button className="text-xs text-mist hover:text-red-400" onClick={() => remove(p.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <PostForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />}
      <Toast message={toast} />
    </div>
  );
}

function PostForm({ initial, onCancel, onSave }: any) {
  const [form, setForm] = useState(initial);
  const [lang, setLang] = useState('ru');
  const [showSeo, setShowSeo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const L = lang === 'ru' ? 'Ru' : lang === 'en' ? 'En' : 'Zh';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try { await onSave(form); } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-night/85 flex items-start justify-center overflow-y-auto dark-scroll p-4 lg:p-10">
      <form onSubmit={submit} className="adm-card w-full max-w-3xl p-7 space-y-5 my-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-serif text-2xl text-white">{form.id ? 'Редактировать статью' : 'Новая статья'}</h2>
          <LangTabs value={lang} onChange={setLang} />
        </div>

        <div className="grid lg:grid-cols-[1fr_180px_170px] gap-4">
          <Field label="URL обложки *">
            <input className="adm-input" required value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://… или /uploads/…" />
          </Field>
          <Field label="Дата публикации">
            <input type="date" className="adm-input" value={form.publishedAt} onChange={(e) => set('publishedAt', e.target.value)} />
          </Field>
          <Field label="Статус">
            <select className="adm-input" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="published">Опубликована</option>
              <option value="draft">Черновик</option>
            </select>
          </Field>
        </div>

        <Field label={`Заголовок (${lang.toUpperCase()}) *`}>
          <input className="adm-input" required={lang === 'ru'} value={form[`title${L}`]} onChange={(e) => set(`title${L}`, e.target.value)} />
        </Field>
        <div className="grid lg:grid-cols-2 gap-4">
          <Field label={`Категория (${lang.toUpperCase()})`}>
            <input className="adm-input" value={form[`category${L}`]} onChange={(e) => set(`category${L}`, e.target.value)} placeholder="Выставки / Мастерская…" />
          </Field>
          <Field label={`Анонс (${lang.toUpperCase()})`}>
            <input className="adm-input" value={form[`excerpt${L}`]} onChange={(e) => set(`excerpt${L}`, e.target.value)} />
          </Field>
        </div>
        <Field label={`Текст статьи (${lang.toUpperCase()}) — абзацы разделяются пустой строкой`}>
          <textarea className="adm-input resize-y font-light leading-relaxed" rows={12} value={form[`body${L}`]} onChange={(e) => set(`body${L}`, e.target.value)} />
        </Field>

        <button type="button" className="text-xs text-gold hover:underline" onClick={() => setShowSeo((v) => !v)}>
          {showSeo ? '− Скрыть SEO' : '+ SEO-настройки статьи'}
        </button>
        {showSeo && (
          <div className="grid gap-4 border border-night-line rounded-xl p-5">
            <Field label={`SEO Title (${lang.toUpperCase()})`}>
              <input className="adm-input" value={form[`seoTitle${L}`] ?? ''} onChange={(e) => set(`seoTitle${L}`, e.target.value)} />
            </Field>
            <Field label={`SEO Description (${lang.toUpperCase()})`}>
              <textarea className="adm-input resize-y" rows={2} value={form[`seoDesc${L}`] ?? ''} onChange={(e) => set(`seoDesc${L}`, e.target.value)} />
            </Field>
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={busy} className="adm-btn">{busy ? '…' : 'Сохранить'}</button>
          <button type="button" className="adm-btn-ghost" onClick={onCancel}>Отмена</button>
        </div>
      </form>
    </div>
  );
}
