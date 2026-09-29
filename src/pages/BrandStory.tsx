import { BrandStoryExpanded } from '@/components/BrandStoryExpanded';
import { ReturnToHome } from '@/components/ReturnToHome';

export function BrandStory() {
  return (
    <div className="bg-[#0d0e0e] text-white relative overflow-hidden min-h-screen">
      {/* Ambient Top Glows (No Photos) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#b89a62]/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Return Navigation */}
      <ReturnToHome />

      {/* Complete Animated Brand Story Experience */}
      <BrandStoryExpanded showCloseButton={false} />
    </div>
  );
}
