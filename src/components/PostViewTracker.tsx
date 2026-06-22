'use client';

import { useEffect } from 'react';
import { trackEntity } from './AnalyticsTracker';

/** Counts a view of a blog post (once per page load). */
export default function PostViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    trackEntity('post', postId);
  }, [postId]);
  return null;
}
