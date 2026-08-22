import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
    title: 'Obsidian Figure',
    category: 'Abstract Sculpture',
    material: 'Raw Volcanic Obsidian & Matte Bronze',
    dimensions: '220 × 85 × 60 cm',
    year: '2026',
    edition: 'Unique 1 of 1',
    image: 'https://images.pexels.com/photos/34710655/pexels-photo-34710655.jpeg?auto=compress&cs=tinysrgb&w=800',
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

interface Shard {
  id: number;
  clipPath: string;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
  delay: number;
  duration: number;
}

// Generate realistic crystalline shattered glass polygons with physical downward gravity fall
function generateGlassShards(): Shard[] {
  const triangles = [
    // Top Left & Center
    [[0,0], [25,0], [20,20]],
    [[0,0], [20,20], [0,25]],
    [[25,0], [50,0], [45,28]],
    [[25,0], [20,20], [45,28]],
    [[50,0], [75,0], [55,22]],
    [[50,0], [45,28], [55,22]],
    [[75,0], [100,0], [80,25]],
    [[75,0], [55,22], [80,25]],
    [[100,0], [100,25], [80,25]],

    // Mid Upper
    [[0,25], [20,20], [18,52]],
    [[0,25], [18,52], [0,50]],
    [[20,20], [45,28], [38,48]],
    [[20,20], [18,52], [38,48]],
    [[45,28], [55,22], [50,50]],
    [[45,28], [38,48], [50,50]],
    [[55,22], [80,25], [62,53]],
    [[55,22], [50,50], [62,53]],
    [[80,25], [100,25], [82,48]],
    [[80,25], [62,53], [82,48]],
    [[100,25], [100,50], [82,48]],

    // Mid Lower
    [[0,50], [18,52], [22,78]],
    [[0,50], [22,78], [0,75]],
    [[18,52], [38,48], [42,72]],
    [[18,52], [22,78], [42,72]],
    [[38,48], [50,50], [42,72]],
    [[50,50], [58,77], [42,72]],
    [[50,50], [62,53], [58,77]],
    [[62,53], [82,48], [78,74]],
    [[62,53], [58,77], [78,74]],
    [[82,48], [100,50], [100,75]],
    [[82,48], [78,74], [100,75]],

    // Bottom
    [[0,75], [22,78], [0,100]],
    [[0,100], [22,78], [25,100]],
    [[22,78], [42,72], [25,100]],
    [[25,100], [42,72], [50,100]],
    [[42,72], [58,77], [50,100]],
    [[58,77], [75,100], [50,100]],
    [[58,77], [78,74], [75,100]],
    [[78,74], [100,100], [75,100]],
    [[78,74], [100,75], [100,100]],
  ];

  return triangles.map((tri, i) => {
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
    const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;

    const impactX = 50;
    const impactY = 70;
    const vx = cx - impactX;
    const vy = cy - impactY;
    const dist = Math.sqrt(vx * vx + vy * vy) || 1;

    // Horizontal dispersal
    const angleJitter = (Math.random() - 0.5) * 0.4;
    const normX = (vx / dist) + angleJitter;

    // Gravity pull: shards drop down 1100px - 1500px, tumbling completely off screen
    const horizSpread = normX * (80 + Math.random() * 180);
    const fallDistance = 1100 + (100 - cy) * 6 + Math.random() * 350;

    return {
      id: i,
      clipPath: `polygon(${tri[0][0]}% ${tri[0][1]}%, ${tri[1][0]}% ${tri[1][1]}%, ${tri[2][0]}% ${tri[2][1]}%)`,
      cx,
      cy,
      dx: horizSpread,
      dy: fallDistance,
      rotX: (Math.random() - 0.5) * 140,
      rotY: (Math.random() - 0.5) * 160,
      rotZ: (Math.random() - 0.5) * 90,
      scale: 0.9 + Math.random() * 0.1,
      delay: (dist / 100) * 0.1 + Math.random() * 0.06,
      duration: 1.45 + Math.random() * 0.3,
    };
  });
}

export function SculpturesExperience() {
  const [experienceState, setExperienceState] = useState<'entrance' | 'shattering' | 'active'>('entrance');
  const [rotation, setRotation] = useState<number>(0);
  const [hasShardsExploded, setHasShardsExploded] = useState<boolean>(false);

  const targetRotationRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; rot: number } | null>(null);

  const shards = useMemo(() => generateGlassShards(), []);
  const total = SCULPTURE_CAROUSEL_ITEMS.length;
  const activeIndex = ((Math.round(rotation) % total) + total) % total;

  // Handle "ENTER" Click: Trigger Shatter, Watch Shards Fall Off Completely, Then Pop Out Carousel
  const handleEnterExperience = useCallback(() => {
    if (experienceState !== 'entrance') return;

    setExperienceState('shattering');

    requestAnimationFrame(() => {
      setHasShardsExploded(true);
    });

    // Wait until all glass shards have visibly fallen completely off screen (~1.85s)
    setTimeout(() => {
      setExperienceState('active');
    }, 1850);
  }, [experienceState]);

  // Reset to entrance screen
  const handleResetExperience = useCallback(() => {
    setHasShardsExploded(false);
    setExperienceState('entrance');
    targetRotationRef.current = 0;
    currentRotationRef.current = 0;
    setRotation(0);
  }, []);

  // Continuous physics animation loop when in active carousel
  useEffect(() => {
    if (experienceState !== 'active') return;

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
  }, [experienceState]);

  const handlePrev = useCallback(() => {
    targetRotationRef.current = Math.round(targetRotationRef.current) - 1;
  }, []);

  const handleNext = useCallback(() => {
    targetRotationRef.current = Math.round(targetRotationRef.current) + 1;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (experienceState !== 'active') return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        handleResetExperience();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [experienceState, handlePrev, handleNext, handleResetExperience]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || experienceState !== 'active') return;

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
  }, [experienceState]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (experienceState !== 'active') return;
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
    <section id="projects" className="relative w-full h-screen min-h-[100vh] bg-[#050607] overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC EMPTY VOID BACKGROUND (REVEALED WHEN GLASS FALLS OFF)      */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-[#070809] flex items-center justify-center pointer-events-none">
        <div className="absolute w-[900px] h-[900px] rounded-full bg-gradient-to-b from-[#b89a62]/10 via-transparent to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60" />
      </div>

      {/* ========================================================================= */}
      {/* 2. FULL SCREEN SCULPTURE HERO IMAGE -> SHATTERED GLASS MESH ON ENTER      */}
      {/* ========================================================================= */}
      {experienceState === 'entrance' && (
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <img
            src={images.sculptureHero}
            alt="LUNORE Signature Sculptures Gallery"
            className="w-full h-full object-cover object-center brightness-100 contrast-100"
          />
          {/* Ambient Lighting Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40 pointer-events-none" />
        </div>
      )}

      {experienceState === 'shattering' && (
        <div
          className="absolute inset-0 z-20 overflow-hidden pointer-events-none [perspective:1400px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Shattered Polygons Matrix (VISIBLE THROUGHOUT ENTIRE DOWNWARD FALL) */}
          {shards.map((shard) => (
            <div
              key={shard.id}
              className="absolute inset-0 will-change-transform opacity-100"
              style={{
                clipPath: shard.clipPath,
                WebkitClipPath: shard.clipPath,
                transformOrigin: `${shard.cx}% ${shard.cy}%`,
                transform: hasShardsExploded
                  ? `translate3d(${shard.dx}px, ${shard.dy}px, ${-40 - Math.random() * 80}px) rotateX(${shard.rotX}deg) rotateY(${shard.rotY}deg) rotateZ(${shard.rotZ}deg) scale(${shard.scale})`
                  : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)',
                transition: hasShardsExploded
                  ? `transform ${shard.duration}s cubic-bezier(0.38, 0, 0.75, 0.95) ${shard.delay}s`
                  : 'none',
              }}
            >
              {/* Shard Image Slice */}
              <img
                src={images.sculptureHero}
                alt="Sculpture shard"
                className="w-full h-full object-cover object-center brightness-105"
              />

              {/* Subtle Glass Edge Fracture Highlight */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(184,154,98,0.25) 50%, rgba(255,255,255,0.1) 100%)',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>
          ))}

          {/* Smooth Soft Impact Flash Shockwave */}
          <div
            className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
            style={{
              width: '140px',
              height: '140px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(184,154,98,0.5) 45%, transparent 75%)',
              animation: 'shockwave-expand 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ENTRANCE UI OVERLAY ("EXPERIENCE THE SCULPTURES" & TRANSPARENT "ENTER") */}
      {/* ========================================================================= */}
      {experienceState === 'entrance' && (
        <div className="absolute inset-0 z-30 flex flex-col justify-between items-center p-6 sm:p-10 md:p-14 text-center select-none bg-black/20 backdrop-blur-[0.5px]">
          
          {/* Top Arch Positioned Headline (One Single Line) */}
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
              {/* Top Glass Specular Line */}
              <span className="absolute inset-x-5 top-0 h-[1.2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              
              {/* Ambient Glow Aura */}
              <span className="absolute inset-0 rounded-full border border-[#b89a62]/30 animate-ping opacity-20 pointer-events-none" />

              {/* Icon Container */}
              <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white/[0.08] border border-white/30 group-hover:border-[#b89a62]/80 flex items-center justify-center text-[#b89a62] group-hover:rotate-45 transition-transform duration-500 shadow-[0_0_12px_rgba(184,154,98,0.3)]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              {/* Bright Crisp High-Contrast Text */}
              <span className="text-xs sm:text-sm tracking-[0.32em] uppercase font-semibold text-[#f1eee7] group-hover:text-[#b89a62] transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Enter
              </span>

              <ArrowRight className="w-3.5 h-3.5 text-[#b89a62] transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. 3D CAROUSEL POP-OUT ENTRANCE & FULL SCREEN INTERACTIVE EXPERIENCE       */}
      {/* ========================================================================= */}
      {experienceState === 'active' && (
        <div
          className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 z-30 select-none transition-all duration-700"
          style={{
            animation: 'carousel-pop-out 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* Top Bar Controls & Status */}
          <div className="flex items-center justify-between w-full relative z-40 max-w-7xl mx-auto">
            {/* Left empty spacer for balanced centering */}
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
              title="Replay shattered glass entrance"
              aria-label="Replay entrance experience"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#b89a62] group-hover:-rotate-90 transition-transform duration-400" />
              <span className="hidden sm:inline">Reset Experience</span>
            </button>
          </div>

          {/* 3D OUTWARD CURVED LIQUID GLASS CAROUSEL (PANORAMIC CYLINDRICAL RIBBON) */}
          <div
            ref={stageRef}
            data-lenis-prevent="true"
            className="relative w-full flex-1 flex items-center justify-center my-1 sm:my-2 overflow-visible [perspective:1400px]"
          >
            <div className="relative w-full h-full max-h-[480px] sm:max-h-[540px] md:max-h-[600px] flex items-center justify-center [transform-style:preserve-3d]">
              {SCULPTURE_CAROUSEL_ITEMS.map((item, index) => {
                const totalCount = SCULPTURE_CAROUSEL_ITEMS.length;
                let diff = (index - (rotation % totalCount)) % totalCount;
                if (diff > totalCount / 2) diff -= totalCount;
                if (diff < -totalCount / 2) diff += totalCount;

                const isCenter = Math.abs(diff) < 0.45;
                const isVisible = Math.abs(diff) <= 3.2; // Smooth 7-card continuous stream

                // Outward (Convex) Curved Panoramic Geometry
                const radius = 820;
                const angleDeg = diff * 23;
                const angleRad = (angleDeg * Math.PI) / 180;

                const translateX = radius * Math.sin(angleRad);
                const translateZ = radius * (Math.cos(angleRad) - 1) + 45;
                // Outward rotation: left cards angle left-forward, right cards angle right-forward
                const rotateY = angleDeg * 0.95;
                const scale = Math.max(0.78, 1 - Math.abs(diff) * 0.05);
                const opacity = isVisible ? Math.max(0.15, 1 - Math.pow(Math.abs(diff) / 3.2, 1.8)) : 0;
                const zIndex = Math.round(30 - Math.abs(diff) * 8);

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
                    className={`absolute w-[260px] sm:w-[300px] md:w-[340px] lg:w-[370px] h-[390px] sm:h-[450px] md:h-[500px] lg:h-[540px] rounded-2xl cursor-pointer select-none transition-shadow duration-300 ${
                      isCenter
                        ? 'shadow-[0_30px_75px_rgba(0,0,0,0.9),0_0_40px_rgba(184,154,98,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.6)] border border-white/60'
                        : 'shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.35)] border border-white/30 hover:border-white/50'
                    }`}
                  >
                    {/* PURE LIQUID GLASS PANEL WITH SCULPTURE IMAGE */}
                    <div className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.08)_100%)] p-3 sm:p-4 flex flex-col items-center justify-center">
                      
                      {/* Top Specular White Edge Glow */}
                      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-10" />
                      
                      {/* Inner Glass Viewport Frame with Sculpture Image */}
                      <div className="relative w-full h-full rounded-xl border border-white/25 bg-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden">
                        {/* Sculpture Artwork Image */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center brightness-95 contrast-105 pointer-events-none transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />

                        {/* Liquid Glass Overlay Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.08] pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />
                        
                        {/* Center Ambient Gold Hue for Active Card */}
                        {isCenter && (
                          <div className="absolute -bottom-8 inset-x-0 h-24 bg-gradient-to-t from-[#b89a62]/25 to-transparent pointer-events-none" />
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          {/* Bottom Navigation & Controls */}
          <div className="flex items-center justify-between w-full relative z-40 pt-2 max-w-7xl mx-auto">
            
            {/* Left Prev Arrow Button */}
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

            {/* Right Next Arrow Button */}
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

        </div>
      )}

    </section>
  );
}
