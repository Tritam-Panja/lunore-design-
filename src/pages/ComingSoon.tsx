import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function ComingSoon() {
  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-between items-center bg-[#070809] text-[#f1eee7] overflow-hidden select-none px-6 py-8 sm:py-12">
      {/* 1. AMBIENT BACKGROUND GLOW & GRID */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Central golden atmosphere glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] rounded-full bg-[radial-gradient(circle,rgba(184,154,98,0.18)_0%,rgba(184,154,98,0.04)_45%,transparent_70%)] blur-[120px] sm:blur-[160px] animate-pulse duration-1000" />
        
        {/* Subtle architectural noise / starlight grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:40px_40px] opacity-35" />

        {/* Deep cinematic vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
      </div>

      {/* Top Specular Edge Line */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#b89a62] to-transparent z-20 opacity-80" />

      {/* 2. TOP BRANDING BAR */}
      <header className="relative z-20 w-full max-w-6xl flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-[#ded9cf]/70 hover:text-[#b89a62] transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4 text-[#b89a62] transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Return Home</span>
        </Link>

        {/* Lunore Brand Wordmark */}
        <div className="flex flex-col items-center">
          <span
            className="text-lg sm:text-xl tracking-[0.35em] text-[#f8f5ee] font-light"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            LUNORE
          </span>
          <span className="text-[8px] tracking-[0.45em] text-[#b89a62] uppercase font-medium">
            Luxe Decor Studio
          </span>
        </div>

        {/* Space balancer */}
        <div className="w-24 hidden sm:block" />
      </header>

      {/* 3. CENTER HERO: ROTATING HOURGLASS & COMING SOON */}
      <main className="relative z-20 flex flex-col items-center justify-center my-auto text-center max-w-2xl px-4">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#b89a62]/35 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-8 sm:mb-10">
          <Sparkles className="w-3.5 h-3.5 text-[#b89a62]" />
          <span className="text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#ded9cf] font-medium">
            The Haute Stone Pavilion
          </span>
        </div>

        {/* Rotating Hourglass Animation Container */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-8 sm:mb-10">
          {/* Outer Orbital Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-[#b89a62]/20 animate-[spin_24s_linear_infinite]" />
          
          {/* Inner Dashed Ring with reverse spin */}
          <div className="absolute inset-2 sm:inset-3 rounded-full border border-dashed border-[#b89a62]/35 animate-[spin_16s_linear_infinite_reverse]" />

          {/* Golden Ambient Aura Behind Hourglass */}
          <div className="absolute w-20 h-20 rounded-full bg-[#b89a62]/30 blur-xl animate-pulse" />

          {/* Continuous Rotating Hourglass SVG */}
          <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center animate-[hourglassFlip_4s_cubic-bezier(0.65,0,0.35,1)_infinite]">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_0_20px_rgba(184,154,98,0.7)]"
            >
              <defs>
                <linearGradient id="glassGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5e0b0" />
                  <stop offset="50%" stopColor="#b89a62" />
                  <stop offset="100%" stopColor="#7a6236" />
                </linearGradient>
                <linearGradient id="sandGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#b89a62" />
                </linearGradient>
              </defs>

              {/* Hourglass Frame Top and Bottom Plates */}
              <rect x="22" y="10" width="56" height="5" rx="2.5" fill="url(#glassGold)" />
              <rect x="22" y="85" width="56" height="5" rx="2.5" fill="url(#glassGold)" />

              {/* Four Support Columns */}
              <line x1="26" y1="15" x2="26" y2="85" stroke="url(#glassGold)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="74" y1="15" x2="74" y2="85" stroke="url(#glassGold)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

              {/* Glass Bulbs Contour */}
              <path
                d="M 30 15 C 30 42, 46 48, 50 50 C 46 52, 30 58, 30 85 L 70 85 C 70 58, 54 52, 50 50 C 54 48, 70 42, 70 15 Z"
                stroke="url(#glassGold)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="rgba(184, 154, 98, 0.05)"
              />

              {/* Top Bulb Sand (emptying) */}
              <path
                d="M 35 24 C 35 34, 45 44, 50 48 C 55 44, 65 34, 65 24 Z"
                fill="url(#sandGlow)"
                opacity="0.85"
              />

              {/* Falling Sand Stream with Glow */}
              <line
                x1="50"
                y1="48"
                x2="50"
                y2="78"
                stroke="url(#sandGlow)"
                strokeWidth="2"
                strokeDasharray="2 3"
                className="animate-pulse"
              />

              {/* Bottom Bulb Sand Pyramid (accumulating) */}
              <path
                d="M 36 82 C 43 82, 46 72, 50 72 C 54 72, 57 82, 64 82 Z"
                fill="url(#sandGlow)"
                opacity="0.95"
              />

              {/* Specular Highlight Streak on Glass */}
              <path
                d="M 33 22 Q 38 35 44 42"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-[0.24em] uppercase mb-4 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Coming Soon
        </h1>

        {/* Gold Divider */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto mb-6" />

        {/* Editorial Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-[#ded9cf]/80 font-light leading-relaxed tracking-wide max-w-lg mx-auto mb-8 sm:mb-10">
          The Aurexa pavilion is currently undergoing architectural curation. Monolithic quarry cuts, rare crystalline slabs, and haute stone experiences are arriving shortly.
        </p>

        {/* Return Button */}
        <Link
          to="/"
          className="group relative cursor-pointer inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 rounded-full bg-gradient-to-r from-[#b89a62] via-[#cfb27b] to-[#b89a62] text-[#0d0e0e] font-semibold text-xs sm:text-sm tracking-[0.22em] uppercase shadow-[0_12px_32px_rgba(184,154,98,0.35)] hover:shadow-[0_16px_45px_rgba(184,154,98,0.55)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4 text-[#0d0e0e] transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Collection</span>
        </Link>
      </main>

      {/* 4. FOOTER NOTE */}
      <footer className="relative z-20 text-center">
        <p className="text-[10px] sm:text-xs text-[#ded9cf]/40 tracking-[0.3em] uppercase">
          &copy; {new Date().getFullYear()} Lunore Luxe Decor Studio &bull; All Rights Reserved
        </p>
      </footer>

      {/* Global CSS animation for continuous flipping hourglass */}
      <style>{`
        @keyframes hourglassFlip {
          0% {
            transform: rotate(0deg);
          }
          40% {
            transform: rotate(180deg);
          }
          50% {
            transform: rotate(180deg);
          }
          90% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default ComingSoon;
