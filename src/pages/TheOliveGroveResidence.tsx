import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import FullScreenImageViewer from '@/components/FullScreenImageViewer';

const OLIVE_GROVE_IMAGES = [
  {
    id: 1,
    url: '/assets/THE%20OLIVE%20GROVE%20RESIDENCE/1.jpg',
    title: 'The Olive Courtyard Salon',
    category: 'Biophilic Living',
    tag: 'The Olive Grove 01',
    desc: 'Sun-warmed travertine surfaces with living olive trees planted right through the central living volume.',
    index: '01 / 08',
  },
  {
    id: 2,
    url: '/assets/THE%20OLIVE%20GROVE%20RESIDENCE/2.jpg',
    title: 'Terracotta & Live-Edge Forum',
    category: 'Organic Earth',
    tag: 'The Olive Grove 02',
    desc: 'Hand-thrown terracotta pottery and reclaimed live-edge timber softening monolithic stone against the light.',
    index: '02 / 08',
  },
  {
    id: 3,
    url: '/assets/THE%20OLIVE%20GROVE%20RESIDENCE/3.jpg',
    title: 'Plum Velvet & Stone Lounge',
    category: 'Sensory Warmth',
    tag: 'The Olive Grove 03',
    desc: 'Deep plum velvet banquette seating nested into natural limestone niches with circadian atmospheric glow.',
    index: '03 / 08',
  },
  {
    id: 4,
    url: '/assets/THE%20OLIVE%20GROVE%20RESIDENCE/4.jpg',
    title: 'The Courtyard Cloister',
    category: 'Timeless Gathered',
    tag: 'The Olive Grove 04',
    desc: 'A home that feels gathered over time rather than designed all at once — tactile, rooted, and effortlessly peaceful.',
    index: '04 / 08',
  },
  {
    id: 5,
    url: '/assets/THE%20OLIVE%20GROVE%20RESIDENCE/5.jpg',
    title: 'Artisanal Terracotta Detail',
    category: 'Handcrafted Heritage',
    tag: 'The Olive Grove 05',
    desc: 'Bespoke hand-turned earthen ceramics placed to bring Mediterranean warmth into modern living areas.',
    index: '05 / 08',
  },
  {
    id: 6,
    url: '/assets/THE%20OLIVE%20GROVE%20RESIDENCE/6.jpg',
    title: 'Sunlit Dining Veranda',
    category: 'Al Fresco Transition',
    tag: 'The Olive Grove 06',
    desc: 'Floor-level glass dissolving the border between the indoor olive grove and the sun-drenched terrace.',
    index: '06 / 08',
  },
  {
    id: 7,
    url: '/assets/THE%20OLIVE%20GROVE%20RESIDENCE/7.jpg',
    title: 'Travertine Hearth Pavilion',
    category: 'Earth Hearth',
    tag: 'The Olive Grove 07',
    desc: 'Reclaimed timber mantle over rough-hewn travertine, capturing afternoon sun rays across textured plaster.',
    index: '07 / 08',
  },
  {
    id: 8,
    url: '/assets/THE%20OLIVE%20GROVE%20RESIDENCE/8.jpg',
    title: 'Botanical Master Haven',
    category: 'Courtyard Sanctuary',
    tag: 'The Olive Grove 08',
    desc: 'A quiet master suite surrounded by leafy greenery, antique bronze accents, and deep restful plum tones.',
    index: '08 / 08',
  },
];

export function TheOliveGroveResidence() {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBackToCards = () => {
    sessionStorage.setItem('lunore_interior_stage', '4');
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/#interior-cards', { state: { returnToCards: true } });
    }
  };

  return (
    <div className="w-full h-full bg-[#090a0b] text-[#f1eee7] overflow-hidden flex flex-col">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#b89a62]/8 rounded-full blur-[160px] pointer-events-none" />

      {/* Clean Immersive Top Bar */}
      <header className="relative z-30 flex items-center justify-between px-3 sm:px-8 md:px-12 py-2.5 sm:py-4 border-b border-white/10 bg-[#090a0b]/90 backdrop-blur-2xl shrink-0 shadow-lg gap-2">
        {/* Left: Back Link & Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-5 shrink-0">
          <button
            type="button"
            onClick={handleBackToCards}
            className="cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#b89a62]/80 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#f1eee7] transition-all group shadow-sm active:scale-95"
            title="Return to Cards"
            aria-label="Return to Cards"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#b89a62] group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          <Link
            to="/"
            className="hidden sm:flex flex-col group cursor-pointer select-none"
            aria-label="LUNORE Home"
          >
            <span className="font-[var(--font-heading)] text-sm sm:text-lg tracking-[0.22em] uppercase text-[#f1eee7] font-semibold group-hover:text-white transition-colors leading-none">
              LU<span className="text-[#b89a62]">N</span>ORE
            </span>
          </Link>
        </div>

        {/* Center: Domain Category & Title */}
        <div className="flex flex-col items-center text-center min-w-0 px-1">
          <span className="hidden sm:block text-[9px] sm:text-[11px] tracking-[0.28em] uppercase text-[#b89a62] font-semibold truncate max-w-full">
            Project 04 / Sun-Warmed Earth &amp; Courtyard
          </span>
          <h1
            className="text-xs sm:text-base md:text-lg font-normal text-white tracking-wide leading-tight truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The Olive Grove Residence
          </h1>
        </div>

        {/* Right: Scroll Cue & Close Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.22em] uppercase text-[#ded9cf]/70">
            <Sparkles className="w-3.5 h-3.5 text-[#b89a62] animate-pulse" />
            <span>Scroll to explore stack</span>
          </div>
          <button
            type="button"
            onClick={handleBackToCards}
            className="cursor-pointer p-1.5 sm:p-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#b89a62]/80 text-[#ded9cf] hover:text-[#b89a62] transition-all shadow-sm active:scale-95 group"
            title="Close"
            aria-label="Close and return to cards"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </header>

      {/* Main Full-Screen Stacking Canvas */}
      <main className="flex-1 relative overflow-hidden">
        <ScrollStack
          itemDistance={480}
          itemScale={0.035}
          stackPosition="4%"
          className="w-full h-full"
        >
          {OLIVE_GROVE_IMAGES.map((card) => (
            <ScrollStackItem key={card.id}>
              <div 
                onClick={() => setActiveImage(card.url)}
                className="group relative w-full h-[62vh] sm:h-[72vh] md:h-[76vh] rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#161819] to-[#0d0e0f] shadow-[0_30px_90px_rgba(0,0,0,0.95)] select-none cursor-pointer transition-all duration-300 hover:border-[#b89a62]/60"
                role="button"
                tabIndex={0}
                aria-label={`View ${card.title} full screen`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveImage(card.url);
                  }
                }}
              >
                {/* Visual Image Background */}
                <img
                  src={card.url}
                  alt={card.title}
                  loading={card.id <= 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.88] group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out will-change-transform transform-gpu"
                />

                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Subtle Specular Top Border */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b89a62]/60 to-transparent pointer-events-none" />

                {/* Bottom Story Content */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-8 md:p-10 z-20 pointer-events-none">
                  <h2
                    className="text-lg sm:text-3xl md:text-4xl text-white font-normal tracking-wide leading-tight drop-shadow-md"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {card.title}
                  </h2>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </main>

      {/* Pure Full-Screen Image Lightbox Viewer */}
      <FullScreenImageViewer
        src={activeImage}
        alt="The Olive Grove Residence Interior Architecture"
        onClose={() => setActiveImage(null)}
      />
    </div>
  );
}
