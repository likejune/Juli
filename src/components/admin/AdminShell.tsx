'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { href: '/admin', label: 'Дашборд', icon: '◫' },
  { href: '/admin/analytics', label: 'Аналитика', icon: '◔' },
  { href: '/admin/gallery', label: 'Галерея', icon: '▣' },
  { href: '/admin/blog', label: 'Блог', icon: '✎' },
  { href: '/admin/comments', label: 'Комментарии', icon: '❝' },
  { href: '/admin/media', label: 'Медиатека', icon: '⧉' },
  { href: '/admin/biography', label: 'Биография', icon: '❦' },
  { href: '/admin/social', label: 'Соцсети', icon: '☍' },
  { href: '/admin/translations', label: 'Переводы', icon: '文' },
  { href: '/admin/seo', label: 'SEO', icon: '⌕' },
  { href: '/admin/settings', label: 'Настройки', icon: '⚙' },
  { href: '/admin/security', label: 'Безопасность', icon: '⛨' },
];

export default function AdminShell({
  email,
  mustChangePassword,
  children,
}: {
  email: string;
  mustChangePassword: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-night-line">
        <p className="font-serif text-lg tracking-[0.14em] uppercase text-white leading-tight">Julia Bunyakova</p>
        <p className="text-[10px] uppercase tracking-widest2 text-gold mt-1">Control Panel</p>
      </div>
      <nav className="flex-1 overflow-y-auto dark-scroll py-4">
        {NAV.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3.5 px-6 py-2.5 text-sm transition-colors border-l-2 ${
                active
                  ? 'border-gold text-white bg-night-soft'
                  : 'border-transparent text-mist hover:text-white hover:bg-night-soft/60'
              }`}
            >
              <span className={`w-5 text-center ${active ? 'text-gold' : 'text-mist/60'}`}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-5 border-t border-night-line space-y-3">
        <a href="/" target="_blank" className="block text-xs text-mist hover:text-white transition-colors">↗ Открыть сайт</a>
        <button onClick={logout} className="block text-xs text-mist hover:text-red-400 transition-colors">⎋ Выйти ({email})</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-night text-gray-200">
      {/* desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-night-card border-r border-night-line z-40">
        {sidebar}
      </aside>

      {/* mobile top bar + drawer */}
      <div className="lg:hidden sticky top-0 z-40 bg-night-card border-b border-night-line flex items-center justify-between px-5 py-4">
        <p className="font-serif tracking-[0.14em] uppercase text-white text-sm">JB · Admin</p>
        <button onClick={() => setOpen((v) => !v)} className="text-mist text-xl leading-none">{open ? '×' : '☰'}</button>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-night/80" onClick={() => setOpen(false)}>
          <aside className="w-72 h-full bg-night-card border-r border-night-line" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        {mustChangePassword && pathname !== '/admin/security' && (
          <div className="bg-gold/15 border-b border-gold/40 px-8 py-3 text-sm text-gold">
            ⚠ Вы используете первичный пароль.{' '}
            <Link href="/admin/security" className="underline hover:text-white">Смените его в разделе «Безопасность»</Link>.
          </div>
        )}
        <div className="px-5 lg:px-10 py-8 max-w-[1500px]">{children}</div>
      </main>
    </div>
  );
}
