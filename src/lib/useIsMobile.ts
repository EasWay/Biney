import { useEffect, useState } from 'react';

/**
 * Returns true when viewport width < 768px (md breakpoint).
 * Uses matchMedia for accuracy and listens for resize changes.
 * Safe on SSR (defaults to false — assumes desktop during hydration).
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}
