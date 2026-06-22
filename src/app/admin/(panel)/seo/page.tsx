'use client';

import { useEffect, useState } from 'react';
import { api, PageHead, Field, LangTabs, Toast, Empty } from '@/components/admin/ui';

const PAGES = [
  { key: 'home', label: 'Главная' },
  { key: 'gallery', label: 'Галерея' },
  { key: 'about', label: 'О художнице' },
  { key: 'blog', label: 'Блог' },
  { key: 'contacts', label: 'Контакты' },
];
const FIELDS = [
  { key: 'metaTitle', label: 'Meta Title', rows: 1 },
  { key: 'metaDescription', label: 'Meta Description', rows: 2 },
  { key: 'keywords', label: 'Keywords (через запятую)', rows: 1 },
  { key: 'ogTitle', label: 'Open Graph Title', rows: 1 },
  { key: 'ogDescription', label: 'Open Graph Description', rows: 2 },
  { key: 'ogImage', label: 'Open Graph Image URL', rows: 1 },
];

export default function SeoAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState('home');
  const [lang, setLang] = useState('ru');
  const [form, setForm] = useState<any>({});
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  const load = () => api('/api/admin/seo').then((r) => { setRows(r); setLoaded(true); });
  useEffect(() => { load().catch(() => setLoaded(true)); }, []);

  useEffect(() => {
    const row = rows.find((r) => r.page === page && r.locale === lang) ?? {};
    setForm({
      metaTitle: row.metaTitle ?? '', metaDescription: row.metaDescription ?? '',
      keywords: row.keywords ?? '', ogTitle: row.ogTitle ?? '',
      ogDescription: row.ogDescription ?? '', ogImage: row.ogImage ?? '',
    });
  }, [rows, page, lang]);

  const save = async () => {
    setBusy(true);
    try {
      await api('/api/admin/seo', { method: 'PUT', body: JSON.stringify({ page, locale: lang, ...form }) });
      setToast('SEO сохранено');
      setTimeout(() => setToast(''), 2500);
      load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHead title="SEO" subtitle="Мета-теги и Open Graph для каждой страницы и языка">
        <LangTabs value={lang} onChange={setLang} />
      </PageHead>

      <div className="flex flex-wrap gap-2 mb-7">
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPage(p.key)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${page === p.key ? 'bg-gold text-night font-semibold' : 'bg-night-card border border-night-line text-mist hover:text-white'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {!loaded ? <Empty text="Загрузка…" /> : (
        <div className="adm-card p-7 max-w-2xl space-y-5">
          {FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.rows === 1 ? (
                <input className="adm-input" value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              ) : (
                <textarea className="adm-input resize-y" rows={f.rows} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              )}
            </Field>
          ))}
          <button className="adm-btn" disabled={busy} onClick={save}>{busy ? '…' : 'Сохранить'}</button>
        </div>
      )}
      <Toast message={toast} />
    </div>
  );
}
