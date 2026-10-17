import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ComingSoon() {
  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-between items-center text-white overflow-hidden select-none px-6 py-8 sm:py-12">
      {/* 1. PURE SILK PHOTO BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/images/aurexa-blue-silk.png"
          alt="Lunore Aurexa Silk Background"
          className="w-full h-full object-cover object-center select-none"
        />

        {/* Ultra-subtle luxury ambient vignette & depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50 pointer-events-none" />
      </div>

      {/* Top Specular Edge Line */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#c5a363] to-transparent z-20 opacity-80" />

      {/* 2. TOP BRANDING BAR */}
      <header className="relative z-20 w-full max-w-6xl flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-white/90 hover:text-[#e5ca8a] transition-colors py-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium"
        >
          <ArrowLeft className="w-4 h-4 text-[#c5a363] transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Return Home</span>
        </Link>

        {/* Lunore Brand Wordmark */}
        <div className="flex flex-col items-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          <span
            className="text-lg sm:text-2xl tracking-[0.38em] text-[#ffffff] font-light"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            LUNORE
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.45em] text-[#d4af37] uppercase font-semibold">
            Luxe Decor Studio
          </span>
        </div>

        {/* Space balancer */}
        <div className="w-24 hidden sm:block" />
      </header>

      {/* 3. CENTER HERO: COMING SOON OVER SILK */}
      <main className="relative z-20 flex flex-col items-center justify-center my-auto text-center max-w-3xl px-4">
        {/* Pill Tag */}
        <div className="inline-flex items-center px-5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-[#c5a363]/60 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.4)] mb-6 sm:mb-8 transition-colors">
          <span className="text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#f7f2e7] font-semibold">
            The Haute Stone Pavilion
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#ffffff] font-normal tracking-[0.22em] uppercase mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
          style={{
            fontFamily: 'var(--font-serif)',
            textShadow: '0 4px 28px rgba(0, 0, 0, 0.9), 0 0 35px rgba(197, 163, 99, 0.4)',
          }}
        >
          Coming Soon
        </h1>

        {/* Gold Accent Divider */}
        <div className="w-24 sm:w-36 h-[2px] bg-gradient-to-r from-transparent via-[#c5a363] to-transparent mx-auto mb-10 sm:mb-12 shadow-[0_0_12px_rgba(197,163,99,0.8)]" />

        {/* Return Button */}
        <Link
          to="/"
          className="group relative cursor-pointer inline-flex items-center justify-center gap-3 px-8 sm:px-11 py-3.5 sm:py-4 rounded-full bg-[#07111e]/90 hover:bg-[#0c1a2d] text-[#f7f2e7] font-medium text-xs sm:text-sm tracking-[0.22em] uppercase border border-[#c5a363]/80 shadow-[0_12px_36px_rgba(0,0,0,0.55)] hover:shadow-[0_16px_44px_rgba(0,0,0,0.7)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4 text-[#c5a363] transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Collection</span>
        </Link>
      </main>

      {/* 4. FOOTER */}
      <footer className="relative z-20 text-center">
        <p className="text-[10px] sm:text-xs text-white/75 tracking-[0.3em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">
          &copy; {new Date().getFullYear()} Lunore Luxe Decor Studio &bull; All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

export default ComingSoon;
