import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: Record<string, any>) => void;
}

const defaultScrollTo = (target: string | HTMLElement) => {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: defaultScrollTo,
});

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;

    const instance = new Lenis({
      duration: isMobile ? 0.85 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: isMobile ? 1.0 : 1.2,
      syncTouch: false,
      infinite: false,
      autoRaf: false,
    });

    lenisRef.current = instance;
    setLenis(instance);

    // Apply lenis class to html root
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    let rafId: number;
    let isPaused = false;

    function raf(time: number) {
      if (!isPaused) {
        instance.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Battery / CPU Saver: Pause RAF loop when browser tab is inactive
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  // Handle hash scrolling on location change
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash;
      const el = document.querySelector(targetId);
      if (el) {
        const timer = setTimeout(() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(el as HTMLElement, { offset: -70 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [location.pathname, location.hash]);

  const scrollTo = (target: string | HTMLElement, options = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el as HTMLElement, { offset: -70, ...options });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
