import React from 'react';
import { useExperience } from './ExperienceContext';
import { Sparkles } from 'lucide-react';

interface ExperienceToggleProps {
  className?: string;
  variant?: 'header' | 'floating';
}

export function ExperienceToggle({ className = '', variant = 'header' }: ExperienceToggleProps) {
  const { isExperienceActive, toggleExperience } = useExperience();

  return (
    <button
      type="button"
      onClick={toggleExperience}
      aria-pressed={isExperienceActive}
      aria-label="Toggle Lunore Atmosphere Experience"
      className={`group relative inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 sm:py-2 min-h-[38px] sm:min-h-[42px] rounded-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus:ring-1 focus:ring-[#b89a62]/60 active:scale-95 cursor-pointer touch-manipulation select-none backdrop-blur-xl ${
        isExperienceActive
          ? 'bg-[#b89a62]/20 border-[#b89a62] text-[#f1eee7] shadow-[0_0_25px_rgba(184,154,98,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.4)]'
          : 'bg-black/40 border-white/20 text-[#b9b5ae] hover:border-[#b89a62]/60 hover:text-[#f1eee7] hover:bg-black/60 shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
      } ${className}`}
    >
      {/* Outer subtle halo ring */}
      <span
        className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
          isExperienceActive
            ? 'opacity-100 scale-105 bg-[#b89a62]/15 blur-sm'
            : 'opacity-0 scale-95'
        }`}
      />

      {/* Icon orb */}
      <span
        className={`relative flex items-center justify-center w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full transition-all duration-500 flex-shrink-0 ${
          isExperienceActive
            ? 'bg-[#b89a62] text-white rotate-[180deg] scale-105 shadow-[0_0_12px_rgba(184,154,98,0.7)]'
            : 'bg-white/10 text-[#b89a62] group-hover:text-white group-hover:bg-[#b89a62]/30'
        }`}
      >
        <Sparkles
          className={`w-3 h-3 transition-transform duration-300 ${
            isExperienceActive ? 'scale-100' : 'scale-90 opacity-90'
          }`}
          strokeWidth={1.75}
        />
      </span>

      {/* Responsive Label text */}
      <span className="relative text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-medium whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
        <span className="inline sm:hidden">
          {isExperienceActive ? 'Atmosphere On' : 'Atmosphere'}
        </span>
        <span className="hidden sm:inline">
          {isExperienceActive ? 'Lunore Atmosphere' : 'Enter Atmosphere'}
        </span>
      </span>

      {/* Active pulse dot */}
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <span
          className={`absolute inline-flex h-full w-full rounded-full transition-opacity duration-500 ${
            isExperienceActive ? 'animate-ping bg-[#b89a62] opacity-80' : 'opacity-0'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 transition-colors duration-500 ${
            isExperienceActive ? 'bg-[#b89a62]' : 'bg-white/30 group-hover:bg-[#b89a62]/70'
          }`}
        />
      </span>
    </button>
  );
}
