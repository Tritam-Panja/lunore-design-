import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import ScrollShowcase from '@/components/ScrollShowcase';
import FullScreenImageViewer from '@/components/FullScreenImageViewer';

const AMBER_OLIVE_IMAGES = [
  {
    id: 1,
    url: '/assets/AMBER%20&%20OLIVE/1.jpg',
    title: 'The Golden Hour Salon',
    category: 'Atmospheric Light',
    tag: 'Amber & Olive 01',
    desc: "Bathed in Mumbai's warm late-afternoon glow with fluted walnut wall joinery and bespoke rattan dialogue.",
    index: '01 / 08',
  },
  {
    id: 2,
    url: '/assets/AMBER%20&%20OLIVE/2.jpg',
    title: 'Walnut & Brass Living Gallery',
    category: 'Material Texture',
    tag: 'Amber & Olive 02',
    desc: 'Soft olive upholstery paired with brushed champagne brass details and warm fluted timber boiserie.',
    index: '02 / 08',
  },
  {
    id: 3,
    url: '/assets/AMBER%20&%20OLIVE/3.jpg',
    title: 'Marble & Timber Dining Panorama',
    category: 'Harmonious Form',
    tag: 'Amber & Olive 03',
    desc: 'Vein-matched marble island transitioning seamlessly into a dining platform that greets the evening sunset.',
    index: '03 / 08',
  },
  {
    id: 4,
    url: '/assets/AMBER%20&%20OLIVE/4.jpg',
    title: 'Skyline Master Chamber',
    category: 'Panoramic Sanctuary',
    tag: 'Amber & Olive 04',
    desc: 'Floor-to-ceiling skyline apertures keeping the horizon as the true visual centerpiece from dawn to dusk.',
    index: '04 / 08',
  },
  {
    id: 5,
    url: '/assets/AMBER%20&%20OLIVE/5.jpg',
    title: 'Fluted Boiserie Detail',
    category: 'Artisanal Joinery',
    tag: 'Amber & Olive 05',
    desc: 'Vertical fluted wood profiles catching directional warm light, creating tactile depth throughout the corridor.',
    index: '05 / 08',
  },
  {
    id: 6,
    url: '/assets/AMBER%20&%20OLIVE/6.jpg',
    title: 'Curated Lounge Alcove',
    category: 'Intimate Gathering',
    tag: 'Amber & Olive 06',
    desc: 'Deep warm olive tones softened by amber accent illumination and tailored custom seating.',
    index: '06 / 08',
  },
  {
    id: 7,
    url: '/assets/AMBER%20&%20OLIVE/7.jpg',
    title: 'Dusk Cocktail Bar',
    category: 'Hospitality Stature',
    tag: 'Amber & Olive 07',
    desc: 'Backlit amber stone bar front with antiqued brass and integrated circadian evening warmth.',
    index: '07 / 08',
  },
  {
    id: 8,
    url: '/assets/AMBER%20&%20OLIVE/8.jpg',
    title: 'Twilight Vista Horizon',
    category: 'Mumbai Golden Hour',
    tag: 'Amber & Olive 08',
    desc: 'Where the interior warmth extends out into the city lights, providing seamless luxury day and night.',
    index: '08 / 08',
  },
];

export function AmberAndOlive() {
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
            Project 02 / Warm Golden-Hour Textures
          </span>
          <h1
            className="text-xs sm:text-base md:text-lg font-normal text-white tracking-wide leading-tight truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Amber &amp; Olive
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

      {/* Main Full-Screen Scroll-Driven Showcase */}
      <main className="flex-1 relative overflow-hidden">
        <ScrollShowcase
          items={AMBER_OLIVE_IMAGES}
          projectTitle="Amber & Olive"
          projectTag="Project 02 / Warm Golden-Hour Textures"
          nextProject={{ title: 'Clay & Sage', path: '/clay-and-sage' }}
          onItemClick={(item) => setActiveImage(item.url)}
          className="w-full h-full"
        />
      </main>

      {/* Pure Full-Screen Image Lightbox Viewer */}
      <FullScreenImageViewer
        src={activeImage}
        alt="Amber & Olive Interior Architecture"
        onClose={() => setActiveImage(null)}
      />
    </div>
  );
}
