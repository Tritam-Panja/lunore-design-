import { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, EyeOff, ChevronLeft, ChevronRight, Sparkles, ArrowUpRight, Compass, Layers } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { images } from '@/lib/images';

interface SculptureItem {
  id: string;
  title: string;
  category: string;
  material: string;
  dimensions: string;
  year: string;
  edition: string;
  image?: string;
}

const SCULPTURE_CAROUSEL_ITEMS: SculptureItem[] = [
  {
    id: '01',
    title: 'Obsidian Figure',
    category: 'Abstract Sculpture',
    material: 'Raw Volcanic Obsidian & Matte Bronze',
    dimensions: '220 × 85 × 60 cm',
    year: '2026',
    edition: 'Unique 1 of 1',
  },
  {
    id: '02',
    title: 'Limestone Relief',
    category: 'Architectural Feature',
    material: 'Hand-Chiseled French Limestone',
    dimensions: '180 × 180 × 25 cm',
    year: '2026',
    edition: 'Edition of 3',
  },
  {
    id: '03',
    title: 'Figurative Sculptures',
    category: 'Classical Form',
    material: 'Polished Italian Carrara Marble',
    dimensions: '195 × 75 × 70 cm',
    year: '2025',
    edition: 'Masterpiece 1 of 1',
  },
  {
    id: '04',
    title: 'Gilded Marble Sculptures',
    category: 'Premium Adornment',
    material: 'Veined Nero Marquina & 24k Gold Leaf',
    dimensions: '210 × 90 × 80 cm',
    year: '2026',
    edition: 'Edition of 2',
  },
  {
    id: '05',
    title: 'Spiritual Sculpture',
    category: 'Ethereal Art',
    material: 'Backlit Translucent Statuary Onyx',
    dimensions: '240 × 110 × 90 cm',
    year: '2026',
    edition: 'Unique 1 of 1',
  },
  {
    id: '06',
    title: 'Monumental Monolith',
    category: 'Monumental Artwork',
    material: 'Monolithic Belgian Black Granite',
    dimensions: '260 × 95 × 70 cm',
    year: '2026',
    edition: 'Masterpiece 1 of 1',
  },
  {
    id: '07',
    title: 'Celestial Torso',
    category: 'Visionary Heritage',
    material: 'Crystalline Statuario Marble',
    dimensions: '185 × 70 × 60 cm',
    year: '2025',
    edition: 'Edition of 2',
  },
];

export function SculpturesExperienceBackup() {
  const [viewMode, setViewMode] = useState<'TPP' | 'FPP'>('TPP');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);

  const targetRotationRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; rot: number } | null>(null);

  const total = SCULPTURE_CAROUSEL_ITEMS.length;
  const activeIndex = ((Math.round(rotation) % total) + total) % total;

  useEffect(() => {
    if (viewMode !== 'FPP') return;

    let animId: number;
    const updatePhysics = () => {
      const diff = targetRotationRef.current - currentRotationRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentRotationRef.current += diff * 0.18;
        setRotation(currentRotationRef.current);
      }
      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [viewMode]);

  const handleToggleView = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (viewMode === 'TPP') {
      setViewMode('FPP');
    } else {
      setViewMode('TPP');
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [viewMode, isTransitioning]);

  const handlePrev = useCallback(() => {
    targetRotationRef.current = Math.round(targetRotationRef.current) - 1;
  }, []);

  const handleNext = useCallback(() => {
    targetRotationRef.current = Math.round(targetRotationRef.current) + 1;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'FPP') return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        handleToggleView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handlePrev, handleNext, handleToggleView]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || viewMode !== 'FPP') return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      targetRotationRef.current += delta * 0.004;

      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      snapTimerRef.current = setTimeout(() => {
        targetRotationRef.current = Math.round(targetRotationRef.current);
      }, 160);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [viewMode]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (viewMode !== 'FPP') return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      rot: targetRotationRef.current,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const clientX = e.touches[0].clientX;
    const diff = clientX - touchStartRef.current.x;
    targetRotationRef.current = touchStartRef.current.rot - diff * 0.0045;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    touchStartRef.current = null;
    targetRotationRef.current = Math.round(targetRotationRef.current);
  };

  return (
    <section id="projects" className="relative w-full py-16 sm:py-24 md:py-32 bg-[#0d0e0e] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-[#b89a62]/6 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <Reveal direction="down">
            <p className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-3 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#b89a62]" />
              Featured Portfolio
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2
              className="text-2xl sm:text-3xl md:text-5xl font-normal text-[#f1eee7] tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Signature Sculptures
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.15}>
            <p className="text-xs sm:text-sm text-[#b9b5ae] mt-2.5 max-w-xl mx-auto tracking-wide">
              {viewMode === 'TPP'
                ? 'Observe the gallery from an architectural perspective or shift your point of view to enter the observer’s first-person gaze.'
                : 'Immerse within the outward curved liquid glass gallery — interactive panoramic perspective.'}
            </p>
          </Reveal>
        </div>

        <Reveal direction="zoom" delay={0.2}>
          <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-white/15 bg-[#030405] shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/11] min-h-[540px] sm:min-h-[620px] md:min-h-[700px] overflow-hidden select-none">
              <div
                className="absolute inset-0 overflow-hidden transition-all ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                style={{
                  transformOrigin: '49.6% 47.5%',
                  transform:
                    viewMode === 'FPP'
                      ? 'scale(1.88) translateY(-4%)'
                      : 'scale(1) translateY(0%)',
                  transitionDuration: '900ms',
                }}
              >
                <img
                  src={images.sculptureHero}
                  alt="LUNORE Signature Sculptures Gallery"
                  className="w-full h-full object-cover object-center brightness-100 contrast-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
              </div>

              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-400 ${
                  isTransitioning
                    ? 'opacity-100 bg-[#b89a62]/10 backdrop-blur-[1px]'
                    : 'opacity-0 bg-transparent backdrop-blur-0'
                }`}
              />

              {viewMode === 'TPP' && (
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10 pointer-events-none transition-all duration-500 opacity-100">
                  <div className="flex flex-col items-center justify-center text-center mt-auto">
                    <button
                      onClick={handleToggleView}
                      disabled={isTransitioning}
                      className="pointer-events-auto group relative cursor-pointer inline-flex items-center gap-3.5 px-7 sm:px-9 py-4 rounded-full bg-[rgba(15,16,16,0.75)] hover:bg-[rgba(25,26,26,0.85)] border border-[#b89a62]/40 hover:border-[#b89a62] text-[#f1eee7] shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(184,154,98,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(184,154,98,0.35)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] backdrop-blur-xl"
                    >
                      <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                      
                      <div className="w-8 h-8 rounded-full bg-[#b89a62]/20 border border-[#b89a62]/50 flex items-center justify-center text-[#b89a62] group-hover:rotate-45 transition-transform duration-500">
                        <Compass className="w-4 h-4" />
                      </div>

                      <div className="text-left">
                        <div className="text-[11px] sm:text-xs tracking-[0.28em] uppercase font-medium text-[#f1eee7] group-hover:text-[#b89a62] transition-colors">
                          Shift My View
                        </div>
                        <div className="text-[9px] tracking-[0.2em] uppercase text-[#b9b5ae]">
                          Enter First-Person Perspective (FPP)
                        </div>
                      </div>

                      <Eye className="w-4 h-4 text-[#b89a62] ml-1 transition-transform duration-300 group-hover:scale-110" />
                    </button>
                  </div>
                </div>
              )}

              {viewMode === 'FPP' && (
                <div
                  className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 z-20 transition-opacity duration-500 opacity-100 select-none"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="flex items-center justify-between w-full relative z-30">
                    <div className="liquid-glass-pill px-3.5 sm:px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#f1eee7]">
                      <span className="w-2 h-2 rounded-full bg-[#b89a62] animate-pulse shadow-[0_0_8px_rgba(184,154,98,0.8)]" />
                      First-Person View (FPP)
                    </div>

                    <div className="liquid-glass-pill px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#f1eee7]/90">
                      <span className="text-[#b89a62] font-semibold">{SCULPTURE_CAROUSEL_ITEMS[activeIndex].id}</span>
                      <span className="text-[#85817a] mx-1">/</span>
                      <span>0{SCULPTURE_CAROUSEL_ITEMS.length}</span>
                    </div>

                    <button
                      onClick={handleToggleView}
                      disabled={isTransitioning}
                      className="cursor-pointer liquid-glass-pill hover:border-white/60 hover:text-white px-3.5 sm:px-5 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#f1eee7] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                    >
                      <EyeOff className="w-3.5 h-3.5 text-[#b89a62]" />
                      <span className="hidden sm:inline">Exit View</span> (TPP)
                    </button>
                  </div>

                  <div
                    ref={stageRef}
                    data-lenis-prevent="true"
                    className="relative w-full flex-1 flex items-center justify-center my-1 sm:my-2 overflow-visible [perspective:1200px]"
                  >
                    <div className="relative w-full h-full max-h-[440px] sm:max-h-[500px] md:max-h-[550px] flex items-center justify-center [transform-style:preserve-3d]">
                      {SCULPTURE_CAROUSEL_ITEMS.map((item, index) => {
                        const total = SCULPTURE_CAROUSEL_ITEMS.length;
                        let diff = (index - (rotation % total)) % total;
                        if (diff > total / 2) diff -= total;
                        if (diff < -total / 2) diff += total;

                        const isCenter = Math.abs(diff) < 0.45;
                        const isVisible = Math.abs(diff) <= 2.6;

                        const translateX = diff * 320;
                        const translateZ = 50 - Math.abs(diff) * 55;
                        const rotateY = Math.max(-50, Math.min(50, diff * 26));
                        const scale = Math.max(0.72, 1 - Math.abs(diff) * 0.08);
                        const opacity = isVisible ? Math.max(0.1, 1 - Math.pow(Math.abs(diff) / 2.6, 1.4)) : 0;
                        const zIndex = Math.round(30 - Math.abs(diff) * 10);

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (Math.abs(diff) > 0.3) {
                                targetRotationRef.current = Math.round(targetRotationRef.current + diff);
                              }
                            }}
                            style={{
                              transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                              opacity,
                              zIndex,
                              pointerEvents: isVisible ? 'auto' : 'none',
                              willChange: 'transform, opacity',
                            }}
                            className={`absolute w-[240px] sm:w-[280px] md:w-[310px] lg:w-[340px] h-[360px] sm:h-[420px] md:h-[470px] lg:h-[500px] rounded-2xl cursor-pointer select-none transition-shadow duration-300 ${
                              isCenter
                                ? 'shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_35px_rgba(255,255,255,0.2),inset_0_1.5px_2px_rgba(255,255,255,0.5)] border border-white/55'
                                : 'shadow-[0_20px_45px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.3)] border border-white/25 hover:border-white/45'
                            }`}
                          >
                            <div className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.05)_100%)] p-4 sm:p-5 flex flex-col items-center justify-center">
                              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                              <div className="relative w-full h-full rounded-xl border border-white/20 bg-white/[0.02] backdrop-blur-md flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-white/[0.02] pointer-events-none" />
                                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-white/[0.03] to-transparent pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full relative z-30 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="cursor-pointer liquid-glass-pill p-2.5 sm:p-3 rounded-full hover:border-[#b89a62] hover:text-[#b89a62] text-[#f1eee7] transition-all"
                      aria-label="Previous Sculpture"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

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
                              ? 'w-7 sm:w-9 h-1.5 bg-[#b89a62] shadow-[0_0_12px_rgba(184,154,98,0.6)]'
                              : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                          }`}
                          aria-label={`Go to sculpture ${item.id}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="cursor-pointer liquid-glass-pill p-2.5 sm:p-3 rounded-full hover:border-[#b89a62] hover:text-[#b89a62] text-[#f1eee7] transition-all"
                      aria-label="Next Sculpture"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
