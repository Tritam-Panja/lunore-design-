import React from 'react';

export function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0e0e] text-[#f1eee7] transition-opacity duration-300"
      aria-label="Loading page content"
      role="status"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="w-16 h-16 rounded-full border border-[#c2a67e]/20 animate-ping opacity-30" />
        
        {/* Spinning luxury border */}
        <div className="absolute w-12 h-12 rounded-full border-t-2 border-r border-[#c2a67e] border-b-transparent border-l-transparent animate-spin" />
        
        {/* Center glowing gem diamond */}
        <div className="w-2.5 h-2.5 bg-[#c2a67e] rotate-45 shadow-[0_0_12px_#c2a67e]" />
      </div>

      {/* Brand Label */}
      <div className="mt-6 flex flex-col items-center gap-1.5">
        <span
          className="text-xs tracking-[0.4em] uppercase text-[#c2a67e] font-light"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          LUNORE
        </span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#a3a3a3]/60">
          Loading
        </span>
      </div>
    </div>
  );
}

export default PageLoader;
