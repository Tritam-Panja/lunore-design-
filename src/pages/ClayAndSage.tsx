import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import FullScreenImageViewer from '@/components/FullScreenImageViewer';

const CLAY_SAGE_IMAGES = [
  {
    id: 1,
    url: '/assets/CLAY%20&%20SAGE/1.jpg',
    title: 'Terracotta & Glazed Sage Culinary Forum',
    category: 'Kitchen-Garden Soul',
    tag: 'Clay & Sage 01',
    desc: 'Warm terracotta cabinetry and hand-glazed green tile paired with natural travertine surfaces for a coastal villa feel.',
    index: '01 / 08',
  },
  {
    id: 2,
    url: '/assets/CLAY%20&%20SAGE/2.jpg',
    title: 'Curved Organic Living Salon',
    category: 'Sculptural Comfort',
    tag: 'Clay & Sage 02',
    desc: 'Soft, curved furniture in muted sage tones with woven natural rugs and ambient rattan pendant lights.',
    index: '02 / 08',
  },
  {
    id: 3,
    url: '/assets/CLAY%20&%20SAGE/3.jpg',
    title: 'Travertine Dressing Gallery',
    category: 'Seamless Transition',
    tag: 'Clay & Sage 03',
    desc: 'The same warm earthy palette carried continuously from living spaces into custom bespoke walk-in cabinetry.',
    index: '03 / 08',
  },
  {
    id: 4,
    url: '/assets/CLAY%20&%20SAGE/4.jpg',
    title: 'The Coastal Veranda Chamber',
    category: 'Artisanal Elegance',
    tag: 'Clay & Sage 04',
    desc: 'Considered without feeling formal — tactile earth tones, diffuse garden illumination, and organic textures.',
    index: '04 / 08',
  },
  {
    id: 5,
    url: '/assets/CLAY%20&%20SAGE/5.jpg',
    title: 'Hand-Glazed Ceramic Detail',
    category: 'Textured Surface',
    tag: 'Clay & Sage 05',
    desc: 'Subtle variations in green glaze catching the afternoon sun, reflecting coastal serenity inside.',
    index: '05 / 08',
  },
  {
    id: 6,
    url: '/assets/CLAY%20&%20SAGE/6.jpg',
    title: 'Woven Rattan Reading Corner',
    category: 'Gentle Warmth',
    tag: 'Clay & Sage 06',
    desc: 'Natural woven fibers and curved lime plaster providing quiet tactile comfort for thoughtful moments.',
    index: '06 / 08',
  },
  {
    id: 7,
    url: '/assets/CLAY%20&%20SAGE/7.jpg',
    title: 'Terracotta Dining Niche',
    category: 'Gathered Together',
    tag: 'Clay & Sage 07',
    desc: 'Sunlit dining setting surrounded by earthy clays, honest woods, and relaxed coastal simplicity.',
    index: '07 / 08',
  },
  {
    id: 8,
    url: '/assets/CLAY%20&%20SAGE/8.jpg',
    title: 'The Sage Serenity Suite',
    category: 'Quiet Haven',
    tag: 'Clay & Sage 08',
    desc: 'Curved silhouettes and muted sage upholstery delivering effortless elegance and soothing warmth.',
    index: '08 / 08',
  },
];

export function ClayAndSage() {
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
            Project 05 / Coastal Villa Earth Palette
          </span>
          <h1
            className="text-xs sm:text-base md:text-lg font-normal text-white tracking-wide leading-tight truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Clay &amp; Sage
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
          {CLAY_SAGE_IMAGES.map((card) => (
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
        alt="Clay & Sage Interior Architecture"
        onClose={() => setActiveImage(null)}
      />
    </div>
  );
}
