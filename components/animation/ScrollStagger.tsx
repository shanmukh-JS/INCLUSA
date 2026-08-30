'use client';

import React, { createContext, useContext, useRef } from 'react';
import { useInView, usePrefersReducedMotion } from '@/lib/animation/useScrollAnimation';

interface StaggerContextType {
  isInView: boolean;
  baseDelay: number;
  staggerMs: number;
  duration: number;
  distance: number;
  prefersReducedMotion: boolean;
}

const StaggerContext = createContext<StaggerContextType>({
  isInView: false,
  baseDelay: 0,
  staggerMs: 80,
  duration: 700,
  distance: 24,
  prefersReducedMotion: false,
});

interface ScrollStaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  baseDelay?: number;
  staggerMs?: number; // delay between each item
  duration?: number;
  distance?: number;
  threshold?: number;
}

export const ScrollStaggerContainer: React.FC<ScrollStaggerContainerProps> = ({
  children,
  className = '',
  baseDelay = 0,
  staggerMs = 85,
  duration = 750,
  distance = 24,
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold, triggerOnce: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <StaggerContext.Provider
      value={{
        isInView,
        baseDelay,
        staggerMs,
        duration,
        distance,
        prefersReducedMotion,
      }}
    >
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
};

interface ScrollStaggerItemProps {
  children: React.ReactNode;
  index: number;
  className?: string;
  customDistance?: number;
}

export const ScrollStaggerItem: React.FC<ScrollStaggerItemProps> = ({
  children,
  index,
  className = '',
  customDistance,
}) => {
  const { isInView, baseDelay, staggerMs, duration, distance, prefersReducedMotion } =
    useContext(StaggerContext);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const effectiveDelay = baseDelay + index * staggerMs;
  const effectiveDistance = customDistance !== undefined ? customDistance : distance;

  return (
    <div
      className={`transition-all ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView
          ? 'translate3d(0, 0, 0) scale(1)'
          : `translate3d(0, ${effectiveDistance}px, 0) scale(0.985)`,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${effectiveDelay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: isInView ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};
