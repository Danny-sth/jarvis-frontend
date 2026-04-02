import { useState, useEffect } from 'react';

/**
 * Hook to match CSS media queries
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if query matches
 */
export function useMediaQuery(query: string): boolean {
  // ✅ Используем initializer function для избежания лишнего рендера при mount
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    // Create listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Commonly used breakpoints as constants
 */
export const BREAKPOINTS = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;

/**
 * Hook for mobile detection
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/**
 * Hook for tablet detection
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1023px)');
}

/**
 * Hook for desktop detection
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
