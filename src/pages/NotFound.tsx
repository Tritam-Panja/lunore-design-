import { ReturnToHome } from '@/components/ReturnToHome';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0e0e] text-[#f1eee7] flex flex-col items-center">
      <ReturnToHome />
      <div className="px-6 pt-12 pb-32 text-center">
        <h1 className="text-6xl font-light text-[#b89a62] mb-4">404</h1>
        <p className="text-base text-[#b9b5ae] mb-8 font-light">This page could not be found.</p>
      </div>
    </div>
  );
}
