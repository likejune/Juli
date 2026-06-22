'use client';

import { useEffect, useState } from 'react';
import { api, PageHead, Field, LangTabs, Toast, Empty } from '@/components/admin/ui';

const EMPTY = {
  imageUrl: '', year: new Date().getFullYear(), widthCm: '', heightCm: '', categoryId: '',
  published: true, sortOrder: 0,
  titleRu: '', titleEn: '', titleZh: '',
  descriptionRu: '', descriptionEn: '', descriptionZh: '',
  techniqueRu: '', techniqueEn: '', techniqueZh: '',
};

export default function GalleryAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [toast, setToast] = useState('');
  const [loaded, setLoaded] = useState(false);

  const load = () =>
    Promise.all([api('/api/admin/artworks'), api('/api/admin/categories')]).then(([a, c]) => {
      setItems(a);
      setCategories(c);
      setLoaded(true);
    });

  useEffect(() => { load().catch(() => setLoaded(true)); }, []);

  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const save = async (form: any) => {
    if (form.id) await api(`/api/admin/artworks/${form.id}`, { method: 'PUT', body: JSON.stringify(form) });
    else await api('/api/admin/artworks', { method: 'POST', body: JSON.stringify(form) });
    setEditing(null);
    notify('Сохранено');
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить картину?')) return;
    await api(`/api/admin/artworks/${id}`, { method: 'DELETE' });
    notify('Удалено');
    load();
  };

  return (
    <div>
      <PageHead title="Галерея" subtitle={`${items.length} работ · ${categories.length} категорий`}>
        <CategoryManager categories={categories} onChange={load} />
        <button className="adm-btn" onClick={() => setEditing({ ...EMPTY })}>+ Добавить картину</button>
      </PageHead>

      {!loaded ? <Empty text="Загрузка…" /> : items.length === 0 ? <Empty text="Работ пока нет" /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((a) => (
            <div key={a.id} className="adm-card overflow-hidden group">
              <div className="aspect-[4/3] bg-night-soft overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.imageUrl} alt={a.titleRu} className="w-full h-full object-cover" loading="lazy" />
                {!a.published && (
                  <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-night/80 text-gold px-2 py-1 rounded">скрыта</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm text-white truncate">{a.titleRu}</p>
                  <span className="text-xs text-mist shrink-0">{a.year}</span>
                </div>
                <p className="text-xs text-mist mt-1 truncate">
                  {a.category?.nameRu ?? 'Без категории'} · {a.views} просмотров
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="adm-btn-ghost flex-1 !py-1.5 text-xs" onClick={() => setEditing({ ...EMPTY, ...a, widthCm: a.widthCm ?? '', heightCm: a.heightCm ?? '', categoryId: a.categoryId ?? '' })}>
                    Редактировать
                  </button>
                  <button className="adm-btn-ghost !py-1.5 text-xs hover:!text-red-400" onClick={() => remove(a.id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ArtworkForm
          initial={editing}
          categories={categories}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}

function ArtworkForm({ initial, categories, onCancel, onSave }: any) {
  const [form, setForm] = useState(initial);
  const [lang, setLang] = useState('ru');
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
      <form onSubmit={submit} className="adm-card w-full max-w-2xl p-7 space-y-5 my-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-white">{form.id ? 'Редактировать картину' : 'Новая картина'}</h2>
          <LangTabs value={lang} onChange={setLang} />
        </div>

        <Field label="URL изображения *">
          <input className="adm-input" required value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://… или /uploads/… (см. Медиатеку)" />
        </Field>
        {form.imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={form.imageUrl} alt="" className="h-36 rounded-lg border border-night-line object-cover" />
        )}

        <Field label={`Название (${lang.toUpperCase()}) *`}>
          <input className="adm-input" required={lang === 'ru'} value={form[`title${L}`]} onChange={(e) => set(`title${L}`, e.target.value)} />
        </Field>
        <Field label={`Описание (${lang.toUpperCase()})`}>
          <textarea className="adm-input resize-y" rows={3} value={form[`description${L}`]} onChange={(e) => set(`description${L}`, e.target.value)} />
        </Field>
        <Field label={`Техника (${lang.toUpperCase()})`}>
          <input className="adm-input" value={form[`technique${L}`]} onChange={(e) => set(`technique${L}`, e.target.value)} placeholder="Холст, масло" />
        </Field>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Год"><input type="number" className="adm-input" value={form.year} onChange={(e) => set('year', e.target.value)} /></Field>
          <Field label="Ширина, см"><input type="number" step="0.1" className="adm-input" value={form.widthCm} onChange={(e) => set('widthCm', e.target.value)} /></Field>
          <Field label="Высота, см"><input type="number" step="0.1" className="adm-input" value={form.heightCm} onChange={(e) => set('heightCm', e.target.value)} /></Field>
          <Field label="Порядок"><input type="number" className="adm-input" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} /></Field>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <Field label="Категория">
            <select className="adm-input" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
              <option value="">Без категории</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nameRu}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2.5 text-sm text-gray-300 pb-2.5 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="accent-[#b08d57] w-4 h-4" />
            Опубликована на сайте
          </label>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={busy} className="adm-btn">{busy ? '…' : 'Сохранить'}</button>
          <button type="button" className="adm-btn-ghost" onClick={onCancel}>Отмена</button>
        </div>
      </form>
    </div>
  );
}

function CategoryManager({ categories, onChange }: any) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState({ nameRu: '', nameEn: '', nameZh: '' });

  const add = async () => {
    if (!name.nameRu.trim()) return;
    await api('/api/admin/categories', { method: 'POST', body: JSON.stringify({ ...name, sortOrder: categories.length + 1 }) });
    setName({ nameRu: '', nameEn: '', nameZh: '' });
    onChange();
  };
  const remove = async (id: string) => {
    if (!confirm('Удалить категорию? Картины останутся без категории.')) return;
    await api(`/api/admin/categories/${id}`, { method: 'DELETE' });
    onChange();
  };

  return (
    <>
      <button className="adm-btn-ghost" onClick={() => setOpen(true)}>Категории</button>
      {open && (
        <div className="fixed inset-0 z-50 bg-night/85 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="adm-card w-full max-w-md p-7" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl text-white mb-5">Категории</h2>
            <ul className="space-y-2 mb-6">
              {categories.map((c: any) => (
                <li key={c.id} className="flex items-center justify-between gap-3 text-sm bg-night-soft rounded-lg px-3.5 py-2.5">
                  <span className="text-gray-200">{c.nameRu} <span className="text-mist">/ {c.nameEn} / {c.nameZh}</span></span>
                  <span className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-mist">{c._count?.artworks ?? 0}</span>
                    <button className="text-mist hover:text-red-400" onClick={() => remove(c.id)}>✕</button>
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-2.5">
              <input className="adm-input" placeholder="Название (RU)" value={name.nameRu} onChange={(e) => setName({ ...name, nameRu: e.target.value })} />
              <div className="grid grid-cols-2 gap-2.5">
                <input className="adm-input" placeholder="English" value={name.nameEn} onChange={(e) => setName({ ...name, nameEn: e.target.value })} />
                <input className="adm-input" placeholder="中文" value={name.nameZh} onChange={(e) => setName({ ...name, nameZh: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-1">
                <button className="adm-btn" onClick={add}>+ Добавить</button>
                <button className="adm-btn-ghost" onClick={() => setOpen(false)}>Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
