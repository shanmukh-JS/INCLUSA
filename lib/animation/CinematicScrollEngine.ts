'use client';

/**
 * INCLUSA Cinematic Continuous Scroll Engine
 * 
 * High-performance, GPU-accelerated continuous scroll & parallax physics
 * - 0 React re-renders during scrolling (direct DOM matrix transforms)
 * - Continuous progress tracking (0.0 -> 1.0) per scene
 * - Damped inertia interpolation for cinematic camera movement
 * - Multi-layer parallax depth (background, midground, content, foreground)
 * - Full prefers-reduced-motion accessibility support
 * - Touch-safe mobile responsiveness (no scroll-jacking)
 */

export type LayerDepth = 'background' | 'midground' | 'content' | 'foreground' | 'accent' | number;

export interface RegisteredLayer {
  element: HTMLElement;
  sceneId: string;
  depth: LayerDepth;
  speed: number;
  maxOffset: number;
  scaleDepth?: number;
  fadeEdges?: boolean;
}

export interface RegisteredScene {
  element: HTMLElement;
  id: string;
  onProgress?: (progress: number, velocity: number) => void;
  sticky?: boolean;
}

class CinematicScrollEngineClass {
  private scenes: Map<string, RegisteredScene> = new Map();
  private layers: RegisteredLayer[] = [];
  private isRunning = false;
  private rafId: number | null = null;

  // Physics state
  private targetScrollY = 0;
  private currentScrollY = 0;
  private lastScrollY = 0;
  private velocity = 0;
  private windowHeight = 800;
  private windowWidth = 1200;
  private prefersReducedMotion = false;
  private isMobile = false;
  private isTablet = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    this.updateDimensions();
    this.checkReducedMotion();

    const scrollY = window.scrollY || window.pageYOffset || 0;
    this.targetScrollY = scrollY;
    this.currentScrollY = scrollY;
    this.lastScrollY = scrollY;

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener?.('change', (e) => {
        this.prefersReducedMotion = e.matches;
        this.resetAllTransforms();
      });
    }

    this.startLoop();
  }

  private updateDimensions() {
    if (typeof window === 'undefined') return;
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this.isMobile = this.windowWidth < 768;
    this.isTablet = this.windowWidth >= 768 && this.windowWidth < 1024;
  }

  private checkReducedMotion() {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private onScroll = () => {
    this.targetScrollY = window.scrollY || window.pageYOffset || 0;
    if (!this.isRunning) {
      this.startLoop();
    }
  };

  private onResize = () => {
    this.updateDimensions();
    this.targetScrollY = window.scrollY || window.pageYOffset || 0;
  };

  public registerScene(scene: RegisteredScene) {
    this.scenes.set(scene.id, scene);
    if (!this.isRunning) this.startLoop();
  }

  public unregisterScene(id: string) {
    this.scenes.delete(id);
    this.layers = this.layers.filter((l) => l.sceneId !== id);
  }

  public registerLayer(layer: RegisteredLayer) {
    this.layers.push(layer);
    if (!this.isRunning) this.startLoop();
  }

  public unregisterLayer(element: HTMLElement) {
    this.layers = this.layers.filter((l) => l.element !== element);
  }

  private resolveSpeed(depth: LayerDepth, customSpeed?: number): number {
    if (typeof customSpeed === 'number') return customSpeed;
    if (typeof depth === 'number') return depth;

    switch (depth) {
      case 'background':
        return -0.22; // Moves slower than scroll (deep background)
      case 'midground':
        return -0.08; // Subtle background layer
      case 'content':
        return 0.0;   // Normal scroll
      case 'foreground':
        return 0.09;  // Moves slightly faster (closer to camera)
      case 'accent':
        return 0.16;  // Prominent foreground pop
      default:
        return 0.0;
    }
  }

  private startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  private loop = () => {
    if (this.prefersReducedMotion) {
      this.resetAllTransforms();
      this.isRunning = false;
      return;
    }

    // Damping factor: Desktop uses gentle inertia (0.11), touch mobile uses snappy damping (0.28)
    const damping = this.isMobile ? 0.28 : this.isTablet ? 0.16 : 0.11;
    const diff = this.targetScrollY - this.currentScrollY;

    if (Math.abs(diff) > 0.1) {
      this.currentScrollY += diff * damping;
    } else {
      this.currentScrollY = this.targetScrollY;
    }

    this.velocity = this.currentScrollY - this.lastScrollY;
    this.lastScrollY = this.currentScrollY;

    this.updateScenesAndLayers();

    // Keep running if there's ongoing interpolation or continuous animation
    if (Math.abs(diff) > 0.15 || Math.abs(this.velocity) > 0.1) {
      this.rafId = window.requestAnimationFrame(this.loop);
    } else {
      this.isRunning = false;
      this.rafId = null;
    }
  };

  private updateScenesAndLayers() {
    const scrollY = this.currentScrollY;
    const vh = this.windowHeight;

    // Multipliers based on device size
    const deviceMultiplier = this.isMobile ? 0.35 : this.isTablet ? 0.65 : 1.0;

    // Track per-scene progress
    const sceneProgressMap = new Map<string, number>();

    this.scenes.forEach((scene) => {
      const rect = scene.element.getBoundingClientRect();
      const elementTopInDoc = rect.top + window.scrollY;
      const elementHeight = rect.height || 600;

      // Calculate continuous progress from 0 (enters bottom of screen) to 1 (leaves top of screen)
      const totalTravel = vh + elementHeight;
      const currentTravel = (scrollY + vh) - elementTopInDoc;
      const progress = Math.max(0, Math.min(1, currentTravel / totalTravel));

      sceneProgressMap.set(scene.id, progress);

      if (scene.onProgress) {
        scene.onProgress(progress, this.velocity);
      }
    });

    // Update each registered layer
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const el = layer.element;
      if (!el || !document.body.contains(el)) continue;

      const progress = sceneProgressMap.get(layer.sceneId) ?? 0.5;

      // Only transform if the scene is active near the viewport (progress > 0 && progress < 1)
      if (progress <= 0 || progress >= 1) {
        continue;
      }

      const speed = this.resolveSpeed(layer.depth, layer.speed) * deviceMultiplier;
      const centerOffset = progress - 0.5; // -0.5 (entering) -> 0.0 (center) -> +0.5 (leaving)

      let translateY = centerOffset * vh * speed;
      const maxOffset = (layer.maxOffset || 120) * deviceMultiplier;
      translateY = Math.max(-maxOffset, Math.min(maxOffset, translateY));

      let transformStr = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;

      // Optional subtle camera focal scale
      if (layer.scaleDepth && !this.isMobile) {
        const scaleDiff = Math.abs(centerOffset) * layer.scaleDepth * deviceMultiplier;
        const currentScale = Math.max(0.95, 1.0 - scaleDiff);
        transformStr += ` scale(${currentScale.toFixed(3)})`;
      }

      el.style.transform = transformStr;

      // Optional smooth edge fading
      if (layer.fadeEdges) {
        const distFromCenter = Math.abs(centerOffset); // 0 at center, 0.5 at edges
        const edgeOpacity = Math.max(0.2, 1.0 - distFromCenter * 1.5);
        el.style.opacity = edgeOpacity.toFixed(2);
      }
    }
  }

  private resetAllTransforms() {
    this.layers.forEach((layer) => {
      if (layer.element) {
        layer.element.style.transform = '';
        layer.element.style.opacity = '';
      }
    });
  }

  public getScrollState() {
    return {
      scrollY: this.currentScrollY,
      targetScrollY: this.targetScrollY,
      velocity: this.velocity,
      isMobile: this.isMobile,
      prefersReducedMotion: this.prefersReducedMotion,
    };
  }
}

// Global Singleton Engine
export const cinematicScrollEngine =
  typeof window !== 'undefined'
    ? new CinematicScrollEngineClass()
    : (null as unknown as CinematicScrollEngineClass);
