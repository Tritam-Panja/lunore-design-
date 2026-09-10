import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { BrandStoryExpanded } from '@/components/BrandStoryExpanded';

export function BrandStory() {
  return (
    <div className="bg-[#0d0e0e] text-white relative overflow-hidden min-h-screen">
      {/* Ambient Top Glows (No Photos) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#b89a62]/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Return Navigation */}
      <div className="pt-28 sm:pt-36 max-w-5xl mx-auto px-4 text-center relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#b89a62]/60 text-xs tracking-[0.25em] uppercase text-white hover:text-[#e6cb97] transition-all duration-300"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-[#b89a62]" />
          <span>Return to Home</span>
        </Link>
      </div>

      {/* Complete Animated Brand Story Experience */}
      <BrandStoryExpanded showCloseButton={false} />
    </div>
  );
}
