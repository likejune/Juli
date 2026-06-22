import Link from 'next/link';
import SocialIcon from './SocialIcons';

type NavItem = { href: string; label: string };
type Social = { platform: string; label: string; url: string };

export default function Footer({
  nav,
  socials,
  about,
  rights,
}: {
  nav: NavItem[];
  socials: Social[];
  about: string;
  rights: string;
}) {
  return (
    <footer className="bg-paper-warm border-t border-line mt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl tracking-[0.14em] uppercase mb-4">Julia Bunyakova</p>
          <p className="text-sm text-ink-soft leading-relaxed max-w-xs">{about}</p>
        </div>
        <nav className="flex flex-col gap-3 md:items-center">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-[11px] uppercase tracking-widest2 text-ink-soft hover:text-ink transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex md:justify-end items-start gap-4">
          {socials.map((s) => (
            <a
              key={s.platform + s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-ink-soft hover:text-gold-deep hover:border-gold transition-colors"
            >
              <SocialIcon platform={s.platform} />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-ink-soft/80">
          <span>© {new Date().getFullYear()} Julia Bunyakova. {rights}.</span>
          <span className="tracking-widest2 uppercase">Contemporary Art</span>
        </div>
      </div>
    </footer>
  );
}
