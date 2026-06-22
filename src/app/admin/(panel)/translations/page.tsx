'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, PageHead, Toast, Empty } from '@/components/admin/ui';

export default function TranslationsAdmin() {
  const [base, setBase] = useState<Record<string, Record<string, string>>>({});
  const [overrides, setOverrides] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState('');
  const [draft, setDraft] = useState<{ locale: string; key: string; value: string } | null>(null);

  const load = () => api('/api/admin/translations').then((d) => { setBase(d.base); setOverrides(d.overrides); setLoaded(true); });
  useEffect(() => { load().catch(() => setLoaded(true)); }, []);
  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2000); };

  const ovMap = useMemo(() => {
    const m = new Map<string, string>();
    overrides.forEach((o) => m.set(`${o.locale}:${o.key}`, o.value));
    return m;
  }, [overrides]);

  const keys = useMemo(() => {
    const all = Object.keys(base.ru ?? {}).sort();
    if (!q.trim()) return all;
    const needle = q.toLowerCase();
    return all.filter(
      (k) =>
        k.toLowerCase().includes(needle) ||
        ['ru', 'en', 'zh'].some((l) => (ovMap.get(`${l}:${k}`) ?? base[l]?.[k] ?? '').toLowerCase().includes(needle))
    );
  }, [base, q, ovMap]);

  const save = async () => {
    if (!draft) return;
    await api('/api/admin/translations', { method: 'PUT', body: JSON.stringify(draft) });
    setDraft(null);
    notify(draft.value ? 'Перевод сохранён' : 'Возвращено стандартное значение');
    load();
  };

  const cell = (locale: string, key: string) => {
    const overridden = ovMap.has(`${locale}:${key}`);
    const value = ovMap.get(`${locale}:${key}`) ?? base[locale]?.[key] ?? '';
    const isEditing = draft && draft.locale === locale && draft.key === key;
    if (isEditing) {
      return (
        <div className="flex gap-1.5">
          <input
            autoFocus
            className="adm-input !py-1.5 text-xs"
            value={draft.value}
            onChange={(e) => setDraft({ ...draft, value: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setDraft(null); }}
          />
          <button className="adm-btn !py-1 !px-2.5 text-xs" onClick={save}>✓</button>
        </div>
      );
    }
    return (
      <button
        className={`text-left w-full text-xs leading-snug hover:text-white transition-colors ${overridden ? 'text-gold' : 'text-gray-300'}`}
        title={overridden ? 'Изменено (пустое значение вернёт стандарт)' : 'Нажмите, чтобы изменить'}
        onClick={() => setDraft({ locale, key, value })}
      >
        {value || <span className="text-mist/50">—</span>}
      </button>
    );
  };

  return (
    <div>
      <PageHead title="Переводы" subtitle="Тексты интерфейса на трёх языках. Жёлтым отмечены изменённые значения.">
        <input className="adm-input !w-72" placeholder="Поиск по ключу или тексту…" value={q} onChange={(e) => setQ(e.target.value)} />
      </PageHead>

      {!loaded ? <Empty text="Загрузка…" /> : (
        <div className="adm-card overflow-x-auto dark-scroll">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest2 text-mist border-b border-night-line">
                <th className="px-5 py-3.5 font-normal w-56">Ключ</th>
                <th className="px-4 py-3.5 font-normal">Русский</th>
                <th className="px-4 py-3.5 font-normal">English</th>
                <th className="px-4 py-3.5 font-normal">中文</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k} className="border-b border-night-line last:border-0 align-top hover:bg-night-soft/40">
                  <td className="px-5 py-3 text-xs text-mist font-mono">{k}</td>
                  <td className="px-4 py-3">{cell('ru', k)}</td>
                  <td className="px-4 py-3">{cell('en', k)}</td>
                  <td className="px-4 py-3">{cell('zh', k)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Toast message={toast} />
    </div>
  );
}
