'use client';

import React from 'react';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/animation/useScrollAnimation';

export const ScrollProgressBar: React.FC = () => {
  const { progress } = useScrollProgress();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none origin-left"
      style={{
        background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #f59e0b 100%)',
        transform: `scaleX(${progress})`,
        transition: 'transform 0.08s linear',
        boxShadow: '0 0 8px rgba(5, 150, 105, 0.4)',
      }}
    />
  );
};
