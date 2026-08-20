import { Gem } from 'lucide-react';

export function Placeholder({ label = '', src = '', className = '' }: { label?: string; src?: string; className?: string }) {
  if (src) {
    return (
      <div className={`gold-frame relative z-20 overflow-hidden bg-[#181917] border border-[rgba(255,255,255,0.1)] group ${className}`}>
        <img
          src={src}
          alt={label}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0e]/70 via-transparent to-transparent" />
        {/* Gold sweep on hover */}
        <div className="absolute -inset-x-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-[#c2a67e]/20 to-transparent -skew-x-12 transition-all duration-1000 group-hover:translate-x-[400%]" />
        {/* Slide-up caption */}
        {label && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-[#f2f2f2]/90 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 z-[3] whitespace-nowrap">
            {label}
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-[#2a2c2d] border border-[rgba(255,255,255,0.1)] ${className}`}
    >
      <Gem className="w-8 h-8 text-[#c2a67e]/40 spin-slow" strokeWidth={1} />
      {label && (
        <span className="mt-3 text-[10px] tracking-[0.3em] uppercase text-[#a3a3a3]/60">
          {label}
        </span>
      )}
    </div>
  );
}
