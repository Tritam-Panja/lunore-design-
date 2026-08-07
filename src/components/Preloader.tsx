import { useEffect, useState } from 'react';

const LUNORE_LETTERS = ['L', 'U', 'N', 'O', 'R', 'E'];

export function Preloader() {
  const [phase, setPhase] = useState<'loading' | 'opening' | 'done'>('loading');
  const opened = phase === 'opening';

  useEffect(() => {
    // Lock page scroll while preloader is showing
    document.body.style.overflow = 'hidden';

    const openTimer = window.setTimeout(() => setPhase('opening'), 2000);
    const doneTimer = window.setTimeout(() => setPhase('done'), 3500);

    return () => {
      document.body.style.overflow = '';
      window.clearTimeout(openTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    // Release scroll lock when preloader finishes
    if (phase === 'done') {
      document.body.style.overflow = '';
    }
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div className="fixed inset-0 z-[999]" aria-hidden="true">
      {/* Center content — above the gates so LUNORE stays visible while closed */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ease-out ${
          opened ? 'opacity-0 -translate-y-8 scale-[0.98]' : 'opacity-100'
        }`}
      >
        {/* LUNORE letters */}
        <div className="flex items-baseline">
          {LUNORE_LETTERS.map((letter, i) => (
            <span
              key={i}
              className={`font-[var(--font-heading)] text-5xl sm:text-6xl md:text-7xl tracking-[0.18em] uppercase ${
                i === 2 ? 'text-[#c2a67e]' : 'text-[#f2f2f2]'
              }`}
              style={{
                animation: `preloader-letter 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${0.15 + i * 0.09}s both`,
                ...(i === 2 ? { animationName: 'preloader-letter, preloader-n-glow' } : {}),
                animationDuration: '0.7s, 2.4s',
                animationDelay: `${0.15 + i * 0.09}s, 0.8s`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <span
          className="mt-3 ml-[0.25em] text-[10px] sm:text-xs tracking-[0.5em] uppercase text-[#a3a3a3]"
          style={{ animation: 'preloader-tagline 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1s both' }}
        >
          Luxe Decor Studio
        </span>

        {/* Gold underline */}
        <div
          className="mt-6 h-px w-52 sm:w-64 bg-gradient-to-r from-transparent via-[#c2a67e] to-transparent"
          style={{ animation: 'preloader-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.25s both' }}
        />
      </div>

      {/* Left gate */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-[#191b1c] border-r border-[#c2a67e]/70 transition-transform duration-[1200ms] ease-[cubic-bezier(0.77,0,0.18,1)] ${
          opened ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Gold edge accent on the gate seam */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#c2a67e]/90 to-transparent" />
      </div>

      {/* Right gate */}
      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-[#191b1c] border-l border-[#c2a67e]/70 transition-transform duration-[1200ms] ease-[cubic-bezier(0.77,0,0.18,1)] ${
          opened ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Gold edge accent on the gate seam */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#c2a67e]/90 to-transparent" />
      </div>
    </div>
  );
}
