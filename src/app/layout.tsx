import type { Metadata } from 'next';
import './globals.css';
import { getLocale } from '@/lib/i18n';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Julia Bunyakova',
  description: 'Official website of artist Julia Bunyakova',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const htmlLang = locale === 'zh' ? 'zh-CN' : locale;
  return (
    <html lang={htmlLang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;600&family=Noto+Sans+SC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <AnalyticsTracker />
      </body>
    </html>
  );
}
