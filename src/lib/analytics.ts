/** User-agent and referrer classification for the analytics module. */

export function parseDevice(ua: string): 'desktop' | 'mobile' | 'tablet' {
  const s = ua.toLowerCase();
  if (/ipad|tablet|kindle|silk|playbook/.test(s)) return 'tablet';
  if (/android(?!.*mobile)/.test(s)) return 'tablet';
  if (/mobi|iphone|ipod|android|blackberry|opera mini|windows phone/.test(s)) return 'mobile';
  return 'desktop';
}

export function parseOS(ua: string): string {
  if (/windows nt 11|windows nt 10/i.test(ua)) return 'Windows';
  if (/windows/i.test(ua)) return 'Windows';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/mac os x/i.test(ua)) return 'macOS';
  if (/android/i.test(ua)) return 'Android';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Other';
}

export function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\/|opera/i.test(ua)) return 'Opera';
  if (/yabrowser/i.test(ua)) return 'Yandex';
  if (/firefox\//i.test(ua)) return 'Firefox';
  if (/chrome\//i.test(ua)) return 'Chrome';
  if (/safari\//i.test(ua)) return 'Safari';
  return 'Other';
}

const SEARCH_HOSTS = ['google.', 'yandex.', 'bing.', 'duckduckgo.', 'baidu.', 'ya.ru', 'mail.ru/search'];
const SOCIAL_HOSTS = ['instagram.', 'facebook.', 'vk.com', 't.me', 'telegram.', 'youtube.', 'tiktok.', 'twitter.', 'x.com', 'weibo.', 'xiaohongshu.', 'pinterest.', 'linkedin.'];

export function classifyReferrer(
  referrer: string,
  utmSource?: string | null
): { type: string; source: string } {
  if (utmSource) return { type: 'campaign', source: utmSource.slice(0, 80) };
  if (!referrer) return { type: 'direct', source: '' };
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (SEARCH_HOSTS.some((h) => host.includes(h))) return { type: 'search', source: host };
    if (SOCIAL_HOSTS.some((h) => host.includes(h))) return { type: 'social', source: host };
    return { type: 'external', source: host };
  } catch {
    return { type: 'direct', source: '' };
  }
}

/** Country from CDN/proxy headers (Vercel sets x-vercel-ip-country). */
export function countryFromHeaders(headers: Headers): string {
  return (
    headers.get('x-vercel-ip-country') ??
    headers.get('cf-ipcountry') ??
    'Unknown'
  );
}
