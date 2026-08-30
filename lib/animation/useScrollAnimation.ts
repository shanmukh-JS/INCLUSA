'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * Supports dynamic system preferences and always returns false during SSR
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to track global window scroll progress and position
 * Uses requestAnimationFrame and passive listener for 60-120fps performance
 */
export function useScrollProgress(): {
  scrollY: number;
  progress: number;
  direction: 'up' | 'down';
  isScrolled: boolean;
} {
  const [scrollData, setScrollData] = useState({
    scrollY: 0,
    progress: 0,
    direction: 'down' as 'up' | 'down',
    isScrolled: false,
  });

  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (rafId.current !== null) return;

      rafId.current = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY || window.pageYOffset;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? Math.min(Math.max(currentScrollY / totalHeight, 0), 1) : 0;
        const direction = currentScrollY >= lastScrollY.current ? 'down' : 'up';
        const isScrolled = currentScrollY > 20;

        lastScrollY.current = currentScrollY;
        setScrollData({
          scrollY: currentScrollY,
          progress,
          direction,
          isScrolled,
        });

        rafId.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return scrollData;
}

/**
 * Hook to observe element intersection with viewport
 */
export function useInView(
  ref: React.RefObject<HTMLElement>,
  options: {
    threshold?: number | number[];
    rootMargin?: string;
    triggerOnce?: boolean;
  } = {}
): boolean {
  const { threshold = 0.12, rootMargin = '0px 0px -40px 0px', triggerOnce = true } = options;
  const [isInView, setIsInView] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (triggerOnce) {
              hasTriggered.current = true;
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, triggerOnce]);

  return isInView;
}

/**
 * Hook to apply direct GPU-accelerated Parallax without React re-renders
 * Speeds:
 *   negative: moves slower than scroll (background depth)
 *   positive: moves faster than scroll (foreground pop)
 */
export function useParallax(
  ref: React.RefObject<HTMLElement>,
  options: {
    speed?: number; // e.g. -0.12 for background, +0.08 for foreground
    maxOffset?: number; // maximum pixel offset limit
    direction?: 'vertical' | 'horizontal';
  } = {}
) {
  const { speed = -0.1, maxOffset = 100, direction = 'vertical' } = options;
  const prefersReducedMotion = usePrefersReducedMotion();
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion || typeof window === 'undefined') return;

    // Check if mobile device
    const isMobile = window.innerWidth < 768;
    const effectiveSpeed = isMobile ? speed * 0.35 : speed; // lighter on mobile
    const effectiveMaxOffset = isMobile ? maxOffset * 0.35 : maxOffset;

    const updateParallax = () => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate if element is anywhere near viewport (within 1.5 screen heights)
      if (rect.bottom >= -200 && rect.top <= windowHeight + 200) {
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = elementCenter - viewportCenter;

        let offset = distanceFromCenter * effectiveSpeed;
        if (effectiveMaxOffset) {
          offset = Math.max(-effectiveMaxOffset, Math.min(effectiveMaxOffset, offset));
        }

        if (direction === 'vertical') {
          element.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        } else {
          element.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0)`;
        }
      }

      rafId.current = null;
    };

    const handleScroll = () => {
      if (rafId.current === null) {
        rafId.current = window.requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateParallax(); // Initial positioning

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
      if (element) {
        element.style.transform = '';
      }
    };
  }, [ref, speed, maxOffset, direction, prefersReducedMotion]);
}
