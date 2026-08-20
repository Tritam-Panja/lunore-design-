import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: Record<string, any>) => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
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

    const instance = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      infinite: false,
    });

    lenisRef.current = instance;
    setLenis(instance);

    // Apply lenis class to html root
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    let rafId: number;
    function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
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
