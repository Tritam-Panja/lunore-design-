import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, ArrowRight, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { images } from '@/lib/images';

export function MarbleExperience() {
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  // Single unified render state to eliminate multiple React re-render thrashing
  const [animState, setAnimState] = useState({
    progress: 0,
    tiltX: 0,
    tiltY: 0,
    tiltZ: 0,
    posX: 0,
    posY: 0,
    flip: 0,
  });

  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number>(0);

  // Physics refs for smooth 60fps spring lerping
  const targetTiltRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const currentTiltRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  const targetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const targetFlipRef = useRef<number>(0);
  const currentFlipRef = useRef<number>(0);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Single 60fps RAF physics loop
  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      // 1. Tilt
      currentTiltRef.current.x += (targetTiltRef.current.x - currentTiltRef.current.x) * 0.12;
      currentTiltRef.current.y += (targetTiltRef.current.y - currentTiltRef.current.y) * 0.12;
      currentTiltRef.current.z += (targetTiltRef.current.z - currentTiltRef.current.z) * 0.12;

      // 2. Pos
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.085;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.085;

      // 3. Flip
      currentFlipRef.current += (targetFlipRef.current - currentFlipRef.current) * 0.14;

      // 4. Progress (weighted cinematic momentum interpolation)
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.075;

      // Batch all values into one atomic frame state update
      setAnimState({
        progress: currentProgressRef.current,
        tiltX: currentTiltRef.current.x,
        tiltY: currentTiltRef.current.y,
        tiltZ: currentTiltRef.current.z,
        posX: currentPosRef.current.x,
        posY: currentPosRef.current.y,
        flip: currentFlipRef.current,
      });

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Screen-wide hover reaction
  const updatePointerPosition = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (clientY < rect.top - 200 || clientY > rect.bottom + 200) return;

    const normX = (clientX - rect.left) / rect.width - 0.5;
    const normY = (clientY - rect.top) / rect.height - 0.5;

    const maxMoveX = Math.min(rect.width * 0.36, 420);
    const maxMoveY = Math.min(rect.height * 0.30, 240);

    targetPosRef.current = {
      x: normX * maxMoveX * 2,
      y: normY * maxMoveY * 2,
    };

    targetTiltRef.current = {
      x: -normY * 28,
      y: normX * 34,
      z: normX * 6,
    };
  }, []);

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      updatePointerPosition(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, [updatePointerPosition]);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const overscrollDeltaRef = useRef<number>(0);

  const handleNextSection = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    // Find next section in DOM
    const nextSec = el.nextElementSibling || el.parentElement?.nextElementSibling;
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    updatePointerPosition(touch.clientX, touch.clientY);

    if (isEntered) {
      const deltaY = touchStartYRef.current - touch.clientY;
      touchStartYRef.current = touch.clientY;
      if (deltaY > 0) {
        if (targetProgressRef.current < 1) {
          targetProgressRef.current = Math.min(1, targetProgressRef.current + deltaY * 0.0028);
        } else {
          overscrollDeltaRef.current += Math.abs(deltaY);
          if (overscrollDeltaRef.current > 300) {
            handleNextSection();
          }
        }
      } else if (deltaY < 0 && targetProgressRef.current > 0) {
        overscrollDeltaRef.current = 0;
        targetProgressRef.current = Math.max(0, targetProgressRef.current + deltaY * 0.0028);
      }
    }
  };

  // Wheel scroll handler (Locks page scroll so user stays in the experience)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!isEntered) return;

      // Always prevent native page jump while inside the interactive experience
      e.preventDefault();
      e.stopPropagation();

      // Scrolling down (forward zoom-out)
      if (e.deltaY > 0) {
        if (targetProgressRef.current < 1) {
          targetProgressRef.current = Math.min(1, targetProgressRef.current + Math.min(e.deltaY * 0.0015, 0.09));
        } else {
          // Intentional overscroll buffer before moving to next page
          overscrollDeltaRef.current += Math.abs(e.deltaY);
          if (overscrollDeltaRef.current > 750) {
            handleNextSection();
          }
        }
      }
      // Scrolling up (backward zoom-in / replay animation)
      else if (e.deltaY < 0) {
        overscrollDeltaRef.current = 0;
        if (targetProgressRef.current > 0) {
          targetProgressRef.current = Math.max(0, targetProgressRef.current + Math.max(e.deltaY * 0.0015, -0.09));
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isEntered, handleNextSection]);

  // Click card to flip
  const handleCardClick = () => {
    if (animState.progress < 0.15) {
      targetFlipRef.current = Math.round(targetFlipRef.current / 180) * 180 + 180;
    }
  };

  const handleEnterClick = () => {
    setIsEntered(true);
    targetProgressRef.current = 0;
    currentProgressRef.current = 0;
    overscrollDeltaRef.current = 0;
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetClick = () => {
    setIsEntered(false);
    targetTiltRef.current = { x: 0, y: 0, z: 0 };
    targetPosRef.current = { x: 0, y: 0 };
    targetFlipRef.current = 0;
    currentFlipRef.current = 0;
    targetProgressRef.current = 0;
    currentProgressRef.current = 0;
  };

  // =========================================================================
  // MULTI-STAGE CINEMATIC INTERPOLATION: DOCKING & QUINTIC PINCH-OUT
  // =========================================================================
  const p = Math.max(0, Math.min(1, animState.progress));

  // Split progress: Stage 1 (0 -> 0.44: Card to Wall) | Stage 2 (0.44 -> 1.0: Majestic Pinch-Out)
  const pStage1 = Math.min(1, p / 0.44);
  const easedP1 = pStage1 * pStage1 * (3 - 2 * pStage1); // Smoothstep curve

  const pStage2 = Math.max(0, (p - 0.44) / 0.56);
  // Quintic Smoothstep (Zero 1st & 2nd derivative jerk: 6t^5 - 15t^4 + 10t^3)
  const easedP2 = pStage2 * pStage2 * pStage2 * (pStage2 * (pStage2 * 6 - 15) + 10);

  // Constant-energy trigonometric crossfading for seamless camera exposure
  const zoomCrossfadeWeight = Math.cos(easedP2 * Math.PI * 0.5);
  const heroCrossfadeWeight = Math.sin(easedP2 * Math.PI * 0.5);

  // 1. Zoomed Balcony Layer: Smoothly pinches down from 1.00x to 0.42x
  const zoomedBgOpacity = isEntered ? Math.min(1, easedP1 * 1.5) * (zoomCrossfadeWeight * zoomCrossfadeWeight) : 0;
  const zoomedBgScale = 1.0 - easedP1 * 0.02 - easedP2 * 0.56;
  const zoomedBgBlur = Math.max(0, (1 - easedP1 * 1.4) * 3);

  // 2. Wide Hero Architecture Layer: Matched pullback from 2.45x down to 1.00x (Optical Match-Zoom from Balcony Anchor)
  const heroBgOpacity = heroCrossfadeWeight * heroCrossfadeWeight;
  const heroBgScale = 2.45 - easedP2 * 1.45;
  const heroBgBlur = Math.max(0, (1 - easedP2 * 2.0) * 2.5);

  // Responsive Base Card Dimensions
  const isMobile = windowSize.width < 640;
  const isTablet = windowSize.width >= 640 && windowSize.width < 1024;

  const baseCardWidth = isMobile ? 290 : isTablet ? 340 : 390;
  const baseCardHeight = isMobile ? 370 : isTablet ? 440 : 490;

  // =========================================================================
  // CAMERA & BACKGROUND IMAGE OPTICS (1600x755 Source Image Aspect 2.1192)
  // Exact Pixel Alignment to Center Balcony Balustrade Wall
  // =========================================================================
  const imgAspect = 1600 / 755;
  const viewportAspect = windowSize.width / Math.max(1, windowSize.height);

  let renderedBgWidth: number;
  let renderedBgHeight: number;

  if (viewportAspect < imgAspect) {
    renderedBgHeight = windowSize.height;
    renderedBgWidth = windowSize.height * imgAspect;
  } else {
    renderedBgWidth = windowSize.width;
    renderedBgHeight = windowSize.width / imgAspect;
  }

  const dockedWidth = renderedBgWidth * 0.300;
  const dockedHeight = renderedBgHeight * 0.151;
  const dockedTargetY = renderedBgHeight * 0.0232;

  // GPU Scale Factors: Smoothly transforms shape without reflow
  const targetScaleX = dockedWidth / baseCardWidth;
  const targetScaleY = dockedHeight / baseCardHeight;

  const currentScaleX = 1.0 + (targetScaleX - 1.0) * easedP1;
  const currentScaleY = 1.0 + (targetScaleY - 1.0) * easedP1;

  // In Stage 2, card scales in sync with the pinch-out zoom
  const stage2PinchScale = 1.0 - easedP2 * 0.56;
  const finalScaleX = currentScaleX * stage2PinchScale;
  const finalScaleY = currentScaleY * stage2PinchScale;

  // Translation & Tilt
  const activeInfluence = Math.max(0, 1 - easedP1);
  const transX = animState.posX * activeInfluence;
  const transY = animState.posY * activeInfluence + (easedP1 * dockedTargetY) * stage2PinchScale;
  const rotX = animState.tiltX * activeInfluence;
  const rotY = animState.tiltY * activeInfluence + animState.flip * activeInfluence;
  const rotZ = animState.tiltZ * activeInfluence;

  // Bezel & Frame Dissolution (Smoothly fades out glass styling)
  const bezelPadding = Math.max(0, 14 * (1 - easedP1 * 1.8));
  const outerRadius = Math.max(0, 24 * (1 - easedP1 * 1.6));
  const innerRadius = Math.max(0, 16 * (1 - easedP1 * 1.6));
  const bezelGlassOpacity = Math.max(0, 1 - easedP1 * 1.6);

  // =========================================================================
  // ARCHITECTURAL ENERGY-LOCK & GOLDEN LIGHT-SWEEP PULSE
  // =========================================================================
  // Glint & laser pulse when the stone locks into position (peaks at pStage1 = 0.85 -> 1.0)
  const lockProgress = Math.min(1, Math.max(0, (easedP1 - 0.70) / 0.30));
  const lockFlash = Math.sin(lockProgress * Math.PI); // Smooth bell-curve flash

  // Card opacity: cleanly dissolves with the golden light sweep before Stage 2
  // Eliminates muddy sticker overlaps completely
  const cardDissolveOpacity = easedP1 > 0.88
    ? Math.max(0, 1 - (easedP1 - 0.88) / 0.12)
    : 1;

  // Specular light-sweep position across the stone face (-100% -> 200%)
  const lightSweepPos = -100 + lockProgress * 300;

  const stoneBrightness = 1.0 + lockFlash * 0.15;
  const stoneContrast = 1.04;
  const stoneSaturate = 1.0 + lockFlash * 0.2;

  // Milestone flag
  const isFullyRevealed = p >= 0.88;

  return (
    <section
      ref={containerRef}
      id="marble-experience"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="relative w-full h-[100dvh] min-h-[680px] bg-[#08090a] overflow-hidden select-none flex items-center justify-center"
    >
      {/* 1. INITIAL BLANK VOID CANVAS */}
      <div className="absolute inset-0 bg-[#08090a] pointer-events-none z-0">
        <div
          style={{
            transform: `translate3d(${animState.posX * 0.35}px, ${animState.posY * 0.35}px, 0)`,
            opacity: Math.max(0, 1 - easedP1 * 1.2),
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-[#b89a62]/[0.05] rounded-full blur-[180px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      </div>

      {/* ========================================================================= */}
      {/* 2. STAGE 1: ARRIVING ZOOMED BALCONY IMAGE (Close-up Facade)               */}
      {/* ========================================================================= */}
      <div
        style={{
          opacity: zoomedBgOpacity,
          transform: `scale(${zoomedBgScale})`,
          transformOrigin: '50% 50%',
          filter: `blur(${zoomedBgBlur}px)`,
        }}
        className="absolute inset-0 z-10 overflow-hidden pointer-events-none will-change-transform"
      >
        <img
          src={images.marbleZoomed}
          alt="Lunore Balcony Marble Facade Zoomed"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center brightness-100 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* ========================================================================= */}
      {/* 3. STAGE 2: FULL MONUMENTAL BUILDING (Cinematic Match-Zoom Pinch-Out)    */}
      {/* ========================================================================= */}
      <div
        style={{
          opacity: heroBgOpacity,
          transform: `scale(${heroBgScale})`,
          transformOrigin: '50% 38%', // Anchors zoom right onto the center balcony for seamless pullback
          filter: `blur(${heroBgBlur}px)`,
        }}
        className="absolute inset-0 z-15 overflow-hidden pointer-events-none will-change-transform"
      >
        <img
          src={images.marbleHero}
          alt="Lunore Monumental Marble Building Architecture"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center brightness-[1.02] contrast-[1.03]"
        />
        <div
          style={{ opacity: Math.max(0.3, 1 - easedP2 * 0.4) }}
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.65)_100%)]" />

        {/* Revealing Architecture Milestone Text with Cinematic Entrance */}
        {isFullyRevealed && (
          <div className="absolute bottom-10 inset-x-0 z-30 flex flex-col items-center text-center pointer-events-none animate-fade-in px-4">
            <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#b89a62] font-semibold mb-2 drop-shadow-md">
              Architectural Façade
            </span>
            <h3
              className="text-xl sm:text-2xl md:text-3xl text-[#f1eee7] font-light tracking-wider drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] max-w-2xl"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Monumental Travertine & Marble Living
            </h3>
            <div className="mt-3 w-12 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent" />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MARBLE CUTOUT: 60FPS GPU TRANSFORMED DOCKING PANEL                     */}
      {/* ========================================================================= */}
      {cardDissolveOpacity > 0.005 && (
        <div
          className="relative z-30 flex flex-col items-center justify-center pointer-events-none"
        >
          {/* GPU-accelerated 3D Transform Wrapper */}
          <div
            ref={cardRef}
            onClick={handleCardClick}
            style={{
              width: `${baseCardWidth}px`,
              height: `${baseCardHeight}px`,
              perspective: '1400px',
              transform: `perspective(1400px) translate3d(${transX}px, ${transY}px, 0px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${finalScaleX}, ${finalScaleY})`,
              transformStyle: 'preserve-3d',
              opacity: cardDissolveOpacity,
              pointerEvents: isFullyRevealed ? 'none' : 'auto',
              willChange: 'transform, opacity',
            }}
            className="relative cursor-pointer group select-none flex items-center justify-center"
          >
            {/* ========================================================================= */}
            {/* CARD FRONT: Glass Bezel & Stone Texture with Golden Shimmer Light-Sweep   */}
            {/* ========================================================================= */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRadius: `${outerRadius}px`,
                padding: `${bezelPadding}px`,
                backgroundColor: `rgba(255, 255, 255, ${0.08 * bezelGlassOpacity})`,
                border: bezelGlassOpacity > 0.05 ? `1px solid rgba(255, 255, 255, ${0.35 * bezelGlassOpacity})` : 'none',
                boxShadow: bezelGlassOpacity > 0.05
                  ? `0 30px 90px rgba(0,0,0,${0.9 * bezelGlassOpacity}), 0 0 45px rgba(184,154,98,${0.25 * bezelGlassOpacity}), inset 0 1.5px 2px rgba(255,255,255,${0.6 * bezelGlassOpacity})`
                  : 'none',
            }}
            className={`absolute inset-0 overflow-hidden flex flex-col items-center justify-center ${bezelGlassOpacity > 0.05 ? 'backdrop-blur-2xl' : ''}`}
          >
            {/* Specular White Top Edge Glow */}
            {bezelGlassOpacity > 0.05 && (
              <div
                style={{ opacity: bezelGlassOpacity }}
                className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-10 pointer-events-none"
              />
            )}

            {/* Inner Frame with 100% Solid Edge-to-Edge Image */}
            <div
              style={{
                borderRadius: `${innerRadius}px`,
                border: bezelGlassOpacity > 0.05 ? `1px solid rgba(255, 255, 255, ${0.25 * bezelGlassOpacity})` : 'none',
              }}
              className="relative w-full h-full overflow-hidden flex items-center justify-center"
            >
              {/* Marble Texture */}
              <img
                src={images.marbleCutout}
                alt="Lunore Architectural Marble Cutout"
                style={{
                  filter: `brightness(${stoneBrightness}) contrast(${stoneContrast}) saturate(${stoneSaturate})`,
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 pointer-events-none"
              />

              {/* Glass Specular Lighting Layer */}
              {bezelGlassOpacity > 0.05 && (
                <div
                  style={{ opacity: bezelGlassOpacity }}
                  className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.08] pointer-events-none"
                />
              )}

              {/* GOLDEN SPECULAR LIGHT SWEEP (Flashes across face during docking lock) */}
              {lockFlash > 0.01 && (
                <div
                  style={{
                    transform: `translateX(${lightSweepPos}%)`,
                    opacity: lockFlash * 0.9,
                  }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/80 via-[#f3e5ab]/90 to-transparent skew-x-[-20deg] pointer-events-none"
                />
              )}

              {/* GOLDEN ARCHITECTURAL DOCKING LASER PERIMETER */}
              {lockFlash > 0.02 && (
                <div
                  style={{
                    opacity: lockFlash,
                    borderColor: '#b89a62',
                    boxShadow: `inset 0 0 30px rgba(184,154,98,${0.95 * lockFlash}), 0 0 35px rgba(243,229,171,${0.85 * lockFlash})`,
                  }}
                  className="absolute inset-0 border-2 pointer-events-none"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )}

      {/* ========================================================================= */}
      {/* 5. "ENTER" BUTTON & INTERACTIVE SCROLL PROMPTS                            */}
      {/* ========================================================================= */}
      <div className="absolute inset-x-0 bottom-8 z-35 flex flex-col items-center pointer-events-none">
        {!isEntered && (
          <div className="pointer-events-auto">
            <button
              onClick={handleEnterClick}
              className="group relative cursor-pointer inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.14] border border-white/40 hover:border-[#b89a62] text-[#f1eee7] shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(184,154,98,0.45),inset_0_1.5px_3px_rgba(255,255,255,0.6)] transition-all duration-400 transform hover:scale-[1.05] active:scale-[0.98] backdrop-blur-md"
            >
              <span className="absolute inset-x-5 top-0 h-[1.2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              <span className="absolute inset-0 rounded-full border border-[#b89a62]/30 animate-ping opacity-20 pointer-events-none" />

              <div className="w-6 h-6 rounded-full bg-white/[0.08] border border-white/30 group-hover:border-[#b89a62]/80 flex items-center justify-center text-[#b89a62] group-hover:rotate-45 transition-transform duration-500 shadow-[0_0_12px_rgba(184,154,98,0.3)]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              <span className="text-xs sm:text-sm tracking-[0.32em] uppercase font-semibold text-[#f1eee7] group-hover:text-[#b89a62] transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Enter
              </span>

              <ArrowRight className="w-3.5 h-3.5 text-[#b89a62] transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {isEntered && (
          <div className="flex flex-col items-center gap-1.5 opacity-85 transition-opacity duration-300">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#b89a62] font-medium drop-shadow-md">
              {p < 0.44
                ? 'Scroll down to dock monolith into facade'
                : p < 0.88
                ? 'Scroll to reveal full architecture • Scroll up to reverse'
                : 'Scroll up to replay animation • Scroll down to continue'}
            </span>
            {p < 0.88 ? (
              <ChevronDown className="w-4 h-4 text-[#b89a62] animate-bounce" />
            ) : (
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#b89a62]/60 to-transparent" />
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. TOP RESET CONTROLS (Active after Enter)                                */}
      {/* ========================================================================= */}
      {isEntered && (
        <div className="absolute top-6 right-6 z-40">
          <button
            onClick={handleResetClick}
            className="cursor-pointer liquid-glass-pill hover:border-[#b89a62]/70 hover:text-[#b89a62] px-4 py-2 rounded-full inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#f1eee7] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.7)] group backdrop-blur-md"
            title="Reset Marble Experience"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#b89a62] group-hover:-rotate-90 transition-transform duration-400" />
            <span>Reset</span>
          </button>
        </div>
      )}
    </section>
  );
}
