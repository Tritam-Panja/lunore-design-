import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { ScrollLine } from '@/components/ScrollLine';
import { useLenis } from '@/components/SmoothScroll';

interface InteriorExperienceProps {
  className?: string;
}

const TITLE_WORDS = ['Interior', 'Design', 'Experts'];

const PARAGRAPH_1_LINES = [
  'Luxury interiors deserve a partner, not a middleman.',
  'Lunore designs, specifies and builds every project as one cohesive experience — from concept to the day you move in.',
  'We source our own materials, supervise our own work, and stand behind every detail.',
  'You get accountability, consistency and beauty, all from one team that genuinely cares about your space.',
];

const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'Discovery',
    desc: 'Free site visit. We listen to how you live, not just your budget.',
  },
  {
    step: '02',
    title: 'Spatial Planning',
    desc: 'Layout approved before any design. No wasted renderings.',
  },
  {
    step: '03',
    title: 'Design Story',
    desc: 'Mood boards, materials, 3D renders. Your vision comes alive.',
  },
  {
    step: '04',
    title: 'Precision',
    desc: 'Quotation locked, contract signed, no surprises.',
  },
  {
    step: '05',
    title: 'Orchestrated Execution',
    desc: 'Weekly updates every Saturday. One team, full transparency.',
  },
  {
    step: '06',
    title: 'Final Curation',
    desc: 'Quality checks, warranty docs, handover complete.',
  },
];

export function InteriorExperience({ className = '' }: InteriorExperienceProps) {
  const { lenis } = useLenis();
  
  // Flashlight vs Full Illumination mode
  const [isFlashlightMode, setIsFlashlightMode] = useState<boolean>(true);
  
  // Spotlight beam radius in pixels (default: 180px Focused)
  const beamSize = 180;
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isSwitchToggled, setIsSwitchToggled] = useState<boolean>(false);
  const [softGlow, setSoftGlow] = useState<boolean>(false);
  const [overlayReady, setOverlayReady] = useState<boolean>(false);
  
  // Tracks active story stage: 
  // 0 = Title (INSIGHT magazine style), 1 = Paragraph (User copy), 2 = Journey, 3 = Explore CTA
  const [storyStage, setStoryStage] = useState<number>(0);
  
  // Tracks if the user has tapped the main button
  const [hasBeenTapped, setHasBeenTapped] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(false);
  const isFlashlightModeRef = useRef<boolean>(true);
  const overlayReadyRef = useRef<boolean>(false);
  const storyStageRef = useRef<number>(0);
  const lastScrollTime = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Position physics stored in mutable ref for zero React re-render lag
  const posRef = useRef({
    currentX: 50,
    currentY: 50,
    targetX: 50,
    targetY: 50,
  });

  // Synchronize refs with state
  useEffect(() => {
    isFlashlightModeRef.current = isFlashlightMode;
    overlayReadyRef.current = overlayReady;
    storyStageRef.current = storyStage;
    if (containerRef.current) {
      containerRef.current.style.setProperty('--beam-size', `${beamSize}px`);
    }
  }, [isFlashlightMode, overlayReady, beamSize, storyStage]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    };
  }, []);

  // Handle Full Illumination switch: animate toggle knob -> soft white light -> reveal image for 2s -> reveal blur & clean white text
  const handleToggleClick = () => {
    if (isSwitchToggled) return;
    if (!hasBeenTapped) {
      setHasBeenTapped(true);
    }
    
    // 1. Immediately animate toggle switch sliding to the other side
    setIsSwitchToggled(true);

    // 2. Give the user time (380ms) to see the mechanical toggle slide to the right
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    switchTimerRef.current = setTimeout(() => {
      setIsFlashlightMode(false);
      setOverlayReady(false);
      overlayReadyRef.current = false;
      setStoryStage(0);
      storyStageRef.current = 0;

      // Trigger soft gentle white light wash
      setSoftGlow(true);
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
      glowTimerRef.current = setTimeout(() => {
        setSoftGlow(false);
      }, 700);

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const targetScroll = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
        if (lenis) {
          lenis.scrollTo(targetScroll, { duration: 0.8 });
        }
      }

      // 2-second pause with pure real image before showing blur & clean text overlay
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setOverlayReady(true);
        overlayReadyRef.current = true;
      }, 2000);
    }, 380);
  };

  // Window-level capture listener: strictly locks outside window scroll on stages 0, 1, 2
  useEffect(() => {
    const onWindowWheel = (e: WheelEvent) => {
      if (isFlashlightModeRef.current || !overlayReadyRef.current) return;

      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
      if (!isInView) return;

      const currentStage = storyStageRef.current;
      const now = Date.now();

      if (e.deltaY > 5) {
        // Scrolling DOWN
        if (currentStage < 3) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          if (now - lastScrollTime.current > 220) {
            setStoryStage((prev) => {
              const next = Math.min(3, prev + 1);
              storyStageRef.current = next;
              return next;
            });
            lastScrollTime.current = now;
          }
        }
      } else if (e.deltaY < -5) {
        // Scrolling UP
        if (currentStage > 0 && rect.top >= -80 && rect.top <= window.innerHeight * 0.45) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          if (now - lastScrollTime.current > 220) {
            setStoryStage((prev) => {
              const next = Math.max(0, prev - 1);
              storyStageRef.current = next;
              return next;
            });
            lastScrollTime.current = now;
          }
        }
      }
    };

    const onWindowTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const onWindowTouchMove = (e: TouchEvent) => {
      if (isFlashlightModeRef.current || !overlayReadyRef.current) return;
      const el = containerRef.current;
      if (!el || e.touches.length === 0) return;

      const rect = el.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
      if (!isInView) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      const currentStage = storyStageRef.current;
      const now = Date.now();

      // Swiping UP to scroll down
      if (deltaY > 15 && currentStage < 3) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (now - lastScrollTime.current > 220) {
          setStoryStage((prev) => {
            const next = Math.min(3, prev + 1);
            storyStageRef.current = next;
            return next;
          });
          lastScrollTime.current = now;
        }
      } else if (deltaY < -15 && currentStage > 0 && rect.top >= -80) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (now - lastScrollTime.current > 220) {
          setStoryStage((prev) => {
            const next = Math.max(0, prev - 1);
            storyStageRef.current = next;
            return next;
          });
          lastScrollTime.current = now;
        }
      }
    };

    window.addEventListener('wheel', onWindowWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', onWindowTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', onWindowTouchMove, { passive: false, capture: true });

    return () => {
      window.removeEventListener('wheel', onWindowWheel, { capture: true } as any);
      window.removeEventListener('touchstart', onWindowTouchStart, { capture: true } as any);
      window.removeEventListener('touchmove', onWindowTouchMove, { capture: true } as any);
    };
  }, []);

  // High-performance direct GPU render loop
  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      const p = posRef.current;
      const isHovered = isHoveredRef.current;
      const isFlash = isFlashlightModeRef.current;

      if (isHovered && isFlash) {
        p.currentX += (p.targetX - p.currentX) * 0.25;
        p.currentY += (p.targetY - p.currentY) * 0.25;

        if (containerRef.current) {
          containerRef.current.style.setProperty('--spotlight-x', `${p.currentX.toFixed(2)}%`);
          containerRef.current.style.setProperty('--spotlight-y', `${p.currentY.toFixed(2)}%`);
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    posRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 100;
    posRef.current.targetY = ((e.clientY - rect.top) / rect.height) * 100;
  }, []);

  const handleTouchMoveFlashlight = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    if (isFlashlightMode) {
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      posRef.current.targetX = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      posRef.current.targetY = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    }
  }, [isFlashlightMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="interior-experience"
      className={`relative w-full py-16 sm:py-24 md:py-32 bg-[#0d0e0e] overflow-hidden ${className}`}
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b89a62]/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Organic Curved Scroll Line */}
      {isFlashlightMode && (
        <ScrollLine
          path="M 480,0 C 180,80 120,240 380,270 C 680,300 890,200 820,380 C 760,520 620,590 500,595"
          viewBox="0 0 1000 800"
          className="absolute inset-0 z-0 opacity-40 md:opacity-70 pointer-events-none transition-opacity duration-700"
          strokeColor="rgba(184, 154, 98, 0.45)"
          strokeWidth={1.8}
          glow={true}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-normal text-[#f1eee7] tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            “Some Spaces Are Seen. Ours Are Experienced.”
          </h2>
        </div>

        {/* Main Stage Container */}
        <div
          ref={containerRef}
          data-lenis-prevent={!isFlashlightMode && overlayReady && storyStage < 3 ? 'true' : undefined}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => {
            if (isFlashlightMode) {
              isHoveredRef.current = true;
              setIsHovered(true);
            }
          }}
          onMouseLeave={() => {
            if (isFlashlightMode) {
              isHoveredRef.current = false;
              setIsHovered(false);
            }
          }}
          onTouchStart={() => {
            if (isFlashlightMode) {
              isHoveredRef.current = true;
              setIsHovered(true);
            }
          }}
          onTouchMove={handleTouchMoveFlashlight}
          onTouchEnd={() => {
            if (isFlashlightMode) {
              isHoveredRef.current = false;
              setIsHovered(false);
            }
          }}
          style={{
            ['--spotlight-x' as string]: '50%',
            ['--spotlight-y' as string]: '50%',
            ['--beam-size' as string]: `${beamSize}px`,
          }}
          className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-white/15 bg-[#030405] shadow-[0_30px_90px_rgba(0,0,0,0.95)] cursor-default select-none group"
        >
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/11] min-h-[580px] sm:min-h-[640px] md:min-h-[720px] overflow-hidden">
            
            {/* ============================================================ */}
            {/* 1. BASE DARK INTERIOR IMAGE (Flashlight mode ambient base)   */}
            {/* ============================================================ */}
            <div className="absolute inset-0 overflow-hidden bg-[#060709]">
              <img
                src="/assets/images/interior dark.png"
                alt="LUNORE Luxury Penthouse Interior in the Dark"
                className="w-full h-full object-cover object-center scale-100 filter brightness-[0.52] contrast-[1.08]"
              />
              <div className="absolute inset-0 bg-black/25 mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
            </div>

            {/* ============================================================ */}
            {/* 2. ILLUMINATED INTERIOR IMAGE (WITH MISTY LEFT-SIDE BLUR)   */}
            {/* ============================================================ */}
            <div
              className={`absolute inset-0 overflow-hidden pointer-events-none transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                !isFlashlightMode
                  ? 'opacity-100'
                  : isHovered
                  ? 'opacity-100 will-change-[mask-image]'
                  : 'opacity-0'
              }`}
              style={
                isFlashlightMode
                  ? {
                      maskImage: 'radial-gradient(circle var(--beam-size) at var(--spotlight-x) var(--spotlight-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'radial-gradient(circle var(--beam-size) at var(--spotlight-x) var(--spotlight-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0) 100%)',
                    }
                  : undefined
              }
            >
              {/* Sharp image layer */}
              <img
                src="/assets/images/interior light .png"
                alt="LUNORE Luxury Penthouse Interior Fully Illuminated"
                className="w-full h-full object-cover object-center scale-100 filter brightness-100"
              />

              {/* LIQUID GLASS LEFT PANEL OVERLAY (APPEARS AFTER 2-SECOND PURE IMAGE PAUSE) */}
              {!isFlashlightMode && (
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out ${
                    overlayReady ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.98) 46%, rgba(0,0,0,0.3) 58%, rgba(0,0,0,0) 68%)',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.98) 46%, rgba(0,0,0,0.3) 58%, rgba(0,0,0,0) 68%)',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(18, 19, 19, 0.36) 45%, rgba(10, 10, 10, 0.16) 100%)',
                    backdropFilter: 'blur(8px) saturate(185%) brightness(102%)',
                    WebkitBackdropFilter: 'blur(8px) saturate(185%) brightness(102%)',
                    boxShadow: 'inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.32), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.3), 0 20px 45px -10px rgba(0, 0, 0, 0.5)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.16)',
                  }}
                />
              )}
            </div>

            {/* Soft White Light Wash Transition on Click */}
            <div
              className={`absolute inset-0 bg-white/25 mix-blend-screen pointer-events-none transition-opacity duration-700 ease-out ${
                softGlow ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Soft white spotlight halo in dark mode */}
            {isFlashlightMode && isHovered && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-400 will-change-transform"
                style={{
                  background: 'radial-gradient(circle calc(var(--beam-size) * 1.05) at var(--spotlight-x) var(--spotlight-y), rgba(255, 255, 255, 0.18) 0%, rgba(245, 250, 255, 0.06) 45%, rgba(0, 0, 0, 0) 100%)',
                  mixBlendMode: 'screen',
                }}
              />
            )}

            {/* CENTER PILL TOGGLE SWITCH (FLASHLIGHT MODE) */}
            {isFlashlightMode && (
              <div
                className={`absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center gap-3 transition-all duration-500 ${
                  isSwitchToggled ? 'scale-105' : 'scale-100'
                }`}
              >
                <button
                  type="button"
                  onClick={handleToggleClick}
                  disabled={isSwitchToggled}
                  aria-label="Toggle Illumination Switch"
                  className={`pointer-events-auto group relative inline-flex items-center p-1.5 sm:p-2 rounded-full liquid-glass-pill backdrop-blur-3xl border transition-all duration-500 hover:scale-110 cursor-pointer shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(184,154,98,0.25)] select-none ${
                    isSwitchToggled
                      ? 'border-[#b89a62] bg-black/80 shadow-[0_0_35px_rgba(184,154,98,0.5)]'
                      : 'border-white/25 hover:border-[#b89a62]/80 bg-black/60'
                  }`}
                >
                  {/* Outer Pill Track */}
                  <div
                    className={`w-16 sm:w-20 h-8 sm:h-10 rounded-full p-1 flex items-center transition-colors duration-400 ${
                      isSwitchToggled
                        ? 'bg-[#b89a62]/40 border border-[#b89a62]/60'
                        : 'bg-white/20 group-hover:bg-white/30 border border-white/10'
                    }`}
                  >
                    {/* Sliding Circular White Knob */}
                    <div
                      className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.6)] transform transition-transform duration-400 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${
                        isSwitchToggled
                          ? 'translate-x-8 sm:translate-x-10 shadow-[0_0_15px_rgba(255,255,255,0.9)]'
                          : 'translate-x-0 group-hover:scale-105'
                      }`}
                    />
                  </div>
                </button>
              </div>
            )}

            {/* ============================================================ */}
            {/* 3. EDITORIAL MAGAZINE LAYOUT (APPEARS AFTER 2-SEC PAUSE)     */}
            {/* ============================================================ */}
            {!isFlashlightMode && overlayReady && (
              <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-start p-6 sm:p-10 md:p-14 lg:p-16 animate-in fade-in duration-1000">
                
                {/* MIDDLE CONTENT: HEADING + DYNAMIC SCROLL CONTENT */}
                <div className="w-full max-w-2xl text-left py-4 sm:py-6 flex flex-col justify-center transition-all duration-700">
                  
                  {/* STAGE 0: INITIAL LARGE STACKED HEADING - CLEAN WHITE TEXT */}
                  {storyStage === 0 ? (
                    <div className="py-4 sm:py-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
                      <h3
                        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.04em] uppercase leading-[0.92] text-white select-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {['INTERIOR', 'DESIGN', 'EXPERTS'].map((line, lineIdx) => (
                          <span key={line} className="block overflow-hidden">
                            <span
                              className="inline-block text-white"
                              style={{
                                animation: 'lunore-letter-reveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) both',
                                animationDelay: `${lineIdx * 0.12}s`,
                              }}
                            >
                              {line}
                            </span>
                          </span>
                        ))}
                      </h3>

                      {/* Subtle Scroll Cue */}
                      <div className="mt-8 flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-[#b89a62] animate-pulse">
                        <span>Scroll to explore</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#b89a62]" />
                      </div>
                    </div>
                  ) : (
                    /* STAGE 1, 2, 3: HEADING MOVED UP AND ALIGNED IN ONE SINGLE LINE - CLEAN WHITE TEXT */
                    <div className="mb-4 sm:mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-6 h-px bg-[#b89a62]" />
                        <span className="text-[10px] tracking-[0.3em] uppercase text-[#b89a62] font-mono">
                          LUNORE LUXE STUDIO
                        </span>
                      </div>
                      <h3
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.06em] uppercase leading-tight text-white select-none drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        <span className="inline-block text-white">
                          INTERIOR DESIGN EXPERTS
                        </span>
                      </h3>
                    </div>
                  )}

                  {/* DYNAMIC SCROLL CONTENT BELOW PERSISTENT ONE-LINE HEADING */}
                  {storyStage > 0 && (
                    <div className="w-full">
                      {/* STAGE 1: 1ST SCROLL -> USER COPY PARAGRAPH */}
                      {storyStage === 1 && (
                        <div key="stage-1" className="space-y-3 max-w-xl animate-in fade-in zoom-in-98 duration-700">
                          {PARAGRAPH_1_LINES.map((line, lineIdx) => (
                            <p
                              key={lineIdx}
                              className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-white leading-relaxed tracking-wide select-none"
                              style={{
                                fontFamily: 'var(--font-heading)',
                                textShadow: '0 2px 20px rgba(0,0,0,0.9)',
                              }}
                            >
                              {line.split(' ').map((word, wordIdx) => (
                                <span
                                  key={`${word}-${wordIdx}`}
                                  className="inline-block overflow-hidden mr-[0.24em] last:mr-0 align-bottom"
                                >
                                  <span
                                    className="inline-block text-white"
                                    style={{
                                      animation: 'lunore-letter-reveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) both',
                                      animationDelay: `${0.05 + lineIdx * 0.18 + wordIdx * 0.025}s`,
                                    }}
                                  >
                                    {word}
                                  </span>
                                </span>
                              ))}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* STAGE 2: 2ND SCROLL -> THE LUNORE DESIGN JOURNEY (6 STEPS) */}
                      {storyStage === 2 && (
                        <div key="stage-2" className="space-y-3 max-w-3xl animate-in fade-in zoom-in-98 duration-700">
                          <p className="text-xs sm:text-sm font-medium text-[#b89a62] tracking-wider uppercase">
                            The Lunore Design Journey
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                            {JOURNEY_STEPS.map((item, idx) => (
                              <div
                                key={item.step}
                                className="p-2.5 sm:p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/15 hover:border-[#b89a62]/50 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                                style={{
                                  animation: 'lunore-letter-reveal 0.75s cubic-bezier(0.16, 1, 0.3, 1) both',
                                  animationDelay: `${0.06 + idx * 0.06}s`,
                                }}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[10px] font-mono text-[#b89a62] font-semibold">
                                    {item.step}
                                  </span>
                                  <span className="text-xs sm:text-sm font-medium text-white">
                                    {item.title}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#f1eee7]/80 font-light leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* STAGE 3: 3RD/4TH SCROLL -> "EXPLORE MORE" CTA */}
                      {storyStage === 3 && (
                        <div key="stage-3" className="space-y-5 animate-in fade-in zoom-in-98 duration-700 max-w-xl">
                          <div className="space-y-2">
                            <h4
                              className="text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-tight leading-tight"
                              style={{ fontFamily: 'var(--font-heading)' }}
                            >
                              Step Into The Experience
                            </h4>
                            <p className="text-xs sm:text-sm text-[#f1eee7]/85 font-light leading-relaxed">
                              Explore our signature penthouses, curated marble collections, and bespoke architectural portfolio.
                            </p>
                          </div>

                          <div className="pt-1">
                            <a
                              href="#projects"
                              onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById('projects');
                                if (el) {
                                  if (lenis) {
                                    lenis.scrollTo(el, { offset: -70 });
                                  } else {
                                    el.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }
                              }}
                              className="pointer-events-auto inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full liquid-glass-pill backdrop-blur-2xl border border-[#b89a62] bg-black/85 text-[#f1eee7] hover:text-[#0d0e0e] hover:bg-[#b89a62] font-medium text-[11px] sm:text-xs tracking-[0.22em] uppercase transition-all duration-500 hover:scale-105 shadow-[0_0_30px_rgba(184,154,98,0.35)] cursor-pointer select-none group"
                            >
                              <span>EXPLORE MORE</span>
                              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

