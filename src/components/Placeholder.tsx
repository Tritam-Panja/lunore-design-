import { Gem } from 'lucide-react';

export function Placeholder({ label = '', src = '', className = '' }: { label?: string; src?: string; className?: string }) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-[#2a2c2d] border border-[rgba(255,255,255,0.1)] ${className}`}>
        <img
          src={src}
          alt={label}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f2122]/60 via-transparent to-transparent" />
      </div>
    );
  }
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-[#2a2c2d] border border-[rgba(255,255,255,0.1)] ${className}`}
    >
      <Gem className="w-8 h-8 text-[#c2a67e]/40" strokeWidth={1} />
      {label && (
        <span className="mt-3 text-[10px] tracking-[0.3em] uppercase text-[#a3a3a3]/60">
          {label}
        </span>
      )}
    </div>
  );
}
