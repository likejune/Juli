/**
 * Lightweight in-memory sliding-window rate limiter.
 * Suitable for a single instance (Open Server Panel / one Vercel region).
 */

type Bucket = { timestamps: number[] };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);
  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket);
    return false; // limited
  }
  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return true; // allowed
}

// periodic cleanup so the map does not grow forever
setInterval(() => {
  const now = Date.now();
  buckets.forEach((bucket, key) => {
    bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < 10 * 60_000);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  });
}, 5 * 60_000).unref?.();
