import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getDict, getLocale, t } from '@/lib/i18n';
import { getSettings } from '@/lib/settings';
import { pageMetadata } from '@/lib/seo';
import Reveal from '@/components/Reveal';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('about', getLocale());
}

export default async function AboutPage() {
  const locale = getLocale();
  const [dict, entries, settings] = await Promise.all([
    getDict(locale),
    prisma.biographyEntry.findMany({ where: { locale }, orderBy: { sortOrder: 'asc' } }),
    getSettings(['about_photo_url', `about_photo_caption_${getLocale()}`]),
  ]);

  const by = (section: string) => entries.filter((e) => e.section === section);
  const quote = by('quote')[0]?.content ?? '';
  const textSections = ['bio', 'path', 'philosophy']
    .map((s) => by(s)[0])
    .filter(Boolean);
  const exhibitions = by('exhibition');
  const achievements = by('achievement');
  const publications = by('publication');

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="text-center mb-16">
        <p className="text-[11px] uppercase tracking-widest2 text-gold-deep mb-3">{t(dict, 'about.kicker')}</p>
        <h1 className="font-serif text-5xl lg:text-6xl">{t(dict, 'about.title')}</h1>
      </div>

      <div className="grid lg:grid-cols-[420px_1fr] gap-14 lg:gap-20 items-start">
        {/* ---------- photo ---------- */}
        <Reveal className="lg:sticky lg:top-32">
          <figure>
            <div className="relative">
              <div className="absolute -inset-3 border border-gold/40 translate-x-4 translate-y-4 pointer-events-none" aria-hidden />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.about_photo_url}
                alt="Julia Bunyakova"
                className="w-full h-auto relative"
              />
            </div>
            <figcaption className="text-xs text-ink-soft mt-7 text-center tracking-wide">
              {settings[`about_photo_caption_${locale}`] ?? ''}
            </figcaption>
          </figure>
        </Reveal>

        {/* ---------- text ---------- */}
        <div>
          {quote && (
            <Reveal>
              <p className="font-serif italic text-2xl lg:text-[1.7rem] leading-relaxed text-ink border-l-2 border-gold pl-7 mb-12">
                {quote}
              </p>
            </Reveal>
          )}

          {textSections.map((section) => (
            <Reveal key={section!.id}>
              <h2 className="font-serif text-3xl mt-10 mb-4 first:mt-0">{section!.title}</h2>
              <p className="text-ink-soft leading-relaxed max-w-2xl whitespace-pre-line">{section!.content}</p>
            </Reveal>
          ))}

          {/* ---------- exhibitions ---------- */}
          {exhibitions.length > 0 && (
            <Reveal>
              <h2 className="font-serif text-3xl mt-12 mb-6">{t(dict, 'about.exhibitions')}</h2>
              <ul className="space-y-4">
                {exhibitions.map((e) => (
                  <li key={e.id} className="flex gap-6 items-baseline border-b border-line pb-4">
                    <span className="font-serif text-gold-deep text-lg w-14 shrink-0">{e.meta}</span>
                    <span className="text-sm text-ink-soft leading-relaxed">
                      <b className="text-ink font-medium">{e.title}</b> — {e.content}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* ---------- achievements ---------- */}
          {achievements.length > 0 && (
            <Reveal>
              <h2 className="font-serif text-3xl mt-12 mb-6">{t(dict, 'about.achievements')}</h2>
              <div className="grid grid-cols-3 gap-6">
                {achievements.map((a) => (
                  <div key={a.id} className="text-center border border-line py-8 px-3">
                    <div className="font-serif text-4xl lg:text-5xl text-gold-deep">{a.meta}</div>
                    <div className="text-xs text-ink-soft mt-2 leading-snug">{a.content}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* ---------- publications ---------- */}
          {publications.length > 0 && (
            <Reveal>
              <h2 className="font-serif text-3xl mt-12 mb-6">{t(dict, 'about.publications')}</h2>
              <ul className="space-y-4">
                {publications.map((p) => (
                  <li key={p.id} className="flex gap-6 items-baseline">
                    <span className="font-serif text-gold-deep text-lg w-14 shrink-0">{p.meta}</span>
                    <span className="text-sm text-ink-soft leading-relaxed">
                      <b className="text-ink font-medium">{p.title}</b> — {p.content}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
