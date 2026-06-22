'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

type NavItem = { href: string; label: string };

export default function Header({ nav, locale }: { nav: NavItem[]; locale: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen ? 'bg-paper/90 backdrop-blur-md border-b border-line py-4' : 'bg-transparent py-7'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-[0.18em] uppercase">
          Julia&nbsp;Bunyakova
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[11px] uppercase tracking-widest2 transition-colors relative pb-1 ${
                pathname === item.href ? 'text-ink' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {item.label}
              {pathname === item.href && <span className="absolute left-0 -bottom-0.5 w-5 h-px bg-gold" />}
            </Link>
          ))}
          <span className="w-px h-4 bg-line" />
          <LanguageSwitcher current={locale} />
        </nav>

        <div className="flex items-center gap-5 lg:hidden">
          <LanguageSwitcher current={locale} />
          <button
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex flex-col gap-[5px] p-1"
          >
            <span className={`block w-6 h-px bg-ink transition-transform ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`block w-6 h-px bg-ink transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-ink transition-transform ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="lg:hidden border-t border-line bg-paper/95 backdrop-blur-md animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm uppercase tracking-widest2 ${pathname === item.href ? 'text-gold-deep' : 'text-ink-soft'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
