'use client';

/**
 * Privacy-friendly first-party analytics beacon.
 * Sends a pageview on every route change and reports the time spent
 * on the page when the visitor leaves (sendBeacon).
 * Admin pages are never tracked.
 */
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const viewIdRef = useRef<string | null>(null);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    startRef.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    const controller = new AbortController();

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || '',
        utmSource: params.get('utm_source'),
      }),
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.viewId) viewIdRef.current = data.viewId;
      })
      .catch(() => {});

    const reportDuration = () => {
      if (!viewIdRef.current) return;
      const seconds = Math.round((Date.now() - startRef.current) / 1000);
      navigator.sendBeacon(
        '/api/track/duration',
        new Blob([JSON.stringify({ viewId: viewIdRef.current, seconds })], { type: 'application/json' })
      );
      viewIdRef.current = null;
    };

    window.addEventListener('pagehide', reportDuration);
    return () => {
      reportDuration();
      window.removeEventListener('pagehide', reportDuration);
      controller.abort();
    };
  }, [pathname]);

  return null;
}

/** Helper used by the gallery modal / blog pages to count entity views. */
export function trackEntity(kind: 'artwork' | 'post', entityId: string) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: window.location.pathname, kind, entityId, referrer: '' }),
  }).catch(() => {});
}
