'use client';

import { useEffect, useRef, useState } from 'react';
import { api, PageHead, Toast, Empty } from '@/components/admin/ui';

export default function MediaAdmin() {
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [folder, setFolder] = useState('');
  const [q, setQ] = useState('');
  const [uploadFolder, setUploadFolder] = useState('general');
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [preview, setPreview] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    api(`/api/admin/media?q=${encodeURIComponent(q)}&folder=${encodeURIComponent(folder)}`).then((d) => {
      setFiles(d.files);
      setFolders(d.folders);
      setLoaded(true);
    });
  useEffect(() => { load().catch(() => setLoaded(true)); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [folder]);

  const notify = (m: string, err = false) => { setToast(m); setToastErr(err); setTimeout(() => setToast(''), 3500); };

  const upload = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('folder', uploadFolder.trim() || 'general');
      Array.from(list).forEach((f) => fd.append('files', f));
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');
      notify(`Загружено: ${data.length}`);
      load();
    } catch (e: any) {
      notify(e.message, true);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить файл?')) return;
    await api(`/api/admin/media/${id}`, { method: 'DELETE' });
    setPreview(null);
    notify('Удалено');
    load();
  };

  const copy = (url: string) => {
    const abs = url.startsWith('/') ? window.location.origin + url : url;
    navigator.clipboard.writeText(abs).then(() => notify('Ссылка скопирована'));
  };

  return (
    <div>
      <PageHead title="Медиатека" subtitle="Загрузка изображений для галереи, блога и страниц" />

      {/* upload box */}
      <div className="adm-card p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="adm-label">Папка</label>
            <input className="adm-input !w-44" value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)} placeholder="general" />
          </div>
          <button className="adm-btn" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? 'Загрузка…' : '⧉ Выбрать файлы'}
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
          <p className="text-xs text-mist">JPEG / PNG / WebP / GIF / AVIF · до 15 МБ · можно несколько сразу</p>
        </div>
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select className="adm-input !w-48" value={folder} onChange={(e) => setFolder(e.target.value)}>
          <option value="">Все папки</option>
          {folders.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <input
          className="adm-input !w-64"
          placeholder="Поиск по имени файла…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
        />
        <button className="adm-btn-ghost" onClick={() => load()}>Найти</button>
      </div>

      {!loaded ? <Empty text="Загрузка…" /> : files.length === 0 ? (
        <Empty text="Файлов нет. Загрузите первые изображения выше." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {files.map((f) => (
            <button key={f.id} className="adm-card overflow-hidden text-left group" onClick={() => setPreview(f)}>
              <div className="aspect-square bg-night-soft overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={f.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-300 truncate">{f.filename}</p>
                <p className="text-[10px] text-mist">{f.folder} · {(f.size / 1024).toFixed(0)} КБ</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-night/90 flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <div className="adm-card max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.url} alt={preview.filename} className="max-h-[55vh] mx-auto rounded-lg" />
            <p className="text-sm text-white mt-4">{preview.filename}</p>
            <p className="text-xs text-mist mt-1">{preview.url}</p>
            <div className="flex gap-2.5 mt-5">
              <button className="adm-btn !py-2 text-xs" onClick={() => copy(preview.url)}>Скопировать URL</button>
              <button className="adm-btn-ghost !py-2 text-xs hover:!text-red-400" onClick={() => remove(preview.id)}>Удалить</button>
              <button className="adm-btn-ghost !py-2 text-xs" onClick={() => setPreview(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
      <Toast message={toast} error={toastErr} />
    </div>
  );
}
