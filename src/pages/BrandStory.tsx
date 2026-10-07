import { BrandStoryExpanded } from '@/components/BrandStoryExpanded';
import { ReturnToHome } from '@/components/ReturnToHome';

export function BrandStory() {
  return (
    <div className="bg-[#0d0e0e] text-white relative min-h-screen">
      {/* Ambient Top Glows (No Photos) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(184,154,98,0.12)_0%,rgba(184,154,98,0.03)_40%,transparent_70%)] pointer-events-none" />

      {/* Return Navigation */}
      <ReturnToHome />

      {/* Complete Animated Brand Story Experience */}
      <BrandStoryExpanded showCloseButton={false} />
    </div>
  );
}
