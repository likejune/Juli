'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHead, Field, Toast } from '@/components/admin/ui';

export default function SecurityAdmin() {
  return (
    <Suspense>
      <SecurityInner />
    </Suspense>
  );
}

function SecurityInner() {
  const params = useSearchParams();
  const router = useRouter();
  const first = params.get('first') === '1';
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next !== confirm) { setError('Пароли не совпадают.'); return; }
    if (next.length < 10) { setError('Новый пароль должен быть не короче 10 символов.'); return; }
    setBusy(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === 'wrong_current' ? 'Текущий пароль введён неверно.'
          : data.error === 'weak_password' ? 'Пароль слишком короткий (минимум 10 символов).'
          : data.error === 'same_password' ? 'Новый пароль совпадает с текущим.'
          : 'Не удалось сменить пароль. Попробуйте ещё раз.'
        );
        return;
      }
      setToast('Пароль изменён ✓');
      setCurrent(''); setNext(''); setConfirm('');
      setTimeout(() => { setToast(''); router.replace('/admin'); router.refresh(); }, 1200);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHead title="Безопасность" subtitle="Смена пароля администратора" />

      {first && (
        <div className="max-w-xl mb-6 adm-card !border-gold/40 p-5 text-sm text-gold">
          ⚠ Это ваш первый вход. Из соображений безопасности смените первичный пароль прямо сейчас.
        </div>
      )}

      <form onSubmit={submit} className="adm-card p-7 max-w-xl space-y-5">
        <Field label="Текущий пароль">
          <input type="password" autoComplete="current-password" required className="adm-input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label="Новый пароль (минимум 10 символов)">
          <input type="password" autoComplete="new-password" required minLength={10} className="adm-input" value={next} onChange={(e) => setNext(e.target.value)} />
        </Field>
        <Field label="Повторите новый пароль">
          <input type="password" autoComplete="new-password" required className="adm-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={busy} className="adm-btn">{busy ? '…' : 'Сменить пароль'}</button>
      </form>

      <div className="adm-card p-7 max-w-xl mt-7">
        <h2 className="text-sm uppercase tracking-widest2 text-mist mb-4">Активная защита</h2>
        <ul className="space-y-2.5 text-sm text-gray-300">
          {[
            'Пароли хранятся в виде bcrypt-хэшей (12 раундов)',
            'JWT-сессии в httpOnly-cookie (SameSite=Strict, 12 часов)',
            'Защита от перебора: лимит попыток входа по IP',
            'CSRF-проверка Origin для всех изменяющих запросов',
            'Санитизация и валидация всех входных данных (XSS)',
            'Комментарии публикуются только после модерации',
          ].map((t) => (
            <li key={t} className="flex gap-2.5"><span className="text-emerald-400">✓</span>{t}</li>
          ))}
        </ul>
      </div>
      <Toast message={toast} />
    </div>
  );
}
