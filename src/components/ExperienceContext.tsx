import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface ExperienceContextType {
  isExperienceActive: boolean;
  toggleExperience: () => void;
}

const ExperienceContext = createContext<ExperienceContextType>({
  isExperienceActive: false,
  toggleExperience: () => {},
});

export function useExperience() {
  return useContext(ExperienceContext);
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [isExperienceActive, setIsExperienceActive] = useState<boolean>(true);

  const toggleExperience = () => {
    setIsExperienceActive((prev) => !prev);
  };

  useEffect(() => {
    if (isExperienceActive) {
      document.documentElement.classList.add('lunore-experience-active');
    } else {
      document.documentElement.classList.remove('lunore-experience-active');
    }
  }, [isExperienceActive]);

  return (
    <ExperienceContext.Provider value={{ isExperienceActive, toggleExperience }}>
      {children}
    </ExperienceContext.Provider>
  );
}
