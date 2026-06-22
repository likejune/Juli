import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getDict, getLocale, t } from '@/lib/i18n';
import { prisma } from '@/lib/db';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const dict = await getDict(locale);

  const nav = [
    { href: '/', label: t(dict, 'nav.home') },
    { href: '/gallery', label: t(dict, 'nav.gallery') },
    { href: '/about', label: t(dict, 'nav.about') },
    { href: '/blog', label: t(dict, 'nav.blog') },
    { href: '/contacts', label: t(dict, 'nav.contacts') },
  ];

  const socials = await prisma.socialLink.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
    select: { platform: true, label: true, url: true },
  });

  return (
    <>
      <Header nav={nav} locale={locale} />
      <main className="pt-24 min-h-screen">{children}</main>
      <Footer nav={nav} socials={socials} about={t(dict, 'footer.about')} rights={t(dict, 'footer.rights')} />
    </>
  );
}
