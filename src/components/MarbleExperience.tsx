import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, ArrowRight, RotateCcw, ChevronDown } from 'lucide-react';
import { images } from '@/lib/images';

export function MarbleExperience() {
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [tilt, setTilt] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [flipRotation, setFlipRotation] = useState<number>(0);

  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Target values for smooth 60fps spring & inertia interpolation
  const targetTiltRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const currentTiltRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  const targetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const targetFlipRef = useRef<number>(0);
  const currentFlipRef = useRef<number>(0);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  // Continuous 60fps RAF physics loop for 3D floating, tilt, flip, and multi-stage zoom reveal
  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      // 1. Smooth 3D tilt interpolation
      const tiltDiffX = targetTiltRef.current.x - currentTiltRef.current.x;
      const tiltDiffY = targetTiltRef.current.y - currentTiltRef.current.y;
      const tiltDiffZ = targetTiltRef.current.z - currentTiltRef.current.z;

      if (Math.abs(tiltDiffX) > 0.001 || Math.abs(tiltDiffY) > 0.001 || Math.abs(tiltDiffZ) > 0.001) {
        currentTiltRef.current.x += tiltDiffX * 0.12;
        currentTiltRef.current.y += tiltDiffY * 0.12;
        currentTiltRef.current.z += tiltDiffZ * 0.12;
        setTilt({ ...currentTiltRef.current });
      }

      // 2. Smooth wide-range 2D cursor floating translation
      const posDiffX = targetPosRef.current.x - currentPosRef.current.x;
      const posDiffY = targetPosRef.current.y - currentPosRef.current.y;

      if (Math.abs(posDiffX) > 0.01 || Math.abs(posDiffY) > 0.01) {
        currentPosRef.current.x += posDiffX * 0.085;
        currentPosRef.current.y += posDiffY * 0.085;
        setPos({ ...currentPosRef.current });
      }

      // 3. Smooth continuous flip rotation
      const flipDiff = targetFlipRef.current - currentFlipRef.current;
      if (Math.abs(flipDiff) > 0.05) {
        currentFlipRef.current += flipDiff * 0.14;
        setFlipRotation(currentFlipRef.current);
      }

      // 4. Smooth multi-stage progress lerp
      const progressDiff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(progressDiff) > 0.001) {
        currentProgressRef.current += progressDiff * 0.09;
        setProgress(currentProgressRef.current);
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Screen-wide hover reaction: freely moves and floats the card across the section
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

  // Window-level mouse move listener
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      updatePointerPosition(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, [updatePointerPosition]);

  // Touch move support on mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
  };

  // Wheel scroll handler after pressing Enter:
  // - Stage 1 (0 -> 0.5): Submerges into the exact circled balcony facade panel
  // - Stage 2 (0.5 -> 1.0): Cutout vanishes, building zooms out to reveal full architecture
  // - Releases fully once revealed (progress >= 0.96)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!isEntered) return;

      if (currentProgressRef.current < 0.96) {
        if (e.deltaY > 0) {
          e.preventDefault();
          e.stopPropagation();
          targetProgressRef.current = Math.min(1, targetProgressRef.current + Math.min(e.deltaY * 0.003, 0.28));
        } else if (e.deltaY < 0 && targetProgressRef.current > 0.05) {
          e.preventDefault();
          e.stopPropagation();
          targetProgressRef.current = Math.max(0, targetProgressRef.current + e.deltaY * 0.003);
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isEntered]);

  // Click card to smoothly flip 180 degrees
  const handleCardClick = () => {
    if (progress < 0.2) {
      targetFlipRef.current = Math.round(targetFlipRef.current / 180) * 180 + 180;
    }
  };

  // Handle Enter Button Click: locks view in place and begins the journey
  const handleEnterClick = () => {
    setIsEntered(true);
    targetProgressRef.current = 0;
    currentProgressRef.current = 0;
    setProgress(0);
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
    setFlipRotation(0);
    targetProgressRef.current = 0;
    currentProgressRef.current = 0;
    setProgress(0);
  };

  // =========================================================================
  // MULTI-STAGE CINEMATIC INTERPOLATION
  // =========================================================================
  const p = Math.max(0, Math.min(1, progress));
  
  // Split progress into Stage 1 (0 -> 0.5) and Stage 2 (0.5 -> 1.0)
  const pStage1 = Math.min(1, p * 2.0); // 0 -> 1 during first half
  const easedP1 = pStage1 * pStage1 * (3 - 2 * pStage1);

  const pStage2 = Math.max(0, (p - 0.5) * 2.0); // 0 -> 1 during second half
  const easedP2 = pStage2 * pStage2 * (3 - 2 * pStage2);

  // 1. Zoomed Balcony Background (Stage 1)
  const zoomedBgOpacity = isEntered ? Math.min(1, easedP1 * 1.3) * (1 - easedP2 * 0.95) : 0;
  const zoomedBgScale = 1.08 - easedP1 * 0.08 - easedP2 * 0.35; // Zooms out in Stage 2
  const zoomedBgBlur = Math.max(0, (1 - easedP1 * 1.5) * 5);

  // 2. Full Tall Building Hero Background (Revealed in Stage 2 Zoom-Out)
  const heroBgOpacity = Math.min(1, easedP2 * 1.4);
  const heroBgScale = 1.15 - easedP2 * 0.15; // Smooth zoom out to 1.0

  // 3. Marble Cutout Card Submerging into the Circled Balcony Facade Panel
  const activeTiltInfluence = Math.max(0, 1 - easedP1 * 1.8);
  const activePosInfluence = Math.max(0, 1 - easedP1 * 1.8);
  const activeFlipInfluence = Math.max(0, 1 - easedP1 * 1.8);

  // Pinch down and target the exact circled balcony divider panel:
  // Move down (+Y) into the balcony railing panel and scale down to ~0.34
  const submergeScale = 1.0 - easedP1 * 0.66;
  const submergeTargetX = 0;
  const submergeTargetY = easedP1 * 34; // Moves down directly into the circled balcony area

  // Dissolve bezel, glass frame, and crossfade cutout into the real background texture
  const bezelOpacity = Math.max(0, 1 - easedP1 * 1.8);
  const innerRadius = Math.max(0, 16 * (1 - easedP1 * 1.5));
  
  // Cutout opacity: crossfades smoothly into the background at the end of Stage 1, and 0 in Stage 2
  const cutoutOpacity = pStage2 > 0.02
    ? 0
    : pStage1 > 0.80
    ? Math.max(0, 1 - (pStage1 - 0.80) / 0.20)
    : 1;

  const glintOpacity = Math.sin(Math.min(1, easedP1 * 1.15) * Math.PI) * 0.9 * (1 - pStage2);

  // Final docked state
  const isFullyRevealed = p >= 0.90;

  return (
    <section
      ref={containerRef}
      id="marble-experience"
      onTouchMove={handleTouchMove}
      className="relative w-full h-[100dvh] min-h-[680px] bg-[#08090a] overflow-hidden select-none flex items-center justify-center"
    >
      {/* 1. INITIAL BLANK VOID CANVAS */}
      <div className="absolute inset-0 bg-[#08090a] pointer-events-none z-0">
        <div
          style={{
            transform: `translate3d(${pos.x * 0.35}px, ${pos.y * 0.35}px, 0)`,
            opacity: Math.max(0, 1 - easedP1 * 1.2),
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-[#b89a62]/[0.05] rounded-full blur-[180px] transition-opacity duration-500"
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
          filter: `blur(${zoomedBgBlur}px)`,
        }}
        className="absolute inset-0 z-10 overflow-hidden pointer-events-none transition-transform duration-300 ease-out"
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
      {/* 3. STAGE 2: FULL TALL BUILDING HERO IMAGE (Zoom-Out Architecture Reveal)  */}
      {/* ========================================================================= */}
      <div
        style={{
          opacity: heroBgOpacity,
          transform: `scale(${heroBgScale})`,
        }}
        className="absolute inset-0 z-15 overflow-hidden pointer-events-none transition-transform duration-500 ease-out"
      >
        <img
          src={images.marbleHero}
          alt="Lunore Monumental Marble Building Architecture"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center brightness-100 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.70)_100%)]" />

        {/* Revealing Architecture Milestone Text */}
        {isFullyRevealed && (
          <div className="absolute bottom-10 inset-x-0 z-30 flex flex-col items-center text-center pointer-events-none animate-fade-in px-4">
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#b89a62] font-semibold mb-1 drop-shadow-md">
              Architectural Façade
            </span>
            <h3
              className="text-xl sm:text-2xl md:text-3xl text-[#f1eee7] font-light tracking-wider drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Monumental Travertine & Marble Living
            </h3>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MARBLE CUTOUT CARD PINCHING DOWN & SUBMERGING INTO THE BALCONY         */}
      {/* ========================================================================= */}
      {cutoutOpacity > 0.01 && (
        <div
          className="relative z-30 flex flex-col items-center justify-center transition-opacity duration-300"
          style={{
            opacity: cutoutOpacity,
            pointerEvents: isFullyRevealed ? 'none' : 'auto',
          }}
        >
          {/* Floating & Pinch Translation Wrapper */}
          <div
            ref={cardRef}
            onClick={handleCardClick}
            style={{
              perspective: '1400px',
              transform: `perspective(1400px) translate3d(${pos.x * activePosInfluence + submergeTargetX}px, ${pos.y * activePosInfluence + submergeTargetY}px, 0px) rotateX(${tilt.x * activeTiltInfluence}deg) rotateY(${tilt.y * activeTiltInfluence}deg) rotateZ(${tilt.z * activeTiltInfluence}deg) scale(${submergeScale})`,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
            className="relative cursor-pointer group w-[280px] sm:w-[340px] md:w-[390px] h-[380px] sm:h-[460px] md:h-[510px] select-none"
          >
            {/* 3D Flip Inner */}
            <div
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${flipRotation * activeFlipInfluence}deg)`,
                willChange: 'transform',
              }}
              className="relative w-full h-full"
            >
              {/* ========================================================================= */}
              {/* CARD FRONT: Marble Cutout Frame with Dissolving Glass Bezel               */}
              {/* ========================================================================= */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg) translateZ(1px)',
                  backgroundColor: `rgba(255, 255, 255, ${0.08 * bezelOpacity})`,
                  borderColor: `rgba(255, 255, 255, ${0.35 * bezelOpacity})`,
                  boxShadow: bezelOpacity > 0.05
                    ? `0 30px 90px rgba(0,0,0,${0.9 * bezelOpacity}), 0 0 45px rgba(184,154,98,${0.25 * bezelOpacity}), inset 0 1.5px 2px rgba(255,255,255,${0.6 * bezelOpacity})`
                    : 'none',
                }}
                className="absolute inset-0 rounded-3xl overflow-hidden backdrop-blur-2xl p-3.5 sm:p-4.5 border transition-shadow duration-300 flex flex-col items-center justify-center"
              >
                {/* Specular White Top Edge Glow */}
                <div
                  style={{ opacity: bezelOpacity }}
                  className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-10 transition-opacity duration-300"
                />

                {/* Inner Media Frame */}
                <div
                  style={{
                    borderRadius: `${innerRadius}px`,
                    borderColor: `rgba(255, 255, 255, ${0.25 * bezelOpacity})`,
                  }}
                  className="relative w-full h-full border bg-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden"
                >
                  {/* Marble Cutout Image */}
                  <img
                    src={images.marbleCutout}
                    alt="Lunore Architectural Marble Cutout"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none brightness-[1.02] contrast-[1.04]"
                  />

                  {/* Glass Specular Lighting */}
                  <div
                    style={{ opacity: bezelOpacity }}
                    className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.08] pointer-events-none transition-opacity duration-300"
                  />

                  {/* Golden Submerge Glint Ripple as it docks into the balcony facade */}
                  {glintOpacity > 0.05 && (
                    <div
                      style={{ opacity: glintOpacity }}
                      className="absolute inset-0 border-2 border-[#b89a62] shadow-[inset_0_0_35px_rgba(184,154,98,0.7)] pointer-events-none"
                    />
                  )}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* CARD BACK: Dual Sided Image                                              */}
              {/* ========================================================================= */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg) translateZ(1px)',
                  backgroundColor: `rgba(255, 255, 255, ${0.08 * bezelOpacity})`,
                  borderColor: `rgba(255, 255, 255, ${0.35 * bezelOpacity})`,
                }}
                className="absolute inset-0 rounded-3xl overflow-hidden backdrop-blur-2xl p-3.5 sm:p-4.5 border transition-shadow duration-300 flex flex-col items-center justify-center"
              >
                <div
                  style={{ opacity: bezelOpacity }}
                  className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-10 transition-opacity duration-300"
                />

                <div
                  style={{
                    borderRadius: `${innerRadius}px`,
                    borderColor: `rgba(255, 255, 255, ${0.25 * bezelOpacity})`,
                  }}
                  className="relative w-full h-full border bg-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={images.marbleCutout}
                    alt="Lunore Architectural Marble Cutout Back"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none brightness-[1.02] contrast-[1.04]"
                  />
                  <div
                    style={{ opacity: bezelOpacity }}
                    className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.08] pointer-events-none transition-opacity duration-300"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. "ENTER" BUTTON & SCROLL PROMPTS                                        */}
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

        {isEntered && !isFullyRevealed && (
          <div className="flex flex-col items-center gap-1.5 opacity-80 animate-pulse">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#b89a62] font-medium drop-shadow-md">
              {p < 0.5 ? 'Scroll to Submerge into Balcony' : 'Scroll to Reveal Architecture'}
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
