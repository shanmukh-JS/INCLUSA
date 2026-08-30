'use client';

import React, { useEffect, useRef } from 'react';
import { useSceneContext } from './ScrollScene';
import { cinematicScrollEngine, LayerDepth } from '@/lib/animation/CinematicScrollEngine';

interface ScrollLayerProps {
  children: React.ReactNode;
  className?: string;
  depth?: LayerDepth;
  speed?: number; // custom multiplier, e.g. -0.2 (background) to +0.15 (foreground)
  maxOffset?: number; // in pixels, e.g. 60
  scaleDepth?: number; // subtle focal scale e.g. 0.04
  fadeEdges?: boolean;
}

export const ScrollLayer: React.FC<ScrollLayerProps> = ({
  children,
  className = '',
  depth = 'content',
  speed,
  maxOffset = 100,
  scaleDepth,
  fadeEdges = false,
}) => {
  const { sceneId } = useSceneContext();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el || !cinematicScrollEngine) return;

    cinematicScrollEngine.registerLayer({
      element: el,
      sceneId,
      depth,
      speed: speed ?? (typeof depth === 'number' ? depth : 0),
      maxOffset,
      scaleDepth,
      fadeEdges,
    });

    return () => {
      cinematicScrollEngine?.unregisterLayer(el);
    };
  }, [sceneId, depth, speed, maxOffset, scaleDepth, fadeEdges]);

  return (
    <div
      ref={layerRef}
      className={className}
      style={{
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {children}
    </div>
  );
};
