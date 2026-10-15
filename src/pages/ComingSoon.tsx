import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ComingSoon() {
  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-between items-center text-[#171513] overflow-hidden select-none px-6 py-8 sm:py-12">
      {/* 1. PURE SILK PHOTO BACKGROUND - NO DARK OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/images/coming-soon-silk-bg.jpg"
          alt="Lunore Haute Silk Background"
          className="w-full h-full object-cover object-center select-none"
        />

        {/* Ultra-subtle luxury ambient warmth (zero black tint) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Top Specular Edge Line */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#b89a62] to-transparent z-20 opacity-80" />

      {/* 2. TOP BRANDING BAR */}
      <header className="relative z-20 w-full max-w-6xl flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-[#1d1a16]/85 hover:text-[#967437] transition-colors py-2 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] font-medium"
        >
          <ArrowLeft className="w-4 h-4 text-[#967437] transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Return Home</span>
        </Link>

        {/* Lunore Brand Wordmark */}
        <div className="flex flex-col items-center drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
          <span
            className="text-lg sm:text-2xl tracking-[0.38em] text-[#141210] font-light"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            LUNORE
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.45em] text-[#8c6b32] uppercase font-semibold">
            Luxe Decor Studio
          </span>
        </div>

        {/* Space balancer */}
        <div className="w-24 hidden sm:block" />
      </header>

      {/* 3. CENTER HERO: COMING SOON OVER SILK */}
      <main className="relative z-20 flex flex-col items-center justify-center my-auto text-center max-w-3xl px-4">
        {/* Pill Tag */}
        <div className="inline-flex items-center px-5 py-1.5 rounded-full bg-white/70 hover:bg-white/85 border border-[#b89a62]/50 backdrop-blur-md shadow-[0_8px_20px_rgba(184,154,98,0.15)] mb-6 sm:mb-8 transition-colors">
          <span className="text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#2c2419] font-semibold">
            The Haute Stone Pavilion
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#121110] font-normal tracking-[0.22em] uppercase mb-6 drop-shadow-[0_2px_12px_rgba(255,255,255,0.7)]"
          style={{
            fontFamily: 'var(--font-serif)',
            textShadow: '0 2px 18px rgba(255, 255, 255, 0.85), 0 1px 3px rgba(0, 0, 0, 0.25)',
          }}
        >
          Coming Soon
        </h1>

        {/* Gold Accent Divider */}
        <div className="w-24 sm:w-36 h-[2px] bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto mb-10 sm:mb-12 shadow-[0_0_8px_rgba(184,154,98,0.6)]" />

        {/* Return Button */}
        <Link
          to="/"
          className="group relative cursor-pointer inline-flex items-center justify-center gap-3 px-8 sm:px-11 py-3.5 sm:py-4 rounded-full bg-[#141312] hover:bg-[#23201d] text-[#f7f2e7] font-medium text-xs sm:text-sm tracking-[0.22em] uppercase border border-[#b89a62]/70 shadow-[0_12px_32px_rgba(0,0,0,0.28)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4 text-[#cfb27b] transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Collection</span>
        </Link>
      </main>

      {/* 4. FOOTER */}
      <footer className="relative z-20 text-center">
        <p className="text-[10px] sm:text-xs text-[#2b2620]/75 tracking-[0.3em] uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] font-medium">
          &copy; {new Date().getFullYear()} Lunore Luxe Decor Studio &bull; All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

export default ComingSoon;
