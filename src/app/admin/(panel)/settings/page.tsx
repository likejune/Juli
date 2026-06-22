'use client';

import { useEffect, useState } from 'react';
import { api, PageHead, Field, Toast, Empty } from '@/components/admin/ui';

const GROUPS = [
  {
    title: 'Цитата на главной странице',
    hint: 'Отображается в hero-блоке под именем художницы.',
    fields: [
      { key: 'quote_ru', label: 'Цитата (RU)', rows: 2 },
      { key: 'quote_en', label: 'Quote (EN)', rows: 2 },
      { key: 'quote_zh', label: '引言 (ZH)', rows: 2 },
    ],
  },
  {
    title: 'Страница «О художнице»',
    fields: [
      { key: 'about_photo_url', label: 'URL фотографии художницы', rows: 1 },
      { key: 'about_photo_caption_ru', label: 'Подпись к фото (RU)', rows: 1 },
      { key: 'about_photo_caption_en', label: 'Caption (EN)', rows: 1 },
      { key: 'about_photo_caption_zh', label: '照片说明 (ZH)', rows: 1 },
    ],
  },
  {
    title: 'Контакты и язык',
    fields: [
      { key: 'contact_email', label: 'Контактный email', rows: 1 },
      { key: 'default_locale', label: 'Язык по умолчанию (ru / en / zh)', rows: 1 },
    ],
  },
];

export default function SettingsAdmin() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api('/api/admin/settings').then((s) => { setForm(s); setLoaded(true); }).catch(() => setLoaded(true));
  }, []);

  const save = async () => {
    setBusy(true);
    try {
      await api('/api/admin/settings', { method: 'PUT', body: JSON.stringify(form) });
      setToast('Настройки сохранены');
      setTimeout(() => setToast(''), 2500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHead title="Настройки сайта" subtitle="Главная цитата, фото, контакты">
        <button className="adm-btn" disabled={busy || !loaded} onClick={save}>{busy ? '…' : 'Сохранить всё'}</button>
      </PageHead>

      {!loaded ? <Empty text="Загрузка…" /> : (
        <div className="space-y-7 max-w-2xl">
          {GROUPS.map((g) => (
            <section key={g.title} className="adm-card p-7 space-y-5">
              <div>
                <h2 className="text-sm uppercase tracking-widest2 text-mist">{g.title}</h2>
                {g.hint && <p className="text-xs text-mist/70 mt-1">{g.hint}</p>}
              </div>
              {g.fields.map((f) => (
                <Field key={f.key} label={f.label}>
                  {f.rows === 1 ? (
                    <input className="adm-input" value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                  ) : (
                    <textarea className="adm-input resize-y" rows={f.rows} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                  )}
                </Field>
              ))}
              {g.fields.some((f) => f.key === 'about_photo_url') && form.about_photo_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={form.about_photo_url} alt="" className="h-36 rounded-lg border border-night-line object-cover" />
              )}
            </section>
          ))}
          <button className="adm-btn" disabled={busy} onClick={save}>{busy ? '…' : 'Сохранить всё'}</button>
        </div>
      )}
      <Toast message={toast} />
    </div>
  );
}
