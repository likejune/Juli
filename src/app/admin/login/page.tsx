'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(res.status === 429 ? 'Слишком много попыток — подождите минуту.' : 'Неверный email или пароль.');
        return;
      }
      router.replace(data.mustChangePassword ? '/admin/security?first=1' : '/admin');
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-night flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-9">
          <p className="font-serif text-2xl tracking-[0.18em] uppercase text-white">Julia Bunyakova</p>
          <p className="text-[11px] uppercase tracking-widest2 text-gold mt-2">Control Panel</p>
        </div>
        <form onSubmit={submit} className="adm-card p-8 space-y-5">
          <div>
            <label className="adm-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="adm-input"
              placeholder="admin@juliabunyakova.com"
            />
          </div>
          <div>
            <label className="adm-label" htmlFor="password">Пароль / Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="adm-input"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="adm-btn w-full">
            {busy ? '…' : 'Войти / Sign in'}
          </button>
        </form>
        <p className="text-center text-xs text-mist/60 mt-6">Protected area · bcrypt + JWT sessions</p>
      </div>
    </div>
  );
}
