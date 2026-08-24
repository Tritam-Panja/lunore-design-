import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { images } from '@/lib/images';

interface SculptureItem {
  id: string;
  title: string;
  category: string;
  material: string;
  dimensions: string;
  year: string;
  edition: string;
  image: string;
}

const SCULPTURE_CAROUSEL_ITEMS: SculptureItem[] = [
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
  const [experienceState, setExperienceState] = useState<'entrance' | 'interactive'>('entrance');
  
  // Continuous scroll progress for the pinch-in animation (0.0 = fullscreen, 1.0 = portrait docked carousel)
  const [pinchProgress, setPinchProgress] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [viewport, setViewport] = useState({ w: 1440, h: 900 });

  const targetPinchRef = useRef<number>(0);
  const currentPinchRef = useRef<number>(0);

  const targetRotationRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; pinch: number; rot: number } | null>(null);

  const total = SCULPTURE_CAROUSEL_ITEMS.length;
  const activeIndex = ((Math.round(rotation) % total) + total) % total;

  // Track viewport dimensions for seamless morph interpolation
  useEffect(() => {
    const updateSize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Step 1: Click "ENTER" -> Switch to interactive scrollable mode
  const handleEnterExperience = useCallback(() => {
    if (experienceState !== 'entrance') return;
    setExperienceState('interactive');
    targetPinchRef.current = 0;
    currentPinchRef.current = 0;
    setPinchProgress(0);
  }, [experienceState]);

  // Reset back to initial entrance screen
  const handleResetExperience = useCallback(() => {
    setExperienceState('entrance');
    targetPinchRef.current = 0;
    currentPinchRef.current = 0;
    setPinchProgress(0);
    targetRotationRef.current = 0;
    currentRotationRef.current = 0;
    setRotation(0);
  }, []);

  // Continuous 60fps physics interpolation
  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      // 1. Lerp pinch progress (buttery smooth deceleration)
      const pinchDiff = targetPinchRef.current - currentPinchRef.current;
      if (Math.abs(pinchDiff) > 0.0004) {
        currentPinchRef.current += pinchDiff * 0.12;
        setPinchProgress(currentPinchRef.current);
      }

      // 2. Lerp carousel rotation
      const rotDiff = targetRotationRef.current - currentRotationRef.current;
      if (Math.abs(rotDiff) > 0.0004) {
        currentRotationRef.current += rotDiff * 0.16;
        setRotation(currentRotationRef.current);
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePrev = useCallback(() => {
    targetRotationRef.current = Math.round(targetRotationRef.current) - 1;
  }, []);

  const handleNext = useCallback(() => {
    targetRotationRef.current = Math.round(targetRotationRef.current) + 1;
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (experienceState !== 'interactive') return;

      if (currentPinchRef.current < 0.95) {
        if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          targetPinchRef.current = Math.min(1, targetPinchRef.current + 0.35);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          targetPinchRef.current = Math.max(0, targetPinchRef.current - 0.35);
        }
      } else {
        if (e.key === 'ArrowLeft') {
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        } else if (e.key === 'Escape') {
          handleResetExperience();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [experienceState, handlePrev, handleNext, handleResetExperience]);

  // Scroll Wheel Handler:
  // - When pinchProgress < 0.96: Mouse scroll directly drives the pinch & portrait morph progress
  // - When pinchProgress >= 0.96: Mouse scroll rotates the 3D portrait carousel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (experienceState !== 'entrance') {
        e.preventDefault();
      }
      if (experienceState !== 'interactive') return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      if (currentPinchRef.current < 0.95) {
        // Continuous scroll-driven pinch-in & morph into portrait
        const step = delta * 0.0018;
        targetPinchRef.current = Math.max(0, Math.min(1, targetPinchRef.current + step));
      } else {
        // Carousel rotation mode
        if (delta < 0 && Math.abs(currentRotationRef.current) < 0.05 && targetRotationRef.current === 0) {
          // Scroll back out to story when at initial card
          targetPinchRef.current = Math.max(0, targetPinchRef.current + delta * 0.0018);
        } else {
          targetRotationRef.current += delta * 0.0038;

          if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
          snapTimerRef.current = setTimeout(() => {
            targetRotationRef.current = Math.round(targetRotationRef.current);
          }, 160);
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [experienceState]);

  // Touch Swipe & Drag Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (experienceState !== 'interactive') return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      pinch: targetPinchRef.current,
      rot: targetRotationRef.current,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || experienceState !== 'interactive') return;
    const clientY = e.touches[0].clientY;
    const clientX = e.touches[0].clientX;
    const diffY = touchStartRef.current.y - clientY;
    const diffX = touchStartRef.current.x - clientX;

    if (currentPinchRef.current < 0.95) {
      targetPinchRef.current = Math.max(0, Math.min(1, touchStartRef.current.pinch + diffY * 0.003));
    } else {
      targetRotationRef.current = touchStartRef.current.rot + diffX * 0.0045;
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    touchStartRef.current = null;
    if (currentPinchRef.current >= 0.95) {
      targetRotationRef.current = Math.round(targetRotationRef.current);
    }
  };

  const isEntrance = experienceState === 'entrance';
  const isFullyDocked = pinchProgress >= 0.95;

  // Visual interpolations based on pinchProgress (0.0 -> 1.0)
  const p = Math.max(0, Math.min(1, pinchProgress));

  // 1. Text overlay opacity & translate: fades out early (from 0 to 0.35)
  const textOpacity = Math.max(0, 1 - p * 2.8);
  const textTranslateY = -p * 90;
  const textScale = 1 - p * 0.04;

  // 2. Portrait Card Dimensions (Target sizes for 3D Carousel)
  const isMobile = viewport.w < 640;
  const isTablet = viewport.w >= 640 && viewport.w < 1024;
  const targetCardW = isMobile ? 260 : isTablet ? 300 : 350;
  const targetCardH = isMobile ? 390 : isTablet ? 450 : 520;

  // Continuous morph: smoothly interpolates width and height from fullscreen (100vw x 100vh) down to portrait card (350px x 520px)
  const currentCardW = viewport.w + (targetCardW - viewport.w) * p;
  const currentCardH = viewport.h + (targetCardH - viewport.h) * p;
  const heroBorderRadius = p * 16;
  const heroPadding = p * 14;
  const heroGlassOpacity = Math.max(0, (p - 0.15) / 0.85);

  // 3. Sibling 3D Portrait Fan-Out progress: starts fanning out from p = 0.25 to 1.0
  const fanP = Math.max(0, (p - 0.25) / 0.75);

  // 4. UI Controls opacity: revealed when almost docked
  const controlsOpacity = Math.max(0, (p - 0.82) / 0.18);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative w-full h-screen min-h-[100vh] bg-[#050607] overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC VOID BACKGROUND                                            */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-[#070809] flex items-center justify-center pointer-events-none">
        <div className="absolute w-[900px] h-[900px] rounded-full bg-gradient-to-b from-[#b89a62]/10 via-transparent to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60" />
      </div>

      {/* ========================================================================= */}
      {/* 2. STEP 1: INITIAL ENTRANCE SCREEN ("EXPERIENCE THE SCULPTURES" & "ENTER") */}
      {/* ========================================================================= */}
      {isEntrance && (
        <>
          {/* Fullscreen hero image for entrance */}
          <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            <img
              src={images.sculptureHero}
              alt="LUNORE Signature Sculptures Gallery"
              className="w-full h-full object-cover object-center brightness-100 contrast-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40 pointer-events-none" />
          </div>

          <div className="absolute inset-0 z-30 flex flex-col justify-between items-center p-6 sm:p-10 md:p-14 text-center select-none">
            {/* Top Arch Headline */}
            <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 pt-6 sm:pt-10 md:pt-12 z-20">
              <h2
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#f1eee7] font-normal tracking-[0.18em] sm:tracking-[0.24em] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] whitespace-nowrap"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Experience The{' '}
                <span className="text-gold-shimmer font-normal uppercase tracking-[0.18em] sm:tracking-[0.24em] drop-shadow-[0_0_25px_rgba(184,154,98,0.55)]">
                  sculptures
                </span>
              </h2>
            </div>

            {/* Downward Positioned Transparent Liquid Glass "ENTER" Button */}
            <div className="w-full flex justify-center mt-auto pb-4 sm:pb-7">
              <button
                onClick={handleEnterExperience}
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
      {/* 3. INTERACTIVE PINCH & PORTRAIT MORPH 3D CYLINDRICAL CAROUSEL             */}
      {/* ========================================================================= */}
      {!isEntrance && (
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 z-20 select-none overflow-hidden">
          
          {/* Top Bar Controls (Revealed when docked) */}
          <div
            style={{
              opacity: controlsOpacity,
              transform: `translateY(${(1 - controlsOpacity) * -16}px)`,
              pointerEvents: isFullyDocked ? 'auto' : 'none',
            }}
            className="flex items-center justify-between w-full relative z-40 max-w-7xl mx-auto transition-all duration-300"
          >
            <div className="w-24 sm:w-32" />

            {/* Sculpture Index Counter */}
            <div className="liquid-glass-pill px-4 py-1.5 rounded-full text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#f1eee7]/90">
              <span className="text-[#b89a62] font-semibold">{SCULPTURE_CAROUSEL_ITEMS[activeIndex].id}</span>
              <span className="text-[#85817a] mx-1.5">/</span>
              <span>0{SCULPTURE_CAROUSEL_ITEMS.length}</span>
            </div>

            {/* Reset / Replay Experience Button */}
            <button
              onClick={handleResetExperience}
              className="cursor-pointer liquid-glass-pill hover:border-[#b89a62]/70 hover:text-[#b89a62] px-3.5 sm:px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#f1eee7] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
              title="Reset to Fullscreen Gallery view"
              aria-label="Reset experience"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#b89a62] group-hover:-rotate-90 transition-transform duration-400" />
              <span className="hidden sm:inline">Reset Experience</span>
            </button>
          </div>

          {/* 3D CAROUSEL STAGE & MORPH CANVAS */}
          <div
            data-lenis-prevent="true"
            className="relative w-full flex-1 flex items-center justify-center my-1 sm:my-2 overflow-visible [perspective:1400px]"
          >
            <div className="relative w-full h-full max-h-[480px] sm:max-h-[540px] md:max-h-[600px] flex items-center justify-center [transform-style:preserve-3d]">
              
              {/* PORTRAIT CAROUSEL CARDS */}
              {SCULPTURE_CAROUSEL_ITEMS.map((item, index) => {
                const isHeroCard = index === 0;
                const totalCount = SCULPTURE_CAROUSEL_ITEMS.length;
                let diff = (index - (rotation % totalCount)) % totalCount;
                if (diff > totalCount / 2) diff -= totalCount;
                if (diff < -totalCount / 2) diff += totalCount;

                const isCenter = Math.abs(diff) < 0.45;
                const isVisible = Math.abs(diff) <= 3.2;

                // 3D Portrait Cylindrical Geometry
                const radius = 820;
                const angleDeg = diff * 23;
                const angleRad = (angleDeg * Math.PI) / 180;

                const targetTranslateX = radius * Math.sin(angleRad);
                const targetTranslateZ = radius * (Math.cos(angleRad) - 1) + 45;
                const targetRotateY = angleDeg * 0.95;
                const baseScale = Math.max(0.78, 1 - Math.abs(diff) * 0.05);
                const targetOpacity = isVisible ? Math.max(0.15, 1 - Math.pow(Math.abs(diff) / 3.2, 1.8)) : 0;
                const zIndex = Math.round(30 - Math.abs(diff) * 8);

                // Continuous Scroll-Driven Interpolation:
                if (isHeroCard) {
                  // Center Hero Card:
                  // Smooth continuous pinch & morph from Fullscreen -> Portrait Card Frame
                  const heroTranslateX = targetTranslateX * p;
                  const heroTranslateZ = targetTranslateZ * p;
                  const heroRotateY = targetRotateY * p;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (isFullyDocked && Math.abs(diff) > 0.3) {
                          targetRotationRef.current = Math.round(targetRotationRef.current + diff);
                        }
                      }}
                      style={{
                        width: `${currentCardW}px`,
                        height: `${currentCardH}px`,
                        transform: `translateX(${heroTranslateX}px) translateZ(${heroTranslateZ}px) rotateY(${heroRotateY}deg)`,
                        zIndex: 45,
                        pointerEvents: isFullyDocked ? 'auto' : 'none',
                        willChange: 'width, height, transform',
                      }}
                      className="absolute cursor-pointer select-none transition-shadow duration-300"
                    >
                      {/* LIQUID GLASS PANEL (Border, glass gradients & radius smoothly interpolate with scroll) */}
                      <div
                        style={{
                          borderRadius: `${heroBorderRadius}px`,
                          padding: `${heroPadding}px`,
                          backgroundColor: `rgba(255, 255, 255, ${0.08 * heroGlassOpacity})`,
                          borderColor: `rgba(255, 255, 255, ${0.5 * heroGlassOpacity})`,
                          boxShadow: isCenter && isFullyDocked
                            ? '0 30px 75px rgba(0,0,0,0.9), 0 0 40px rgba(184,154,98,0.25), inset 0 1.5px 2px rgba(255,255,255,0.6)'
                            : `0 20px 50px rgba(0,0,0,${0.7 * heroGlassOpacity})`,
                        }}
                        className="relative w-full h-full overflow-hidden backdrop-blur-2xl border flex flex-col items-center justify-center"
                      >
                        {/* Top Specular White Edge Glow */}
                        <div
                          style={{ opacity: heroGlassOpacity }}
                          className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-10"
                        />

                        {/* Inner Frame */}
                        <div
                          style={{
                            borderRadius: `${Math.max(0, heroBorderRadius - 4)}px`,
                          }}
                          className="relative w-full h-full border border-white/25 bg-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              filter: `brightness(${0.72 + 0.26 * p}) contrast(${1.08 - 0.03 * p})`,
                            }}
                            className="w-full h-full object-cover object-center pointer-events-none transition-[filter] duration-700"
                          />

                          {/* Ambient Dark Overlay on ENTER (Smoothly clears as p approaches 1) */}
                          <div
                            style={{ opacity: Math.max(0, (1 - p) * 0.55) }}
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/70 pointer-events-none transition-opacity duration-700"
                          />

                          {/* Gradient Vignettes */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.08] pointer-events-none" />
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

                          {/* Center Ambient Gold Hue for Active Card */}
                          {isCenter && isFullyDocked && (
                            <div className="absolute -bottom-8 inset-x-0 h-24 bg-gradient-to-t from-[#b89a62]/25 to-transparent pointer-events-none" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Sibling Portrait Cards: Fan out continuously in 3D as scroll progresses (fanP from 0 to 1)
                const currentTranslateX = targetTranslateX * fanP;
                const currentTranslateZ = targetTranslateZ * fanP + (1 - fanP) * -260;
                const currentRotateY = targetRotateY * fanP;
                const currentScale = baseScale * (0.65 + fanP * 0.35);
                const currentOpacity = isVisible ? targetOpacity * fanP : 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isFullyDocked && Math.abs(diff) > 0.3) {
                        targetRotationRef.current = Math.round(targetRotationRef.current + diff);
                      }
                    }}
                    style={{
                      width: `${targetCardW}px`,
                      height: `${targetCardH}px`,
                      transform: `translateX(${currentTranslateX}px) translateZ(${currentTranslateZ}px) rotateY(${currentRotateY}deg) scale(${currentScale})`,
                      opacity: currentOpacity,
                      zIndex,
                      pointerEvents: isFullyDocked && isVisible ? 'auto' : 'none',
                      willChange: 'transform, opacity',
                    }}
                    className={`absolute rounded-2xl cursor-pointer select-none transition-shadow duration-300 ${
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

          {/* Bottom Navigation & Controls (Revealed when docked) */}
          <div
            style={{
              opacity: controlsOpacity,
              transform: `translateY(${(1 - controlsOpacity) * 16}px)`,
              pointerEvents: isFullyDocked ? 'auto' : 'none',
            }}
            className="flex items-center justify-between w-full relative z-40 pt-2 max-w-7xl mx-auto transition-all duration-300"
          >
            {/* Left Prev Arrow */}
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

            {/* Centered Pagination Dots */}
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

            {/* Right Next Arrow */}
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
          {/* 4. SCULPTURE STATEMENT NARRATIVE TEXT (With Cinematic Text Animation)     */}
          {/* ========================================================================= */}
          {textOpacity > 0.01 && (
            <div
              style={{
                opacity: textOpacity,
                transform: `translateY(${textTranslateY}px) scale(${textScale})`,
                pointerEvents: textOpacity > 0.6 ? 'auto' : 'none',
              }}
              onClick={() => {
                targetPinchRef.current = Math.min(1, targetPinchRef.current + 0.45);
              }}
              className="absolute inset-0 z-30 flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 text-center select-none cursor-pointer"
            >
              <div className="max-w-3xl mx-auto flex flex-col items-center">
                {/* Heading (Staggered Mask Reveal Animation) */}
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#f1eee7] font-normal tracking-[0.08em] sm:tracking-[0.12em] leading-tight sm:leading-snug drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] mb-6 sm:mb-8"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    animation: 'statement-text-reveal 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                >
                  Sculpture — Where Art Becomes a{' '}
                  <span className="text-gold-shimmer font-medium tracking-[0.1em] drop-shadow-[0_0_25px_rgba(184,154,98,0.6)]">
                    Statement
                  </span>
                </h2>

                {/* Body Paragraph (Smooth Rise & Reveal Animation) */}
                <p
                  className="text-base sm:text-lg md:text-xl font-normal leading-relaxed tracking-wide text-center max-w-3xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
                  style={{
                    color: '#f1eee7',
                    animation: 'statement-para-reveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.22s forwards',
                  }}
                >
                  A sculpture is more than an object, it is a reflection of art, craftsmanship, and individuality. From timeless classical and figurative forms to contemporary, abstract, and geometric creations, every sculpture has the power to transform a space. We see sculpture as a true expression of luxury. Where exceptional design, premium materials, meticulous craftsmanship, and originality come together to create a statement that is not only seen, but remembered.
                </p>
              </div>
            </div>
          )}

        </div>
      )}

    </section>
  );
}
