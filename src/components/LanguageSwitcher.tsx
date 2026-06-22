'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

const LOCALES: { code: string; short: string; name: string }[] = [
  { code: 'ru', short: 'RU', name: 'Русский' },
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'zh', short: '中文', name: '中文' },
];

export default function LanguageSwitcher({ current, dark = false }: { current: string; dark?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const select = (code: string) => {
    document.cookie = `jb_locale=${code};path=/;max-age=31536000;samesite=lax`;
    setOpen(false);
    startTransition(() => router.refresh());
  };

  const active = LOCALES.find((l) => l.code === current) ?? LOCALES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 text-xs tracking-widest2 uppercase transition-colors ${
          dark ? 'text-mist hover:text-white' : 'text-ink-soft hover:text-ink'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {active.short}
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className={`absolute right-0 top-full mt-3 z-50 min-w-[140px] py-2 rounded-xl shadow-xl border animate-fade-in ${
              dark ? 'bg-night-card border-night-line' : 'bg-white border-line'
            }`}
          >
            {LOCALES.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => select(l.code)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    dark
                      ? l.code === current ? 'text-gold' : 'text-gray-300 hover:text-white'
                      : l.code === current ? 'text-gold-deep' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {l.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
