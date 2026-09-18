import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import ScrollShowcase from '@/components/ScrollShowcase';
import FullScreenImageViewer from '@/components/FullScreenImageViewer';

const SKYLINE_RESIDENCE_IMAGES = [
  {
    id: 1,
    url: '/assets/THE%20SKYLINE%20RESIDENCE/1.jpg',
    title: 'Horizon Panorama Living',
    category: 'Skyline Architecture',
    tag: 'The Skyline Residence 01',
    desc: 'Floor-to-ceiling glass opening onto the Mumbai cityscape, where natural light and warm walnut paneling meet.',
    index: '01 / 08',
  },
  {
    id: 2,
    url: '/assets/THE%20SKYLINE%20RESIDENCE/2.jpg',
    title: 'Fluted Timber & Marble Forum',
    category: 'Material Dialogue',
    tag: 'The Skyline Residence 02',
    desc: 'Fluted timber, silver travertine, and natural rattan sitting comfortably together in continuous harmony.',
    index: '02 / 08',
  },
  {
    id: 3,
    url: '/assets/THE%20SKYLINE%20RESIDENCE/3.jpg',
    title: 'The Sunset Dining Suite',
    category: 'Atmospheric Gathering',
    tag: 'The Skyline Residence 03',
    desc: 'Oriented to capture the evening golden hour with warm brass fixtures and acoustic fabric boiserie.',
    index: '03 / 08',
  },
  {
    id: 4,
    url: '/assets/THE%20SKYLINE%20RESIDENCE/4.jpg',
    title: 'Skyline Master Pavilion',
    category: 'Quiet Refuge',
    tag: 'The Skyline Residence 04',
    desc: 'A calm residential haven elevated above the city noise, with concealed tech and seamless acoustic isolation.',
    index: '04 / 08',
  },
  {
    id: 5,
    url: '/assets/THE%20SKYLINE%20RESIDENCE/5.jpg',
    title: 'Travertine Reception Gallery',
    category: 'Monolithic Stone',
    tag: 'The Skyline Residence 05',
    desc: 'Vein-matched travertine centerpiece setting an immediate impression of architectural permanence.',
    index: '05 / 08',
  },
  {
    id: 6,
    url: '/assets/THE%20SKYLINE%20RESIDENCE/6.jpg',
    title: 'Acoustic Study & Private Forum',
    category: 'Thoughtful Workspaces',
    tag: 'The Skyline Residence 06',
    desc: 'Integrated hidden cabling and bespoke acoustic wall boiserie tailored for executive focus.',
    index: '06 / 08',
  },
  {
    id: 7,
    url: '/assets/THE%20SKYLINE%20RESIDENCE/7.jpg',
    title: 'Night Sky Lounge Aperture',
    category: 'City Stature',
    tag: 'The Skyline Residence 07',
    desc: 'Floor-to-ceiling panoramic perspectives capturing the dynamic energy of Mumbai at night.',
    index: '07 / 08',
  },
  {
    id: 8,
    url: '/assets/THE%20SKYLINE%20RESIDENCE/8.jpg',
    title: 'The Skyline Master Bath & Spa',
    category: 'Private Wellness',
    tag: 'The Skyline Residence 08',
    desc: 'Monolithic stone vanities and soft ambient cove light for serene end-of-day unwinding.',
    index: '08 / 08',
  },
];

export function TheSkylineResidence() {
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
            Project 03 / Panoramic Skyline Architecture
          </span>
          <h1
            className="text-xs sm:text-base md:text-lg font-normal text-white tracking-wide leading-tight truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The Skyline Residence
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
          items={SKYLINE_RESIDENCE_IMAGES}
          projectTitle="The Skyline Residence"
          projectTag="Project 04 / Monolithic Penthouse Horizon"
          nextProject={{ title: 'The Olive Grove Residence', path: '/the-olive-grove-residence' }}
          onItemClick={(item) => setActiveImage(item.url)}
          className="w-full h-full"
        />
      </main>

      {/* Pure Full-Screen Image Lightbox Viewer */}
      <FullScreenImageViewer
        src={activeImage}
        alt="The Skyline Residence Interior Architecture"
        onClose={() => setActiveImage(null)}
      />
    </div>
  );
}
