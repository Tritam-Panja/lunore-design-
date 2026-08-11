import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { PreloaderMoonCanvas } from './PreloaderMoonCanvas';

const BRAND_LETTERS = ['L', 'U', 'N', 'O', 'R', 'E'];

const FULL_LINES = [
  'ARE YOU READY',
  'TO EXPERIENCE',
  'SOMETHING NEW?'
];

export function Preloader() {
  // Status phases: 'reveal' -> 'ready' (CTA appears) -> 'transitioning' (Moon approach) -> 'brandReveal' (Stage 6 LUNORE reveal inside crater) -> 'opening' (Stage 7 subtle fade/recede into site) -> 'done'
  const [phase, setPhase] = useState<'reveal' | 'ready' | 'transitioning' | 'brandReveal' | 'opening' | 'done'>('reveal');
  const [btnClicked, setBtnClicked] = useState(false);
  const [showButton, setShowButton] = useState<boolean>(false);

  // Typewriter state variables
  const [typed0, setTyped0] = useState('');
  const [typed1, setTyped1] = useState('');
  const [typed2, setTyped2] = useState('');
  const [activeLine, setActiveLine] = useState(0); // 0, 1, 2, or 3 (complete)

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    // Lock page scroll during cinematic entry
    document.body.style.overflow = 'hidden';

    let isCancelled = false;

    // Typewriter effect function
    const typeLine = (
      fullText: string,
      setTypedText: React.Dispatch<React.SetStateAction<string>>,
      onComplete: () => void
    ) => {
      let currentLength = 0;
      const typeInterval = setInterval(() => {
        if (isCancelled) {
          clearInterval(typeInterval);
          return;
        }
        currentLength++;
        setTypedText(fullText.substring(0, currentLength));

        if (currentLength >= fullText.length) {
          clearInterval(typeInterval);
          onComplete();
        }
      }, 90); // typing speed per character
    };

    // Sequential Typing Timeline:
    // Line 0 -> 400ms pause -> Line 1 -> 450ms pause -> Line 2 -> 700ms hold -> CTA button
    const startTypewriterSequence = () => {
      typeLine(FULL_LINES[0], setTyped0, () => {
        if (isCancelled) return;
        const t1 = window.setTimeout(() => {
          setActiveLine(1);
          typeLine(FULL_LINES[1], setTyped1, () => {
            if (isCancelled) return;
            const t2 = window.setTimeout(() => {
              setActiveLine(2);
              typeLine(FULL_LINES[2], setTyped2, () => {
                if (isCancelled) return;
                setActiveLine(3); // Completed typing

                const t3 = window.setTimeout(() => {
                  setShowButton(true);
                  setPhase('ready');
                }, 700);
                timersRef.current.push(t3);
              });
            }, 450);
            timersRef.current.push(t2);
          });
        }, 400);
        timersRef.current.push(t1);
      });
    };

    startTypewriterSequence();

    return () => {
      isCancelled = true;
      document.body.style.overflow = '';
      timersRef.current.forEach((t) => window.clearTimeout(t));
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
    // 4.2s-7.2s: LUNORE Brand Reveal + LUXE DECOR STUDIO in crater darkness (Hold logo)
    // 7.2s-8.8s: Stage 7 subtle fade and recede of preloader layer to seamlessly reveal website
    // 8.8s: Entry complete ('done'), unmasking website completely and restoring full scroll & interaction
    const brandTimer = window.setTimeout(() => setPhase('brandReveal'), 8500);
    const fadeTimer = window.setTimeout(() => setPhase('opening'), 11500);
    const doneTimer = window.setTimeout(() => setPhase('done'), 13000);

    timersRef.current.push(brandTimer, fadeTimer, doneTimer);
  };

  if (phase === 'done') return null;

  const isTransitioning = phase === 'transitioning';
  const isBrandReveal = phase === 'brandReveal';
  const isOpening = phase === 'opening';

  return (
    <div
      className={`fixed inset-0 z-[9999] select-none transition-all duration-[1400ms] ease-out ${
        isOpening
          ? 'opacity-0 scale-105 pointer-events-none'
          : phase === 'reveal' || phase === 'ready'
          ? 'opacity-100 scale-100 bg-[#0d0e0e]'
          : 'opacity-100 scale-100 bg-[#040404]'
      }`}
      aria-hidden={isOpening}
    >
      <style>{`
        @keyframes luxury-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-luxury-blink {
          animation: luxury-blink 1.0s step-end infinite;
        }
      `}</style>

      {/* 3D Cinematic Preloader Moon Canvas (Stage 4 & 5 Shots 1, 2 & 3 + Crater Entry) */}
      <PreloaderMoonCanvas active={isTransitioning || isOpening || isBrandReveal} />

      {/* INTRO TITLE CARD CONTAINER */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-8 transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.18,1)] ${
          isOpening || isBrandReveal
            ? 'opacity-0 scale-95 pointer-events-none'
            : isTransitioning
              ? 'opacity-20 scale-98 pointer-events-none'
              : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center max-w-4xl sm:max-w-5xl w-full min-h-[220px] sm:min-h-[300px] relative space-y-4 md:space-y-6">
          
          {/* LINE 1: ARE YOU READY */}
          <div 
            className="w-full relative flex items-center justify-center min-h-[3rem] sm:min-h-[4.5rem]"
            style={{
              fontFamily: "var(--font-display), 'Cormorant Garamond', 'Playfair Display', serif",
              fontWeight: 300,
              letterSpacing: '0.12em',
              color: '#f1eee7',
            }}
          >
            {/* Invisible structural layer enforces strict layout stability */}
            <span className="invisible text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.12em] select-none">
              {FULL_LINES[0]}
            </span>
            <span className="absolute left-0 right-0 text-center text-4xl sm:text-5xl md:text-6xl uppercase whitespace-nowrap">
              {typed0}
              {activeLine === 0 && (
                <span className="inline-block w-[1.5px] h-[0.9em] bg-[#b89a62] ml-2 align-middle animate-luxury-blink" />
              )}
            </span>
          </div>

          {/* LINE 2: TO EXPERIENCE */}
          <div 
            className="w-full relative flex items-center justify-center min-h-[2.5rem] sm:min-h-[3.8rem]"
            style={{
              fontFamily: "var(--font-display), 'Cormorant Garamond', 'Playfair Display', serif",
              fontWeight: 300,
              letterSpacing: '0.12em',
              color: '#f1eee7',
            }}
          >
            <span className="invisible text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.12em] select-none">
              {FULL_LINES[1]}
            </span>
            <span className="absolute left-0 right-0 text-center text-3xl sm:text-4xl md:text-5xl uppercase whitespace-nowrap">
              {typed1}
              {activeLine === 1 && (
                <span className="inline-block w-[1.5px] h-[0.9em] bg-[#b89a62] ml-2 align-middle animate-luxury-blink" />
              )}
            </span>
          </div>

          {/* LINE 3: SOMETHING NEW? */}
          <div 
            className="w-full relative flex items-center justify-center min-h-[3rem] sm:min-h-[4.5rem]"
            style={{
              fontFamily: "var(--font-display), 'Cormorant Garamond', 'Playfair Display', serif",
              fontWeight: 300,
              letterSpacing: '0.12em',
              color: '#f1eee7',
            }}
          >
            <span className="invisible text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.12em] select-none">
              {FULL_LINES[2]}
            </span>
            <span className="absolute left-0 right-0 text-center text-4xl sm:text-5xl md:text-6xl uppercase whitespace-nowrap">
              {typed2}
              {activeLine === 2 && (
                <span className="inline-block w-[1.5px] h-[0.9em] bg-[#b89a62] ml-2 align-middle animate-luxury-blink" />
              )}
              {activeLine === 3 && (
                <span className="inline-block w-[1.5px] h-[0.9em] bg-[#b89a62] ml-2 align-middle animate-luxury-blink" />
              )}
            </span>
          </div>

        </div>

        {/* Minimal Underline Accent */}
        <div
          className={`mt-6 sm:mt-8 h-px w-28 sm:w-40 bg-gradient-to-r from-transparent via-[#b89a62]/60 to-transparent transition-opacity duration-1000 ${
            showButton ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* EDITORIAL CTA INVITATION ("CLICK HERE") */}
        <div
          className={`mt-8 sm:mt-10 transition-all duration-700 ease-out ${
            showButton && phase === 'ready' && !btnClicked
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={handleActivateClick}
            className="group relative inline-flex items-center gap-3 px-8 py-3 rounded-full border border-[rgba(184,154,98,0.35)] bg-[#141514]/80 backdrop-blur-md text-[#f1eee7] text-xs tracking-[0.3em] uppercase transition-all duration-500 hover:border-[#b89a62] hover:text-[#b89a62] hover:bg-[#181917] hover:px-9 focus:outline-none focus:ring-1 focus:ring-[#b89a62]/50 cursor-pointer shadow-lg shadow-black/40"
          >
            <span className="relative z-10 font-light">CLICK HERE</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#b89a62] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* STAGE 6 & 7 — LUNORE BRAND REVEAL IN CRATER DARKNESS + SEAMLESS FADE/RECEDE */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6 transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.18,1)] ${
          isBrandReveal || isOpening
            ? isOpening
              ? 'opacity-0 scale-110 blur-sm'
              : 'opacity-100 scale-100 blur-none'
            : 'opacity-0 scale-95'
        }`}
      >
        {/* Expanding Champagne Gold Line */}
        <div
          className="h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mb-8 transition-all duration-1000"
          style={{
            animation: isBrandReveal || isOpening ? 'preloader-line 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' : undefined,
            width: isBrandReveal || isOpening ? '240px' : '0px',
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
    </div>
  );
}
