'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  opacity: number;
}

export const InteractiveDotField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let particles: Particle[] = [];

    // Physics & Grid Settings
    const SPACING = 24; // 24px grid matching INCLUSA .cloud-bg
    const INTERACTION_RADIUS = 130; // Smooth radial magnetic field
    const REPULSION_STRENGTH = 14; // Gentle physical force
    const SPRING_STIFFNESS = 0.075; // Smooth return force
    const DAMPING = 0.82; // Fluid velocity damping

    // State
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isReducedMotion = false;
    let isMobile = false;

    // Mouse Tracking
    let targetMouseX = -9999;
    let targetMouseY = -9999;
    let currentMouseX = -9999;
    let currentMouseY = -9999;
    let isMouseInside = false;
    let isAnimating = true;

    // Theme Dot Color extraction
    let dotColor = 'rgba(216, 208, 192, 0.75)'; // Warm subtle INCLUSA dot
    let dotDisplacedColor = 'rgba(5, 150, 105, 0.85)'; // Subtle emerald shimmer on displacement

    const updateThemeColors = () => {
      if (typeof window === 'undefined') return;
      const html = document.documentElement;
      const contrast = html.getAttribute('data-contrast');

      if (contrast === 'yellow-on-black') {
        dotColor = 'rgba(255, 255, 0, 0.35)';
        dotDisplacedColor = 'rgba(255, 255, 0, 0.85)';
      } else if (contrast === 'high-contrast-dark') {
        dotColor = 'rgba(255, 255, 255, 0.25)';
        dotDisplacedColor = 'rgba(52, 211, 153, 0.8)';
      } else if (contrast === 'high-contrast-light') {
        dotColor = 'rgba(0, 0, 0, 0.3)';
        dotDisplacedColor = 'rgba(5, 150, 105, 0.9)';
      } else {
        dotColor = 'rgba(216, 208, 192, 0.75)';
        dotDisplacedColor = 'rgba(5, 150, 105, 0.75)';
      }
    };

    const checkAccessibility = () => {
      if (typeof window === 'undefined') return;
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const manualReduced = document.documentElement.getAttribute('data-reduced-motion') === 'true';
      isReducedMotion = mediaQuery.matches || manualReduced;
      isMobile = window.innerWidth < 768;
    };

    const initParticles = () => {
      particles = [];
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * SPACING + (SPACING / 2);
          const y = r * SPACING + (SPACING / 2);

          particles.push({
            originX: x,
            originY: y,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            radius: 1.5,
            baseOpacity: 0.75,
            opacity: 0.75,
          });
        }
      }
    };

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      checkAccessibility();
      updateThemeColors();
      initParticles();
      requestTick();
    };

    const onPointerMove = (e: PointerEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isMouseInside = true;
      requestTick();
    };

    const onPointerLeave = () => {
      isMouseInside = false;
      targetMouseX = -9999;
      targetMouseY = -9999;
      requestTick();
    };

    const onScroll = () => {
      requestTick();
    };

    const requestTick = () => {
      if (!isAnimating) {
        isAnimating = true;
        loop();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth pointer interpolation
      if (isMouseInside) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.2;
        currentMouseY += (targetMouseY - currentMouseY) * 0.2;
      } else {
        currentMouseX += (targetMouseX - currentMouseX) * 0.1;
        currentMouseY += (targetMouseY - currentMouseY) * 0.1;
      }

      let maxMotion = 0;
      const radius = isMobile ? 80 : INTERACTION_RADIUS;
      const strength = isMobile ? 8 : REPULSION_STRENGTH;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isReducedMotion) {
          // 1. Calculate repulsion from cursor
          if (isMouseInside || Math.abs(p.x - p.originX) > 0.05 || Math.abs(p.y - p.originY) > 0.05) {
            const dx = p.x - currentMouseX;
            const dy = p.y - currentMouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius && dist > 0.1) {
              // Smooth quadratic falloff curve (no hard circular edge)
              const norm = 1 - dist / radius;
              const force = Math.pow(norm, 2.2) * strength;
              const angle = Math.atan2(dy, dx);

              p.vx += Math.cos(angle) * force;
              p.vy += Math.sin(angle) * force;
            }
          }

          // 2. Spring force back to home position
          const homeDx = p.originX - p.x;
          const homeDy = p.originY - p.y;
          p.vx += homeDx * SPRING_STIFFNESS;
          p.vy += homeDy * SPRING_STIFFNESS;

          // 3. Damping / friction
          p.vx *= DAMPING;
          p.vy *= DAMPING;

          p.x += p.vx;
          p.y += p.vy;

          const speed = Math.abs(p.vx) + Math.abs(p.vy);
          const distFromHome = Math.abs(homeDx) + Math.abs(homeDy);
          maxMotion = Math.max(maxMotion, speed + distFromHome);
        } else {
          // Static position when reduced motion is preferred
          p.x = p.originX;
          p.y = p.originY;
        }

        // Draw particle
        const displacement = Math.sqrt(
          (p.x - p.originX) * (p.x - p.originX) + (p.y - p.originY) * (p.y - p.originY)
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + (displacement > 2 ? 0.3 : 0), 0, Math.PI * 2);

        if (displacement > 3 && !isReducedMotion) {
          ctx.fillStyle = dotDisplacedColor;
        } else {
          ctx.fillStyle = dotColor;
        }
        ctx.fill();
      }

      // If particles have settled and cursor is still/outside, stop rAF to conserve 100% CPU
      if (!isReducedMotion && (maxMotion > 0.05 || isMouseInside)) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isAnimating = false;
        animationFrameId = null;
      }
    };

    const loop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      render();
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new MutationObserver(updateThemeColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-contrast', 'data-theme', 'data-reduced-motion'],
    });

    resize();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
