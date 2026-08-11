import React from 'react';
import { useExperience } from './ExperienceContext';
import { Sparkles, Moon, Sun } from 'lucide-react';

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
      className={`group relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-1 focus:ring-[#b89865]/60 ${
        isExperienceActive
          ? 'bg-[#b89865]/15 border-[#b89865] text-[#b89865] shadow-[0_0_20px_rgba(184,152,101,0.35)]'
          : 'bg-[#ffffff]/80 border-[rgba(184,152,101,0.25)] text-[#6e7275] hover:border-[#b89865]/60 hover:text-[#222426] hover:bg-[#ffffff]'
      } ${className}`}
    >
      {/* Outer subtle halo ring */}
      <span
        className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
          isExperienceActive
            ? 'opacity-100 scale-105 bg-[#b89865]/10 blur-sm'
            : 'opacity-0 scale-95'
        }`}
      />

      {/* Icon orb */}
      <span
        className={`relative flex items-center justify-center w-5 h-5 rounded-full transition-all duration-700 ${
          isExperienceActive
            ? 'bg-[#b89865] text-[#f9f8f3] rotate-[360deg] scale-110 shadow-[0_0_12px_rgba(184,152,101,0.6)]'
            : 'bg-[rgba(184,152,101,0.1)] text-[#6e7275] group-hover:text-[#b89865]'
        }`}
      >
        <Sparkles
          className={`w-3 h-3 transition-transform duration-500 ${
            isExperienceActive ? 'scale-100' : 'scale-90 opacity-80'
          }`}
          strokeWidth={1.75}
        />
      </span>

      {/* Label text */}
      <span className="relative text-[10px] tracking-[0.25em] uppercase font-light whitespace-nowrap">
        {isExperienceActive ? 'Lunore Atmosphere' : 'Enter Atmosphere'}
      </span>

      {/* Active pulse dot */}
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={`absolute inline-flex h-full w-full rounded-full transition-opacity duration-700 ${
            isExperienceActive ? 'animate-ping bg-[#b89865] opacity-75' : 'opacity-0'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 transition-colors duration-700 ${
            isExperienceActive ? 'bg-[#b89865]' : 'bg-[rgba(184,152,101,0.3)] group-hover:bg-[#b89865]/60'
          }`}
        />
      </span>
    </button>
  );
}
