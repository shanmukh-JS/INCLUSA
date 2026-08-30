'use client';

import React, { useRef } from 'react';
import { useParallax, usePrefersReducedMotion } from '@/lib/animation/useScrollAnimation';

interface ParallaxElementProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // e.g. -0.15 for background, +0.1 for foreground
  maxOffset?: number;
  direction?: 'vertical' | 'horizontal';
}

export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  className = '',
  speed = -0.1,
  maxOffset = 80,
  direction = 'vertical',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useParallax(ref, { speed, maxOffset, direction });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: 'transform',
        transition: 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
};
