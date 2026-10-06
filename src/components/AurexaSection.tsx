import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLenis } from './SmoothScroll';

const ImageTrail = lazy(() => import('./ImageTrail'));

const AUREXA_TRAIL_IMAGES = [
  '/assets/images/imagetrail1.webp',
  '/assets/images/imagetrail2.webp',
  '/assets/images/imagetrail3.webp',
  '/assets/images/imagetrail4.webp',
  '/assets/images/imagetrail5.webp',
  '/assets/images/imagetrail6.webp',
  '/assets/images/imagetrail9.webp',
];

interface FloatingCard {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

export function AurexaSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { lenis } = useLenis();

  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' ? (window.innerWidth < 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) : false
  );

  const progressRef = useRef<number>(0);
  const isUnlockedRef = useRef<boolean>(false);
  const isLockedRef = useRef<boolean>(false);

  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const laserGroupRef = useRef<SVGGElement>(null);
  const laserLineRef = useRef<SVGLineElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  const applyVisualProgress = useCallback((val: number) => {
    const safeProgress = Math.max(0, Math.min(1, val || 0));
    const clipW = Math.max(0, Math.min(1200, safeProgress * 1200));
    const s = 0.96 + safeProgress * 0.06;

    if (containerRef.current) {
      containerRef.current.style.setProperty('--aurexa-progress', safeProgress.toFixed(4));
    }
    if (glow1Ref.current) {
      glow1Ref.current.style.opacity = (0.2 + safeProgress * 0.8).toFixed(3);
    }
    if (glow2Ref.current) {
      glow2Ref.current.style.transform = `translate(-50%, -50%) scale(${(1 + safeProgress * 0.4).toFixed(3)})`;
    }
    if (textContainerRef.current) {
      textContainerRef.current.style.transform = `scale(${s.toFixed(4)})`;
    }
    if (clipRectRef.current) {
      clipRectRef.current.setAttribute('width', clipW.toFixed(1));
    }
    if (laserGroupRef.current && laserLineRef.current) {
      const showLaser = safeProgress > 0.005 && safeProgress < 0.995;
      laserGroupRef.current.style.display = showLaser ? 'inline' : 'none';
      if (showLaser) {
        laserLineRef.current.setAttribute('x1', clipW.toFixed(1));
        laserLineRef.current.setAttribute('x2', clipW.toFixed(1));
      }
    }
    if (subtitleRef.current) {
      const translateY = Math.max(0, (1 - safeProgress) * 10);
      subtitleRef.current.style.transform = `translateY(${translateY.toFixed(2)}px)`;
    }
  }, []);

  useEffect(() => {
    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const handleResize = () => {
      const w = window.innerWidth;
      if (Math.abs(w - lastWidth) < 2) return;
      lastWidth = w;
      setIsMobile(w < 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Helper to safely lock/unlock Lenis outer scroll (Desktop only - NEVER locks on mobile)
  const lockPage = useCallback(() => {
    if (isMobile) return;
    if (!isLockedRef.current && !isUnlockedRef.current) {
      isLockedRef.current = true;
      if (lenis) {
        lenis.stop();
      }
    }
  }, [lenis, isMobile]);

  const unlockPage = useCallback(() => {
    isLockedRef.current = false;
    isUnlockedRef.current = true;
    setIsUnlocked(true);
    if (lenis) {
      lenis.start();
    }
  }, [lenis]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (lenis) {
        lenis.start();
      }
    };
  }, [lenis]);

  // 1. Detect when Aurexa section enters view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true);
            if (!isMobile && !isUnlockedRef.current) {
              lockPage();
            } else if (isMobile) {
              // On mobile, never lock scroll; allow smooth native progression
              setIsUnlocked(true);
              isUnlockedRef.current = true;
            }
          }
        });
      },
      {
        threshold: isMobile ? 0.2 : 0.6,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lockPage, isMobile]);

  // 2. Play animation smoothly once started
  useEffect(() => {
    if (!hasStarted) return;

    let animId: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      // Auto-advance smoothly over ~1.6 seconds
      progressRef.current = Math.min(1, progressRef.current + delta * (isMobile ? 0.75 : 0.5));
      applyVisualProgress(progressRef.current);

      if (progressRef.current >= 0.999) {
        progressRef.current = 1;
        applyVisualProgress(1);
        unlockPage();
      } else {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [hasStarted, unlockPage, isMobile, applyVisualProgress]);

  // 3. Desktop user wheel interaction accelerates the animation while holding the page in place
  useEffect(() => {
    if (isUnlocked || !hasStarted || isMobile) return;

    const onWheel = (e: WheelEvent) => {
      if (!isUnlockedRef.current && hasStarted && !isMobile) {
        e.preventDefault();
        e.stopPropagation();

        if (e.deltaY > 0) {
          progressRef.current = Math.min(1, progressRef.current + Math.min(Math.abs(e.deltaY) * 0.003, 0.15));
          applyVisualProgress(progressRef.current);
          if (progressRef.current >= 0.999) {
            progressRef.current = 1;
            applyVisualProgress(1);
            unlockPage();
          }
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [hasStarted, isUnlocked, unlockPage, isMobile, applyVisualProgress]);

  return (
    <section
      ref={containerRef}
      id="aurexa"
      className="relative w-full h-[100dvh] min-h-[560px] sm:min-h-[650px] bg-[#070809] overflow-hidden select-none flex flex-col justify-between items-center border-t border-b border-white/[0.06] py-8 sm:py-14 px-4 sm:px-8 touch-pan-y"
    >
      {/* 1. DESKTOP INTERACTIVE CURSOR IMAGE TRAIL */}
      {!isMobile && (
        <div
          className="absolute inset-0 z-[5] pointer-events-none sm:pointer-events-auto transition-opacity duration-500"
          style={{ opacity: isUnlocked ? 1 : 0 }}
        >
          <Suspense fallback={null}>
            <ImageTrail items={AUREXA_TRAIL_IMAGES} variant={7} />
          </Suspense>
        </div>
      )}

      {/* 2. MOBILE LIGHTWEIGHT STATIC CURATED SLABS (Zero-lag, 100% smooth GPU layer) */}
      {isMobile && (
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden flex items-center justify-center opacity-65">
          <div className="relative w-full max-w-sm h-56">
            <img
              src="/assets/images/imagetrail2.webp"
              alt="Aurexa Specimen"
              loading="lazy"
              decoding="async"
              className="absolute left-4 top-2 w-28 h-36 rounded-xl object-cover -rotate-6 border border-white/20 shadow-2xl brightness-95"
            />
            <img
              src="/assets/images/imagetrail3.webp"
              alt="Aurexa Specimen"
              loading="lazy"
              decoding="async"
              className="absolute left-1/2 -translate-x-1/2 top-0 w-32 h-40 rounded-xl object-cover z-10 border border-[#b89a62]/60 shadow-[0_15px_35px_rgba(0,0,0,0.85)] brightness-105"
            />
            <img
              src="/assets/images/imagetrail4.webp"
              alt="Aurexa Specimen"
              loading="lazy"
              decoding="async"
              className="absolute right-4 top-3 w-28 h-36 rounded-xl object-cover rotate-6 border border-white/20 shadow-2xl brightness-95"
            />
          </div>
        </div>
      )}

      {/* 2. AMBIENT GLOWS */}
      <div
        ref={glow1Ref}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1100px] h-[550px] bg-[#b89a62]/[0.09] rounded-full blur-[190px] pointer-events-none transition-opacity duration-500"
        style={{ opacity: 0.2 }}
      />
      <div
        ref={glow2Ref}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[360px] bg-[#f5e0b0]/[0.08] rounded-full blur-[140px] pointer-events-none transition-transform duration-500"
        style={{ transform: 'translate(-50%, -50%) scale(1)' }}
      />

      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      {/* 4. HARDWARE-ACCELERATED SVG TEXT SCROLL MASK (In front of ImageTrail) */}
      <div
        ref={textContainerRef}
        className="relative z-20 w-full max-w-6xl my-auto flex flex-col items-center justify-center transition-transform duration-100 ease-out pointer-events-none"
        style={{ transform: 'scale(0.96)' }}
      >
        <svg
          viewBox="0 0 1200 240"
          className="w-full h-auto max-h-[38vh] overflow-visible drop-shadow-[0_10px_40px_rgba(0,0,0,0.95)]"
        >
          <defs>
            {/* Liquid Gold Marble Gradient */}
            <linearGradient id="aurexaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="18%" stopColor="#faecd2" />
              <stop offset="42%" stopColor="#d8b776" />
              <stop offset="68%" stopColor="#967437" />
              <stop offset="85%" stopColor="#f6e6c4" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* Laser Beam Gradient */}
            <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8e3b4" stopOpacity="0" />
              <stop offset="15%" stopColor="#f8e3b4" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="85%" stopColor="#b89a62" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#b89a62" stopOpacity="0" />
            </linearGradient>

            {/* Laser Glow Filter */}
            <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* SVG Clip Path */}
            <clipPath id="aurexaScrollClip">
              <rect ref={clipRectRef} x="0" y="0" width="0" height="240" />
            </clipPath>
          </defs>

          {/* LAYER 1: BASE UNFILLED OUTLINE */}
          <text
            x="600"
            y="165"
            textAnchor="middle"
            fill="none"
            stroke="rgba(184, 154, 98, 0.28)"
            strokeWidth="1.5"
            style={{
              fontFamily: 'var(--font-heading, "Syne", sans-serif)',
              fontSize: '155px',
              fontWeight: 300,
              letterSpacing: '0.14em',
            }}
          >
            AUREXA
          </text>

          {/* LAYER 2: MASKED LIQUID GOLD FILL */}
          <g clipPath="url(#aurexaScrollClip)">
            <text
              x="600"
              y="165"
              textAnchor="middle"
              fill="url(#aurexaGoldGrad)"
              stroke="rgba(255, 240, 195, 0.65)"
              strokeWidth="1.2"
              style={{
                fontFamily: 'var(--font-heading, "Syne", sans-serif)',
                fontSize: '155px',
                fontWeight: 300,
                letterSpacing: '0.14em',
                filter: 'drop-shadow(0 0 25px rgba(184, 154, 98, 0.45))',
              }}
            >
              AUREXA
            </text>
          </g>

          {/* LAYER 3: LEADING EDGE LASER SHINE */}
          <g ref={laserGroupRef} filter="url(#laserGlow)" style={{ display: 'none' }}>
            <line
              ref={laserLineRef}
              x1="0"
              y1="18"
              x2="0"
              y2="202"
              stroke="url(#laserBeamGrad)"
              strokeWidth="3.5"
            />
          </g>
        </svg>

        {/* 5. EDITORIAL SUBTITLE & ACCENT LINE */}
        <div
          ref={subtitleRef}
          className="mt-4 sm:mt-6 max-w-xl text-center transition-all duration-500 ease-out px-4 relative z-30"
          style={{
            transform: 'translateY(10px)',
          }}
        >
          <p
            style={{
              color: '#ffffff',
              WebkitTextFillColor: '#ffffff',
              opacity: 1,
              textShadow: '0 0 20px rgba(255, 255, 255, 0.9), 0 2px 10px rgba(0, 0, 0, 0.95), 0 0 2px #000000',
            }}
            className="text-xs sm:text-sm md:text-base !text-white font-semibold tracking-[0.26em] uppercase leading-relaxed select-none"
          >
            Experience the Unforgettable
          </p>
          <div
            style={{
              backgroundColor: '#ffffff',
              background: 'linear-gradient(90deg, transparent 0%, #ffffff 50%, transparent 100%)',
              boxShadow: '0 0 14px rgba(255, 255, 255, 1)',
            }}
            className="w-24 h-[2px] bg-white mx-auto mt-3"
          />
        </div>
      </div>

      {/* 6. BOTTOM ACTION: Click Here to Aurexa Website */}
      <div className="relative z-40 flex flex-col items-center gap-3 pointer-events-auto">
        <Link
          to="/coming-soon"
          className="group cursor-pointer px-8 py-3.5 rounded-full bg-[#b89a62]/20 hover:bg-[#b89a62]/35 border border-[#b89a62]/60 hover:border-[#b89a62] text-[#f8f0dc] text-xs uppercase tracking-[0.25em] font-medium inline-flex items-center gap-3 shadow-[0_4px_25px_rgba(184,154,98,0.25)] hover:shadow-[0_4px_35px_rgba(184,154,98,0.45)] transition-all duration-300 active:scale-95"
        >
          <span>Click Here</span>
          <ArrowUpRight className="w-4 h-4 text-[#b89a62] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

export default AurexaSection;
