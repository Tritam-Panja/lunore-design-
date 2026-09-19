import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
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
    name: 'Calacatta Gold Italian Marble',
    category: 'High-Luxe Calacatta',
    origin: 'Carrara, Italy',
    finish: 'Bookmatched Polish / Honed',
    idealFor: 'Grand Master Suites, Island Cascades & Luxury Lobbies',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=compress&cs=tinysrgb&w=1600&q=80',
    description: 'Iconic crystalline milk-white ground traced with dramatic honey-gold branching, smoky taupe accents, and rich grey striations.',
  },
  {
    id: '02',
    name: 'Patagonia Translucent Quartzite',
    category: 'Exotic Gemstone Quartzite',
    origin: 'Bahia, Brazil',
    finish: 'Mirror Polish / Backlit LED Ready',
    idealFor: 'Backlit Bar Counters, Double-Height Feature Walls & Focal Panels',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=compress&cs=tinysrgb&w=1600&q=80',
    description: 'A geological wonder blending translucent quartz crystals, deep feldspar deposits, and obsidian-black crystalline clouds.',
  },
  {
    id: '03',
    name: 'Statuario Extra Statuary Marble',
    category: 'Monolithic Sculptural Marble',
    origin: 'Carrara, Tuscany, Italy',
    finish: 'High-Lustre Italian Polish',
    idealFor: 'Formal Reception Halls, Monolithic Bath Vanities & Sweeping Staircases',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=compress&cs=tinysrgb&w=1600&q=80',
    description: 'The pinnacle of Italian stone heritage featuring brilliant snowy-white depth interrupted only by bold, expressive pewter branching.',
  },
  {
    id: '04',
    name: 'Black Taurus Cosmic Granite',
    category: 'Monumental Deep Granite',
    origin: 'Minas Gerais, Brazil',
    finish: 'Leathered / High Gloss Satin',
    idealFor: 'Executive Boardrooms, Chef Kitchen Islands & Monolithic Cladding',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=compress&cs=tinysrgb&w=1600&q=80',
    description: 'Deep pitch-black geological bed swept with volcanic gold waves, amber rivers, and luminous ivory striations.',
  },
  {
    id: '05',
    name: 'Verde Alpi Emerald Marble',
    category: 'Alpine Serpentine Marble',
    origin: 'Aosta Valley, Italian Alps',
    finish: 'Velvet Honed / Silk Polish',
    idealFor: 'Boutique Powder Rooms, Private Libraries & Architectural Fireplaces',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=compress&cs=tinysrgb&w=1600&q=80',
    description: 'Dramatic deep forest and bottle-green hues intertwined with crisp white calcite ribbons and ancient mineral deposits.',
  },
  {
    id: '06',
    name: 'Titanium Black Satin Granite',
    category: 'Architectural Heavy Granite',
    origin: 'Espírito Santo, Brazil',
    finish: 'Brushed Antique / Flamed / Polished',
    idealFor: 'Heavy-Traffic Commercial Flooring, Exterior Elevations & Terraces',
    image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=compress&cs=tinysrgb&w=1600&q=80',
    description: 'Deep slate-black granite defined by striking silver swirls, platinum highlights, and subtle gold quartz veining.',
  },
  {
    id: '07',
    name: 'Botticino Classico Heritage Marble',
    category: 'Warm Mediterranean Marble',
    origin: 'Brescia, Lombardy, Italy',
    finish: 'Honed / Soft Silk Polish',
    idealFor: 'Expansive Villa Flooring, Classical Columns & Sunlit Living Salons',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=compress&cs=tinysrgb&w=1600&q=80',
    description: 'Warm cream-beige base with delicate golden streaks and gentle hazelnut clouds, providing serene and timeless elegance.',
  },
  {
    id: '08',
    name: 'Portoro Gold Nero Marble',
    category: 'Royal Polychrome Marble',
    origin: 'La Spezia, Liguria, Italy',
    finish: 'Ultra-High Gloss Polish',
    idealFor: 'Haute Horlogerie Boutiques, Dining Ensembles & Bespoke Inlay Artwork',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=compress&cs=tinysrgb&w=1600&q=80',
    description: 'Intense obsidian-black limestone laced with vibrant undulating veins of bright gold and pyrite crystallization.',
  },
  {
    id: '09',
    name: 'Azul Macaubas Celestial Quartzite',
    category: 'Rare Natural Blue Quartzite',
    origin: 'Macaúbas, Bahia, Brazil',
    finish: 'Mirror Polish / Bookmatched',
    idealFor: 'Infinity Spa Enclosures, Luxury Yacht Salons & Statement Counters',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=compress&cs=tinysrgb&w=1600&q=80',
    description: 'One of the rarest natural stones on Earth, characterized by mesmerizing waves of cobalt, sky blue, and shimmering quartz.',
  },
  {
    id: '10',
    name: 'Arabescato Orobico Grigio Marble',
    category: 'Dynamic Veined Calcite Marble',
    origin: 'Bergamo, Lombardy, Italy',
    finish: 'Bookmatched Polish / Satin',
    idealFor: 'Penthouse Atriums, Entrance Foyers & Monolithic Gallery Walls',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=compress&cs=tinysrgb&w=1600&q=80',
    description: 'An evocative tapestry of dove greys, anthracite, and warm ochre ribbons that create dramatic optical symmetry.',
  },
];

interface MarbleStackModalProps {
  onClose: () => void;
}

export function MarbleStackModal({ onClose }: MarbleStackModalProps) {
  const navigate = useNavigate();

  // Handle ESC key press and lock background page scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const handleContactClick = () => {
    onClose();
    navigate('/contact');
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Lunore Marble and Granite Stack Showcase"
      data-lenis-prevent="true"
      className="fixed inset-0 z-[100000] flex flex-col bg-[#070809] text-[#f1eee7] select-none overflow-hidden h-[100dvh] animate-in fade-in duration-250"
    >
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-[radial-gradient(circle,rgba(184,154,98,0.12)_0%,transparent_70%)] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] blur-[130px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
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
          itemDistance={380}
          itemScale={0.038}
          stackPosition="6%"
          useWindowScroll={false}
          className="w-full h-full"
          footer={
            <div className="max-w-4xl mx-auto px-4 text-center select-none">
              <div className="p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-black/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#b89a62] to-transparent" />
                <div className="w-10 h-10 rounded-full bg-[#b89a62]/20 border border-[#b89a62]/40 flex items-center justify-center text-[#b89a62] mx-auto mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#b89a62] font-semibold block mb-2">
                  Bespoke Architectural Supply
                </span>
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl text-white font-normal tracking-wide mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Looking for Specific Slabs or Custom Sizing?
                </h3>
                <p className="text-xs sm:text-sm text-[#ded9cf]/85 font-light leading-relaxed max-w-xl mx-auto mb-8">
                  Every slab in our collection is hand-inspected at the quarry for purity, veining integrity, and exact architectural tolerances. Contact our studio for private viewings and tailored project specifications.
                </p>

                {/* The requested "Contact Us for More" button */}
                <button
                  onClick={handleContactClick}
                  className="group relative cursor-pointer inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#b89a62] via-[#cfb27b] to-[#b89a62] text-[#0d0e0e] font-semibold shadow-[0_12px_32px_rgba(184,154,98,0.45)] hover:shadow-[0_16px_45px_rgba(184,154,98,0.65)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span className="text-xs sm:text-sm tracking-[0.24em] uppercase font-bold text-[#0d0e0e]">
                    Contact Us for More
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#0d0e0e] transition-transform duration-300 group-hover:translate-x-1" />
                </button>
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
              Scroll down to peel through 10 of our most sought-after natural stones. Each piece represents uncompromising geological rarity and craftsmanship.
            </p>
          </div>

          {/* 10 Precision Stack Cards */}
          {MARBLE_COLLECTION_ITEMS.map((item, index) => (
            <ScrollStackItem
              key={item.id}
              itemClassName="max-w-5xl mx-auto h-[62vh] sm:h-[70vh] max-h-[580px] min-h-[380px]"
            >
              <div className="relative w-full h-full rounded-2xl sm:rounded-[32px] overflow-hidden border border-white/15 bg-[#0e1011] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(0,0,0,0.8)] group select-none flex flex-col justify-end p-6 sm:p-8 md:p-10">
                {/* Background Full-Bleed Image */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.7)_100%)]" />
                </div>

                {/* Top Specular Edge */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#b89a62] to-transparent z-10" />

                {/* Card Bottom: Name & Description */}
                <div className="relative z-10 max-w-3xl">
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
    </div>,
    document.body
  );
}

export default MarbleStackModal;
