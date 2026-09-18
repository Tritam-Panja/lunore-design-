import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import ScrollShowcase from '@/components/ScrollShowcase';
import FullScreenImageViewer from '@/components/FullScreenImageViewer';

const ENGAWA_IMAGES = [
  {
    id: 1,
    url: '/assets/THE%20ENGAWA%20LINE/1.jpg',
    title: 'The Continuous Birch Datum',
    category: 'Spatial Spine',
    tag: 'The Engawa Line 01',
    desc: 'One continuous raised platform of pale birch wood threading living, dining, and rest without divisive partitions.',
    index: '01 / 07',
  },
  {
    id: 2,
    url: '/assets/THE%20ENGAWA%20LINE/2.jpg',
    title: 'Black Steel Spatial Partition',
    category: 'Threshold Craft',
    tag: 'The Engawa Line 02',
    desc: 'An open-frame blackened steel shelf standing in for a traditional door, allowing light and shadow to filter through.',
    index: '02 / 07',
  },
  {
    id: 3,
    url: '/assets/THE%20ENGAWA%20LINE/3.jpg',
    title: 'Architectural Light & Shadow',
    category: 'Material Dialogue',
    tag: 'The Engawa Line 03',
    desc: 'Fior di Bosco stone counter rooted against smooth smoked birch surfaces with subtle recessed illumination.',
    index: '03 / 07',
  },
  {
    id: 4,
    url: '/assets/THE%20ENGAWA%20LINE/4.jpg',
    title: 'Living Platform & Transition',
    category: 'Elevated Flow',
    tag: 'The Engawa Line 04',
    desc: 'Designed around the pause between spaces: fewer boundaries, more light, and natural material warmth.',
    index: '04 / 07',
  },
  {
    id: 5,
    url: '/assets/THE%20ENGAWA%20LINE/5.jpg',
    title: 'Bespoke Joinery Suite',
    category: 'Minimalist Detail',
    tag: 'The Engawa Line 05',
    desc: 'Tailored pale timber cabinetry integrating concealed storage and precise Japanese joinery techniques.',
    index: '05 / 07',
  },
  {
    id: 6,
    url: '/assets/THE%20ENGAWA%20LINE/6.jpg',
    title: 'The Evening Rest Sanctuary',
    category: 'Quiet Retreat',
    tag: 'The Engawa Line 06',
    desc: 'Soft twilight shadows reminding you of the evening calm, enveloped in warm acoustic wood panelling.',
    index: '06 / 07',
  },
  {
    id: 7,
    url: '/assets/THE%20ENGAWA%20LINE/7.jpg',
    title: 'Meditative Living Perspective',
    category: 'Harmonious Synthesis',
    tag: 'The Engawa Line 07',
    desc: 'A complete architectural whole that honors quiet space, natural grain, and mindful everyday living.',
    index: '07 / 07',
  },
];

export function TheEngawaLine() {
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
            Project 01 / Japanese Minimalist Spine
          </span>
          <h1
            className="text-xs sm:text-base md:text-lg font-normal text-white tracking-wide leading-tight truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The Engawa Line
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
          items={ENGAWA_IMAGES}
          projectTitle="The Engawa Line"
          projectTag="Project 01 / Japanese Minimalist Spine"
          nextProject={{ title: 'Amber & Olive', path: '/amber-and-olive' }}
          onItemClick={(item) => setActiveImage(item.url)}
          className="w-full h-full"
        />
      </main>

      {/* Pure Full-Screen Image Lightbox Viewer */}
      <FullScreenImageViewer
        src={activeImage}
        alt="The Engawa Line Interior Architecture"
        onClose={() => setActiveImage(null)}
      />
    </div>
  );
}
