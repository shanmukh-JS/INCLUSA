'use client';

import React, { useRef } from 'react';
import { useInView, usePrefersReducedMotion } from '@/lib/animation/useScrollAnimation';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in ms, e.g. 100
  duration?: number; // in ms, e.g. 700
  distance?: number; // in px, e.g. 28
  scale?: number; // e.g. 0.985
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  triggerOnce?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 750,
  distance = 28,
  scale = 0.985,
  direction = 'up',
  threshold = 0.12,
  triggerOnce = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold, triggerOnce });
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Calculate transform offset based on direction
  let initialTransform = 'translate3d(0, 0, 0)';
  if (!isInView) {
    switch (direction) {
      case 'up':
        initialTransform = `translate3d(0, ${distance}px, 0) scale(${scale})`;
        break;
      case 'down':
        initialTransform = `translate3d(0, -${distance}px, 0) scale(${scale})`;
        break;
      case 'left':
        initialTransform = `translate3d(${distance}px, 0, 0) scale(${scale})`;
        break;
      case 'right':
        initialTransform = `translate3d(-${distance}px, 0, 0) scale(${scale})`;
        break;
      case 'none':
        initialTransform = `scale(${scale})`;
        break;
    }
  }

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translate3d(0, 0, 0) scale(1)' : initialTransform,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Apple-style smooth deceleration
        willChange: isInView ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};
