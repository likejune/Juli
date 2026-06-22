/** Minimal monochrome SVG icons for social platforms (server component). */

const paths: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </>
  ),
  facebook: (
    <path d="M14 8.5h2.5V5.5H14c-2 0-3.5 1.6-3.5 3.5v2H8v3h2.5v6.5h3V14H16l.5-3h-3V9.3c0-.5.3-.8.5-.8z" fill="currentColor" />
  ),
  vk: (
    <path d="M3.5 7h2.8c.2 3.2 1.5 6 3.2 6.6V7h2.7v3.9c1.6-.2 3.2-2 3.8-3.9h2.7c-.5 2.3-1.9 4.1-3 4.9 1.5.7 3.2 2.6 3.8 5.1h-3c-.5-1.9-2-3.6-3.5-3.8V17h-.3C8.5 17 4 12.8 3.5 7z" fill="currentColor" />
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9.2l5 2.8-5 2.8V9.2z" fill="currentColor" />
    </>
  ),
  tiktok: (
    <path d="M14.5 3h2.6c.2 2 1.6 3.6 3.4 3.9v2.7c-1.3 0-2.5-.4-3.5-1.1v5.8a5.6 5.6 0 11-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.8 2.8 0 102 2.7V3z" fill="currentColor" />
  ),
  telegram: (
    <path d="M20.5 4.5L3.8 11c-.8.3-.8 1 0 1.3l4.2 1.3 1.6 5c.2.7.7.8 1.2.3l2.3-2.2 4.4 3.2c.6.4 1.2.2 1.4-.6l2.7-13.5c.2-.9-.4-1.5-1.1-1.3zM8.7 13.4l9.4-5.9-7.6 7 .1 3-1.9-4.1z" fill="currentColor" />
  ),
  wechat: (
    <>
      <circle cx="9" cy="9.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15.5" cy="14" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="8.4" r="0.9" fill="currentColor" />
      <circle cx="11" cy="8.4" r="0.9" fill="currentColor" />
    </>
  ),
  xiaohongshu: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10v4M12 9.5v5M17 10v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  custom: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 12h17M12 3.3c2.5 2.3 4 5.3 4 8.7s-1.5 6.4-4 8.7c-2.5-2.3-4-5.3-4-8.7s1.5-6.4 4-8.7z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </>
  ),
};

export default function SocialIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {paths[platform] ?? paths.custom}
    </svg>
  );
}
