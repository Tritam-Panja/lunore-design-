import React, { useLayoutEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { Eye, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export interface ShowcaseItem {
  id: number | string;
  url: string;
  title: string;
  category?: string;
  tag?: string;
  desc?: string;
  index?: string;
}

export interface ScrollShowcaseProps {
  items: ShowcaseItem[];
  projectTitle?: string;
  projectTag?: string;
  nextProject?: {
    title: string;
    path: string;
  };
  onItemClick?: (item: ShowcaseItem) => void;
  className?: string;
}

interface RowLayout {
  top: number;
  height: number;
}

export const ScrollShowcase: React.FC<ScrollShowcaseProps> = ({
  items,
  projectTitle = 'Interior Architecture',
  projectTag = 'Bespoke Living',
  nextProject,
  onItemClick,
  className = '',
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Cached layout metrics to completely eliminate layout thrashing during scroll
  const rowLayoutsRef = useRef<RowLayout[]>([]);
  const trackHeightRef = useRef<number>(0);
  const containerHeightRef = useRef<number>(0);

  const totalItems = items.length;

  // Pre-measure layout ONCE on mount and resize (Zero DOM reads during scroll!)
  const measureLayout = useCallback(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    containerHeightRef.current = scroller.clientHeight;
    trackHeightRef.current = track.offsetHeight;

    rowLayoutsRef.current = rowRefs.current.map((row) => {
      if (!row) return { top: 0, height: 0 };
      return {
        top: row.offsetTop,
        height: row.offsetHeight,
      };
    });
  }, []);

  // Ultra-optimized scroll updater: Pure arithmetic, ZERO forced reflows
  const updateScrollTimeline = useCallback((scrollOffset: number) => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const beam = beamRef.current;

    const viewportHeight = containerHeightRef.current || (typeof window !== 'undefined' ? window.innerHeight : 800);
    const triggerY = scrollOffset + viewportHeight * 0.55;

    // 1. Golden beam height calculation for both mobile and desktop
    if (beam) {
      const beamStart = isMobile ? 32 : 48;
      const currentBeamHeight = Math.max(0, triggerY - beamStart);
      const maxBeamHeight = Math.max(0, trackHeightRef.current - 100);
      const clampedBeamHeight = Math.min(maxBeamHeight, currentBeamHeight);
      beam.style.height = `${clampedBeamHeight.toFixed(1)}px`;
    }

    // 2. Animate cards & nodes
    const cards = cardRefs.current;
    const nodes = nodeRefs.current;
    const layouts = rowLayoutsRef.current;

    for (let i = 0; i < totalItems; i++) {
      const card = cards[i];
      const node = nodes[i];
      const layout = layouts[i];
      if (!card || !layout) continue;

      const cardCenter = layout.top + layout.height * 0.5;
      const distanceFromTrigger = cardCenter - triggerY;

      // Transition range: 240px on mobile for fast response, 320px on desktop
      const enterRange = isMobile ? 240 : 320;
      const rawProgress = 1 - Math.max(0, Math.min(enterRange, distanceFromTrigger)) / enterRange;

      if (isMobile) {
        // MOBILE: ZERO horizontal drift! Every card stays strictly in line with translateY only
        const translateY = (1 - rawProgress) * 16;
        const scale = 0.96 + rawProgress * 0.04;
        const opacity = 0.25 + rawProgress * 0.75;

        card.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
        card.style.opacity = opacity.toFixed(3);
      } else {
        // DESKTOP: Symmetrical alternating slide toward the center spine
        const isLeft = i % 2 === 0;
        const travelDistance = isLeft ? -35 : 35;
        const translateX = (1 - rawProgress) * travelDistance;
        const scale = 0.95 + rawProgress * 0.05;
        const opacity = 0.2 + rawProgress * 0.8;

        card.style.transform = `translate3d(${translateX.toFixed(1)}px, 0, 0) scale(${scale.toFixed(4)})`;
        card.style.opacity = opacity.toFixed(3);
      }

      // Activate node when beam reaches it (Mobile and Desktop)
      if (node) {
        if (rawProgress >= 0.85) {
          node.classList.add('timeline-node-active');
          node.classList.remove('timeline-node-inactive');
        } else {
          node.classList.remove('timeline-node-active');
          node.classList.add('timeline-node-inactive');
        }
      }
    }
  }, [totalItems]);

  // Setup high-performance Lenis smooth scroller tuned for mobile & desktop
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    measureLayout();

    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const lenis = new Lenis({
      wrapper: scroller,
      content: track,
      duration: isTouch ? 0.6 : 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.0,
      wheelMultiplier: 1.0,
      gestureOrientation: 'vertical',
      lerp: isTouch ? 0.15 : 0.1,
    });

    lenis.on('scroll', (e: { scroll: number }) => {
      updateScrollTimeline(e.scroll);
    });

    const raf = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };
    rafIdRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    // Initial render frame
    updateScrollTimeline(scroller.scrollTop || 0);

    const onResize = () => {
      measureLayout();
      updateScrollTimeline(scroller.scrollTop || 0);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [measureLayout, updateScrollTimeline]);

  return (
    <div
      ref={scrollerRef}
      className={`relative w-full h-full overflow-y-auto overflow-x-hidden ${className}`.trim()}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        transform: 'translateZ(0)',
      }}
    >
      {/* Scrollable Timeline Track */}
      <div
        ref={trackRef}
        className="relative w-full max-w-6xl mx-auto px-3 sm:px-6 md:px-12 py-8 sm:py-14 md:py-20"
      >
        {/* Subtle Ambient Radial Gold Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#b89a62]/8 rounded-full blur-[180px] pointer-events-none" />

        {/* Vertical Spine Guide Line (Mobile: left-5, Tablet: left-7, Desktop: center) */}
        <div
          aria-hidden="true"
          className="absolute left-5 sm:left-7 md:left-1/2 -translate-x-1/2 top-8 sm:top-12 bottom-32 w-[2px] bg-white/10 pointer-events-none"
        />

        {/* Active Golden Scroll Beam (Tracks scroll position down the spine) */}
        <div
          ref={beamRef}
          aria-hidden="true"
          className="absolute left-5 sm:left-7 md:left-1/2 -translate-x-1/2 top-8 sm:top-12 w-[2px] bg-gradient-to-b from-[#b89a62] via-[#f3dfba] to-[#b89a62] shadow-[0_0_14px_rgba(184,154,98,0.85)] pointer-events-none transition-[height] duration-75 ease-out"
          style={{ height: '0px' }}
        />

        {/* Timeline Items List */}
        <div className="relative z-10 flex flex-col gap-8 sm:gap-14 md:gap-28 w-full">
          {items.map((card, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={card.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className={`relative flex flex-col md:flex-row items-center w-full ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Milestone Node on Spine (Centered on spine on both mobile and desktop) */}
                <div
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                  className="timeline-node-inactive absolute left-5 sm:left-7 md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-mono text-[9px] sm:text-[11px] md:text-xs font-semibold select-none transition-all duration-300"
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>

                {/* Horizontal Connector Tick to card (Desktop) */}
                <div
                  aria-hidden="true"
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-px w-6 lg:w-10 border-t border-dashed border-[#b89a62]/40 pointer-events-none ${
                    isLeft ? 'right-1/2 translate-x-0' : 'left-1/2 -translate-x-0'
                  }`}
                />

                {/* Horizontal Connector Tick to card (Mobile) */}
                <div
                  aria-hidden="true"
                  className="md:hidden absolute top-1/2 -translate-y-1/2 left-5 sm:left-7 w-5 sm:w-7 h-px border-t border-dashed border-[#b89a62]/40 pointer-events-none"
                />

                {/* Card Container: Perfectly aligned padding for mobile and desktop */}
                <div
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`w-full pl-10 sm:pl-14 md:pl-0 md:w-[calc(50%-2rem)] lg:w-[calc(50%-3rem)] will-change-transform transform-gpu ${
                    isLeft ? 'md:pr-4 lg:pr-8' : 'md:pl-4 lg:pl-8'
                  }`}
                >
                  <div
                    onClick={() => onItemClick?.(card)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${card.title} full screen`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onItemClick?.(card);
                      }
                    }}
                    className="group relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/11] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] cursor-pointer select-none transition-all duration-300 hover:border-[#b89a62]/80 hover:shadow-[0_25px_80px_rgba(184,154,98,0.15)] active:scale-[0.99]"
                  >
                    {/* Top Specular Gold Edge Highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b89a62]/80 to-transparent pointer-events-none z-20" />

                    {/* Full-Bleed Card Image */}
                    <img
                      src={card.url}
                      alt={card.title}
                      loading={index <= 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Subtle lower gradient for title legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                    {/* Expand Cue Badge */}
                    <div className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 z-20 flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] sm:text-[10px] tracking-[0.16em] uppercase">
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#b89a62]" />
                      <span>View</span>
                    </div>

                    {/* Title Positioned Directly Over Image */}
                    <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-5 md:p-7 z-20 pointer-events-none">
                      <h3
                        className="text-base sm:text-xl md:text-2xl lg:text-3xl font-normal text-white tracking-wide leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {card.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Empty Spacer column on desktop for symmetrical balance */}
                <div className="hidden md:block md:w-[calc(50%-2rem)] lg:w-[calc(50%-3rem)]" />
              </div>
            );
          })}
        </div>

        {/* Section Release Anchor & Next Project Link */}
        <div className="relative z-20 w-full mt-16 sm:mt-24 md:mt-32 pt-12 sm:pt-16 border-t border-white/10 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center px-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#b89a62]/40 bg-[#b89a62]/10 text-[9px] sm:text-xs tracking-[0.26em] uppercase text-[#b89a62] font-semibold mb-3 sm:mb-4">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{projectTag}</span>
            </div>

            <h3
              className="text-xl sm:text-3xl md:text-4xl text-white font-light tracking-wide mb-3 sm:mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {projectTitle}
            </h3>

            <p className="text-xs sm:text-sm text-[#ded9cf]/70 font-light max-w-md leading-relaxed mb-6 sm:mb-8">
              Every detail is tailored to harmonize spatial purity, natural light, and bespoke craftsmanship.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {nextProject && (
                <Link
                  to={nextProject.path}
                  className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-[#b89a62] hover:bg-[#c9aa70] text-black font-semibold text-[10px] sm:text-xs tracking-[0.22em] uppercase transition-all shadow-lg active:scale-95"
                >
                  <span>Next: {nextProject.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  if (scrollerRef.current && lenisRef.current) {
                    lenisRef.current.scrollTo(0, { duration: 1.0 });
                  }
                }}
                className="cursor-pointer inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#f1eee7] transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#b89a62]" />
                <span>Return to Start</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollShowcase;
