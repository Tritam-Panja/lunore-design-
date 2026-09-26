import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { ScrollStack, ScrollStackItem } from './ScrollStack';

export interface StoneItem {
  id: string;
  name: string;
  category: string;
  origin: string;
  finish: string;
  idealFor: string;
  image: string;
  description: string;
}

export const MARBLE_COLLECTION_ITEMS: StoneItem[] = [
  {
    id: '01',
    name: 'Avocado Green',
    category: 'Exotic Quartzite',
    origin: 'Bahia, Brazil',
    finish: 'Bookmatched Polish / Leathered',
    idealFor: 'Statement Islands, Master Baths & Feature Elevations',
    image: encodeURI('/assets/Marbles/Avocado Green.jpeg'),
    description: 'Lush olive and pistachio bedrock swept with vivid crystalline quartz veining, emerald ribbons, and rich mineral depth.',
  },
  {
    id: '02',
    name: 'Cippo Fantasy',
    category: 'Dynamic Veined Marble',
    origin: 'Carrara, Italy',
    finish: 'Bookmatched Polish / Honed',
    idealFor: 'Grand Foyers, Bookmatched Slabs & Accent Architecture',
    image: encodeURI('/assets/Marbles/CIPPO FANTASY.jpeg'),
    description: 'Sinuous rhythmic currents of warm earth, smoky taupe, and soft ivory ribbons that evoke kinetic natural artistry.',
  },
  {
    id: '03',
    name: 'Cosmic Fantasy Polish',
    category: 'Monumental Deep Granite',
    origin: 'Minas Gerais, Brazil',
    finish: 'High-Lustre Mirror Polish',
    idealFor: 'Executive Suites, Architectural Countertops & Monolithic Cascades',
    image: encodeURI('/assets/Marbles/COSMIC FANTASY POLISH .jpeg'),
    description: 'A stellar dark nightscape swept with celestial golden magma rivers, shimmering quartz crystals, and deep bronze accents.',
  },
  {
    id: '04',
    name: 'Exotic Green',
    category: 'Alpine Serpentine Marble',
    origin: 'Aosta Valley, Italian Alps',
    finish: 'Mirror Polish / Velvet Honed',
    idealFor: 'Boutique Powder Rooms, Private Libraries & Statement Bars',
    image: encodeURI('/assets/Marbles/EXOTIC GREEN .jpeg'),
    description: 'Deep forest and emerald greens laced with delicate white calcite ribbons and intricate crystalline mineral formations.',
  },
  {
    id: '05',
    name: 'Ice Onyx',
    category: 'Translucent Gemstone Onyx',
    origin: 'Tuscany, Italy',
    finish: 'Mirror Polish / Backlit LED Ready',
    idealFor: 'Backlit Bar Counters, Luminous Partitions & Monolithic Spas',
    image: encodeURI('/assets/Marbles/Ice Onyx.jpeg'),
    description: 'Pristine glacial translucency enriched by subtle frost-like crystalline strata, glowing with breathtaking ethereal radiance when backlit.',
  },
  {
    id: '06',
    name: 'Lava Black Polish',
    category: 'Volcanic Heavy Granite',
    origin: 'Espírito Santo, Brazil',
    finish: 'High Gloss Polish / Satin',
    idealFor: 'Monolithic Kitchen Islands, Fireplace Surrounds & Cladding',
    image: encodeURI('/assets/Marbles/LAVA BLACK POLISH.jpeg'),
    description: 'Volcanic obsidian bedrock electrified by energetic molten gold currents, silver platinum highlights, and deep basalt textures.',
  },
  {
    id: '07',
    name: 'Luxury Black',
    category: 'Monolithic Calcite Marble',
    origin: 'Carrara, Italy',
    finish: 'Ultra-High Gloss Polish',
    idealFor: 'Double-Height Atriums, Luxury Dining Tables & Modernist Elevations',
    image: encodeURI('/assets/Marbles/LUXURY BLACK.jpeg'),
    description: 'Deep velvety pitch-black depth defined by crisp, elegant architectural veining and subtle graphite crystallization.',
  },
  {
    id: '08',
    name: 'Marine Black Patagonia',
    category: 'Exotic Gemstone Quartzite',
    origin: 'Bahia, Brazil',
    finish: 'Bookmatched Mirror Polish',
    idealFor: 'Double-Height Feature Walls, Monolithic Islands & Signature Vanities',
    image: encodeURI('/assets/Marbles/Marine Black Patagonia.jpeg'),
    description: 'A striking geological fusion of dark oceanic pigments, smoky translucent feldspar clusters, and bold architectural fissures.',
  },
  {
    id: '09',
    name: 'Rainforest Brown',
    category: 'Serpentine Exotic Stone',
    origin: 'Rajasthan, India',
    finish: 'Leathered Antique / High Polish',
    idealFor: 'Private Study Cladding, Master Bath Vanities & Gallery Walls',
    image: encodeURI('/assets/Marbles/RAINFOREST BROWN .jpeg'),
    description: 'An evocative tapestry of rich cocoa and russet tones interwoven with a dramatic labyrinth of dark tree-like veining.',
  },
  {
    id: '10',
    name: 'Red Jasper Polish',
    category: 'Precious Gemstone Granite',
    origin: 'Minas Gerais, Brazil',
    finish: 'Brilliant Diamond Polish',
    idealFor: 'Haute Horlogerie Foyers, Statement Reception Counters & Art Inlays',
    image: encodeURI('/assets/Marbles/RED JASPER POLISH.jpeg'),
    description: 'Vibrant terracotta and fiery crimson jasper formations enriched by undulating breccia patterns and warm golden quartz highlights.',
  },
];

interface MarbleStackModalProps {
  onClose: () => void;
}

export function MarbleStackModal({ onClose }: MarbleStackModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle ESC key press and lock background page scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedImage) {
          setSelectedImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, selectedImage]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Lunore Marble and Granite Stack Showcase"
      data-lenis-prevent="true"
      className="fixed inset-0 z-[100000] flex flex-col bg-[#070809] text-[#f1eee7] select-none overflow-hidden h-[100dvh] animate-in fade-in duration-250"
    >
      {/* Ambient background glow (optimized for mobile) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transform-gpu">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[900px] h-[360px] sm:h-[900px] rounded-full bg-[radial-gradient(circle,rgba(184,154,98,0.16)_0%,transparent_70%)] blur-[40px] sm:blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[700px] h-[300px] sm:h-[700px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] blur-[35px] sm:blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
      </div>

      {/* Top Specular Gold Edge */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#b89a62] to-transparent z-50" />

      {/* Top Header Bar */}
      <header className="shrink-0 w-full border-b border-white/10 bg-[#070809]/80 backdrop-blur-xl z-50 px-4 sm:px-8 py-3.5 sm:py-4.5 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-[#b89a62]/40 flex items-center justify-center text-[#b89a62]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#b89a62] font-semibold block leading-tight">
              Lunore Atelier
            </span>
            <h2
              className="text-sm sm:text-base md:text-lg text-white font-normal tracking-wider leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Marble &amp; Granite Archive
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-block text-[11px] tracking-[0.2em] uppercase text-[#88857f]">
            10 Curated Specimens
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer liquid-glass-pill hover:border-[#b89a62]/80 hover:text-[#b89a62] px-3 sm:px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#f1eee7] transition-all group shadow-md"
            title="Close Stack View (Esc)"
            aria-label="Close Stack View"
          >
            <X className="w-4 h-4 text-[#b89a62] group-hover:rotate-90 transition-transform duration-300" />
            <span>Close</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Scroll Stack Canvas */}
      <main className="flex-1 w-full relative min-h-0 overflow-hidden">
        <ScrollStack
          itemDistance={isMobile ? 260 : 380}
          itemScale={isMobile ? 0.032 : 0.038}
          stackPosition={isMobile ? '4%' : '6%'}
          useWindowScroll={false}
          className="w-full h-full"
          footer={
            <div className="max-w-4xl mx-auto px-4 text-center select-none">
              <div className="p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-black/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#b89a62] to-transparent" />

                <h3
                  className="text-2xl sm:text-3xl md:text-4xl text-white font-normal tracking-wide mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Looking for Specific Slabs or Custom Sizing?
                </h3>
                <p className="text-xs sm:text-sm text-[#ded9cf]/85 font-light leading-relaxed max-w-xl mx-auto mb-8">
                  Every slab in our collection is hand-inspected at the quarry for purity, veining integrity, and exact architectural tolerances. Contact our studio for private viewings and tailored project specifications.
                </p>

                {/* WhatsApp redirect button */}
                <a
                  href={`https://wa.me/919769708628?text=${encodeURIComponent(
                    "Hello Lunore Studio, I am interested in your marble and granite collection. I would like to inquire about slab availability and tailored project specifications."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative cursor-pointer inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#b89a62] via-[#cfb27b] to-[#b89a62] text-[#0d0e0e] font-semibold shadow-[0_12px_32px_rgba(184,154,98,0.45)] hover:shadow-[0_16px_45px_rgba(184,154,98,0.65)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span className="text-xs sm:text-sm tracking-[0.24em] uppercase font-bold text-[#0d0e0e]">
                    Contact Us for More
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#0d0e0e] transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          }
        >
          {/* Top Intro Section within Scroll Area */}
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 pt-4 px-4 select-none">
            <h1
              className="text-2xl sm:text-4xl md:text-5xl text-white font-normal tracking-wide mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Masterpiece Marble &amp; Granite
            </h1>
            <p className="text-xs sm:text-sm text-[#ded9cf]/80 font-light leading-relaxed max-w-2xl mx-auto">
              Scroll down to peel through 10 of our most sought-after natural stones. Click on any stone to view in full screen.
            </p>
          </div>

          {/* 10 Precision Stack Cards */}
          {MARBLE_COLLECTION_ITEMS.map((item, index) => (
            <ScrollStackItem
              key={item.id}
              itemClassName="max-w-5xl mx-auto h-[58dvh] sm:h-[70vh] max-h-[580px] min-h-[340px]"
            >
              <div
                onClick={() => setSelectedImage(item.image)}
                title="Click to view full screen"
                className="relative w-full h-full rounded-2xl sm:rounded-[32px] overflow-hidden border border-white/20 bg-[#121416] shadow-[0_16px_40px_rgba(0,0,0,0.85)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(0,0,0,0.6)] group select-none flex flex-col justify-end p-5 sm:p-8 md:p-10 cursor-zoom-in transition-[border-color,box-shadow] duration-300 sm:hover:border-[#b89a62]/50 sm:hover:shadow-[0_25px_65px_rgba(0,0,0,0.9),0_0_35px_rgba(184,154,98,0.25)] touch-pan-y"
              >
                {/* Background Full-Bleed Image (lightened up) */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02] sm:group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Lightened, natural gradient solely for bottom text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.25)_100%)] pointer-events-none" />
                </div>

                {/* Top Specular Edge */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#b89a62] to-transparent z-10" />

                {/* Card Bottom: Name & Description */}
                <div className="relative z-10 max-w-3xl pointer-events-none">
                  <h3
                    className="text-xl sm:text-3xl md:text-4xl text-white font-normal tracking-wide mb-2.5 leading-snug drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#ded9cf]/90 font-light leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3 drop-shadow-md">
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </main>

      {/* Pure Fullscreen Image Viewer: "just the image nothing else" */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen Marble Specimen"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[200000] bg-black/95 backdrop-blur-md flex items-center justify-center cursor-zoom-out select-none animate-in fade-in duration-200"
        >
          <img
            src={selectedImage}
            alt="Fullscreen Marble"
            className="w-full h-full object-contain p-2 sm:p-4 pointer-events-none"
          />
        </div>
      )}
    </div>,
    document.body
  );
}

export default MarbleStackModal;
