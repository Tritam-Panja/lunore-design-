import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, RotateCcw, ChevronDown } from 'lucide-react';
import { images } from '@/lib/images';

export interface SculptureItem {
  id: string;
  title: string;
  category: string;
  material: string;
  dimensions: string;
  year: string;
  edition: string;
  image: string;
}

export const SCULPTURE_CAROUSEL_ITEMS: SculptureItem[] = [
  {
    id: '01',
    title: 'Classical Sanctuary',
    category: 'Classical Masterpiece',
    material: 'Hand-Carved Carrara Marble & Gilded Bronze',
    dimensions: '240 × 120 × 90 cm',
    year: '2026',
    edition: 'Masterpiece 1 of 1',
    image: images.sculptureHero,
  },
  {
    id: '02',
    title: 'Limestone Relief',
    category: 'Architectural Feature',
    material: 'Hand-Chiseled French Limestone',
    dimensions: '180 × 180 × 25 cm',
    year: '2026',
    edition: 'Edition of 3',
    image: 'https://images.pexels.com/photos/27552329/pexels-photo-27552329.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '03',
    title: 'Figurative Sculptures',
    category: 'Classical Form',
    material: 'Polished Italian Carrara Marble',
    dimensions: '195 × 75 × 70 cm',
    year: '2025',
    edition: 'Masterpiece 1 of 1',
    image: 'https://images.pexels.com/photos/4997068/pexels-photo-4997068.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '04',
    title: 'Gilded Marble Sculptures',
    category: 'Premium Adornment',
    material: 'Veined Nero Marquina & 24k Gold Leaf',
    dimensions: '210 × 90 × 80 cm',
    year: '2026',
    edition: 'Edition of 2',
    image: 'https://images.pexels.com/photos/14680179/pexels-photo-14680179.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '05',
    title: 'Spiritual Sculpture',
    category: 'Ethereal Art',
    material: 'Backlit Translucent Statuary Onyx',
    dimensions: '240 × 110 × 90 cm',
    year: '2026',
    edition: 'Unique 1 of 1',
    image: 'https://images.pexels.com/photos/33753643/pexels-photo-33753643.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '06',
    title: 'Monumental Monolith',
    category: 'Monumental Artwork',
    material: 'Monolithic Belgian Black Granite',
    dimensions: '260 × 95 × 70 cm',
    year: '2026',
    edition: 'Masterpiece 1 of 1',
    image: 'https://images.pexels.com/photos/29127901/pexels-photo-29127901.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '07',
    title: 'Celestial Torso',
    category: 'Visionary Heritage',
    material: 'Crystalline Statuario Marble',
    dimensions: '185 × 70 × 60 cm',
    year: '2025',
    edition: 'Edition of 2',
    image: 'https://images.pexels.com/photos/4702882/pexels-photo-4702882.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export function SculpturesExperience() {
  const [experienceState, setExperienceState] = useState<'entrance' | 'statement' | 'carousel'>('entrance');
  
  // Continuous pinch progress: 0.0 (fullscreen landscape) -> 1.0 (docked in 3D portrait carousel)
  const [pinchProgress, setPinchProgress] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [viewport, setViewport] = useState({ w: 1440, h: 900 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const targetPinchRef = useRef<number>(0);
  const currentPinchRef = useRef<number>(0);

  const targetRotationRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(0);
  const containerRef = useRef<HTMLElement>(null);
  
  // Drag & Inertia Tracking
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartRotationRef = useRef<number>(0);
  const lastDragTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const touchStartRef = useRef<{ x: number; y: number; pinch: number; rot: number } | null>(null);

  const total = SCULPTURE_CAROUSEL_ITEMS.length;
  const activeIndex = ((Math.round(rotation) % total) + total) % total;

  // Viewport resize tracking
  useEffect(() => {
    const updateSize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Continuous 60fps RAF physics interpolation with viewport visibility throttling
  useEffect(() => {
    let animId: number | null = null;
    let isVisible = true;

    const updatePhysics = () => {
      if (!isVisible) {
        animId = null;
        return;
      }

      // 1. Smooth lerp for pinch-in morph progress
      const pinchDiff = targetPinchRef.current - currentPinchRef.current;
      if (Math.abs(pinchDiff) > 0.0002) {
        currentPinchRef.current += pinchDiff * 0.10;
        setPinchProgress(currentPinchRef.current);
      }

      // 2. Idle ambient auto-drift (Smooth endless infinite scroll)
      const now = Date.now();
      const isDockedNow = currentPinchRef.current >= 0.90;
      if (
        isDockedNow &&
        !isDraggingRef.current &&
        !isHoveredRef.current &&
        now - lastInteractionTimeRef.current > 2400
      ) {
        targetRotationRef.current += 0.0028;
      }

      // 3. Smooth lerp for 3D carousel rotation with infinite momentum damping
      const rotDiff = targetRotationRef.current - currentRotationRef.current;
      if (Math.abs(rotDiff) > 0.0001) {
        currentRotationRef.current += rotDiff * 0.12;
        setRotation(currentRotationRef.current);
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && animId === null) {
            animId = requestAnimationFrame(updatePhysics);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (animId !== null) cancelAnimationFrame(animId);
    };
  }, []);

  // Actions
  const handleEnter = useCallback(() => {
    setExperienceState('statement');
    // On mobile and desktop, smoothly morph into the docked 3D carousel
    targetPinchRef.current = 1;
    lastInteractionTimeRef.current = Date.now();
  }, []);

  // Direct trigger to smoothly morph into the docked carousel
  const handleTriggerCarousel = useCallback(() => {
    targetPinchRef.current = 1;
    lastInteractionTimeRef.current = Date.now();
  }, []);

  const handleReset = useCallback(() => {
    setExperienceState('entrance');
    targetPinchRef.current = 0;
    currentPinchRef.current = 0;
    setPinchProgress(0);
    targetRotationRef.current = 0;
    currentRotationRef.current = 0;
    setRotation(0);
    lastInteractionTimeRef.current = Date.now();
  }, []);

  const handlePrev = useCallback(() => {
    targetRotationRef.current = Math.round(targetRotationRef.current) - 1;
    lastInteractionTimeRef.current = Date.now();
  }, []);

  const handleNext = useCallback(() => {
    targetRotationRef.current = Math.round(targetRotationRef.current) + 1;
    lastInteractionTimeRef.current = Date.now();
  }, []);

  // Wheel scroll handler:
  // - Statement view: vertical scroll pinches into carousel
  // - Docked carousel: horizontal wheel/trackpad scrubbing rotates carousel infinitely!
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (experienceState !== 'entrance' && currentPinchRef.current < 0.95) {
        if (e.deltaY > 0) {
          targetPinchRef.current = Math.min(1, targetPinchRef.current + Math.min(e.deltaY * 0.0035, 0.45));
          lastInteractionTimeRef.current = Date.now();
        } else if (e.deltaY < 0 && targetPinchRef.current > 0.05) {
          targetPinchRef.current = Math.max(0, targetPinchRef.current + e.deltaY * 0.0035);
          lastInteractionTimeRef.current = Date.now();
        }
      } else if (currentPinchRef.current >= 0.95) {
        // When docked in carousel, horizontal wheel or Shift+Scroll infinitely rotates carousel
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) {
          targetRotationRef.current += e.deltaX * 0.0028;
          lastInteractionTimeRef.current = Date.now();
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, [experienceState]);

  // =========================================================================
  // MOUSE DRAG & INERTIA FLICK (INFINITE CONTINUOUS SCRUBBING)
  // =========================================================================
  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentPinchRef.current < 0.90) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartRotationRef.current = targetRotationRef.current;
    lastDragTimeRef.current = performance.now();
    velocityRef.current = 0;
    lastInteractionTimeRef.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastDragTimeRef.current);
    const diffX = dragStartXRef.current - e.clientX;
    const newTarget = dragStartRotationRef.current + diffX * 0.0038;
    
    velocityRef.current = (newTarget - targetRotationRef.current) / dt;
    targetRotationRef.current = newTarget;
    lastDragTimeRef.current = now;
    lastInteractionTimeRef.current = Date.now();
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    
    // Apply inertia fling
    const fling = Math.max(-1.8, Math.min(1.8, velocityRef.current * 75));
    targetRotationRef.current = Math.round(targetRotationRef.current + fling);
    lastInteractionTimeRef.current = Date.now();
  };

  // Touch Swipe & Drag Handling (Infinite continuous mobile rotation)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (experienceState === 'entrance') return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      pinch: targetPinchRef.current,
      rot: targetRotationRef.current,
    };
    lastDragTimeRef.current = performance.now();
    velocityRef.current = 0;
    lastInteractionTimeRef.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || experienceState === 'entrance') return;
    const diffY = touchStartRef.current.y - e.touches[0].clientY;
    const diffX = touchStartRef.current.x - e.touches[0].clientX;
    const now = performance.now();
    const dt = Math.max(1, now - lastDragTimeRef.current);

    if (currentPinchRef.current < 0.95) {
      if (diffY > 10) {
        targetPinchRef.current = Math.min(1, touchStartRef.current.pinch + diffY * 0.004);
      }
    } else {
      // Infinite horizontal swipe rotation (only captures when dragging horizontally)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 6) {
        const newTarget = touchStartRef.current.rot + diffX * 0.0045;
        velocityRef.current = (newTarget - targetRotationRef.current) / dt;
        targetRotationRef.current = newTarget;
        lastDragTimeRef.current = now;
        lastInteractionTimeRef.current = Date.now();
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    touchStartRef.current = null;
    if (currentPinchRef.current >= 0.95) {
      const fling = Math.max(-1.5, Math.min(1.5, velocityRef.current * 60));
      targetRotationRef.current = Math.round(targetRotationRef.current + fling);
    }
    lastInteractionTimeRef.current = Date.now();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (experienceState === 'entrance') return;
      if (currentPinchRef.current >= 0.85) {
        if (e.key === 'ArrowLeft') {
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        } else if (e.key === 'Escape') {
          handleReset();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [experienceState, handlePrev, handleNext, handleReset]);

  // =========================================================================
  // CONTINUOUS PINCH-IN & PORTRAIT MORPH INTERPOLATION
  // =========================================================================
  const p = Math.max(0, Math.min(1, pinchProgress));
  const easedP = p * p * (3 - 2 * p); // S-Curve Hermite smoothstep

  // 1. Text Overlay: Fades out smoothly as pinch proceeds
  const textOpacity = Math.max(0, 1 - p * 3.0);
  const textTranslateY = -easedP * 60;
  const textScale = 1 - easedP * 0.04;

  // 2. Landscape -> Portrait Dimensions Morphing
  const isMobile = viewport.w < 640;
  const isTablet = viewport.w >= 640 && viewport.w < 1024;
  const targetCardW = isMobile ? Math.min(250, viewport.w * 0.74) : isTablet ? 300 : 350;
  const targetCardH = isMobile ? Math.min(365, viewport.h * 0.48) : isTablet ? 450 : 520;

  const currentCardW = viewport.w + (targetCardW - viewport.w) * easedP;
  const currentCardH = viewport.h + (targetCardH - viewport.h) * easedP;
  const heroBorderRadius = easedP * 20;
  const heroPadding = easedP * 14;
  const heroGlassOpacity = Math.max(0, (easedP - 0.1) / 0.9);

  // 3. Sibling 3D Fan-Out
  const rawFan = Math.max(0, (p - 0.2) / 0.8);
  const fanEased = rawFan * rawFan * (3 - 2 * rawFan);

  // 4. UI Controls & Docking
  const isDocked = p >= 0.92;
  const controlsOpacity = Math.max(0, (p - 0.78) / 0.22);
  const dockSheenOpacity = Math.max(0, (p - 0.88) / 0.12);

  const isEntrance = experienceState === 'entrance';

  return (
    <section
      ref={containerRef}
      id="projects"
      style={{ touchAction: 'pan-y' }}
      className="relative w-full h-[100dvh] min-h-[600px] bg-[#050607] overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        isHoveredRef.current = false;
      }}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
    >
      {/* 1. ATMOSPHERIC BACKGROUND RADIAL GLOW */}
      <div className="absolute inset-0 bg-[#070809] flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-[900px] h-[900px] rounded-full bg-gradient-to-b from-[#b89a62]/10 via-transparent to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
      </div>

      {/* ========================================================================= */}
      {/* 2. INITIAL ENTRANCE VIEW: "EXPERIENCE THE SCULPTURES" & "ENTER"           */}
      {/* ========================================================================= */}
      {isEntrance && (
        <>
          {/* Fullscreen hero image for entrance */}
          <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            <img
              src={images.sculptureHero}
              alt="LUNORE Signature Sculptures Gallery"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center brightness-100 contrast-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40 pointer-events-none" />
          </div>

          <div className="absolute inset-0 z-30 flex flex-col justify-between items-center p-6 sm:p-10 md:p-14 text-center select-none">
            {/* Top Arch Headline */}
            <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-2 pt-6 sm:pt-10 md:pt-12 z-20">
              <h2
                className="text-lg xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#f1eee7] font-normal tracking-[0.12em] sm:tracking-[0.24em] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] text-center"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Experience The{' '}
                <span className="text-gold-shimmer font-normal uppercase tracking-[0.12em] sm:tracking-[0.24em] drop-shadow-[0_0_25px_rgba(184,154,98,0.55)]">
                  sculptures
                </span>
              </h2>
            </div>

            {/* "ENTER" Button */}
            <div className="w-full flex justify-center mt-auto pb-4 sm:pb-7 z-20">
              <button
                onClick={handleEnter}
                className="group relative cursor-pointer inline-flex items-center justify-center gap-3.5 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/40 hover:border-[#b89a62] text-[#f1eee7] shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(184,154,98,0.45),inset_0_1.5px_3px_rgba(255,255,255,0.6)] transition-all duration-400 transform hover:scale-[1.04] active:scale-[0.98] backdrop-blur-md"
              >
                <span className="absolute inset-x-5 top-0 h-[1.2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                <span className="absolute inset-0 rounded-full border border-[#b89a62]/30 animate-ping opacity-20 pointer-events-none" />

                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white/[0.08] border border-white/30 group-hover:border-[#b89a62]/80 flex items-center justify-center text-[#b89a62] group-hover:rotate-45 transition-transform duration-500 shadow-[0_0_12px_rgba(184,154,98,0.3)]">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>

                <span className="text-xs sm:text-sm tracking-[0.32em] uppercase font-semibold text-[#f1eee7] group-hover:text-[#b89a62] transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  Enter
                </span>

                <ArrowRight className="w-3.5 h-3.5 text-[#b89a62] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE PINCH-IN 3D CAROUSEL GALLERY CANVAS (INFINITE 360° SCROLL) */}
      {/* ========================================================================= */}
      {!isEntrance && (
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 z-20 select-none overflow-hidden">
          
          {/* Top Bar Controls (Fades in when docking into carousel) */}
          <div
            style={{
              opacity: controlsOpacity,
              transform: `translate3d(0, ${(1 - controlsOpacity) * -16}px, 0)`,
              pointerEvents: isDocked ? 'auto' : 'none',
            }}
            className="flex items-center justify-between w-full relative z-40 max-w-7xl mx-auto transition-all duration-300 pt-2"
          >
            <div className="w-24 sm:w-32" />

            {/* Infinite Sculpture Counter */}
            <div className="liquid-glass-pill px-4 py-1.5 rounded-full text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#f1eee7]/90">
              <span className="text-[#b89a62] font-semibold">{SCULPTURE_CAROUSEL_ITEMS[activeIndex].id}</span>
              <span className="text-[#85817a] mx-1.5">/</span>
              <span>0{SCULPTURE_CAROUSEL_ITEMS.length}</span>
            </div>

            {/* Reset to Entrance */}
            <button
              onClick={handleReset}
              className="cursor-pointer liquid-glass-pill hover:border-[#b89a62]/70 hover:text-[#b89a62] px-3.5 sm:px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#f1eee7] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
              title="Reset to Entrance view"
              aria-label="Reset experience"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#b89a62] group-hover:-rotate-90 transition-transform duration-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* 3D CYLINDRICAL STAGE & MORPH CANVAS (INFINITE ROTATION) */}
          <div
            className={`relative w-full flex-1 flex items-center justify-center my-1 sm:my-2 overflow-visible [perspective:1400px] ${
              isDocked ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
          >
            <div className="relative w-full h-full max-h-[480px] sm:max-h-[540px] md:max-h-[600px] flex items-center justify-center [transform-style:preserve-3d]">
              
              {/* 3D PORTRAIT CAROUSEL CARDS */}
              {SCULPTURE_CAROUSEL_ITEMS.map((item, index) => {
                const isHeroCard = index === 0;
                const totalCount = SCULPTURE_CAROUSEL_ITEMS.length;
                let diff = (index - (rotation % totalCount)) % totalCount;
                if (diff > totalCount / 2) diff -= totalCount;
                if (diff < -totalCount / 2) diff += totalCount;

                const isCenter = Math.abs(diff) < 0.45;
                const isVisible = Math.abs(diff) <= 3.2;

                // 3D Geometry
                const radius = isMobile ? Math.min(480, viewport.w * 1.15) : isTablet ? 660 : 820;
                const angleDeg = diff * (isMobile ? 26 : 23);
                const angleRad = (angleDeg * Math.PI) / 180;

                const targetTranslateX = radius * Math.sin(angleRad);
                const targetTranslateZ = radius * (Math.cos(angleRad) - 1) + 45;
                const targetRotateY = angleDeg * 0.95;
                const baseScale = Math.max(0.78, 1 - Math.abs(diff) * 0.05);
                const targetOpacity = isVisible ? Math.max(0.15, 1 - Math.pow(Math.abs(diff) / 3.2, 1.8)) : 0;
                const zIndex = Math.round(30 - Math.abs(diff) * 8);

                // 1. CENTER HERO CARD (Landscape Fullscreen -> Portrait Card Morph)
                if (isHeroCard) {
                  const heroTranslateX = targetTranslateX * easedP;
                  const heroTranslateZ = targetTranslateZ * easedP;
                  const heroRotateY = targetRotateY * easedP;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (isDocked && Math.abs(diff) > 0.3) {
                          targetRotationRef.current = Math.round(targetRotationRef.current + diff);
                          lastInteractionTimeRef.current = Date.now();
                        }
                      }}
                      style={{
                        width: `${currentCardW}px`,
                        height: `${currentCardH}px`,
                        transform: `translate3d(${heroTranslateX}px, 0, ${heroTranslateZ}px) rotateY(${heroRotateY}deg)`,
                        zIndex: 45,
                        pointerEvents: isDocked ? 'auto' : 'none',
                        willChange: 'width, height, transform',
                      }}
                      className="absolute select-none transition-shadow duration-300"
                    >
                      {/* LIQUID GLASS PANEL */}
                      <div
                        style={{
                          borderRadius: `${heroBorderRadius}px`,
                          padding: `${heroPadding}px`,
                          backgroundColor: `rgba(255, 255, 255, ${0.08 * heroGlassOpacity})`,
                          borderColor: `rgba(255, 255, 255, ${0.5 * heroGlassOpacity})`,
                          boxShadow: isCenter && isDocked
                            ? '0 30px 75px rgba(0,0,0,0.9), 0 0 40px rgba(184,154,98,0.28), inset 0 1.5px 2px rgba(255,255,255,0.6)'
                            : `0 20px 50px rgba(0,0,0,${0.7 * heroGlassOpacity})`,
                        }}
                        className="relative w-full h-full overflow-hidden backdrop-blur-2xl border flex flex-col items-center justify-center"
                      >
                        {/* Top Specular Edge Glow */}
                        <div
                          style={{ opacity: heroGlassOpacity }}
                          className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-10"
                        />

                        {/* Inner Media Frame */}
                        <div
                          style={{
                            borderRadius: `${Math.max(0, heroBorderRadius - 4)}px`,
                          }}
                          className="relative w-full h-full border border-white/25 bg-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            style={{
                              filter: `brightness(${0.72 + 0.28 * easedP}) contrast(${1.06 - 0.02 * easedP})`,
                            }}
                            className="w-full h-full object-cover object-center pointer-events-none transition-[filter] duration-500"
                          />

                          {/* Statement Dimmer (Clears as card pinches in) */}
                          <div
                            style={{ opacity: Math.max(0, (1 - easedP) * 0.70) }}
                            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/75 pointer-events-none transition-opacity duration-500"
                          />

                          {/* Gradient Vignettes */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.08] pointer-events-none" />
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

                          {/* Center Ambient Gold Hue for Active Card */}
                          {isCenter && isDocked && (
                            <div className="absolute -bottom-8 inset-x-0 h-24 bg-gradient-to-t from-[#b89a62]/25 to-transparent pointer-events-none" />
                          )}

                          {/* Golden Dock Sheen */}
                          {dockSheenOpacity > 0 && (
                            <div
                              style={{ opacity: dockSheenOpacity }}
                              className="absolute inset-0 border-2 border-[#b89a62]/50 shadow-[inset_0_0_20px_rgba(184,154,98,0.3)] pointer-events-none rounded-[inherit]"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // 2. SIBLING 3D CAROUSEL CARDS (Continuous 360° Loop)
                const currentTranslateX = targetTranslateX * fanEased;
                const currentTranslateZ = targetTranslateZ * fanEased + (1 - fanEased) * -280;
                const currentRotateY = targetRotateY * fanEased;
                const currentScale = baseScale * (0.65 + fanEased * 0.35);
                const currentOpacity = isVisible ? targetOpacity * fanEased : 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isDocked && Math.abs(diff) > 0.3) {
                        targetRotationRef.current = Math.round(targetRotationRef.current + diff);
                        lastInteractionTimeRef.current = Date.now();
                      }
                    }}
                    style={{
                      width: `${targetCardW}px`,
                      height: `${targetCardH}px`,
                      transform: `translate3d(${currentTranslateX}px, 0, ${currentTranslateZ}px) rotateY(${currentRotateY}deg) scale(${currentScale})`,
                      opacity: currentOpacity,
                      zIndex,
                      pointerEvents: isDocked && isVisible ? 'auto' : 'none',
                      willChange: 'transform, opacity',
                    }}
                    className={`absolute rounded-2xl select-none transition-shadow duration-300 ${
                      isCenter
                        ? 'shadow-[0_30px_75px_rgba(0,0,0,0.9),0_0_40px_rgba(184,154,98,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.6)] border border-white/60'
                        : 'shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.35)] border border-white/30 hover:border-white/50'
                    }`}
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.08)_100%)] p-3 sm:p-4 flex flex-col items-center justify-center">
                      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-10" />
                      
                      <div className="relative w-full h-full rounded-xl border border-white/25 bg-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center brightness-95 contrast-105 pointer-events-none"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.08] pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Bottom Controls & Free Carousel Navigation (Revealed when docked) */}
          <div
            style={{
              opacity: controlsOpacity,
              transform: `translate3d(0, ${(1 - controlsOpacity) * 16}px, 0)`,
              pointerEvents: isDocked ? 'auto' : 'none',
            }}
            className="flex items-center justify-between w-full relative z-40 pt-2 max-w-7xl mx-auto transition-all duration-300"
          >
            {/* Prev Chevron */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="cursor-pointer liquid-glass-pill p-2.5 sm:p-3 rounded-full hover:border-[#b89a62] hover:text-[#b89a62] text-[#f1eee7] transition-all active:scale-95"
              aria-label="Previous Sculpture"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Infinite Pagination Dots */}
            <div className="flex items-center gap-2">
              {SCULPTURE_CAROUSEL_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentNorm = ((Math.round(targetRotationRef.current) % total) + total) % total;
                    let stepDiff = (idx - currentNorm) % total;
                    if (stepDiff > total / 2) stepDiff -= total;
                    if (stepDiff < -total / 2) stepDiff += total;
                    targetRotationRef.current = Math.round(targetRotationRef.current) + stepDiff;
                    lastInteractionTimeRef.current = Date.now();
                  }}
                  className={`cursor-pointer transition-all duration-400 rounded-full ${
                    idx === activeIndex
                      ? 'w-7 sm:w-9 h-1.5 bg-[#b89a62] shadow-[0_0_12px_rgba(184,154,98,0.7)]'
                      : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to sculpture ${item.id}`}
                />
              ))}
            </div>

            {/* Next Chevron */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="cursor-pointer liquid-glass-pill p-2.5 sm:p-3 rounded-full hover:border-[#b89a62] hover:text-[#b89a62] text-[#f1eee7] transition-all active:scale-95"
              aria-label="Next Sculpture"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 4. STATEMENT NARRATIVE TEXT (Visible on enter, pinches away on scroll)    */}
          {/* ========================================================================= */}
          {textOpacity > 0.01 && (
            <div
              style={{
                opacity: textOpacity,
                transform: `translate3d(0, ${textTranslateY}px, 0) scale(${textScale})`,
                pointerEvents: textOpacity > 0.6 ? 'auto' : 'none',
              }}
              onClick={handleTriggerCarousel}
              className="absolute inset-0 z-30 flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 text-center select-text cursor-pointer"
            >
              <div className="max-w-4xl mx-auto flex flex-col items-center">
                {/* Heading with Reveal Animation */}
                <h2
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-[#f1eee7] font-normal tracking-[0.06em] sm:tracking-[0.1em] leading-tight sm:leading-snug drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] mb-6 sm:mb-8"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    animation: 'statement-text-reveal 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                >
                  Sculpture — Where Art Becomes a{' '}
                  <span className="text-gold-shimmer font-medium tracking-[0.08em] drop-shadow-[0_0_30px_rgba(184,154,98,0.65)]">
                    Statement
                  </span>
                </h2>

                {/* Accent Line */}
                <div
                  className="w-20 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mb-6 sm:mb-8"
                  style={{
                    animation: 'statement-text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards',
                  }}
                />

                {/* Body Paragraph in Ivory White */}
                <p
                  className="text-base sm:text-lg md:text-xl font-light leading-relaxed sm:leading-loose tracking-wide text-[#FFFFF0] max-w-3xl drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)] text-center"
                  style={{
                    color: '#FFFFF0',
                    animation: 'statement-para-reveal 1.15s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards',
                  }}
                >
                  A sculpture is more than an object, it is a reflection of art, craftsmanship, and
                  individuality. From timeless classical and figurative forms to contemporary, abstract,
                  and geometric creations, every sculpture has the power to transform a space. We see
                  sculpture as a true expression of luxury. Where exceptional design, premium
                  materials, meticulous craftsmanship, and originality come together to create a
                  statement that is not only seen, but remembered.
                </p>

                {/* Scroll Down Cue */}
                <div className="mt-8 sm:mt-10 flex flex-col items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity">
                  <span className="text-[10px] sm:text-xs tracking-[0.24em] uppercase text-[#b89a62]">
                    Scroll or Click to Enter Carousel
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#b89a62] animate-bounce" />
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </section>
  );
}
