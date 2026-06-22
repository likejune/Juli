import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getDict, getLocale, t } from '@/lib/i18n';
import { getSettings } from '@/lib/settings';
import { pageMetadata } from '@/lib/seo';
import Reveal from '@/components/Reveal';
import SocialIcon from '@/components/SocialIcons';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('contacts', getLocale());
}

export default async function ContactsPage() {
  const locale = getLocale();
  const [dict, settings, socials] = await Promise.all([
    getDict(locale),
    getSettings(['contact_email']),
    prisma.socialLink.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  const email = settings.contact_email ?? 'studio@juliabunyakova.com';

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
      <div className="text-center mb-16">
        <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-3">{t(dict, 'contacts.kicker')}</p>
        <h1 className="font-serif text-5xl lg:text-6xl">{t(dict, 'contacts.title')}</h1>
        <p className="text-ink-soft mt-5">{t(dict, 'contacts.lead')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Reveal>
          <div className="border border-line p-9 h-full text-center">
            <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-4">{t(dict, 'contacts.email')}</p>
            <a href={`mailto:${email}`} className="font-serif text-xl hover:text-gold-deep transition-colors break-all">
              {email}
            </a>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="border border-line p-9 h-full text-center">
            <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-4">{t(dict, 'contacts.studio')}</p>
            <p className="font-serif text-xl">{t(dict, 'contacts.studioCity')}</p>
          </div>
        </Reveal>
        <Reveal delay={240}>
          <div className="border border-line p-9 h-full text-center">
            <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-5">{t(dict, 'contacts.social')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="w-11 h-11 rounded-full border border-line flex items-center justify-center text-ink-soft hover:text-gold-deep hover:border-gold transition-colors"
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-12 bg-paper-warm border border-line p-10 text-center">
          <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-3">{t(dict, 'contacts.press')}</p>
          <p className="text-sm text-ink-soft max-w-lg mx-auto leading-relaxed">{t(dict, 'contacts.pressText')}</p>
        </div>
      </Reveal>
    </div>
  );
}
