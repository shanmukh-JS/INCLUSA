'use client';

import React, { createContext, useContext, useEffect, useRef, useId } from 'react';
import { cinematicScrollEngine, LayerDepth } from '@/lib/animation/CinematicScrollEngine';

interface SceneContextType {
  sceneId: string;
}

const SceneContext = createContext<SceneContextType>({ sceneId: 'default-scene' });

export const useSceneContext = () => useContext(SceneContext);

interface ScrollSceneProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onProgress?: (progress: number, velocity: number) => void;
  sticky?: boolean;
}

export const ScrollScene: React.FC<ScrollSceneProps> = ({
  children,
  className = '',
  id,
  onProgress,
  sticky = false,
}) => {
  const generatedId = useId();
  const sceneId = id || `scene-${generatedId}`;
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el || !cinematicScrollEngine) return;

    cinematicScrollEngine.registerScene({
      element: el,
      id: sceneId,
      onProgress,
      sticky,
    });

    return () => {
      cinematicScrollEngine?.unregisterScene(sceneId);
    };
  }, [sceneId, onProgress, sticky]);

  return (
    <SceneContext.Provider value={{ sceneId }}>
      <div ref={sceneRef} className={`relative ${className}`}>
        {children}
      </div>
    </SceneContext.Provider>
  );
};
