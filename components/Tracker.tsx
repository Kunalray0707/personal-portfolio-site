'use client';

import { useEffect, useRef } from 'react';

export default function Tracker({ portfolioId }: { portfolioId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const trackVisit = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            portfolioId,
            referrer: document.referrer,
            pathname: window.location.pathname,
          }),
        });
      } catch (err) {
        // Silently fail if tracking is blocked (e.g., by adblockers)
        console.error('Tracking failed:', err);
      }
    };

    // Small delay to ensure we're not tracking accidental bounces immediately
    const timeout = setTimeout(() => {
      trackVisit();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [portfolioId]);

  return null; // Silent component
}
