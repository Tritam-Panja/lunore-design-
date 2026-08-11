import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PreloaderMoonCanvas } from './PreloaderMoonCanvas';

const INTRO_LINES = [
  { line: 'ARE YOU READY', delay: '0.3s' },
  { line: 'TO EXPERIENCE', delay: '0.85s' },
  { line: 'SOMETHING NEW?', delay: '1.4s', highlight: true },
];

const BRAND_LETTERS = ['L', 'U', 'N', 'O', 'R', 'E'];

export function Preloader() {
  // Status phases: 'reveal' -> 'ready' (CTA appears) -> 'transitioning' (Moon approach) -> 'brandReveal' (Stage 6 LUNORE reveal inside crater) -> 'opening' -> 'done'
  const [phase, setPhase] = useState<'reveal' | 'ready' | 'transitioning' | 'brandReveal' | 'opening' | 'done'>('reveal');
  const [btnClicked, setBtnClicked] = useState(false);

  useEffect(() => {
    // Lock page scroll during cinematic entry
    document.body.style.overflow = 'hidden';

    // Timer to enable CTA after text reveal completes (2.1s)
    const readyTimer = window.setTimeout(() => {
      setPhase('ready');
    }, 2100);

    return () => {
      document.body.style.overflow = '';
      window.clearTimeout(readyTimer);
    };
  }, []);

  useEffect(() => {
    if (phase === 'done') {
      document.body.style.overflow = '';
    }
  }, [phase]);

  const handleActivateClick = () => {
    if (phase !== 'ready' || btnClicked) return;
    setBtnClicked(true);
    setPhase('transitioning');

    // STAGE 7 Complete Timeline:
    // 0s-4.2s: Shot 1, 2, 3 3D Moon Orbit & Camera Crater Entry into darkness
    // 4.2s-7.2s: LUNORE Brand Reveal + LUXE DECOR STUDIO in crater darkness
    // 7.2s-8.4s: Hold logo briefly & begin subtle fade/recede
    // 8.4s-9.6s: Split gates slide open, unmasking the dark graphite LUNORE website
    const brandTimer = window.setTimeout(() => setPhase('brandReveal'), 4200);
    const fadeTimer = window.setTimeout(() => setPhase('opening'), 7200);
    const doneTimer = window.setTimeout(() => setPhase('done'), 8600);

    return () => {
      window.clearTimeout(brandTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  };

  if (phase === 'done') return null;

  const isTransitioning = phase === 'transitioning';
  const isBrandReveal = phase === 'brandReveal';
  const isOpening = phase === 'opening';

  return (
    <div
      className={`fixed inset-0 z-[999] bg-[#0d0e0e] overflow-hidden select-none transition-colors duration-1000 ${
        isTransitioning || isBrandReveal ? 'bg-[#040404]' : 'bg-[#0d0e0e]'
      }`}
      aria-hidden="true"
    >
      {/* 3D Cinematic Preloader Moon Canvas (Stage 4 & 5 Shots 1, 2 & 3 + Crater Entry) */}
      <PreloaderMoonCanvas active={isTransitioning || isOpening || isBrandReveal} />

      {/* STAGE 2 & 3 CONTENT CONTAINER (Initial Text + CLICK HERE CTA) */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-6 transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.18,1)] ${
          isOpening || isBrandReveal
            ? 'opacity-0 scale-95 pointer-events-none'
            : isTransitioning
              ? 'opacity-20 scale-98 pointer-events-none'
              : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 max-w-3xl">
          {INTRO_LINES.map((item, index) => (
            <div key={index} className="overflow-hidden py-1">
              <h2
                className={`font-light tracking-[0.25em] uppercase text-2xl sm:text-4xl md:text-5xl lg:text-6xl transition-all duration-700 ${
                  item.highlight ? 'text-[#b89a62]' : 'text-[#f1eee7]'
                }`}
                style={{
                  fontFamily: 'var(--font-display)',
                  animation: `cinematic-line-mask 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${item.delay} both`,
                }}
              >
                {item.line}
              </h2>
            </div>
          ))}
        </div>

        {/* Minimal Underline Accent */}
        <div
          className="mt-8 sm:mt-10 h-px w-32 sm:w-48 bg-gradient-to-r from-transparent via-[#b89a62]/60 to-transparent"
          style={{ animation: 'preloader-line 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.9s both' }}
        />

        {/* STAGE 3 — EDITORIAL CTA INVITATION ("CLICK HERE") */}
        <div
          className={`mt-10 sm:mt-12 transition-all duration-700 ease-out ${
            phase === 'reveal'
              ? 'opacity-0 translate-y-4 pointer-events-none'
              : btnClicked
                ? 'opacity-0 scale-90 translate-y-2 pointer-events-none'
                : 'opacity-100 translate-y-0 pointer-events-auto'
          }`}
          style={{ animation: phase === 'ready' ? 'fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' : undefined }}
        >
          <button
            type="button"
            onClick={handleActivateClick}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-[rgba(184,154,98,0.35)] bg-[#141514]/80 backdrop-blur-md text-[#f1eee7] text-xs tracking-[0.3em] uppercase transition-all duration-500 hover:border-[#b89a62] hover:text-[#b89a62] hover:bg-[#181917] hover:px-9 focus:outline-none focus:ring-1 focus:ring-[#b89a62]/50 cursor-pointer shadow-lg shadow-black/40"
          >
            <span className="relative z-10 font-light">CLICK HERE</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#b89a62] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* STAGE 6 — LUNORE BRAND REVEAL IN CRATER DARKNESS */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6 transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.18,1)] ${
          isBrandReveal && !isOpening
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-98'
        }`}
      >
        {/* Expanding Champagne Gold Line */}
        <div
          className="h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mb-8 transition-all duration-1000"
          style={{
            animation: isBrandReveal ? 'preloader-line 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' : undefined,
            width: isBrandReveal ? '240px' : '0px',
          }}
        />

        {/* Masked LUNORE Display Wordmark */}
        <div className="flex items-baseline mb-4">
          {BRAND_LETTERS.map((letter, i) => (
            <span
              key={i}
              className={`text-5xl sm:text-7xl md:text-8xl tracking-[0.22em] uppercase font-light ${
                i === 2 ? 'text-[#b89a62]' : 'text-[#f1eee7]'
              }`}
              style={{
                fontFamily: 'var(--font-display)',
                animation: isBrandReveal ? `cinematic-line-mask 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.1}s both` : undefined,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* LUXE DECOR STUDIO Subtitle */}
        <span
          className="text-xs sm:text-sm tracking-[0.55em] uppercase text-[#b9b5ae] font-light"
          style={{
            animation: isBrandReveal ? 'fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both' : undefined,
          }}
        >
          Luxe Decor Studio
        </span>
      </div>

      {/* Left gate */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-[#0d0e0e] border-r border-[#b89a62]/30 transition-transform duration-[1200ms] ease-[cubic-bezier(0.77,0,0.18,1)] ${
          isOpening ? '-translate-x-full' : 'translate-x-0'
        }`}
      />

      {/* Right gate */}
      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-[#0d0e0e] border-l border-[#b89a62]/30 transition-transform duration-[1200ms] ease-[cubic-bezier(0.77,0,0.18,1)] ${
          isOpening ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
    </div>
  );
}
