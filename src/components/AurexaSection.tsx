import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useLenis } from './SmoothScroll';
import ImageTrail from './ImageTrail';

const AUREXA_TRAIL_IMAGES = [
  '/assets/images/imagetrail1.jpg',
  '/assets/images/imagetrail2.jpg',
  '/assets/images/imagetrail3.jpg',
  '/assets/images/imagetrail4.jpg',
  '/assets/images/imagetrail5.jpg',
  '/assets/images/imagetrail6.jpg',
  '/assets/images/imagetrail9.jpg',
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

  // Progress: 0.0 -> 1.0
  const [progress, setProgress] = useState<number>(0);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  // Mobile spawned touch cards
  const [spawnedCards, setSpawnedCards] = useState<FloatingCard[]>([]);
  const nextSpawnIdRef = useRef<number>(1);
  const lastSpawnIndexRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);

  const progressRef = useRef<number>(0);
  const isUnlockedRef = useRef<boolean>(false);
  const isLockedRef = useRef<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to safely lock/unlock Lenis outer scroll
  const lockPage = useCallback(() => {
    if (!isLockedRef.current && !isUnlockedRef.current) {
      isLockedRef.current = true;
      if (lenis) {
        lenis.stop();
      }
    }
  }, [lenis]);

  const unlockPage = useCallback(() => {
    if (isLockedRef.current || !isUnlockedRef.current) {
      isLockedRef.current = false;
      isUnlockedRef.current = true;
      setIsUnlocked(true);
      if (lenis) {
        lenis.start();
      }
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
          if (entry.isIntersecting && !isUnlockedRef.current) {
            if (!isMobile) {
              lockPage();
            }
            setHasStarted(true);
          }
        });
      },
      {
        threshold: isMobile ? 0.35 : 0.6,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lockPage, isMobile]);

  // 2. Play animation smoothly once started, and allow wheel/swipe to advance it
  useEffect(() => {
    if (!hasStarted || isUnlockedRef.current) return;

    let animId: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Auto-advance smoothly over ~2.0 seconds if user is idle
      progressRef.current = Math.min(1, progressRef.current + delta * 0.5);
      setProgress(progressRef.current);

      if (progressRef.current >= 0.999) {
        progressRef.current = 1;
        setProgress(1);
        unlockPage();
      } else {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [hasStarted, unlockPage]);

  // 3. User wheel interaction accelerates the animation while holding the page in place
  useEffect(() => {
    if (isUnlocked || !hasStarted) return;

    const onWheel = (e: WheelEvent) => {
      if (!isUnlockedRef.current && hasStarted) {
        e.preventDefault();
        e.stopPropagation();

        if (e.deltaY > 0) {
          progressRef.current = Math.min(1, progressRef.current + Math.min(Math.abs(e.deltaY) * 0.003, 0.15));
          setProgress(progressRef.current);
          if (progressRef.current >= 0.999) {
            progressRef.current = 1;
            setProgress(1);
            unlockPage();
          }
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [hasStarted, isUnlocked, unlockPage]);

  // Mobile interaction state: once user taps to see image trails, vanish ambient background cards
  const [hasTappedTrail, setHasTappedTrail] = useState<boolean>(false);

  // Mobile Touch Spawning Function
  const spawnCardAt = useCallback((clientX: number, clientY: number) => {
    setHasTappedTrail(true);
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const imgIndex = lastSpawnIndexRef.current % AUREXA_TRAIL_IMAGES.length;
    lastSpawnIndexRef.current += 1;

    const newCard: FloatingCard = {
      id: nextSpawnIdRef.current++,
      src: AUREXA_TRAIL_IMAGES[imgIndex],
      x,
      y,
      rotation: (Math.random() - 0.5) * 16,
      scale: 0.9 + Math.random() * 0.25,
      opacity: 1,
    };

    setSpawnedCards((prev) => [...prev.slice(-6), newCard]);

    // Fade out and remove spawned card after 1.8s
    setTimeout(() => {
      setSpawnedCards((prev) => prev.filter((c) => c.id !== newCard.id));
    }, 1800);
  }, []);

  // Touch swipe support for mobile devices
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    if (e.touches.length > 0) {
      spawnCardAt(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const now = performance.now();
      if (now - lastSpawnTimeRef.current > 140) {
        lastSpawnTimeRef.current = now;
        spawnCardAt(touch.clientX, touch.clientY);
      }
    }

    if (!isUnlockedRef.current && hasStarted) {
      const currentY = e.touches[0].clientY;
      const diffY = touchStartY.current - currentY;
      if (diffY > 5) {
        progressRef.current = Math.min(1, progressRef.current + diffY * 0.004);
        setProgress(progressRef.current);
        touchStartY.current = currentY;
        if (progressRef.current >= 0.999) {
          progressRef.current = 1;
          setProgress(1);
          unlockPage();
        }
      }
    }
  };

  // Visual calculation
  const clipWidth = progress * 1200; // SVG viewBox 1200 x 240
  const scale = 0.96 + progress * 0.06;

  // Mobile Ambient Background Floating Cards
  const ambientCards = [
    { src: AUREXA_TRAIL_IMAGES[0], top: '15%', left: '8%', rot: '-8deg', delay: '0s', size: 'w-24 h-32' },
    { src: AUREXA_TRAIL_IMAGES[1], top: '22%', right: '6%', rot: '10deg', delay: '1.2s', size: 'w-28 h-36' },
    { src: AUREXA_TRAIL_IMAGES[2], bottom: '18%', left: '10%', rot: '6deg', delay: '2.4s', size: 'w-28 h-36' },
    { src: AUREXA_TRAIL_IMAGES[3], bottom: '24%', right: '8%', rot: '-6deg', delay: '3.6s', size: 'w-24 h-32' },
  ];

  return (
    <section
      ref={containerRef}
      id="aurexa"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onClick={(e) => {
        if (isMobile) {
          spawnCardAt(e.clientX, e.clientY);
        }
      }}
      style={{ touchAction: 'pan-y' }}
      className="relative w-full h-[100dvh] min-h-[580px] sm:min-h-[650px] bg-[#070809] overflow-hidden select-none flex flex-col justify-between items-center border-t border-b border-white/[0.06] py-8 sm:py-14 px-4 sm:px-8"
    >
      {/* 1. DESKTOP INTERACTIVE CURSOR IMAGE TRAIL */}
      {!isMobile && (
        <div
          className="absolute inset-0 z-[5] pointer-events-none sm:pointer-events-auto transition-opacity duration-500"
          style={{ opacity: isUnlocked ? 1 : 0 }}
        >
          <ImageTrail items={AUREXA_TRAIL_IMAGES} variant={7} />
        </div>
      )}

      {/* 1B. MOBILE AUTONOMOUS AMBIENT KINETIC FLOATING STREAM (Vanishes completely upon tap/interaction) */}
      {isMobile && isUnlocked && !hasTappedTrail && (
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden transition-opacity duration-700">
          {ambientCards.map((card, idx) => (
            <div
              key={idx}
              style={{
                top: card.top,
                left: card.left,
                right: card.right,
                bottom: card.bottom,
                animation: `float-slow 6s ease-in-out infinite alternate ${card.delay}`,
                transform: `rotate(${card.rot})`,
              }}
              className={`absolute ${card.size} rounded-xl p-1 bg-white/[0.08] border border-[#b89a62]/40 shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(184,154,98,0.25)] backdrop-blur-md opacity-70 transition-all duration-700`}
            >
              <div className="w-full h-full rounded-lg overflow-hidden border border-white/20">
                <img
                  src={card.src}
                  alt="Aurexa Haute Slab Cut"
                  loading="lazy"
                  className="w-full h-full object-cover object-center brightness-105"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1C. MOBILE INTERACTIVE TOUCH-SPAWNED FLOATING CARDS */}
      {isMobile && (
        <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden">
          {spawnedCards.map((card) => (
            <div
              key={card.id}
              style={{
                left: `${card.x}px`,
                top: `${card.y}px`,
                transform: `translate(-50%, -50%) rotate(${card.rotation}deg) scale(${card.scale})`,
                animation: 'lunore-card-pop 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
              className="absolute w-28 h-36 rounded-xl p-1 bg-white/[0.12] border border-[#b89a62]/80 shadow-[0_20px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(184,154,98,0.45)] backdrop-blur-lg"
            >
              <div className="w-full h-full rounded-lg overflow-hidden border border-white/30">
                <img
                  src={card.src}
                  alt="Aurexa Haute Slab Cutout"
                  className="w-full h-full object-cover object-center brightness-110"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. AMBIENT GLOWS */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1100px] h-[550px] bg-[#b89a62]/[0.09] rounded-full blur-[190px] pointer-events-none transition-opacity duration-500"
        style={{ opacity: 0.2 + progress * 0.8 }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[360px] bg-[#f5e0b0]/[0.08] rounded-full blur-[140px] pointer-events-none transition-transform duration-500"
        style={{ transform: `translate(-50%, -50%) scale(${1 + progress * 0.4})` }}
      />

      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      {/* 3. TOP PILL BADGE */}
      <div className="relative z-20 flex flex-col items-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#b89a62]/35 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <Sparkles className="w-3.5 h-3.5 text-[#b89a62]" />
          <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#ded9cf] font-medium">
            The Haute Stone Pavilion
          </span>
        </div>
      </div>

      {/* 4. HARDWARE-ACCELERATED SVG TEXT SCROLL MASK (In front of ImageTrail) */}
      <div
        className="relative z-20 w-full max-w-6xl my-auto flex flex-col items-center justify-center transition-transform duration-100 ease-out pointer-events-none"
        style={{ transform: `scale(${scale})` }}
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
              <rect x="0" y="0" width={clipWidth} height="240" />
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
          {progress > 0.005 && progress < 0.995 && (
            <g filter="url(#laserGlow)">
              <line
                x1={clipWidth}
                y1="18"
                x2={clipWidth}
                y2="202"
                stroke="url(#laserBeamGrad)"
                strokeWidth="3.5"
              />
            </g>
          )}
        </svg>

        {/* 5. EDITORIAL SUBTITLE */}
        <div
          className="mt-4 sm:mt-6 max-w-xl text-center transition-all duration-500 ease-out px-4"
          style={{
            opacity: Math.max(0, (progress - 0.25) * 1.5),
            transform: `translateY(${Math.max(0, (1 - progress) * 16)}px)`,
          }}
        >
          <p className="text-xs sm:text-sm md:text-base text-[#ded9cf] font-light tracking-[0.24em] uppercase leading-relaxed">
            Monolithic Quarry Cuts &amp; Rare Haute Slabs
          </p>
          <div className="w-14 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto mt-3" />
        </div>
      </div>

      {/* 6. BOTTOM ACTION: Click Here to Aurexa Website */}
      <div className="relative z-40 flex flex-col items-center gap-3 pointer-events-auto">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="group cursor-pointer px-8 py-3.5 rounded-full bg-[#b89a62]/20 hover:bg-[#b89a62]/35 border border-[#b89a62]/60 hover:border-[#b89a62] text-[#f8f0dc] text-xs uppercase tracking-[0.25em] font-medium inline-flex items-center gap-3 shadow-[0_4px_25px_rgba(184,154,98,0.25)] hover:shadow-[0_4px_35px_rgba(184,154,98,0.45)] transition-all duration-300 active:scale-95"
        >
          <span>Click Here</span>
          <ArrowUpRight className="w-4 h-4 text-[#b89a62] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}

export default AurexaSection;
