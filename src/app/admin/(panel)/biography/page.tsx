'use client';

import { useEffect, useState } from 'react';
import { api, PageHead, Field, LangTabs, Toast, Empty } from '@/components/admin/ui';

const SECTIONS: { key: string; label: string; hasTitle: boolean; hasMeta?: string }[] = [
  { key: 'bio', label: 'Биография', hasTitle: false },
  { key: 'path', label: 'Творческий путь', hasTitle: true },
  { key: 'philosophy', label: 'Философия творчества', hasTitle: false },
  { key: 'quote', label: 'Цитаты художницы', hasTitle: false },
  { key: 'exhibition', label: 'Выставки', hasTitle: true, hasMeta: 'Год' },
  { key: 'achievement', label: 'Достижения', hasTitle: true, hasMeta: 'Год' },
  { key: 'publication', label: 'Публикации', hasTitle: true, hasMeta: 'Издание / год' },
];

export default function BiographyAdmin() {
  const [entries, setEntries] = useState<any[]>([]);
  const [lang, setLang] = useState('ru');
  const [editing, setEditing] = useState<any | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState('');

  const load = () => api('/api/admin/biography').then((e) => { setEntries(e); setLoaded(true); });
  useEffect(() => { load().catch(() => setLoaded(true)); }, []);
  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const save = async (form: any) => {
    if (form.id) await api(`/api/admin/biography/${form.id}`, { method: 'PUT', body: JSON.stringify(form) });
    else await api('/api/admin/biography', { method: 'POST', body: JSON.stringify(form) });
    setEditing(null);
    notify('Сохранено');
    load();
  };
  const remove = async (id: string) => {
    if (!confirm('Удалить запись?')) return;
    await api(`/api/admin/biography/${id}`, { method: 'DELETE' });
    notify('Удалено');
    load();
  };

  return (
    <div>
      <PageHead title="Биография" subtitle="Содержимое страницы «О художнице» — отдельно для каждого языка">
        <LangTabs value={lang} onChange={setLang} />
      </PageHead>

      {!loaded ? <Empty text="Загрузка…" /> : (
        <div className="space-y-7 max-w-3xl">
          {SECTIONS.map((s) => {
            const rows = entries.filter((e) => e.section === s.key && e.locale === lang).sort((a, b) => a.sortOrder - b.sortOrder);
            return (
              <section key={s.key} className="adm-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm uppercase tracking-widest2 text-mist">{s.label}</h2>
                  <button
                    className="adm-btn-ghost !py-1.5 text-xs"
                    onClick={() => setEditing({ section: s.key, locale: lang, title: '', content: '', meta: '', sortOrder: rows.length + 1, _def: s })}
                  >
                    + Добавить
                  </button>
                </div>
                {rows.length === 0 ? <p className="text-sm text-mist">Нет записей для этого языка.</p> : (
                  <ul className="space-y-3">
                    {rows.map((e) => (
                      <li key={e.id} className="bg-night-soft rounded-lg px-4 py-3 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          {e.title && <p className="text-sm text-white">{e.title} {e.meta && <span className="text-gold text-xs">· {e.meta}</span>}</p>}
                          <p className="text-sm text-mist line-clamp-2 whitespace-pre-line">{e.content}</p>
                        </div>
                        <span className="flex gap-3 shrink-0">
                          <button className="text-xs text-gold hover:underline" onClick={() => setEditing({ ...e, _def: s })}>Изменить</button>
                          <button className="text-xs text-mist hover:text-red-400" onClick={() => remove(e.id)}>✕</button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}

      {editing && (
        <EntryForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />
      )}
      <Toast message={toast} />
    </div>
  );
}

function EntryForm({ initial, onCancel, onSave }: any) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const def = initial._def;
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { _def, ...payload } = form;
    try { await onSave(payload); } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-night/85 flex items-center justify-center p-4 overflow-y-auto dark-scroll">
      <form onSubmit={submit} className="adm-card w-full max-w-xl p-7 space-y-5">
        <h2 className="font-serif text-2xl text-white">
          {def.label} <span className="text-gold text-base uppercase">· {form.locale}</span>
        </h2>
        {def.hasTitle && (
          <Field label="Заголовок">
            <input className="adm-input" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </Field>
        )}
        {def.hasMeta && (
          <Field label={def.hasMeta}>
            <input className="adm-input" value={form.meta} onChange={(e) => set('meta', e.target.value)} />
          </Field>
        )}
        <Field label="Текст *">
          <textarea className="adm-input resize-y" rows={6} required value={form.content} onChange={(e) => set('content', e.target.value)} />
        </Field>
        <Field label="Порядок">
          <input type="number" className="adm-input !w-28" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} />
        </Field>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={busy} className="adm-btn">{busy ? '…' : 'Сохранить'}</button>
          <button type="button" className="adm-btn-ghost" onClick={onCancel}>Отмена</button>
        </div>
      </form>
    </div>
  );
}
