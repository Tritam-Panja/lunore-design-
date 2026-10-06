import { useEffect, useRef, useState } from 'react';
import { scrollCoordinator } from '@/lib/scrollCoordinator';

// Organic left-margin path with an elegant loop in the center
const PATH_D = `M 40,0 
  C 40,180 25,280 35,380 
  C 45,450 100,435 120,480 
  C 140,525 115,575 80,575 
  C 35,575 15,520 30,470 
  C 45,420 55,600 40,700 
  C 25,800 45,900 40,1000`;

/**
 * Left-Side Organic Free-Line Scroll Indicator
 * Features a subtle dimmed champagne gold curved line with a central loop.
 */
export function ScrollProgress() {
  const [visible, setVisible] = useState(false);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  const pathRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGGElement>(null);
  const pathLengthRef = useRef(0);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const visibleRef = useRef(false);

  // Initialize path length and pre-sample points table
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      pathLengthRef.current = len;
      pathRef.current.style.strokeDasharray = `${len}`;
      pathRef.current.style.strokeDashoffset = `${len}`;

      // Pre-sample points along the curve once on mount (eliminates heavy SVG bezier evaluations during scroll)
      const samples = 250;
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= samples; i++) {
        const pt = pathRef.current.getPointAtLength((len * i) / samples);
        pts.push({ x: Number(pt.x.toFixed(1)), y: Number(pt.y.toFixed(1)) });
      }
      pointsRef.current = pts;
    }
  }, []);

  useEffect(() => {
    // Small screens (< 640px) hide this indicator via CSS; skip RAF loop to save mobile CPU/battery
    if (typeof window !== 'undefined' && window.innerWidth < 640) return;

    let animationFrameId: number | null = null;
    let isRunning = false;

    const animate = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.14;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = Math.min(1, Math.max(0, currentProgressRef.current));
      const totalLen = pathLengthRef.current;

      if (pathRef.current && totalLen > 0) {
        const offset = totalLen * (1 - p);
        pathRef.current.style.strokeDashoffset = `${offset.toFixed(1)}`;

        if (beadRef.current && pointsRef.current.length > 0) {
          const idx = Math.min(
            pointsRef.current.length - 1,
            Math.max(0, Math.round(p * (pointsRef.current.length - 1)))
          );
          const pt = pointsRef.current[idx];
          beadRef.current.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
        }
      }

      if (Math.abs(diff) > 0.0001) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        isRunning = false;
      }
    };

    const requestTick = () => {
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const onScroll = (scrollY: number) => {
      if (scrollCoordinator.getViewportWidth() < 640) return;
      const total = document.documentElement.scrollHeight - scrollCoordinator.getViewportHeight();
      if (total > 0) {
        targetProgressRef.current = Math.min(1, Math.max(0, scrollY / total));
      }
      const nextVisible = scrollY > 20;
      if (visibleRef.current !== nextVisible) {
        visibleRef.current = nextVisible;
        setVisible(nextVisible);
      }
      requestTick();
    };

    const unsubscribe = scrollCoordinator.subscribe(onScroll);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      unsubscribe();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed left-2 sm:left-4 md:left-6 inset-y-0 w-20 sm:w-28 md:w-36 z-20 pointer-events-none transition-opacity duration-700 ease-out hidden sm:block ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 160 1000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Dimmed Gold Glow */}
          <filter id="dimmed-gold-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Dimmed Champagne Gold Gradient */}
          <linearGradient id="dimmedGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(230, 203, 151, 0.4)" />
            <stop offset="50%" stopColor="rgba(184, 154, 98, 0.6)" />
            <stop offset="100%" stopColor="rgba(196, 168, 111, 0.45)" />
          </linearGradient>
        </defs>

        {/* 1. Base Ambient Curved Track (Dimmed) */}
        <path
          d={PATH_D}
          stroke="rgba(184, 154, 98, 0.12)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Active Illuminated Free-Line Scroll Path (Dimmed Gold) */}
        <path
          ref={pathRef}
          d={PATH_D}
          stroke="url(#dimmedGoldGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#dimmed-gold-glow)"
          className="will-change-[stroke-dashoffset]"
        />

        {/* 3. Glowing Diamond Cursor Bead at leading point */}
        <g ref={beadRef} className="will-change-transform">
          {/* Subtle Outer Halo */}
          <circle r="4" fill="rgba(184, 154, 98, 0.25)" />
          {/* Diamond Bead */}
          <rect
            x="-2.5"
            y="-2.5"
            width="5"
            height="5"
            transform="rotate(45)"
            fill="#e6cb97"
            stroke="rgba(184, 154, 98, 0.9)"
            strokeWidth="0.8"
            className="shadow-sm"
          />
        </g>
      </svg>
    </div>
  );
}
