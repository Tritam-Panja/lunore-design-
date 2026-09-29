import { SculpturesExperience } from '@/components/SculpturesExperience';

export function SculpturesCarousel() {
  return (
    <div className="w-full h-[100dvh] overflow-hidden bg-[#070809] text-[#f1eee7]">
      <SculpturesExperience initialState="carousel" isStandalonePage={true} />
    </div>
  );
}
