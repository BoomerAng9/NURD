import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * @param query The media query to test
 * @returns A boolean indicating if the media query matches
 * 
 * Example:
 * const isMobile = useMedia('(max-width: 640px)');
 * const isTablet = useMedia('(min-width: 641px) and (max-width: 1024px)');
 * const isDesktop = useMedia('(min-width: 1025px)');
 */
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Update matches when the media query changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    media.addEventListener('change', listener);

    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

/**
 * Breakpoint shortcuts that match Tailwind's defaults
 */
export const useBreakpoints = () => {
  const isMobile = useMedia('(max-width: 639px)');
  const isTablet = useMedia('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMedia('(min-width: 1024px)');
  const isLargeDesktop = useMedia('(min-width: 1280px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
};

export default useMedia;