import { useEffect, useRef, type CSSProperties } from 'react';

export interface ParticleTextProps {
  text?: string;
  particleSize?: number;
  density?: number;
  color?: string;
  highlightColor?: string;
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  pointerRepel?: number;
  repelRadius?: number;
  idleDrift?: number;
  trigger?: 'mount' | 'hover' | 'click';
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
}

type Rgb = { r: number; g: number; b: number };
type Target = { x: number; y: number; alpha: number };
type Particle = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  halfSize: number;
  color: string;
  seed: number;
  depth: number;
  delay: number;
};

const hexToRgb = (hex: string): Rgb | null => {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
};

const mixRgb = (from: Rgb, to: Rgb, amount: number): Rgb => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount)
});

const rgbToCss = (rgb: Rgb): string => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const TWO_PI = Math.PI * 2;

const fontSizeCache = new Map<string, number>();

const resolveFontSize = (
  value: number | string | undefined,
  container: HTMLElement,
  fontWeight: number | string,
  fontFamily: string
): number => {
  if (typeof value === 'number') return value;
  if (!value) return 72;

  const key = `${value}-${fontWeight}-${fontFamily}-${container.clientWidth}`;
  const cached = fontSizeCache.get(key);
  if (cached !== undefined) return cached;

  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.fontSize = value;
  probe.style.fontWeight = String(fontWeight);
  probe.style.fontFamily = fontFamily;
  probe.textContent = 'M';

  container.appendChild(probe);
  const size = parseFloat(window.getComputedStyle(probe).fontSize) || 72;
  probe.remove();

  fontSizeCache.set(key, size);
  return size;
};

const waitForFonts = async (fontSpec: string): Promise<void> => {
  if (typeof document === 'undefined' || !document.fonts?.load) return;
  try {
    await document.fonts.load(fontSpec);
  } catch {
    // Gracefully continue if font loading fails
  }
};

export const ParticleText = ({
  text = 'LUNORE',
  particleSize = 2.4,
  density = 4,
  color = '#f1eee7',
  highlightColor = '#b89a62',
  scatter = 90,
  gatherDuration = 1600,
  stagger = 420,
  pointerRepel = 40,
  repelRadius = 120,
  idleDrift = 0.7,
  trigger = 'mount',
  fontSize = 'clamp(3rem, 12vw, 8rem)',
  fontWeight = 800,
  fontFamily = 'inherit',
  glow = true,
  className = '',
  style
}: ParticleTextProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let particles: Particle[] = [];
    let animationFrame: number | null = null;
    let resizeFrame: number | null = null;
    let buildId = 0;
    let gathering = false;
    let gatherStart = 0;
    let isVisible = true;
    let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const isMobile = window.innerWidth < 768;

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0
    };

    const startGather = (fromScatter = true): void => {
      if (!particles.length) return;

      const now = performance.now();
      const spread = reducedMotion ? 0 : scatter;

      particles.forEach(particle => {
        if (fromScatter) {
          const angle = particle.seed * Math.PI * 2;
          const distance = spread * (0.35 + particle.depth * 0.75);
          particle.x = particle.targetX + Math.cos(angle) * distance + (particle.depth - 0.5) * spread * 0.55;
          particle.y = particle.targetY + Math.sin(angle) * distance + (particle.seed - 0.5) * spread * 0.55;
        }

        particle.startX = particle.x;
        particle.startY = particle.y;
        particle.delay = reducedMotion ? 0 : particle.seed * stagger;
      });

      gatherStart = now;
      gathering = true;
    };

    const render = (now: number): void => {
      if (!isVisible) {
        animationFrame = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.2;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.2;

      let complete = true;
      const spreadDuration = Math.max(1, reducedMotion ? 1 : gatherDuration);
      const repelRadiusSq = repelRadius * repelRadius;

      // 1. Update particle physics
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        let baseX = particle.targetX;
        let baseY = particle.targetY;
        let progress = 1;

        if (gathering) {
          const local = (now - gatherStart - particle.delay) / spreadDuration;
          progress = clamp(local, 0, 1);
          const eased = easeOutCubic(progress);
          baseX = particle.startX + (particle.targetX - particle.startX) * eased;
          baseY = particle.startY + (particle.targetY - particle.startY) * eased;
          if (progress < 1) complete = false;
        } else if (!reducedMotion && idleDrift > 0) {
          const driftTime = now * 0.001;
          baseX += Math.sin(driftTime * 0.9 + particle.seed * 10) * idleDrift * particle.depth;
          baseY += Math.cos(driftTime * 0.75 + particle.depth * 10) * idleDrift * particle.depth;
        }

        // Fast bounding-box precheck: eliminates 95%+ of square root calculations
        if (pointer.active && !reducedMotion && pointerRepel > 0 && repelRadius > 0) {
          const dx = baseX - pointer.smoothX;
          const dy = baseY - pointer.smoothY;
          if (Math.abs(dx) < repelRadius && Math.abs(dy) < repelRadius) {
            const distSq = dx * dx + dy * dy;
            if (distSq > 0 && distSq < repelRadiusSq) {
              const distance = Math.sqrt(distSq);
              const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel;
              const invDist = force / distance;
              baseX += dx * invDist;
              baseY += dy * invDist;
            }
          }
        }

        const follow = reducedMotion ? 1 : 0.22;
        particle.x += (baseX - particle.x) * follow;
        particle.y += (baseY - particle.y) * follow;
      }

      // 2. High-performance batched draw call with cached halfSize and TWO_PI
      if (glow && !reducedMotion && !isMobile) {
        ctx.shadowBlur = particleSize * 2.2;
        ctx.shadowColor = highlightColor;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        ctx.moveTo(particle.x + particle.halfSize, particle.y);
        ctx.arc(particle.x, particle.y, particle.halfSize, 0, TWO_PI);
      }
      ctx.fill();

      ctx.shadowBlur = 0;

      if (gathering && complete) {
        gathering = false;
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const ensureRenderLoop = (): void => {
      if (animationFrame === null && isVisible) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const sampleText = async (): Promise<void> => {
      const currentBuild = ++buildId;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);

      const currentIsMobile = window.innerWidth < 768;
      dpr = Math.min(window.devicePixelRatio || 1, currentIsMobile ? 1.0 : 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const computed = window.getComputedStyle(container);
      const resolvedFamily = fontFamily === 'inherit' ? computed.fontFamily || 'sans-serif' : fontFamily;
      let resolvedSize = resolveFontSize(fontSize, container, fontWeight, resolvedFamily);
      let font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;

      await waitForFonts(font);
      if (currentBuild !== buildId) return;

      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      const content = String(text || ' ');
      const maxTextWidth = width * 0.92;
      offCtx.font = font;
      let metrics = offCtx.measureText(content);
      const measuredWidth = Math.max(1, metrics.width);
      if (measuredWidth > maxTextWidth) {
        resolvedSize = Math.max(18, resolvedSize * (maxTextWidth / measuredWidth));
        font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;
        await waitForFonts(font);
        if (currentBuild !== buildId) return;
        offCtx.font = font;
        metrics = offCtx.measureText(content);
      }

      const left = Math.ceil(metrics.actualBoundingBoxLeft || 0);
      const right = Math.ceil(metrics.actualBoundingBoxRight || metrics.width);
      const ascent = Math.ceil(metrics.actualBoundingBoxAscent || resolvedSize * 0.78);
      const descent = Math.ceil(metrics.actualBoundingBoxDescent || resolvedSize * 0.22);
      const padding = Math.max(12, Math.ceil(resolvedSize * 0.08));
      const textWidth = Math.max(1, left + right);
      const textHeight = Math.max(1, ascent + descent);

      offscreen.width = textWidth + padding * 2;
      offscreen.height = textHeight + padding * 2;
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      offCtx.font = font;
      offCtx.textAlign = 'left';
      offCtx.textBaseline = 'alphabetic';
      offCtx.fillStyle = '#ffffff';
      offCtx.fillText(content, padding - left, padding + ascent);

      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const targets: Target[] = [];
      const step = isMobile ? Math.max(3, Math.floor(density * 1.25)) : Math.max(2, Math.floor(density));

      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const alpha = imageData.data[(y * offscreen.width + x) * 4 + 3];
          if (alpha > 40) {
            targets.push({
              x: width / 2 - offscreen.width / 2 + x,
              y: height / 2 - offscreen.height / 2 + y,
              alpha: alpha / 255
            });
          }
        }
      }

      const maxParticles = isMobile
        ? Math.max(300, Math.min(850, Math.floor((width * height) / 180)))
        : Math.max(800, Math.min(2200, Math.floor((width * height) / 120)));

      const stride = Math.max(1, Math.ceil(targets.length / maxParticles));
      const baseRgb = hexToRgb(color);
      const highlightRgb = hexToRgb(highlightColor);
      const selected = targets.filter((_, index) => index % stride === 0);

      const newParticles: Particle[] = [];
      for (let index = 0; index < selected.length; index++) {
        const target = selected[index];
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
        const blend = baseRgb && highlightRgb ? clamp(target.x / Math.max(1, width) + (seed - 0.5) * 0.35, 0, 1) : 0;
        const particleColor = baseRgb && highlightRgb ? rgbToCss(mixRgb(baseRgb, highlightRgb, blend)) : color;
        const angle = seed * Math.PI * 2;
        const distance = (reducedMotion ? 0 : scatter) * (0.35 + depth * 0.75);
        const startX = target.x + Math.cos(angle) * distance + (seed - 0.5) * scatter * 0.45;
        const startY = target.y + Math.sin(angle) * distance + (depth - 0.9) * scatter * 0.45;
        const size = Math.max(1.6, particleSize * (0.85 + target.alpha * 0.35));
        const halfSize = size * 0.5;

        if (index < particles.length) {
          const p = particles[index];
          p.x = reducedMotion ? target.x : startX;
          p.y = reducedMotion ? target.y : startY;
          p.startX = startX;
          p.startY = startY;
          p.targetX = target.x;
          p.targetY = target.y;
          p.size = size;
          p.halfSize = halfSize;
          p.color = particleColor;
          p.seed = seed;
          p.depth = depth;
          p.delay = seed * stagger;
          newParticles.push(p);
        } else {
          newParticles.push({
            x: reducedMotion ? target.x : startX,
            y: reducedMotion ? target.y : startY,
            startX,
            startY,
            targetX: target.x,
            targetY: target.y,
            size,
            halfSize,
            color: particleColor,
            seed,
            depth,
            delay: seed * stagger
          });
        }
      }
      particles = newParticles;

      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;

      if (reducedMotion) {
        particles.forEach(particle => {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
          particle.startX = particle.targetX;
          particle.startY = particle.targetY;
          particle.delay = 0;
        });
        gathering = false;
      } else {
        startGather(false);
      }

      ensureRenderLoop();
    };

    const queueSample = (): void => {
      cachedCanvasRect = null;
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(sampleText);
    };

    let cachedCanvasRect: DOMRect | null = null;
    const getCanvasRect = (): DOMRect => {
      if (!cachedCanvasRect) {
        cachedCanvasRect = canvas.getBoundingClientRect();
      }
      return cachedCanvasRect;
    };

    const handlePointerMove = (event: PointerEvent): void => {
      const rect = getCanvasRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = (): void => {
      pointer.active = false;
    };

    const handlePointerEnter = (event: PointerEvent): void => {
      handlePointerMove(event);
      if (trigger === 'hover') startGather(true);
    };

    const handleClick = (): void => {
      if (trigger === 'click') startGather(true);
    };

    const invalidateCanvasRect = (): void => {
      cachedCanvasRect = null;
    };
    window.addEventListener('resize', invalidateCanvasRect, { passive: true });
    window.addEventListener('orientationchange', queueSample, { passive: true });

    const reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handleReduceMotionChange = (event: MediaQueryListEvent): void => {
      reducedMotion = event.matches;
      void sampleText();
    };

    reduceMotionQuery?.addEventListener('change', handleReduceMotionChange);
    canvas.addEventListener('pointerenter', handlePointerEnter);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);

    const resizeObserver = new ResizeObserver(queueSample);
    resizeObserver.observe(container);

    let pauseTime = 0;

    // Performance Optimization: IntersectionObserver to sleep RAF loop when offscreen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nextVisible = entry.isIntersecting;
          if (nextVisible && !isVisible) {
            isVisible = true;
            if (pauseTime > 0 && gathering) {
              gatherStart += performance.now() - pauseTime;
            }
            ensureRenderLoop();
          } else if (!nextVisible && isVisible) {
            isVisible = false;
            pauseTime = performance.now();
            if (animationFrame !== null) {
              window.cancelAnimationFrame(animationFrame);
              animationFrame = null;
            }
          }
        });
      },
      { rootMargin: '120px 0px 120px 0px', threshold: 0 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        if (animationFrame !== null) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
        pauseTime = performance.now();
      } else if (isVisible) {
        if (pauseTime > 0 && gathering) {
          gatherStart += performance.now() - pauseTime;
        }
        ensureRenderLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    void sampleText();

    return () => {
      buildId += 1;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', invalidateCanvasRect);
      window.removeEventListener('orientationchange', queueSample);
      reduceMotionQuery?.removeEventListener('change', handleReduceMotionChange);
      canvas.removeEventListener('pointerenter', handlePointerEnter);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('click', handleClick);

      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    };
  }, [
    text,
    particleSize,
    density,
    color,
    highlightColor,
    scatter,
    gatherDuration,
    stagger,
    pointerRepel,
    repelRadius,
    idleDrift,
    trigger,
    fontSize,
    fontWeight,
    fontFamily,
    glow
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative block h-full min-h-[140px] w-full overflow-hidden touch-none ${className}`}
      style={style}
      aria-label={text}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full pointer-events-auto" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </div>
  );
};

export default ParticleText;
