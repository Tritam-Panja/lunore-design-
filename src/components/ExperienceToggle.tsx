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
      className={`group relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-1 focus:ring-[#c2a67e]/60 ${
        isExperienceActive
          ? 'bg-[#c2a67e]/15 border-[#c2a67e] text-[#c2a67e] shadow-[0_0_20px_rgba(194,166,126,0.35)]'
          : 'bg-[#2a2c2d]/60 border-[rgba(255,255,255,0.15)] text-[#a3a3a3] hover:border-[#c2a67e]/60 hover:text-[#f2f2f2] hover:bg-[#2a2c2d]'
      } ${className}`}
    >
      {/* Outer subtle halo ring */}
      <span
        className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
          isExperienceActive
            ? 'opacity-100 scale-105 bg-[#c2a67e]/10 blur-sm'
            : 'opacity-0 scale-95'
        }`}
      />

      {/* Icon orb */}
      <span
        className={`relative flex items-center justify-center w-5 h-5 rounded-full transition-all duration-700 ${
          isExperienceActive
            ? 'bg-[#c2a67e] text-[#1f2122] rotate-[360deg] scale-110 shadow-[0_0_12px_rgba(194,166,126,0.8)]'
            : 'bg-[rgba(255,255,255,0.1)] text-[#a3a3a3] group-hover:text-[#c2a67e]'
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
            isExperienceActive ? 'animate-ping bg-[#c2a67e] opacity-75' : 'opacity-0'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 transition-colors duration-700 ${
            isExperienceActive ? 'bg-[#c2a67e]' : 'bg-[rgba(255,255,255,0.3)] group-hover:bg-[#c2a67e]/60'
          }`}
        />
      </span>
    </button>
  );
}
