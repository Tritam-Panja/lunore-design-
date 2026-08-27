import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, ArrowRight, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { images } from '@/lib/images';
import ParticleText from './ParticleText';

export function MarbleExperience() {
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [isZoomUnlocked, setIsZoomUnlocked] = useState<boolean>(false);
  const isZoomUnlockedRef = useRef<boolean>(false);

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
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.10;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.10;

      // 3. Flip
      currentFlipRef.current += (targetFlipRef.current - currentFlipRef.current) * 0.14;

      // 4. Progress (weighted cinematic momentum interpolation)
      const pDiff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(pDiff) < 0.0001) {
        currentProgressRef.current = targetProgressRef.current;
      } else {
        currentProgressRef.current += pDiff * 0.095;
      }

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
        const maxAllowed = isZoomUnlockedRef.current ? 1.0 : 0.44;
        if (targetProgressRef.current < maxAllowed) {
          targetProgressRef.current = Math.min(maxAllowed, targetProgressRef.current + deltaY * 0.0032);
        } else if (isZoomUnlockedRef.current) {
          overscrollDeltaRef.current += Math.abs(deltaY);
          if (overscrollDeltaRef.current > 300) {
            handleNextSection();
          }
        }
      } else if (deltaY < 0 && targetProgressRef.current > 0) {
        overscrollDeltaRef.current = 0;
        targetProgressRef.current = Math.max(0, targetProgressRef.current + deltaY * 0.0032);
        if (targetProgressRef.current < 0.38) {
          setIsZoomUnlocked(false);
          isZoomUnlockedRef.current = false;
        }
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
        const maxAllowed = isZoomUnlockedRef.current ? 1.0 : 0.44;
        if (targetProgressRef.current < maxAllowed) {
          targetProgressRef.current = Math.min(maxAllowed, targetProgressRef.current + Math.min(e.deltaY * 0.0015, 0.09));
        } else if (isZoomUnlockedRef.current) {
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
          if (targetProgressRef.current < 0.38) {
            setIsZoomUnlocked(false);
            isZoomUnlockedRef.current = false;
          }
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
    setIsZoomUnlocked(false);
    isZoomUnlockedRef.current = false;
    targetProgressRef.current = 0;
    currentProgressRef.current = 0;
    overscrollDeltaRef.current = 0;
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUnlockZoom = () => {
    setIsZoomUnlocked(true);
    isZoomUnlockedRef.current = true;
    targetProgressRef.current = 0.68; // Zooms out to full crystal-clear hero image and stops
  };

  const handleResetClick = () => {
    setIsEntered(false);
    setIsZoomUnlocked(false);
    isZoomUnlockedRef.current = false;
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

  // Split progress:
  // Stage 1 (0.00 -> 0.44): Card to Wall Docking
  // Stage 2 (0.44 -> 0.68): Majestic Pinch-Out to Full Crystal-Clear Architecture (Zero text, Zero blur)
  // Stage 3 (0.68 -> 1.00): User scrolls further -> Image blurs & ParticleText reveals
  const pStage1 = Math.min(1, p / 0.44);
  const easedP1 = pStage1 * pStage1 * (3 - 2 * pStage1); // Smoothstep curve

  const pStage2 = Math.min(1, Math.max(0, (p - 0.44) / 0.24));
  // Quintic Smoothstep (Zero 1st & 2nd derivative jerk: 6t^5 - 15t^4 + 10t^3)
  const easedP2 = pStage2 * pStage2 * pStage2 * (pStage2 * (pStage2 * 6 - 15) + 10);

  // Constant-energy trigonometric crossfading for seamless camera exposure
  const zoomCrossfadeWeight = Math.cos(easedP2 * Math.PI * 0.5);
  const heroCrossfadeWeight = Math.sin(easedP2 * Math.PI * 0.5);

  // Narrative Stage (p >= 0.70): ONLY starts when user scrolls further past the clear hero image
  const narrativeProgress = Math.max(0, Math.min(1, (p - 0.70) / 0.30));
  const narrativeEased = narrativeProgress * narrativeProgress * (3 - 2 * narrativeProgress);
  const narrativeBlur = narrativeEased * 6.5;
  const narrativeDarken = narrativeEased * 0.52;

  // 1. Zoomed Balcony Layer: Smoothly pinches down from 1.00x to 0.42x
  const zoomedBgOpacity = isEntered ? Math.min(1, easedP1 * 1.5) * (zoomCrossfadeWeight * zoomCrossfadeWeight) : 0;
  const zoomedBgScale = 1.0 - easedP1 * 0.02 - easedP2 * 0.56;
  const zoomedBgBlur = Math.max(0, (1 - easedP1 * 1.4) * 3);

  // 2. Wide Hero Architecture Layer: Matched pullback from 2.45x down to 1.00x (Optical Match-Zoom from Balcony Anchor)
  const heroBgOpacity = heroCrossfadeWeight * heroCrossfadeWeight;
  const heroBgScale = 2.45 - easedP2 * 1.45;
  const heroBgBlur = Math.max(0, (1 - easedP2 * 2.0) * 2.5);

  // Responsive Base Card Dimensions (Optimized for all mobile aspect ratios)
  const isMobile = windowSize.width < 640;
  const isTablet = windowSize.width >= 640 && windowSize.width < 1024;

  const baseCardWidth = isMobile ? Math.min(265, windowSize.width * 0.72) : isTablet ? 340 : 390;
  const baseCardHeight = isMobile ? Math.min(345, windowSize.height * 0.46) : isTablet ? 440 : 490;

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
      style={{ touchAction: isEntered ? 'none' : 'pan-y' }}
      className="relative w-full h-[100dvh] min-h-[600px] bg-[#08090a] overflow-hidden select-none flex items-center justify-center"
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
        }}
        className="absolute inset-0 z-15 overflow-hidden pointer-events-none will-change-transform"
      >
        <img
          src={images.marbleHero}
          alt="Lunore Monumental Marble Building Architecture"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-center brightness-[1.02] contrast-[1.03]"
        />

        {/* Hardware-accelerated smooth blur transition layer */}
        {narrativeProgress > 0.01 && (
          <div
            style={{
              opacity: narrativeProgress,
              backdropFilter: 'blur(7px)',
              WebkitBackdropFilter: 'blur(7px)',
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}

        <div
          style={{ opacity: Math.max(0.3, (1 - easedP2 * 0.4) + narrativeDarken) }}
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.65)_100%)]" />
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
      {/* 5. INTERMEDIATE DOCKED REVEAL: "All Stop Solution is Here" (NO CARD)     */}
      {/* Positioned right where the slab submerged/docked into the balcony facade */}
      {/* ========================================================================= */}
      {isEntered && p >= 0.38 && !isZoomUnlocked && (
        <div
          style={{
            transform: `translate3d(0, ${dockedTargetY}px, 0)`,
          }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center text-center px-4 pointer-events-auto select-none"
        >
          {/* Pulsing Ambient Golden Light Bloom */}
          <div className="absolute w-[500px] h-[180px] bg-[#b89a62]/20 rounded-full blur-[90px] pointer-events-none -z-10 animate-pulse" />

          {/* Subtitle Badge with Reveal */}
          <span
            style={{
              animation: 'lunore-letter-reveal 0.75s cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0.05s',
            }}
            className="text-[10px] sm:text-xs tracking-[0.38em] uppercase text-[#b89a62] font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] mb-2 inline-block"
          >
            Integrated Living &amp; Craft
          </span>

          {/* Staggered Word Mask Headline */}
          <h3
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#f1eee7] font-normal tracking-wide drop-shadow-[0_4px_30px_rgba(0,0,0,0.98)] max-w-2xl px-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {['All', 'Stop', 'Solution', 'is', 'Here'].map((word, wIdx) => (
              <span key={wIdx} className="inline-block overflow-hidden mr-[0.28em] last:mr-0 align-bottom">
                <span
                  className="inline-block text-[#f1eee7]"
                  style={{
                    animation: 'lunore-letter-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
                    animationDelay: `${0.12 + wIdx * 0.08}s`,
                    textShadow: '0 4px 30px rgba(0,0,0,0.98), 0 0 25px rgba(184,154,98,0.35)',
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h3>

          {/* Animated Gold Divider Line */}
          <div
            style={{
              animation: 'cinematic-line-mask 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0.55s',
            }}
            className="mt-3 w-16 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent"
          />

          {/* Animated Tiny Floating Enter Button */}
          <div
            style={{
              animation: 'lunore-letter-reveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0.65s',
            }}
            className="mt-4"
          >
            <button
              onClick={handleUnlockZoom}
              className="group relative cursor-pointer inline-flex items-center gap-2.5 px-6 sm:px-8 py-2.5 rounded-full bg-black/65 hover:bg-black/90 border border-[#b89a62]/80 hover:border-[#f3e5ab] text-[#f1eee7] hover:text-[#f3e5ab] shadow-[0_12px_32px_rgba(0,0,0,0.85),0_0_25px_rgba(184,154,98,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.3)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.95),0_0_35px_rgba(184,154,98,0.7)] transition-all duration-400 transform hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              <span className="absolute inset-0 rounded-full border border-[#b89a62]/40 animate-ping opacity-25 pointer-events-none" />

              <Sparkles className="w-3.5 h-3.5 text-[#b89a62] group-hover:rotate-45 transition-transform duration-400" />
              <span className="text-[10px] sm:text-xs tracking-[0.28em] uppercase font-semibold">
                Enter
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#b89a62] group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. FINAL NARRATIVE REVEAL: "Marble and Granite Solution" (PARTICLE TEXT)  */}
      {/* Appears as user scrolls into the full zoom-out with soft background blur  */}
      {/* ========================================================================= */}
      {narrativeProgress > 0.05 && (
        <div
          style={{
            opacity: narrativeProgress,
            transform: `translate3d(0, ${(1 - narrativeEased) * 30}px, 0)`,
          }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 pointer-events-auto select-none overflow-hidden"
        >
          {/* Contrast Dark Backdrop & Ambient Glow */}
          <div className="absolute w-[950px] h-[550px] bg-black/60 rounded-full blur-[90px] pointer-events-none -z-10" />
          <div className="absolute w-[800px] h-[400px] bg-[#b89a62]/15 rounded-full blur-[150px] pointer-events-none -z-10" />

          {/* Interactive React Bits ParticleText Headline - Perfectly Aligned Dot Matrix */}
          <div className="w-full max-w-4xl h-[120px] sm:h-[150px] md:h-[180px] flex items-center justify-center">
            <ParticleText
              text="Marble and Granite Solution"
              particleSize={isMobile ? 1.9 : 2.2}
              density={4}
              color="#f8fafc"
              highlightColor="#b89a62"
              scatter={190}
              gatherDuration={1600}
              stagger={420}
              pointerRepel={42}
              repelRadius={120}
              idleDrift={0.8}
              trigger="mount"
              fontSize={isMobile ? "clamp(1.9rem, 6.8vw, 2.8rem)" : "clamp(2.7rem, 5.2vw, 4.2rem)"}
              fontWeight={800}
              fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              glow={true}
              className="w-full h-full"
            />
          </div>

          <div className="my-2.5 sm:my-3.5 w-20 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent" />

          {/* Editorial Paragraph in Luminous Ivory White */}
          <p
            className="text-sm sm:text-base md:text-lg lg:text-[1.12rem] text-[#f8f6f0] font-normal leading-relaxed tracking-wide max-w-3xl px-4 text-center select-text"
            style={{
              color: '#f8f6f0',
              fontFamily: 'var(--font-serif)',
              textShadow: '0 2px 16px rgba(0,0,0,0.95), 0 4px 30px rgba(0,0,0,0.9)',
            }}
          >
            At Lunore, we deal in a wide range of premium marble and granite, offering carefully selected materials for every design requirement. What truly sets us apart, however, is not just the stone we supply, but the service and assurance behind every order. Every piece is thoroughly inspected by our marble experts before delivery to ensure the right quality, finish, size, and consistency—so you receive your marble exactly as it should be, with no compromises, surprises, or mistakes. With Lunore, every stone is checked, trusted, and delivered with confidence.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. INITIAL "ENTER" BUTTON & INTERACTIVE SCROLL PROMPTS                    */}
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

        {isEntered && p < 0.38 && (
          <div className="flex flex-col items-center gap-1.5 opacity-85 transition-opacity duration-300">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#b89a62] font-medium drop-shadow-md">
              Scroll down to dock monolith into facade
            </span>
            <ChevronDown className="w-4 h-4 text-[#b89a62] animate-bounce" />
          </div>
        )}

        {isEntered && isZoomUnlocked && p >= 0.55 && p < 0.72 && (
          <div className="flex flex-col items-center gap-1.5 opacity-85 transition-opacity duration-300">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#b89a62] font-medium drop-shadow-md">
              Scroll down to explore Lunore Stone Collection • Scroll up to reverse
            </span>
            <ChevronDown className="w-4 h-4 text-[#b89a62] animate-bounce" />
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
