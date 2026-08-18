import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, SunMedium, Flashlight } from 'lucide-react';
import { ScrollLine } from '@/components/ScrollLine';

interface InteriorExperienceProps {
  className?: string;
}

export function InteriorExperience({ className = '' }: InteriorExperienceProps) {
  // Flashlight vs Full Illumination mode
  const [isFlashlightMode, setIsFlashlightMode] = useState<boolean>(true);
  
  // Spotlight beam radius in pixels (default: 260px)
  const [beamSize, setBeamSize] = useState<number>(260);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isIlluminating, setIsIlluminating] = useState<boolean>(false);
  
  // Tracks if the user has tapped the main button (glows continuously until first tap)
  const [hasBeenTapped, setHasBeenTapped] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(false);
  const isFlashlightModeRef = useRef<boolean>(true);

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
    if (containerRef.current) {
      containerRef.current.style.setProperty('--beam-size', `${beamSize}px`);
    }
  }, [isFlashlightMode, beamSize]);

  // Handle Full Illumination switch with subtle bloom animation
  const handleToggleClick = () => {
    if (!hasBeenTapped) {
      setHasBeenTapped(true);
    }
    // Switch to Full Illumination and permanently dismiss the center button
    setIsFlashlightMode(false);
    setIsIlluminating(true);
    setTimeout(() => setIsIlluminating(false), 1200);
  };

  // High-performance direct GPU render loop (0 React re-renders during mouse movement)
  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      const p = posRef.current;
      const isHovered = isHoveredRef.current;
      const isFlash = isFlashlightModeRef.current;

      // Only follow active cursor when hovered in flashlight mode
      if (isHovered && isFlash) {
        p.currentX += (p.targetX - p.currentX) * 0.25;
        p.currentY += (p.targetY - p.currentY) * 0.25;

        // Direct DOM update via CSS variables
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

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    posRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 100;
    posRef.current.targetY = ((e.clientY - rect.top) / rect.height) * 100;
  }, []);

  // Touch drag handler for mobile/tablets
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    posRef.current.targetX = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    posRef.current.targetY = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
  }, []);

  // Entrance observer
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

      {/* Organic Curved Scroll Line - Loops above section and merges directly into the middle center button */}
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
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-pill mb-4 border border-white/10">
            <Flashlight className="w-3.5 h-3.5 text-[#b89a62]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b89a62]">
              Interactive Illumination Experience
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-light text-[#f1eee7] tracking-tight">
            Discover The Penthouse In The Dark
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#b9b5ae] font-light max-w-xl mx-auto leading-relaxed">
            Hover your cursor across the dark penthouse to explore architectural details with a soft white spotlight.
          </p>
        </div>

        {/* Main Stage Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => {
            isHoveredRef.current = true;
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            setIsHovered(false);
          }}
          onTouchStart={() => {
            isHoveredRef.current = true;
            setIsHovered(true);
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => {
            isHoveredRef.current = false;
            setIsHovered(false);
          }}
          style={{
            ['--spotlight-x' as string]: '50%',
            ['--spotlight-y' as string]: '50%',
            ['--beam-size' as string]: `${beamSize}px`,
          }}
          className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-white/15 bg-[#030405] shadow-[0_30px_90px_rgba(0,0,0,0.95)] cursor-crosshair select-none group"
        >
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/11] min-h-[500px] sm:min-h-[600px] md:min-h-[700px] overflow-hidden">
            
            {/* ============================================================ */}
            {/* 1. BASE DARK INTERIOR IMAGE (Visible at ~25-30% ambient level)*/}
            {/* ============================================================ */}
            <div className="absolute inset-0 overflow-hidden bg-[#060709]">
              <img
                src="/assets/images/interior dark.png"
                alt="LUNORE Luxury Penthouse Interior in the Dark"
                className={`w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-out filter brightness-[0.52] contrast-[1.08] ${
                  hasEntered ? 'scale-100' : 'scale-[1.035]'
                }`}
              />
              <div className="absolute inset-0 bg-black/25 mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
            </div>

            {/* ============================================================ */}
            {/* 2. ILLUMINATED INTERIOR IMAGE (interior light .png)          */}
            {/*    Active only on hover in Flashlight mode / 100% in Full    */}
            {/* ============================================================ */}
            <div
              className={`absolute inset-0 overflow-hidden pointer-events-none transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                  : {
                      opacity: 1,
                    }
              }
            >
              <img
                src="/assets/images/interior light .png"
                alt="LUNORE Luxury Penthouse Interior Fully Illuminated"
                className={`w-full h-full object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isIlluminating ? 'scale-[1.015] filter brightness-[1.06]' : 'scale-100 filter brightness-100'
                }`}
              />
            </div>

            {/* Subtle Light Bloom Flash Animation when hitting Full Illumination */}
            <div
              className={`absolute inset-0 bg-white/15 mix-blend-screen pointer-events-none transition-opacity duration-1000 ease-out ${
                isIlluminating ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* ============================================================ */}
            {/* 3. REFINED SOFT WHITE SPOTLIGHT HALO (Hover only)           */}
            {/* ============================================================ */}
            {isFlashlightMode && isHovered && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-400 will-change-transform"
                style={{
                  background: 'radial-gradient(circle calc(var(--beam-size) * 1.05) at var(--spotlight-x) var(--spotlight-y), rgba(255, 255, 255, 0.18) 0%, rgba(245, 250, 255, 0.06) 45%, rgba(0, 0, 0, 0) 100%)',
                  mixBlendMode: 'screen',
                }}
              />
            )}

            {/* ============================================================ */}
            {/* 4. SOFT WHITE SPOTLIGHT RETICLE (Hover only)                */}
            {/* ============================================================ */}
            {isFlashlightMode && isHovered && (
              <div
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30 will-change-transform transition-opacity duration-300"
                style={{
                  left: 'var(--spotlight-x)',
                  top: 'var(--spotlight-y)',
                }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-white/60 bg-white/10 backdrop-blur-xs flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.6)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 5. CENTER BUTTON (DISAPPEARS PERMANENTLY AFTER ILLUMINATION) */}
            {/* ============================================================ */}
            {isFlashlightMode && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto flex items-center justify-center transition-all duration-700">
                <button
                  type="button"
                  onClick={handleToggleClick}
                  className={`flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full liquid-glass-pill backdrop-blur-2xl border transition-all duration-500 hover:scale-105 cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.8)] select-none ${
                    !hasBeenTapped
                      ? 'button-scroll-glow border-[#e6cb97] bg-black/80 text-white'
                      : 'border-white/50 bg-black/75 text-white shadow-[0_0_24px_rgba(255,255,255,0.15)] hover:border-white'
                  }`}
                >
                  <SunMedium className="w-4 h-4 text-[#e6cb97]" />
                  <span className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-medium text-[#f1eee7]">
                    FULL ILLUMINATION
                  </span>
                </button>
              </div>
            )}

            {/* Storytelling container slot */}
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-6 sm:p-10 lg:p-14">
              <div className="max-w-xl pointer-events-auto">
                <div id="interior-experience-content" className="space-y-4" />
              </div>
            </div>

          </div>
        </div>

        {/* Beam Width Control Strip (Visible in Flashlight Mode) */}
        {isFlashlightMode && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#b9b5ae] font-light">
              Spotlight Aperture:
            </span>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
              {[
                { label: 'Focused', size: 180 },
                { label: 'Medium', size: 260 },
                { label: 'Wide Aperture', size: 360 },
              ].map((beam) => (
                <button
                  key={beam.label}
                  onClick={() => setBeamSize(beam.size)}
                  className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] tracking-[0.15em] uppercase transition-all cursor-pointer ${
                    beamSize === beam.size
                      ? 'bg-white text-[#0d0e0e] font-semibold shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                      : 'text-[#b9b5ae] hover:text-white'
                  }`}
                >
                  {beam.label}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
