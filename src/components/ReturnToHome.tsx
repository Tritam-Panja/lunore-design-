import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface ReturnToHomeProps {
  className?: string;
}

export function ReturnToHome({ className = '' }: ReturnToHomeProps) {
  return (
    <div className={`pt-24 sm:pt-32 pb-4 text-center relative z-20 ${className}`}>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/15 hover:border-[#b89a62]/60 text-xs tracking-[0.25em] uppercase text-white hover:text-[#e6cb97] transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(184,154,98,0.25)] active:scale-95 group cursor-pointer select-none"
      >
        <ChevronLeft className="w-3.5 h-3.5 text-[#b89a62] group-hover:-translate-x-0.5 transition-transform" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
