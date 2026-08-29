import React, { useState, useEffect, useRef, useCallback } from 'react';
import GradualBlur from './GradualBlur';
import { Sparkles, ArrowRight, ShieldCheck, Gem, Compass, Layers, ChevronDown, Check } from 'lucide-react';
import { TextReveal } from './TextReveal';

interface AurexaStone {
  id: string;
  name: string;
  category: string;
  origin: string;
  finish: string;
  description: string;
  image: string;
  highlight: string;
  rarity: string;
}

const AUREXA_STONES: AurexaStone[] = [
  {
    id: '1',
    name: 'Statuario Imperial Extra',
    category: 'Haute Marble',
    origin: 'Carrara, Italy',
    finish: 'Silk Bookmatched Polish',
    description: 'Distinctive bold crystalline grey and gold veining traversing an immaculate translucent white alabaster field. Revered for monumental living halls and double-height walls.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    highlight: '99.2% Pure Calcite Matrix',
    rarity: 'Tier 1 Exclusive'
  },
  {
    id: '2',
    name: 'Sahara Noir Royal Obsidian',
    category: 'Architectural Granite & Quartzite',
    origin: 'Zagora Quarry, Morocco',
    finish: 'Honed Leather Texture',
    description: 'Deep obsidian black backdrop punctuated with razor-sharp geometric golden and calcite amber lightning fissures. Unmatched density and eternal stain resistance.',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=85',
    highlight: 'Mohs Hardness 7.5',
    rarity: 'Limited Extraction'
  },
  {
    id: '3',
    name: 'Calacatta Gold Supreme',
    category: 'Signature Italian Marble',
    origin: 'Apuan Alps, Italy',
    finish: 'Mirror Gloss Reflection',
    description: 'Warm honey-gold and deep pewter rivers flowing across a warm milk-white base, creating harmonious rhythmic movement across large architectural spans.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
    highlight: 'Zero Porosity Seal',
    rarity: 'First-Choice Block'
  },
  {
    id: '4',
    name: 'Patagonia Breccia Crystal',
    category: 'Exotic Backlit Quartzite',
    origin: 'Cordillera, Argentina',
    finish: 'Backlit Translucent Glow',
    description: 'Volcanic breccia quartz inclusions interwoven with obsidian fragments and volcanic amber veins. Naturally diffuses illumination to create glowing architectural features.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85',
    highlight: 'Natural Light Diffuser',
    rarity: 'Museum Grade'
  },
  {
    id: '5',
    name: 'Travertino Romano Navona',
    category: 'Monumental Travertine',
    origin: 'Tivoli, Italy',
    finish: 'Vein-Cut Architectural Fill',
    description: 'Warm cream-sand strata with dense linear pore patterns sculpted for enduring exterior facade permanence and thermal regulation.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
    highlight: 'Millennium Proven',
    rarity: 'Classic Heritage'
  }
];

export function AurexaSection() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  const [maxTranslate, setMaxTranslate] = useState<number>(2800);
  const overscrollDownRef = useRef<number>(0);
  const overscrollUpRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  // Measure content track height
  const measureTrack = useCallback(() => {
    if (!scrollTrackRef.current) return;
    const trackHeight = scrollTrackRef.current.getBoundingClientRect().height || scrollTrackRef.current.scrollHeight;
    const vh = window.innerHeight;
    const bottomPadding = 120;
    const needed = Math.max(600, trackHeight - vh + bottomPadding);
    setMaxTranslate(needed);
  }, []);

  useEffect(() => {
    measureTrack();

    const trackEl = scrollTrackRef.current;
    if (!trackEl) return;

    const observer = new ResizeObserver(() => {
      measureTrack();
    });
    observer.observe(trackEl);

    window.addEventListener('resize', measureTrack);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measureTrack);
    };
  }, [measureTrack]);

  // Smooth 60fps RAF spring physics
  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) < 0.0001) {
        currentProgressRef.current = targetProgressRef.current;
      } else {
        currentProgressRef.current += diff * 0.14;
      }
      setScrollProgress(currentProgressRef.current);
      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  const navigateToNext = useCallback(() => {
    const nextSec = document.getElementById('process') || document.getElementById('cta') || document.getElementById('contact');
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  }, []);

  const navigateToPrev = useCallback(() => {
    const prevSec = document.getElementById('marble-experience') || document.getElementById('hero');
    if (prevSec) {
      prevSec.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      window.scrollBy({ top: -window.innerHeight * 0.9, behavior: 'smooth' });
    }
  }, []);

  // Wheel Scroll Lock handler: User scrolls through Aurexa content seamlessly, then continues down website
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top <= 80 && rect.bottom >= window.innerHeight - 80;

      if (!isVisible) return;

      // Scrolling Down
      if (e.deltaY > 0) {
        if (targetProgressRef.current < 0.999) {
          e.preventDefault();
          e.stopPropagation();
          overscrollDownRef.current = 0;
          const step = Math.min(Math.abs(e.deltaY) * 0.0007, 0.09);
          targetProgressRef.current = Math.min(1, targetProgressRef.current + step);
        } else {
          // Reached end of Aurexa slabs!
          overscrollDownRef.current += Math.abs(e.deltaY);
          if (overscrollDownRef.current > 120) {
            navigateToNext();
          }
        }
      }
      // Scrolling Up
      else if (e.deltaY < 0) {
        if (targetProgressRef.current > 0.001) {
          e.preventDefault();
          e.stopPropagation();
          overscrollUpRef.current = 0;
          const step = Math.min(Math.abs(e.deltaY) * 0.0007, 0.09);
          targetProgressRef.current = Math.max(0, targetProgressRef.current - step);
        } else {
          // Reached top of Aurexa!
          overscrollUpRef.current += Math.abs(e.deltaY);
          if (overscrollUpRef.current > 120) {
            navigateToPrev();
          }
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [navigateToNext, navigateToPrev]);

  // Touch handlers for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const deltaY = touchStartYRef.current - touch.clientY;
    touchStartYRef.current = touch.clientY;

    if (deltaY > 0) {
      if (targetProgressRef.current < 0.999) {
        targetProgressRef.current = Math.min(1, targetProgressRef.current + deltaY * 0.0025);
      } else {
        overscrollDownRef.current += Math.abs(deltaY);
        if (overscrollDownRef.current > 120) {
          navigateToNext();
        }
      }
    } else if (deltaY < 0) {
      if (targetProgressRef.current > 0.001) {
        targetProgressRef.current = Math.max(0, targetProgressRef.current + deltaY * 0.0025);
      } else {
        overscrollUpRef.current += Math.abs(deltaY);
        if (overscrollUpRef.current > 120) {
          navigateToPrev();
        }
      }
    }
  };

  const currentSlabIndex = Math.min(
    AUREXA_STONES.length,
    Math.max(1, Math.floor(scrollProgress * (AUREXA_STONES.length + 0.5)) + 1)
  );

  return (
    <section
      ref={containerRef}
      id="aurexa"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="relative w-full h-[100dvh] min-h-[650px] bg-[#08090a] overflow-hidden select-none flex flex-col justify-start items-center border-t border-b border-white/[0.06]"
    >
      {/* 1. AMBIENT GLOWS & LUXURY BACKDROP */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-[#b89a62]/[0.05] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[500px] bg-white/[0.02] rounded-full blur-[160px] pointer-events-none" />



      {/* 3. TOP GRADUAL BLUR FILTER */}
      <GradualBlur
        target="parent"
        position="top"
        height="8.5rem"
        strength={2.4}
        divCount={6}
        curve="bezier"
        exponential={true}
        opacity={scrollProgress > 0.02 ? 1 : 0}
        zIndex={40}
      />

      {/* 4. CONTINUOUS TRANSLATING CONTENT STREAM */}
      <div
        ref={scrollTrackRef}
        style={{
          transform: `translate3d(0, ${-scrollProgress * maxTranslate}px, 0)`,
          willChange: 'transform',
        }}
        className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-20 sm:pt-28 pb-40 space-y-16 sm:space-y-20 relative z-10"
      >
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#b89a62]/45 mb-4 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#b89a62]" />
            <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#b89a62] font-semibold">
              The Haute Stone Pavilion
            </span>
          </div>

          {/* Title */}
          <TextReveal
            text="AUREXA"
            as="h2"
            className="text-5xl sm:text-7xl md:text-8xl font-light tracking-[0.08em] text-[#f8f6f0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
            wordClassName="text-[#f8f6f0]"
            delay={0.05}
            stagger={0.08}
          />

          {/* Subtitle with High Contrast & Readability */}
          <p className="mt-4 text-base sm:text-lg md:text-[1.08rem] text-[#ded9cf] font-normal leading-relaxed max-w-2xl text-center drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
            A bespoke curation of monumental slabs and rare quarry cuts, meticulously verified for monolithic interior and exterior architecture.
          </p>

          {/* Feature Badges */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs text-[#cfcac0] uppercase tracking-[0.2em] font-medium">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-[#b89a62]" /> 100% Inspected
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-md">
              <Gem className="w-4 h-4 text-[#b89a62]" /> Rare Origins
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-md">
              <Compass className="w-4 h-4 text-[#b89a62]" /> Global Quarrying
            </span>
          </div>

          {/* Scroll Down Prompt */}
          <div className="mt-8 flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#b89a62] animate-bounce font-medium">
            <span>Scroll down to journey through slabs</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#b89a62]" />
          </div>
        </div>

        {/* 5 MONUMENTAL SLAB CARDS */}
        <div className="space-y-14">
          {AUREXA_STONES.map((stone, idx) => (
            <div
              key={stone.id}
              className="group relative rounded-3xl border border-white/[0.08] bg-[#111315]/85 backdrop-blur-2xl overflow-hidden p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-500 hover:border-[#b89a62]/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(184,154,98,0.2)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Stone Image with Gradual Blur on edges */}
                <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-[16/10] bg-black/40 border border-white/[0.06] shadow-2xl">
                  <img
                    src={stone.image}
                    alt={stone.name}
                    loading="lazy"
                    onLoad={measureTrack}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[9px] tracking-[0.25em] uppercase text-[#f1eee7] backdrop-blur-md">
                      {stone.rarity}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#b89a62]/20 border border-[#b89a62]/60 text-[10px] tracking-[0.2em] uppercase text-[#f3e5ab] backdrop-blur-md font-medium">
                      {stone.highlight}
                    </span>
                  </div>
                </div>

                {/* Stone Editorial Details */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#b89a62] font-semibold">0{idx + 1}</span>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#b89a62] font-semibold">
                      {stone.category}
                    </span>
                  </div>

                  <h3
                    className="text-2xl sm:text-3xl lg:text-4xl text-[#f1eee7] font-normal leading-tight tracking-wide"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {stone.name}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-[#a09c95]">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#b89a62]" /> {stone.origin}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#b89a62]" /> {stone.finish}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#cac5bd] font-light leading-relaxed pt-1">
                    {stone.description}
                  </p>

                  <div className="pt-3 flex items-center gap-4">
                    <button className="cursor-pointer group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-[#b89a62]/20 border border-white/20 hover:border-[#b89a62] text-xs uppercase tracking-[0.2em] text-[#f1eee7] hover:text-[#f3e5ab] transition-all duration-300">
                      <span>Inquire Slab Bundle</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#b89a62] group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3 ASSURANCE & CRAFT PILLARS AT THE END OF SCROLL */}
        <div className="pt-10 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#b89a62]/10 border border-[#b89a62]/30 flex items-center justify-center text-[#b89a62]">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-medium text-[#f1eee7] tracking-wide">
              Direct Global Quarry Allocation
            </h4>
            <p className="text-xs text-[#9c978f] font-light leading-relaxed">
              We secure first-choice blocks directly from historic quarries across Carrara, Verona, Zagora, and Patagonia before open auction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#b89a62]/10 border border-[#b89a62]/30 flex items-center justify-center text-[#b89a62]">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-medium text-[#f1eee7] tracking-wide">
              Sequential Bookmatch Mapping
            </h4>
            <p className="text-xs text-[#9c978f] font-light leading-relaxed">
              Every bundle is digitally indexed and dry-laid to guarantee flawless vein mirroring across walls, columns, and islands.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#b89a62]/10 border border-[#b89a62]/30 flex items-center justify-center text-[#b89a62]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-medium text-[#f1eee7] tracking-wide">
              Flawless Delivery Assurance
            </h4>
            <p className="text-xs text-[#9c978f] font-light leading-relaxed">
              Inspected for structural integrity, zero micro-fractures, and true thickness consistency with custom reinforced crating.
            </p>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM GRADUAL BLUR (Cinematic Depth Transition) */}
      <GradualBlur
        target="parent"
        position="bottom"
        height="8.5rem"
        strength={2.5}
        divCount={6}
        curve="bezier"
        exponential={true}
        opacity={scrollProgress < 0.98 ? 1 : 0.3}
        zIndex={40}
      />

      {/* 6. BOTTOM STATUS / PROMPT / ADVANCE PILL */}
      <div className="absolute bottom-5 z-50 flex items-center gap-3 pointer-events-auto">
        <button
          onClick={navigateToNext}
          className="liquid-glass-pill hover:border-[#b89a62]/80 px-4 py-2 rounded-full inline-flex items-center gap-2.5 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#f1eee7] hover:text-[#f3e5ab] transition-all backdrop-blur-md group shadow-lg"
        >
          <span>
            {scrollProgress >= 0.96 ? 'Continue to Consultation' : `Slab 0${currentSlabIndex} of 05 • Scroll Down`}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#b89a62] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}

export default AurexaSection;
